import { legionInfo } from '../data';

const Section = ({ label, value }: { label: string; value: string }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid rgba(201,168,76,0.08)',
  }}>
    <span style={{ color: '#6A6A7A', fontSize: '0.85rem', letterSpacing: '0.05em' }}>{label}</span>
    <span style={{ color: '#E8C96A', fontFamily: "'Cinzel', serif", fontSize: '0.85rem' }}>{value}</span>
  </div>
);

export default function LegionInfo() {
  const founded = new Date(legionInfo.founded).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <section id="info" style={{
      padding: '6rem 2rem',
      background: 'linear-gradient(180deg, transparent 0%, rgba(15,15,26,0.8) 20%, rgba(15,15,26,0.8) 80%, transparent 100%)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.75rem', letterSpacing: '0.4em',
            color: '#C9A84C', marginBottom: '0.75rem', textTransform: 'uppercase',
          }}>Legion Overview</p>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            color: '#F0F0F8', fontWeight: 600, letterSpacing: '0.05em',
          }}>
            레기온 정보
          </h2>
          <div style={{
            width: 60, height: 1,
            background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
            margin: '1.5rem auto 0',
          }} />
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}>
          {/* Info card */}
          <div style={{
            background: 'rgba(26,26,46,0.6)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: 4,
            padding: '2rem',
          }}>
            <h3 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.9rem', letterSpacing: '0.15em',
              color: '#C9A84C', marginBottom: '1.5rem', textTransform: 'uppercase',
            }}>기본 정보</h3>
            <Section label="레기온 명" value={legionInfo.name} />
            <Section label="서버" value={legionInfo.server} />
            <Section label="진영" value={legionInfo.faction} />
            <Section label="레기온 레벨" value={`${legionInfo.level} Lv`} />
            <Section label="창설일" value={founded} />
            <Section label="총 인원" value={`${legionInfo.totalMembers}명`} />
            <Section label="파티 구성" value="2파티 (12명 × 2)" />
          </div>

          {/* Achievements card */}
          <div style={{
            background: 'rgba(26,26,46,0.6)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: 4,
            padding: '2rem',
          }}>
            <h3 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.9rem', letterSpacing: '0.15em',
              color: '#C9A84C', marginBottom: '1.5rem', textTransform: 'uppercase',
            }}>업적</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {legionInfo.achievements.map((ach, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 28, height: 28, flexShrink: 0,
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    borderRadius: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.65rem', color: '#C9A84C',
                  }}>
                    ★
                  </div>
                  <span style={{ color: '#A8A8B8', fontSize: '0.9rem' }}>{ach}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description card */}
          <div style={{
            background: 'rgba(26,26,46,0.6)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: 4,
            padding: '2rem',
            gridColumn: 'span 1',
          }}>
            <h3 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.9rem', letterSpacing: '0.15em',
              color: '#C9A84C', marginBottom: '1.5rem', textTransform: 'uppercase',
            }}>레기온 소개</h3>
            <p style={{
              color: '#A8A8B8', lineHeight: 1.9, fontSize: '0.9rem',
            }}>
              {legionInfo.description}
            </p>

            <div style={{ marginTop: '2rem' }}>
              <h4 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.75rem', letterSpacing: '0.15em',
                color: '#6A6A7A', marginBottom: '1rem', textTransform: 'uppercase',
              }}>목표</h4>
              {['서버 1위 레기온 달성', '모든 엔드게임 컨텐츠 클리어', '활발한 레기온 문화 조성'].map((goal, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.4rem 0', color: '#A8A8B8', fontSize: '0.85rem',
                }}>
                  <span style={{ color: '#2A6BAC' }}>▸</span> {goal}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
