import {
  User,
  ServiceCategory,
  ServiceSubmission,
  Announcement,
  NotificationItem,
  AuditLog,
  SubmissionStatus,
  RequestType,
  UrgencyLevel,
} from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'brgy_sm_tarlac_current_user',
  USERS: 'brgy_sm_tarlac_users',
  CATEGORIES: 'brgy_sm_tarlac_categories',
  SUBMISSIONS: 'brgy_sm_tarlac_submissions',
  ANNOUNCEMENTS: 'brgy_sm_tarlac_announcements',
  NOTIFICATIONS: 'brgy_sm_tarlac_notifications',
  AUDIT_LOGS: 'brgy_sm_tarlac_audit_logs',
  REDUCED_MOTION: 'brgy_sm_tarlac_reduced_motion',
};

// Initial Sample Users
const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-01',
    fullName: 'Hon. Roberto Hernandez',
    email: 'admin@barangay.gov.ph',
    role: 'admin',
    accountStatus: 'active',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'usr-officer-01',
    fullName: 'Carmela Reyes (Desk Officer)',
    email: 'records@barangay.gov.ph',
    role: 'records_officer',
    accountStatus: 'active',
    createdAt: '2026-01-12T09:30:00Z',
  },
  {
    id: 'usr-tanod-01',
    fullName: 'Officer Danilo Morales (Tanod Chief)',
    email: 'tanod@barangay.gov.ph',
    role: 'field_officer',
    accountStatus: 'active',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'usr-res-01',
    fullName: 'Juan Dela Cruz',
    email: 'juan.delacruz@gmail.com',
    role: 'resident',
    accountStatus: 'active',
    createdAt: '2026-02-01T14:20:00Z',
    address: '142 Rizal St, Purok 3',
    purok: 'Purok 3 - Sampaguita',
    contactNumber: '0917-882-3411',
    verificationStatus: 'verified',
    idType: 'Philippine National ID',
    idNumber: 'PH-ID-9921-3312',
    avatarUrl: '/src/assets/images/resident_avatar_sample_1791899102511.jpg',
  },
  {
    id: 'usr-res-02',
    fullName: 'Maria Santos',
    email: 'maria.santos@gmail.com',
    role: 'resident',
    accountStatus: 'active',
    createdAt: '2026-02-15T11:10:00Z',
    address: '88 Mabini Ave, Purok 5',
    purok: 'Purok 5 - Ilang-Ilang',
    contactNumber: '0922-441-9982',
    verificationStatus: 'pending',
    idType: 'Postal ID',
    idNumber: 'POST-PAS-11204',
  },
];

// Initial Categories
const INITIAL_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat-clr',
    name: 'Barangay Clearance',
    type: 'service_request',
    description: 'Official clearance required for local employment, postal ID, bank application, or NBI processing.',
    processingDays: 1,
    feePhp: 50,
    requirements: ['1 Valid Government ID', 'Proof of Billing / Residency', 'Recent 1x1 Photo'],
    isActive: true,
  },
  {
    id: 'cat-ind',
    name: 'Certificate of Indigency',
    type: 'service_request',
    description: 'Issued for medical assistance (PCSO/Malasakit Center), educational scholarship, or legal assistance.',
    processingDays: 1,
    feePhp: 0,
    requirements: ['Case assessment note', 'Valid ID of representative or applicant', 'Hospital bill / enrollment form'],
    isActive: true,
  },
  {
    id: 'cat-res',
    name: 'Certificate of Residency',
    type: 'service_request',
    description: 'Proof of bona fide residency within Barangay San Miguel, San Manuel, Tarlac for school admission, court, or bank requirements.',
    processingDays: 1,
    feePhp: 50,
    requirements: ['Valid ID with current address', 'Purok Leader Endorsement'],
    isActive: true,
  },
  {
    id: 'cat-biz',
    name: 'Barangay Business Clearance',
    type: 'service_request',
    description: 'Permit endorsement needed for local business renewal or new municipal business license.',
    processingDays: 3,
    feePhp: 200,
    requirements: ['DTI / SEC Registration', 'Contract of Lease / Property Title', 'Barangay Inspection Clearance'],
    isActive: true,
  },
  {
    id: 'cat-fcl',
    name: 'Covered Court / Hall Reservation',
    type: 'service_request',
    description: 'Civic facility reservation for sports tournaments, community seminars, or civic gatherings.',
    processingDays: 2,
    feePhp: 350,
    requirements: ['Event request letter', 'Responsible committee organizer ID'],
    isActive: true,
  },
  {
    id: 'cat-cp-gar',
    name: 'Garbage & Sanitation Hazard',
    type: 'complaint',
    description: 'Report uncollected garbage piles, open burning (anti-smoke), or improper commercial waste disposal.',
    processingDays: 2,
    feePhp: 0,
    requirements: ['Exact location / landmark', 'Clear photo of the waste pile'],
    isActive: true,
  },
  {
    id: 'cat-cp-str',
    name: 'Defective Streetlight & Dark Alley',
    type: 'complaint',
    description: 'Report non-functioning streetlights, exposed live wires, or unlit safety zones in your purok.',
    processingDays: 2,
    feePhp: 0,
    requirements: ['Pole number or nearest street landmark'],
    isActive: true,
  },
  {
    id: 'cat-cp-noi',
    name: 'Noise Disturbance & Videoke Nuisance',
    type: 'complaint',
    description: 'Report excessive loud music, midnight videoke past curfew (10:00 PM), or unruly neighborhood disturbances.',
    processingDays: 1,
    feePhp: 0,
    requirements: ['Address / Purok of source', 'Approximate duration of disturbance'],
    isActive: true,
  },
  {
    id: 'cat-cp-drn',
    name: 'Drainage Clogging & Flooding',
    type: 'complaint',
    description: 'Report silted gutters, blocked canals, construction debris obstruction, or standing wastewater.',
    processingDays: 3,
    feePhp: 0,
    requirements: ['Canal location', 'Photo of blockage'],
    isActive: true,
  },
  {
    id: 'cat-cp-ani',
    name: 'Stray Animal & Pet Nuisance',
    type: 'complaint',
    description: 'Report aggressive stray dogs, barking nuisance, or unvaccinated animal risks on public streets.',
    processingDays: 2,
    feePhp: 0,
    requirements: ['Street / Purok location', 'Description of animal'],
    isActive: true,
  },
];

// Initial Submissions
const INITIAL_SUBMISSIONS: ServiceSubmission[] = [
  {
    id: 'sub-01',
    trackingCode: 'BRGY-2026-SR-89241',
    requestType: 'service_request',
    residentId: 'usr-res-01',
    residentName: 'Juan Dela Cruz',
    residentContact: '0917-882-3411',
    residentAddress: '142 Rizal St, Purok 3',
    residentPurok: 'Purok 3 - Sampaguita',
    categoryId: 'cat-clr',
    categoryName: 'Barangay Clearance',
    subject: 'Barangay Clearance for Local Employment Application',
    description: 'Applying for job requirements at Tarlac Agricultural & Industrial District. Need certified clearance with seal.',
    location: '142 Rizal St, Purok 3',
    urgency: 'normal',
    status: 'in_progress',
    assignedTo: 'Desk Officer Carmela Reyes',
    assignedStaffId: 'usr-officer-01',
    attachments: [
      {
        id: 'att-01',
        name: 'National_ID_JuanDelaCruz.pdf',
        size: '1.4 MB',
        type: 'application/pdf',
        url: '#',
        uploadedAt: '2026-10-10T09:15:00Z',
      },
    ],
    statusHistory: [
      {
        id: 'sth-01',
        changedBy: 'Juan Dela Cruz',
        changedByRole: 'Resident',
        newStatus: 'submitted',
        remarks: 'Initial online application submitted via resident portal.',
        changedAt: '2026-10-10T09:15:00Z',
      },
      {
        id: 'sth-02',
        changedBy: 'Hon. Roberto Hernandez',
        changedByRole: 'Punong Barangay',
        oldStatus: 'submitted',
        newStatus: 'under_review',
        remarks: 'Documents verified bona fide. Forwarded to Records Desk for clearance preparation.',
        changedAt: '2026-10-10T11:00:00Z',
      },
      {
        id: 'sth-03',
        changedBy: 'Desk Officer Carmela Reyes',
        changedByRole: 'Records Officer',
        oldStatus: 'under_review',
        newStatus: 'in_progress',
        remarks: 'Document generated and queued for Barangay Captain official dry seal and signature.',
        changedAt: '2026-10-11T08:30:00Z',
      },
    ],
    followUps: [
      {
        id: 'flw-01',
        authorName: 'Desk Officer Carmela Reyes',
        authorRole: 'official',
        message: 'Your clearance has been printed and is awaiting Captain signature. Ready for pick-up by tomorrow afternoon.',
        createdAt: '2026-10-11T08:45:00Z',
      },
    ],
    createdAt: '2026-10-10T09:15:00Z',
    updatedAt: '2026-10-11T08:45:00Z',
  },
  {
    id: 'sub-02',
    trackingCode: 'BRGY-2026-SR-89218',
    requestType: 'service_request',
    residentId: 'usr-res-01',
    residentName: 'Juan Dela Cruz',
    residentContact: '0917-882-3411',
    residentAddress: '142 Rizal St, Purok 3',
    residentPurok: 'Purok 3 - Sampaguita',
    categoryId: 'cat-ind',
    categoryName: 'Certificate of Indigency',
    subject: 'Certificate of Indigency for Hospitalization Subsidy',
    description: 'Required by Tarlac Provincial Hospital / San Manuel Rural Health Unit for medical discount.',
    location: '142 Rizal St, Purok 3',
    urgency: 'urgent',
    status: 'resolved',
    assignedTo: 'Desk Officer Carmela Reyes',
    assignedStaffId: 'usr-officer-01',
    resolutionNotes: 'Certificate of Indigency issued fee-waived and claimed at Barangay Front Desk Window 2.',
    resolvedAt: '2026-10-08T16:00:00Z',
    attachments: [
      {
        id: 'att-02',
        name: 'Hospital_Admission_Slip.jpg',
        size: '2.1 MB',
        type: 'image/jpeg',
        url: '#',
        uploadedAt: '2026-10-08T08:00:00Z',
      },
    ],
    statusHistory: [
      {
        id: 'sth-04',
        changedBy: 'Juan Dela Cruz',
        changedByRole: 'Resident',
        newStatus: 'submitted',
        remarks: 'Request submitted online with hospital documentation.',
        changedAt: '2026-10-08T08:00:00Z',
      },
      {
        id: 'sth-05',
        changedBy: 'Desk Officer Carmela Reyes',
        changedByRole: 'Records Officer',
        oldStatus: 'submitted',
        newStatus: 'in_progress',
        remarks: 'Emergency social assessment approved immediately.',
        changedAt: '2026-10-08T09:10:00Z',
      },
      {
        id: 'sth-06',
        changedBy: 'Desk Officer Carmela Reyes',
        changedByRole: 'Records Officer',
        oldStatus: 'in_progress',
        newStatus: 'resolved',
        remarks: 'Certificate signed by Punong Barangay and officially released to applicant.',
        changedAt: '2026-10-08T16:00:00Z',
      },
    ],
    followUps: [],
    createdAt: '2026-10-08T08:00:00Z',
    updatedAt: '2026-10-08T16:00:00Z',
  },
  {
    id: 'sub-03',
    trackingCode: 'BRGY-2026-CP-41029',
    requestType: 'complaint',
    residentId: 'usr-res-01',
    residentName: 'Juan Dela Cruz',
    residentContact: '0917-882-3411',
    residentAddress: '142 Rizal St, Purok 3',
    residentPurok: 'Purok 3 - Sampaguita',
    categoryId: 'cat-cp-str',
    categoryName: 'Defective Streetlight & Dark Alley',
    subject: 'Defective Streetlight along Corner Rizal St and Sampaguita Path',
    description: 'The light pole has been flickering and completely turned off for three nights. It is dangerous for pedestrians and students walking home.',
    location: 'Corner Rizal St. & Sampaguita Alley, Purok 3 (Near Landmark: Water Station)',
    urgency: 'urgent',
    status: 'in_progress',
    assignedTo: 'Officer Danilo Morales (Tanod Chief)',
    assignedStaffId: 'usr-tanod-01',
    attachments: [
      {
        id: 'att-03',
        name: 'Dark_Alley_Photo.jpg',
        size: '1.8 MB',
        type: 'image/jpeg',
        url: '#',
        uploadedAt: '2026-10-11T19:00:00Z',
      },
    ],
    statusHistory: [
      {
        id: 'sth-07',
        changedBy: 'Juan Dela Cruz',
        changedByRole: 'Resident',
        newStatus: 'submitted',
        remarks: 'Complaint filed with photo evidence.',
        changedAt: '2026-10-11T19:00:00Z',
      },
      {
        id: 'sth-08',
        changedBy: 'Hon. Roberto Hernandez',
        changedByRole: 'Punong Barangay',
        oldStatus: 'submitted',
        newStatus: 'under_review',
        remarks: 'Assigned to Tanod Chief & Barangay Maintenance Electrician team for on-site inspection.',
        changedAt: '2026-10-12T07:30:00Z',
      },
      {
        id: 'sth-09',
        changedBy: 'Officer Danilo Morales',
        changedByRole: 'Field Officer',
        oldStatus: 'under_review',
        newStatus: 'in_progress',
        remarks: 'Inspection conducted. The LED ballast needs replacement. Parts requisition submitted to Barangay Treasurer; replacement scheduled today.',
        changedAt: '2026-10-12T14:10:00Z',
      },
    ],
    followUps: [
      {
        id: 'flw-02',
        authorName: 'Officer Danilo Morales',
        authorRole: 'official',
        message: 'Maintenance team will install the new 50W LED fixture between 2:00 PM and 4:00 PM today.',
        createdAt: '2026-10-12T14:15:00Z',
      },
    ],
    createdAt: '2026-10-11T19:00:00Z',
    updatedAt: '2026-10-12T14:15:00Z',
  },
  {
    id: 'sub-04',
    trackingCode: 'BRGY-2026-CP-41014',
    requestType: 'complaint',
    residentId: 'usr-res-02',
    residentName: 'Maria Santos',
    residentContact: '0922-441-9982',
    residentAddress: '88 Mabini Ave, Purok 5',
    residentPurok: 'Purok 5 - Ilang-Ilang',
    categoryId: 'cat-cp-gar',
    categoryName: 'Garbage & Sanitation Hazard',
    subject: 'Uncollected Trash Pile Near Purok 5 Daycare Center',
    description: 'Black trash bags accumulated over the weekend causing foul odor and fly infestation near the daycare playground.',
    location: 'Behind Purok 5 Daycare Center, Mabini Avenue',
    urgency: 'normal',
    status: 'resolved',
    assignedTo: 'Barangay Health & Sanitation Committee',
    resolutionNotes: 'Barangay dump truck dispatched. All accumulated garbage hauled and area disinfected with chlorine solution.',
    resolvedAt: '2026-10-09T11:30:00Z',
    attachments: [],
    statusHistory: [
      {
        id: 'sth-10',
        changedBy: 'Maria Santos',
        changedByRole: 'Resident',
        newStatus: 'submitted',
        remarks: 'Reported online.',
        changedAt: '2026-10-08T10:00:00Z',
      },
      {
        id: 'sth-11',
        changedBy: 'Hon. Roberto Hernandez',
        changedByRole: 'Punong Barangay',
        oldStatus: 'submitted',
        newStatus: 'in_progress',
        remarks: 'Sanitation unit notified for urgent dispatch.',
        changedAt: '2026-10-08T11:20:00Z',
      },
      {
        id: 'sth-12',
        changedBy: 'Desk Officer Carmela Reyes',
        changedByRole: 'Records Officer',
        oldStatus: 'in_progress',
        newStatus: 'resolved',
        remarks: 'Hauling complete. Photo proof uploaded to barangay log.',
        changedAt: '2026-10-09T11:30:00Z',
      },
    ],
    followUps: [],
    createdAt: '2026-10-08T10:00:00Z',
    updatedAt: '2026-10-09T11:30:00Z',
  },
  {
    id: 'sub-05',
    trackingCode: 'BRGY-2026-CP-41050',
    requestType: 'complaint',
    residentId: 'usr-res-01',
    residentName: 'Juan Dela Cruz',
    residentContact: '0917-882-3411',
    residentAddress: '142 Rizal St, Purok 3',
    residentPurok: 'Purok 3 - Sampaguita',
    categoryId: 'cat-cp-noi',
    categoryName: 'Noise Disturbance & Videoke Nuisance',
    subject: 'Late Night Videoke Disturbance Beyond Curfew',
    description: 'Loud singing and bass speakers continuing past 11:30 PM on weeknights affecting resting workers and infants.',
    location: 'Alley 2, Near Corner Sampaguita St.',
    urgency: 'normal',
    status: 'under_review',
    attachments: [],
    statusHistory: [
      {
        id: 'sth-13',
        changedBy: 'Juan Dela Cruz',
        changedByRole: 'Resident',
        newStatus: 'submitted',
        remarks: 'Complaint filed online.',
        changedAt: '2026-10-12T23:40:00Z',
      },
      {
        id: 'sth-14',
        changedBy: 'Desk Officer Carmela Reyes',
        changedByRole: 'Desk Officer',
        oldStatus: 'submitted',
        newStatus: 'under_review',
        remarks: 'Noted. Night shift Tanod Mobile Patrol advised to issue first advisory warning.',
        changedAt: '2026-10-13T06:00:00Z',
      },
    ],
    followUps: [],
    createdAt: '2026-10-12T23:40:00Z',
    updatedAt: '2026-10-13T06:00:00Z',
  },
];

// Initial Announcements
const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-01',
    title: 'Advisory: Scheduled TARELCO I Maintenance and Power Interruption',
    content: 'Tarlac I Electric Cooperative, Inc. (TARELCO I) advises all residents of Purok 1, Purok 2, and Purok 3 of a temporary power interruption on Saturday, October 18, 2026, from 8:00 AM to 1:00 PM due to pole replacement and transformer upgrading along Barangay San Miguel Main Road. Please charge emergency lamps and disconnect sensitive electronics.',
    category: 'Advisory',
    publishedBy: 'Office of the Punong Barangay',
    publishAt: '2026-10-12T08:00:00Z',
    expiresAt: '2026-10-19T23:59:00Z',
    isPinned: true,
    status: 'published',
  },
  {
    id: 'ann-02',
    title: 'Free Anti-Rabies Vaccination & Pet Microchipping Drive',
    content: 'In coordination with the San Manuel Municipal Agriculture and Veterinary Office, free anti-rabies vaccination and pet registration will be held at the Barangay San Miguel Covered Court this coming Thursday, October 16, starting at 8:30 AM. Please ensure dogs are on leash and cats are in carriers.',
    category: 'Health & Sanitation',
    publishedBy: 'Barangay Health Committee',
    publishAt: '2026-10-10T09:00:00Z',
    isPinned: true,
    status: 'published',
  },
  {
    id: 'ann-03',
    title: 'Barangay General Assembly & State of the Barangay Address (SOBA)',
    content: 'All residents of Barangay San Miguel, San Manuel, Tarlac aged 15 and above are cordially invited to attend the 2nd Semester General Assembly on Sunday, October 26, 2026, 2:00 PM at the Civic Gymnasium. Discussion of 2026 Accomplishments, 2027 Annual Investment Plan, and open citizen consultation.',
    category: 'Community Event',
    publishedBy: 'Sangguniang Barangay',
    publishAt: '2026-10-09T10:00:00Z',
    isPinned: false,
    status: 'published',
  },
  {
    id: 'ann-04',
    title: 'Oplan Linis Ilog & Anti-Dengue Fogging Operations',
    content: 'To prevent dengue cases during the rainy season, our BHERT team and Sanitation personnel will conduct misting and canal clearing in Purok 4, 5, and 6 every Wednesday morning. Residents are requested to eliminate stagnant water containers.',
    category: 'Health & Sanitation',
    publishedBy: 'Barangay Disaster Risk Reduction Committee',
    publishAt: '2026-10-05T07:30:00Z',
    isPinned: false,
    status: 'published',
  },
];

// Initial Notifications
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    userId: 'usr-res-01',
    title: 'Status Update: Defective Streetlight',
    message: 'Your complaint BRGY-2026-CP-41029 is now In Progress. Replacement LED fixture scheduled today.',
    trackingCode: 'BRGY-2026-CP-41029',
    isRead: false,
    createdAt: '2026-10-12T14:15:00Z',
  },
  {
    id: 'notif-02',
    userId: 'usr-res-01',
    title: 'Clearance Preparation Underway',
    message: 'Your Barangay Clearance application BRGY-2026-SR-89241 is being processed by Records Desk.',
    trackingCode: 'BRGY-2026-SR-89241',
    isRead: true,
    createdAt: '2026-10-11T08:30:00Z',
  },
  {
    id: 'notif-03',
    userId: 'usr-res-01',
    title: 'Service Request Resolved',
    message: 'Certificate of Indigency BRGY-2026-SR-89218 has been signed and officially released.',
    trackingCode: 'BRGY-2026-SR-89218',
    isRead: true,
    createdAt: '2026-10-08T16:00:00Z',
  },
];

// Initial Audit Logs
const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-01',
    userId: 'usr-officer-01',
    userName: 'Desk Officer Carmela Reyes',
    userRole: 'Records Officer',
    action: 'STATUS_UPDATE',
    entityType: 'service_request',
    entityId: 'BRGY-2026-SR-89241',
    details: 'Changed status from under_review to in_progress with remarks: Document generated and queued for signature.',
    createdAt: '2026-10-11T08:30:00Z',
  },
  {
    id: 'aud-02',
    userId: 'usr-tanod-01',
    userName: 'Officer Danilo Morales',
    userRole: 'Field Officer',
    action: 'ASSIGNMENT_ACCEPTED',
    entityType: 'complaint',
    entityId: 'BRGY-2026-CP-41029',
    details: 'Conducted field inspection for street lamp and scheduled parts replacement.',
    createdAt: '2026-10-12T14:10:00Z',
  },
  {
    id: 'aud-03',
    userId: 'usr-admin-01',
    userName: 'Hon. Roberto Hernandez',
    userRole: 'Punong Barangay',
    action: 'ANNOUNCEMENT_PUBLISHED',
    entityType: 'announcement',
    entityId: 'ann-01',
    details: 'Published advisory regarding Meralco power interruption.',
    createdAt: '2026-10-12T08:00:00Z',
  },
];

export class StorageService {
  private static get<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch {
      return fallback;
    }
  }

  private static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }

  // Current User
  static getCurrentUser(): User | null {
    return this.get<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  static setCurrentUser(user: User | null): void {
    this.set(STORAGE_KEYS.CURRENT_USER, user);
  }

  // Users
  static getUsers(): User[] {
    return this.get<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  static saveUsers(users: User[]): void {
    this.set(STORAGE_KEYS.USERS, users);
  }

  // Categories
  static getCategories(): ServiceCategory[] {
    return this.get<ServiceCategory[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  static saveCategories(categories: ServiceCategory[]): void {
    this.set(STORAGE_KEYS.CATEGORIES, categories);
  }

  // Submissions
  static getSubmissions(): ServiceSubmission[] {
    return this.get<ServiceSubmission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
  }

  static saveSubmissions(submissions: ServiceSubmission[]): void {
    this.set(STORAGE_KEYS.SUBMISSIONS, submissions);
  }

  // Announcements
  static getAnnouncements(): Announcement[] {
    return this.get<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  }

  static saveAnnouncements(announcements: Announcement[]): void {
    this.set(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  }

  // Notifications
  static getNotifications(): NotificationItem[] {
    return this.get<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  static saveNotifications(notifications: NotificationItem[]): void {
    this.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  // Audit Logs
  static getAuditLogs(): AuditLog[] {
    return this.get<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  static saveAuditLogs(logs: AuditLog[]): void {
    this.set(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  static addAuditLog(
    user: User,
    action: string,
    entityType: AuditLog['entityType'],
    entityId: string,
    details: string
  ): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      action,
      entityType,
      entityId,
      details,
      createdAt: new Date().toISOString(),
    };
    this.saveAuditLogs([newLog, ...logs]);
  }

  // Reduced motion preference
  static getReducedMotion(): boolean {
    return this.get<boolean>(STORAGE_KEYS.REDUCED_MOTION, false);
  }

  static setReducedMotion(value: boolean): void {
    this.set(STORAGE_KEYS.REDUCED_MOTION, value);
  }

  // Helper: Find by tracking code (case insensitive)
  static findSubmissionByTracking(code: string): ServiceSubmission | undefined {
    const cleanCode = code.trim().toUpperCase();
    const subs = this.getSubmissions();
    return subs.find((s) => s.trackingCode.toUpperCase() === cleanCode);
  }

  // Create submission
  static createSubmission(
    user: User,
    data: {
      requestType: RequestType;
      categoryId: string;
      subject: string;
      description: string;
      location: string;
      urgency: UrgencyLevel;
      attachments?: { name: string; size: string; type: string }[];
    }
  ): ServiceSubmission {
    const categories = this.getCategories();
    const category = categories.find((c) => c.id === data.categoryId);
    const categoryName = category ? category.name : 'General Civic Request';

    // Generate readable predictable tracking code
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const prefix = data.requestType === 'service_request' ? 'SR' : 'CP';
    const trackingCode = `BRGY-2026-${prefix}-${randomDigits}`;

    const now = new Date().toISOString();
    const newSubmission: ServiceSubmission = {
      id: `sub-${Date.now()}`,
      trackingCode,
      requestType: data.requestType,
      residentId: user.id,
      residentName: user.fullName,
      residentContact: user.contactNumber || 'N/A',
      residentAddress: user.address || 'Brgy. San Miguel, San Manuel, Tarlac',
      residentPurok: user.purok || 'Purok 1',
      categoryId: data.categoryId,
      categoryName,
      subject: data.subject.trim(),
      description: data.description.trim(),
      location: data.location.trim(),
      urgency: data.urgency,
      status: 'submitted',
      attachments: (data.attachments || []).map((att, idx) => ({
        id: `att-${Date.now()}-${idx}`,
        name: att.name,
        size: att.size,
        type: att.type,
        url: '#',
        uploadedAt: now,
      })),
      statusHistory: [
        {
          id: `sth-${Date.now()}`,
          changedBy: user.fullName,
          changedByRole: 'Resident',
          newStatus: 'submitted',
          remarks: `Initial submission received via civic portal.`,
          changedAt: now,
        },
      ],
      followUps: [],
      createdAt: now,
      updatedAt: now,
    };

    const all = this.getSubmissions();
    this.saveSubmissions([newSubmission, ...all]);

    // Add Audit Log
    this.addAuditLog(
      user,
      'SUBMISSION_CREATED',
      data.requestType,
      trackingCode,
      `Submitted ${categoryName}: "${data.subject}"`
    );

    // Add Notification for Resident
    const notifs = this.getNotifications();
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: user.id,
      title: `${data.requestType === 'service_request' ? 'Request' : 'Complaint'} Logged`,
      message: `Your ${categoryName} has been submitted with tracking code ${trackingCode}.`,
      trackingCode,
      isRead: false,
      createdAt: now,
    };
    this.saveNotifications([newNotif, ...notifs]);

    return newSubmission;
  }

  // Update submission status (Admin / Staff)
  static updateSubmissionStatus(
    officer: User,
    submissionId: string,
    newStatus: SubmissionStatus,
    remarks: string,
    assignedTo?: string,
    resolutionNotes?: string
  ): ServiceSubmission | null {
    const subs = this.getSubmissions();
    const index = subs.findIndex((s) => s.id === submissionId);
    if (index === -1) return null;

    const current = subs[index];
    const oldStatus = current.status;
    const now = new Date().toISOString();

    const historyEntry = {
      id: `sth-${Date.now()}`,
      changedBy: officer.fullName,
      changedByRole: officer.role.replace('_', ' ').toUpperCase(),
      oldStatus,
      newStatus,
      remarks: remarks.trim() || `Status updated to ${newStatus.replace('_', ' ')}`,
      changedAt: now,
    };

    const updated: ServiceSubmission = {
      ...current,
      status: newStatus,
      assignedTo: assignedTo !== undefined ? assignedTo : current.assignedTo,
      resolutionNotes: resolutionNotes !== undefined ? resolutionNotes : current.resolutionNotes,
      resolvedAt: newStatus === 'resolved' ? now : current.resolvedAt,
      statusHistory: [...current.statusHistory, historyEntry],
      updatedAt: now,
    };

    subs[index] = updated;
    this.saveSubmissions([...subs]);

    // Audit log
    this.addAuditLog(
      officer,
      'STATUS_UPDATED',
      current.requestType,
      current.trackingCode,
      `Changed from ${oldStatus} to ${newStatus}. Remarks: "${remarks}"`
    );

    // Resident notification
    const notifs = this.getNotifications();
    const friendlyStatus = newStatus.replace(/_/g, ' ').toUpperCase();
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: current.residentId,
      title: `Status: ${friendlyStatus}`,
      message: `Your submission ${current.trackingCode} is now ${friendlyStatus}. ${remarks ? `"${remarks}"` : ''}`,
      trackingCode: current.trackingCode,
      isRead: false,
      createdAt: now,
    };
    this.saveNotifications([newNotif, ...notifs]);

    return updated;
  }

  // Add follow-up remark
  static addFollowUpRemark(
    user: User,
    submissionId: string,
    message: string
  ): ServiceSubmission | null {
    const subs = this.getSubmissions();
    const index = subs.findIndex((s) => s.id === submissionId);
    if (index === -1) return null;

    const current = subs[index];
    const now = new Date().toISOString();
    const remark = {
      id: `flw-${Date.now()}`,
      authorName: user.fullName,
      authorRole: (user.role === 'resident' ? 'resident' : 'official') as 'resident' | 'official',
      message: message.trim(),
      createdAt: now,
    };

    const updated: ServiceSubmission = {
      ...current,
      followUps: [...current.followUps, remark],
      updatedAt: now,
    };

    subs[index] = updated;
    this.saveSubmissions([...subs]);

    this.addAuditLog(
      user,
      'FOLLOWUP_ADDED',
      current.requestType,
      current.trackingCode,
      `Message posted: "${message.slice(0, 80)}..."`
    );

    return updated;
  }

  // Reset demo data
  static resetToDefaultData(): void {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    this.saveUsers(INITIAL_USERS);
    this.saveCategories(INITIAL_CATEGORIES);
    this.saveSubmissions(INITIAL_SUBMISSIONS);
    this.saveAnnouncements(INITIAL_ANNOUNCEMENTS);
    this.saveNotifications(INITIAL_NOTIFICATIONS);
    this.saveAuditLogs(INITIAL_AUDIT_LOGS);
  }
}
