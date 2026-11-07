# Thiệp cưới online

Ứng dụng thiệp cưới xây dựng bằng Next.js 16, React 19 và TypeScript. Mã nguồn được quản lý trên GitHub và tự động triển khai qua Vercel. Supabase được dùng làm backend trực tuyến để đồng bộ cấu hình thiệp, RSVP, lời chúc và ảnh khách mời giữa các thiết bị.

## Các trang

- `/`: Thiệp mời dành cho khách.
- `/demo`: Xem thử các chủ đề, hiệu ứng và nhạc nền.
- `/cau-hinh`: Trang quản trị để chỉnh sửa nội dung và giao diện thiệp.
- `/admin-login`: Đăng nhập quản trị.
- `/config`: Đường dẫn tương thích, chuyển tiếp tới trang cấu hình.

## Dữ liệu và đồng bộ

- Cấu hình thiệp được lưu trên Supabase và tải lại khi mở website trên thiết bị khác.
- RSVP, lời chúc và ảnh khách chia sẻ được lưu trực tuyến.
- Trình duyệt vẫn dùng localStorage làm bản lưu cục bộ và hỗ trợ trải nghiệm khi khởi tạo.
- Ảnh khách mời được lưu trong Supabase Storage, bucket `guest-photos`.

## Biến môi trường

Cấu hình các biến sau trong Vercel (và trong file môi trường local nếu chạy trên máy):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_ADMIN_API_SECRET`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Không đưa giá trị bí mật vào mã nguồn hoặc commit lên GitHub.

## Chạy dự án trên máy

Yêu cầu Node.js 22 và pnpm theo phiên bản khai báo trong `package.json`.

```bash
pnpm install
pnpm dev
```

Mở `http://localhost:3000`.

## Kiểm tra trước khi triển khai

```bash
pnpm typecheck
pnpm build
```

Vercel tự động tạo deployment khi có commit mới trên nhánh đã kết nối.

## Cấu trúc tài nguyên

- `components/wedding/`: Các thành phần giao diện thiệp.
- `lib/wedding-data.ts`: Dữ liệu mặc định, kiểu dữ liệu và danh sách chủ đề/nhạc.
- `lib/wedding-store.ts`: Quản lý trạng thái và đồng bộ dữ liệu.
- `app/api/`: API đăng nhập quản trị, cấu hình và RSVP.
- `public/photos/`: Ảnh minh họa mặc định.
- `public/music/`: Nhạc nền có trong ứng dụng.

Không xóa hoặc đổi tên ảnh, nhạc đang được tham chiếu trong mã nguồn nếu chưa cập nhật các đường dẫn tương ứng.
