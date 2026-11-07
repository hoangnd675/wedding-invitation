export type ThemeId =
  | 'songhy'
  | 'thiep'
  | 'serenity'
  | 'lavender'
  | 'summer'
  | 'hoangkim'
  | 'tapchi'
  | 'vuonhoa'
  | 'demsao'
  | 'sen'
  | 'maidao'
  | 'bienxanh'
  | 'hue'
  | 'tinhkhoi'

export type ParticleEffectType =
  | 'auto'
  | 'songhy'
  | 'hearts'
  | 'petals'
  | 'blossoms'
  | 'sparkles'
  | 'leaves'
  | 'stars'
  | 'bubbles'
  | 'snow'
  | 'none'

export type PhotoScrollEffect =
  | 'fade-in'
  | 'slide-up'
  | 'zoom-in'
  | 'blur-clear'
  | 'tilt-rotate'

export interface ThemeConfig {
  id: ThemeId
  name: string
  subtitle: string
  demoUrl: string
  badge: string
  isDark?: boolean
  colors: {
    accent: string
    accentInk: string
    accent2: string
    gold: string
    soft: string
    ink: string
    muted: string
    page: string
    paper: string
    line: string
    navBg: string
    navInk: string
  }
  fonts: {
    head: string
    name: string
    body: string
    ui: string
    nameStyle?: 'normal' | 'italic'
  }
  defaultEffect: Exclude<ParticleEffectType, 'auto' | 'none'>
  heroStyle:
    | 'songhy-lantern'
    | 'thiep-fullscreen'
    | 'classic-polaroid'
    | 'hoangkim-royal'
    | 'tapchi-editorial'
    | 'vuonhoa-arch'
    | 'demsao-celestial'
    | 'sen-lotus'
    | 'maidao-scroll'
    | 'bienxanh-ocean'
    | 'hue-bridge'
    | 'tinhkhoi-minimal'
}

export const WEDDING_THEMES: ThemeConfig[] = [
  {
    id: 'songhy',
    name: 'Song Hỷ',
    subtitle: 'Đỏ son & vàng truyền thống, đèn lồng, chữ Song Hỷ',
    demoUrl: 'https://demo-songhy.thiep.site/',
    badge: 'Truyền thống',
    colors: {
      accent: '#b3261e',
      accentInk: '#a51f17',
      accent2: '#e2b865',
      gold: '#e2b865',
      soft: '#f6e9d2',
      ink: '#3a1a12',
      muted: '#6e4c3e',
      page: '#fbf4e6',
      paper: '#fffaf0',
      line: '#ead8b8',
      navBg: '#85170f',
      navInk: '#f7e3b5',
    },
    fonts: {
      head: 'var(--font-cinzel), serif',
      name: 'var(--font-great-vibes), cursive',
      body: 'var(--font-cormorant), serif',
      ui: 'var(--font-quicksand), sans-serif',
      nameStyle: 'normal',
    },
    defaultEffect: 'songhy',
    heroStyle: 'songhy-lantern',
  },
  {
    id: 'thiep',
    name: 'Thiệp Hồng',
    subtitle: 'Ảnh tràn màn hình, chữ viết tay lãng mạn',
    demoUrl: 'https://demo-thiep.thiep.site/',
    badge: 'Phổ biến',
    colors: {
      accent: '#e7746f',
      accentInk: '#b8423d',
      accent2: '#f3b6ae',
      gold: '#d4956a',
      soft: '#fdf1ef',
      ink: '#3b3333',
      muted: '#766b6b',
      page: '#fffaf8',
      paper: '#ffffff',
      line: '#f2dcd8',
      navBg: '#ffffff',
      navInk: '#3b3333',
    },
    fonts: {
      head: 'var(--font-allura), serif',
      name: 'var(--font-allura), cursive',
      body: 'var(--font-lora), serif',
      ui: 'var(--font-quicksand), sans-serif',
      nameStyle: 'normal',
    },
    defaultEffect: 'hearts',
    heroStyle: 'thiep-fullscreen',
  },
  {
    id: 'serenity',
    name: 'Serenity (Bạc Hà)',
    subtitle: 'Xanh bạc hà thanh mát, khung ảnh nghiêng cổ điển',
    demoUrl: 'https://demo-serenity.thiep.site/',
    badge: 'Thanh lịch',
    colors: {
      accent: '#6fae95',
      accentInk: '#3f7a64',
      accent2: '#91c0c7',
      gold: '#8ab89f',
      soft: '#e8f7f1',
      ink: '#423629',
      muted: '#756b62',
      page: '#f6fbf8',
      paper: '#ffffff',
      line: '#d6ebe1',
      navBg: '#423629',
      navInk: '#ffffff',
    },
    fonts: {
      head: 'var(--font-bodoni), serif',
      name: 'var(--font-allura), cursive',
      body: 'var(--font-lora), serif',
      ui: 'var(--font-quicksand), sans-serif',
      nameStyle: 'normal',
    },
    defaultEffect: 'leaves',
    heroStyle: 'classic-polaroid',
  },
  {
    id: 'lavender',
    name: 'Lavender (Oải Hương)',
    subtitle: 'Tím hồng oải hương mộng mơ & dịu dàng',
    demoUrl: 'https://demo-lavender.thiep.site/',
    badge: 'Lãng mạn',
    colors: {
      accent: '#c77aab',
      accentInk: '#a44a82',
      accent2: '#b6bad6',
      gold: '#cca0be',
      soft: '#fbf0f7',
      ink: '#5d6180',
      muted: '#666b88',
      page: '#fdf8fb',
      paper: '#ffffff',
      line: '#eedceb',
      navBg: '#9ea3c9',
      navInk: '#ffffff',
    },
    fonts: {
      head: 'var(--font-cormorant), serif',
      name: 'var(--font-allura), cursive',
      body: 'var(--font-cormorant), serif',
      ui: 'var(--font-quicksand), sans-serif',
      nameStyle: 'normal',
    },
    defaultEffect: 'petals',
    heroStyle: 'classic-polaroid',
  },
  {
    id: 'summer',
    name: 'Summer (Hoàng Hôn)',
    subtitle: 'Cam nắng hoàng hôn ấm áp & rực rỡ',
    demoUrl: 'https://demo-summer.thiep.site/',
    badge: 'Ấm áp',
    colors: {
      accent: '#ec7a63',
      accentInk: '#b4503a',
      accent2: '#f5b86b',
      gold: '#f5b86b',
      soft: '#fff8df',
      ink: '#7b3e24',
      muted: '#8b6958',
      page: '#fffdf3',
      paper: '#ffffff',
      line: '#f5e4c3',
      navBg: '#ec8b67',
      navInk: '#ffffff',
    },
    fonts: {
      head: 'var(--font-marcellus), serif',
      name: 'var(--font-dancing), cursive',
      body: 'var(--font-lora), serif',
      ui: 'var(--font-quicksand), sans-serif',
      nameStyle: 'normal',
    },
    defaultEffect: 'sparkles',
    heroStyle: 'classic-polaroid',
  },
  {
    id: 'hoangkim',
    name: 'Hoàng Kim',
    subtitle: 'Ngà & vàng champagne, huy hiệu nguyệt quế, ánh kim',
    demoUrl: 'https://demo-hoangkim.thiep.site/',
    badge: 'Sang trọng',
    colors: {
      accent: '#8f6d33',
      accentInk: '#7a5a24',
      accent2: '#d9c49a',
      gold: '#b8964f',
      soft: '#f1eadc',
      ink: '#2b2721',
      muted: '#6b6255',
      page: '#f8f4ec',
      paper: '#fffdf8',
      line: '#e6dcc6',
      navBg: '#f8f4ec',
      navInk: '#2b2721',
    },
    fonts: {
      head: 'var(--font-cinzel), serif',
      name: 'var(--font-allura), cursive',
      body: 'var(--font-cormorant), serif',
      ui: 'var(--font-quicksand), sans-serif',
      nameStyle: 'normal',
    },
    defaultEffect: 'sparkles',
    heroStyle: 'hoangkim-royal',
  },
  {
    id: 'tapchi',
    name: 'Tạp Chí (Editorial)',
    subtitle: 'Đen trắng tối giản kiểu tạp chí thời trang cao cấp',
    demoUrl: 'https://demo-tapchi.thiep.site/',
    badge: 'Hiện đại',
    colors: {
      accent: '#1c1c1c',
      accentInk: '#161514',
      accent2: '#b8b2a6',
      gold: '#8c857B',
      soft: '#ebe8e1',
      ink: '#161514',
      muted: '#5d5a54',
      page: '#f6f5f1',
      paper: '#ffffff',
      line: '#d9d6ce',
      navBg: '#f6f5f1',
      navInk: '#161514',
    },
    fonts: {
      head: 'var(--font-bodoni), serif',
      name: 'var(--font-bodoni), cursive',
      body: 'var(--font-quicksand), serif',
      ui: 'var(--font-quicksand), sans-serif',
      nameStyle: 'normal',
    },
    defaultEffect: 'sparkles',
    heroStyle: 'tapchi-editorial',
  },
  {
    id: 'vuonhoa',
    name: 'Vườn Hoa (Botanical)',
    subtitle: 'Xanh olive & kem, khung vòm cành lá vẽ tay',
    demoUrl: 'https://demo-vuonhoa.thiep.site/',
    badge: 'Thiên nhiên',
    colors: {
      accent: '#5c6b3a',
      accentInk: '#47542b',
      accent2: '#a8b58a',
      gold: '#b59e6b',
      soft: '#e9e7d8',
      ink: '#2e3a28',
      muted: '#5b6651',
      page: '#f5f2e8',
      paper: '#fbf9f2',
      line: '#dcdcc6',
      navBg: '#f5f2e8',
      navInk: '#2e3a28',
    },
    fonts: {
      head: 'var(--font-cormorant), serif',
      name: 'var(--font-allura), cursive',
      body: 'var(--font-lora), serif',
      ui: 'var(--font-quicksand), sans-serif',
      nameStyle: 'normal',
    },
    defaultEffect: 'leaves',
    heroStyle: 'vuonhoa-arch',
  },
  {
    id: 'demsao',
    name: 'Đêm Sao (Starry Night)',
    subtitle: 'Xanh đêm huyền ảo, trời sao lấp lánh & trăng khuyết',
    demoUrl: 'https://demo-demsao.thiep.site/',
    badge: 'Huyền ảo',
    isDark: true,
    colors: {
      accent: '#d8b56a',
      accentInk: '#c49c48',
      accent2: '#8e9bd6',
      gold: '#d8b56a',
      soft: '#18234d',
      ink: '#f3ecdc',
      muted: '#bcbad0',
      page: '#0d1530',
      paper: '#141d40',
      line: '#2c3766',
      navBg: '#0a1128',
      navInk: '#f3ecdc',
    },
    fonts: {
      head: 'var(--font-cinzel), serif',
      name: 'var(--font-great-vibes), cursive',
      body: 'var(--font-playfair), serif',
      ui: 'var(--font-quicksand), sans-serif',
      nameStyle: 'normal',
    },
    defaultEffect: 'stars',
    heroStyle: 'demsao-celestial',
  },
  {
    id: 'sen',
    name: 'Sen Hồng',
    subtitle: 'Đầm sen mùa hạ, hồng cánh sen & lá sen xanh ngọc',
    demoUrl: 'https://demo-sen.thiep.site/',
    badge: 'Việt Nam',
    colors: {
      accent: '#a83f62',
      accentInk: '#8e3352',
      accent2: '#ecbfcc',
      gold: '#c79a4b',
      soft: '#f7e9ec',
      ink: '#3a272c',
      muted: '#6c565b',
      page: '#fcf8f2',
      paper: '#fffdf9',
      line: '#ecdcd8',
      navBg: '#fcf8f2',
      navInk: '#3a272c',
    },
    fonts: {
      head: 'var(--font-cormorant), serif',
      name: 'var(--font-dancing), cursive',
      body: 'var(--font-cormorant), serif',
      ui: 'var(--font-quicksand), sans-serif',
      nameStyle: 'normal',
    },
    defaultEffect: 'petals',
    heroStyle: 'sen-lotus',
  },
  {
    id: 'maidao',
    name: 'Mai Đào (Sắc Xuân)',
    subtitle: 'Đào hồng & mai vàng ngày xuân, tranh treo câu đối',
    demoUrl: 'https://demo-maidao.thiep.site/',
    badge: 'Mùa xuân',
    colors: {
      accent: '#b8365c',
      accentInk: '#9e294b',
      accent2: '#f2b8c6',
      gold: '#e3a21a',
      soft: '#fbeee4',
      ink: '#2b1f1b',
      muted: '#6d5a50',
      page: '#fffaf1',
      paper: '#fffdf8',
      line: '#efdccf',
      navBg: '#fffaf1',
      navInk: '#2b1f1b',
    },
    fonts: {
      head: 'var(--font-marcellus), serif',
      name: 'var(--font-great-vibes), cursive',
      body: 'var(--font-lora), serif',
      ui: 'var(--font-quicksand), sans-serif',
      nameStyle: 'normal',
    },
    defaultEffect: 'blossoms',
    heroStyle: 'maidao-scroll',
  },
  {
    id: 'bienxanh',
    name: 'Biển Xanh',
    subtitle: 'Bình minh biển xanh ngọc, mặt trời san hô & sóng vỗ',
    demoUrl: 'https://demo-bienxanh.thiep.site/',
    badge: 'Biển đảo',
    colors: {
      accent: '#0e676d',
      accentInk: '#0b5156',
      accent2: '#8fd0c9',
      gold: '#f08a6c',
      soft: '#dff0ee',
      ink: '#10313b',
      muted: '#4d6267',
      page: '#f6f2ea',
      paper: '#ffffff',
      line: '#dde7e3',
      navBg: '#f6f2ea',
      navInk: '#10313b',
    },
    fonts: {
      head: 'var(--font-marcellus), serif',
      name: 'var(--font-allura), cursive',
      body: 'var(--font-lora), serif',
      ui: 'var(--font-quicksand), sans-serif',
      nameStyle: 'normal',
    },
    defaultEffect: 'bubbles',
    heroStyle: 'bienxanh-ocean',
  },
  {
    id: 'hue',
    name: 'Tím Huế',
    subtitle: 'Sông Hương mờ sương, cầu Trường Tiền & tím cung đình',
    demoUrl: 'https://demo-hue.thiep.site/',
    badge: 'Cố đô',
    colors: {
      accent: '#5d2f6b',
      accentInk: '#4a2756',
      accent2: '#c6a7cf',
      gold: '#b8954e',
      soft: '#efe5f0',
      ink: '#2c1d33',
      muted: '#69566f',
      page: '#f6f1f6',
      paper: '#fffcff',
      line: '#e4d6e6',
      navBg: '#f6f1f6',
      navInk: '#2c1d33',
    },
    fonts: {
      head: 'var(--font-cormorant), serif',
      name: 'var(--font-allura), cursive',
      body: 'var(--font-cormorant), serif',
      ui: 'var(--font-quicksand), sans-serif',
      nameStyle: 'normal',
    },
    defaultEffect: 'petals',
    heroStyle: 'hue-bridge',
  },
  {
    id: 'tinhkhoi',
    name: 'Tinh Khôi',
    subtitle: 'Trắng kem & nâu trầm phong cách Hàn Quốc tối giản',
    demoUrl: 'https://demo-tinhkhoi.thiep.site/',
    badge: 'Tối giản',
    colors: {
      accent: '#7d5546',
      accentInk: '#664336',
      accent2: '#d9c7b8',
      gold: '#cf8d84',
      soft: '#f0ebe3',
      ink: '#34302c',
      muted: '#5e5852',
      page: '#faf8f4',
      paper: '#ffffff',
      line: '#e8e1d7',
      navBg: '#faf8f4',
      navInk: '#34302c',
    },
    fonts: {
      head: 'var(--font-bodoni), serif',
      name: 'var(--font-allura), cursive',
      body: 'var(--font-lora), serif',
      ui: 'var(--font-quicksand), sans-serif',
      nameStyle: 'normal',
    },
    defaultEffect: 'snow',
    heroStyle: 'tinhkhoi-minimal',
  },
]

export interface MusicTrack {
  id: string
  title: string
  artist: string
  src: string
  mood: string
}

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'beautiful-in-white',
    title: 'Beautiful In White',
    artist: 'Wedding Music',
    src: '/music/beautiful-in-white.mp3',
    mood: 'Lãng mạn kinh điển',
  },
  {
    id: 'my-love',
    title: 'My Love',
    artist: 'Wedding Music',
    src: '/music/my-love.mp3',
    mood: 'Trang trọng & cổ điển',
  },
  {
    id: 'a-thousand-years',
    title: 'A Thousand Years',
    artist: 'Wedding Music',
    src: '/music/a-thousand-years.wav',
    mood: 'Ngọt ngào & sâu lắng',
  },
  {
    id: 'proud-of-you',
    title: 'Proud Of You',
    artist: 'Wedding Music',
    src: '/music/proud-of-you.mp3',
    mood: 'Huyền ảo & mộng mơ',
  },
  {
    id: 'nothing-is-gonna-change-my-love-for-you',
    title: 'Nothing is Gonna Change My Love For You',
    artist: 'Wedding Music',
    src: '/music/nothing-is-gonna-change-my-love-for-you.mp3',
    mood: 'Huyền ảo & mộng mơ',
  },
  {
    id: 'i-do',
    title: 'I Do',
    artist: '911',
    src: '/music/i-do.mp3',
    mood: 'Huyền ảo & mộng mơ',
  },
  {
    id: 'love-paradise',
    title: 'Love Paradise',
    artist: 'Wedding Music',
    src: '/music/love-paradise.mp3',
    mood: 'Huyền ảo & mộng mơ',
  },
]

export interface StoryMilestone {
  id: string
  year: string
  title: string
  description: string
}

export interface VenueEvent {
  id: string
  title: string
  place: string
  address: string
  timeText: string
  mapQuery: string
  icsStart: string
  icsEnd: string
}

export interface AlbumPhoto {
  id: string
  src: string
  caption: string
  effect: PhotoScrollEffect
}

export interface WeddingWish {
  id: string
  name: string
  message: string
  createdAt: string
  relationship?: string
}

export interface RsvpSubmission {
  id: string
  name: string
  attending: 'yes' | 'no'
  guests: number
  phone: string
  side: 'groom' | 'bride'
  message: string
  createdAt: string
}

export interface SharedGuestPhoto {
  id: string
  guestName: string
  caption: string
  src: string
  createdAt: string
}

export interface BankGiftInfo {
  sideLabel: string
  accountHolder: string
  bankName: string
  bankCode: string
  accountNumber: string
  transferNote: string
}

export interface WeddingInvitationData {
  themeId: ThemeId
  particleEffect: ParticleEffectType
  musicSrc: string
  musicTitle: string
  autoPlayOnOpen: boolean
  envelopeEyebrow: string
  heroEyebrow: string
  groomShortName: string
  brideShortName: string
  groomFullName: string
  brideFullName: string
  groomFamilyInfo: string
  brideFamilyInfo: string
  weddingDate: string // YYYY-MM-DD
  weddingTime: string // HH:mm
  weddingDateDisplay: string // 20.12.2026
  lunarDateText: string
  ceremonyIntroText: string
  heroMainPhoto: string
  heroLeftPhoto: string
  heroRightPhoto: string
  groomPhoto: string
  bridePhoto: string
  ceremonyPhoto: string
  quotePhoto: string
  quoteText: string
  footerText: string
  stories: StoryMilestone[]
  venues: VenueEvent[]
  album: AlbumPhoto[]
  wishes: WeddingWish[]
  rsvps: RsvpSubmission[]
  sharedPhotos: SharedGuestPhoto[]
  groomGift: BankGiftInfo
  brideGift: BankGiftInfo
}

export const DEFAULT_WEDDING_DATA: WeddingInvitationData = {
  themeId: 'songhy',
  particleEffect: 'auto',
  musicSrc: '/music/beautiful-in-white.mp3',
  musicTitle: 'Beautiful In White -- Shane Filan',
  autoPlayOnOpen: true,
  envelopeEyebrow: 'THIỆP MỜI CƯỚI',
  heroEyebrow: 'Chúng mình về chung một nhà',
  groomShortName: 'Hải Hưng',
  brideShortName: 'Mi Mi',
  groomFullName: 'Nguyễn Hải Hưng',
  brideFullName: 'Trương Thị Mi Mi',
  groomFamilyInfo: 'Con trai Ông Nguyễn Văn Hải & Bà Trần Thị Thu Hương',
  brideFamilyInfo: 'Con gái Ông Trương Minh Đức & Bà Lê Thị Ngọc Lan',
  weddingDate: '2026-12-20',
  weddingTime: '11:00',
  weddingDateDisplay: '20.12.2026',
  lunarDateText: 'Nhằm ngày 12 tháng 11 năm Bính Ngọ (Âm lịch)',
  ceremonyIntroText: 'Trân trọng báo tin lễ thành hôn của hai con chúng tôi',
  heroMainPhoto: '/photos/hero-main.jpg',
  heroLeftPhoto: '/photos/hero-left.jpg',
  heroRightPhoto: '/photos/hero-right.jpg',
  groomPhoto: '/photos/groom.jpg',
  bridePhoto: '/photos/bride.jpg',
  ceremonyPhoto: '/photos/event.jpg',
  quotePhoto: '/photos/quote.jpg',
  quoteText: 'Yêu nhau không phải là nhìn nhau, mà là cùng nhau nhìn về một hướng.',
  footerText: 'Cảm ơn bạn đã đến chung vui cùng chúng mình ♡',
  stories: [
    {
      id: 'st-1',
      year: '2023',
      title: 'Lần đầu gặp gỡ',
      description:
        'Lần đầu gặp nhau giữa một ngày rất bình thường, không ai nghĩ rằng đó là khởi đầu của cả một hành trình.',
    },
    {
      id: 'st-2',
      year: '2024',
      title: 'Thương nhau',
      description:
        'Từ những tin nhắn đầu tiên đến những chuyến đi chung, hai người dần trở thành một phần không thể thiếu của nhau.',
    },
    {
      id: 'st-3',
      year: '2025',
      title: 'Lời cầu hôn',
      description:
        'Lời cầu hôn giản dị mà chân thành -- và một cái gật đầu cho quãng đời còn lại.',
    },
    {
      id: 'st-4',
      year: '2026',
      title: 'Về chung một nhà',
      description:
        'Ngày hai người chính thức về chung một nhà, mở ra chương mới mang tên gia đình.',
    },
  ],
  venues: [
    {
      id: 'ev-1',
      title: 'Lễ vu quy',
      place: 'Nhà gái',
      address: '91 Phạm Văn Đồng, Nhơn Thành, An Nhơn, Bình Định',
      timeText: '11 giờ, Chủ nhật 20/12/2026',
      mapQuery: '91 Phạm Văn Đồng, Nhơn Thành, An Nhơn, Bình Định',
      icsStart: '20261220T040000Z',
      icsEnd: '20261220T080000Z',
    },
    {
      id: 'ev-2',
      title: 'Tiệc cưới',
      place: 'Nhà hàng Sân Thượng',
      address: '16 Lê Quý Đôn, Phường 6, Quận 3, TP.HCM',
      timeText: '18 giờ, Chủ nhật 20/12/2026',
      mapQuery: '16 Lê Quý Đôn, Phường 6, Quận 3, TP.HCM',
      icsStart: '20261220T110000Z',
      icsEnd: '20261220T150000Z',
    },
  ],
  album: [
    { id: 'al-1', src: '/photos/album-01.jpg', caption: 'Khoảnh khắc bình yên bên nhau', effect: 'fade-in' },
    { id: 'al-2', src: '/photos/album-02.jpg', caption: 'Nắm tay nhau đi khắp thế gian', effect: 'slide-up' },
    { id: 'al-3', src: '/photos/album-03.jpg', caption: 'Nụ cười ngày nắng mới', effect: 'zoom-in' },
    { id: 'al-4', src: '/photos/album-04.jpg', caption: 'Ánh mắt trao nhau trọn đời', effect: 'blur-clear' },
    { id: 'al-5', src: '/photos/album-05.jpg', caption: 'Dưới hiên nhà ngập nắng', effect: 'tilt-rotate' },
    { id: 'al-6', src: '/photos/album-06.jpg', caption: 'Hạnh phúc giản đơn', effect: 'fade-in' },
    { id: 'al-7', src: '/photos/album-07.jpg', caption: 'Lời hứa trăm năm', effect: 'slide-up' },
    { id: 'al-8', src: '/photos/album-08.jpg', caption: 'Chiều hoàng hôn dịu dàng', effect: 'zoom-in' },
    { id: 'al-9', src: '/photos/album-09.jpg', caption: 'Tình yêu đơm hoa', effect: 'blur-clear' },
    { id: 'al-10', src: '/photos/album-10.jpg', caption: 'Trọn vẹn từng phút giây', effect: 'tilt-rotate' },
    { id: 'al-11', src: '/photos/album-11.jpg', caption: 'Khởi đầu hành trình mới', effect: 'fade-in' },
    { id: 'al-12', src: '/photos/album-12.jpg', caption: 'Về chung một mái nhà', effect: 'slide-up' },
  ],
  wishes: [
    {
      id: 'w-1',
      name: 'Cô Lan',
      message: 'Chúc hai cháu bách niên giai lão, sắt son trọn đời.',
      createdAt: 'Vừa xong',
    },
    {
      id: 'w-2',
      name: 'Anh Tuấn (đồng nghiệp)',
      message: 'Happy wedding! Chúc hai bạn trăm năm hạnh phúc.',
      createdAt: '10 phút trước',
    },
    {
      id: 'w-3',
      name: 'Hà Phương',
      message: 'Chúc hai bạn mãi hạnh phúc, cùng nhau đi hết quãng đời còn lại!',
      createdAt: '30 phút trước',
    },
    {
      id: 'w-4',
      name: 'Cô chú Lan Hùng',
      message: 'Chúc hai cháu trăm năm hạnh phúc, sớm sinh quý tử nhé!',
      createdAt: '1 giờ trước',
    },
    {
      id: 'w-5',
      name: 'Ông bà Nội',
      message: 'Ông bà mừng cho hai cháu. Sống hòa thuận, thương yêu nhau nhé.',
      createdAt: '2 giờ trước',
    },
    {
      id: 'w-6',
      name: 'Anh chị Tuấn Ngọc',
      message: 'Chúc hai em bên nhau trọn đời, mãi yêu thương như ngày đầu.',
      createdAt: '3 giờ trước',
    },
    {
      id: 'w-7',
      name: 'Bạn Quang Duy',
      message: 'Chúc mừng hạnh phúc hai bạn! Nhất định sẽ có mặt sớm ♡',
      createdAt: '5 giờ trước',
    },
    {
      id: 'w-8',
      name: 'Cô Hoa',
      message: 'Chúc các con bách niên giai lão, sắt son trọn đời.',
      createdAt: '1 ngày trước',
    },
    {
      id: 'w-9',
      name: 'Lan (bạn cô dâu)',
      message: 'Chúc hai bạn trăm năm hạnh phúc, sớm có tin vui nhé! Hôm cưới nhất định mình sẽ đến sớm phụ một tay.',
      createdAt: '2 ngày trước',
    },
  ],
  rsvps: [
    {
      id: 'r-1',
      name: 'Anh Tuấn (đồng nghiệp)',
      attending: 'yes',
      guests: 2,
      phone: '0901234567',
      side: 'groom',
      message: 'Mình sẽ có mặt đúng giờ!',
      createdAt: 'Hôm nay',
    },
    {
      id: 'r-2',
      name: 'Lan (bạn cô dâu)',
      attending: 'yes',
      guests: 1,
      phone: '0987654321',
      side: 'bride',
      message: 'Đến sớm phụ dâu nhé!',
      createdAt: 'Hôm qua',
    },
  ],
  sharedPhotos: [
    {
      id: 'sp-1',
      guestName: 'Hà Phương',
      caption: 'Khoảnh khắc hậu trường siêu đáng yêu của hai bạn!',
      src: '/photos/album-03.jpg',
      createdAt: 'Hôm nay',
    },
    {
      id: 'sp-2',
      guestName: 'Quang Duy',
      caption: 'Chúc mừng chú rể Hải Hưng & cô dâu Mi Mi trăm năm hạnh phúc!',
      src: '/photos/album-06.jpg',
      createdAt: 'Hôm qua',
    },
  ],
  groomGift: {
    sideLabel: 'Nhà trai',
    accountHolder: 'NGUYEN HAI HUNG',
    bankName: 'Vietcombank',
    bankCode: 'VCB',
    accountNumber: '1234567890',
    transferNote: 'Mung cuoi Hai Hung Mi Mi',
  },
  brideGift: {
    sideLabel: 'Nhà gái',
    accountHolder: 'TRUONG THI MI MI',
    bankName: 'Techcombank',
    bankCode: 'TCB',
    accountNumber: '19030000000001',
    transferNote: 'Mung cuoi Hai Hung Mi Mi',
  },
}

export function getThemeById(id: ThemeId): ThemeConfig {
  return WEDDING_THEMES.find((t) => t.id === id) || WEDDING_THEMES[0]
}
