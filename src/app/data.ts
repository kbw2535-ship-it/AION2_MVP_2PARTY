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
  totalMembers: 0,
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

// 초기 공격대원 없음 — 관리자 페이지에서 추가하세요
export const members: Member[] = [];

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
