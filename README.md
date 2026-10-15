# HƯỚNG DẪN TRIỂN KHAI VÀ SỬ DỤNG HỆ THỐNG

**Tên dự án:** Hệ thống Quản lý và Tra cứu Tài khoản Trực tuyến  
**Thành viên thực hiện:**  
- Phạm Minh Thông (B2605470)  
- Phạm Duy Thái (B2605464)  
**Đơn vị:** Đại học Cần Thơ (Can Tho University)

---

## 1. Cấu trúc mã nguồn
- `index.html`: Giao diện chính (Tra cứu sinh viên & Bảng điều khiển Quản trị).
- `style.css`: Quy chuẩn giao diện và hiệu ứng CSS.
- `app.js`: Xử lý logic kiểm tra email (`@student.ctu.edu.vn`), xác thực Admin Key (`CTU2026AdminSecret`), thao tác CRUD và đồng bộ Supabase.
- `schema.sql`: Kịch bản SQL khởi tạo CSDL trên Supabase.

---

## 2. Hướng dẫn kết nối Supabase Cloud DB
1. Truy cập [Supabase.com](https://supabase.com) và tạo một dự án mới.
2. Vào mục **SQL Editor**, dán toàn bộ mã trong file `schema.sql` và nhấn **Run** để khởi tạo bảng dữ liệu `accounts`.
3. Vào **Project Settings** -> **API**, sao chép `Project URL` và `anon public key`.
4. Mở file `app.js`, cập nhật 2 dòng đầu tiên:
   ```javascript
   const SUPABASE_URL = "https://your-project.supabase.co";
   const SUPABASE_ANON_KEY = "your-anon-key";
   ```

---

## 3. Triển khai lên GitHub Pages
1. Tạo một Repository mới trên GitHub (ví dụ: `ctu-account-management`).
2. Tải toàn bộ các file mã nguồn này lên nhánh `main`.
3. Vào **Settings** -> **Pages** -> Chọn Branch `main` -> Save.
4. Truy cập đường dẫn GitHub Pages được cấp (ví dụ: `https://<username>.github.io/ctu-account-management/`).

---

## 4. Thông tin truy cập Quản trị
- Nút truy cập **Quản trị** nằm ở góc trên bên phải header.
- **Admin Key mặc định:** `CTU2026AdminSecret` (Có thể chỉnh sửa trong file `app.js`).
