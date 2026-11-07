/** Vietnamese lunar date conversion for Vietnam (UTC+7). */
const PI = Math.PI;
const TZ = 7;
function jd(d: number, m: number, y: number): number {
  const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
  let v = d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
  if (v < 2299161) v = d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - 32083;
  return v;
}
function newMoon(k: number): number {
  const t = k / 1236.85, t2 = t * t, t3 = t2 * t, dr = PI / 180;
  let v = 2415020.75933 + 29.53058868 * k + 0.0001178 * t2 - 0.000000155 * t3;
  v += 0.00033 * Math.sin((166.56 + 132.87 * t - 0.009173 * t2) * dr);
  const m = 359.2242 + 29.10535608 * k - 0.0000333 * t2 - 0.00000347 * t3;
  const mp = 306.0253 + 385.81691806 * k + 0.0107306 * t2 + 0.00001236 * t3;
  const f = 21.2964 + 390.67050646 * k - 0.0016528 * t2 - 0.00000239 * t3;
  const c = (0.1734 - 0.000393 * t) * Math.sin(m * dr) + 0.0021 * Math.sin(2 * m * dr)
    - 0.4068 * Math.sin(mp * dr) + 0.0161 * Math.sin(2 * mp * dr) - 0.0004 * Math.sin(3 * mp * dr)
    + 0.0104 * Math.sin(2 * f * dr) - 0.0051 * Math.sin((m + mp) * dr) - 0.0074 * Math.sin((m - mp) * dr)
    + 0.0004 * Math.sin((2 * f + m) * dr) - 0.0004 * Math.sin((2 * f - m) * dr)
    - 0.0006 * Math.sin((2 * f + mp) * dr) + 0.0010 * Math.sin((2 * f - mp) * dr)
    + 0.0005 * Math.sin((2 * mp + m) * dr);
  const dt = t < -11 ? 0.001 + 0.000839 * t + 0.0002261 * t2 - 0.00000845 * t3 - 0.000000081 * t * t3 : -0.000278 + 0.000265 * t + 0.000262 * t2;
  return v + c - dt;
}
function newMoonDay(k: number): number { return Math.floor(newMoon(k) + 0.5 + TZ / 24); }
function sunSector(day: number): number {
  const t = (day - 2451545.5 - TZ / 24) / 36525, t2 = t * t, dr = PI / 180;
  const m = 357.52910 + 35999.05030 * t - 0.0001559 * t2 - 0.00000048 * t * t2;
  const l0 = 280.46645 + 36000.76983 * t + 0.0003032 * t2;
  const dl = (1.914600 - 0.004817 * t - 0.000014 * t2) * Math.sin(dr * m) + (0.019993 - 0.000101 * t) * Math.sin(2 * dr * m) + 0.000290 * Math.sin(3 * dr * m);
  let longitude = (l0 + dl) * dr;
  longitude -= 2 * PI * Math.floor(longitude / (2 * PI));
  return Math.floor(longitude / PI * 6);
}
function month11(year: number): number {
  const k = Math.floor((jd(31, 12, year) - 2415021) / 29.530588853);
  let nm = newMoonDay(k);
  if (sunSector(nm) >= 9) nm = newMoonDay(k - 1);
  return nm;
}
function leapOffset(a11: number): number {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0, i = 1, arc = sunSector(newMoonDay(k + i));
  do { last = arc; i += 1; arc = sunSector(newMoonDay(k + i)); } while (arc !== last && i < 14);
  return i - 1;
}
export interface VietnameseLunarDate { day: number; month: number; year: number; leap: boolean; yearName: string }
export function solarToVietnameseLunar(value: string): VietnameseLunarDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null;
  const dayNumber = jd(day, month, year), k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let start = newMoonDay(k + 1);
  if (start > dayNumber) start = newMoonDay(k);
  let a11 = month11(year), b11 = a11, lunarYear: number;
  if (a11 >= start) { lunarYear = year; a11 = month11(year - 1); }
  else { lunarYear = year + 1; b11 = month11(year + 1); }
  const lunarDay = dayNumber - start + 1, diff = Math.floor((start - a11) / 29);
  let lunarMonth = diff + 11, leap = false;
  if (b11 - a11 > 365) { const leapDiff = leapOffset(a11); if (diff >= leapDiff) { lunarMonth = diff + 10; if (diff === leapDiff) leap = true; } }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
  const can = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const chi = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  return { day: lunarDay, month: lunarMonth, year: lunarYear, leap, yearName: `${can[(lunarYear + 6) % 10]} ${chi[(lunarYear + 8) % 12]}` };
}
export function getVietnameseLunarDateText(value: string): string {
  const lunar = solarToVietnameseLunar(value);
  return lunar ? `Nhằm ngày ${lunar.day} tháng ${lunar.month}${lunar.leap ? ' nhuận' : ''} năm ${lunar.yearName} (Âm lịch)` : '';
}
