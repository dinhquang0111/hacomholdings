CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('EMPLOYEE', 'AGENT', 'COORDINATOR');
CREATE TYPE request_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE request_status AS ENUM (
  'SUBMITTED',
  'ASSIGNED',
  'IN_PROGRESS',
  'WAITING_FOR_REQUESTER',
  'RESOLVED',
  'CLOSED',
  'REJECTED',
  'CANCELLED'
);

CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name VARCHAR(150) NOT NULL,
  role user_role NOT NULL,
  home_department_id UUID REFERENCES departments (id),
  service_department_id UUID REFERENCES departments (id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_service_dept_for_handlers CHECK (
    (role = 'EMPLOYEE' AND service_department_id IS NULL)
    OR (role IN ('AGENT', 'COORDINATOR') AND service_department_id IS NOT NULL)
  )
);

CREATE TABLE request_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  handling_department_id UUID NOT NULL REFERENCES departments (id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE SEQUENCE request_code_seq START WITH 100;

CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_code VARCHAR(32) NOT NULL UNIQUE,
  client_request_id UUID NOT NULL,
  payload_hash VARCHAR(64) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  request_type_id UUID NOT NULL REFERENCES request_types (id),
  created_by UUID NOT NULL REFERENCES users (id),
  requester_department_id_snapshot UUID REFERENCES departments (id),
  handling_department_id UUID NOT NULL REFERENCES departments (id),
  assigned_to UUID REFERENCES users (id),
  priority request_priority NOT NULL DEFAULT 'MEDIUM',
  status request_status NOT NULL DEFAULT 'SUBMITTED',
  version INTEGER NOT NULL DEFAULT 1,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_at TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  current_resolution TEXT,
  waiting_question TEXT,
  CONSTRAINT requests_idempotency UNIQUE (created_by, client_request_id),
  CONSTRAINT requests_due_after_submit CHECK (due_at > submitted_at),
  CONSTRAINT requests_version_positive CHECK (version >= 1)
);

CREATE TABLE request_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests (id) ON DELETE CASCADE,
  event_type VARCHAR(64) NOT NULL,
  from_status request_status,
  to_status request_status,
  old_assignee_id UUID REFERENCES users (id),
  new_assignee_id UUID REFERENCES users (id),
  actor_id UUID NOT NULL REFERENCES users (id),
  reason_or_content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  request_version INTEGER NOT NULL
);

CREATE TABLE request_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests (id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users (id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT request_comments_content_len CHECK (char_length(content) BETWEEN 1 AND 2000)
);

CREATE TABLE request_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests (id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES users (id),
  original_name VARCHAR(255) NOT NULL,
  storage_key VARCHAR(512) NOT NULL UNIQUE,
  detected_type VARCHAR(64) NOT NULL,
  size_bytes INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT request_attachments_size_positive CHECK (size_bytes > 0 AND size_bytes <= 5242880)
);

CREATE TABLE auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_service_dept ON users (service_department_id);
CREATE INDEX idx_request_types_handling ON request_types (handling_department_id);
CREATE INDEX idx_requests_created_by ON requests (created_by);
CREATE INDEX idx_requests_handling_dept ON requests (handling_department_id);
CREATE INDEX idx_requests_assigned_to ON requests (assigned_to);
CREATE INDEX idx_requests_status ON requests (status);
CREATE INDEX idx_requests_submitted_at ON requests (submitted_at);
CREATE INDEX idx_requests_due_at ON requests (due_at);
CREATE INDEX idx_request_events_request ON request_events (request_id, created_at);
CREATE INDEX idx_request_comments_request ON request_comments (request_id, created_at);
CREATE INDEX idx_request_attachments_request ON request_attachments (request_id);
CREATE INDEX idx_auth_sessions_user ON auth_sessions (user_id);
CREATE INDEX idx_auth_sessions_expires ON auth_sessions (expires_at);
