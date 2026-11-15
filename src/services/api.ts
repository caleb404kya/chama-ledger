import { supabase } from './supabase';

const TABLES = {
  PROFILES: 'profiles',
  GROUPS: 'groups',
  MEMBERSHIPS: 'memberships',
  ENTRIES: 'entries',
} as const;

export interface Entry {
  id: string;
  client_id: string;
  group_id: string;
  member_id: string;
  type: 'contribution' | 'fine' | 'payout' | 'adjustment';
  amount: number;
  note: string;
  logged_by: string;
  timestamp: string;
  sync_status?: 'synced' | 'pending';
}

export async function getEntriesForGroup(groupId: string): Promise<Entry[]> {
  const { data, error } = await supabase.from(TABLES.ENTRIES).select('*').eq('group_id', groupId).order('timestamp', { ascending: false });
  if (error) { console.error('Error fetching entries:', error); return []; }
  return data as Entry[];
}

export async function getEntriesForMember(memberId: string): Promise<Entry[]> {
  const { data, error } = await supabase.from(TABLES.ENTRIES).select('*').eq('member_id', memberId).order('timestamp', { ascending: false });
  if (error) { console.error('Error fetching entries for member:', error); return []; }
  return data as Entry[];
}

export async function appendEntry(entryData: {
  client_id: string; group_id: string; member_id: string;
  type: 'contribution' | 'fine' | 'payout' | 'adjustment'; amount: number; note: string; logged_by: string;
  reversal_of?: string; // UUID of original entry being adjusted
}): Promise<Entry> {
  const entry: any = {
    client_id: entryData.client_id, group_id: entryData.group_id, member_id: entryData.member_id,
    type: entryData.type, amount: entryData.amount, note: entryData.note, logged_by: entryData.logged_by,
    timestamp: new Date().toISOString(), sync_status: 'synced',
  };
  if (entryData.reversal_of) entry.reversal_of = entryData.reversal_of;
  const { data, error } = await supabase.from(TABLES.ENTRIES).insert(entry).select().single();
  if (error) throw new Error('Error appending entry: ' + error.message);
  return data as Entry;
}

export async function findExistingEntry(clientId: string): Promise<Entry | undefined> {
  const { data, error } = await supabase.from(TABLES.ENTRIES).select('*').eq('client_id', clientId);
  if (error) { console.error('Error finding existing entry:', error); return undefined; }
  return (data as Entry[])[0];
}

export interface Group {
  id: string;
  name: string;
  expected_amount: number;
  frequency: 'weekly' | 'monthly';
  due_day: string;
  join_code: string;
  plan: 'Merry-Go-Round' | 'Investment' | 'Welfare/Table Banking';
  created_at: string;
  created_by: string;
  description?: string;
}

export async function getGroups(): Promise<Group[]> {
  const { data, error } = await supabase.from(TABLES.GROUPS).select('*');
  if (error) { console.error('Error fetching groups:', error); return []; }
  return data as Group[];
}

export async function getGroupByJoinCode(joinCode: string): Promise<Group | null> {
  const { data, error } = await supabase.from(TABLES.GROUPS).select('*').eq('join_code', joinCode).single();
  if (error) { console.error('Error fetching group by join code:', error); return null; }
  return data as Group;
}

export async function createGroup(groupData: {
  name: string; expected_amount: number; frequency: 'weekly' | 'monthly';
  due_day: string; join_code: string; plan: 'Merry-Go-Round' | 'Investment' | 'Welfare/Table Banking';
  description?: string;
}): Promise<Group> {
  const { data, error } = await supabase.from(TABLES.GROUPS).insert({
    name: groupData.name, expected_amount: groupData.expected_amount, frequency: groupData.frequency,
    due_day: groupData.due_day, join_code: groupData.join_code, plan: groupData.plan,
    description: groupData.description,
  }).select().single();
  if (error) throw new Error('Error creating group: ' + error.message);
  return data as Group;
}

export interface Membership {
  id: string;
  user_id: string;
  group_id: string;
  role: 'admin' | 'treasurer' | 'member';
  status: 'pending' | 'active';
  joined_at: string;
  approved_by?: string;
}

export async function getUsers(): Promise<{ id: string; name: string; phone: string; language: 'en' | 'sw'; avatar?: string }[]> {
  const { data, error } = await supabase.from(TABLES.PROFILES).select('*');
  if (error) { console.error('Error fetching users:', error); return []; }
  return data as { id: string; name: string; phone: string; language: 'en' | 'sw'; avatar?: string }[];
}

export async function createMembership(membershipData: {
  user_id: string; group_id: string; role: 'admin' | 'treasurer' | 'member'; status: 'pending' | 'active';
}): Promise<Membership> {
  const { data, error } = await supabase.from(TABLES.MEMBERSHIPS).insert({
    user_id: membershipData.user_id, group_id: membershipData.group_id,
    role: membershipData.role, status: membershipData.status,
  }).select().single();
  if (error) throw new Error('Error creating membership: ' + error.message);
  return data as Membership;
}

export async function getMembershipsForGroup(groupId: string): Promise<Membership[]> {
  const { data, error } = await supabase.from(TABLES.MEMBERSHIPS).select('*').eq('group_id', groupId);
  if (error) { console.error('Error fetching memberships for group:', error); return []; }
  return data as Membership[];
}

export async function getMembership(userId: string, groupId: string): Promise<Membership | null> {
  const { data, error } = await supabase.from(TABLES.MEMBERSHIPS).select('*').eq('user_id', userId).eq('group_id', groupId).single();
  if (error) { console.error('Error fetching membership:', error); return null; }
  return data as Membership;
}

export async function approveMembership(membershipId: string, approverId: string): Promise<Membership> {
  const { data, error } = await supabase.from(TABLES.MEMBERSHIPS).update({ status: 'active', approved_by: approverId }).eq('id', membershipId).select().single();
  if (error) throw new Error('Error approving membership: ' + error.message);
  return data as Membership;
}

export async function updateUser(userData: { id: string; name: string; phone: string; language: 'en' | 'sw' }): Promise<void> {
  const { error } = await supabase.from(TABLES.PROFILES).update({ name: userData.name, phone: userData.phone, language: userData.language }).eq('id', userData.id);
  if (error) throw new Error('Error updating user: ' + error.message);
}

export async function updateMemberRole(membershipId: string, role: 'admin' | 'treasurer' | 'member'): Promise<void> {
  const { error } = await supabase.from(TABLES.MEMBERSHIPS).update({ role }).eq('id', membershipId);
  if (error) throw new Error('Error updating role: ' + error.message);
}
