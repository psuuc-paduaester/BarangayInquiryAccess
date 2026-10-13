import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  Search,
  CheckCircle2,
  Clock,
  Shield,
  Phone,
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  Building,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { ServiceCategory, Announcement, User } from '../../types';

interface LandingPageProps {
  categories: ServiceCategory[];
  announcements: Announcement[];
  currentUser: User | null;
  onOpenTrackModal: (initialCode?: string) => void;
  onRequestService: (category?: ServiceCategory) => void;
  onReportComplaint: (category?: ServiceCategory) => void;
  onOpenAuth: (tab: 'login' | 'register' | 'admin') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  categories,
  announcements,
  currentUser,
  onOpenTrackModal,
  onRequestService,
  onReportComplaint,
  onOpenAuth,
}) => {
  const [trackInput, setTrackInput] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'service_request' | 'complaint'>('service_request');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInput.trim()) {
      onOpenTrackModal(trackInput.trim());
    }
  };

  const serviceCategories = categories.filter((c) => c.type === 'service_request' && c.isActive);
  const complaintCategories = categories.filter((c) => c.type === 'complaint' && c.isActive);

  return (
    <div className="space-y-10 sm:space-y-12 pb-14 w-full max-w-full overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white overflow-hidden w-full">
        {/* Hall Exterior Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url('/src/assets/images/brgy_hall_exterior_1791899103314.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/80" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold tracking-wider uppercase">
              <Shield className="w-4 h-4" />
              <span>Official Civic Portal · Sangguniang Barangay San Miguel, San Manuel, Tarlac</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Transparent, Accessible, and Reliable Public Barangay Services.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Apply for barangay clearances, indigency certificates, and permits online.
              Report public infrastructure issues and community complaints with verifiable tracking numbers.
            </p>

            {/* QUICK TRACKING SEARCH WIDGET */}
            <div className="bg-slate-800/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-slate-700 shadow-2xl max-w-xl">
              <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={trackInput}
                    onChange={(e) => setTrackInput(e.target.value)}
                    placeholder="Enter Tracking Code (e.g., BRGY-2026-SR-89241)"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-teal-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm rounded-lg transition-colors whitespace-nowrap shadow-md flex items-center justify-center gap-2"
                >
                  <span>Track Status</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center gap-2 mt-2.5 text-[11px] text-slate-400">
                <span>Try sample codes:</span>
                <button
                  type="button"
                  onClick={() => onOpenTrackModal('BRGY-2026-SR-89241')}
                  className="text-teal-400 hover:underline font-mono-numbers"
                >
                  BRGY-2026-SR-89241
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => onOpenTrackModal('BRGY-2026-CP-41029')}
                  className="text-teal-400 hover:underline font-mono-numbers"
                >
                  BRGY-2026-CP-41029
                </button>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onRequestService()}
                className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Request Clearance / Certificate</span>
              </button>

              <button
                onClick={() => onReportComplaint()}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>File Community Complaint</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4-KPI Row */}
        <div className="border-t border-slate-800 bg-slate-950/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">1–3 Days Processing</p>
                  <p className="text-[11px] text-slate-400">Citizen Charter Standard</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Unique Tracking ID</p>
                  <p className="text-[11px] text-slate-400">Transparent status audit</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">7 Purok Coverage</p>
                  <p className="text-[11px] text-slate-400">Barangay-wide tanod dispatch</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">RA 11032 Compliant</p>
                  <p className="text-[11px] text-slate-400">Anti-Red Tape Commission</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CITIZEN CHARTER WORKFLOW GUIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest">
            Step-by-Step Citizen Guide
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            How It Works in 4 Simple Steps
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            No long queues at the Barangay Hall. File your request from your computer or mobile phone.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
            <span className="text-xs font-bold text-teal-600">Step 1</span>
            <h3 className="text-base font-semibold text-slate-900 mt-1 mb-2">1. Submit Details</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select your required document or complaint issue, fill in the purpose and address, and attach photo or ID proof.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
            <span className="text-xs font-bold text-teal-600">Step 2</span>
            <h3 className="text-base font-semibold text-slate-900 mt-1 mb-2">2. Get Tracking Code</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instantly receive an official tracking number (e.g. BRGY-2026-SR-XXXXX) and download a printable filing receipt.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
            <span className="text-xs font-bold text-teal-600">Step 3</span>
            <h3 className="text-base font-semibold text-slate-900 mt-1 mb-2">3. Official Review</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Barangay Records staff verify credentials or dispatch Barangay Tanod and Sanitation personnel for on-site inspection.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
            <span className="text-xs font-bold text-teal-600">Step 4</span>
            <h3 className="text-base font-semibold text-slate-900 mt-1 mb-2">4. Resolution & Release</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive status updates in real-time. Pick up certified documents with dry seal or receive documented resolution proof.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CITIZEN SERVICES & COMPLAINT DIRECTORY */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest">
              Available Catalogs
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Barangay Public Services & Incident Desk
            </h2>
          </div>

          {/* Clean Segmented Control */}
          <div className="inline-flex p-1 bg-slate-200 rounded-lg">
            <button
              onClick={() => setSelectedCategoryTab('service_request')}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedCategoryTab === 'service_request'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Document Clearances ({serviceCategories.length})
            </button>
            <button
              onClick={() => setSelectedCategoryTab('complaint')}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedCategoryTab === 'complaint'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Community Complaints ({complaintCategories.length})
            </button>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(selectedCategoryTab === 'service_request' ? serviceCategories : complaintCategories).map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
                  <span className="text-xs font-mono-numbers text-slate-500">
                    {cat.type === 'service_request'
                      ? cat.feePhp > 0
                        ? `₱${cat.feePhp.toFixed(2)}`
                        : 'FREE'
                      : 'FREE'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {cat.description}
                </p>

                {/* Requirements / Info */}
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Requirements / Info
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {cat.requirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="truncate">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cat.processingDays} Day{cat.processingDays > 1 ? 's' : ''} Turnaround</span>
                </div>

                <button
                  onClick={() => {
                    if (cat.type === 'service_request') {
                      onRequestService(cat);
                    } else {
                      onReportComplaint(cat);
                    }
                  }}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-teal-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PUBLIC ANNOUNCEMENTS & ADVISORIES */}
      <section id="announcements" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest">
              Community Board
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Official Announcements & Public Advisories
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:shadow-xs transition-shadow"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-teal-700">{ann.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-numbers">
                    {new Date(ann.publishAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  {ann.isPinned && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-700 font-medium">Pinned Notice</span>
                    </>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {ann.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {ann.content}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  By {ann.publishedBy}
                </span>

                <button
                  onClick={() => setSelectedAnnouncement(ann)}
                  className="text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1"
                >
                  <span>Read Full Notice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. RESIDENT PORTAL CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <p className="text-xs uppercase tracking-widest text-teal-400 font-semibold">
              Barangay Resident Account
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Create an account for one-click submissions and live status tracking.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Verify your residency in Barangay San Miguel, San Manuel, Tarlac to streamline certificate issuance, save your records, and receive SMS/email updates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            {currentUser ? (
              <button
                onClick={() => onRequestService()}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-lg transition-colors whitespace-nowrap"
              >
                Go to Resident Desk
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-lg transition-colors whitespace-nowrap"
                >
                  Register Resident Profile
                </button>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-medium text-sm rounded-lg transition-colors whitespace-nowrap"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENT DETAIL MODAL */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-teal-700">
                {selectedAnnouncement.category}
              </span>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {selectedAnnouncement.title}
            </h3>

            <div className="text-xs text-slate-500 font-mono-numbers">
              Published: {new Date(selectedAnnouncement.publishAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })} · {selectedAnnouncement.publishedBy}
            </div>

            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-lg border border-slate-100">
              {selectedAnnouncement.content}
            </div>

            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
            >
              Back to Portal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
