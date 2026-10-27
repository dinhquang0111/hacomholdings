# ĐỀ TÀI THỰC TẬP MỘT THÁNG
## Hệ thống quản lý yêu cầu nội bộ doanh nghiệp — BA và đặc tả MVP

| Thuộc tính | Nội dung |
|---|---|
| Mã tài liệu | IRMS-BA-SRS-001 |
| Phiên bản | 2.0 — điều chỉnh cho thời hạn một tháng |
| Ngày cập nhật | 07/10/2026 |
| Thời hạn người giao bài xác nhận | **Một tháng** |
| Cách lập kế hoạch | Bốn tuần, quy ước 20 ngày làm việc; ngày bắt đầu/kết thúc thực tế do người giao bài điền |
| Quy mô | Nhóm 3–4 thực tập sinh |
| Phạm vi | Một ứng dụng web; hỗ trợ IT và hành chính đơn giản trên cùng quy trình |
| Tài liệu đi kèm | `02_Phan_tich_cong_viec_va_Tu_chon_nhiem_vu_1_thang.md` |
| Trạng thái | Đề bài đề xuất để triển khai; chưa phải kết quả khảo sát hoặc nghiệm thu |

> **Bản này thay thế phạm vi và kế hoạch tám tuần của phiên bản 1.0, không phải chỉ đổi số tuần.** Chỉ các yêu cầu được đánh dấu bắt buộc trong bản 2.0 được dùng để giao việc, ước lượng và chấm điểm. Các chức năng rộng hơn của bản 1.0 không tự động trở thành nghĩa vụ của nhóm.
>
> Đích đến của tháng thực tập là một sản phẩm nhỏ chạy hoàn chỉnh: **gửi → phân công → xử lý → bổ sung khi cần → báo kết quả → người gửi xác nhận**, có phân quyền, lịch sử, tệp, tìm kiếm, báo cáo cơ bản và bằng chứng kiểm thử. Không đặt mục tiêu triển khai production với dữ liệu thật.

## Mục lục

1. [Phạm vi và thay đổi so với bản trước](#s01)
2. [Bài toán và phân tích nghiệp vụ BA](#s02)
3. [Vai trò và quyền truy cập](#s03)
4. [Quy trình và trạng thái](#s04)
5. [Quy tắc nghiệp vụ bắt buộc](#s05)
6. [Chức năng, màn hình và tiêu chí chấp nhận](#s06)
7. [Dữ liệu, API và ranh giới triển khai](#s07)
8. [Thời hạn và báo cáo](#s08)
9. [Kiểm thử và nghiệm thu](#s09)
10. [Kế hoạch bốn tuần và nguồn lực](#s10)
11. [Bàn giao và đánh giá](#s11)
12. [Biểu mẫu BA và quản lý thay đổi](#s12)

---

<a id="s01"></a>
## 1. Phạm vi và thay đổi so với bản trước

### 1.1. Đề bài giao cho nhóm

Xây dựng hệ thống web giúp nhân viên gửi yêu cầu hỗ trợ; bộ phận phụ trách nhìn thấy đúng hàng đợi, phân công người xử lý, trao đổi và báo kết quả. Người gửi theo dõi và xác nhận kết quả. Hệ thống phải kiểm tra quyền tại backend, bảo vệ dữ liệu, lưu lịch sử và cung cấp báo cáo đối chiếu được.

Các loại khởi tạo: sự cố máy tính, máy in, kết nối mạng; hỗ trợ phòng họp; sửa chữa cơ sở vật chất đơn giản. IT và Hành chính dùng chung bảng dữ liệu, màn hình, API và workflow; **không xây hai hệ thống riêng**.

Không tiếp nhận nghỉ phép, đề nghị thanh toán, duyệt mua sắm, ngân sách hoặc cấp quyền cần phê duyệt mới. Một ticket không thay thế quyết định phê duyệt của doanh nghiệp.

### 1.2. Chốt phạm vi một tháng

| Nội dung | Bản bắt buộc trong tháng này | Cách giảm khối lượng |
|---|---|---|
| Xác thực | Đăng nhập, đăng xuất; tài khoản demo được cấp sẵn | Không đăng ký, quên mật khẩu, SSO hoặc màn quản trị tài khoản |
| Quyền | Người gửi, người xử lý, điều phối; giới hạn theo hồ sơ/bộ phận | Mỗi tài khoản có một vai trò chính; chưa có quản trị đa vai trò động |
| Tạo yêu cầu | Gửi trực tiếp, chống gửi trùng, kiểm tra trường nhập | **Không lưu bản nháp trên server**, không sửa/xóa nội dung gốc sau gửi |
| Điều phối | Hàng đợi, phân công, giao lại trong cùng bộ phận, từ chối, hủy | Không chuyển bộ phận; gửi nhầm được từ chối kèm hướng dẫn tạo lại |
| Xử lý | Bắt đầu, hỏi bổ sung, trả lời, báo kết quả, xác nhận hoặc phản hồi chưa đạt | Không phê duyệt nhiều cấp, không tự động đóng |
| Trao đổi | Bình luận công khai đối với những người được phép xem hồ sơ | Không có ghi chú nội bộ bí mật hoặc chat realtime |
| Tệp | Tệp gắn vào yêu cầu đã tồn tại; tải xuống qua API kiểm tra quyền | Không upload tạm trước khi tạo, không preview Office, không liên kết công khai |
| Lịch sử | Trạng thái, người xử lý, tác nhân, thời gian và lý do | Không làm hệ thống audit quản trị độc lập |
| Thời hạn | Hạn mục tiêu cố định theo mức ưu tiên lúc gửi | Không lịch ngày nghỉ, giờ làm việc, dừng đồng hồ hoặc đổi ưu tiên |
| Báo cáo | Bốn chỉ số và bảng số lượng theo trạng thái | Không BI, thống kê nâng cao hoặc xuất Excel/PDF |
| Thông báo, đánh giá | Chuyển sang backlog sau nghiệm thu | Không chuông thông báo, email, WebSocket hoặc đánh giá sao bắt buộc |
| Vận hành | Docker Compose, migration, seed, tài liệu dựng lại, kiểm tra lưu bền | Không microservices, Kubernetes hoặc triển khai production |
| AI | Ngoài phạm vi một tháng | Không cộng điểm bằng AI để bù lỗi nghiệp vụ hoặc thiếu chức năng lõi |

### 1.3. Giả định và giới hạn

Một doanh nghiệp, một cơ sở dữ liệu, hai bộ phận xử lý. Mỗi hồ sơ có tối đa một người xử lý chính tại một thời điểm. Chỉ dùng dữ liệu giả lập; tài khoản/danh mục được tạo bằng seed hoặc công cụ bảo trì có hướng dẫn, không thao tác quản trị qua giao diện.

Thời lượng **20 giờ/người/tuần là giả định để ước lượng, chưa được người giao bài xác nhận**. Ngày đầu nhóm ghi khả năng tham gia thực tế. Nếu thấp hơn đáng kể, phải xin giảm phạm vi, không tự kéo dài thời hạn một tháng.

Lựa chọn công nghệ thực hiện theo nền tảng nhóm đã biết và chốt một lần ngày đầu. Không yêu cầu đồng thời NestJS và Spring Boot; không dành tháng thực tập để học lại cả frontend lẫn backend từ đầu.

---

<a id="s02"></a>
## 2. Bài toán và phân tích nghiệp vụ BA

### 2.1. Bối cảnh AS-IS cần xác nhận

Giả định ban đầu: nhân viên gửi yêu cầu qua tin nhắn, email hoặc trao đổi trực tiếp; bộ phận nhận tự ghi nhớ và chuyển tiếp; khi người gửi hỏi lại mới kiểm tra tiến độ. Các vấn đề có thể là bỏ sót, thiếu thông tin, không rõ trách nhiệm và không có số liệu.

Đây là **tình huống mô phỏng**, trừ khi nhóm thực sự khảo sát được người dùng. Không viết “đã khảo sát doanh nghiệp” khi chỉ thảo luận trong nhóm.

| Mã nhu cầu | Vấn đề | Thay đổi TO-BE | Minh chứng nghiệm thu |
|---|---|---|---|
| BN-01 | Yêu cầu nằm rải rác | Mỗi yêu cầu được lưu tập trung, có mã duy nhất | Tạo trên UI và truy cập lại theo mã |
| BN-02 | Không rõ ai phụ trách | Có hàng đợi và một người xử lý chính | Xem được người nhận và lịch sử giao lại |
| BN-03 | Không biết đã giải quyết chưa | Có vòng đời và bước người gửi xác nhận | Chạy được luồng đạt và phản hồi chưa đạt |
| BN-04 | Người không liên quan có thể đọc dữ liệu | Kiểm tra quyền theo hồ sơ và bộ phận | Test đọc hồ sơ/tệp trái quyền bị từ chối |
| BN-05 | Số liệu tổng hợp không nhất quán | Chỉ số có định nghĩa và dữ liệu đối chiếu | Dashboard khớp bộ seed kiểm thử |

### 2.2. Bên liên quan và quyền quyết định

| Bên liên quan | Cung cấp/xác nhận gì? | Vai trò trong tháng thực tập |
|---|---|---|
| Người giao đề tài | Phạm vi, mức hoàn thành và thay đổi | Chốt đầu kỳ; xem demo tuần; nghiệm thu cuối kỳ |
| Người hướng dẫn kỹ thuật | Thiết kế khả thi, rủi ro dữ liệu và bảo mật | Review phần auth, quyền, workflow và tích hợp |
| Nhân viên đại diện | Biểu mẫu và cách xác nhận kết quả | Góp ý tình huống; thực hiện UAT |
| Đại diện IT/Hành chính | Định tuyến, phân công, từ chối, thời hạn | Xác nhận luồng xử lý mô phỏng |
| Nhóm thực tập | Phân tích, xây dựng, kiểm tra và tài liệu | Mỗi người nhận một gói chức năng; không có người chỉ viết tài liệu |

Nếu không có đại diện nghiệp vụ, người hướng dẫn đóng vai và ghi rõ hình thức mô phỏng trong biên bản.

### 2.3. Công việc BA tối thiểu

BA thực hiện **trước và cùng với lập trình**, không dồn xuống cuối kỳ. Trong ngày 1–2, nhóm rà soát đặc tả này, đánh dấu đồng ý/đề nghị thay đổi và ghi câu trả lời cho các câu hỏi dưới đây. Không cần viết lại toàn bộ tài liệu thành một bản khác chỉ để đủ hồ sơ.

| Câu hỏi cần chốt | Quyết định đề xuất cho MVP |
|---|---|
| Tiếp nhận loại nào? | Năm loại IT/Hành chính đơn giản nêu tại mục 1.1 |
| Ai có quyền phân công? | Điều phối của bộ phận tiếp nhận, không phải người tạo hồ sơ |
| Ai xác nhận hoàn tất? | Người tạo yêu cầu, không phải người xử lý |
| Thiếu thông tin thì làm gì? | Người xử lý đặt câu hỏi; người gửi dùng hành động “Gửi bổ sung” |
| Gửi nhầm bộ phận thì sao? | Điều phối từ chối, nêu hướng dẫn; người gửi tạo lại đúng loại |
| Người xử lý đổi người thế nào? | Điều phối giao lại trong cùng bộ phận, có lý do và lịch sử |
| Người gửi muốn hủy thì sao? | Tự hủy khi chưa phân công; sau phân công đề nghị qua bình luận để điều phối quyết định |
| Có cho xem yêu cầu của cả công ty? | Không; không có vai trò đọc toàn công ty trong MVP |
| Chờ người gửi có dừng đồng hồ? | Không; dùng giờ liên tục và hiển thị rõ |
| Có sửa/xóa yêu cầu sau gửi? | Không; bổ sung hoặc đính chính bằng bình luận |

Đầu ra BA gồm: biên bản quyết định ngắn; bảng quyền; bảng trạng thái; tiêu chí chấp nhận từng chức năng; bộ tình huống UAT. Mỗi người viết và giải thích phần BA thuộc gói mình chọn.

### 2.4. TO-BE bằng văn bản

```text
Nhân viên gửi yêu cầu → hệ thống định tuyến theo loại → chờ phân công
→ điều phối giao người xử lý → người xử lý bắt đầu
→ cần thông tin: đặt câu hỏi → người gửi bổ sung → tiếp tục xử lý
→ người xử lý báo kết quả → người gửi kiểm tra
   ├─ Đạt: xác nhận đóng.
   └─ Chưa đạt: phản hồi lý do → tiếp tục xử lý.

Ngoại lệ:
- Chưa tiếp nhận được: điều phối từ chối và giải thích.
- Không còn nhu cầu: hủy theo quyền và trạng thái cho phép.
- Đổi người xử lý: điều phối giao lại, không làm mất lịch sử hoặc đặt lại hạn.
```

---

<a id="s03"></a>
## 3. Vai trò và quyền truy cập

### 3.1. Ba vai trò đăng nhập

| Vai trò | Trách nhiệm | Phạm vi nghiệp vụ |
|---|---|---|
| `EMPLOYEE` — Nhân viên | Gửi, theo dõi, bổ sung, xác nhận | Hồ sơ do mình tạo |
| `AGENT` — Người xử lý | Xử lý hồ sơ được giao | Hồ sơ đang giao cho mình trong bộ phận dịch vụ hợp lệ |
| `COORDINATOR` — Điều phối | Phân công và giám sát | Hồ sơ của bộ phận dịch vụ được cấp |

Mọi tài khoản đều được tạo yêu cầu cá nhân. Tài khoản `AGENT` hoặc `COORDINATOR` khi xem hồ sơ do chính mình tạo chỉ được dùng quyền **người gửi**. Không tự phân công hoặc tự xử lý hồ sơ của mình.

Mỗi người xử lý/điều phối có một `service_department_id`. Phòng ban công tác `home_department_id` không tự cấp quyền xử lý. Tài khoản nhân viên không cần bộ phận dịch vụ. Quản trị hạ tầng/seed không phải một vai trò nghiệp vụ có quyền đọc tất cả.

### 3.2. Ma trận quyền tối thiểu

| Hành động | Người tạo hồ sơ | Người đang được giao | Điều phối đúng bộ phận |
|---|---|---|---|
| Xem chi tiết, bình luận, tệp và lịch sử | Có | Có nếu quyền còn hợp lệ | Có |
| Phân công/giao lại | Không | Không | Có, không trên hồ sơ tự tạo |
| Bắt đầu/hỏi bổ sung/báo kết quả | Không | Có | Không; điều phối không đồng thời là agent trong MVP |
| Gửi bổ sung/xác nhận/phản hồi chưa đạt | Có theo trạng thái | Không | Không |
| Hủy ở `SUBMITTED` | Có | Không | Có, không trên hồ sơ tự tạo |
| Hủy sau phân công | Chỉ đề nghị bằng bình luận | Không | Có theo bảng trạng thái |
| Từ chối ở `SUBMITTED` | Không | Không | Có, không trên hồ sơ tự tạo |
| Dashboard bộ phận | Không | Không | Có |

Mọi người có quyền xem được đọc bình luận và tệp của hồ sơ. **Không triển khai mức hiển thị INTERNAL trong tháng này.** Tất cả quyền phải được áp dụng trên API chi tiết, danh sách, tìm kiếm, lịch sử, bình luận, upload, download và báo cáo; không chỉ ẩn nút giao diện.

Khi giao lại, người xử lý cũ mất quyền từ lần gọi API tiếp theo, trừ quyền độc lập là người tạo. Tài khoản bị vô hiệu hóa mất quyền gọi API; kiểm tra trạng thái tài khoản và phạm vi hiện tại ở backend, không chỉ tin thông tin cũ trong token.

---

<a id="s04"></a>
## 4. Quy trình và trạng thái

### 4.1. Tám trạng thái

| Mã | Nhãn | Diễn giải |
|---|---|---|
| `SUBMITTED` | Chờ phân công | Gửi thành công, đã có mã và bộ phận tiếp nhận |
| `ASSIGNED` | Đã phân công | Có người xử lý chính, chưa bắt đầu hoặc vừa giao lại |
| `IN_PROGRESS` | Đang xử lý | Người phụ trách đang thực hiện |
| `WAITING_FOR_REQUESTER` | Chờ bổ sung | Có câu hỏi chờ người gửi trả lời |
| `RESOLVED` | Đã xử lý, chờ xác nhận | Có kết quả, người gửi chưa xác nhận |
| `CLOSED` | Đã đóng | Người gửi xác nhận đạt |
| `REJECTED` | Từ chối tiếp nhận | Không tiếp nhận tại hàng đợi, có lý do |
| `CANCELLED` | Đã hủy | Dừng yêu cầu theo quyết định có thẩm quyền |

Không có `DRAFT` lưu trên server. `OVERDUE` là cờ tính toán, không phải trạng thái thứ chín.

### 4.2. Bảng hành động — nguồn quy định chính

| Mã | Trạng thái trước | Hành động / chủ thể | Trạng thái sau | Điều kiện bổ sung |
|---|---|---|---|---|
| ST-01 | Chưa có hồ sơ | Gửi / người đăng nhập | SUBMITTED | Dữ liệu hợp lệ; loại và bộ phận đang nhận yêu cầu |
| ST-02 | SUBMITTED | Phân công / điều phối | ASSIGNED | Agent đang hoạt động, đúng bộ phận, khác người tạo |
| ST-03 | ASSIGNED | Bắt đầu / agent được giao | IN_PROGRESS | Phân công và quyền còn hiệu lực |
| ST-04 | IN_PROGRESS | Hỏi bổ sung / agent được giao | WAITING_FOR_REQUESTER | Câu hỏi bắt buộc |
| ST-05 | WAITING_FOR_REQUESTER | Gửi bổ sung / người tạo | IN_PROGRESS | Câu trả lời bắt buộc; agent hợp lệ |
| ST-06 | IN_PROGRESS | Báo kết quả / agent được giao | RESOLVED | Kết quả và cách kiểm tra bắt buộc |
| ST-07 | RESOLVED | Xác nhận đạt / người tạo | CLOSED | Xác nhận chủ động |
| ST-08 | RESOLVED | Phản hồi chưa đạt / người tạo | IN_PROGRESS | Lý do bắt buộc; agent hợp lệ |
| ST-09 | SUBMITTED | Từ chối / điều phối | REJECTED | Lý do và hướng dẫn |
| ST-10 | SUBMITTED | Hủy / người tạo hoặc điều phối | CANCELLED | Lý do; điều phối không dùng quyền điều phối trên hồ sơ tự tạo |
| ST-11 | ASSIGNED, IN_PROGRESS, WAITING_FOR_REQUESTER | Hủy / điều phối | CANCELLED | Lý do; không trên hồ sơ tự tạo |
| ST-12 | ASSIGNED, IN_PROGRESS | Giao lại / điều phối | ASSIGNED | Agent mới đủ điều kiện, khác người cũ; lý do |
| ST-13 | WAITING_FOR_REQUESTER | Giao lại / điều phối | WAITING_FOR_REQUESTER | Giữ câu hỏi; agent mới đủ điều kiện; lý do |
| ST-14 | RESOLVED | Giao lại đầu mối / điều phối | RESOLVED | Chỉ đổi người tiếp nhận phản hồi; giữ kết quả; lý do |
| ST-15 | WAITING_FOR_REQUESTER, RESOLVED | Gửi bổ sung hoặc phản hồi chưa đạt / người tạo | SUBMITTED | Chỉ khi agent không còn hợp lệ; lưu nội dung, bỏ phân công để điều phối giao lại |

Ngoài bảng trên, không cho đổi trạng thái. Không cho mở lại `CLOSED`, `REJECTED`, `CANCELLED`. Khi phát sinh nhu cầu mới, tạo hồ sơ mới và ghi mã liên quan trong mô tả.

ST-15 là nhánh ngoại lệ của hai hành động sẵn có, không phải chức năng quản trị nhân sự. Dùng dữ liệu kiểm thử để vô hiệu hóa agent và chứng minh người gửi không bị kẹt.

### 4.3. Quy tắc thao tác giữ nguyên trạng thái

Bình luận thường không thay trạng thái. Khi đang chờ bổ sung, người gửi phải dùng nút “Gửi bổ sung” để kết thúc lượt chờ. Khi đã đóng/từ chối/hủy, chỉ được đọc hồ sơ; không thêm bình luận hoặc tệp mới.

Khi phản hồi chưa đạt, xóa mốc/kết quả hiện hành đang chờ xác nhận, nhưng giữ kết quả cũ trong lịch sử. Không đặt lại thời điểm gửi và thời hạn. Khi giao lại từ `IN_PROGRESS`, người mới phải bắt đầu lại; lịch sử bắt đầu cũ vẫn còn.

---

<a id="s05"></a>
## 5. Quy tắc nghiệp vụ bắt buộc

| Mã | Quy tắc |
|---|---|
| BR-01 | Backend lấy người tạo/người hành động/thời gian từ phiên xác thực và đồng hồ server; không nhận giả mạo từ client. |
| BR-02 | Bộ phận xử lý được suy ra từ loại yêu cầu; lưu riêng với phòng ban người gửi tại thời điểm gửi. |
| BR-03 | Mã yêu cầu duy nhất được cấp bằng sequence/identity; không dùng đếm số dòng cộng một. |
| BR-04 | Gửi lại cùng `client_request_id` của cùng người dùng không tạo yêu cầu thứ hai. Payload khác với cùng khóa trả xung đột. |
| BR-05 | Không sửa/xóa nội dung gốc sau gửi. Chỉ thêm thông tin hoặc thực hiện hành động theo workflow. |
| BR-06 | Mỗi yêu cầu có một agent hiện tại; không giao cho người tạo, người sai bộ phận hoặc tài khoản bị khóa. |
| BR-07 | Quyền phụ thuộc người dùng, quan hệ hồ sơ, bộ phận và trạng thái; không suy ra quyền từ URL hoặc việc biết mã. |
| BR-08 | Mỗi hành động chuyển trạng thái/phân công ghi trạng thái và sự kiện trong cùng giao dịch; lỗi thì không ghi dở. |
| BR-09 | Hành động dùng `expected_version` cũ trả `409`; không âm thầm ghi đè khi hai người cùng thao tác. |
| BR-10 | Câu hỏi, câu trả lời, kết quả, lý do chưa đạt, hủy, từ chối và giao lại phải có nội dung theo bảng ST. |
| BR-11 | Người xử lý không tự đóng yêu cầu. Chỉ người tạo được xác nhận `CLOSED`. |
| BR-12 | Giao lại, chờ bổ sung và phản hồi chưa đạt không đặt lại hạn; không thay ưu tiên sau gửi trong MVP. |
| BR-13 | Bình luận dạng văn bản thuần, chỉ nối tiếp; không sửa/xóa. Không có ghi chú nội bộ riêng. |
| BR-14 | Tệp chỉ gắn vào hồ sơ đã tồn tại và phải kiểm tra quyền ở cả upload/download; không dùng đường dẫn public. |
| BR-15 | Tệp đính kèm bị lỗi không làm mất yêu cầu đã gửi. UI ghi rõ gửi thành công nhưng tệp nào chưa tải lên. |
| BR-16 | Hồ sơ kết thúc không nhận hành động ghi mới. Tệp đã gắn không được xóa qua chức năng thông thường. |
| BR-17 | Báo cáo lọc quyền trước khi đếm/tổng hợp. “Tồn quá hạn” không bao gồm chờ người gửi xác nhận. |
| BR-18 | Seed hoặc thay cấu hình không được ghi đè thời hạn và lịch sử hồ sơ đã có. Reset dữ liệu demo phải là thao tác riêng, được cảnh báo rõ. |

---

<a id="s06"></a>
## 6. Chức năng, màn hình và tiêu chí chấp nhận

### 6.1. Danh mục chức năng

| Mã | Chức năng bắt buộc | Đầu ra nhìn thấy | Gói chính trong file phân công |
|---|---|---|---|
| FR-01 | Xác thực, quyền nền, cấu hình môi trường | Login/logout; chặn truy cập trái quyền | G1 |
| FR-02 | Danh mục và gửi yêu cầu | Form đúng trường; gửi ra mã; không trùng | G2, G1 cung cấp seed |
| FR-03 | Danh sách và chi tiết | Của tôi/được giao/hàng đợi; tìm kiếm, lọc, phân trang | G2 và G3 |
| FR-04 | Phân công và xử lý vòng đời | Các hành động ST-02 đến ST-15 | G3; G2 làm UI hành động của người gửi |
| FR-05 | Bình luận và tệp | Đọc/ghi/tải đúng quyền; báo lỗi rõ | G4 |
| FR-06 | Lịch sử | Timeline trạng thái, người xử lý, lý do | G3 sinh sự kiện; G2 đọc/hiển thị |
| FR-07 | Hạn xử lý và dashboard | Bốn chỉ số và bảng trạng thái | G4; G2 chụp hạn khi tạo |
| FR-08 | Chạy lại, kiểm thử, bàn giao | Docker, tài liệu, UAT có kết quả thật | G1 nền tảng; G4 điều phối; cả nhóm thực hiện |

### 6.2. Các màn hình tối thiểu

| Màn hình | Nội dung |
|---|---|
| Đăng nhập | Tài khoản, mật khẩu, lỗi hợp lệ, đăng xuất khi đã đăng nhập |
| Yêu cầu của tôi | Mã, tiêu đề, loại, trạng thái, người xử lý, thời hạn; tìm/lọc/phân trang |
| Tạo yêu cầu | Loại, tiêu đề, mô tả, mức ưu tiên; nhắc không gửi dữ liệu bí mật |
| Chi tiết yêu cầu dùng chung | Thông tin, lịch sử, bình luận, tệp; nút hành động theo quyền/trạng thái |
| Hàng đợi điều phối | Danh sách đúng bộ phận, phân công/giao lại/từ chối/hủy |
| Công việc được giao | Chỉ hồ sơ giao cho người đang đăng nhập; thao tác xử lý |
| Dashboard điều phối | Tổng gửi trong kỳ, tồn cần xử lý, tồn quá hạn, chờ xác nhận; bảng trạng thái |

Tái sử dụng màn chi tiết và component, không sao chép ba màn chi tiết cho ba vai trò. Có trạng thái đang tải, rỗng, lỗi, thành công và xung đột dữ liệu.

### 6.3. Trường nhập và kiểm tra

| Trường | Quy định MVP |
|---|---|
| Tiêu đề | 5–150 ký tự sau trim |
| Mô tả | 20–5.000 ký tự sau trim; văn bản thuần |
| Loại yêu cầu | Chọn trong danh mục đang hoạt động |
| Ưu tiên | `LOW`, `MEDIUM`, `HIGH`; mặc định `MEDIUM`; người gửi chọn theo hướng dẫn ảnh hưởng |
| Hướng dẫn ưu tiên | LOW: nhu cầu không cản trở công việc; MEDIUM: ảnh hưởng một người nhưng còn cách làm thay; HIGH: công việc bị chặn hoặc ảnh hưởng nhiều người. Đây là quy ước demo, không tự suy ra từ một câu mô tả. |
| Nội dung hành động | 5–2.000 ký tự cho câu hỏi, bổ sung, kết quả và lý do |
| Bình luận | 1–2.000 ký tự sau trim |
| Tệp | PNG, JPEG, PDF; tối đa 5 MiB/tệp; tổng tối đa 5 tệp/hồ sơ |
| Phân trang | Mặc định 20, tối đa 100 bản ghi; thứ tự ổn định theo thời điểm tạo và ID |

Tạo ticket trước, sau đó upload từng tệp tại màn chi tiết. Không bắt buộc gộp gửi ticket và tệp thành một thao tác nguyên tử; phải hiển thị đúng kết quả từng bước. Retry upload lỗi không được gửi lại thao tác tạo ticket.

### 6.4. User story và tiêu chí chấp nhận mẫu

**US-01 — Gửi yêu cầu.** Là nhân viên, tôi muốn gửi yêu cầu đúng bộ phận để không phải tìm người hỗ trợ thủ công.

- Given tài khoản hợp lệ và loại đang hoạt động; When gửi đủ trường; Then có đúng một hồ sơ `SUBMITTED`, mã duy nhất, người tạo đúng phiên và hạn xử lý được chụp.
- Given cùng người dùng gửi lại cùng `client_request_id` và nội dung; When retry; Then trả hồ sơ đã có, không sinh thêm mã hoặc sự kiện tạo.
- Given hai payload khác nhau dùng cùng khóa; When gửi lần sau; Then trả lỗi xung đột và không sửa hồ sơ cũ.

**US-02 — Phân công.** Là điều phối, tôi muốn giao một người phù hợp và tránh ghi đè phân công của người khác.

- Given `SUBMITTED` trong bộ phận; When giao agent hợp lệ; Then trạng thái là `ASSIGNED`, có agent và lịch sử cùng phiên bản mới.
- Given agent sai bộ phận hoặc chính người tạo; When phân công; Then bị từ chối, dữ liệu không đổi.
- Given hai thao tác cùng phiên bản; When xử lý đồng thời; Then chỉ một thao tác thành công, thao tác còn lại nhận `409`.

**US-03 — Bổ sung thông tin.** Là người xử lý, tôi muốn đặt câu hỏi rõ ràng; người gửi biết cách tiếp tục quy trình.

- Given đang xử lý; When đặt câu hỏi; Then chuyển chờ bổ sung và người gửi nhìn thấy câu hỏi.
- Given đang chờ; When người gửi chỉ đăng bình luận thường; Then trạng thái không đổi.
- Given đang chờ; When người gửi dùng “Gửi bổ sung”; Then lưu câu trả lời và quay lại xử lý, hoặc về hàng đợi khi agent mất hiệu lực.

**US-04 — Xác nhận kết quả.** Là người gửi, tôi muốn kiểm tra trước khi đóng.

- Given agent ghi kết quả; When báo đã xử lý; Then là `RESOLVED`, chưa phải `CLOSED`.
- Given kết quả chưa đạt; When người gửi phản hồi lý do; Then tiếp tục xử lý hoặc về hàng đợi nếu mất agent; lịch sử cũ còn, hạn không đổi.
- Given đã xác nhận đóng; When bất kỳ người nào cố sửa trạng thái/bình luận/upload; Then bị từ chối.

**US-05 — Tệp và bình luận.** Là người tham gia hồ sơ, tôi muốn trao đổi thông tin mà người ngoài không đọc được.

- Given người dùng không có quyền hồ sơ; When gọi trực tiếp API tệp/bình luận; Then không trả nội dung, metadata hoặc đường dẫn lưu trữ.
- Given tệp sai loại/quá dung lượng/quá số lượng; When upload; Then bị từ chối và không để metadata hoàn tất giả.

**US-06 — Dashboard.** Là điều phối, tôi muốn số liệu chỉ thuộc bộ phận của mình và có thể kiểm tra lại.

- Given bộ seed tại mục 8; When xem dashboard IT; Then bốn số lần lượt là 8, 4, 2, 1 theo thứ tự đã định nghĩa; bảng trạng thái cộng lại bằng 8.
- Given tồn tại thêm dữ liệu Hành chính; When xem bằng điều phối IT; Then các số IT không bị tăng bởi dữ liệu Hành chính.

---

<a id="s07"></a>
## 7. Dữ liệu, API và ranh giới triển khai

### 7.1. Kiến trúc giới hạn

```text
Trình duyệt → một frontend web → một backend REST → một database quan hệ
                                      └──────────→ nơi lưu tệp riêng có volume
```

Dùng một backend có các module rõ ràng, không chia dịch vụ độc lập. Chốt một bộ công nghệ nhóm đã biết; ví dụ React/TypeScript + backend đã quen + PostgreSQL. Đây là phương án tổ chức đề bài, không phải yêu cầu về một phiên bản thư viện cụ thể.

Định nghĩa API và dữ liệu mẫu trong ngày 1–2. Frontend dùng mock theo cùng hợp đồng trong lúc backend được xây dựng; không chờ người khác hoàn thành tất cả mới bắt đầu.

### 7.2. Bảy bảng nghiệp vụ và một bảng phiên

| Bảng | Dữ liệu quan trọng |
|---|---|
| `departments` | id, code, name, is_active |
| `users` | id, email unique, password_hash, display_name, role, home_department_id, service_department_id, is_active |
| `request_types` | id, code unique, name, handling_department_id, is_active |
| `requests` | id, request_code unique, client_request_id, payload_hash, title, description, request_type_id, created_by, requester_department_id_snapshot, handling_department_id, assigned_to nullable, priority, status, version, submitted_at, due_at, resolved_at nullable, closed_at nullable, current_resolution nullable |
| `request_events` | id, request_id, event_type, from_status, to_status, old_assignee_id, new_assignee_id, actor_id, reason_or_content, created_at, request_version |
| `request_comments` | id, request_id, author_id, content, created_at |
| `request_attachments` | id, request_id, uploaded_by, original_name, storage_key, detected_type, size_bytes, created_at |
| `auth_sessions` | id/sid, user_id, expires_at, revoked_at; hoặc cấu trúc phiên tương đương có khả năng thu hồi |

`request_events` lưu cả chuyển trạng thái và phân công, vì vậy không bắt buộc thêm bảng `request_assignments` hoặc `request_status_histories` riêng trong MVP. Trạng thái hiện tại nằm ở `requests`; lịch sử không được dùng làm một nguồn hiện tại cạnh tranh.

Ràng buộc tối thiểu: unique `(created_by, client_request_id)`; foreign key; enum trạng thái/role/priority; chỉ một agent hiện tại; event gắn đúng phiên bản thay đổi. Chỉ số truy vấn tối thiểu theo người tạo, bộ phận xử lý, người được giao, trạng thái và thời điểm gửi. Migration của mỗi module do người nhận gói viết và được review trước merge.

Quan hệ: một bộ phận có nhiều loại; một người tạo nhiều yêu cầu; một yêu cầu có nhiều event, comment và attachment; một yêu cầu tham chiếu tối đa một agent hiện tại. Nhóm bổ sung ERD theo database thực tế, không vẽ khác schema rồi để nguyên.

### 7.3. Hợp đồng API tối thiểu

| API | Mục đích | Chủ triển khai |
|---|---|---|
| `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | Phiên đăng nhập | G1 |
| `GET /request-types` | Danh mục để chọn | G1 |
| `POST /requests` | Gửi mới, có `client_request_id` | G2 |
| `GET /requests?scope=mine` | Danh sách của tôi | G2 |
| `GET /requests?scope=assigned` hoặc `scope=department` | Danh sách xử lý/điều phối | G3 |
| `GET /requests/{id}`, `GET /requests/{id}/events` | Chi tiết và timeline có quyền | G2; G3 cung cấp sự kiện |
| `GET /departments/{id}/agents` | Chọn agent; chỉ điều phối đúng bộ phận được gọi | G3 |
| `POST /requests/{id}/actions/{action}` | Workflow có `expected_version` | G3; UI người gửi do G2 tích hợp |
| `GET/POST /requests/{id}/comments` | Trao đổi văn bản | G4 |
| `POST /requests/{id}/attachments` | Upload tệp vào hồ sơ | G4 |
| `GET /attachments/{id}/download` | Download kiểm tra quyền | G4 |
| `GET /dashboard` | Bốn chỉ số và bảng trạng thái | G4 |
| `GET /health` | Kiểm tra backend và kết nối database | G1 |

Actions gồm: `assign`, `reassign`, `start`, `request-info`, `provide-info`, `resolve`, `confirm`, `reopen`, `reject`, `cancel`. Backend tự chọn ST-15 khi `provide-info`/`reopen` gặp agent mất hiệu lực. **Không tạo hai service chuyển trạng thái khác nhau ở G2 và G3.**

Kết quả action trả snapshot/version mới. Quy ước lỗi: `400` trường nhập; `401` phiên không hợp lệ; `403` có hồ sơ nhưng không có quyền hành động; `404` tài nguyên không tồn tại hoặc không được phép nhìn thấy; `409` trạng thái/phiên bản/khóa gửi xung đột; `413` quá dung lượng; `415` loại tệp không hỗ trợ. Chốt định dạng lỗi thống nhất trước khi tích hợp.

### 7.4. Bảo vệ và tính nhất quán không được cắt

Xác thực có thể dùng JWT ngắn hạn mang `sid`, đối chiếu phiên còn hiệu lực ở server; logout thu hồi phiên và token cũ không dùng lại được. JWT chỉ mang định danh cần thiết; backend vẫn đọc quyền/tình trạng tài khoản hiện tại. Mật khẩu phải băm bằng thư viện chuyên dụng; không tự viết thuật toán hoặc lưu plaintext. Có giới hạn thử đăng nhập và không đưa mật khẩu/token vào log.

Với web demo, giữ access token trong bộ nhớ; tải lại trang có thể yêu cầu đăng nhập lại. Không bắt buộc refresh token. Nếu nhóm chọn cookie thay thế, phải đặc tả và kiểm thử cookie/CSRF phù hợp; không trộn hai cách xác thực một cách tùy tiện. Không commit secret; có `.env.example`; dùng HTTPS khi mở môi trường qua mạng, không truyền tài khoản trên endpoint công khai HTTP.

Mutation dùng transaction và kiểm tra version nguyên tử. Request/event phải nhất quán; UI nhận lỗi phải tải dữ liệu mới, không tự ghi đè. Bình luận/tệp là các bản ghi con: phải kiểm tra trạng thái được phép ghi trong giao dịch gắn bản ghi, tránh upload xong sau khi hồ sơ đã đóng. Thao tác thêm bình luận/tệp không tăng `requests.version`; version này dành cho vòng đời/phân công. Chỉ giới hạn năm tệp bằng kiểm tra có khóa phù hợp, không đếm ngoài giao dịch rồi cho hai upload vượt trần.

Tệp kiểm tra phần mở rộng, MIME và dấu hiệu định dạng; không tin tên gốc, không thực thi và không phục vụ như mã web. Đặt tên lưu bằng định danh do server sinh; tải xuống dạng attachment; dữ liệu file nằm trong volume riêng. Không cần antivirus tích hợp trong demo, nhưng chỉ chấp nhận tệp kiểm thử và không tuyên bố an toàn cho dữ liệu production. Nếu lưu file thành công nhưng transaction metadata thất bại, dọn file chưa gắn bằng cơ chế rõ ràng; không để đường dẫn giả hoặc metadata thành công khi byte chưa được lưu bền.

---

<a id="s08"></a>
## 8. Thời hạn và báo cáo

### 8.1. Chính sách demo

`LOW = 48 giờ`, `MEDIUM = 24 giờ`, `HIGH = 8 giờ`; tính theo giờ liên tục từ `submitted_at`. Đây là **giả định phục vụ thực tập**, không phải SLA được doanh nghiệp cam kết.

`due_at = submitted_at + số giờ của mức ưu tiên tại thời điểm gửi`. Lưu UTC; hiển thị giờ Việt Nam. Mốc hạn giữ nguyên khi giao lại, chờ bổ sung và phản hồi chưa đạt. Không sửa ưu tiên hoặc tính lại hồ sơ cũ khi thay danh mục.

G1 đặt cấu hình chung; G2 chụp `due_at` trong giao dịch tạo; G4 định nghĩa hàm quá hạn dùng chung và kiểm tra công thức. Không viết ba bảng quy đổi giờ khác nhau ở các module.

### 8.2. Định nghĩa bốn chỉ số

Gọi `S` là tập yêu cầu thuộc bộ phận dịch vụ của điều phối hiện tại. Các ô tồn là snapshot tại thời điểm xem; bộ lọc kỳ **chỉ áp dụng cho ô tổng gửi và bảng trạng thái theo lứa gửi**. Nhãn phải thể hiện rõ để người dùng không hiểu nhầm tất cả ô cùng tính theo kỳ.

| Chỉ số | Công thức |
|---|---|
| Tổng gửi trong kỳ | Số yêu cầu trong `S` có `from <= submitted_at < to` |
| Tồn cần xử lý hiện tại | Số yêu cầu trong `S` có trạng thái SUBMITTED, ASSIGNED, IN_PROGRESS hoặc WAITING_FOR_REQUESTER |
| Tồn quá hạn hiện tại | Tập tồn cần xử lý có `now > due_at`; đúng bằng hạn chưa tính quá hạn |
| Chờ xác nhận hiện tại | Số yêu cầu trong `S` có trạng thái RESOLVED |

Bảng trạng thái trong kỳ chia **cùng tập “tổng gửi trong kỳ”** theo trạng thái hiện tại. Tổng các dòng bằng chỉ số tổng gửi. Không cộng ba ô tồn với ô tổng gửi; các tập này có thể giao nhau và khác cơ sở thời gian.

### 8.3. Bộ dữ liệu đối chiếu bắt buộc

Thời điểm kiểm thử giả lập `T0 = 20/10/2026 10:00` giờ Việt Nam. Tất cả tám hồ sơ IT dưới đây được gửi trong kỳ từ 01/10/2026 00:00 đến trước 21/10/2026 00:00. Dùng clock cố định khi test, không phụ thuộc ngày máy đang chạy.

| Hồ sơ | Trạng thái | Thời hạn so với T0 |
|---|---|---|
| IT-01 | SUBMITTED | Sau T0 |
| IT-02 | ASSIGNED | Trước T0 |
| IT-03 | IN_PROGRESS | Sau T0 |
| IT-04 | WAITING_FOR_REQUESTER | Trước T0 |
| IT-05 | RESOLVED | Trước T0 |
| IT-06 | CLOSED | Trước T0 |
| IT-07 | CANCELLED | Trước T0 |
| IT-08 | REJECTED | Trước T0 |

Kết quả điều phối IT: **tổng gửi = 8; tồn cần xử lý = 4; tồn quá hạn = 2; chờ xác nhận = 1**. Bảng trạng thái có một hồ sơ ở mỗi trạng thái, tổng bằng tám. Thêm hai hồ sơ Hành chính không làm thay đổi các số này khi đăng nhập điều phối IT. Test thêm `due_at == T0` để xác nhận chưa quá hạn.

---

<a id="s09"></a>
## 9. Kiểm thử và nghiệm thu

### 9.1. Ma trận tối thiểu

| Mã | Tình huống cần chạy | Tiêu chí đạt | Liên kết |
|---|---|---|---|
| AT-01 | Đăng nhập/đăng xuất, token cũ, tài khoản bị khóa | Phiên hết quyền bị từ chối | FR-01 |
| AT-02 | Tạo hợp lệ, thiếu trường, sửa `created_by` | Đúng dữ liệu và tác nhân; input xấu không tạo hồ sơ | FR-02 |
| AT-03 | Gửi trùng cùng khóa, cùng khóa khác nội dung | Một hồ sơ hoặc lỗi xung đột đúng quy định | BR-04 |
| AT-04 | Đọc yêu cầu/tệp/bình luận ngoài quyền | Không lộ nội dung hoặc metadata | FR-01, FR-05 |
| AT-05 | Phân công đúng, sai bộ phận, tự giao | Chỉ trường hợp hợp lệ thành công | ST-02 |
| AT-06 | Hai phân công cùng version; mô phỏng rollback | Một thay đổi hợp lệ; lịch sử không ghi dở | BR-08, BR-09 |
| AT-07 | Bắt đầu → hỏi → bình luận thường → gửi bổ sung | Bình luận không đổi trạng thái; hành động bổ sung đổi đúng | ST-03–ST-05 |
| AT-08 | Resolve → chưa đạt → resolve → confirm | Giữ hạn, giữ lịch sử; cuối cùng CLOSED | ST-06–ST-08 |
| AT-09 | Hủy/từ chối ở trạng thái được và không được phép | Kiểm tra đúng vai trò, lý do và trạng thái | ST-09–ST-11 |
| AT-10 | Giao lại khi đang xử lý/chờ/chờ xác nhận | Đúng trạng thái; agent cũ mất quyền | ST-12–ST-14 |
| AT-11 | Khóa agent rồi người gửi bổ sung/phản hồi | Về hàng đợi, giữ nội dung, không kẹt | ST-15 |
| AT-12 | Ghi vào hồ sơ đã kết thúc | Không đổi trạng thái, không thêm bình luận/tệp | BR-16 |
| AT-13 | Upload hợp lệ; sai loại/kích thước/số lượng; tranh chấp với close | Không vượt giới hạn; không lưu metadata giả hoặc ghi sau close | FR-05 |
| AT-14 | Tìm kiếm, lọc, phân trang theo ba phạm vi | Đủ dữ liệu trong quyền, không rò số lượng ngoài quyền | FR-03 |
| AT-15 | Dashboard fixture, ranh giới deadline/ngày và khác bộ phận | Đúng các công thức mục 8 | FR-07 |
| AT-16 | Clone sạch, migrate/seed, restart và khôi phục dữ liệu demo | Dựng lại được; hồ sơ và tệp còn đọc được | FR-08 |

Mỗi dòng là một **nhóm ca kiểm thử**, không phải chỉ một lần bấm nút. Hồ sơ nộp phải có dữ liệu đầu vào, kết quả mong đợi, kết quả thật, pass/fail, môi trường, commit và bằng chứng. Không đánh dấu tất cả đạt khi chưa chạy.

Bắt buộc có test tự động cho chính sách quyền, gửi trùng, bảng chuyển trạng thái, xung đột version và công thức dashboard. UAT đầu-cuối có thể chạy thủ công theo kịch bản; không bắt buộc một bộ E2E tự động lớn trong tháng đầu.

### 9.2. Kịch bản demo cuối kỳ

Người nghiệm thu dùng các tài khoản khác nhau để: gửi ticket IT; điều phối giao agent; agent hỏi thông tin; người gửi bổ sung; agent đính kèm kết quả và báo đã xử lý; người gửi báo chưa đạt; agent xử lý lại; người gửi xác nhận đóng. Sau đó chứng minh người ngoài không đọc được hồ sơ/tệp, agent cũ mất quyền sau giao lại, số liệu dashboard khớp fixture, và dữ liệu tồn tại sau restart.

### 9.3. Điều kiện chặn nghiệm thu

Không nghiệm thu hoàn thành nếu còn lỗi đọc/ghi trái quyền, lộ tệp/secret, mất dữ liệu hoặc lịch sử, ghi đè im lặng, không hoàn tất được vòng đời chính, không dựng lại được môi trường, hoặc còn chức năng bắt buộc chưa làm mà chưa được duyệt cắt phạm vi.

Một bảng tính điểm đẹp, video dựng sẵn hoặc chức năng AI không thay thế các điều kiện này. Lỗi giao diện nhỏ có thể được ghi nhận với kế hoạch xử lý khi người nghiệm thu đồng ý; nhóm không tự quyết định lỗi nào được bỏ qua.

---

<a id="s10"></a>
## 10. Kế hoạch bốn tuần và nguồn lực

### 10.1. Nguồn lực dự kiến

| Quy mô | Quỹ giờ theo giả định 20 giờ/người/tuần | Công việc cơ sở trong file phân công | Quỹ còn lại |
|---|---|---|---|
| 4 người | 320 giờ-người | 180 giờ-người | 140 giờ-người |
| 3 người | 240 giờ-người | 180 giờ-người, chia lại 60 giờ/người | 60 giờ-người |

180 giờ là **ước lượng sơ bộ cho công việc và đầu ra đã liệt kê**, có cả BA, test, review theo gói, không phải 180 giờ chỉ viết code. Quỹ còn lại dành cho học phần còn thiếu, trao đổi, sửa lỗi ngoài dự kiến, hỗ trợ chéo và chậm tích hợp. Không mặc định biến quỹ còn lại của nhóm bốn thành yêu cầu làm thêm tính năng.

Nhóm ước lượng lại sau ngày 2. Nếu người nhận một gói thấy thiếu kỹ năng hoặc công việc lớn hơn dự kiến, phải báo ngay; không coi con số này là định mức năng suất bắt buộc của từng sinh viên.

### 10.2. Lịch triển khai

| Tuần | Ngày quy ước | Mục tiêu | Điều kiện kiểm tra cuối tuần |
|---|---|---|---|
| 1 | Ngày 1–5 | Tự chọn gói; chốt BA, API, database; bộ khung; login; gửi và xem ticket cơ bản | **M1:** từ UI đăng nhập, gửi một ticket và điều phối đúng bộ phận thấy được; mock phải ghi rõ, không tính là đã xong backend |
| 2 | Ngày 6–10 | Phân công, xử lý, bổ sung, resolve/confirm/reopen, lịch sử; tích hợp liên tục | **M2:** vòng đời chính chạy đầu-cuối bằng tài khoản khác nhau; không chỉ test API độc lập |
| 3 | Ngày 11–15 | Bình luận, tệp, lọc/phân trang, hạn/dashboard; giao lại, hủy/từ chối, ngoại lệ; test quyền | **M3:** đủ FR-01 đến FR-08 ở mức tính năng; đóng băng thêm chức năng vào cuối ngày 15 |
| 4 | Ngày 16–20 | Chạy AT/UAT, sửa lỗi, dựng sạch, lưu bền/khôi phục; hoàn thiện tài liệu và demo | **M4:** có release, kết quả test thật, biên bản UAT và đóng góp từng người |

Không dành trọn tuần 1 chỉ viết tài liệu, không chờ tuần 4 mới ghép frontend/backend. Công việc BA ngày 1–2 cần đủ để bắt đầu; tài liệu cập nhật theo thay đổi đã duyệt.

### 10.3. Khi trễ tiến độ

Ngày 5 chưa có luồng gửi/xem: dừng trang trí, rà lại hợp đồng API và điểm nghẽn; người rảnh hỗ trợ đầu-cuối. Ngày 10 chưa chạy vòng đời: dừng toàn bộ mở rộng, người hướng dẫn review state machine và chia nhỏ lỗi. Ngày 15 chưa đủ MVP: không thêm tính năng; lập danh sách thiếu, đánh giá tác động và trình người giao bài quyết định.

Có thể đề nghị giảm số loại dịch vụ và chỉ demo vận hành IT, nhưng vẫn giữ bộ phận thứ hai làm dữ liệu kiểm tra cách ly. Việc bỏ một mục bắt buộc như tệp hoặc dashboard phải được duyệt, cập nhật cả hai file và giảm khối lượng tương ứng; không đánh dấu “đã hoàn thành” bằng cách đổi tên việc.

---

<a id="s11"></a>
## 11. Bàn giao và đánh giá

### 11.1. Bộ bàn giao gọn

```text
frontend/
backend/
  migrations/
  seed/
docker-compose.yml
.env.example
README.md                         # Dựng môi trường và tài khoản demo
openapi.yaml hoặc Swagger export

docs/
  BA_Decisions.md                  # Quyết định và thay đổi so với đề bài
  Design.md                       # Kiến trúc, ERD, luồng/sequence phân công
  Test_UAT.md                     # Ca test, kết quả thật, bằng chứng
  Deployment.md                   # Chạy, sao lưu/khôi phục, giới hạn
  Task_Board.md                    # Người nhận, trạng thái, issue/PR/test
```

Không bắt buộc tạo Excel, PDF hoặc bộ tài liệu hàng chục file. Có thể dùng Markdown, bảng trong repository và sơ đồ dạng mã. Nhóm phải giải thích quan hệ tác nhân, luồng trạng thái, dữ liệu và một sequence có xử lý xung đột; không chấm theo số lượng hình vẽ.

### 11.2. Git và điều kiện hoàn thành một việc

Dùng `feature/<ma-viec>-<ten-ngan>` → pull request → người khác review → `develop`; chỉ đưa bản ổn định sang `main` và gắn tag nghiệm thu. Không cùng code trực tiếp lên `main`. Nếu nhóm đã có quy trình trunk-based được người hướng dẫn duyệt, ghi rõ thay thế; không duy trì hai quy trình song song.

Một việc chỉ `DONE` khi đúng tiêu chí, đã có code chạy trong nhánh tích hợp, được review, test tương ứng đạt và tài liệu liên quan được cập nhật. Có code ở máy cá nhân hoặc trên feature branch chưa phải bàn giao. CI tự động build/test là điểm cộng, không bắt buộc trả phí hoặc deploy qua dịch vụ bên ngoài.

### 11.3. Thang điểm đề xuất

| Nội dung | Điểm |
|---|---:|
| BA: phạm vi, quyền, trạng thái, tiêu chí chấp nhận | 15 |
| Workflow và xử lý ngoại lệ | 20 |
| Backend, dữ liệu và tính nhất quán | 15 |
| Frontend và trải nghiệm đầu-cuối | 15 |
| Phân quyền, xác thực và bảo vệ tệp | 10 |
| Kiểm thử/UAT có bằng chứng | 10 |
| Git/review và phối hợp | 5 |
| Docker, dựng lại và tài liệu bàn giao | 10 |
| **Tổng** | **100** |

Điểm cá nhân gợi ý: 60% kết quả chung + 40% phần riêng. Phần riêng xem mức hoàn thành gói nhận, hiểu nghiệp vụ/code, test/review và hỗ trợ tích hợp. Không dùng số dòng code hoặc số commit làm thước đo chính. Người dùng AI vẫn phải giải thích và chịu trách nhiệm phần mình.

---

<a id="s12"></a>
## 12. Biểu mẫu BA và quản lý thay đổi

### 12.1. Biên bản chốt đầu kỳ

```text
Ngày bắt đầu thực tập: ...       Ngày kết thúc: ...
Người giao bài/người hướng dẫn: ...
Danh sách thành viên và số giờ có thể tham gia: ...
Phương án nhận việc: 4 gói / 3 gói ghép theo file phân công
Công nghệ chọn: ...
Hình thức nghiệp vụ: khảo sát thật / mô phỏng
Các quyết định giữ nguyên bản 2.0: ...
Điểm đề nghị thay đổi và tác động: ...
Lịch kiểm tra M1/M2/M3/M4: ...
Người có quyền chốt và kết quả xác nhận: ...
```

### 12.2. Mẫu một yêu cầu thay đổi

```text
CR-xx — Tên thay đổi:
Lý do:
FR/BR/ST, màn hình, API, dữ liệu và test bị ảnh hưởng:
Giờ công tăng/giảm, người bị ảnh hưởng:
Có giữ được ngày kết thúc một tháng không:
Mục nào phải cắt để bù:
Quyết định của người giao bài: chấp thuận / không / cần bổ sung
Ngày, người xác nhận, phiên bản tài liệu mới:
```

### 12.3. Checklist trước nghiệm thu

- [ ] Tất cả FR-01 đến FR-08 có bằng chứng và liên kết task/PR/test.
- [ ] Luồng chính và ngoại lệ ST-01 đến ST-15 đã được kiểm tra đúng quyền.
- [ ] AT-01 đến AT-16 có kết quả thực tế, không chỉ danh sách dự kiến.
- [ ] Dashboard khớp fixture; tệp và dữ liệu còn sau restart/khôi phục demo.
- [ ] Người khác dựng môi trường từ README; không cần xin source hoặc sửa DB thủ công để demo.
- [ ] Mỗi thành viên tự trình diễn và giải thích gói mình nhận.
- [ ] Danh sách lỗi/giới hạn còn lại được ghi rõ và có người nghiệm thu xác nhận.

**Nguồn hình thành:** đề bài do người giao việc cung cấp và tài liệu IRMS-BA-SRS-001 phiên bản 1.0 trong cuộc trao đổi này. Bản 2.0 là phương án thiết kế/thu gọn cho bài thực tập; các định mức giờ, hạn demo, tiêu chí và phân công là đề xuất, không phải tiêu chuẩn chứng nhận hoặc dữ liệu năng suất đã đo.

**Hết tài liệu — IRMS-BA-SRS-001, phiên bản 2.0.**
