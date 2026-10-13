import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  CheckCircle2,
  Clock,
  Printer,
  Copy,
  Check,
  AlertCircle,
  Shield,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { ServiceSubmission, User } from '../../types';

interface PublicTrackModalProps {
  initialCode?: string;
  currentUser: User | null;
  onClose: () => void;
  onPrintSlip: (submission: ServiceSubmission) => void;
}

export const PublicTrackModal: React.FC<PublicTrackModalProps> = ({
  initialCode = '',
  currentUser,
  onClose,
  onPrintSlip,
}) => {
  const [trackingInput, setTrackingInput] = useState(initialCode);
  const [submission, setSubmission] = useState<ServiceSubmission | null>(null);
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [followUpMsg, setFollowUpMsg] = useState('');

  useEffect(() => {
    if (initialCode) {
      handleSearch(initialCode);
    }
  }, [initialCode]);

  const handleSearch = (codeToSearch: string) => {
    setSearched(true);
    const result = StorageService.findSubmissionByTracking(codeToSearch);
    setSubmission(result || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      handleSearch(trackingInput.trim());
    }
  };

  const handleCopyCode = () => {
    if (!submission) return;
    navigator.clipboard.writeText(submission.trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission || !currentUser || !followUpMsg.trim()) return;

    const updated = StorageService.addFollowUpRemark(currentUser, submission.id, followUpMsg.trim());
    if (updated) {
      setSubmission(updated);
      setFollowUpMsg('');
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'in_progress':
        return 'text-teal-700 bg-teal-50 border-teal-200';
      case 'under_review':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'rejected':
      case 'cancelled':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-400 shrink-0" />
            <h3 className="text-xs sm:text-sm font-semibold">Civic Request & Complaint Verification</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto flex-1">
          {/* Search Box */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Enter Tracking Code (e.g., BRGY-2026-SR-89241)"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-teal-500 font-mono-numbers"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Search Record
            </button>
          </form>

          {/* Quick Demo Code buttons */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Quick test:</span>
            <button
              type="button"
              onClick={() => {
                setTrackingInput('BRGY-2026-SR-89241');
                handleSearch('BRGY-2026-SR-89241');
              }}
              className="text-teal-700 hover:underline font-mono-numbers"
            >
              BRGY-2026-SR-89241
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setTrackingInput('BRGY-2026-CP-41029');
                handleSearch('BRGY-2026-CP-41029');
              }}
              className="text-teal-700 hover:underline font-mono-numbers"
            >
              BRGY-2026-CP-41029
            </button>
          </div>

          {/* Results Area */}
          {submission ? (
            <div className="space-y-6 pt-2 border-t border-slate-100">
              {/* Highlight Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Tracking Code:</span>
                    <span className="font-mono-numbers font-bold text-slate-900 text-base">
                      {submission.trackingCode}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500"
                      title="Copy Tracking Number"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 mt-1">
                    {submission.subject}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Classification: {submission.categoryName} · {submission.residentPurok}
                  </p>
                </div>

                <div className="flex sm:flex-col items-end gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getStatusColor(submission.status)}`}>
                    {submission.status.replace(/_/g, ' ')}
                  </span>
                  <button
                    onClick={() => onPrintSlip(submission)}
                    className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium rounded-md flex items-center gap-1 shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>
                </div>
              </div>

              {/* Status Flow Indicator */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Progress Pipeline
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {[
                    { key: 'submitted', label: '1. Submitted' },
                    { key: 'under_review', label: '2. Under Review' },
                    { key: 'in_progress', label: '3. In Progress' },
                    { key: 'resolved', label: '4. Resolved' },
                  ].map((step, idx) => {
                    const stepOrder = ['submitted', 'under_review', 'in_progress', 'resolved'];
                    const currentIdx = stepOrder.indexOf(submission.status);
                    const isPassed = currentIdx >= idx;
                    const isCurrent = submission.status === step.key;

                    return (
                      <div
                        key={step.key}
                        className={`p-2 rounded-lg border ${
                          isCurrent
                            ? 'bg-teal-600 text-white border-teal-700 font-bold'
                            : isPassed
                            ? 'bg-teal-50 text-teal-800 border-teal-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        <p className="truncate">{step.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Assignment & Resolution Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="text-slate-500 font-medium">Assigned Officer / Committee</p>
                  <p className="font-semibold text-slate-900 mt-0.5">
                    {submission.assignedTo || 'Barangay Central Records Desk'}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="text-slate-500 font-medium">Last Official Activity</p>
                  <p className="font-semibold text-slate-900 font-mono-numbers mt-0.5">
                    {formatDate(submission.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Resolution Notes (if resolved) */}
              {submission.resolutionNotes && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                  <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Official Resolution Documentation</span>
                  </p>
                  <p className="text-emerald-800 leading-relaxed">
                    {submission.resolutionNotes}
                  </p>
                </div>
              )}

              {/* Status History Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Detailed Official Timeline
                </h4>
                <div className="space-y-2 border-l-2 border-slate-200 ml-2 pl-4">
                  {submission.statusHistory.map((history) => (
                    <div key={history.id} className="relative text-xs">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-teal-600 ring-4 ring-white" />
                      <div className="flex items-center justify-between text-slate-500 font-mono-numbers text-[11px]">
                        <span className="font-semibold text-slate-900 uppercase">
                          {history.newStatus.replace(/_/g, ' ')}
                        </span>
                        <span>{formatDate(history.changedAt)}</span>
                      </div>
                      <p className="text-slate-700 mt-0.5">{history.remarks}</p>
                      <p className="text-[10px] text-slate-400">
                        By {history.changedBy} ({history.changedByRole})
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-up feed */}
              {submission.followUps.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Follow-Up Messages & Instructions
                  </h4>
                  <div className="space-y-2">
                    {submission.followUps.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-lg text-xs border ${
                          msg.authorRole === 'official'
                            ? 'bg-blue-50/60 border-blue-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono-numbers text-[11px] text-slate-500 mb-1">
                          <span className="font-semibold text-slate-800">
                            {msg.authorName} ({msg.authorRole === 'official' ? 'Official' : 'Resident'})
                          </span>
                          <span>{formatDate(msg.createdAt)}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up submission input if user is signed in */}
              {currentUser && (
                <form onSubmit={handleSendFollowUp} className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Add Citizen Follow-Up / Additional Information
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={followUpMsg}
                      onChange={(e) => setFollowUpMsg(e.target.value)}
                      placeholder="Type a follow-up inquiry or update for barangay officers..."
                      className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                    <button
                      type="submit"
                      disabled={!followUpMsg.trim()}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                    >
                      Send Note
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : searched ? (
            <div className="p-8 text-center text-slate-500 text-xs space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="font-semibold text-slate-800">No record found for "{trackingInput}"</p>
              <p className="text-slate-500 max-w-sm mx-auto">
                Please double-check your tracking code format (e.g., BRGY-2026-SR-89241 or BRGY-2026-CP-41029).
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
