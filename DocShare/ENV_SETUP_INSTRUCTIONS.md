# Hướng dẫn thiết lập biến môi trường

## 1. Tạo file .env.local

Tạo file `.env.local` ở thư mục gốc của dự án với nội dung sau:

```env
# Supabase URL (đã có trong ứng dụng)
NEXT_PUBLIC_SUPABASE_URL=https://clxmdntmwbzjgtredeql.supabase.co

# Supabase Anon Key (đã có trong ứng dụng)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNseG1kbnRtd2J6amd0cmVkZXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MzQ5MDUsImV4cCI6MjA2MjUxMDkwNX0.ndiz7StdLzU6Ljjk7kA_t6peHW-Zb6C9QoJD6iXzC9g

# Supabase Service Key (chỉ sử dụng ở server-side)
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNseG1kbnRtd2J6amd0cmVkZXFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNzQxNTA5OCwiZXhwIjoyMDIyOTkxMDk4fQ.jAntRJLPqjPIDzPfuuH8fU-w3PYGHwCk-kHBjzwIjQ4
```

Lưu ý:

- Service key phải được lấy từ Supabase Dashboard > Project Settings > API > Project API keys > service_role key
- Đảm bảo file `.env.local` đã được thêm vào `.gitignore` để không vô tình commit key lên repository

## 2. Khởi động lại ứng dụng

Sau khi tạo file `.env.local`, khởi động lại ứng dụng để áp dụng các biến môi trường mới:

```bash
npm run dev
```

## 3. Xác minh biến môi trường đã được tải

Khi API route `/api/documents/upload` được gọi, hệ thống sẽ log thông tin về biến môi trường để xác minh chúng đã được tải đúng cách.
