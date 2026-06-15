export type MemberClass =
  | '수호성' | '검성' | '살성' | '치유성' | '호법성' | '정령성' | '마도성' | '궁성' | '권성';

export interface Member {
  id: number;
  name: string;
  class: MemberClass;
  party: 1 | 2;
  avatar: string;
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

export const legionInfo: LegionInfo = {
  name: "MVP레기온 성역",
  server: "지켈",
  faction: "에리온",
  level: 8,
  founded: "2025-04-01",
  totalMembers: 24,
  description:
    "아이온2 지켈 서버 MVP레기온 성역 2파티 공격대입니다. " +
    "체계적인 공략과 끈끈한 팀워크로 최강의 레기온을 목표로 합니다.",
  achievements: [
    "천공의 요새 첫 클리어",
    "심연의 균열 전원 생존 클리어",
    "서버 PvP 랭킹 3위",
    "레기온 레벨 8 달성",
  ],
};

export const members: Member[] = [
  { id: 1,  name: "아이온마스터", class: "수호성", party: 1, avatar: "🛡️" },
  { id: 2,  name: "천공의검",    class: "검성",   party: 1, avatar: "⚔️" },
  { id: 3,  name: "성스러운빛",  class: "치유성", party: 1, avatar: "✨" },
  { id: 4,  name: "불꽃마법사",  class: "마도성", party: 1, avatar: "🔥" },
  { id: 5,  name: "바람의궁수",  class: "궁성",   party: 1, avatar: "🏹" },
  { id: 6,  name: "대지의정령",  class: "정령성", party: 1, avatar: "🌿" },
  { id: 7,  name: "강철권사",    class: "권성",   party: 1, avatar: "👊" },
  { id: 8,  name: "달빛호법",    class: "호법성", party: 1, avatar: "🌙" },
  { id: 9,  name: "폭풍살성",    class: "살성",   party: 1, avatar: "⚡" },
  { id: 10, name: "신성수호",    class: "수호성", party: 1, avatar: "🛡️" },
  { id: 11, name: "얼음마도",    class: "마도성", party: 1, avatar: "❄️" },
  { id: 12, name: "독수리궁",    class: "궁성",   party: 1, avatar: "🦅" },
  { id: 13, name: "심연의검성",  class: "검성",   party: 2, avatar: "🌑" },
  { id: 14, name: "빛의치유",    class: "치유성", party: 2, avatar: "💫" },
  { id: 15, name: "번개살성",    class: "살성",   party: 2, avatar: "⚡" },
  { id: 16, name: "독화살궁",    class: "궁성",   party: 2, avatar: "🏹" },
  { id: 17, name: "화염정령",    class: "정령성", party: 2, avatar: "🔥" },
  { id: 18, name: "강철수호",    class: "수호성", party: 2, avatar: "⚔️" },
  { id: 19, name: "별의호법",    class: "호법성", party: 2, avatar: "⭐" },
  { id: 20, name: "증기마도",    class: "마도성", party: 2, avatar: "🔮" },
  { id: 21, name: "철벽검성",    class: "검성",   party: 2, avatar: "🗡️" },
  { id: 22, name: "치유의손",    class: "치유성", party: 2, avatar: "💚" },
  { id: 23, name: "어둠권성",    class: "권성",   party: 2, avatar: "🌙" },
  { id: 24, name: "회오리궁성",  class: "궁성",   party: 2, avatar: "🌪️" },
];

export const classColors: Record<MemberClass, string> = {
  "수호성": "#4A90D9",
  "검성":   "#E07030",
  "살성":   "#C42B2B",
  "치유성": "#40C080",
  "호법성": "#C9A84C",
  "정령성": "#40B0D0",
  "마도성": "#7040E0",
  "궁성":   "#60A060",
  "권성":   "#D04080",
};
