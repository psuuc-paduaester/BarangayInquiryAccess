import React, { useState } from 'react';
import {
  X,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { ServiceCategory, ServiceSubmission, User, UrgencyLevel } from '../../types';
import { StorageService } from '../../services/storage';

interface SubmitRequestModalProps {
  isOpen: boolean;
  categories: ServiceCategory[];
  currentUser: User;
  initialCategory?: ServiceCategory;
  onClose: () => void;
  onSuccess: (submission: ServiceSubmission) => void;
}

export const SubmitRequestModal: React.FC<SubmitRequestModalProps> = ({
  isOpen,
  categories,
  currentUser,
  initialCategory,
  onClose,
  onSuccess,
}) => {
  const serviceCategories = categories.filter((c) => c.type === 'service_request' && c.isActive);

  const [selectedCatId, setSelectedCatId] = useState<string>(
    initialCategory?.id || serviceCategories[0]?.id || ''
  );
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('normal');
  const [location, setLocation] = useState(currentUser.address || '');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string; type: string }[]>([
    { name: 'Government_Valid_ID.pdf', size: '1.2 MB', type: 'application/pdf' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentCategory = serviceCategories.find((c) => c.id === selectedCatId) || serviceCategories[0];

  const handleAddSampleFile = () => {
    const sampleNames = [
      'Proof_of_Residency_Meralco_Bill.pdf',
      '1x1_Id_Photo_White_Background.jpg',
      'Medical_Assessment_Abstract.pdf',
      'Company_Job_Endorsement_Letter.docx',
    ];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    if (!attachedFiles.some((f) => f.name === randomName)) {
      setAttachedFiles([...attachedFiles, { name: randomName, size: '850 KB', type: 'application/pdf' }]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newSubmission = StorageService.createSubmission(currentUser, {
        requestType: 'service_request',
        categoryId: currentCategory.id,
        subject: subject.trim(),
        description: description.trim(),
        location: location.trim() || currentUser.address || 'Brgy. San Miguel, San Manuel, Tarlac',
        urgency,
        attachments: attachedFiles,
      });

      setIsSubmitting(false);
      onSuccess(newSubmission);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <h3 className="font-bold text-xs sm:text-sm">Request Official Barangay Document</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">Electronic Filing Desk</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Category Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Document Service *
            </label>
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-teal-500 font-medium"
            >
              {serviceCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.feePhp > 0 ? `(₱${c.feePhp.toFixed(2)})` : '(FREE)'}
                </option>
              ))}
            </select>
          </div>

          {/* Category Quick Details Box */}
          {currentCategory && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2">
              <div className="flex items-center justify-between font-mono-numbers text-slate-600">
                <span className="flex items-center gap-1 text-teal-700 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Turnaround: {currentCategory.processingDays} working day(s)</span>
                </span>
                <span className="font-bold text-slate-900">
                  Fee: {currentCategory.feePhp > 0 ? `₱${currentCategory.feePhp.toFixed(2)}` : 'FREE (No Charge)'}
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {currentCategory.description}
              </p>
              <div className="pt-1 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Requirements to prepare:
                </span>
                <ul className="text-[11px] text-slate-600 list-disc list-inside mt-0.5 space-y-0.5">
                  {currentCategory.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Subject / Purpose */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Purpose / Specific Reason *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Application for Local Employment / Bank Account Opening"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Additional Details or Special Request Notes *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State any specific details, company name, school name, or medical center..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Location & Urgency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Applicant Resident Address
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Address / Purok"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-teal-500 font-medium"
              >
                <option value="normal">Normal (Standard Processing)</option>
                <option value="urgent">Urgent / Rush (Hospital / Legal Emergency)</option>
                <option value="low">Low (Flexible Schedule)</option>
              </select>
            </div>
          </div>

          {/* Attachments Area */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Attached Identification & Supporting Documents ({attachedFiles.length})
              </label>
              <button
                type="button"
                onClick={handleAddSampleFile}
                className="text-[11px] text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>+ Attach File</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {attachedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate font-medium text-slate-800">{file.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono-numbers">({file.size})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="text-slate-400 hover:text-rose-500 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Service Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
