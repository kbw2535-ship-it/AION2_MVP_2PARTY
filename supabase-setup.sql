-- =============================================
-- MVP레기온 성역 - Supabase 테이블 설정
-- Supabase 대시보드 > SQL Editor에서 실행하세요
-- =============================================

-- 1. members 테이블
CREATE TABLE IF NOT EXISTS members (
  id    BIGSERIAL PRIMARY KEY,
  name  TEXT NOT NULL,
  class TEXT NOT NULL,
  party INTEGER NOT NULL CHECK (party IN (1, 2)),
  avatar TEXT NOT NULL DEFAULT '⚔️'
);

-- 2. votes 테이블
CREATE TABLE IF NOT EXISTS votes (
  voter_name   TEXT NOT NULL,
  dungeon      TEXT NOT NULL CHECK (dungeon IN ('purification', 'chalice')),
  slots        TEXT[] NOT NULL DEFAULT '{}',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (voter_name, dungeon)
);

-- 3. RLS(Row Level Security) 비활성화 — 공개 레기온 사이트용
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기/쓰기 허용 (비밀번호 없는 공개 사이트)
CREATE POLICY "public_read_members"  ON members FOR SELECT USING (true);
CREATE POLICY "public_write_members" ON members FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "public_read_votes"    ON votes   FOR SELECT USING (true);
CREATE POLICY "public_write_votes"   ON votes   FOR ALL    USING (true) WITH CHECK (true);

-- notices 테이블 (공지사항)
CREATE TABLE IF NOT EXISTS public.notices (
  id         BIGSERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  content    TEXT NOT NULL DEFAULT '',
  author     TEXT NOT NULL DEFAULT '레기온장',
  pinned     BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_all_notices" ON public.notices;
CREATE POLICY "public_all_notices" ON public.notices FOR ALL USING (true) WITH CHECK (true);
