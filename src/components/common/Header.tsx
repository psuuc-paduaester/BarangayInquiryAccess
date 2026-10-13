import React, { useState } from 'react';
import { User } from '../../types';
import {
  Bell,
  Search,
  User as UserIcon,
  LogOut,
  Shield,
  FileText,
  AlertTriangle,
  Menu,
  X,
  FileCode,
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  activeView: 'landing' | 'resident' | 'admin';
  unreadCount: number;
  onNavigate: (view: 'landing' | 'resident' | 'admin', subSection?: string) => void;
  onOpenAuth: (defaultTab?: 'login' | 'register' | 'admin') => void;
  onOpenQuickTrack: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenSqlModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeView,
  unreadCount,
  onNavigate,
  onOpenAuth,
  onOpenQuickTrack,
  onOpenNotifications,
  onOpenProfile,
  onOpenSqlModal,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: 'landing' | 'resident' | 'admin', subSection?: string) => {
    onNavigate(view, subSection);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 lg:gap-8 h-16">
          {/* ZONE 1: Single text element brand wordmark */}
          <button
            onClick={() => handleNav('landing')}
            className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none group whitespace-nowrap shrink-0"
          >
            <img
              src="/src/assets/images/brgy_san_miguel_seal_1791900657851.jpg"
              alt="Barangay San Miguel Seal"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-amber-400/60 object-cover"
            />
            <div>
              <span className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-white group-hover:text-teal-400 transition-colors">
                Brgy. San Miguel
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] lg:text-xs text-teal-400 font-medium">
                San Manuel, Tarlac
              </span>
            </div>
          </button>

          {/* ZONE 2: clean single-line nav links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNav('landing')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'landing' ? 'text-teal-400 font-semibold' : ''
              }`}
            >
              Public Home
            </button>
            <button
              onClick={onOpenQuickTrack}
              className="hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Search className="w-3.5 h-3.5 text-teal-400" />
              <span>Track Request</span>
            </button>
            <button
              onClick={() => handleNav('landing', 'services')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Citizen Services
            </button>
            <button
              onClick={() => handleNav('landing', 'announcements')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Announcements
            </button>

            {currentUser && currentUser.role === 'resident' && (
              <button
                onClick={() => handleNav('resident')}
                className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                  activeView === 'resident' ? 'text-teal-400 font-semibold' : ''
                }`}
              >
                Resident Desk
              </button>
            )}

            {currentUser && currentUser.role !== 'resident' && (
              <button
                onClick={() => handleNav('admin')}
                className={`hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeView === 'admin' ? 'text-amber-400 font-semibold' : ''
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Official Console</span>
              </button>
            )}
          </nav>

          {/* ZONE 3: 1 primary action or authenticated control cluster */}
          <div className="flex items-center gap-3 shrink-0">
            {/* SQL & Dev Reference helper button */}
            <button
              onClick={onOpenSqlModal}
              title="View MySQL Schema & PHP API Specs"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-md transition-colors whitespace-nowrap"
            >
              <FileCode className="w-3.5 h-3.5 text-teal-400" />
              <span>SQL / PHP API</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Notifications button */}
                <button
                  onClick={onOpenNotifications}
                  className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-teal-400 rounded-full" />
                  )}
                </button>

                {/* Profile pill button */}
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-white transition-colors whitespace-nowrap"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center text-[10px] font-bold">
                      {currentUser.fullName.charAt(0)}
                    </div>
                  )}
                  <span className="max-w-[110px] truncate">{currentUser.fullName}</span>
                </button>

                {/* Logout */}
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  Resident Login
                </button>
                <button
                  onClick={() => onOpenAuth('admin')}
                  className="px-3.5 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors shadow-sm whitespace-nowrap flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Desk</span>
                </button>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-4 space-y-2 text-sm">
          <button
            onClick={() => handleNav('landing')}
            className="w-full text-left py-2 px-3 rounded-md hover:bg-slate-800 text-slate-200"
          >
            Public Home
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenQuickTrack();
            }}
            className="w-full text-left py-2 px-3 rounded-md hover:bg-slate-800 text-slate-200 flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-teal-400" />
            <span>Track Application or Complaint</span>
          </button>
          <button
            onClick={() => handleNav('landing', 'services')}
            className="w-full text-left py-2 px-3 rounded-md hover:bg-slate-800 text-slate-200"
          >
            Citizen Services
          </button>
          <button
            onClick={() => handleNav('landing', 'announcements')}
            className="w-full text-left py-2 px-3 rounded-md hover:bg-slate-800 text-slate-200"
          >
            Announcements & Advisories
          </button>

          {currentUser?.role === 'resident' && (
            <button
              onClick={() => handleNav('resident')}
              className="w-full text-left py-2 px-3 rounded-md bg-teal-950/60 text-teal-300 font-medium"
            >
              Resident Portal Dashboard
            </button>
          )}

          {currentUser && currentUser.role !== 'resident' && (
            <button
              onClick={() => handleNav('admin')}
              className="w-full text-left py-2 px-3 rounded-md bg-amber-950/60 text-amber-300 font-medium"
            >
              Barangay Admin Console
            </button>
          )}

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSqlModal();
              }}
              className="text-xs text-teal-400 flex items-center gap-1"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>SQL Schema & API Docs</span>
            </button>
            {currentUser && (
              <button
                onClick={onLogout}
                className="text-xs text-rose-400 hover:text-rose-300"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
