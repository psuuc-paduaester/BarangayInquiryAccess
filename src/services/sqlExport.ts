/**
 * SQL Schema & Seed Generator according to Section 6 of the Project Outline.
 * Produces valid MySQL 8+ / MariaDB DDL with foreign keys, indexes, and sample seeds.
 */

export const generateSqlSchema = (): string => {
  return `-- ====================================================================
-- BARANGAY SERVICE REQUEST AND COMPLAINT PORTAL (barangay_portal_db)
-- Database Architecture: MySQL 8.0+ / MariaDB 10.4+
-- Generated for Barangay San Miguel, Municipality of San Manuel, Tarlac
-- ====================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS request_assignments;
DROP TABLE IF EXISTS request_status_history;
DROP TABLE IF EXISTS request_attachments;
DROP TABLE IF EXISTS service_requests;
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS service_categories;
DROP TABLE IF EXISTS resident_profiles;
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------------------
-- 1. Table: users
-- Core accounts for residents, desk officers, field tanods, and admins.
-- --------------------------------------------------------------------
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('resident', 'admin', 'records_officer', 'field_officer') DEFAULT 'resident',
  account_status ENUM('active', 'deactivated', 'pending_verification') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. Table: resident_profiles
-- Detailed barangay verification information, Purok, address, contacts.
-- --------------------------------------------------------------------
CREATE TABLE resident_profiles (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  address VARCHAR(255) NOT NULL,
  purok VARCHAR(50) NOT NULL,
  contact_number VARCHAR(30) NOT NULL,
  id_type VARCHAR(60),
  id_number VARCHAR(60),
  verification_status ENUM('verified', 'pending', 'unverified') DEFAULT 'pending',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_profiles_purok (purok),
  INDEX idx_profiles_status (verification_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. Table: service_categories
-- Classification for document clearances and complaint issues.
-- --------------------------------------------------------------------
CREATE TABLE service_categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('service_request', 'complaint') NOT NULL,
  description TEXT,
  processing_days INT DEFAULT 2,
  fee_php DECIMAL(10, 2) DEFAULT 0.00,
  is_active TINYINT(1) DEFAULT 1,
  INDEX idx_categories_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. Table: service_requests
-- Unified table handling both service requests and complaints.
-- --------------------------------------------------------------------
CREATE TABLE service_requests (
  id VARCHAR(36) PRIMARY KEY,
  tracking_code VARCHAR(32) NOT NULL UNIQUE,
  request_type ENUM('service_request', 'complaint') NOT NULL,
  resident_id VARCHAR(36) NOT NULL,
  category_id VARCHAR(36) NOT NULL,
  subject VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(200) NOT NULL,
  urgency ENUM('low', 'normal', 'urgent') DEFAULT 'normal',
  status ENUM('submitted', 'under_review', 'in_progress', 'resolved', 'rejected', 'returned_for_info', 'cancelled') DEFAULT 'submitted',
  assigned_to VARCHAR(120),
  resolution_notes TEXT,
  resolved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (resident_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE RESTRICT,
  INDEX idx_requests_tracking (tracking_code),
  INDEX idx_requests_resident (resident_id),
  INDEX idx_requests_status (status),
  INDEX idx_requests_type (request_type),
  INDEX idx_requests_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. Table: request_attachments
-- Uploaded proof, valid ID copies, or incident photo evidence.
-- --------------------------------------------------------------------
CREATE TABLE request_attachments (
  id VARCHAR(36) PRIMARY KEY,
  request_id VARCHAR(36) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size VARCHAR(50),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES service_requests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 6. Table: request_status_history
-- Immutable audit timeline of all state transitions.
-- --------------------------------------------------------------------
CREATE TABLE request_status_history (
  id VARCHAR(36) PRIMARY KEY,
  request_id VARCHAR(36) NOT NULL,
  changed_by VARCHAR(120) NOT NULL,
  changed_by_role VARCHAR(50) NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  remarks TEXT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES service_requests(id) ON DELETE CASCADE,
  INDEX idx_history_request (request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 7. Table: announcements
-- Public advisories, emergency alerts, health drives.
-- --------------------------------------------------------------------
CREATE TABLE announcements (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(60) NOT NULL,
  published_by VARCHAR(120) NOT NULL,
  publish_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  is_pinned TINYINT(1) DEFAULT 0,
  status ENUM('published', 'draft', 'archived') DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 8. Table: notifications
-- In-app notifications for status updates and advisories.
-- --------------------------------------------------------------------
CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  tracking_code VARCHAR(32),
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notif_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 9. Table: audit_logs
-- Comprehensive administrative audit trail.
-- --------------------------------------------------------------------
CREATE TABLE audit_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  user_name VARCHAR(120) NOT NULL,
  action VARCHAR(80) NOT NULL,
  entity_type VARCHAR(60) NOT NULL,
  entity_id VARCHAR(60) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_user (user_id),
  INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;
};

export const generateSqlSeed = (): string => {
  return `-- ====================================================================
-- SEED DATA FOR BARANGAY PORTAL
-- Default administrative and resident test accounts
-- Passwords hashed via PHP standard password_hash(..., PASSWORD_BCRYPT)
-- ====================================================================

-- 1. Users
INSERT INTO users (id, full_name, email, password_hash, role, account_status) VALUES
('usr-admin-01', 'Hon. Roberto Hernandez', 'admin@barangay.gov.ph', '$2y$10$e8V9MhY96sZtJk6t7eOsu.u2u7eF3gYqXG3M4XfQ98N0m2OqK1y7W', 'admin', 'active'),
('usr-officer-01', 'Carmela Reyes (Desk Officer)', 'records@barangay.gov.ph', '$2y$10$e8V9MhY96sZtJk6t7eOsu.u2u7eF3gYqXG3M4XfQ98N0m2OqK1y7W', 'records_officer', 'active'),
('usr-tanod-01', 'Officer Danilo Morales', 'tanod@barangay.gov.ph', '$2y$10$e8V9MhY96sZtJk6t7eOsu.u2u7eF3gYqXG3M4XfQ98N0m2OqK1y7W', 'field_officer', 'active'),
('usr-res-01', 'Juan Dela Cruz', 'juan.delacruz@gmail.com', '$2y$10$e8V9MhY96sZtJk6t7eOsu.u2u7eF3gYqXG3M4XfQ98N0m2OqK1y7W', 'resident', 'active'),
('usr-res-02', 'Maria Santos', 'maria.santos@gmail.com', '$2y$10$e8V9MhY96sZtJk6t7eOsu.u2u7eF3gYqXG3M4XfQ98N0m2OqK1y7W', 'resident', 'active');

-- 2. Resident Profiles
INSERT INTO resident_profiles (id, user_id, address, purok, contact_number, id_type, id_number, verification_status) VALUES
('prof-01', 'usr-res-01', '142 Rizal St, Purok 3', 'Purok 3 - Sampaguita', '0917-882-3411', 'Philippine National ID', 'PH-ID-9921-3312', 'verified'),
('prof-02', 'usr-res-02', '88 Mabini Ave, Purok 5', 'Purok 5 - Ilang-Ilang', '0922-441-9982', 'Postal ID', 'POST-PAS-11204', 'pending');

-- 3. Service Categories
INSERT INTO service_categories (id, name, type, description, processing_days, fee_php, is_active) VALUES
('cat-clr', 'Barangay Clearance', 'service_request', 'Official certification for employment, local requirements, or legal identification.', 1, 50.00, 1),
('cat-ind', 'Certificate of Indigency', 'service_request', 'Certification for social services, medical assistance, scholarship, or PAO legal aid.', 1, 0.00, 1),
('cat-res', 'Certificate of Residency', 'service_request', 'Proof of bona fide residency in the barangay for bank opening or public utilities.', 1, 50.00, 1),
('cat-biz', 'Barangay Business Clearance', 'service_request', 'Endorsement for local business registration or annual mayor permit renewal.', 3, 200.00, 1),
('cat-cp-gar', 'Garbage & Sanitation Hazard', 'complaint', 'Uncollected trash, improper waste disposal, or open burning (anti-smoke belching).', 2, 0.00, 1),
('cat-cp-str', 'Defective Streetlight & Dark Alley', 'complaint', 'Non-functioning public light poles or damaged electrical wiring on civic paths.', 2, 0.00, 1),
('cat-cp-noi', 'Noise Disturbance & Public Nuisance', 'complaint', 'Late-night loud videoke beyond curfew, rowdy gatherings, or excessive machinery.', 1, 0.00, 1),
('cat-cp-drn', 'Drainage Clogging & Flooding Hazard', 'complaint', 'Blocked canals, hazardous construction runoff, or stagnant wastewater.', 3, 0.00, 1);
`;
};
