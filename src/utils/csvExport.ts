import { Entry, Group, Membership, User } from '../types';

export function exportLedgerToCsv(
  group: Group,
  entries: Entry[],
  memberships: Membership[],
  users: User[]
): void {
  const usersMap = new Map<string, User>(users.map((u) => [u.id, u]));
  const memberMap = new Map<string, { member: Membership; user?: User }>(
    memberships.map((m) => [m.id, { member: m, user: usersMap.get(m.user_id) }])
  );

  const headers = [
    'Date & Time',
    'Member Name',
    'Member Phone',
    'Transaction Type',
    'Amount (KES)',
    'M-Pesa Code / Reason / Note',
    'Logged By',
    'Sync Status',
    'Client ID (Idempotency)',
  ];

  const rows = entries.map((entry) => {
    const memData = memberMap.get(entry.member_id);
    const memberName = memData?.user?.name || 'Unknown Member';
    const memberPhone = memData?.user?.phone || '';
    const loggedByUser = usersMap.get(entry.logged_by)?.name || entry.logged_by;

    const formattedDate = new Date(entry.timestamp).toLocaleString();
    const cleanNote = (entry.note || '').replace(/"/g, '""');

    return [
      `"${formattedDate}"`,
      `"${memberName.replace(/"/g, '""')}"`,
      `"${memberPhone}"`,
      `"${entry.type.toUpperCase()}"`,
      entry.amount.toFixed(2),
      `"${cleanNote}"`,
      `"${loggedByUser.replace(/"/g, '""')}"`,
      `"${entry.sync_status || 'synced'}"`,
      `"${entry.client_id}"`,
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  // Trigger download with BOM for Excel compatibility in East Africa
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeGroupName = group.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `${safeGroupName}_ledger_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
