# MVP 레기온 - 아이온2 공식 웹페이지

아이온2 MVP 레기온 2파티 공격대 공식 웹페이지입니다.

## 기능

- **레기온 정보** - 서버, 진영, 업적 등 레기온 기본 정보
- **공격대원 목록** - 1파티 / 2파티 / 전체 탭으로 24명 조회
- **공격 일정 캘린더** - 월간 캘린더 + 다가오는 일정 목록

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS-in-JS (inline styles)
- **Deploy**: Vercel

---

## Vercel 배포 방법

### 방법 1: GitHub 연동 (추천)

1. 이 프로젝트를 GitHub 레포지토리에 올립니다
   ```bash
   git init
   git add .
   git commit -m "Initial commit: MVP Legion website"
   git remote add origin https://github.com/YOUR_USERNAME/aion2-legion.git
   git push -u origin main
   ```

2. [vercel.com](https://vercel.com) 에 접속 → **Add New Project**

3. GitHub 레포지토리 선택 → **Import**

4. 설정 확인 (자동 감지됨):
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. **Deploy** 클릭 → 완료! 🎉

### 방법 2: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 로컬 개발

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## 데이터 커스터마이징

`src/app/data.ts` 파일을 수정하면 됩니다:

- `legionInfo` — 레기온 이름, 서버, 설명 등
- `members` — 공격대원 목록 (이름, 클래스, 레벨, 기어스코어)
- `scheduleEvents` — 공격 일정 (날짜, 시간, 종류, 설명)

## 향후 확장 아이디어

- [ ] Supabase / PlanetScale 연결 → 실시간 데이터
- [ ] 로그인 기능 → 일정 신청 버튼 활성화
- [ ] Discord webhook 연동
- [ ] 공지사항 게시판
