export type MemberClass = 
  | '전사' | '검사' | '마법사' | '궁수' | '성직자' | '음유시인' | '정령사' | '공학자';

export type MemberRole = '레기온장' | '부레기온장' | '파티장' | '공격대원';

export interface Member {
  id: number;
  name: string;
  class: MemberClass;
  level: number;
  role: MemberRole;
  party: 1 | 2;
  gearscore: number;
  joined: string;
  avatar: string; // emoji fallback
}

export interface ScheduleEvent {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  type: 'raid' | 'pvp' | 'siege' | 'gathering' | 'other';
  description: string;
  maxMembers: number;
  signedUp: string[];
}

export interface LegionInfo {
  name: string;
  server: string;
  faction: string;
  level: number;
  founded: string;
  totalMembers: number;
  description: string;
  achievements: string[];
}

// ─── Legion Info ───────────────────────────────────────────────
export const legionInfo: LegionInfo = {
  name: "MVP 레기온",
  server: "카엘루스",
  faction: "에리온",
  level: 8,
  founded: "2025-04-01",
  totalMembers: 24,
  description:
    "아이온2의 정상을 향해 나아가는 2파티 공격대 레기온입니다. " +
    "체계적인 공략과 끈끈한 팀워크로 최강의 레기온을 목표로 합니다.",
  achievements: [
    "천공의 요새 첫 클리어",
    "심연의 균열 전원 생존 클리어",
    "서버 PvP 랭킹 3위",
    "레기온 레벨 8 달성",
  ],
};

// ─── Members ───────────────────────────────────────────────────
export const members: Member[] = [
  // Party 1
  { id: 1,  name: "아이온마스터", class: "전사",   level: 60, role: "레기온장",   party: 1, gearscore: 4850, joined: "2025-04-01", avatar: "⚔️" },
  { id: 2,  name: "천공의검",    class: "검사",   level: 60, role: "부레기온장", party: 1, gearscore: 4720, joined: "2025-04-03", avatar: "🗡️" },
  { id: 3,  name: "성스러운빛",  class: "성직자", level: 60, role: "파티장",     party: 1, gearscore: 4680, joined: "2025-04-05", avatar: "✨" },
  { id: 4,  name: "불꽃마법사",  class: "마법사", level: 60, role: "공격대원",   party: 1, gearscore: 4630, joined: "2025-04-10", avatar: "🔥" },
  { id: 5,  name: "바람의궁수",  class: "궁수",   level: 59, role: "공격대원",   party: 1, gearscore: 4550, joined: "2025-04-15", avatar: "🏹" },
  { id: 6,  name: "대지의정령",  class: "정령사", level: 60, role: "공격대원",   party: 1, gearscore: 4600, joined: "2025-04-20", avatar: "🌿" },
  { id: 7,  name: "강철기계사",  class: "공학자", level: 58, role: "공격대원",   party: 1, gearscore: 4480, joined: "2025-05-01", avatar: "⚙️" },
  { id: 8,  name: "달빛음유",    class: "음유시인",level: 59, role: "공격대원",  party: 1, gearscore: 4510, joined: "2025-05-05", avatar: "🎵" },
  { id: 9,  name: "폭풍전사",    class: "전사",   level: 60, role: "공격대원",   party: 1, gearscore: 4700, joined: "2025-04-08", avatar: "⚡" },
  { id: 10, name: "신성기사",    class: "성직자", level: 60, role: "공격대원",   party: 1, gearscore: 4650, joined: "2025-04-12", avatar: "🛡️" },
  { id: 11, name: "얼음마법",    class: "마법사", level: 59, role: "공격대원",   party: 1, gearscore: 4580, joined: "2025-05-10", avatar: "❄️" },
  { id: 12, name: "독수리눈",    class: "궁수",   level: 58, role: "공격대원",   party: 1, gearscore: 4440, joined: "2025-05-15", avatar: "🦅" },
  // Party 2
  { id: 13, name: "심연의검사",  class: "검사",   level: 60, role: "파티장",     party: 2, gearscore: 4750, joined: "2025-04-02", avatar: "🌑" },
  { id: 14, name: "빛의사제",    class: "성직자", level: 60, role: "공격대원",   party: 2, gearscore: 4670, joined: "2025-04-06", avatar: "💫" },
  { id: 15, name: "번개마법사",  class: "마법사", level: 60, role: "공격대원",   party: 2, gearscore: 4640, joined: "2025-04-11", avatar: "⚡" },
  { id: 16, name: "독화살수",    class: "궁수",   level: 59, role: "공격대원",   party: 2, gearscore: 4520, joined: "2025-04-16", avatar: "🏹" },
  { id: 17, name: "화염정령",    class: "정령사", level: 60, role: "공격대원",   party: 2, gearscore: 4610, joined: "2025-04-21", avatar: "🔥" },
  { id: 18, name: "강철전사",    class: "전사",   level: 60, role: "공격대원",   party: 2, gearscore: 4720, joined: "2025-04-25", avatar: "⚔️" },
  { id: 19, name: "별의음유",    class: "음유시인",level: 59, role: "공격대원",  party: 2, gearscore: 4490, joined: "2025-05-02", avatar: "⭐" },
  { id: 20, name: "증기공학",    class: "공학자", level: 58, role: "공격대원",   party: 2, gearscore: 4460, joined: "2025-05-06", avatar: "🔧" },
  { id: 21, name: "철벽방패",    class: "전사",   level: 60, role: "공격대원",   party: 2, gearscore: 4680, joined: "2025-04-09", avatar: "🛡️" },
  { id: 22, name: "치유의손",    class: "성직자", level: 60, role: "공격대원",   party: 2, gearscore: 4620, joined: "2025-04-13", avatar: "💚" },
  { id: 23, name: "어둠마법사",  class: "마법사", level: 59, role: "공격대원",   party: 2, gearscore: 4560, joined: "2025-05-11", avatar: "🌙" },
  { id: 24, name: "회오리궁수",  class: "궁수",   level: 58, role: "공격대원",   party: 2, gearscore: 4430, joined: "2025-05-16", avatar: "🌪️" },
];

// ─── Schedule ──────────────────────────────────────────────────
const today = new Date();
const y = today.getFullYear();
const m = String(today.getMonth() + 1).padStart(2, '0');

function dateStr(dayOffset: number, extraMonth = 0) {
  const d = new Date(today);
  d.setMonth(d.getMonth() + extraMonth);
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString().slice(0, 10);
}

export const scheduleEvents: ScheduleEvent[] = [
  {
    id: 1,
    title: "천공의 요새 레이드",
    date: dateStr(1),
    time: "21:00",
    type: "raid",
    description: "주간 천공의 요새 공략. 전원 버프 포션 지참 필수.",
    maxMembers: 24,
    signedUp: ["아이온마스터", "천공의검", "성스러운빛", "불꽃마법사", "바람의궁수", "심연의검사"],
  },
  {
    id: 2,
    title: "길드전 PvP",
    date: dateStr(3),
    time: "20:00",
    type: "pvp",
    description: "라이벌 레기온과의 격전. 파티 구성 사전 확인 필요.",
    maxMembers: 24,
    signedUp: ["아이온마스터", "천공의검", "강철전사", "철벽방패", "심연의검사"],
  },
  {
    id: 3,
    title: "심연의 균열 공략",
    date: dateStr(5),
    time: "21:30",
    type: "raid",
    description: "고난이도 던전. 기어스코어 4500 이상 필수 참여.",
    maxMembers: 12,
    signedUp: ["아이온마스터", "성스러운빛", "불꽃마법사", "심연의검사"],
  },
  {
    id: 4,
    title: "공성전",
    date: dateStr(7),
    time: "22:00",
    type: "siege",
    description: "카엘루스 서버 공성전. 전 레기온원 필참!",
    maxMembers: 24,
    signedUp: ["아이온마스터", "천공의검", "성스러운빛", "불꽃마법사", "바람의궁수", "심연의검사", "빛의사제", "번개마법사"],
  },
  {
    id: 5,
    title: "공략 회의",
    date: dateStr(2),
    time: "20:00",
    type: "gathering",
    description: "다음 주 레이드 공략법 디스코드 회의. 파티장 이상 필참.",
    maxMembers: 6,
    signedUp: ["아이온마스터", "천공의검", "성스러운빛", "심연의검사"],
  },
  {
    id: 6,
    title: "천공의 요새 레이드",
    date: dateStr(8),
    time: "21:00",
    type: "raid",
    description: "주간 천공의 요새 공략 2회차.",
    maxMembers: 24,
    signedUp: ["아이온마스터", "천공의검"],
  },
];

// ─── Helpers ───────────────────────────────────────────────────
export const classColors: Record<MemberClass, string> = {
  "전사":    "#E84040",
  "검사":    "#E07030",
  "마법사":  "#7040E0",
  "궁수":    "#40C080",
  "성직자":  "#F0D040",
  "음유시인":"#D040A0",
  "정령사":  "#40B0D0",
  "공학자":  "#A0A0A0",
};

export const eventTypeLabels: Record<ScheduleEvent['type'], string> = {
  raid:      "레이드",
  pvp:       "PvP",
  siege:     "공성전",
  gathering: "모임",
  other:     "기타",
};

export const eventTypeColors: Record<ScheduleEvent['type'], string> = {
  raid:      "#C42B2B",
  pvp:       "#2A6BAC",
  siege:     "#C9A84C",
  gathering: "#2A8A4A",
  other:     "#6A6A7A",
};
