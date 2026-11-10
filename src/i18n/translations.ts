import { Language } from '../types';

export const translations = {
  en: {
    // App Brand
    appName: 'Chama Ledger',
    appTagline: 'Micro-ledger for Kenyan savings groups',
    
    // Core prompt required phrases
    logPayment: 'Log Payment',
    amountOwed: 'Amount Owed',
    totalBalance: 'Total Balance',
    waitingToSync: 'Waiting to sync',
    approveMember: 'Approve Member',
    contribution: 'Contribution',
    fine: 'Fine',
    
    // Other Financial & Entry terms
    payout: 'Payout',
    adjustment: 'Adjustment',
    allEntries: 'All Transactions',
    appendOnlyNotice: 'Append-Only Ledger: Entries cannot be edited or deleted. Record an adjustment for corrections.',
    
    // Navigation & Tabs
    home: 'Home',
    groups: 'My Chamas',
    joinGroup: 'Join Chama',
    createGroup: 'Create Chama',
    profile: 'Profile & Settings',
    ledger: 'Ledger',
    members: 'Members',
    stats: 'Overview',
    
    // Group details & Rules
    fixedRuleNotice: 'Fixed contribution plan: Amount and schedule are set at group creation.',
    targetAmount: 'Target Contribution',
    frequency: 'Frequency',
    weekly: 'Weekly',
    monthly: 'Monthly',
    dueDay: 'Due Day',
    joinCode: 'Join Code',
    planType: 'Chama Plan',
    activeMembers: 'Active Members',
    pendingApprovals: 'Pending Approvals',
    nextDue: 'Next Due Date',
    
    // Roles & Access
    roleAdmin: 'Admin',
    roleTreasurer: 'Treasurer',
    roleMember: 'Member',
    manageRoles: 'Manage Roles',
    assignTreasurer: 'Assign Treasurer',
    keepOneAdminNotice: 'At least one Admin must be maintained per group.',
    statusPending: 'Pending Approval',
    statusActive: 'Active',
    
    // Actions & Buttons
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    exportCsv: 'Export CSV',
    parseMpesa: 'Paste M-Pesa SMS',
    syncNow: 'Sync Now',
    offlineMode: 'Offline Mode',
    onlineMode: 'Online Mode',
    allCaughtUp: 'All synced with server',
    filterBy: 'Filter by',
    searchMember: 'Search member or phone...',
    copyCode: 'Copy Code',
    codeCopied: 'Join code copied!',
    
    // Forms
    selectMember: 'Select Member',
    enterAmount: 'Amount (KSh)',
    enterNote: 'Note / Receipt Code / Reason',
    adjustmentReason: 'Mandatory adjustment reason',
    fineReason: 'Reason for fine (e.g. late to meeting, missed turn)',
    adjustmentTypePrompt: 'Adjustment Type',
    positiveCredit: 'Credit (+) Member Paid Extra',
    negativeDebit: 'Debit (-) Correction or Reversal',
    
    // M-Pesa Parser
    pasteSmsTitle: 'Paste M-Pesa SMS Message',
    pasteSmsDesc: 'Paste an M-Pesa text message. We will automatically extract the receipt code, amount, and sender phone.',
    pastePlaceholder: 'e.g. QA12BC34DE Confirmed. Ksh1,500.00 sent to CHAMA SAVINGS 0712345678 on 10/11/26 at 9:15 AM.',
    detectedReceipt: 'Receipt Code',
    detectedAmount: 'Detected Amount',
    detectedSender: 'Sender Phone / Name',
    matchedMember: 'Matched Group Member',
    trySampleSms: 'Try Sample SMS',
    parseSuccess: 'M-Pesa details successfully extracted!',
    parseError: 'Could not extract M-Pesa details. Please check the text format.',
    applyToForm: 'Use Extracted Details',
    
    // Member restricted view
    memberRestrictedTitle: 'Your Personal Chama Card',
    memberRestrictedSubtitle: 'You only see your personal contributions and balance per chama rules.',
    yourBalance: 'Your Total Contributed',
    amountDueNow: 'Amount Due Now',
    statusGoodStanding: 'Good Standing',
    statusArrears: 'Payment in Arrears',
    yourHistory: 'Your Payment History',
    noPersonalEntries: 'No payments recorded for your account yet.',
    
    // Join flow
    enterJoinCode: 'Enter 6-digit Join Code',
    enterYourName: 'Your Full Name',
    enterYourPhone: 'M-Pesa Phone Number (e.g. 0712345678)',
    submitJoinRequest: 'Send Join Request',
    waitingApprovalNotice: 'Your request was sent. Please wait for the Chama Treasurer or Admin to approve you.',
    alreadyMember: 'You are already a member of this group.',
    groupNotFound: 'Chama with this join code was not found.',
    
    // Switch User (Demo & Test)
    switchUser: 'Active User Profile',
    switchUserDesc: 'Switch active user to test Admin, Treasurer, or Member permissions.',
    
    // Offline status
    offlineBannerText: 'You are currently offline. New payments will be queued locally and marked "Waiting to sync".',
    queuedItemsCount: 'queued payment(s) waiting to sync',
    installApp: 'Install App',
    installPwaPrompt: 'Install Chama Ledger on your device for fast offline access.',
    
    // Common
    date: 'Date',
    type: 'Type',
    amount: 'Amount',
    balance: 'Balance',
    actions: 'Actions',
    emptyLedger: 'No ledger entries recorded yet.',
    emptyGroups: 'You have not joined any Chamas yet.',
    noPendingRequests: 'No pending join requests.',
    ksh: 'KSh',
  },
  sw: {
    // App Brand
    appName: 'Chama Ledger',
    appTagline: 'Daftari la kisasa la vikundi vya kuweka akiba nchini Kenya',
    
    // Core prompt required phrases
    logPayment: 'Sajili Malipo',
    amountOwed: 'Kiasi Unachodaiwa',
    totalBalance: 'Jumla ya Salio',
    waitingToSync: 'Inasubiri Kusawazishwa',
    approveMember: 'Thibitisha Mwanachama',
    contribution: 'Mchango',
    fine: 'Faini',
    
    // Other Financial & Entry terms
    payout: 'Malipo ya Mzunguko',
    adjustment: 'Marekebisho',
    allEntries: 'Miamala Yote',
    appendOnlyNotice: 'Daftari lisilofutika: Rekodi haziwezi kubadilishwa au kufutwa. Tumia marekebisho kusawazisha.',
    
    // Navigation & Tabs
    home: 'Mwanzo',
    groups: 'Vikundi Vyangu',
    joinGroup: 'Jiunge na Kikundi',
    createGroup: 'Unda Kikundi',
    profile: 'Wasifu na Mipangilio',
    ledger: 'Daftari',
    members: 'Wanachama',
    stats: 'Muhtasari',
    
    // Group details & Rules
    fixedRuleNotice: 'Mpango thabiti wa mchango: Kiasi na ratiba huwekwa wakati wa kuunda kikundi.',
    targetAmount: 'Mchango Unaotarajiwa',
    frequency: 'Mzunguko',
    weekly: 'Kila Wiki',
    monthly: 'Kila Mwezi',
    dueDay: 'Siku ya Malipo',
    joinCode: 'Msimbo wa Kujiunga',
    planType: 'Aina ya Chama',
    activeMembers: 'Wanachama Hai',
    pendingApprovals: 'Wanaosubiri Idhini',
    nextDue: 'Tarehe Ijayo ya Malipo',
    
    // Roles & Access
    roleAdmin: 'Msimamizi (Admin)',
    roleTreasurer: 'Mweka Hazina',
    roleMember: 'Mwanachama',
    manageRoles: 'Dhibiti Nafasi',
    assignTreasurer: 'Teua Mweka Hazina',
    keepOneAdminNotice: 'Lazima kuwe na angalau Msimamizi (Admin) mmoja katika kikundi.',
    statusPending: 'Inasubiri Uidhinishaji',
    statusActive: 'Hai',
    
    // Actions & Buttons
    save: 'Hifadhi',
    cancel: 'Ghairi',
    confirm: 'Thibitisha',
    exportCsv: 'Pakua CSV',
    parseMpesa: 'Bandika Ujumbe wa M-Pesa',
    syncNow: 'Sawazisha Sasa',
    offlineMode: 'Njia ya Nje ya Mtandao (Offline)',
    onlineMode: 'Njia ya Mtandaoni (Online)',
    allCaughtUp: 'Rekodi zote zimesawazishwa',
    filterBy: 'Chuja kulingana na',
    searchMember: 'Tafuta mwanachama au nambari...',
    copyCode: 'Nakili Msimbo',
    codeCopied: 'Msimbo umenakiliwa!',
    
    // Forms
    selectMember: 'Chagua Mwanachama',
    enterAmount: 'Kiasi (KSh)',
    enterNote: 'Maelezo / Msimbo wa M-Pesa / Sababu',
    adjustmentReason: 'Sababu ya lazima ya marekebisho',
    fineReason: 'Sababu ya faini (mfano: kuchelewa mkutanoni)',
    adjustmentTypePrompt: 'Aina ya Marekebisho',
    positiveCredit: 'Ongezeko (+) Mwanachama Alilipa Ziada',
    negativeDebit: 'Punguzo (-) Sahihisho au Makato',
    
    // M-Pesa Parser
    pasteSmsTitle: 'Bandika Ujumbe wa SMS wa M-Pesa',
    pasteSmsDesc: 'Bandika ujumbe wa M-Pesa. Mfumo utatoa kiotomatiki msimbo wa muamala, kiasi cha pesa, na nambari ya mtumaji.',
    pastePlaceholder: 'mfano: QA12BC34DE Imethibitishwa. Ksh1,500.00 zimetumwa kwa CHAMA SAVINGS 0712345678 mnamo 10/11/26 saa 9:15 AM.',
    detectedReceipt: 'Msimbo wa Muamala',
    detectedAmount: 'Kiasi Kilichotambuliwa',
    detectedSender: 'Nambari / Jina la Mtumaji',
    matchedMember: 'Mwanachama Aliyelingana',
    trySampleSms: 'Jaribu Mfano wa SMS',
    parseSuccess: 'Taarifa za M-Pesa zimetambuliwa kikamilifu!',
    parseError: 'Haikuweza kusoma taarifa za M-Pesa. Tafadhali hakikisha maandishi ni sahihi.',
    applyToForm: 'Tumia Taarifa Hizi',
    
    // Member restricted view
    memberRestrictedTitle: 'Kadi Yako Binafsi ya Chama',
    memberRestrictedSubtitle: 'Unaona michango na salio lako binafsi pekee kulingana na kanuni za chama.',
    yourBalance: 'Jumla Uliyochanga',
    amountDueNow: 'Kiasi Unachodaiwa Sasa',
    statusGoodStanding: 'Msimamo Mzuri (Haudaiwi)',
    statusArrears: 'Una Madeni Yanayosubiri',
    yourHistory: 'Historia ya Malipo Yako',
    noPersonalEntries: 'Bado hakuna malipo yaliyosajiliwa kwenye akaunti yako.',
    
    // Join flow
    enterJoinCode: 'Weka Msimbo wa Kujiunga (Nambari 6)',
    enterYourName: 'Jina Lako Kamili',
    enterYourPhone: 'Nambari ya Simu ya M-Pesa (mfano: 0712345678)',
    submitJoinRequest: 'Tuma Ombi la Kujiunga',
    waitingApprovalNotice: 'Ombi lako limetumwa. Tafadhali subiri Mweka Hazina au Msimamizi akuthibitishe.',
    alreadyMember: 'Wewe tayari ni mwanachama wa kikundi hiki.',
    groupNotFound: 'Kikundi chenye msimbo huu hakikupatikana.',
    
    // Switch User (Demo & Test)
    switchUser: 'Wasifu wa Mtumiaji Anayetumika',
    switchUserDesc: 'Badilisha mtumiaji ili kujaribu majukumu ya Msimamizi, Mweka Hazina, au Mwanachama.',
    
    // Offline status
    offlineBannerText: 'Uko nje ya mtandao. Malipo mapya yatahifadhiwa na kuwekwa alama "Inasubiri Kusawazishwa".',
    queuedItemsCount: 'malipo yanasubiri kusawazishwa',
    installApp: 'Sakinisha App',
    installPwaPrompt: 'Sakinisha Chama Ledger kwenye simu yako kwa matumizi rahisi hata bila mtandao.',
    
    // Common
    date: 'Tarehe',
    type: 'Aina',
    amount: 'Kiasi',
    balance: 'Salio',
    actions: 'Vitendo',
    emptyLedger: 'Bado hakuna rekodi za kifedha kwenye daftari.',
    emptyGroups: 'Hujajiunga na kikundi chochote bado.',
    noPendingRequests: 'Hakuna maombi yanayosubiri idhini.',
    ksh: 'KSh',
  },
};

export function t(key: keyof typeof translations.en, lang: Language): string {
  const dictionary = translations[lang] || translations.en;
  return dictionary[key] || translations.en[key] || key;
}
