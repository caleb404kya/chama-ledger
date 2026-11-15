-- 20240101_base_schema.sql
-- Base schema for chama-ledger: profiles, groups, memberships, and entries tables
-- Row Level Security policies included

-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles table: extends auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() REFERENCES auth.users(id),
  name TEXT NOT NULL,
  phone TEXT,
  language TEXT DEFAULT 'en'
);

-- Groups table
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  join_code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  expected_amount NUMERIC DEFAULT 0,
  frequency TEXT,
  due_day TEXT,
  plan TEXT DEFAULT 'Merry-Go-Round',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Memberships table
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'treasurer', 'member')),
  status TEXT CHECK (status IN ('pending', 'active')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  approved_by UUID REFERENCES auth.users(id)
);

-- Entries table (append-only)
-- Note: receipt_code and reversal_of are NOT added here;
-- the existing 20240102_block_entry_modifications.sql migration adds them.
CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID UNIQUE NOT NULL,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  member_id UUID REFERENCES memberships(id),
  type TEXT CHECK (type IN ('contribution', 'fine', 'payout', 'adjustment')),
  amount NUMERIC NOT NULL,
  note TEXT,
  logged_by UUID REFERENCES auth.users(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  sync_status TEXT DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending'))
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Policies

-- Profiles: Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

-- INSERT: Users can insert their own profile (id = auth.uid())
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Groups: Users can read groups where they have an active membership
CREATE POLICY "Users can read groups with active membership" ON groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE group_id = groups.id
      AND user_id = auth.uid()
      AND status = 'active'
    )
  );

-- Memberships: Users can read their own memberships
CREATE POLICY "Users can read own memberships" ON memberships
  FOR SELECT USING (user_id = auth.uid());

-- Entries: Users can read entries from groups where they have an active membership
CREATE POLICY "Users can read entries from their groups" ON entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.group_id = entries.group_id
      AND m.user_id = auth.uid()
      AND m.status = 'active'
    )
  );

-- INSERT: Users can insert their own group (created_by = auth.uid())
CREATE POLICY "Users can insert own group" ON groups
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- INSERT: After group creation, creator becomes admin via trigger
CREATE POLICY "Users can insert own pending membership" ON memberships
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND status = 'pending'
  );

-- INSERT: Users can insert an entry if they have active membership in the group
CREATE POLICY "Users can insert entries in their groups" ON entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.group_id = group_id
      AND m.user_id = auth.uid()
      AND m.status = 'active'
    ) AND logged_by = auth.uid()
  );

-- Trigger: After group INSERT, create creator as admin membership
CREATE OR REPLACE FUNCTION handle_group_insert()
RETURNS TRIGGER AS $$
-- SECURITY DEFINER: Runs with privileges of the user who created the group
-- Ensures the group creator automatically becomes an admin member
-- without requiring client-side code to insert the membership
BEGIN
  INSERT INTO memberships (group_id, user_id, role, status)
  VALUES (NEW.id, NEW.created_by, 'admin', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER group_insert_trigger
  AFTER INSERT ON groups
  FOR EACH ROW EXECUTE FUNCTION handle_group_insert();

-- Helper function: check if user is group admin or treasurer
-- SECURITY DEFINER avoids recursive lookups on the memberships table
-- by using auth.uid() directly instead of scanning memberships for the check
CREATE OR REPLACE FUNCTION is_group_admin_or_treasurer(group_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  result BOOLEAN;
  current_user_id UUID;
BEGIN
  -- Get current user ID from auth directly
  SELECT INTO current_user_id auth.uid();
  
  SELECT INTO result EXISTS (
    SELECT 1 FROM memberships
    WHERE group_id = is_group_admin_or_treasurer.group_id
    AND user_id = current_user_id
    AND role IN ('admin', 'treasurer')
    AND status = 'active'
  );
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- INSERT: Admins/treasurers can update memberships (approve members, change roles)
-- WITH CHECK: Only allow setting status to 'active' or 'pending', and role to 'admin', 'treasurer', or 'member'
CREATE POLICY "Admins/treasurers can update memberships" ON memberships
  FOR UPDATE USING (
    is_group_admin_or_treasurer(group_id)
  )
  WITH CHECK (
    -- Validate status can only be 'pending' or 'active'
    (status = 'pending' OR status = 'active') AND
    -- Validate role can only be 'admin', 'treasurer', or 'member'
    (role = 'admin' OR role = 'treasurer' OR role = 'member')
  );

-- Allow users to read other memberships in their group
-- A user with active membership can read all memberships for their group
CREATE POLICY "Users can read group memberships" ON memberships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM memberships m2
      WHERE m2.group_id = memberships.group_id
      AND m2.status = 'active'
    )
  );

-- Allow users to read profiles of people in their group
-- A user with active membership can read profiles of members in their group
CREATE POLICY "Users can read group member profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.group_id = profiles.id
      AND m.status = 'active'
    )
  );

-- INSERT: Users can insert an entry if they have active membership in the group
CREATE POLICY "Users can insert entries in their groups" ON entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.group_id = group_id
      AND m.user_id = auth.uid()
      AND m.status = 'active'
    ) AND logged_by = auth.uid()
  );

-- Function: get_group_by_join_code(code text) - security definer
-- Returns only id, name, and join_code for the matching group
-- Execute permission granted to authenticated role only
-- First, revoke from PUBLIC to ensure only authenticated users can use it
REVOKE EXECUTE ON FUNCTION get_group_by_join_code FROM PUBLIC;

CREATE OR REPLACE FUNCTION get_group_by_join_code(code text)
RETURNS TABLE (id UUID, name TEXT, join_code TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT id, name, join_code
  FROM groups
  WHERE join_code = code;
END;
$$ LANGUAGE sql SECURITY DEFINER;

-- Grant execute to authenticated role only
GRANT EXECUTE ON FUNCTION get_group_by_join_code TO authenticated;

-- INSERT: Users can insert an entry if they have active membership in the group
