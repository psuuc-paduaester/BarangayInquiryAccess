import React, { useState } from 'react';
import {
  X,
  Shield,
  User as UserIcon,
  Lock,
  Mail,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { User, UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  defaultTab?: 'login' | 'register' | 'admin';
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  defaultTab = 'login',
  onClose,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'admin'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regContact, setRegContact] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPurok, setRegPurok] = useState('Purok 1 - Rose');
  const [regIdType, setRegIdType] = useState('Philippine National ID');
  const [regIdNumber, setRegIdNumber] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleResidentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const users = StorageService.getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === loginEmail.toLowerCase().trim() && u.role === 'resident'
    );

    if (!user) {
      setError('Resident account not found with this email. Try using demo account or Register.');
      return;
    }

    if (user.accountStatus === 'deactivated') {
      setError('This resident account has been suspended. Please visit the Barangay Hall.');
      return;
    }

    StorageService.setCurrentUser(user);
    StorageService.addAuditLog(user, 'USER_LOGIN', 'auth', user.id, 'Resident logged in successfully');
    onLoginSuccess(user);
    onClose();
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const users = StorageService.getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === loginEmail.toLowerCase().trim() && u.role !== 'resident'
    );

    if (!user) {
      setError('Official / Administrator credentials not recognized. Click a Demo Official account below.');
      return;
    }

    StorageService.setCurrentUser(user);
    StorageService.addAuditLog(user, 'ADMIN_LOGIN', 'auth', user.id, `Staff logged in with role ${user.role}`);
    onLoginSuccess(user);
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regFullName || !regEmail || !regContact || !regAddress || !regPassword) {
      setError('Please complete all required fields.');
      return;
    }

    const users = StorageService.getUsers();
    if (users.some((u) => u.email.toLowerCase() === regEmail.toLowerCase().trim())) {
      setError('An account with this email address already exists.');
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      fullName: regFullName.trim(),
      email: regEmail.trim(),
      role: 'resident',
      accountStatus: 'active',
      createdAt: new Date().toISOString(),
      address: regAddress.trim(),
      purok: regPurok,
      contactNumber: regContact.trim(),
      idType: regIdType,
      idNumber: regIdNumber.trim() || 'Pending Submission',
      verificationStatus: 'pending',
    };

    StorageService.saveUsers([...users, newUser]);
    StorageService.setCurrentUser(newUser);
    StorageService.addAuditLog(newUser, 'RESIDENT_REGISTERED', 'user', newUser.id, `New resident registered in ${regPurok}`);
    onLoginSuccess(newUser);
    onClose();
  };

  // Quick Demo Login Helper
  const handleDemoLogin = (email: string) => {
    const users = StorageService.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      StorageService.setCurrentUser(user);
      onLoginSuccess(user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Tabs */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 pb-0 shrink-0">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-400 shrink-0" />
              <div>
                <h3 className="font-bold text-xs sm:text-sm">Brgy. San Miguel, San Manuel, Tarlac</h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400">Secure Identity & Official Civic Portal</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Clean Segmented Tab Buttons */}
          <div className="flex border-b border-slate-800 gap-1 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => {
                setTab('login');
                setError(null);
              }}
              className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
                tab === 'login'
                  ? 'border-teal-400 text-teal-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Resident Login
            </button>
            <button
              onClick={() => {
                setTab('register');
                setError(null);
              }}
              className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
                tab === 'register'
                  ? 'border-teal-400 text-teal-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              New Resident
            </button>
            <button
              onClick={() => {
                setTab('admin');
                setError(null);
              }}
              className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1 whitespace-nowrap ${
                tab === 'admin'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Official Desk</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: RESIDENT LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleResidentLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resident Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. juan.delacruz@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                Sign In to Resident Desk
              </button>
            </form>
          )}

          {/* TAB 2: RESIDENT REGISTRATION */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="e.g. Juan Dela Cruz"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="juan@email.com"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regContact}
                    onChange={(e) => setRegContact(e.target.value)}
                    placeholder="0917-123-4567"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                    Assigned Purok *
                  </label>
                  <select
                    value={regPurok}
                    onChange={(e) => setRegPurok(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-teal-500"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                    Valid ID Type
                  </label>
                  <select
                    value={regIdType}
                    onChange={(e) => setRegIdType(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Philippine National ID">Philippine National ID</option>
                    <option value="Passport">Passport</option>
                    <option value="Driver License">Driver License</option>
                    <option value="Postal ID">Postal ID</option>
                    <option value="Voter ID / Certificate">Voter Certificate</option>
                    <option value="Barangay Resident ID">Barangay Resident ID</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                  Complete Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="House #, Street name, Landmark"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-0.5">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create secure password"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                Register & Create Profile
              </button>
            </form>
          )}

          {/* TAB 3: ADMIN / OFFICIAL LOGIN */}
          {tab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-800">
                <p className="font-semibold flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span>Restricted Official Area</span>
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Authorized access for Punong Barangay, Sangguniang Barangay, Desk Officers, and Barangay Tanod personnel only.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. admin@barangay.gov.ph"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Authenticate Official Session</span>
              </button>
            </form>
          )}

          {/* ONE-CLICK DEMO TEST ACCOUNTS STRIP */}
          <div className="pt-3 border-t border-slate-200">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              1-Click Demo Testing Accounts
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoLogin('juan.delacruz@gmail.com')}
                className="p-2 text-left bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-lg transition-colors"
              >
                <p className="font-semibold text-slate-900">Juan Dela Cruz</p>
                <p className="text-[10px] text-teal-700">Resident (Verified)</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('records@barangay.gov.ph')}
                className="p-2 text-left bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-lg transition-colors"
              >
                <p className="font-semibold text-slate-900">Carmela Reyes</p>
                <p className="text-[10px] text-teal-700">Records Desk Officer</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('tanod@barangay.gov.ph')}
                className="p-2 text-left bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded-lg transition-colors"
              >
                <p className="font-semibold text-slate-900">Danilo Morales</p>
                <p className="text-[10px] text-amber-700">Tanod Field Chief</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin@barangay.gov.ph')}
                className="p-2 text-left bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded-lg transition-colors"
              >
                <p className="font-semibold text-slate-900">Hon. Roberto Hernandez</p>
                <p className="text-[10px] text-amber-700">Punong Barangay (Admin)</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
