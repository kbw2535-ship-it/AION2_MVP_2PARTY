import { legionInfo } from '../data';

export default function Hero() {
  return (
    <section id="hero" style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      padding: '6rem 2rem 4rem',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Emblem SVG */}
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <svg width="120" height="120" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 0 24px rgba(201,168,76,0.45))' }}>
          <circle cx="70" cy="70" r="65" stroke="#C9A84C" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
          <circle cx="70" cy="70" r="58" stroke="#C9A84C" strokeWidth="0.8" opacity="0.3" />
          <path d="M70 18 L108 34 L108 72 Q108 102 70 122 Q32 102 32 72 L32 34 Z"
            fill="rgba(201,168,76,0.08)" stroke="#C9A84C" strokeWidth="1.5" />
          <line x1="70" y1="30" x2="70" y2="110" stroke="#C9A84C" strokeWidth="1" opacity="0.5" />
          <line x1="38" y1="70" x2="102" y2="70" stroke="#C9A84C" strokeWidth="1" opacity="0.5" />
          <polygon points="70,48 74,63 90,63 77,72 82,87 70,78 58,87 63,72 50,63 66,63"
            fill="#C9A84C" opacity="0.9" />
          {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sy],i) => (
            <g key={i} transform={`translate(${70 + sx*28}, ${70 + sy*28})`}>
              <circle r="3" fill="#C9A84C" opacity="0.5" />
            </g>
          ))}
          <circle cx="70" cy="70" r="6" fill="none" stroke="#3A8FE0" strokeWidth="1" opacity="0.7" />
        </svg>
      </div>

      {/* Subtitle */}
      <p style={{
        fontFamily: "'Cinzel', serif",
        fontSize: '0.85rem', letterSpacing: '0.4em',
        color: '#A8A8B8', marginBottom: '0.75rem', textTransform: 'uppercase',
      }}>
        아이온2 · {legionInfo.server}
      </p>

      {/* Main title */}
      <h1 style={{
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: 'clamp(1.6rem, 5vw, 3.2rem)',
        color: '#C9A84C',
        textShadow: '0 0 30px rgba(201,168,76,0.5), 0 0 60px rgba(201,168,76,0.2)',
        letterSpacing: '0.06em',
        marginBottom: '0.4rem',
        textAlign: 'center',
      }}>
        MVP레기온
      </h1>

      <p style={{
        fontFamily: "'Cinzel', serif",
        fontSize: 'clamp(0.85rem, 2vw, 1rem)',
        letterSpacing: '0.25em',
        color: '#6A6A7A',
        marginBottom: '2rem',
        textTransform: 'uppercase',
        textAlign: 'center',
      }}>
        성역 2파티
      </p>

      {/* Legion image — 파일명을 실제 PNG 파일명으로 교체하세요 */}
      <div style={{ marginBottom: '2.5rem' }}>
        <img
          src="/main.png"
          alt="MVP레기온 성역"
          style={{
            maxWidth: 420, width: '90%',
            borderRadius: 4,
            border: '1px solid rgba(201,168,76,0.2)',
            boxShadow: '0 0 40px rgba(201,168,76,0.15)',
            display: 'block',
          }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* Stats row */}
      <div style={{
        display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center',
        borderTop: '1px solid rgba(201,168,76,0.15)',
        paddingTop: '2rem',
      }}>
        {[
          { value: legionInfo.totalMembers, label: '공격대원' },
          { value: '2', label: '파티' },
          { value: legionInfo.level, label: '레기온 레벨' },
          { value: legionInfo.achievements.length, label: '업적' },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '2rem', fontWeight: 700,
              color: '#C9A84C',
              textShadow: '0 0 15px rgba(201,168,76,0.4)',
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', color: '#6A6A7A', marginTop: '0.25rem' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position: 'absolute', bottom: '2.5rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
        color: '#3A3A5A', fontSize: '0.7rem', letterSpacing: '0.2em',
        animation: 'float 2.5s ease-in-out infinite',
      }}>
        <span style={{ fontFamily: "'Cinzel', serif" }}>SCROLL</span>
        <span>▼</span>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(6px); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
