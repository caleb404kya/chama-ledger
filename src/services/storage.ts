import { Group, Membership, Entry, User, MemberSummary } from '../types';

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
    amount: 1500,
    note: 'M-PESA: QA12BC34DE - Week 1 Contribution',
    logged_by: 'user_sarah',
    timestamp: new Date().toISOString(),
    sync_status: 'synced',
  },
  {
    id: 'ent_2',
    client_id: 'cid_init_2',
    group_id: 'group_umoja',
    member_id: 'mem_umoja_sarah',
    type: 'contribution',
    amount: 1500,
    note: 'M-PESA: QA99XY12ZZ - Week 2 Contribution',
    logged_by: 'user_kiprono',
    timestamp: new Date().toISOString(),
    sync_status: 'synced',
  },
  // Kiprono contributed
  {
    id: 'ent_3',
    client_id: 'cid_init_3',
    group_id: 'group_umoja',
    member_id: 'mem_umoja_kiprono',
    type: 'contribution',
    amount: 3000,
    note: 'M-PESA: RC98ZX76LK - Double advance payment for 2 weeks',
    logged_by: 'user_kiprono',
    timestamp: new Date().toISOString(),
    sync_status: 'synced',
  },
  // Achieng contributed
  {
    id: 'ent_4',
    client_id: 'cid_init_4',
    group_id: 'group_umoja',
    member_id: 'mem_umoja_achieng',
    type: 'contribution',
    amount: 1500,
    note: 'M-PESA: SB45MN67OP - Week 1 Contribution',
    logged_by: 'user_kiprono',
    timestamp: new Date().toISOString(),
    sync_status: 'synced',
  },
  // Mwangi fine for late meeting
  {
    id: 'ent_5',
    client_id: 'cid_init_5',
    group_id: 'group_umoja',
    member_id: 'mem_umoja_mwangi',
    type: 'fine',
    amount: 200,
    note: 'Fine: Arrived 35 mins late to physical Sunday meeting',
    logged_by: 'user_sarah',
    timestamp: new Date().toISOString(),
    sync_status: 'synced',
  },
  // Sarah received Merry-Go-Round Payout
  {
    id: 'ent_6',
    client_id: 'cid_init_6',
    group_id: 'group_umoja',
    member_id: 'mem_umoja_sarah',
    type: 'payout',
    amount: 4500,
    note: 'Cycle 1 Merry-go-round rotation payout to Mama Brian',
    logged_by: 'user_kiprono',
    timestamp: new Date().toISOString(),
    sync_status: 'synced',
  },
  // Adjustment entry example: append-only ledger correction
  {
    id: 'ent_7',
    client_id: 'cid_init_7',
    group_id: 'group_umoja',
    member_id: 'mem_umoja_mwangi',
    type: 'adjustment',
    amount: -100,
    note: 'Adjustment: Meeting fine reduced from 200 to 100 due to rainstorm traffic waiver approved by chair',
    logged_by: 'user_sarah',
    timestamp: new Date().toISOString(),
    sync_status: 'synced',
  },
];

// Check if demo data is enabled
const USE_DEMO_DATA = import.meta.env.VITE_USE_DEMO_DATA === 'true';

const STORAGE_KEYS = {
  OFFLINE_QUEUE: 'chama_offline_queue_v1',
  FORCE_OFFLINE: 'chama_force_offline_simulator_v1',
  THEME_MODE: 'chama_theme_mode_v1',
};

class StorageService {
  private offlineQueue: Entry[] = [];

  constructor() {
    if (USE_DEMO_DATA) {
      this.initDemoData();
    }
  }

  private initDemoData(): void {
    // Seed data handled via class fields below
  }

  // --- Users ---

  public getUsers(): User[] {
    if (USE_DEMO_DATA) {
      return INITIAL_USERS;
    }
    return [];
  }

  public getCurrentUser(): User {
    if (USE_DEMO_DATA) {
      const userId = localStorage.getItem('chama_current_user_id_v1') || 'user_sarah';
      return INITIAL_USERS.find((u) => u.id === userId) || INITIAL_USERS[0];
    }
    return INITIAL_USERS[0];
  }

  public setCurrentUser(userId: string): void {
    if (USE_DEMO_DATA) {
      localStorage.setItem('chama_current_user_id_v1', userId);
    }
  }

  public updateUser(user: User): void {
    if (USE_DEMO_DATA) {
      localStorage.setItem('chama_users_v1', JSON.stringify(INITIAL_USERS));
    }
  }

  // --- Groups ---

  public getGroups(): Group[] {
    if (USE_DEMO_DATA) {
      return INITIAL_GROUPS;
    }
    return [];
  }

  public getGroupById(id: string): Group | undefined {
    const groups = this.getGroups();
    return groups.find((g) => g.id === id);
  }

  public getGroupByJoinCode(joinCode: string): Group | undefined {
    const clean = joinCode.trim().toUpperCase();
    const groups = this.getGroups();
    return groups.find((g) => g.join_code.toUpperCase() === clean);
  }

  public createGroup(params: {
    name: string;
    expected_amount: number;
    frequency: 'weekly' | 'monthly';
    due_day: string;
    plan: 'Merry-Go-Round' | 'Investment' | 'Welfare/Table Banking';
    description?: string;
  }): Group {
    if (USE_DEMO_DATA) {
      const currentUser = this.getCurrentUser();
      const groups = this.getGroups();
      const prefix = params.name.trim().slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'CH');
      const suffix = Math.floor(100 + Math.random() * 900);
      const join_code = `${prefix}-${suffix}`;
      const newGroup: Group = {
        id: `group_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: params.name.trim(),
        expected_amount: Number(params.expected_amount) || 1000,
        frequency: params.frequency,
        due_day: params.due_day.trim(),
        join_code,
        plan: params.plan,
        created_at: new Date().toISOString(),
        created_by: currentUser.id,
        description: params.description,
      };
      groups.unshift(newGroup);
      return newGroup;
    }
    return {
      id: 'group_new',
      name: params.name,
      expected_amount: params.expected_amount,
      frequency: params.frequency,
      due_day: params.due_day,
      join_code: 'NEW-000',
      plan: params.plan,
      created_at: new Date().toISOString(),
      created_by: this.getCurrentUser().id,
      description: params.description,
    };
  }

  // --- Memberships ---

  public getMembershipsForGroup(groupId: string): Membership[] {
    if (USE_DEMO_DATA) {
      return INITIAL_MEMBERSHIPS.filter((m) => m.group_id === groupId);
    }
    return [];
  }

  public getMembership(groupId: string, userId: string): Membership | undefined {
    if (USE_DEMO_DATA) {
      return INITIAL_MEMBERSHIPS.find((m) => m.group_id === groupId && m.user_id === userId);
    }
    return undefined;
  }

  public getMemberships(): Membership[] {
    if (USE_DEMO_DATA) {
      return INITIAL_MEMBERSHIPS;
    }
    return [];
  }

  public createMembership(params: {
    user_id: string;
    group_id: string;
    role?: 'admin' | 'treasurer' | 'member';
    status?: 'pending' | 'active';
  }): Membership {
    if (USE_DEMO_DATA) {
      const newMembership: Membership = {
        id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        user_id: params.user_id,
        group_id: params.group_id,
        role: params.role || 'member',
        status: params.status || 'pending',
        joined_at: new Date().toISOString(),
      };
      return newMembership;
    }
    return {
      id: 'mem_new',
      user_id: params.user_id,
      group_id: params.group_id,
      role: params.role || 'member',
      status: params.status || 'pending',
      joined_at: new Date().toISOString(),
    };
  }

  // --- Entries (append-only ledger) ---

  public getEntriesForGroup(groupId: string): Entry[] {
    if (USE_DEMO_DATA) {
      return INITIAL_ENTRIES.filter((e) => e.group_id === groupId);
    }
    return [];
  }

  public getEntriesForMember(memberId: string): Entry[] {
    if (USE_DEMO_DATA) {
      return INITIAL_ENTRIES.filter((e) => e.member_id === memberId);
    }
    return [];
  }

  public appendEntry(entryData: {
    client_id: string;
    group_id: string;
    member_id: string;
    type: 'contribution' | 'fine' | 'payout' | 'adjustment';
    amount: number;
    note: string;
    isOffline?: boolean;
  }): Entry {
    if (USE_DEMO_DATA) {
      const newEntry: Entry = {
        id: `ent_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        client_id: entryData.client_id,
        group_id: entryData.group_id,
        member_id: entryData.member_id,
        type: entryData.type,
        amount: entryData.amount,
        note: entryData.note.trim(),
        logged_by: this.getCurrentUser().id,
        timestamp: new Date().toISOString(),
        sync_status: 'synced',
      };
      return newEntry;
    }
    const currentUser = this.getCurrentUser();
    const newEntry: Entry = {
      id: crypto.randomUUID(),
      client_id: entryData.client_id,
      group_id: entryData.group_id,
      member_id: entryData.member_id,
      type: entryData.type,
      amount: entryData.amount,
      note: entryData.note.trim(),
      logged_by: currentUser.id,
      timestamp: new Date().toISOString(),
      sync_status: 'synced',
    };
    return newEntry;
  }

  public extractReceiptCode(note: string): string | undefined {
    const match = note.match(/M-PESA:\s*([A-Z0-9]{10})\b/i);
    return match ? match[1].toUpperCase() : undefined;
  }

  public findDuplicateReceipt(note: string): Entry | undefined {
    if (USE_DEMO_DATA) {
      const code = this.extractReceiptCode(note);
      if (!code) return undefined;
      return INITIAL_ENTRIES.find((e) => this.extractReceiptCode(e.note) === code);
    }
    return undefined;
  }

  // --- Offline Queue ---

  public getOfflineQueue(): Entry[] {
    if (USE_DEMO_DATA) {
      const stored = localStorage.getItem('chama_offline_queue_v1');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  public setOfflineQueue(queue: Entry[]): void {
    if (USE_DEMO_DATA) {
      localStorage.setItem('chama_offline_queue_v1', JSON.stringify(queue));
    }
  }

  public syncOfflineQueue(): number {
    const queue = this.getOfflineQueue();
    if (queue.length === 0) return 0;
    let syncedCount = 0;
    const entries = this.getEntriesForGroup('group_umoja');
    for (const queuedEntry of queue) {
      const inQueue = entries.find((e) => e.client_id === queuedEntry.client_id);
      if (inQueue) {
        syncedCount++;
      }
    }
    this.setOfflineQueue([]);
    return syncedCount;
  }

  public isForcedOffline(): boolean {
    if (USE_DEMO_DATA) {
      const stored = localStorage.getItem('chama_force_offline_simulator_v1');
      return stored ? JSON.parse(stored) : false;
    }
    return false;
  }

  public setForcedOffline(val: boolean): void {
    if (USE_DEMO_DATA) {
      localStorage.setItem('chama_force_offline_simulator_v1', JSON.stringify(val));
    }
  }
}

export const storage = new StorageService();
