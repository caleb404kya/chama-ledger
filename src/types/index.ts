export type Language = 'en' | 'sw';

export type Role = 'admin' | 'treasurer' | 'member';

export type MembershipStatus = 'pending' | 'active';

export type EntryType = 'contribution' | 'fine' | 'payout' | 'adjustment';

export type Frequency = 'weekly' | 'monthly';

export type ChamaPlan = 'Merry-Go-Round' | 'Investment' | 'Welfare/Table Banking';

export interface User {
  id: string;
  phone: string;
  name: string;
  language: Language;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  expected_amount: number;
  frequency: Frequency;
  due_day: string; // e.g. "Every Monday" or "5th of month"
  join_code: string;
  plan: ChamaPlan;
  created_at: string;
  created_by: string; // user_id
  description?: string;
}

export interface Membership {
  id: string;
  user_id: string;
  group_id: string;
  role: Role;
  status: MembershipStatus;
  joined_at: string;
  approved_by?: string;
}

export interface Entry {
  id: string;
  client_id: string; // Idempotent UUID
  group_id: string;
  member_id: string; // membership.id or user_id
  type: EntryType;
  amount: number; // positive or negative for adjustment
  note: string; // e.g. M-Pesa code "RC98ZX76LK", fine reason, or adjustment note
  logged_by: string; // user_id
  timestamp: string;
  sync_status?: 'synced' | 'pending';
}

export interface ParsedMpesa {
  raw: string;
  receiptCode: string;
  amount: number;
  phone: string;
  senderName: string;
  dateTime: string;
  matchedMemberId?: string;
  matchedMemberName?: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface MemberSummary {
  membership: Membership;
  user: User;
  totalContributed: number;
  totalFines: number;
  totalPayouts: number;
  totalAdjustments: number;
  computedBalance: number;
  expectedToDate: number;
  amountOwed: number; // Kiasi Unachodaiwa
  lastPaymentDate?: string;
  entriesCount: number;
}
