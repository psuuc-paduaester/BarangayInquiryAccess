export type UserRole = 'resident' | 'admin' | 'records_officer' | 'field_officer';

export type AccountStatus = 'active' | 'deactivated' | 'pending_verification';

export type VerificationStatus = 'verified' | 'pending' | 'unverified';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  accountStatus: AccountStatus;
  createdAt: string;
  avatarUrl?: string;
  // Resident specific profile info
  address?: string;
  purok?: string;
  contactNumber?: string;
  verificationStatus?: VerificationStatus;
  idType?: string;
  idNumber?: string;
}

export type RequestType = 'service_request' | 'complaint';

export type SubmissionStatus =
  | 'submitted'
  | 'under_review'
  | 'in_progress'
  | 'resolved'
  | 'rejected'
  | 'returned_for_info'
  | 'cancelled';

export type UrgencyLevel = 'low' | 'normal' | 'urgent';

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface StatusHistoryEntry {
  id: string;
  changedBy: string;
  changedByRole: string;
  oldStatus?: SubmissionStatus;
  newStatus: SubmissionStatus;
  remarks: string;
  changedAt: string;
}

export interface FollowUpRemark {
  id: string;
  authorName: string;
  authorRole: 'resident' | 'official';
  message: string;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  type: RequestType;
  description: string;
  processingDays: number;
  feePhp: number;
  requirements: string[];
  isActive: boolean;
}

export interface ServiceSubmission {
  id: string;
  trackingCode: string; // e.g. BRGY-2026-SR-10294 or BRGY-2026-CP-49102
  requestType: RequestType;
  residentId: string;
  residentName: string;
  residentContact: string;
  residentAddress: string;
  residentPurok: string;
  categoryId: string;
  categoryName: string;
  subject: string;
  description: string;
  location: string;
  urgency: UrgencyLevel;
  status: SubmissionStatus;
  assignedTo?: string; // Staff name or title
  assignedStaffId?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  attachments: Attachment[];
  statusHistory: StatusHistoryEntry[];
  followUps: FollowUpRemark[];
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Advisory' | 'Health & Sanitation' | 'Peace & Order' | 'Community Event' | 'Emergency';
  publishedBy: string;
  publishAt: string;
  expiresAt?: string;
  isPinned: boolean;
  status: 'published' | 'draft' | 'archived';
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  trackingCode?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: 'service_request' | 'complaint' | 'user' | 'announcement' | 'category' | 'auth';
  entityId: string;
  details: string;
  createdAt: string;
}
