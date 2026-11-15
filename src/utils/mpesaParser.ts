import { ParsedMpesa, User, Membership } from '../types';

export interface SampleSms {
  label: string;
  text: string;
}

export const SAMPLE_MPESA_MESSAGES: SampleSms[] = [
  {
    label: 'M-Pesa Received (John Doe)',
    text: 'RC98ZX76LK Confirmed. You have received Ksh2,000.00 from JOHN DOE 0722000111 on 09/11/26 at 4:32 PM. New M-PESA balance is Ksh14,500.00. Transaction cost, Ksh0.00.',
  },
  {
    label: 'M-Pesa Sent to Chama (Mama Sarah)',
    text: 'QA12BC34DE Confirmed. Ksh1,500.00 sent to UMOJA CHAMA 0712345678 on 10/11/26 at 9:15 AM. New M-PESA balance is Ksh8,200.00.',
  },
  {
    label: 'M-Pesa Contribution (Mary Wanjiku)',
    text: 'SB45MN67OP Confirmed. Ksh5,000.00 paid to KILIMANI CHAMA by MARY WANJIKU 0798765432 on 08/11/26 at 11:20 AM. New M-PESA balance is Ksh22,400.00.',
  },
  {
    label: 'Swahili M-Pesa (Peter Kiprono)',
    text: 'TL89QQ11ZZ Imethibitishwa. Umepokea Ksh1,000.00 kutoka kwa PETER KIPRONO 0733445566 mnamo 10/11/26 saa 2:15 PM.',
  },
];

export function parseMpesaSms(
  text: string,
  members: { membership: Membership; user: User }[] = []
): ParsedMpesa | null {
  if (!text || typeof text !== 'string') return null;

  const trimmed = text.trim();

  // 1. Receipt Code: Standard 10-char alphanumeric M-Pesa ID (e.g., QA12BC34DE)
  const codeMatch = trimmed.match(/\b([A-Z0-9]{10})\b/);
  const receiptCode = codeMatch ? codeMatch[1] : '';

  // 2. Amount: Matches "Ksh1,500.00", "Ksh 2000", "KES 5,000.00", etc.
  const amountMatch = trimmed.match(/(?:Ksh|KSh|KES|ksh)\.?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i);
  let amount = 0;
  if (amountMatch) {
    const rawNum = amountMatch[1].replace(/,/g, '');
    amount = parseFloat(rawNum) || 0;
  }

  // 3. Phone Number: Standard Kenyan formats: 07XXXXXXXX, 01XXXXXXXX, or 254XXXXXXXXX
  const phoneMatch = trimmed.match(/\b(254\d{9}|07\d{8}|01\d{8})\b/);
  let phone = '';
  if (phoneMatch) {
    phone = phoneMatch[1];
    // Standardize to 07... if starts with 254
    if (phone.startsWith('254')) {
      phone = '0' + phone.slice(3);
    }
  }

  // 4. Sender Name
  let senderName = '';
  const fromMatch = trimmed.match(/(?:from|kutoka kwa|by)\s+([A-Z\s]{3,30}?)(?=\s+(?:07|01|254|on|mnamo|\.))/i);
  if (fromMatch) {
    senderName = fromMatch[1].trim();
  }

  // 5. Date & Time
  let dateTime = '';
  const dateMatch = trimmed.match(/(?:on|mnamo)\s+([0-9/.-]+\s+(?:at|saa)\s+[0-9:AMPamp\s]+?)(?=\.|$|New|Salio)/i);
  if (dateMatch) {
    dateTime = dateMatch[1].trim();
  }

  // Must have at least a receipt code or amount to be valid M-Pesa
  if (!receiptCode && amount <= 0) {
    return null;
  }

  // Auto-match with group members by phone or name
  let matchedMemberId: string | undefined;
  let matchedMemberName: string | undefined;

  if (members.length > 0) {
    // Try phone match first
    if (phone) {
      const foundByPhone = members.find((m) => {
        const memberPhoneClean = m.user.phone.replace(/\D/g, '');
        const smsPhoneClean = phone.replace(/\D/g, '');
        return memberPhoneClean.endsWith(smsPhoneClean.slice(-8)) || smsPhoneClean.endsWith(memberPhoneClean.slice(-8));
      });
      if (foundByPhone) {
        matchedMemberId = foundByPhone.membership.id;
        matchedMemberName = foundByPhone.user.name;
      }
    }

    // If no phone match, try sender name match
    if (!matchedMemberId && senderName) {
      const normalizedSender = senderName.toLowerCase();
      const foundByName = members.find((m) => {
        const uName = m.user.name.toLowerCase();
        return uName.includes(normalizedSender) || normalizedSender.includes(uName);
      });
      if (foundByName) {
        matchedMemberId = foundByName.membership.id;
        matchedMemberName = foundByName.user.name;
      }
    }
  }

  const confidence: 'high' | 'medium' | 'low' =
    receiptCode && amount > 0 && (phone || matchedMemberId)
      ? 'high'
      : receiptCode || amount > 0
      ? 'medium'
      : 'low';

  return {
    raw: trimmed,
    receiptCode,
    amount,
    phone,
    senderName,
    dateTime: dateTime || new Date().toLocaleString(),
    matchedMemberId,
    matchedMemberName,
    confidence,
  };
}
