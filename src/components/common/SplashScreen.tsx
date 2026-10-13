import React, { useEffect, useState } from 'react';
import { ArrowRight, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../../services/storage';

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(StorageService.getReducedMotion());

  useEffect(() => {
    if (reducedMotion) {
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onDismiss, 100);
          return 100;
        }
        return prev + 10;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onDismiss, reducedMotion]);

  const toggleReducedMotion = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    StorageService.setReducedMotion(next);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white p-4 sm:p-6 select-none overflow-y-auto max-h-screen"
      onClick={onDismiss}
    >
      {/* Decorative subtle ambient backdrop */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url('/src/assets/images/brgy_hall_exterior_1791899103314.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950 pointer-events-none" />

      {/* Main card */}
      <div 
        className="relative z-10 max-w-sm sm:max-w-md w-full flex flex-col items-center text-center my-auto py-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Seal emblem */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-teal-500 to-amber-400 opacity-60 blur-sm animate-pulse" />
          <img
            src="/src/assets/images/brgy_san_miguel_seal_1791900657851.jpg"
            alt="Official Seal of Barangay San Miguel, San Manuel, Tarlac"
            className="relative w-full h-full object-cover rounded-full border-2 border-amber-400/80 shadow-2xl"
          />
        </div>

        <p className="text-[11px] sm:text-xs uppercase tracking-widest text-teal-400 font-medium mb-1">
          Republic of the Philippines · Municipality of San Manuel, Tarlac
        </p>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5">
          Barangay San Miguel
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xs sm:max-w-sm mb-4 leading-relaxed">
          Civic Service Request & Community Complaint Management Portal
        </p>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 sm:h-2 mb-2 overflow-hidden border border-slate-700">
          <div
            className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-75 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mb-5 font-mono-numbers">
          <span>Initializing secure portal</span>
          <span>{progress}%</span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full justify-center">
          <button
            onClick={onDismiss}
            className="w-full sm:w-auto px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-900/30 whitespace-nowrap"
          >
            <span>Enter Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={toggleReducedMotion}
            className="w-full sm:w-auto px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
            title="Toggle reduced motion animation for accessibility"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>{reducedMotion ? 'Reduced Motion: ON' : 'Reduce Motion'}</span>
          </button>
        </div>

        {/* Trust marker */}
        <div className="mt-4 sm:mt-6 flex items-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Compliant with RA 11032 Ease of Doing Business</span>
        </div>
      </div>
    </div>
  );
};
