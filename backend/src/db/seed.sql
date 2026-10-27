-- Mật khẩu demo cho mọi tài khoản: Demo@123
-- T0 = 20/10/2026 10:00 ICT = 2026-10-20 03:00:00 UTC

INSERT INTO departments (id, code, name, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'IT', 'Phòng Công nghệ thông tin', TRUE),
  ('22222222-2222-2222-2222-222222222222', 'ADMIN', 'Phòng Hành chính', TRUE),
  ('33333333-3333-3333-3333-333333333333', 'SALES', 'Phòng Kinh doanh', TRUE);

INSERT INTO users (
  id, email, password_hash, display_name, role,
  home_department_id, service_department_id, is_active
) VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'nv.an@irms.local',
    '$2b$10$0wTUiQWRGFhijQ09cukPCOxOiMzb4cvRB/rwCmlEyhfM8hRpuNgsO',
    'Nguyễn Văn An',
    'EMPLOYEE',
    '33333333-3333-3333-3333-333333333333',
    NULL,
    TRUE
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    'nv.binh@irms.local',
    '$2b$10$0wTUiQWRGFhijQ09cukPCOxOiMzb4cvRB/rwCmlEyhfM8hRpuNgsO',
    'Trần Thị Bình',
    'EMPLOYEE',
    '33333333-3333-3333-3333-333333333333',
    NULL,
    TRUE
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'agent.it@irms.local',
    '$2b$10$0wTUiQWRGFhijQ09cukPCOxOiMzb4cvRB/rwCmlEyhfM8hRpuNgsO',
    'Lê Minh Khang',
    'AGENT',
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    TRUE
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    'agent.it2@irms.local',
    '$2b$10$0wTUiQWRGFhijQ09cukPCOxOiMzb4cvRB/rwCmlEyhfM8hRpuNgsO',
    'Phạm Quốc Huy',
    'AGENT',
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    TRUE
  ),
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc1',
    'coord.it@irms.local',
    '$2b$10$0wTUiQWRGFhijQ09cukPCOxOiMzb4cvRB/rwCmlEyhfM8hRpuNgsO',
    'Đỗ Thu Hà',
    'COORDINATOR',
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    TRUE
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
    'agent.hc@irms.local',
    '$2b$10$0wTUiQWRGFhijQ09cukPCOxOiMzb4cvRB/rwCmlEyhfM8hRpuNgsO',
    'Vũ Thị Lan',
    'AGENT',
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    TRUE
  ),
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc2',
    'coord.hc@irms.local',
    '$2b$10$0wTUiQWRGFhijQ09cukPCOxOiMzb4cvRB/rwCmlEyhfM8hRpuNgsO',
    'Hoàng Đức Nam',
    'COORDINATOR',
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    TRUE
  ),
  (
    'dddddddd-dddd-dddd-dddd-ddddddddddd1',
    'locked.user@irms.local',
    '$2b$10$0wTUiQWRGFhijQ09cukPCOxOiMzb4cvRB/rwCmlEyhfM8hRpuNgsO',
    'Tài khoản bị khóa',
    'EMPLOYEE',
    '33333333-3333-3333-3333-333333333333',
    NULL,
    FALSE
  );

INSERT INTO request_types (id, code, name, handling_department_id, is_active) VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'IT_PC', 'Sự cố máy tính', '11111111-1111-1111-1111-111111111111', TRUE),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', 'IT_PRINTER', 'Sự cố máy in', '11111111-1111-1111-1111-111111111111', TRUE),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3', 'IT_NETWORK', 'Kết nối mạng', '11111111-1111-1111-1111-111111111111', TRUE),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee4', 'ADM_MEETING', 'Hỗ trợ phòng họp', '22222222-2222-2222-2222-222222222222', TRUE),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee5', 'ADM_FACILITY', 'Sửa chữa cơ sở vật chất', '22222222-2222-2222-2222-222222222222', TRUE);

-- 8 hồ sơ IT chuẩn (kỳ 01/10/2026 00:00 ICT -> 21/10/2026 00:00 ICT)
INSERT INTO requests (
  id, request_code, client_request_id, payload_hash, title, description,
  request_type_id, created_by, requester_department_id_snapshot, handling_department_id,
  assigned_to, priority, status, version, submitted_at, due_at, resolved_at, closed_at,
  current_resolution, waiting_question
) VALUES
(
  'f0000000-0000-0000-0000-000000000001',
  'IT-01',
  'c1000000-0000-0000-0000-000000000001',
  'seed-it-01',
  'Máy tính không khởi động được',
  'Máy tính bàn tại bàn làm việc không lên nguồn từ sáng nay, đèn nguồn không sáng. Cần hỗ trợ kiểm tra nguồn và bo mạch.',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  NULL, 'MEDIUM', 'SUBMITTED', 1,
  TIMESTAMPTZ '2026-10-19 22:00:00+07',
  TIMESTAMPTZ '2026-10-20 22:00:00+07',
  NULL, NULL, NULL, NULL
),
(
  'f0000000-0000-0000-0000-000000000002',
  'IT-02',
  'c1000000-0000-0000-0000-000000000002',
  'seed-it-02',
  'Mất kết nối VPN khi họp khách hàng',
  'VPN nội bộ ngắt liên tục khiến không vào được hệ thống báo cáo. Ảnh hưởng buổi làm việc với khách hàng trong ngày.',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'HIGH', 'ASSIGNED', 2,
  TIMESTAMPTZ '2026-10-19 18:00:00+07',
  TIMESTAMPTZ '2026-10-20 02:00:00+07',
  NULL, NULL, NULL, NULL
),
(
  'f0000000-0000-0000-0000-000000000003',
  'IT-03',
  'c1000000-0000-0000-0000-000000000003',
  'seed-it-03',
  'Cài đặt phần mềm kế toán trên máy mới',
  'Nhân viên mới nhận máy, cần cài bộ phần mềm kế toán và cấu hình máy in mặc định theo hướng dẫn phòng IT.',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'LOW', 'IN_PROGRESS', 3,
  TIMESTAMPTZ '2026-10-19 08:00:00+07',
  TIMESTAMPTZ '2026-10-21 08:00:00+07',
  NULL, NULL, NULL, NULL
),
(
  'f0000000-0000-0000-0000-000000000004',
  'IT-04',
  'c1000000-0000-0000-0000-000000000004',
  'seed-it-04',
  'Máy in tầng 3 ra giấy lem mực',
  'Máy in dùng chung tầng 3 in ra bản lem, chữ mờ. Đã thử khay giấy khác nhưng tình trạng không đổi.',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'MEDIUM', 'WAITING_FOR_REQUESTER', 4,
  TIMESTAMPTZ '2026-10-18 20:00:00+07',
  TIMESTAMPTZ '2026-10-19 20:00:00+07',
  NULL, NULL, NULL,
  'Bạn cho biết mã máy in trên nhãn và số lượng bản in lỗi trong ngày được không?'
),
(
  'f0000000-0000-0000-0000-000000000005',
  'IT-05',
  'c1000000-0000-0000-0000-000000000005',
  'seed-it-05',
  'Không vào được hộp thư công ty',
  'Từ chiều qua không đăng nhập được email công ty, thông báo sai mật khẩu dù vừa đổi hôm trước.',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'HIGH', 'RESOLVED', 5,
  TIMESTAMPTZ '2026-10-19 12:00:00+07',
  TIMESTAMPTZ '2026-10-19 20:00:00+07',
  TIMESTAMPTZ '2026-10-19 19:30:00+07',
  NULL,
  'Đã reset mật khẩu trên hệ thống thư và gửi hướng dẫn đăng nhập lại. Kiểm tra bằng cách đăng nhập webmail.',
  NULL
),
(
  'f0000000-0000-0000-0000-000000000006',
  'IT-06',
  'c1000000-0000-0000-0000-000000000006',
  'seed-it-06',
  'Cấp quyền thư mục dùng chung dự án A',
  'Cần quyền đọc/ghi thư mục dùng chung dự án A để nộp báo cáo tuần. Đã xác nhận với trưởng nhóm.',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'MEDIUM', 'CLOSED', 6,
  TIMESTAMPTZ '2026-10-15 09:00:00+07',
  TIMESTAMPTZ '2026-10-16 09:00:00+07',
  TIMESTAMPTZ '2026-10-15 16:00:00+07',
  TIMESTAMPTZ '2026-10-16 10:00:00+07',
  'Đã cấp quyền NTFS cho tài khoản người gửi. Kiểm tra bằng cách mở \\\\fileserver\\du-an-a.',
  NULL
),
(
  'f0000000-0000-0000-0000-000000000007',
  'IT-07',
  'c1000000-0000-0000-0000-000000000007',
  'seed-it-07',
  'Yêu cầu cài phần mềm đã có sẵn trên máy khác',
  'Nhầm máy, phần mềm đã được cài trên máy dự phòng nên không còn nhu cầu hỗ trợ.',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  NULL, 'MEDIUM', 'CANCELLED', 2,
  TIMESTAMPTZ '2026-10-17 09:00:00+07',
  TIMESTAMPTZ '2026-10-18 09:00:00+07',
  NULL, NULL, NULL, NULL
),
(
  'f0000000-0000-0000-0000-000000000008',
  'IT-08',
  'c1000000-0000-0000-0000-000000000008',
  'seed-it-08',
  'Đề nghị mua laptop mới cho nhân viên thử việc',
  'Gửi nhầm loại: đây là đề nghị mua sắm, không thuộc hỗ trợ sự cố IT. Cần tạo lại đúng quy trình mua sắm.',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  NULL, 'LOW', 'REJECTED', 2,
  TIMESTAMPTZ '2026-10-16 09:00:00+07',
  TIMESTAMPTZ '2026-10-18 09:00:00+07',
  NULL, NULL, NULL, NULL
);

-- 2 hồ sơ Hành chính: không làm thay đổi số liệu dashboard IT
INSERT INTO requests (
  id, request_code, client_request_id, payload_hash, title, description,
  request_type_id, created_by, requester_department_id_snapshot, handling_department_id,
  assigned_to, priority, status, version, submitted_at, due_at, resolved_at, closed_at,
  current_resolution, waiting_question
) VALUES
(
  'f0000000-0000-0000-0000-000000000011',
  'HC-01',
  'c2000000-0000-0000-0000-000000000001',
  'seed-hc-01',
  'Chuẩn bị phòng họp tầng 2 lúc 14h',
  'Cần hỗ trợ mở phòng họp lớn tầng 2, kiểm tra micro và máy chiếu trước cuộc họp ban giám đốc 14h.',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee4',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  NULL, 'HIGH', 'SUBMITTED', 1,
  TIMESTAMPTZ '2026-10-19 11:00:00+07',
  TIMESTAMPTZ '2026-10-19 19:00:00+07',
  NULL, NULL, NULL, NULL
),
(
  'f0000000-0000-0000-0000-000000000012',
  'HC-02',
  'c2000000-0000-0000-0000-000000000002',
  'seed-hc-02',
  'Sửa ổ khóa cửa phòng làm việc',
  'Ổ khóa cửa phòng Kinh doanh bị kẹt, đóng mở khó. Nhờ hành chính kiểm tra và thay nếu cần.',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee5',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'MEDIUM', 'IN_PROGRESS', 3,
  TIMESTAMPTZ '2026-10-18 09:00:00+07',
  TIMESTAMPTZ '2026-10-19 09:00:00+07',
  NULL, NULL, NULL, NULL
);

INSERT INTO request_events (
  request_id, event_type, from_status, to_status, old_assignee_id, new_assignee_id,
  actor_id, reason_or_content, created_at, request_version
) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'SUBMIT', NULL, 'SUBMITTED', NULL, NULL,
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Tạo yêu cầu', TIMESTAMPTZ '2026-10-19 22:00:00+07', 1),

  ('f0000000-0000-0000-0000-000000000002', 'SUBMIT', NULL, 'SUBMITTED', NULL, NULL,
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Tạo yêu cầu', TIMESTAMPTZ '2026-10-19 18:00:00+07', 1),
  ('f0000000-0000-0000-0000-000000000002', 'ASSIGN', 'SUBMITTED', 'ASSIGNED', NULL, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
   'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'Giao cho Khang xử lý VPN', TIMESTAMPTZ '2026-10-19 18:20:00+07', 2),

  ('f0000000-0000-0000-0000-000000000003', 'SUBMIT', NULL, 'SUBMITTED', NULL, NULL,
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Tạo yêu cầu', TIMESTAMPTZ '2026-10-19 08:00:00+07', 1),
  ('f0000000-0000-0000-0000-000000000003', 'ASSIGN', 'SUBMITTED', 'ASSIGNED', NULL, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
   'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'Giao cài phần mềm', TIMESTAMPTZ '2026-10-19 08:30:00+07', 2),
  ('f0000000-0000-0000-0000-000000000003', 'START', 'ASSIGNED', 'IN_PROGRESS', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Bắt đầu cài đặt', TIMESTAMPTZ '2026-10-19 09:00:00+07', 3),

  ('f0000000-0000-0000-0000-000000000004', 'SUBMIT', NULL, 'SUBMITTED', NULL, NULL,
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Tạo yêu cầu', TIMESTAMPTZ '2026-10-18 20:00:00+07', 1),
  ('f0000000-0000-0000-0000-000000000004', 'ASSIGN', 'SUBMITTED', 'ASSIGNED', NULL, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
   'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'Giao Huy kiểm tra máy in', TIMESTAMPTZ '2026-10-18 20:15:00+07', 2),
  ('f0000000-0000-0000-0000-000000000004', 'START', 'ASSIGNED', 'IN_PROGRESS', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Bắt đầu kiểm tra', TIMESTAMPTZ '2026-10-18 21:00:00+07', 3),
  ('f0000000-0000-0000-0000-000000000004', 'REQUEST_INFO', 'IN_PROGRESS', 'WAITING_FOR_REQUESTER', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
   'Bạn cho biết mã máy in trên nhãn và số lượng bản in lỗi trong ngày được không?',
   TIMESTAMPTZ '2026-10-18 21:30:00+07', 4),

  ('f0000000-0000-0000-0000-000000000005', 'SUBMIT', NULL, 'SUBMITTED', NULL, NULL,
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Tạo yêu cầu', TIMESTAMPTZ '2026-10-19 12:00:00+07', 1),
  ('f0000000-0000-0000-0000-000000000005', 'ASSIGN', 'SUBMITTED', 'ASSIGNED', NULL, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
   'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'Giao xử lý hộp thư', TIMESTAMPTZ '2026-10-19 12:10:00+07', 2),
  ('f0000000-0000-0000-0000-000000000005', 'START', 'ASSIGNED', 'IN_PROGRESS', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Bắt đầu', TIMESTAMPTZ '2026-10-19 13:00:00+07', 3),
  ('f0000000-0000-0000-0000-000000000005', 'RESOLVE', 'IN_PROGRESS', 'RESOLVED', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
   'Đã reset mật khẩu trên hệ thống thư và gửi hướng dẫn đăng nhập lại. Kiểm tra bằng cách đăng nhập webmail.',
   TIMESTAMPTZ '2026-10-19 19:30:00+07', 5),

  ('f0000000-0000-0000-0000-000000000006', 'SUBMIT', NULL, 'SUBMITTED', NULL, NULL,
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Tạo yêu cầu', TIMESTAMPTZ '2026-10-15 09:00:00+07', 1),
  ('f0000000-0000-0000-0000-000000000006', 'ASSIGN', 'SUBMITTED', 'ASSIGNED', NULL, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
   'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'Giao cấp quyền', TIMESTAMPTZ '2026-10-15 09:20:00+07', 2),
  ('f0000000-0000-0000-0000-000000000006', 'START', 'ASSIGNED', 'IN_PROGRESS', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Bắt đầu', TIMESTAMPTZ '2026-10-15 10:00:00+07', 3),
  ('f0000000-0000-0000-0000-000000000006', 'RESOLVE', 'IN_PROGRESS', 'RESOLVED', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
   'Đã cấp quyền NTFS cho tài khoản người gửi. Kiểm tra bằng cách mở \\\\fileserver\\du-an-a.',
   TIMESTAMPTZ '2026-10-15 16:00:00+07', 5),
  ('f0000000-0000-0000-0000-000000000006', 'CONFIRM', 'RESOLVED', 'CLOSED', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Xác nhận đã vào được thư mục', TIMESTAMPTZ '2026-10-16 10:00:00+07', 6),

  ('f0000000-0000-0000-0000-000000000007', 'SUBMIT', NULL, 'SUBMITTED', NULL, NULL,
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Tạo yêu cầu', TIMESTAMPTZ '2026-10-17 09:00:00+07', 1),
  ('f0000000-0000-0000-0000-000000000007', 'CANCEL', 'SUBMITTED', 'CANCELLED', NULL, NULL,
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Không còn nhu cầu, đã dùng máy dự phòng', TIMESTAMPTZ '2026-10-17 11:00:00+07', 2),

  ('f0000000-0000-0000-0000-000000000008', 'SUBMIT', NULL, 'SUBMITTED', NULL, NULL,
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Tạo yêu cầu', TIMESTAMPTZ '2026-10-16 09:00:00+07', 1),
  ('f0000000-0000-0000-0000-000000000008', 'REJECT', 'SUBMITTED', 'REJECTED', NULL, NULL,
   'cccccccc-cccc-cccc-cccc-ccccccccccc1',
   'Không tiếp nhận đề nghị mua sắm trên kênh sự cố IT. Vui lòng tạo lại theo quy trình mua sắm tài sản.',
   TIMESTAMPTZ '2026-10-16 10:30:00+07', 2),

  ('f0000000-0000-0000-0000-000000000011', 'SUBMIT', NULL, 'SUBMITTED', NULL, NULL,
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Tạo yêu cầu', TIMESTAMPTZ '2026-10-19 11:00:00+07', 1),

  ('f0000000-0000-0000-0000-000000000012', 'SUBMIT', NULL, 'SUBMITTED', NULL, NULL,
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Tạo yêu cầu', TIMESTAMPTZ '2026-10-18 09:00:00+07', 1),
  ('f0000000-0000-0000-0000-000000000012', 'ASSIGN', 'SUBMITTED', 'ASSIGNED', NULL, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
   'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'Giao Lan xử lý ổ khóa', TIMESTAMPTZ '2026-10-18 09:20:00+07', 2),
  ('f0000000-0000-0000-0000-000000000012', 'START', 'ASSIGNED', 'IN_PROGRESS', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'Bắt đầu kiểm tra', TIMESTAMPTZ '2026-10-18 10:00:00+07', 3);

INSERT INTO request_comments (request_id, author_id, content, created_at) VALUES
  (
    'f0000000-0000-0000-0000-000000000004',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    'Tôi sẽ kiểm tra nhãn máy sau giờ họp, cảm ơn.',
    TIMESTAMPTZ '2026-10-18 21:45:00+07'
  ),
  (
    'f0000000-0000-0000-0000-000000000005',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'Đã gửi hướng dẫn đổi mật khẩu qua điện thoại nội bộ.',
    TIMESTAMPTZ '2026-10-19 19:35:00+07'
  );

SELECT setval('request_code_seq', 200);
