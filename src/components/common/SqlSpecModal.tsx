import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, Server, Database } from 'lucide-react';
import { generateSqlSchema, generateSqlSeed } from '../../services/sqlExport';

interface SqlSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlSpecModal: React.FC<SqlSpecModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'seed' | 'php_api'>('schema');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const schemaContent = generateSqlSchema();
  const seedContent = generateSqlSeed();
  const phpApiContent = `<?php
/**
 * BARANGAY CIVIC SERVICES & COMPLAINT PORTAL - PHP 8+ REST API SPECIFICATION
 * Compatible with Apache / Nginx / XAMPP with MySQL 8.0+ / MariaDB
 * Matches Section 7 & Section 9 of Project Architecture
 */

// routes.php
return [
  // Authentication & Session
  'POST /api/auth/register'       => 'AuthController@register',
  'POST /api/auth/login'          => 'AuthController@login',
  'POST /api/auth/logout'         => 'AuthController@logout',
  'GET  /api/auth/me'             => 'AuthController@me',

  // Service Requests & Complaints (Unified table: service_requests)
  'GET  /api/requests'            => 'RequestController@index',       // Filter by status, purok, type
  'POST /api/requests'            => 'RequestController@create',      // Generates BRGY-2026-SR-XXXXX
  'GET  /api/requests/{tracking}' => 'RequestController@showByTracking', // Public tracking endpoint
  'PUT  /api/requests/{id}/status'=> 'RequestController@updateStatus', // Role restricted (admin/officer)
  'POST /api/requests/{id}/notes' => 'RequestController@addFollowUp',  // Citizen follow-up

  // Public Categories & Announcements
  'GET  /api/categories'          => 'CategoryController@index',
  'GET  /api/announcements'       => 'AnnouncementController@index',
  'POST /api/announcements'       => 'AnnouncementController@create', // Admin only
  'DELETE /api/announcements/{id}'=> 'AnnouncementController@delete', // Admin only

  // Resident & Staff Administration
  'GET  /api/admin/users'         => 'AdminController@users',
  'PUT  /api/admin/users/{id}/verify' => 'AdminController@verifyResident',
  'GET  /api/admin/audit-logs'    => 'AdminController@auditLogs',
  'GET  /api/admin/export-csv'    => 'AdminController@exportCsv',
];
`;

  const currentText =
    activeTab === 'schema' ? schemaContent : activeTab === 'seed' ? seedContent : phpApiContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename =
      activeTab === 'schema'
        ? 'schema.sql'
        : activeTab === 'seed'
        ? 'seed.sql'
        : 'php_api_routes.php';
    const blob = new Blob([currentText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 text-white rounded-xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-slate-800">
        {/* Header */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-white">Database & PHP API Backend Specification</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                MySQL / MariaDB Schema (Section 6) & PHP Controller Routes (Section 7)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls & Actions */}
        <div className="px-5 sm:px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'schema'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              MySQL schema.sql
            </button>
            <button
              onClick={() => setActiveTab('seed')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'seed'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              MySQL seed.sql
            </button>
            <button
              onClick={() => setActiveTab('php_api')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'php_api'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PHP 8+ API Endpoints
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Code Content Viewport */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <pre className="font-mono text-xs bg-slate-950 p-4 rounded-lg overflow-x-auto text-teal-300 leading-relaxed border border-slate-800 selection:bg-teal-700">
            {currentText}
          </pre>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>InnoDB Engine · UTF-8 Unicode · Prepared Statements with PDO</span>
          <button onClick={onClose} className="text-teal-400 hover:underline">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
