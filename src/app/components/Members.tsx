'use client';
import { useState } from 'react';
import { members, classColors, type MemberRole } from '../data';

const roleOrder: MemberRole[] = ['레기온장', '부레기온장', '파티장', '공격대원'];
const roleBadgeColors: Record<MemberRole, string> = {
  '레기온장':   '#C9A84C',
  '부레기온장': '#8A6F2E',
  '파티장':     '#2A6BAC',
  '공격대원':   '#3A3A5A',
};

export default function Members() {
  const [activeParty, setActiveParty] = useState<0 | 1 | 2>(0);

  const filtered = members
    .filter(m => activeParty === 0 || m.party === activeParty)
    .sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role));

  return (
    <section id="members" style={{ padding: '6rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.75rem', letterSpacing: '0.4em',
            color: '#C9A84C', marginBottom: '0.75rem', textTransform: 'uppercase',
          }}>Raid Members</p>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            color: '#F0F0F8', fontWeight: 600, letterSpacing: '0.05em',
          }}>공격대원</h2>
          <div style={{
            width: 60, height: 1,
            background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
            margin: '1.5rem auto 0',
          }} />
        </div>

        {/* Party tabs */}
        <div style={{
          display: 'flex', gap: '0.5rem', justifyContent: 'center',
          marginBottom: '2.5rem',
        }}>
          {([['전체', 0], ['1파티', 1], ['2파티', 2]] as const).map(([label, val]) => (
            <button key={val} onClick={() => setActiveParty(val)} style={{
              background: activeParty === val ? 'rgba(201,168,76,0.15)' : 'transparent',
              border: `1px solid ${activeParty === val ? '#C9A84C' : 'rgba(201,168,76,0.2)'}`,
              color: activeParty === val ? '#C9A84C' : '#6A6A7A',
              padding: '0.5rem 1.5rem',
              fontFamily: "'Cinzel', serif",
              fontSize: '0.8rem', letterSpacing: '0.1em',
              cursor: 'pointer', borderRadius: 2,
              transition: 'all 0.2s',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Member count */}
        <p style={{
          textAlign: 'center', color: '#6A6A7A',
          fontSize: '0.8rem', marginBottom: '2rem', letterSpacing: '0.05em',
        }}>
          총 <span style={{ color: '#C9A84C' }}>{filtered.length}</span>명
        </p>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
        }}>
          {filtered.map(member => (
            <div key={member.id} style={{
              background: 'rgba(26,26,46,0.7)',
              border: '1px solid rgba(201,168,76,0.12)',
              borderRadius: 4,
              padding: '1.25rem',
              transition: 'border-color 0.2s, transform 0.2s',
              position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.35)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.12)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}>
              {/* Class color accent */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                background: classColors[member.class],
              }} />

              <div style={{ paddingLeft: '0.5rem' }}>
                {/* Avatar + name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '1.4rem' }}>{member.avatar}</span>
                  <div>
                    <div style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: '0.85rem', color: '#F0F0F8', letterSpacing: '0.05em',
                    }}>{member.name}</div>
                    <div style={{
                      fontSize: '0.7rem', color: classColors[member.class],
                      marginTop: '0.1rem',
                    }}>{member.class}</div>
                  </div>
                </div>

                {/* Role badge */}
                <div style={{
                  display: 'inline-block',
                  background: roleBadgeColors[member.role] + '22',
                  border: `1px solid ${roleBadgeColors[member.role]}55`,
                  color: roleBadgeColors[member.role],
                  fontSize: '0.65rem', padding: '0.15rem 0.5rem',
                  borderRadius: 2, marginBottom: '0.75rem',
                  fontFamily: "'Cinzel', serif", letterSpacing: '0.05em',
                }}>
                  {member.role}
                </div>

                {/* Stats */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: '0.4rem', fontSize: '0.72rem',
                }}>
                  <div>
                    <span style={{ color: '#6A6A7A' }}>레벨 </span>
                    <span style={{ color: '#A8A8B8' }}>{member.level}</span>
                  </div>
                  <div>
                    <span style={{ color: '#6A6A7A' }}>파티 </span>
                    <span style={{ color: '#2A6BAC' }}>{member.party}파티</span>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: '#6A6A7A' }}>기어스코어 </span>
                    <span style={{ color: '#C9A84C' }}>{member.gearscore.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
