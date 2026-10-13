import React, { useState, useEffect } from 'react';
import {
  User,
  ServiceSubmission,
  ServiceCategory,
  Announcement,
  AuditLog,
  NotificationItem,
} from './types';
import { StorageService } from './services/storage';
import { SplashScreen } from './components/common/SplashScreen';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { PrintSlipModal } from './components/common/PrintSlipModal';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { SqlSpecModal } from './components/common/SqlSpecModal';
import { LandingPage } from './components/public/LandingPage';
import { PublicTrackModal } from './components/public/PublicTrackModal';
import { AuthModal } from './components/auth/AuthModal';
import { ResidentDashboard } from './components/resident/ResidentDashboard';
import { SubmitRequestModal } from './components/resident/SubmitRequestModal';
import { SubmitComplaintModal } from './components/resident/SubmitComplaintModal';
import { ResidentProfileModal } from './components/resident/ResidentProfileModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  // Splash Screen State (shows once per session, bypassable)
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return sessionStorage.getItem('brgy_splash_seen') !== 'true';
    } catch {
      return false;
    }
  });

  const handleDismissSplash = () => {
    try {
      sessionStorage.setItem('brgy_splash_seen', 'true');
    } catch {}
    setShowSplash(false);
  };

  // Active View: 'landing' | 'resident' | 'admin'
  const [activeView, setActiveView] = useState<'landing' | 'resident' | 'admin'>('landing');

  // Core Data State
  const [currentUser, setCurrentUser] = useState<User | null>(StorageService.getCurrentUser());
  const [submissions, setSubmissions] = useState<ServiceSubmission[]>(StorageService.getSubmissions());
  const [categories, setCategories] = useState<ServiceCategory[]>(StorageService.getCategories());
  const [announcements, setAnnouncements] = useState<Announcement[]>(StorageService.getAnnouncements());
  const [notifications, setNotifications] = useState<NotificationItem[]>(StorageService.getNotifications());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(StorageService.getAuditLogs());
  const [users, setUsers] = useState<User[]>(StorageService.getUsers());

  // Modals State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'admin'>('login');
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackInitialCode, setTrackInitialCode] = useState<string>('');
  const [isSubmitRequestOpen, setIsSubmitRequestOpen] = useState(false);
  const [selectedReqCategory, setSelectedReqCategory] = useState<ServiceCategory | undefined>(undefined);
  const [isSubmitComplaintOpen, setIsSubmitComplaintOpen] = useState(false);
  const [selectedCompCategory, setSelectedCompCategory] = useState<ServiceCategory | undefined>(undefined);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [printSlipSubmission, setPrintSlipSubmission] = useState<ServiceSubmission | null>(null);

  // Refresh all state from StorageService
  const refreshData = () => {
    setSubmissions(StorageService.getSubmissions());
    setCategories(StorageService.getCategories());
    setAnnouncements(StorageService.getAnnouncements());
    setNotifications(StorageService.getNotifications());
    setAuditLogs(StorageService.getAuditLogs());
    setUsers(StorageService.getUsers());
    setCurrentUser(StorageService.getCurrentUser());
  };

  // Unread notifications count
  const unreadCount = currentUser
    ? notifications.filter((n) => n.userId === currentUser.id && !n.isRead).length
    : 0;

  // View Navigation Handler
  const handleNavigate = (view: 'landing' | 'resident' | 'admin', subSection?: string) => {
    if (view === 'resident') {
      if (!currentUser || currentUser.role !== 'resident') {
        setAuthTab('login');
        setIsAuthOpen(true);
        return;
      }
    } else if (view === 'admin') {
      if (!currentUser || currentUser.role === 'resident') {
        setAuthTab('admin');
        setIsAuthOpen(true);
        return;
      }
    }

    setActiveView(view);

    if (subSection) {
      setTimeout(() => {
        const el = document.getElementById(subSection);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Auth Success Handler
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    refreshData();
    if (user.role === 'resident') {
      setActiveView('resident');
    } else {
      setActiveView('admin');
    }
  };

  // Logout Handler
  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
    setActiveView('landing');
    refreshData();
  };

  // Open Service Request Form
  const handleOpenRequestService = (cat?: ServiceCategory) => {
    if (!currentUser) {
      setAuthTab('login');
      setIsAuthOpen(true);
      return;
    }
    setSelectedReqCategory(cat);
    setIsSubmitRequestOpen(true);
  };

  // Open Complaint Form
  const handleOpenReportComplaint = (cat?: ServiceCategory) => {
    if (!currentUser) {
      setAuthTab('login');
      setIsAuthOpen(true);
      return;
    }
    setSelectedCompCategory(cat);
    setIsSubmitComplaintOpen(true);
  };

  // Quick Track Code Handler
  const handleOpenQuickTrack = (initialCode?: string) => {
    setTrackInitialCode(initialCode || '');
    setIsTrackModalOpen(true);
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = () => {
    if (!currentUser) return;
    const all = StorageService.getNotifications();
    const updated = all.map((n) => (n.userId === currentUser.id ? { ...n, isRead: true } : n));
    StorageService.saveNotifications(updated);
    setNotifications(updated);
  };

  return (
    <div className="min-h-screen w-full max-w-full flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-600 selection:text-white overflow-x-hidden">
      {/* 1. SPLASH SCREEN */}
      {showSplash && <SplashScreen onDismiss={handleDismissSplash} />}

      {/* 2. TOP HEADER */}
      <Header
        currentUser={currentUser}
        activeView={activeView}
        unreadCount={unreadCount}
        onNavigate={handleNavigate}
        onOpenAuth={(tab = 'login') => {
          setAuthTab(tab);
          setIsAuthOpen(true);
        }}
        onOpenQuickTrack={() => handleOpenQuickTrack()}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* 3. MAIN VIEW ROUTING */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {activeView === 'landing' && (
          <LandingPage
            categories={categories}
            announcements={announcements}
            currentUser={currentUser}
            onOpenTrackModal={handleOpenQuickTrack}
            onRequestService={handleOpenRequestService}
            onReportComplaint={handleOpenReportComplaint}
            onOpenAuth={(tab) => {
              setAuthTab(tab);
              setIsAuthOpen(true);
            }}
          />
        )}

        {activeView === 'resident' && currentUser && currentUser.role === 'resident' && (
          <ResidentDashboard
            currentUser={currentUser}
            submissions={submissions}
            announcements={announcements}
            onRequestService={() => handleOpenRequestService()}
            onReportComplaint={() => handleOpenReportComplaint()}
            onSelectSubmission={(sub) => {
              handleOpenQuickTrack(sub.trackingCode);
            }}
            onPrintSlip={(sub) => setPrintSlipSubmission(sub)}
          />
        )}

        {activeView === 'admin' && currentUser && currentUser.role !== 'resident' && (
          <AdminDashboard
            currentUser={currentUser}
            submissions={submissions}
            categories={categories}
            announcements={announcements}
            auditLogs={auditLogs}
            users={users}
            onRefreshData={refreshData}
            onPrintSlip={(sub) => setPrintSlipSubmission(sub)}
            onOpenSqlModal={() => setIsSqlModalOpen(true)}
          />
        )}
      </main>

      {/* 4. FOOTER */}
      <Footer
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        onOpenAuth={(tab) => {
          setAuthTab(tab);
          setIsAuthOpen(true);
        }}
      />

      {/* MODALS */}
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        defaultTab={authTab}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Public Quick Track Modal */}
      {isTrackModalOpen && (
        <PublicTrackModal
          initialCode={trackInitialCode}
          currentUser={currentUser}
          onClose={() => setIsTrackModalOpen(false)}
          onPrintSlip={(sub) => {
            setIsTrackModalOpen(false);
            setPrintSlipSubmission(sub);
          }}
        />
      )}

      {/* Submit Request Modal */}
      {currentUser && (
        <SubmitRequestModal
          isOpen={isSubmitRequestOpen}
          categories={categories}
          currentUser={currentUser}
          initialCategory={selectedReqCategory}
          onClose={() => setIsSubmitRequestOpen(false)}
          onSuccess={(newSub) => {
            setIsSubmitRequestOpen(false);
            refreshData();
            setPrintSlipSubmission(newSub);
          }}
        />
      )}

      {/* Submit Complaint Modal */}
      {currentUser && (
        <SubmitComplaintModal
          isOpen={isSubmitComplaintOpen}
          categories={categories}
          currentUser={currentUser}
          initialCategory={selectedCompCategory}
          onClose={() => setIsSubmitComplaintOpen(false)}
          onSuccess={(newSub) => {
            setIsSubmitComplaintOpen(false);
            refreshData();
            setPrintSlipSubmission(newSub);
          }}
        />
      )}

      {/* Resident Profile Modal */}
      {currentUser && (
        <ResidentProfileModal
          currentUser={currentUser}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onUpdateUser={(updated) => {
            setCurrentUser(updated);
            refreshData();
          }}
        />
      )}

      {/* Notifications Drawer */}
      <NotificationsDrawer
        notifications={
          currentUser ? notifications.filter((n) => n.userId === currentUser.id) : []
        }
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectTracking={(code) => handleOpenQuickTrack(code)}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />

      {/* Official Printable Receipt Slip Modal */}
      {printSlipSubmission && (
        <PrintSlipModal
          submission={printSlipSubmission}
          onClose={() => setPrintSlipSubmission(null)}
        />
      )}

      {/* SQL & PHP API Modal */}
      <SqlSpecModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />
    </div>
  );
}
