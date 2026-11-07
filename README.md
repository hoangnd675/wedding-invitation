# Thiệp cưới online

Dự án thiệp cưới sử dụng Next.js 16, React 19 và TypeScript. Website được lưu mã nguồn trên GitHub và triển khai tự động bằng Vercel. Dự án **không sử dụng Supabase hoặc cơ sở dữ liệu bên ngoài**.

## Các trang

- `/`: Thiệp mời dành cho khách xem.
- `/demo`: Trang xem thử các chủ đề, hiệu ứng và nhạc nền.
- `/cau-hinh` (hoặc `/config`): Trang chỉnh sửa nội dung thiệp và xuất/nhập cấu hình JSON.

## Lưu trữ dữ liệu

- Cấu hình thiệp, lời chúc, RSVP và ảnh khách chia sẻ được lưu trong `localStorage` của trình duyệt.
- Dữ liệu chỉ tồn tại trên trình duyệt và thiết bị đã tạo ra dữ liệu đó; không tự đồng bộ giữa các khách mời hoặc thiết bị khác nhau.
- Xóa dữ liệu trình duyệt có thể làm mất dữ liệu đã lưu. Hãy xuất cấu hình JSON để sao lưu trước khi đổi thiết bị hoặc xóa dữ liệu trình duyệt.
- GitHub lưu mã nguồn; Vercel lưu bản triển khai. Hai dịch vụ này không tự đóng vai trò cơ sở dữ liệu cho RSVP/lời chúc.

## Chạy dự án trên máy

Yêu cầu Node.js và pnpm tương thích với `packageManager` trong `package.json`.

```bash
pnpm install
pnpm dev
```

Mở `http://localhost:3000`.

## Kiểm tra trước khi triển khai

```bash
pnpm exec tsc --noEmit
pnpm build
```

Build không bỏ qua lỗi TypeScript. Hãy xử lý lỗi được báo trước khi triển khai.

## Đưa mã nguồn lên GitHub

```bash
git init
git add .
git commit -m "Clean and optimize wedding invitation"
git branch -M main
git remote add origin https://github.com/<tai-khoan>/<ten-repository>.git
git push -u origin main
```

Nếu repository đã có remote và nhánh `main`, chỉ cần:

```bash
git add .
git commit -m "Clean and optimize wedding invitation"
git push origin main
```

## Triển khai trên Vercel

1. Đăng nhập Vercel và chọn **Add New → Project**.
2. Import repository GitHub.
3. Giữ framework preset là **Next.js** và dùng lệnh build mặc định `next build`.
4. Nhấn **Deploy**.
5. Những lần push tiếp theo lên nhánh đã kết nối sẽ tự kích hoạt deployment mới.

Không cần khai báo biến môi trường Supabase.

## Tài nguyên ảnh và nhạc

- Ảnh: `public/photos/`
- Nhạc: `public/music/`
- Dữ liệu mặc định và danh sách chủ đề: `lib/wedding-data.ts`
- Quản lý trạng thái và lưu trình duyệt: `lib/wedding-store.ts`

Không xóa hoặc đổi tên tài nguyên đang được tham chiếu trong `lib/wedding-data.ts` nếu chưa cập nhật các đường dẫn tương ứng.
