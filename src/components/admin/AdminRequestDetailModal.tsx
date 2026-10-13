import React, { useState } from 'react';
import {
  X,
  Shield,
  Clock,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Send,
  MessageSquare,
  FileText,
  Camera,
  MapPin,
} from 'lucide-react';
import { ServiceSubmission, User, SubmissionStatus } from '../../types';
import { StorageService } from '../../services/storage';

interface AdminRequestDetailModalProps {
  submission: ServiceSubmission;
  currentUser: User;
  onClose: () => void;
  onUpdate: (updated: ServiceSubmission) => void;
  onPrintSlip: (submission: ServiceSubmission) => void;
}

export const AdminRequestDetailModal: React.FC<AdminRequestDetailModalProps> = ({
  submission,
  currentUser,
  onClose,
  onUpdate,
  onPrintSlip,
}) => {
  const [currentStatus, setCurrentStatus] = useState<SubmissionStatus>(submission.status);
  const [assignedTo, setAssignedTo] = useState(submission.assignedTo || '');
  const [remarks, setRemarks] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState(submission.resolutionNotes || '');
  const [copied, setCopied] = useState(false);
  const [followUpInput, setFollowUpInput] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(submission.trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim() && currentStatus === submission.status) {
      alert('Please enter official remarks explaining this update.');
      return;
    }

    const updated = StorageService.updateSubmissionStatus(
      currentUser,
      submission.id,
      currentStatus,
      remarks.trim() || `Status updated to ${currentStatus.replace(/_/g, ' ')}`,
      assignedTo.trim() || undefined,
      currentStatus === 'resolved' ? (resolutionNotes.trim() || 'Issue cleared by barangay authorities.') : undefined
    );

    if (updated) {
      onUpdate(updated);
      setRemarks('');
      alert('Status and official history updated successfully!');
    }
  };

  const handleAddFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpInput.trim()) return;

    const updated = StorageService.addFollowUpRemark(currentUser, submission.id, followUpInput.trim());
    if (updated) {
      onUpdate(updated);
      setFollowUpInput('');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <h3 className="font-bold text-xs sm:text-sm">Official Record Inspection & Action Desk</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono-numbers">
                {submission.trackingCode} · {submission.requestType === 'service_request' ? 'Service Request' : 'Complaint'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrintSlip(submission)}
              className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto flex-1">
          {/* Overview Info Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-semibold text-teal-700 uppercase">
                  {submission.categoryName}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  {submission.subject}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-numbers font-bold text-slate-700">
                  {submission.trackingCode}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-200"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Resident & Location Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-slate-500 font-medium">Citizen / Applicant</p>
                <p className="font-semibold text-slate-900">{submission.residentName}</p>
                <p className="text-slate-600 font-mono-numbers">{submission.residentContact}</p>
              </div>

              <div>
                <p className="text-slate-500 font-medium">Purok & Address</p>
                <p className="font-semibold text-slate-900">{submission.residentPurok}</p>
                <p className="text-slate-600">{submission.residentAddress}</p>
              </div>

              <div>
                <p className="text-slate-500 font-medium">Filing Date & Urgency</p>
                <p className="font-semibold text-slate-900 font-mono-numbers">{formatDate(submission.createdAt)}</p>
                <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700">
                  Urgency: {submission.urgency}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="text-xs pt-2 border-t border-slate-200">
              <p className="text-slate-500 font-medium mb-1">Details / Incident Narrative:</p>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-line">
                {submission.description}
              </div>
            </div>

            {/* Attachments */}
            {submission.attachments.length > 0 && (
              <div className="text-xs pt-2 border-t border-slate-200">
                <p className="text-slate-500 font-medium mb-1">Attached Evidence & Credentials ({submission.attachments.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {submission.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-teal-600" />
                      <span className="font-medium text-slate-800">{att.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono-numbers">({att.size})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* UPDATE STATUS & ASSIGNMENT CONTROLS */}
          <form onSubmit={handleSaveStatusUpdate} className="bg-white border-2 border-slate-900/10 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-teal-600" />
              <span>Official Action: Update Status & Assignments</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Status Transition *
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as SubmissionStatus)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-teal-500 font-bold"
                >
                  <option value="submitted">1. Submitted (Pending Initial Check)</option>
                  <option value="under_review">2. Under Review (Desk Verified)</option>
                  <option value="in_progress">3. In Progress (Processing / Field Action)</option>
                  <option value="resolved">4. Resolved / Released (Completed)</option>
                  <option value="returned_for_info">Returned for Information (Incomplete ID/Proof)</option>
                  <option value="rejected">Rejected (Disapproved with cause)</option>
                  <option value="cancelled">Cancelled (Per citizen request)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign Officer / Committee
                </label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="e.g. Desk Officer Carmela / Tanod Chief Danilo / Health Desk"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Remarks & Citizens Notice * (Logged into immutable timeline)
              </label>
              <textarea
                required
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="State the official action taken, instructions for pickup, or inspection findings..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>

            {currentStatus === 'resolved' && (
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1">
                  Resolution Documentation Notes
                </label>
                <textarea
                  rows={2}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Record final resolution particulars (e.g. Clearance issued with dry seal; or trash hauled by sanitation unit)..."
                  className="w-full px-3 py-2 text-xs border border-emerald-300 bg-emerald-50/50 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-teal-400 font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record Status Update & Notify Resident</span>
            </button>
          </form>

          {/* STATUS HISTORY TIMELINE */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Complete Official Timeline
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

          {/* MESSAGES & COMMUNICATION FEED */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
              <span>Citizen Communication Feed ({submission.followUps.length})</span>
            </h4>

            {submission.followUps.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {submission.followUps.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg text-xs border ${
                      msg.authorRole === 'official'
                        ? 'bg-blue-50/70 border-blue-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono-numbers text-[11px] text-slate-500 mb-1">
                      <span className="font-semibold text-slate-800">
                        {msg.authorName} ({msg.authorRole === 'official' ? 'Barangay Staff' : 'Resident'})
                      </span>
                      <span>{formatDate(msg.createdAt)}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddFollowUp} className="flex gap-2">
              <input
                type="text"
                value={followUpInput}
                onChange={(e) => setFollowUpInput(e.target.value)}
                placeholder="Post an official advisory or instructions to citizen..."
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                disabled={!followUpInput.trim()}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
