import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Bell,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { ServiceSubmission, User, Announcement } from '../../types';

interface ResidentDashboardProps {
  currentUser: User;
  submissions: ServiceSubmission[];
  announcements: Announcement[];
  onRequestService: () => void;
  onReportComplaint: () => void;
  onSelectSubmission: (submission: ServiceSubmission) => void;
  onPrintSlip: (submission: ServiceSubmission) => void;
}

export const ResidentDashboard: React.FC<ResidentDashboardProps> = ({
  currentUser,
  submissions,
  announcements,
  onRequestService,
  onReportComplaint,
  onSelectSubmission,
  onPrintSlip,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'service_request' | 'complaint' | 'active' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filter resident's submissions
  const mySubmissions = submissions.filter((s) => s.residentId === currentUser.id);

  // Stats calculation
  const totalCount = mySubmissions.length;
  const pendingCount = mySubmissions.filter((s) => s.status === 'submitted' || s.status === 'under_review').length;
  const inProgressCount = mySubmissions.filter((s) => s.status === 'in_progress').length;
  const resolvedCount = mySubmissions.filter((s) => s.status === 'resolved').length;

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredSubmissions = mySubmissions.filter((sub) => {
    if (filterTab === 'service_request' && sub.requestType !== 'service_request') return false;
    if (filterTab === 'complaint' && sub.requestType !== 'complaint') return false;
    if (filterTab === 'active' && (sub.status === 'resolved' || sub.status === 'cancelled' || sub.status === 'rejected')) return false;
    if (filterTab === 'resolved' && sub.status !== 'resolved') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = sub.trackingCode.toLowerCase().includes(q);
      const matchSubject = sub.subject.toLowerCase().includes(q);
      const matchCat = sub.categoryName.toLowerCase().includes(q);
      return matchCode || matchSubject || matchCat;
    }

    return true;
  });

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

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-5 sm:space-y-6">
      {/* 1. WELCOME & ACTION BANNER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Mabuhay, {currentUser.fullName}!
            </h1>
            {currentUser.verificationStatus === 'verified' ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Resident</span>
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                Pending ID Verification
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600">
            Registered Address: {currentUser.address || 'Brgy. San Miguel, San Manuel, Tarlac'} · {currentUser.purok || 'Purok 1'}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={onRequestService}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Request Document</span>
          </button>
          <button
            onClick={onReportComplaint}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>File Complaint</span>
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Submissions</p>
          <p className="text-2xl font-bold font-mono-numbers text-slate-900 mt-1">{totalCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Clearances & Reports</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Under Review</p>
          <p className="text-2xl font-bold font-mono-numbers text-amber-600 mt-1">{pendingCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Queued for verification</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">In Progress</p>
          <p className="text-2xl font-bold font-mono-numbers text-teal-600 mt-1">{inProgressCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Processing / Field inspection</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Resolved / Completed</p>
          <p className="text-2xl font-bold font-mono-numbers text-emerald-600 mt-1">{resolvedCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Ready for pickup or cleared</p>
        </div>
      </div>

      {/* 3. MY SUBMISSIONS TABLE & LIST */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">My Requests and Reports</h2>
            <p className="text-xs text-slate-500">Track real-time progress and official remarks.</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code or subject..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Filter Segmented Buttons */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1 overflow-x-auto">
          {[
            { key: 'all', label: `All (${mySubmissions.length})` },
            { key: 'service_request', label: 'Clearances' },
            { key: 'complaint', label: 'Complaints' },
            { key: 'active', label: 'Active Pipeline' },
            { key: 'resolved', label: 'Resolved' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key as any)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterTab === tab.key
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List Content */}
        {filteredSubmissions.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No submissions found</p>
            <p className="max-w-xs mx-auto text-slate-500">
              {searchQuery
                ? 'Try clearing your search query.'
                : 'You have not submitted any service requests or complaints yet.'}
            </p>
            <div className="flex justify-center gap-2 pt-1">
              <button
                onClick={onRequestService}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs rounded-lg transition-colors"
              >
                Request a Document
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredSubmissions.map((sub) => (
              <div
                key={sub.id}
                onClick={() => onSelectSubmission(sub)}
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left col */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono-numbers font-bold text-xs text-slate-900">
                      {sub.trackingCode}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleCopyCode(sub.trackingCode, e)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200 transition-colors"
                      title="Copy Tracking Number"
                    >
                      {copiedCode === sub.trackingCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {sub.categoryName}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400 font-mono-numbers">
                      {formatDate(sub.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                    {sub.subject}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    {sub.description}
                  </p>

                  {sub.statusHistory.length > 0 && (
                    <p className="text-[11px] text-teal-800 font-medium pt-0.5">
                      Latest Note: {sub.statusHistory[sub.statusHistory.length - 1].remarks}
                    </p>
                  )}
                </div>

                {/* Right col: status and action buttons */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  {getStatusBadge(sub.status)}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPrintSlip(sub);
                    }}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Print Official Slip"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. RECENT COMMUNITY ADVISORIES WIDGET */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-600" />
          <span>Barangay Community Board Highlights</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.slice(0, 2).map((ann) => (
            <div key={ann.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <span className="text-[10px] font-bold text-teal-700 uppercase">{ann.category}</span>
              <h4 className="font-semibold text-slate-900">{ann.title}</h4>
              <p className="text-slate-600 line-clamp-2">{ann.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
