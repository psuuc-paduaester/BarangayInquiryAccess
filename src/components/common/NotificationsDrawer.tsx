import React from 'react';
import { NotificationItem } from '../../types';
import { Bell, X, Check, ExternalLink, Clock } from 'lucide-react';

interface NotificationsDrawerProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectTracking: (code: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  notifications,
  isOpen,
  onClose,
  onSelectTracking,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-80 max-w-[90vw] bg-white shadow-xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-400" />
              <h3 className="font-semibold text-sm">Notifications & Updates</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onMarkAllRead}
                className="text-[11px] text-teal-300 hover:text-white underline"
              >
                Mark all read
              </button>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>No notifications yet</p>
                <p className="text-[11px] text-slate-400 mt-1">Updates on your submissions will appear here.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    item.isRead
                      ? 'bg-slate-50 border-slate-200 text-slate-700'
                      : 'bg-teal-50/50 border-teal-200 text-slate-900 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs font-semibold">{item.title}</h4>
                    <span className="text-[10px] text-slate-500 font-mono-numbers shrink-0">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    {item.message}
                  </p>

                  {item.trackingCode && (
                    <button
                      onClick={() => {
                        onSelectTracking(item.trackingCode!);
                        onClose();
                      }}
                      className="text-xs text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1"
                    >
                      <span>Track {item.trackingCode}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
