import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';
import { Resend } from 'resend';

// Khởi tạo Supabase Client với Service Role Key để có quyền ghi Storage
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, attendanceStatus, guestCount, wishes } = body;

    // 1. Lưu thông tin vào Database Supabase
    const { data: rsvpData, error: dbError } = await supabaseAdmin
      .from('rsvps')
      .insert([
        {
          full_name: fullName,
          email: email,
          phone: phone,
          attendance_status: attendanceStatus,
          guest_count: guestCount,
          wishes: wishes,
        },
      ])
      .select();

    if (dbError) throw dbError;

    // 2. Lấy toàn bộ danh sách RSVP để cập nhật lại File Excel
    const { data: allRsvps, error: fetchError } = await supabaseAdmin
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: true });

    if (fetchError) throw fetchError;

    // 3. Định dạng dữ liệu và Tạo file Excel bằng thư viện 'xlsx'
    const excelData = allRsvps.map((item, index) => ({
      'STT': index + 1,
      'Thời gian': new Date(item.created_at).toLocaleString('vi-VN'),
      'Họ và Tên': item.full_name,
      'Email': item.email,
      'Số điện thoại': item.phone || '',
      'Trạng thái': item.attendance_status === 'attending' ? 'Tham dự' : 'Không tham dự',
      'Số người': item.guest_count,
      'Lời chúc': item.wishes || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách RSVP');

    // Chuyển đổi Workbook sang Buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // 4. Upload / Ghi đè file Excel lên Supabase Storage Bucket
    const fileName = 'danh-sach-xac-nhan.xlsx';
    const { error: uploadError } = await supabaseAdmin.storage
      .from('rsvp-exports')
      .upload(fileName, excelBuffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        upsert: true, // Cho phép ghi đè file cũ
      });

    if (uploadError) throw uploadError;

    // 5. Gửi email xác nhận cho người dùng (qua Resend)
    if (email) {
      await resend.emails.send({
        from: 'Đám Cưới <onboarding@resend.dev>', // Thay bằng domain của bạn khi hoàn thiện
        to: email,
        subject: 'Cảm ơn bạn đã xác nhận tham dự lễ cưới!',
        html: `
          <h3>Xin chào ${fullName},</h3>
          <p>Cảm ơn bạn đã gửi thông tin xác nhận tham dự đám cưới của chúng mình.</p>
          <p><strong>Thông tin xác nhận của bạn:</strong></p>
          <ul>
            <li><strong>Trạng thái:</strong> ${attendanceStatus === 'attending' ? 'Tham dự' : 'Rất tiếc không thể tham dự'}</li>
            <li><strong>Đi kèm:</strong> ${guestCount} người</li>
          </ul>
          <p>Rất hân hạnh được đón tiếp bạn!</p>
        `,
      });
    }

    return NextResponse.json({ success: true, message: 'Gửi xác nhận thành công!' });
  } catch (error: any) {
    console.error('Lỗi xử lý RSVP:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Đã có lỗi xảy ra.' },
      { status: 500 }
    );
  }
}
