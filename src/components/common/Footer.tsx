import React from 'react';
import { Shield, Phone, MapPin, Clock, FileCode, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onOpenSqlModal: () => void;
  onOpenAuth: (tab: 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSqlModal, onOpenAuth }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-12 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Government Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
              <img
                src="/src/assets/images/brgy_san_miguel_seal_1791900657851.jpg"
                alt="Brgy San Miguel Seal"
                className="w-7 h-7 rounded-full border border-amber-400/80 object-cover"
              />
              <span>Brgy. San Miguel</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Official electronic civic services and community desk portal of Brgy. San Miguel, Municipality of San Manuel, Tarlac.
            </p>
            <div className="flex items-center gap-1.5 text-teal-400 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Compliant with DILG & ARTA Guidelines</span>
            </div>
          </div>

          {/* Col 2: Civic Office Hours & Location */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              Barangay Hall Desk
            </h4>
            <div className="flex items-start gap-2 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
              <span>Barangay Hall Complex, Brgy. San Miguel, San Manuel, Tarlac</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Monday to Friday: 8:00 AM – 5:00 PM</span>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Online service submissions and complaints accepted 24/7.
            </p>
          </div>

          {/* Col 3: Emergency Hotlines */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              Emergency Hotlines
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              <li className="flex items-center justify-between">
                <span>Barangay Tanod Desk:</span>
                <span className="font-mono-numbers text-white font-medium">(045) 923-1045</span>
              </li>
              <li className="flex items-center justify-between">
                <span>San Manuel MDRRMO:</span>
                <span className="font-mono-numbers text-white font-medium">(045) 923-1191</span>
              </li>
              <li className="flex items-center justify-between">
                <span>San Manuel Municipal Police:</span>
                <span className="font-mono-numbers text-white font-medium">0998-598-5487</span>
              </li>
              <li className="flex items-center justify-between">
                <span>San Manuel BFP Fire Station:</span>
                <span className="font-mono-numbers text-white font-medium">0915-602-1845</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Architecture & Admin Access */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              System Architecture
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Designed for dual deployment: static frontend (GitHub Pages compatible) paired with PHP 8+ REST API and MySQL 8+ database.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={onOpenSqlModal}
                className="text-left text-teal-400 hover:text-teal-300 flex items-center gap-1.5 font-medium"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Export MySQL Schema & PHP Guide</span>
              </button>
              <button
                onClick={() => onOpenAuth('admin')}
                className="text-left text-amber-400 hover:text-amber-300 flex items-center gap-1.5 font-medium"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Barangay Official Login (`/admin`)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2026 Republic of the Philippines · Sangguniang Barangay San Miguel, San Manuel, Tarlac. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Data Privacy Act of 2012 (RA 10173) Compliant</span>
            <span aria-hidden="true">·</span>
            <span>WCAG 2.2 AA Accessible</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
