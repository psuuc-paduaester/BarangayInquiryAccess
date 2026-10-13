import React, { useState } from 'react';
import {
  Shield,
  FileText,
  AlertTriangle,
  Users,
  Megaphone,
  BarChart3,
  History,
  Settings,
  Search,
  Filter,
  Plus,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  UserCheck,
  ChevronRight,
  Eye,
  Trash2,
  Edit,
  Pin,
  Lock,
  FileCode,
  RotateCcw,
  X,
} from 'lucide-react';
import {
  ServiceSubmission,
  User,
  Announcement,
  AuditLog,
  ServiceCategory,
  SubmissionStatus,
  RequestType,
} from '../../types';
import { StorageService } from '../../services/storage';
import { generateSqlSchema, generateSqlSeed } from '../../services/sqlExport';
import { AdminRequestDetailModal } from './AdminRequestDetailModal';

interface AdminDashboardProps {
  currentUser: User;
  submissions: ServiceSubmission[];
  categories: ServiceCategory[];
  announcements: Announcement[];
  auditLogs: AuditLog[];
  users: User[];
  onRefreshData: () => void;
  onPrintSlip: (submission: ServiceSubmission) => void;
  onOpenSqlModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  submissions,
  categories,
  announcements,
  auditLogs,
  users,
  onRefreshData,
  onPrintSlip,
  onOpenSqlModal,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    'overview' | 'submissions' | 'announcements' | 'residents' | 'reports' | 'audit' | 'settings'
  >('overview');

  // Submissions filters
  const [selectedSubmission, setSelectedSubmission] = useState<ServiceSubmission | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'service_request' | 'complaint'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [purokFilter, setPurokFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Announcement modal state
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<Announcement['category']>('Advisory');
  const [annIsPinned, setAnnIsPinned] = useState(false);

  // Quick stats
  const totalSubmissions = submissions.length;
  const pendingWorkload = submissions.filter((s) => s.status === 'submitted' || s.status === 'under_review').length;
  const inProgressCount = submissions.filter((s) => s.status === 'in_progress').length;
  const resolvedCount = submissions.filter((s) => s.status === 'resolved').length;
  const urgentCount = submissions.filter((s) => s.urgency === 'urgent' && s.status !== 'resolved').length;
  const totalResidents = users.filter((u) => u.role === 'resident').length;

  // Filtered submissions
  const filteredSubmissions = submissions.filter((s) => {
    if (typeFilter !== 'all' && s.requestType !== typeFilter) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (purokFilter !== 'all' && s.residentPurok !== purokFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = s.trackingCode.toLowerCase().includes(q);
      const matchName = s.residentName.toLowerCase().includes(q);
      const matchSubject = s.subject.toLowerCase().includes(q);
      const matchCat = s.categoryName.toLowerCase().includes(q);
      return matchCode || matchName || matchSubject || matchCat;
    }

    return true;
  });

  // Verify Resident
  const handleToggleVerification = (resident: User) => {
    const updatedStatus = resident.verificationStatus === 'verified' ? 'pending' : 'verified';
    const allUsers = StorageService.getUsers();
    const idx = allUsers.findIndex((u) => u.id === resident.id);
    if (idx !== -1) {
      allUsers[idx] = { ...resident, verificationStatus: updatedStatus };
      StorageService.saveUsers([...allUsers]);
      StorageService.addAuditLog(
        currentUser,
        'VERIFICATION_UPDATED',
        'user',
        resident.id,
        `Resident ${resident.fullName} verification set to ${updatedStatus}`
      );
      onRefreshData();
    }
  };

  // Toggle Account Active / Deactivated
  const handleToggleAccountActive = (accountUser: User) => {
    const nextStatus = accountUser.accountStatus === 'active' ? 'deactivated' : 'active';
    const allUsers = StorageService.getUsers();
    const idx = allUsers.findIndex((u) => u.id === accountUser.id);
    if (idx !== -1) {
      allUsers[idx] = { ...accountUser, accountStatus: nextStatus };
      StorageService.saveUsers([...allUsers]);
      StorageService.addAuditLog(
        currentUser,
        'ACCOUNT_STATUS_CHANGE',
        'user',
        accountUser.id,
        `Account status changed to ${nextStatus}`
      );
      onRefreshData();
    }
  };

  // Create Announcement
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: annTitle.trim(),
      content: annContent.trim(),
      category: annCategory,
      publishedBy: currentUser.fullName,
      publishAt: new Date().toISOString(),
      isPinned: annIsPinned,
      status: 'published',
    };

    const currentAnnouncements = StorageService.getAnnouncements();
    StorageService.saveAnnouncements([newAnn, ...currentAnnouncements]);
    StorageService.addAuditLog(
      currentUser,
      'ANNOUNCEMENT_CREATED',
      'announcement',
      newAnn.id,
      `Published announcement: "${newAnn.title}"`
    );

    setShowAnnModal(false);
    setAnnTitle('');
    setAnnContent('');
    onRefreshData();
  };

  // Delete Announcement
  const handleDeleteAnnouncement = (id: string) => {
    if (!confirm('Are you sure you want to remove this announcement from the public board?')) return;
    const currentAnnouncements = StorageService.getAnnouncements();
    const filtered = currentAnnouncements.filter((a) => a.id !== id);
    StorageService.saveAnnouncements(filtered);
    StorageService.addAuditLog(currentUser, 'ANNOUNCEMENT_DELETED', 'announcement', id, 'Deleted announcement');
    onRefreshData();
  };

  // CSV Export for Reports
  const handleExportCsv = () => {
    const headers = [
      'Tracking Code',
      'Type',
      'Category',
      'Subject',
      'Resident Name',
      'Contact',
      'Purok',
      'Urgency',
      'Status',
      'Assigned Officer',
      'Date Submitted',
      'Date Resolved',
    ];

    const rows = submissions.map((s) => [
      s.trackingCode,
      s.requestType,
      s.categoryName,
      `"${s.subject.replace(/"/g, '""')}"`,
      `"${s.residentName.replace(/"/g, '""')}"`,
      s.residentContact,
      `"${s.residentPurok}"`,
      s.urgency,
      s.status,
      `"${s.assignedTo || 'Unassigned'}"`,
      new Date(s.createdAt).toLocaleDateString(),
      s.resolvedAt ? new Date(s.resolvedAt).toLocaleDateString() : 'Pending',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Barangay_SanMiguel_SanManuel_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download SQL Backup
  const handleDownloadSql = () => {
    const fullSql = generateSqlSchema() + '\n\n' + generateSqlSeed();
    const blob = new Blob([fullSql], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'barangay_portal_db.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">Resolved</span>;
      case 'in_progress':
        return <span className="text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">In Progress</span>;
      case 'under_review':
        return <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">Under Review</span>;
      case 'rejected':
        return <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">Rejected</span>;
      default:
        return <span className="text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">Submitted</span>;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5">
      {/* TOP DESK HEADER */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Barangay Official Administrative Console
            </h1>
          </div>
          <p className="text-xs text-slate-300">
            Authenticated as: <span className="font-semibold text-teal-400">{currentUser.fullName}</span> ({currentUser.role.replace('_', ' ').toUpperCase()})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadSql}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download SQL Backup</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto text-xs font-semibold">
        {[
          { key: 'overview', label: 'Overview Dashboard', icon: BarChart3 },
          { key: 'submissions', label: `Service Requests & Complaints (${submissions.length})`, icon: FileText },
          { key: 'announcements', label: `Announcements (${announcements.length})`, icon: Megaphone },
          { key: 'residents', label: `Resident Registry (${totalResidents})`, icon: Users },
          { key: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
          { key: 'audit', label: `Audit Trail (${auditLogs.length})`, icon: History },
          { key: 'settings', label: 'Database & Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-teal-600 text-teal-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">Pending Workload</p>
              <p className="text-2xl font-bold font-mono-numbers text-amber-600 mt-1">{pendingWorkload}</p>
              <p className="text-[11px] text-slate-400 mt-1">Submitted or Under Review</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">Active In-Progress</p>
              <p className="text-2xl font-bold font-mono-numbers text-teal-600 mt-1">{inProgressCount}</p>
              <p className="text-[11px] text-slate-400 mt-1">Being processed / Field Tanod</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">Resolved / Completed</p>
              <p className="text-2xl font-bold font-mono-numbers text-emerald-600 mt-1">{resolvedCount}</p>
              <p className="text-[11px] text-slate-400 mt-1">Successfully cleared</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">Urgent Hazards Flagged</p>
              <p className="text-2xl font-bold font-mono-numbers text-rose-600 mt-1">{urgentCount}</p>
              <p className="text-[11px] text-slate-400 mt-1">Requires immediate Tanod attention</p>
            </div>
          </div>

          {/* TWO COLUMN GRID: URGENT WORKLOAD & CATEGORY DISTRIBUTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgent / Pending Queue */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Immediate Action Queue</span>
                </h3>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className="text-xs text-teal-700 hover:underline"
                >
                  View All Submissions
                </button>
              </div>

              <div className="space-y-2.5">
                {submissions
                  .filter((s) => s.status !== 'resolved' && s.status !== 'cancelled')
                  .slice(0, 5)
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedSubmission(item)}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-numbers font-bold text-slate-900">
                            {item.trackingCode}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-600 truncate">{item.categoryName}</span>
                        </div>
                        <p className="font-semibold text-slate-800 truncate mt-0.5">{item.subject}</p>
                        <p className="text-[11px] text-slate-500">By {item.residentName} · {item.residentPurok}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {getStatusBadge(item.status)}
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Purok Distribution Breakdown */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Submissions by Purok / Zone
              </h3>

              <div className="space-y-2.5 text-xs">
                {[
                  'Purok 1 - Rose',
                  'Purok 2 - Dahlia',
                  'Purok 3 - Sampaguita',
                  'Purok 4 - Camia',
                  'Purok 5 - Ilang-Ilang',
                  'Purok 6 - Rosal',
                  'Purok 7 - Cattleya',
                ].map((p) => {
                  const count = submissions.filter((s) => s.residentPurok === p).length;
                  const pct = totalSubmissions > 0 ? (count / totalSubmissions) * 100 : 0;
                  return (
                    <div key={p} className="space-y-1">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="font-medium">{p}</span>
                        <span className="font-mono-numbers text-slate-500">
                          {count} requests ({pct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-teal-600 h-full rounded-full"
                          style={{ width: `${Math.max(pct, 4)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SUBMISSIONS MANAGEMENT (CRUD) */}
      {activeTab === 'submissions' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-4 p-5">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracking code, citizen, subject..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Submission Types</option>
                <option value="service_request">Document Clearances Only</option>
                <option value="complaint">Community Complaints Only</option>
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <select
                value={purokFilter}
                onChange={(e) => setPurokFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Puroks</option>
                <option value="Purok 1 - Rose">Purok 1 - Rose</option>
                <option value="Purok 2 - Dahlia">Purok 2 - Dahlia</option>
                <option value="Purok 3 - Sampaguita">Purok 3 - Sampaguita</option>
                <option value="Purok 4 - Camia">Purok 4 - Camia</option>
                <option value="Purok 5 - Ilang-Ilang">Purok 5 - Ilang-Ilang</option>
                <option value="Purok 6 - Rosal">Purok 6 - Rosal</option>
                <option value="Purok 7 - Cattleya">Purok 7 - Cattleya</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-3.5 py-3 text-left">Tracking Code</th>
                  <th className="px-3.5 py-3 text-left">Citizen / Purok</th>
                  <th className="px-3.5 py-3 text-left">Category & Subject</th>
                  <th className="px-3.5 py-3 text-left">Urgency</th>
                  <th className="px-3.5 py-3 text-left">Status</th>
                  <th className="px-3.5 py-3 text-left">Assigned Officer</th>
                  <th className="px-3.5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      <td className="px-3.5 py-3 font-mono-numbers font-bold text-slate-900 whitespace-nowrap">
                        {sub.trackingCode}
                      </td>
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <p className="font-semibold text-slate-900">{sub.residentName}</p>
                        <p className="text-[11px] text-slate-500">{sub.residentPurok}</p>
                      </td>
                      <td className="px-3.5 py-3 max-w-xs">
                        <p className="font-medium text-teal-800">{sub.categoryName}</p>
                        <p className="text-slate-800 truncate font-semibold">{sub.subject}</p>
                      </td>
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <span className={`text-[10px] font-bold uppercase ${
                          sub.urgency === 'urgent' ? 'text-rose-700' : 'text-slate-600'
                        }`}>
                          {sub.urgency}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        {getStatusBadge(sub.status)}
                      </td>
                      <td className="px-3.5 py-3 text-slate-600 whitespace-nowrap">
                        {sub.assignedTo || 'Unassigned'}
                      </td>
                      <td className="px-3.5 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onPrintSlip(sub)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"
                            title="Print Slip"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedSubmission(sub)}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-teal-300 text-xs font-medium rounded"
                          >
                            Inspect & Act
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ANNOUNCEMENTS MANAGEMENT */}
      {activeTab === 'announcements' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Barangay Public Advisories</h2>
              <p className="text-xs text-slate-500">Publish notices to the public portal.</p>
            </div>
            <button
              onClick={() => setShowAnnModal(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Announcement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 border border-slate-200 rounded-xl flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-bold text-teal-700">{ann.category}</span>
                    <span className="font-mono-numbers">{formatDate(ann.publishAt)}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{ann.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-3">
                    {ann.content}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">By {ann.publishedBy}</span>
                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Archive / Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. RESIDENT REGISTRY */}
      {activeTab === 'residents' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Registered Residents Directory</h2>
            <p className="text-xs text-slate-500">Manage resident identities and verification statuses.</p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-3 text-left">Citizen Name</th>
                  <th className="px-4 py-3 text-left">Email & Contact</th>
                  <th className="px-4 py-3 text-left">Purok & Address</th>
                  <th className="px-4 py-3 text-left">Verification</th>
                  <th className="px-4 py-3 text-left">Account Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                      {u.fullName}
                      {u.role !== 'resident' && (
                        <span className="ml-2 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono uppercase">
                          {u.role}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-slate-800">{u.email}</p>
                      <p className="text-slate-500 font-mono-numbers">{u.contactNumber || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{u.purok || 'Official Staff'}</p>
                      <p className="text-slate-500 text-[11px] truncate max-w-xs">{u.address || 'Barangay Hall'}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {u.verificationStatus === 'verified' ? (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold">
                          Verified
                        </span>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-bold">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-[11px] font-semibold ${
                        u.accountStatus === 'active' ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {u.accountStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {u.role === 'resident' && (
                          <button
                            onClick={() => handleToggleVerification(u)}
                            className="px-2.5 py-1 text-xs border border-slate-300 hover:bg-slate-100 rounded text-slate-700 font-medium"
                          >
                            {u.verificationStatus === 'verified' ? 'Revoke Verification' : 'Approve ID'}
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleAccountActive(u)}
                          className={`px-2.5 py-1 text-xs rounded font-medium ${
                            u.accountStatus === 'active'
                              ? 'text-rose-700 border border-rose-200 hover:bg-rose-50'
                              : 'text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                          }`}
                        >
                          {u.accountStatus === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. REPORTS & ANALYTICS */}
      {activeTab === 'reports' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Barangay Service Analytics</h2>
              <p className="text-xs text-slate-500">Performance metrics and citizen resolution compliance.</p>
            </div>
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Excel/CSV Report</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-slate-500 font-medium">Average Turnaround Time</p>
              <p className="text-2xl font-bold font-mono-numbers text-slate-900 mt-1">1.4 Days</p>
              <p className="text-[11px] text-teal-700 mt-0.5">Well within 3-day ARTA standard</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-slate-500 font-medium">Resolution Success Rate</p>
              <p className="text-2xl font-bold font-mono-numbers text-emerald-600 mt-1">
                {totalSubmissions > 0 ? `${((resolvedCount / totalSubmissions) * 100).toFixed(0)}%` : '100%'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">{resolvedCount} of {totalSubmissions} cleared</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-slate-500 font-medium">Top Concern Category</p>
              <p className="text-base font-bold text-slate-900 mt-1 truncate">
                Defective Streetlights & Sanitation
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Assigned to Tanod Patrol</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Immutable Administrative Audit Log</h2>
            <p className="text-xs text-slate-500">Security trail tracking all status modifications and access events.</p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-3 text-left">Timestamp</th>
                  <th className="px-4 py-3 text-left">User / Official</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Target Entity</th>
                  <th className="px-4 py-3 text-left">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono-numbers text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-semibold text-slate-900">{log.userName}</span>
                      <span className="text-[10px] text-slate-400 block">{log.userRole}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-teal-700 font-semibold whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                      {log.entityId}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. SETTINGS & DATABASE TOOLS */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Database & Deployment Configuration</h2>
            <p className="text-xs text-slate-500">
              Architecture tools matching Section 6 of the Barangay Service Request and Complaint Portal outline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 border border-slate-200 rounded-xl space-y-3 bg-slate-50">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <FileCode className="w-5 h-5 text-teal-600" />
                <span>MySQL 8+ / MariaDB Schema (`barangay_portal_db`)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Contains complete tables: `users`, `resident_profiles`, `service_categories`, `service_requests`, `request_attachments`, `request_status_history`, `announcements`, `notifications`, and `audit_logs`.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleDownloadSql}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .SQL File</span>
                </button>
                <button
                  onClick={onOpenSqlModal}
                  className="px-4 py-2 border border-slate-300 hover:bg-white text-slate-700 rounded-lg text-xs font-medium transition-colors"
                >
                  View SQL Code
                </button>
              </div>
            </div>

            <div className="p-5 border border-slate-200 rounded-xl space-y-3 bg-slate-50">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                <span>Reset Demo State & Seeds</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Restore the sample database to default seed state with initial clearances, defective streetlights complaint, and registered accounts.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (confirm('Reset all demo data back to default initial state?')) {
                      StorageService.resetToDefaultData();
                      onRefreshData();
                      alert('Data reset to default successfully!');
                    }
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Sample Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ANNOUNCEMENT MODAL */}
      {showAnnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Publish New Public Announcement</h3>
              <button onClick={() => setShowAnnModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Schedule of Anti-Rabies Vaccination Drive"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                <select
                  value={annCategory}
                  onChange={(e) => setAnnCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Advisory">Advisory</option>
                  <option value="Health & Sanitation">Health & Sanitation</option>
                  <option value="Peace & Order">Peace & Order</option>
                  <option value="Community Event">Community Event</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Content *</label>
                <textarea
                  required
                  rows={4}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Write complete advisory text, dates, affected puroks, instructions..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pin"
                  checked={annIsPinned}
                  onChange={(e) => setAnnIsPinned(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="pin" className="text-slate-700 font-medium">
                  Pin this notice to top of public board
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAnnModal(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL ACTION MODAL */}
      {selectedSubmission && (
        <AdminRequestDetailModal
          submission={selectedSubmission}
          currentUser={currentUser}
          onClose={() => setSelectedSubmission(null)}
          onUpdate={(updated) => {
            setSelectedSubmission(updated);
            onRefreshData();
          }}
          onPrintSlip={onPrintSlip}
        />
      )}
    </div>
  );
};
