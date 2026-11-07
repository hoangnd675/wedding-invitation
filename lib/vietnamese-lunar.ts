/**
 * Vietnamese lunar calendar conversion using astronomical new moons
 * and solar longitude, with Vietnam's UTC+7 time zone.
 */
const TIME_ZONE = 7
const PI = Math.PI

function julianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y
    + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
  if (jd < 2299161) {
    jd = day + Math.floor((153 * m + 2) / 5) + 365 * y
      + Math.floor(y / 4) - 32083
  }
  return jd
}

function newMoonDay(k: number): number {
  const t = k / 1236.85
  const t2 = t * t
  const t3 = t2 * t
  const dr = PI / 180
  let jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * t2 - 0.000000155 * t3
  jd1 += 0.00033 * Math.sin((166.56 + 132.87 * t - 0.009173 * t2) * dr)
  const m = 359.2242 + 29.10535608 * k - 0.0000333 * t2 - 0.00000347 * t3
  const mPrime = 306.0253 + 385.81691806 * k + 0.0107306 * t2 + 0.00001236 * t3
  const f = 21.2964 + 390.67050646 * k - 0.0016528 * t2 - 0.00000239 * t3
  let correction = (0.1734 - 0.000393 * t) * Math.sin(m * dr) + 0.0021 * Math.sin(2 * dr * m)
  correction -= 0.4068 * Math.sin(mPrime * dr) + 0.0161 * Math.sin(2 * dr * mPrime)
  correction -= 0.0004 * Math.sin(3 * dr * mPrime)
  correction += 0.0104 * Math.sin(2 * dr * f) - 0.0051 * Math.sin(dr * (m + mPrime))
  correction -= 0.0074 * Math.sin(dr * (m - mPrime)) + 0.0004 * Math.sin(dr * (2 * f + m))
  correction -= 0.0004 * Math.sin(dr * (2 * f - m)) - 0.0006 * Math.sin(dr * (2 * f + mPrime))
  correction += 0.001 * Math.sin(dr * (2 * f - mPrime)) + 0.0005 * Math.sin(dr * (2 * mPrime + m))
  const deltaT = t < -11
    ? 0.001 + 0.000839 * t + 0.0002261 * t2 - 0.00000845 * t3 - 0.000000081 * t * t3
    : -0.000278 + 0.000265 * t + 0.000262 * t2
  return Math.floor(jd1 + correction - deltaT + 0.5 + TIME_ZONE / 24)
}

function sunLongitudeSector(dayNumber: number): number {
  const t = (dayNumber - 2451545.5 - TIME_ZONE / 24) / 36525
  const t2 = t * t
  const dr = PI / 180
  const m = 357.5291 + 35999.0503 * t - 0.0001559 * t2 - 0.00000048 * t * t2
  const l0 = 280.46645 + 36000.76983 * t + 0.0003032 * t2
  let delta = (1.9146 - 0.004817 * t - 0.000014 * t2) * Math.sin(dr * m)
  delta += (0.019993 - 0.000101 * t) * Math.sin(2 * dr * m) + 0.00029 * Math.sin(3 * dr * m)
  let longitude = (l0 + delta) * dr
  longitude -= 2 * PI * Math.floor(longitude / (2 * PI))
  return Math.floor(longitude / (PI / 6))
}

function lunarMonth11(year: number): number {
  const k = Math.floor((julianDayNumber(year, 12, 31) - 2415021) / 29.530588853)
  let day = newMoonDay(k)
  if (sunLongitudeSector(day) >= 9) day = newMoonDay(k - 1)
  return day
}

function leapMonthOffset(a11: number): number {
  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853)
  let last = 0
  let i = 1
  let arc = sunLongitudeSector(newMoonDay(k + i))
  do {
    last = arc
    i += 1
    arc = sunLongitudeSector(newMoonDay(k + i))
  } while (arc !== last && i < 14)
  return i - 1
}

export interface VietnameseLunarDate {
  day: number
  month: number
  year: number
  isLeapMonth: boolean
}

export function convertSolarToVietnameseLunar(isoDate: string): VietnameseLunarDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate || '')
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null

  const dayNumber = julianDayNumber(year, month, day)
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853)
  let monthStart = newMoonDay(k + 1)
  if (monthStart > dayNumber) monthStart = newMoonDay(k)
  let a11 = lunarMonth11(year)
  let b11 = a11
  let lunarYear = year
  if (a11 >= monthStart) {
    a11 = lunarMonth11(year - 1)
  } else {
    lunarYear = year + 1
    b11 = lunarMonth11(year + 1)
  }

  const lunarDay = dayNumber - monthStart + 1
  const diff = Math.floor((monthStart - a11) / 29)
  let lunarMonth = diff + 11
  let isLeapMonth = false
  if (b11 - a11 > 365) {
    const leapDiff = leapMonthOffset(a11)
    if (diff >= leapDiff) {
      lunarMonth = diff + 10
      isLeapMonth = diff === leapDiff
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1
  return { day: lunarDay, month: lunarMonth, year: lunarYear, isLeapMonth }
}

export function formatVietnameseLunarDate(isoDate: string): string {
  const lunar = convertSolarToVietnameseLunar(isoDate)
  if (!lunar) return ''
  const heavenlyStems = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý']
  const earthlyBranches = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi']
  const canChiYear = heavenlyStems[(lunar.year + 6) % 10] + ' ' + earthlyBranches[(lunar.year + 8) % 12]
  const leapLabel = lunar.isLeapMonth ? ' nhuận' : ''
  return 'Nhằm ngày ' + lunar.day + ' tháng ' + lunar.month + leapLabel + ' năm ' + canChiYear + ' (Âm lịch)'
}
