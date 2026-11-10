import { Group, Membership, Entry, User, MemberSummary } from '../types';

const STORAGE_KEYS = {
  USERS: 'chama_users_v1',
  GROUPS: 'chama_groups_v1',
  MEMBERSHIPS: 'chama_memberships_v1',
  ENTRIES: 'chama_entries_v1',
  CURRENT_USER_ID: 'chama_current_user_id_v1',
  OFFLINE_QUEUE: 'chama_offline_queue_v1',
  THEME_MODE: 'chama_theme_mode_v1',
  FORCE_OFFLINE: 'chama_force_offline_simulator_v1',
};

// Initial realistic seed data for Kenyan Savings Groups
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
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
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
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
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
    joined_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mem_umoja_kiprono',
    user_id: 'user_kiprono',
    group_id: 'group_umoja',
    role: 'treasurer',
    status: 'active',
    joined_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mem_umoja_achieng',
    user_id: 'user_achieng',
    group_id: 'group_umoja',
    role: 'member',
    status: 'active',
    joined_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mem_umoja_mwangi',
    user_id: 'user_mwangi',
    group_id: 'group_umoja',
    role: 'member',
    status: 'active',
    joined_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mem_umoja_faith',
    user_id: 'user_faith',
    group_id: 'group_umoja',
    role: 'member',
    status: 'pending', // Pending approval test case!
    joined_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Group Kilimani
  {
    id: 'mem_kili_kiprono',
    user_id: 'user_kiprono',
    group_id: 'group_kilimani',
    role: 'admin',
    status: 'active',
    joined_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mem_kili_sarah',
    user_id: 'user_sarah',
    group_id: 'group_kilimani',
    role: 'member',
    status: 'active',
    joined_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
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
    timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
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
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
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
    timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
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
    timestamp: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
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
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
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
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
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
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    sync_status: 'synced',
  },
];

class StorageService {
  private getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`Error reading key ${key} from storage:`, e);
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing key ${key} to storage:`, e);
    }
  }

  constructor() {
    this.init();
  }

  public init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.GROUPS)) {
      this.setItem(STORAGE_KEYS.GROUPS, INITIAL_GROUPS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MEMBERSHIPS)) {
      this.setItem(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ENTRIES)) {
      this.setItem(STORAGE_KEYS.ENTRIES, INITIAL_ENTRIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      this.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user_sarah'); // Default to Sarah (Admin)
    }
    if (!localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE)) {
      this.setItem(STORAGE_KEYS.OFFLINE_QUEUE, []);
    }
  }

  // --- Users ---
  public getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  public getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  public getCurrentUser(): User {
    const currentId = this.getItem<string>(STORAGE_KEYS.CURRENT_USER_ID, 'user_sarah');
    const user = this.getUserById(currentId);
    if (user) return user;
    return this.getUsers()[0] || INITIAL_USERS[0];
  }

  public setCurrentUser(userId: string): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  }

  public updateUser(user: User): void {
    const users = this.getUsers().map((u) => (u.id === user.id ? user : u));
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  public createUser(name: string, phone: string, language: 'en' | 'sw' = 'en'): User {
    const users = this.getUsers();
    // Check if phone exists
    const existing = users.find((u) => u.phone === phone);
    if (existing) return existing;

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name,
      phone,
      language,
      avatar: '👤',
    };
    users.push(newUser);
    this.setItem(STORAGE_KEYS.USERS, users);
    return newUser;
  }

  // --- Groups ---
  public getGroups(): Group[] {
    return this.getItem<Group[]>(STORAGE_KEYS.GROUPS, INITIAL_GROUPS);
  }

  public getGroupById(id: string): Group | undefined {
    return this.getGroups().find((g) => g.id === id);
  }

  public getGroupByJoinCode(joinCode: string): Group | undefined {
    const clean = joinCode.trim().toUpperCase();
    return this.getGroups().find((g) => g.join_code.toUpperCase() === clean);
  }

  /**
   * Fixed Group Rule:
   * Target expected contribution amount and frequency are fixed at creation.
   */
  public createGroup(params: {
    name: string;
    expected_amount: number;
    frequency: 'weekly' | 'monthly';
    due_day: string;
    plan: 'Merry-Go-Round' | 'Investment' | 'Welfare/Table Banking';
    description?: string;
  }): Group {
    const currentUser = this.getCurrentUser();
    const groups = this.getGroups();

    // Generate random friendly join code e.g. "KIL-342"
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
    this.setItem(STORAGE_KEYS.GROUPS, groups);

    // Group creator is automatically an Admin
    this.createMembership({
      user_id: currentUser.id,
      group_id: newGroup.id,
      role: 'admin',
      status: 'active',
    });

    return newGroup;
  }

  // --- Memberships ---
  public getMemberships(): Membership[] {
    return this.getItem<Membership[]>(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
  }

  public getMembershipsForGroup(groupId: string): Membership[] {
    return this.getMemberships().filter((m) => m.group_id === groupId);
  }

  public getMembership(groupId: string, userId: string): Membership | undefined {
    return this.getMemberships().find((m) => m.group_id === groupId && m.user_id === userId);
  }

  public createMembership(params: {
    user_id: string;
    group_id: string;
    role?: 'admin' | 'treasurer' | 'member';
    status?: 'pending' | 'active';
  }): Membership {
    const memberships = this.getMemberships();
    const existing = memberships.find(
      (m) => m.group_id === params.group_id && m.user_id === params.user_id
    );
    if (existing) return existing;

    const newMembership: Membership = {
      id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      user_id: params.user_id,
      group_id: params.group_id,
      role: params.role || 'member',
      status: params.status || 'pending',
      joined_at: new Date().toISOString(),
    };

    memberships.push(newMembership);
    this.setItem(STORAGE_KEYS.MEMBERSHIPS, memberships);
    return newMembership;
  }

  public approveMembership(membershipId: string): void {
    const currentUser = this.getCurrentUser();
    const memberships = this.getMemberships().map((m) => {
      if (m.id === membershipId) {
        return {
          ...m,
          status: 'active' as const,
          approved_by: currentUser.id,
        };
      }
      return m;
    });
    this.setItem(STORAGE_KEYS.MEMBERSHIPS, memberships);
  }

  /**
   * RBAC Rule:
   * Must maintain at least 1 Admin per group.
   */
  public updateMemberRole(membershipId: string, newRole: 'admin' | 'treasurer' | 'member'): { success: boolean; error?: string } {
    const memberships = this.getMemberships();
    const target = memberships.find((m) => m.id === membershipId);
    if (!target) return { success: false, error: 'Membership not found' };

    if (target.role === 'admin' && newRole !== 'admin') {
      const otherAdmins = memberships.filter(
        (m) => m.group_id === target.group_id && m.id !== target.id && m.role === 'admin' && m.status === 'active'
      );
      if (otherAdmins.length === 0) {
        return {
          success: false,
          error: 'Must maintain at least 1 Admin per group. Assign another Admin before changing this role.',
        };
      }
    }

    const updated = memberships.map((m) => (m.id === membershipId ? { ...m, role: newRole } : m));
    this.setItem(STORAGE_KEYS.MEMBERSHIPS, updated);
    return { success: true };
  }

  // --- Entries (APPEND-ONLY LEDGER) ---
  /**
   * Append-Only Ledger Rule:
   * The entries table is strictly APPEND-ONLY.
   * NO UPDATE or DELETE operations are permitted on financial entries.
   * Corrections must be made via an adjustment entry type.
   */
  public getEntries(): Entry[] {
    return this.getItem<Entry[]>(STORAGE_KEYS.ENTRIES, INITIAL_ENTRIES);
  }

  public getEntriesForGroup(groupId: string): Entry[] {
    return this.getEntries()
      .filter((e) => e.group_id === groupId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public getEntriesForMember(memberId: string): Entry[] {
    return this.getEntries()
      .filter((e) => e.member_id === memberId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Append new entry with idempotent client_id.
   * If isOffline is true or offline simulator is on, queues in offline queue and marks as 'pending'
   */
  public appendEntry(entryData: {
    client_id: string;
    group_id: string;
    member_id: string;
    type: 'contribution' | 'fine' | 'payout' | 'adjustment';
    amount: number;
    note: string;
    isOffline?: boolean;
  }): Entry {
    const currentUser = this.getCurrentUser();
    const entries = this.getEntries();

    // Idempotency check: if client_id already exists in entries, return existing
    const existing = entries.find((e) => e.client_id === entryData.client_id);
    if (existing) {
      return existing;
    }

    const isOffline = entryData.isOffline || this.isForcedOffline() || !navigator.onLine;

    const newEntry: Entry = {
      id: `ent_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      client_id: entryData.client_id,
      group_id: entryData.group_id,
      member_id: entryData.member_id,
      type: entryData.type,
      amount: Number(entryData.amount),
      note: entryData.note.trim(),
      logged_by: currentUser.id,
      timestamp: new Date().toISOString(),
      sync_status: isOffline ? 'pending' : 'synced',
    };

    // Append-only write
    entries.unshift(newEntry);
    this.setItem(STORAGE_KEYS.ENTRIES, entries);

    if (isOffline) {
      const queue = this.getOfflineQueue();
      if (!queue.find((item) => item.client_id === newEntry.client_id)) {
        queue.push(newEntry);
        this.setItem(STORAGE_KEYS.OFFLINE_QUEUE, queue);
      }
    }

    return newEntry;
  }

  // --- Offline Queue & Sync ---
  public getOfflineQueue(): Entry[] {
    return this.getItem<Entry[]>(STORAGE_KEYS.OFFLINE_QUEUE, []);
  }

  public syncOfflineQueue(): number {
    const queue = this.getOfflineQueue();
    if (queue.length === 0) return 0;

    const entries = this.getEntries();
    let syncedCount = 0;

    const updatedEntries = entries.map((entry) => {
      const inQueue = queue.find((q) => q.client_id === entry.client_id);
      if (inQueue && entry.sync_status === 'pending') {
        syncedCount++;
        return { ...entry, sync_status: 'synced' as const };
      }
      return entry;
    });

    this.setItem(STORAGE_KEYS.ENTRIES, updatedEntries);
    this.setItem(STORAGE_KEYS.OFFLINE_QUEUE, []);
    return syncedCount;
  }

  public isForcedOffline(): boolean {
    return this.getItem<boolean>(STORAGE_KEYS.FORCE_OFFLINE, false);
  }

  public setForcedOffline(val: boolean): void {
    this.setItem(STORAGE_KEYS.FORCE_OFFLINE, val);
  }

  // --- Dynamically Computed Balance ---
  /**
   * Computed Balance Rule:
   * Balance is ALWAYS calculated dynamically as SUM(entries).
   * Never store a static balance column.
   */
  public computeGroupFinancials(groupId: string): {
    totalBalance: number;
    totalContributions: number;
    totalFines: number;
    totalPayouts: number;
    totalAdjustments: number;
    entriesCount: number;
  } {
    const entries = this.getEntriesForGroup(groupId);
    let totalContributions = 0;
    let totalFines = 0;
    let totalPayouts = 0;
    let totalAdjustments = 0;

    for (const entry of entries) {
      const amt = Number(entry.amount) || 0;
      switch (entry.type) {
        case 'contribution':
          totalContributions += amt;
          break;
        case 'fine':
          totalFines += amt;
          break;
        case 'payout':
          totalPayouts += amt;
          break;
        case 'adjustment':
          totalAdjustments += amt;
          break;
      }
    }

    // Dynamic SUM(entries): Group pot balance = Contributions + Fines + Adjustments - Payouts
    const totalBalance = totalContributions + totalFines + totalAdjustments - totalPayouts;

    return {
      totalBalance,
      totalContributions,
      totalFines,
      totalPayouts,
      totalAdjustments,
      entriesCount: entries.length,
    };
  }

  public computeMemberSummary(membership: Membership, group: Group): MemberSummary {
    const users = this.getUsers();
    const user = users.find((u) => u.id === membership.user_id) || {
      id: membership.user_id,
      name: 'Unknown User',
      phone: '',
      language: 'en' as const,
    };

    const entries = this.getEntriesForMember(membership.id);
    let totalContributed = 0;
    let totalFines = 0;
    let totalPayouts = 0;
    let totalAdjustments = 0;
    let lastPaymentDate: string | undefined;

    for (const e of entries) {
      const amt = Number(e.amount) || 0;
      if (!lastPaymentDate && (e.type === 'contribution' || e.type === 'adjustment')) {
        lastPaymentDate = e.timestamp;
      }
      switch (e.type) {
        case 'contribution':
          totalContributed += amt;
          break;
        case 'fine':
          totalFines += amt;
          break;
        case 'payout':
          totalPayouts += amt;
          break;
        case 'adjustment':
          totalAdjustments += amt;
          break;
      }
    }

    // Dynamic balance for member: Net member credit = Contributed + Adjustments - Fines - Payouts
    const computedBalance = totalContributed + totalAdjustments - totalFines - totalPayouts;

    // Estimate expected cycles based on group age / joined date
    const joinedTime = new Date(membership.joined_at).getTime();
    const nowTime = Date.now();
    const daysSinceJoined = Math.max(1, Math.floor((nowTime - joinedTime) / (1000 * 60 * 60 * 24)));

    let cyclesElapsed = 1;
    if (group.frequency === 'weekly') {
      cyclesElapsed = Math.max(1, Math.ceil(daysSinceJoined / 7));
    } else {
      cyclesElapsed = Math.max(1, Math.ceil(daysSinceJoined / 30));
    }

    const expectedToDate = cyclesElapsed * group.expected_amount;
    // Amount Owed (Kiasi Unachodaiwa): If member paid less than expected + fines
    const grossDue = expectedToDate + totalFines;
    const grossPaid = totalContributed + Math.max(0, totalAdjustments);
    const amountOwed = Math.max(0, grossDue - grossPaid);

    return {
      membership,
      user,
      totalContributed,
      totalFines,
      totalPayouts,
      totalAdjustments,
      computedBalance,
      expectedToDate,
      amountOwed,
      lastPaymentDate,
      entriesCount: entries.length,
    };
  }

  public getGroupMemberSummaries(groupId: string): MemberSummary[] {
    const group = this.getGroupById(groupId);
    if (!group) return [];
    const memberships = this.getMembershipsForGroup(groupId);
    return memberships.map((m) => this.computeMemberSummary(m, group));
  }
}

export const storage = new StorageService();
