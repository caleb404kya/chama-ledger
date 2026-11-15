-- Migration: Block UPDATE and DELETE on entries table
-- Add reversal_of column and receipt_code column with UNIQUE constraint

-- Add reversal_of column to entries table
ALTER TABLE entries ADD COLUMN IF NOT EXISTS reversal_of UUID;

-- Add receipt_code column with UNIQUE constraint (for M-Pesa receipt codes)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'entries' AND column_name = 'receipt_code') THEN
    ALTER TABLE entries ADD COLUMN receipt_code TEXT;
    ALTER TABLE entries ADD CONSTRAINT entries_receipt_code_unique UNIQUE (receipt_code);
  END IF;
END $$;

-- Create function to block UPDATE on entries
CREATE OR REPLACE FUNCTION block_entry_update() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'entries are append-only. To make corrections, insert an adjustment entry with type = ''adjustment'' and reversal_of pointing to the original entry.';
END;
$$ LANGUAGE plpgsql;

-- Create trigger for UPDATE
DROP TRIGGER IF EXISTS block_entry_update_trig ON entries;
CREATE TRIGGER block_entry_update_trig BEFORE UPDATE ON entries FOR EACH ROW EXECUTE FUNCTION block_entry_update();

-- Create function to block DELETE on entries
CREATE OR REPLACE FUNCTION block_entry_delete() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'entries are append-only. To make corrections, insert an adjustment entry with type = ''adjustment'' and reversal_of pointing to the original entry.';
END;
$$ LANGUAGE plpgsql;

-- Create trigger for DELETE
DROP TRIGGER IF EXISTS block_entry_delete_trig ON entries;
CREATE TRIGGER block_entry_delete_trig BEFORE DELETE ON entries FOR EACH ROW EXECUTE FUNCTION block_entry_delete();