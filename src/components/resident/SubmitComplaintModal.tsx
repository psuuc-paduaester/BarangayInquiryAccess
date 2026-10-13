import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Upload,
  Camera,
  MapPin,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { ServiceCategory, ServiceSubmission, User, UrgencyLevel } from '../../types';
import { StorageService } from '../../services/storage';

interface SubmitComplaintModalProps {
  isOpen: boolean;
  categories: ServiceCategory[];
  currentUser: User;
  initialCategory?: ServiceCategory;
  onClose: () => void;
  onSuccess: (submission: ServiceSubmission) => void;
}

export const SubmitComplaintModal: React.FC<SubmitComplaintModalProps> = ({
  isOpen,
  categories,
  currentUser,
  initialCategory,
  onClose,
  onSuccess,
}) => {
  const complaintCategories = categories.filter((c) => c.type === 'complaint' && c.isActive);

  const [selectedCatId, setSelectedCatId] = useState<string>(
    initialCategory?.id || complaintCategories[0]?.id || ''
  );
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(currentUser.address ? `${currentUser.address}, ${currentUser.purok}` : '');
  const [purok, setPurok] = useState(currentUser.purok || 'Purok 1 - Rose');
  const [urgency, setUrgency] = useState<UrgencyLevel>('normal');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string; type: string }[]>([
    { name: 'Incident_Photo_Evidence_01.jpg', size: '2.4 MB', type: 'image/jpeg' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentCategory = complaintCategories.find((c) => c.id === selectedCatId) || complaintCategories[0];

  const handleAddSampleFile = () => {
    const sampleNames = [
      'Streetlight_Pole_Defect_Photo.jpg',
      'Uncollected_Garbage_Landmark.jpg',
      'Canal_Blockage_Runoff.jpg',
      'Audio_Recording_Videoke_Noise.m4a',
    ];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    if (!attachedFiles.some((f) => f.name === randomName)) {
      setAttachedFiles([...attachedFiles, { name: randomName, size: '1.9 MB', type: 'image/jpeg' }]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim() || !location.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const fullLocation = `${location.trim()} (${purok})`;
      const newSubmission = StorageService.createSubmission(currentUser, {
        requestType: 'complaint',
        categoryId: currentCategory.id,
        subject: subject.trim(),
        description: description.trim(),
        location: fullLocation,
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
        <div className="bg-rose-950 text-white px-5 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <h3 className="font-bold text-xs sm:text-sm">File Community Complaint or Incident Report</h3>
              <p className="text-[10px] sm:text-[11px] text-rose-200">Public Works, Health, & Peace and Order Desk</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-rose-300 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Privacy Notice */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-800 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold">Confidentiality Guarantee:</span> All community reports are handled professionally by the Barangay Tanod and Lupon Tagapamayapa. Your personal contact details are never disclosed to third parties.
            </div>
          </div>

          {/* Issue Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Issue Classification *
            </label>
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-rose-500 font-medium"
            >
              {complaintCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject / Headline */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Incident Summary / Brief Subject *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Uncollected garbage pile behind Purok 5 Daycare Center"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Purok & Exact Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Affected Purok *
              </label>
              <select
                value={purok}
                onChange={(e) => setPurok(e.target.value)}
                className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-rose-500 font-medium"
              >
                <option value="Purok 1 - Rose">Purok 1 - Rose</option>
                <option value="Purok 2 - Dahlia">Purok 2 - Dahlia</option>
                <option value="Purok 3 - Sampaguita">Purok 3 - Sampaguita</option>
                <option value="Purok 4 - Camia">Purok 4 - Camia</option>
                <option value="Purok 5 - Ilang-Ilang">Purok 5 - Ilang-Ilang</option>
                <option value="Purok 6 - Rosal">Purok 6 - Rosal</option>
                <option value="Purok 7 - Cattleya">Purok 7 - Cattleya</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-rose-500 font-medium"
              >
                <option value="normal">Normal (Standard Inspection)</option>
                <option value="urgent">Urgent Hazard (Live wire, health risk)</option>
                <option value="low">Low (Non-time critical)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Exact Landmark / Street Address *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Corner Jacinto St and Mabini Ave (Near Sari-Sari Store / Post #42)"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Detailed Narrative */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Narrative & Detailed Incident Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurred, when it started, how many persons/households are affected, and any specific hazard details..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Photo / Audio Evidence */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Photo & Video Evidence ({attachedFiles.length})
              </label>
              <button
                type="button"
                onClick={handleAddSampleFile}
                className="text-[11px] text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>+ Attach Photo</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {attachedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Camera className="w-3.5 h-3.5 text-rose-600 shrink-0" />
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
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              {isSubmitting ? 'Logging Incident...' : 'File Official Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
