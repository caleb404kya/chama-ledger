import { Group, Membership, Entry, User, MemberSummary } from '../types';
import * as api from './api';
import { supabase } from './supabase';

// Demo seed data - only used when VITE_USE_DEMO_DATA === 'true'
const INITIAL_USERS: User[] = [
  {
    id: 'user_sarah',
    name: 'Sarah Wanjiku (Mama Brian)',
    phone: '0712345678',
    language: 'en',
    avatar: '👩🏾‍💼',
  },
  {
    id: 'user_kiprono',
    name: 'Peter Kiprono',
    phone: '0722000111',
    language: 'sw',
    avatar: '👨🏾‍💻',
  },
  {
    id: 'user_achieng',
    name: 'Achieng Otieno',
    phone: '0733445566',
    language: 'en',
    avatar: '👩🏾',
  },
  {
    id: 'user_mwangi',
    name: 'John Mwangi',
    phone: '0798765432',
    language: 'sw',
    avatar: '👨🏾',
  },
  {
    id: 'user_faith',
    name: 'Faith Mutua',
    phone: '0744112233',
    language: 'en',
    avatar: '👩🏾‍🎓',
  },
];

const INITIAL_GROUPS: Group[] = [
  {
    id: 'group_umoja',
    name: 'Umoja Savings & Welfare Chama',
    expected_amount: 1500,
    frequency: 'weekly',
    due_day: 'Monday',
    join_code: 'UMO-789',
    plan: 'Merry-Go-Round',
    created_at: new Date().toISOString(),
    created_by: 'user_sarah',
    description: 'Weekly table banking & merry-go-round for family & business support.',
  },
  {
    id: 'group_kilimani',
    name: 'Kilimani Growth Investors',
    expected_amount: 5000,
    frequency: 'monthly',
    due_day: '1st of the month',
    join_code: 'KIL-101',
    plan: 'Investment',
    created_at: new Date().toISOString(),
    created_by: 'user_kiprono',
    description: 'Monthly pooling for land, treasury bills, and emergency welfare.',
  },
];

const INITIAL_MEMBERSHIPS: Membership[] = [
  // Group Umoja
  {
    id: 'mem_umoja_sarah',
    user_id: 'user_sarah',
    group_id: 'group_umoja',
    role: 'admin',
    status: 'active',
    joined_at: new Date().toISOString(),
  },
  {
    id: 'mem_umoja_kiprono',
    user_id: 'user_kiprono',
    group_id: 'group_umoja',
    role: 'treasurer',
    status: 'active',
    joined_at: new Date().toISOString(),
  },
  {
    id: 'mem_umoja_achieng',
    user_id: 'user_achieng',
    group_id: 'group_umoja',
    role: 'member',
    status: 'active',
    joined_at: new Date().toISOString(),
  },
  {
    id: 'mem_umoja_mwangi',
    user_id: 'user_mwangi',
    group_id: 'group_umoja',
    role: 'member',
    status: 'active',
    joined_at: new Date().toISOString(),
  },
  {
    id: 'mem_umoja_faith',
    user_id: 'user_faith',
    group_id: 'group_umoja',
    role: 'member',
    status: 'pending',
    joined_at: new Date().toISOString(),
  },
  // Group Kilimani
  {
    id: 'mem_kili_kiprono',
    user_id: 'user_kiprono',
    group_id: 'group_kilimani',
    role: 'admin',
    status: 'active',
    joined_at: new Date().toISOString(),
  },
  {
    id: 'mem_kili_sarah',
    user_id: 'user_sarah',
    group_id: 'group_kilimani',
    role: 'member',
    status: 'active',
    joined_at: new Date().toISOString(),
  },
];

const INITIAL_ENTRIES: Entry[] = [
  // Sarah contributed
  {
    id: 'ent_1',
    client_id: 'cid_init_1',
    group_id: 'group_umoja',
    member_id: 'mem_umoja_sarah',
    type: 'contribution',
    amount: 1000,
    note: 'Initial contribution',
    logged_by: 'user_sarah',
    timestamp: new Date().toISOString(),
    sync_status: 'synced',
  },
];

}
