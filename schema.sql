-- ============================================================
-- SUPABASE DATABASE SETUP SCHEMA
-- Dự án: Hệ thống Quản lý và Tra cứu Tài khoản Trực tuyến CTU
-- Thực hiện: Phạm Minh Thông (B2605470) & Phạm Duy Thái (B2605464)
-- ============================================================

-- 1. Tạo bảng accounts
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mssv VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    class_name VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Chờ xử lý',
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Đặt Row Level Security (RLS) để bảo mật
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- 3. Tạo Policy cho phép tra cứu công khai (Public Select)
CREATE POLICY "Cho phép tất cả tra cứu email" 
ON public.accounts 
FOR SELECT 
USING (true);

-- 4. Tạo Policy cho phép Admin thêm/sửa/xóa (hoặc bật full access cho Anon Key nếu thử nghiệm)
CREATE POLICY "Cho phép full CRUD" 
ON public.accounts 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 5. Chèn dữ liệu mẫu
INSERT INTO public.accounts (mssv, full_name, email, class_name, status) VALUES
('B2605470', 'Phạm Minh Thông', 'thongb2605470@student.ctu.edu.vn', 'Công nghệ thông tin K48', 'Đã phê duyệt'),
('B2605464', 'Phạm Duy Thái', 'thaib2605464@student.ctu.edu.vn', 'Kỹ thuật Phần mềm K48', 'Đã phê duyệt');
