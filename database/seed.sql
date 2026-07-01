-- EthioCred Seed Data
-- Password placeholders are replaced with bcrypt hashes by scripts/seed-database.js
-- Fixed UUIDs ensure consistent foreign key references across seed runs.

-- Admin user
INSERT INTO users (id, full_name, email, password_hash, role, status)
VALUES (
    'a0000000-0000-4000-8000-000000000001',
    'EthioCred Admin',
    'admin@ethiocred.et',
    '{{ADMIN_PASSWORD_HASH}}',
    'ADMIN',
    'ACTIVE'
)
ON CONFLICT (email) DO UPDATE 
SET password_hash = EXCLUDED.password_hash;

-- Institution: Addis Ababa University
INSERT INTO institutions (id, name, organization_fayda_id, registration_number, status, approved_by, approved_at)
VALUES (
    'b0000000-0000-4000-8000-000000000001',
    'Addis Ababa University',
    'ORG-000001',
    'MOE-ET-2025-001',
    'ACTIVE',
    'a0000000-0000-4000-8000-000000000001',
    CURRENT_TIMESTAMP
)
ON CONFLICT (registration_number) DO NOTHING;

-- Registrar user (linked to AAU)
INSERT INTO users (id, full_name, email, password_hash, role, institution_id, status)
VALUES (
    'c0000000-0000-4000-8000-000000000001',
    'AAU Registrar',
    'registrar@aau.et',
    '{{REGISTRAR_PASSWORD_HASH}}',
    'UNIVERSITY',
    'b0000000-0000-4000-8000-000000000001',
    'ACTIVE'
)
ON CONFLICT (email) DO UPDATE 
SET password_hash = EXCLUDED.password_hash;

-- Student user
INSERT INTO users (id, full_name, email, password_hash, fayda_id, role, status)
VALUES (
    'd0000000-0000-4000-8000-000000000001',
    'Abebe Kebede',
    'student@example.com',
    '{{STUDENT_PASSWORD_HASH}}',
    'FAYDA-001',
    'STUDENT',
    'ACTIVE'
)
ON CONFLICT (email) DO UPDATE 
SET password_hash = EXCLUDED.password_hash;

-- Employer user
INSERT INTO users (id, full_name, email, password_hash, role, status)
VALUES (
    'e0000000-0000-4000-8000-000000000001',
    'HR Manager',
    'employer@company.com',
    '{{EMPLOYER_PASSWORD_HASH}}',
    'EMPLOYER',
    'ACTIVE'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash;