import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

// Khởi tạo kết nối Supabase
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, attendanceStatus, guestCount, wishes } = body;

    // 1. Lưu vào Database
    const { error: dbError } = await supabaseAdmin.from('rsvps').insert([
      { full_name: fullName, email, phone, attendance_status: attendanceStatus, guest_count: guestCount, wishes }
    ]);
    if (dbError) throw dbError;

    // 2. Lấy dữ liệu & Tạo file Excel
    const { data: allRsvps } = await supabaseAdmin.from('rsvps').select('*').order('created_at', { ascending: true });
    
    const excelData = allRsvps!.map((item, index) => ({
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'RSVP');
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // 3. Lưu file Excel lên Supabase Storage
    await supabaseAdmin.storage.from('rsvp-exports').upload('danh-sach-xac-nhan.xlsx', excelBuffer, {
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      upsert: true, // Ghi đè file cũ
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
