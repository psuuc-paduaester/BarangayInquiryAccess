import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  Phone,
  MapPin,
  ShieldCheck,
  Check,
  Lock,
} from 'lucide-react';
import { User } from '../../types';
import { StorageService } from '../../services/storage';

interface ResidentProfileModalProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

export const ResidentProfileModal: React.FC<ResidentProfileModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onUpdateUser,
}) => {
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [contactNumber, setContactNumber] = useState(currentUser.contactNumber || '');
  const [address, setAddress] = useState(currentUser.address || '');
  const [purok, setPurok] = useState(currentUser.purok || 'Purok 1 - Rose');
  const [idType, setIdType] = useState(currentUser.idType || 'Philippine National ID');
  const [idNumber, setIdNumber] = useState(currentUser.idNumber || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...currentUser,
      fullName: fullName.trim(),
      contactNumber: contactNumber.trim(),
      address: address.trim(),
      purok,
      idType,
      idNumber: idNumber.trim(),
    };

    const users = StorageService.getUsers();
    const idx = users.findIndex((u) => u.id === currentUser.id);
    if (idx !== -1) {
      users[idx] = updated;
      StorageService.saveUsers([...users]);
    }

    StorageService.setCurrentUser(updated);
    StorageService.addAuditLog(updated, 'PROFILE_UPDATED', 'user', updated.id, 'Resident updated contact details');
    onUpdateUser(updated);

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <h3 className="font-bold text-xs sm:text-sm">Resident Profile & Credentials</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">{currentUser.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Verification Badge */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Residency Verification</p>
              <p className="text-xs font-bold text-slate-900 capitalize">
                Status: {currentUser.verificationStatus || 'Pending Review'}
              </p>
            </div>
            {currentUser.verificationStatus === 'verified' ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            ) : (
              <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold">
                Under Review
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Mobile #
              </label>
              <input
                type="tel"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="0917-000-0000"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-mono-numbers"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Barangay Purok
              </label>
              <select
                value={purok}
                onChange={(e) => setPurok(e.target.value)}
                className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-teal-500"
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Registered Street Address
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ID Type Presented
              </label>
              <input
                type="text"
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ID Reference Number
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="e.g. PH-ID-XXXX-XXXX"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-mono-numbers"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
