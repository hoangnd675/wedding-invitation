# Thiệp Mời Cưới Online - Next.js 16 (GitHub & Vercel Ready)

## 1. Cấu trúc 3 trang trong dự án
- `/` (`app/page.tsx`): **Trang Khách Xem Online** (Chỉ hiển thị phong bì mở thiệp + nội dung thiệp + nhạc nền tự phát, không có thanh chỉnh sửa).
- `/demo` (`app/demo/page.tsx`): **Trang Demo** (Cho phép thử trực tiếp 14 chủ đề, hiệu ứng rơi và 5 bản nhạc nền).
- `/cau-hinh` hoặc `/config` (`app/cau-hinh/page.tsx`): **Trang Cấu Hình** (Tuỳ chỉnh tên cô dâu chú rể, ngày giờ cưới, ảnh, nhạc nền, địa điểm Google Maps, mã QR ngân hàng).

## 2. Cách thay Nhạc nền và Ảnh cưới cố định
- Bỏ các file nhạc `.mp3` của bạn vào thư mục `public/music/`.
- Bỏ các file ảnh cưới của bạn vào thư mục `public/photos/`.
- Mở file `lib/wedding-data.ts` để sửa thông tin mặc định (`DEFAULT_WEDDING_DATA`) hoặc dùng trang `/cau-hinh` rồi nhấn **Xuất file JSON** để lấy cấu hình.

## 3. Cách đưa lên GitHub & Deploy miễn phí trên Vercel
1. Giải nén file ZIP này ra một thư mục trên máy tính.
2. Tạo một Repository mới trên GitHub và đẩy code lên:
   ```bash
   git init
   git add .
   git commit -m "Initial wedding invitation"
   git branch -M main
   git remote add origin https://github.com/<ten-tai-khoan>/<ten-repo>.git
   git push -u origin main
   ```
3. Truy cập https://vercel.com -> Chọn **Add New... -> Project** -> Chọn Repository vừa tạo -> Nhấn **Deploy**.
