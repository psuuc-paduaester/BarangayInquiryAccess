import React, { useState } from 'react';
import { ServiceSubmission } from '../../types';
import { Printer, X, Check, Copy, Shield, Calendar, User, MapPin } from 'lucide-react';

interface PrintSlipModalProps {
  submission: ServiceSubmission;
  onClose: () => void;
}

export const PrintSlipModal: React.FC<PrintSlipModalProps> = ({ submission, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(submission.trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col print-card">
        {/* Modal Controls Bar (hidden during printing) */}
        <div className="no-print bg-slate-900 text-white px-5 sm:px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold truncate">Official Citizen Acknowledgment Receipt</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Body */}
        <div className="p-5 sm:p-8 space-y-5 sm:space-y-6 overflow-y-auto flex-1">
          {/* Official Letterhead Header */}
          <div className="text-center border-b-2 border-slate-900 pb-5 relative">
            <div className="flex items-center justify-center gap-4 mb-2">
              <img
                src="/src/assets/images/brgy_san_miguel_seal_1791900657851.jpg"
                alt="Barangay San Miguel Seal"
                className="w-16 h-16 rounded-full object-cover border border-amber-500 shadow-sm"
              />
              <div className="text-center">
                <p className="text-[11px] uppercase tracking-wider text-slate-600 font-medium">
                  Republic of the Philippines
                </p>
                <p className="text-xs uppercase tracking-wide text-slate-700 font-medium">
                  Province of Tarlac · Municipality of San Manuel
                </p>
                <h2 className="text-lg font-bold text-slate-950 tracking-tight">
                  BARANGAY SAN MIGUEL
                </h2>
                <p className="text-[11px] text-teal-800 font-semibold tracking-wider uppercase">
                  Office of the Punong Barangay · Records Desk
                </p>
              </div>
            </div>

            <div className="inline-block bg-slate-100 text-slate-800 px-4 py-1 rounded text-xs font-bold uppercase tracking-wider mt-1 border border-slate-300">
              {submission.requestType === 'service_request'
                ? 'OFFICIAL SERVICE REQUEST TRANSMITTAL SLIP'
                : 'COMMUNITY COMPLAINT INCIDENT REPORT SLIP'}
            </div>
          </div>

          {/* Tracking Number Highlight Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500 font-medium">Official Reference Tracking Code</p>
              <p className="text-xl sm:text-2xl font-bold font-mono-numbers text-slate-950 tracking-tight">
                {submission.trackingCode}
              </p>
              <p className="text-[11px] text-slate-500">
                Present this tracking code at the Barangay Hall or verify online 24/7.
              </p>
            </div>

            <div className="flex items-center gap-2 no-print">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 border border-slate-300 rounded-md text-slate-700 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Citizen & Submission Meta Data */}
          <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 rounded-lg p-4">
            <div>
              <p className="text-slate-500 font-medium">Applicant / Complainant</p>
              <p className="font-semibold text-slate-900 text-sm">{submission.residentName}</p>
              <p className="text-slate-600 font-mono-numbers">{submission.residentContact}</p>
            </div>

            <div>
              <p className="text-slate-500 font-medium">Purok & Address</p>
              <p className="font-semibold text-slate-900">{submission.residentPurok}</p>
              <p className="text-slate-600">{submission.residentAddress}</p>
            </div>

            <div>
              <p className="text-slate-500 font-medium">Service Classification</p>
              <p className="font-semibold text-slate-900">{submission.categoryName}</p>
              <p className="text-slate-500 capitalize">Urgency: {submission.urgency}</p>
            </div>

            <div>
              <p className="text-slate-500 font-medium">Current Status</p>
              <span className="inline-block mt-0.5 px-2.5 py-0.5 bg-slate-900 text-white rounded text-[11px] font-semibold uppercase tracking-wider">
                {submission.status.replace(/_/g, ' ')}
              </span>
              <p className="text-slate-500 text-[11px] mt-1">
                Assigned: {submission.assignedTo || 'Barangay Records Desk'}
              </p>
            </div>

            <div className="col-span-2 pt-2 border-t border-slate-200">
              <p className="text-slate-500 font-medium">Subject / Nature of Concern</p>
              <p className="font-semibold text-slate-900">{submission.subject}</p>
              <p className="text-slate-700 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                {submission.description}
              </p>
            </div>

            {submission.location && (
              <div className="col-span-2">
                <p className="text-slate-500 font-medium">Specific Location / Landmark</p>
                <p className="text-slate-800 font-medium">{submission.location}</p>
              </div>
            )}
          </div>

          {/* Status Timeline History */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Official Processing Timeline
            </h4>
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 space-y-2.5">
              {submission.statusHistory.map((step, idx) => (
                <div key={step.id || idx} className="text-xs flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-slate-600 font-mono-numbers text-[11px]">
                      <span className="font-semibold text-slate-900 uppercase">
                        {step.newStatus.replace(/_/g, ' ')}
                      </span>
                      <span>{formatDate(step.changedAt)}</span>
                    </div>
                    <p className="text-slate-700 text-xs mt-0.5">{step.remarks}</p>
                    <p className="text-[10px] text-slate-500">Processed by: {step.changedBy} ({step.changedByRole})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Signatures & Seal Certification */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs border-t border-slate-200">
            <div>
              <div className="h-10 border-b border-slate-400 max-w-[200px] mx-auto mb-1 flex items-end justify-center">
                <span className="font-serif italic text-xs text-slate-700">Carmela Reyes</span>
              </div>
              <p className="font-bold text-slate-900">CARMELA REYES</p>
              <p className="text-slate-500 text-[11px]">Barangay Records Officer</p>
            </div>

            <div>
              <div className="h-10 border-b border-slate-400 max-w-[200px] mx-auto mb-1 flex items-end justify-center">
                <span className="font-serif italic text-xs text-slate-700">Hon. Roberto Hernandez</span>
              </div>
              <p className="font-bold text-slate-900">HON. ROBERTO HERNANDEZ</p>
              <p className="text-slate-500 text-[11px]">Punong Barangay</p>
            </div>
          </div>

          {/* Barcode/Validation note */}
          <div className="text-center text-[10px] text-slate-600 pt-2 border-t border-slate-100">
            <p className="font-mono-numbers">DOCUMENT REF: {submission.id} · SYSTEM GENERATED ELECTRONIC RECEIPT</p>
            <p>Verification Portal: https://sanmanuel-tarlac.gov.ph/barangay-sanmiguel/track?code={submission.trackingCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
