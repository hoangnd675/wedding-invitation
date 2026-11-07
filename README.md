# Thiệp cưới online

Ứng dụng tạo và quản lý thiệp cưới trực tuyến, xây dựng bằng **Next.js 16**, **React 19**, **TypeScript** và **Tailwind CSS 4**. Dự án sử dụng **Supabase** để lưu trữ và đồng bộ dữ liệu, **Vercel** để triển khai và **GitHub** để quản lý mã nguồn.

## Tính năng

- Thiệp cưới hiển thị tốt trên điện thoại, máy tính bảng và máy tính.
- Nhiều chủ đề giao diện, hiệu ứng, kiểu chữ nghệ thuật và nhạc nền.
- Trang demo để xem trước chủ đề, hiệu ứng và tùy chỉnh thử nghiệm mà không ghi đè cấu hình thiệp chính.
- Quản lý thông tin cô dâu, chú rể, gia đình, ngày cưới, địa điểm và nội dung thiệp.
- Khách mời xác nhận tham dự (RSVP), gửi lời chúc và chia sẻ ảnh.
- Lưu cấu hình, RSVP, lời chúc và dữ liệu liên quan trên Supabase để đồng bộ giữa các thiết bị.
- Quản trị có xác thực bằng mật khẩu và phiên đăng nhập phía máy chủ.

## Các trang chính

| Đường dẫn | Chức năng |
| --- | --- |
| `/` | Trang thiệp cưới mặc định dành cho khách mời |
| `/thiep/[slug]` | Thiệp cưới theo đường dẫn riêng của từng cặp đôi |
| `/demo` | Xem trước chủ đề, hiệu ứng, phông chữ và các tùy chỉnh demo |
| `/config` | Đăng nhập quản trị và cấu hình thiệp |

**Lưu ý:** Trang đăng nhập được tích hợp trực tiếp trong `/config`. Truy cập đường dẫn này sẽ yêu cầu mật khẩu nếu chưa có phiên quản trị hợp lệ. Không còn sử dụng các đường dẫn quản trị cũ `/cau-hinh` hoặc `/admin-login`.

## Dữ liệu và lưu trữ

Supabase là backend trực tuyến của ứng dụng:

- Thông tin cặp đôi và cấu hình thiệp được đọc/lưu qua API phía máy chủ.
- RSVP của khách mời được lưu vào cơ sở dữ liệu.
- Ảnh khách mời được lưu trong Supabase Storage, bucket `guest-photos`.
- Nhạc do quản trị viên tải lên được lưu trong bucket `wedding-music`.
- Hỗ trợ tải nhạc MP3, WAV, M4A, AAC, OGG và WEBM; dung lượng tối đa 15 MB mỗi tệp.
- Một số trạng thái giao diện được lưu cục bộ trong trình duyệt để hỗ trợ trải nghiệm sử dụng.

Các thao tác quản trị như cập nhật cấu hình, quản lý RSVP và tải nhạc lên đều cần phiên quản trị hợp lệ.

## Công nghệ sử dụng

- Next.js 16.4
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase REST API và Supabase Storage
- pnpm 12.3.4
- Vercel

## Yêu cầu môi trường

- Node.js 22.x
- pnpm 12.3.4 (theo trường `packageManager` trong `package.json`)
- Một dự án Supabase đã được cấu hình backend và Storage phù hợp với ứng dụng
- Một dự án Vercel được kết nối với repository GitHub

## Cấu hình biến môi trường

Thiết lập các biến sau trong **Vercel → Project → Settings → Environment Variables**. Khi chạy local, có thể khai báo trong file `.env.local` ở thư mục gốc.

| Tên biến | Mục đích |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL của dự án Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_ADMIN_API_SECRET` | Khóa bí mật dùng bởi API quản trị phía máy chủ |
| `ADMIN_PASSWORD` | Mật khẩu đăng nhập trang quản trị |
| `ADMIN_SESSION_SECRET` | Bí mật dùng để ký và xác thực phiên quản trị |

Không đưa giá trị thật của các biến môi trường vào README, mã nguồn, ảnh chụp màn hình công khai hoặc commit Git. Không sử dụng tiền tố `NEXT_PUBLIC_` cho các khóa bí mật.

Sau khi thay đổi biến môi trường trên Vercel, cần tạo deployment mới để ứng dụng nhận cấu hình.

## Cài đặt và chạy local

Cài dependencies đúng theo lockfile:

```bash
corepack enable
pnpm install --frozen-lockfile
```

Tạo file `.env.local` và điền các biến môi trường cần thiết, sau đó chạy:

```bash
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Kiểm tra mã nguồn

Các script hiện được khai báo trong `package.json`:

```bash
pnpm typecheck
pnpm build
```

Hoặc chạy lần lượt cả hai bước bằng:

```bash
pnpm check
```

Dự án hiện chưa khai báo script `test` riêng trong `package.json`.

## Triển khai lên Vercel

1. Kết nối repository `hoangnd675/wedding-invitation` với Vercel.
2. Chọn nhánh production là `main` và thư mục gốc của dự án là repository root.
3. Cấu hình đầy đủ các biến môi trường trong Vercel.
4. Đảm bảo cấu hình Supabase và các bucket Storage cần thiết đã sẵn sàng.
5. Đẩy commit lên nhánh `main`; Vercel sẽ tạo deployment theo cấu hình Git Integration.
6. Theo dõi trạng thái build và deployment trong Vercel. Chỉ coi là triển khai thành công khi deployment có trạng thái **Ready**.

## Cấu trúc thư mục

```text
app/
  api/                  API đăng nhập, RSVP, cấu hình và dữ liệu
  config/               Trang quản trị, đăng nhập tích hợp
  demo/                 Trang xem trước và thử nghiệm
  thiep/[slug]/         Thiệp cưới theo slug
components/
  admin/                Thành phần giao diện quản trị
  ui/                   Thành phần giao diện dùng chung
  wedding/              Các phần giao diện thiệp cưới
lib/
  admin-session.ts      Tạo và xác thực phiên quản trị
  couple-server.ts      Kết nối dữ liệu Supabase phía máy chủ
  vietnamese-lunar.ts   Tính ngày âm lịch Việt Nam
  wedding-data.ts       Kiểu dữ liệu và cấu hình mặc định
  wedding-fonts.ts      Danh sách phông chữ thiệp
  wedding-store.ts      Quản lý và đồng bộ dữ liệu thiệp
public/
  music/                Nhạc nền có sẵn
  photos/               Ảnh minh họa mặc định
```

## Bảo mật

- Mật khẩu quản trị và các khóa bí mật chỉ được đọc ở phía máy chủ.
- Phiên quản trị được ký bằng HMAC-SHA256, kiểm tra chữ ký an toàn và hết hạn sau 30 phút.
- Nếu thiếu `ADMIN_SESSION_SECRET`, hệ thống không chấp nhận phiên quản trị.
- API quản trị phải xác thực phiên trước khi thực hiện thao tác được bảo vệ.
- Không chia sẻ mật khẩu quản trị, cookie phiên hoặc giá trị biến môi trường.

## Đóng góp và cập nhật

Mã nguồn chính thức: [github.com/hoangnd675/wedding-invitation](https://github.com/hoangnd675/wedding-invitation).

Trước khi tạo commit, nên chạy `pnpm typecheck` và `pnpm build`. Không xóa ảnh, nhạc hoặc tài nguyên trong `public/` khi chưa kiểm tra các tham chiếu trong mã nguồn.
