'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { DungeonKey } from '../store';
import type { Member } from '../data';
import { classColors } from '../data';

const DUNGEONS: { key: DungeonKey; name: string; color: string; icon: string }[] = [
  { key: 'purification', name: '침식의 정화소', color: '#2A6BAC', icon: '💧' },
  { key: 'chalice',      name: '무스펠의 성배', color: '#C42B2B', icon: '🔥' },
];

const DAYS = ['수', '목', '금', '토', '일', '월', '화'];
const DAY_KEYS = ['WED','THU','FRI','SAT','SUN','MON','TUE'];
const DAY_KEY_TO_LABEL: Record<string, string> = {
  'MON':'월','TUE':'화','WED':'수','THU':'목','FRI':'금','SAT':'토','SUN':'일',
};

function buildSlots() {
  const slots: string[] = [];
  for (let h = 12; h < 24; h++) {
    for (const m of [0, 30]) {
      slots.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
    }
  }
  slots.push('00:00');
  return slots;
}
const TIME_SLOTS = buildSlots();

interface TallyData {
  votes: { voterName: string; slots: string[] }[];
  tally: Record<string, number>;
}

export default function SchedulePage() {
  const [dungeon, setDungeon] = useState<DungeonKey>('purification');
  const [memberList, setMemberList] = useState<Member[]>([]);
  const [voterName, setVoterName] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tally, setTally] = useState<TallyData>({ votes: [], tally: {} });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'add'|'remove'>('add');
  const [viewMode, setViewMode] = useState<'vote'|'result'>('vote');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showOthers, setShowOthers] = useState(false); // 타인 투표 보기 토글

  const dungeonInfo = DUNGEONS.find(d => d.key === dungeon)!;

  useEffect(() => {
    fetch('/api/members').then(r => r.json()).then(setMemberList);
  }, []);

  const fetchTally = useCallback(async () => {
    const res = await fetch(`/api/votes?dungeon=${dungeon}`);
    const data = await res.json();
    setTally(data);
  }, [dungeon]);

  useEffect(() => { fetchTally(); }, [fetchTally]);

  useEffect(() => {
    if (!voterName) return;
    const existing = tally.votes.find(v => v.voterName === voterName);
    if (existing) {
      setSelected(new Set(existing.slots));
      setSubmitted(true);
    } else {
      setSelected(new Set());
      setSubmitted(false);
    }
  }, [voterName, dungeon, tally.votes]);

  const slotKey = (day: string, time: string) => `${day}-${time}`;

  const handleMouseDown = (key: string) => {
    setIsDragging(true);
    const removing = selected.has(key);
    setDragMode(removing ? 'remove' : 'add');
    setSelected(prev => {
      const next = new Set(prev);
      if (removing) next.delete(key); else next.add(key);
      return next;
    });
  };

  const handleMouseEnter = (key: string) => {
    if (!isDragging) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (dragMode === 'remove') next.delete(key); else next.add(key);
      return next;
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleSubmit = async () => {
    if (!voterName) return;
    setLoading(true);
    await fetch('/api/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterName, dungeon, slots: Array.from(selected) }),
    });
    await fetchTally();
    setSubmitted(true);
    setLoading(false);
  };

  const handleResetDungeon = async () => {
    if (!voterName) return;
    await fetch('/api/votes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterName, dungeon }),
    });
    setSelected(new Set());
    setSubmitted(false);
    await fetchTally();
  };

  const handleResetAll = async () => {
    if (!voterName) return;
    await fetch('/api/votes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterName, resetAll: true }),
    });
    setSelected(new Set());
    setSubmitted(false);
    setShowResetConfirm(false);
    await fetchTally();
  };

  // 요일 우선순위: 수=0, 목=1, 금=2, 토=3, 일=4, 월=5, 화=6
  const DAY_PRIORITY: Record<string, number> = {
    'WED':0,'THU':1,'FRI':2,'SAT':3,'SUN':4,'MON':5,'TUE':6,
  };
  const topSlots = Object.entries(tally.tally)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1]; // 투표수 내림차순
      const dayA = DAY_PRIORITY[a[0].split('-')[0]] ?? 99;
      const dayB = DAY_PRIORITY[b[0].split('-')[0]] ?? 99;
      if (dayA !== dayB) return dayA - dayB; // 요일 우선순위 (수~화)
      return a[0].split('-')[1].localeCompare(b[0].split('-')[1]); // 시간 오름차순
    })
    .slice(0, 5);
  const maxCount = topSlots[0]?.[1] ?? 1;
  const totalVoters = tally.votes.length;
  const selectedMember = memberList.find(m => m.name === voterName);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#F0F0F8', paddingBottom: '4rem' }}
      onMouseUp={handleMouseUp}>

      {/* Reset confirm modal */}
      {showResetConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
        }}>
          <div style={{
            background: '#13131F', border: '1px solid rgba(196,43,43,0.4)',
            borderRadius: 4, padding: '2rem', maxWidth: 360, width: '90%', textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ fontFamily: "'Cinzel', serif", color: '#F0F0F8', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
              전체 투표 초기화
            </h3>
            <p style={{ color: '#A8A8B8', fontSize: '0.82rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              <span style={{ color: '#C9A84C' }}>{voterName}</span>의 모든 던전 투표가<br/>삭제됩니다. 계속하시겠습니까?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => setShowResetConfirm(false)} style={{
                background: 'none', border: '1px solid rgba(255,255,255,0.1)',
                color: '#6A6A7A', padding: '0.5rem 1.25rem', borderRadius: 2, cursor: 'pointer', fontSize: '0.82rem',
              }}>취소</button>
              <button onClick={handleResetAll} style={{
                background: 'rgba(196,43,43,0.15)', border: '1px solid #C42B2B',
                color: '#C42B2B', padding: '0.5rem 1.25rem', borderRadius: 2, cursor: 'pointer',
                fontFamily: "'Cinzel', serif", fontSize: '0.82rem',
              }}>전체 삭제</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '1rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(15,15,26,0.9)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/" style={{
          fontFamily: "'Cinzel Decorative', serif",
          color: '#C9A84C', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '0.1em',
        }}>← MVP레기온</Link>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', color: '#F0F0F8', letterSpacing: '0.15em' }}>
          공격 시간 투표
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['vote','result'] as const).map(m => (
            <button key={m} onClick={() => setViewMode(m)} style={{
              background: viewMode === m ? 'rgba(201,168,76,0.15)' : 'transparent',
              border: `1px solid ${viewMode === m ? '#C9A84C' : 'rgba(201,168,76,0.2)'}`,
              color: viewMode === m ? '#C9A84C' : '#6A6A7A',
              padding: '0.3rem 0.8rem', borderRadius: 2, cursor: 'pointer',
              fontFamily: "'Cinzel', serif", fontSize: '0.7rem',
            }}>{m === 'vote' ? '투표' : '결과'}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>

        {/* Dungeon selector */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {DUNGEONS.map(d => (
            <button key={d.key} onClick={() => setDungeon(d.key)} style={{
              background: dungeon === d.key ? d.color + '22' : 'transparent',
              border: `2px solid ${dungeon === d.key ? d.color : 'rgba(255,255,255,0.1)'}`,
              color: dungeon === d.key ? '#F0F0F8' : '#6A6A7A',
              padding: '0.75rem 2rem', borderRadius: 4, cursor: 'pointer',
              fontFamily: "'Cinzel', serif", fontSize: '0.9rem', letterSpacing: '0.08em',
              transition: 'all 0.2s',
              boxShadow: dungeon === d.key ? `0 0 20px ${d.color}44` : 'none',
            }}>
              {d.icon} {d.name}
            </button>
          ))}
        </div>

        {viewMode === 'vote' ? (
          <>
            {/* Member selector */}
            {!voterName ? (
              <div style={{
                background: 'rgba(26,26,46,0.8)', border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 4, padding: '2rem', maxWidth: 600, margin: '0 auto 2rem',
              }}>
                <p style={{
                  fontFamily: "'Cinzel', serif", color: '#C9A84C',
                  marginBottom: '1.25rem', fontSize: '0.9rem', textAlign: 'center', letterSpacing: '0.1em',
                }}>공격대원을 선택하세요</p>
                {memberList.length === 0 ? (
                  <p style={{ color: '#3A3A5A', textAlign: 'center', fontSize: '0.85rem' }}>
                    등록된 공격대원이 없습니다.<br/>
                    <Link href="/admin" style={{ color: '#C9A84C' }}>관리자 페이지</Link>에서 추가해 주세요.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.6rem' }}>
                    {memberList.map(m => (
                      <button key={m.id} onClick={() => setVoterName(m.name)} style={{
                        background: 'rgba(10,10,15,0.6)',
                        border: `1px solid ${(classColors[m.class as keyof typeof classColors] || '#3A3A5A')}44`,
                        borderRadius: 3, padding: '0.6rem 0.75rem',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = classColors[m.class as keyof typeof classColors] || '#C9A84C';
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.06)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = (classColors[m.class as keyof typeof classColors] || '#3A3A5A') + '44';
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(10,10,15,0.6)';
                      }}>
                        <span style={{ fontSize: '1.1rem' }}>{m.avatar}</span>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: '#F0F0F8', fontFamily: "'Cinzel', serif" }}>{m.name}</div>
                          <div style={{ fontSize: '0.65rem', color: classColors[m.class as keyof typeof classColors] || '#6A6A7A', marginTop: '0.1rem' }}>{m.class}</div>
                        </div>
                        {tally.votes.find(v => v.voterName === m.name) && (
                          <span style={{ marginLeft: 'auto', color: '#2A8A4A', fontSize: '0.7rem' }}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(26,26,46,0.6)', border: '1px solid rgba(201,168,76,0.15)',
                borderRadius: 4, padding: '0.75rem 1.25rem', marginBottom: '1.5rem',
                flexWrap: 'wrap', gap: '0.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>{selectedMember?.avatar}</span>
                  <div>
                    <span style={{ color: '#C9A84C', fontFamily: "'Cinzel', serif", fontSize: '0.9rem' }}>{voterName}</span>
                    {selectedMember && (
                      <span style={{ color: classColors[selectedMember.class as keyof typeof classColors], fontSize: '0.72rem', marginLeft: '0.5rem' }}>
                        {selectedMember.class}
                      </span>
                    )}
                    {submitted && <span style={{ color: '#2A8A4A', marginLeft: '0.5rem', fontSize: '0.8rem' }}>✓ 제출됨</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {submitted && (
                    <button onClick={handleResetDungeon} style={{
                      background: 'none', border: '1px solid rgba(201,168,76,0.2)',
                      color: '#8A6F2E', padding: '0.3rem 0.75rem',
                      borderRadius: 2, cursor: 'pointer', fontSize: '0.72rem',
                    }}>이 던전 초기화</button>
                  )}
                  <button onClick={() => setShowResetConfirm(true)} style={{
                    background: 'none', border: '1px solid rgba(196,43,43,0.3)',
                    color: '#C42B2B', padding: '0.3rem 0.75rem',
                    borderRadius: 2, cursor: 'pointer', fontSize: '0.72rem',
                  }}>전체 리셋</button>
                  <button onClick={() => { setVoterName(''); setSelected(new Set()); setSubmitted(false); }} style={{
                    background: 'none', border: '1px solid rgba(201,168,76,0.2)',
                    color: '#6A6A7A', padding: '0.3rem 0.75rem',
                    borderRadius: 2, cursor: 'pointer', fontSize: '0.72rem',
                  }}>변경</button>
                </div>
              </div>
            )}

            {/* Controls row: instruction + others toggle */}
            {voterName && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem',
              }}>
                <p style={{ color: '#6A6A7A', fontSize: '0.78rem' }}>
                  드래그하거나 클릭해서 가능 시간 선택 · 선택: <span style={{ color: '#C9A84C' }}>{selected.size}</span>개
                </p>
                {/* 타인 투표 보기 토글 */}
                <button onClick={() => setShowOthers(prev => !prev)} style={{
                  background: showOthers ? 'rgba(42,107,172,0.15)' : 'transparent',
                  border: `1px solid ${showOthers ? '#2A6BAC' : 'rgba(255,255,255,0.1)'}`,
                  color: showOthers ? '#3A8FE0' : '#6A6A7A',
                  padding: '0.3rem 0.9rem', borderRadius: 2, cursor: 'pointer',
                  fontSize: '0.72rem', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                }}>
                  <span>{showOthers ? '👁' : '🙈'}</span>
                  타인 투표 {showOthers ? '숨기기' : '보기'}
                  {totalVoters > 0 && <span style={{ color: '#C9A84C' }}>({totalVoters}명)</span>}
                </button>
              </div>
            )}

            {/* Time grid */}
            <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '70vh', userSelect: 'none', maxWidth: 600, position: 'relative' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 360 }}>
                <thead>
                  <tr>
                    <th style={{
                      width: 72, padding: '0.6rem 0.5rem',
                      fontFamily: "'Cinzel', serif", fontSize: '0.8rem',
                      color: '#A8A8B8', borderBottom: '2px solid rgba(201,168,76,0.2)',
                      position: 'sticky', top: 0, zIndex: 10,
                      background: '#0F0F1A',
                    }}>시간</th>
                    {DAYS.map((d, i) => (
                      <th key={d} style={{
                        padding: '0.6rem 0.25rem',
                        fontFamily: "'Cinzel', serif", fontSize: '0.85rem', fontWeight: 700,
                        color: i === 3 || i === 4 ? '#C9A84C' : '#A8A8B8',
                        borderBottom: '2px solid rgba(201,168,76,0.2)', textAlign: 'center',
                        width: 40,
                        position: 'sticky', top: 0, zIndex: 10,
                        background: '#0F0F1A',
                      }}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map(time => (
                    <tr key={time}>
                      <td style={{
                        padding: '2px 0.6rem', fontFamily: 'monospace', fontSize: '0.85rem',
                        fontWeight: 700, color: '#C9A84C', textAlign: 'right',
                        borderRight: '2px solid rgba(201,168,76,0.15)', whiteSpace: 'nowrap',
                        letterSpacing: '0.05em',
                      }}>{time}</td>
                      {DAY_KEYS.map((day) => {
                        const key = slotKey(day, time);
                        const isSel = selected.has(key);
                        const count = tally.tally[key] ?? 0;
                        const heat = count > 0 ? count / Math.max(maxCount, 1) : 0;
                        const showHeat = showOthers && count > 0;
                        return (
                          <td key={day}
                            onMouseDown={() => voterName && handleMouseDown(key)}
                            onMouseEnter={() => voterName && handleMouseEnter(key)}
                            style={{ padding: '2px', cursor: voterName ? 'pointer' : 'default' }}>
                            <div style={{
                              height: 28, borderRadius: 2,
                              background: isSel
                                ? dungeonInfo.color
                                : showHeat
                                  ? `rgba(42,107,172,${0.15 + heat * 0.65})`
                                  : 'rgba(255,255,255,0.04)',
                              border: isSel ? `2px solid ${dungeonInfo.color}` : '1px solid rgba(255,255,255,0.06)',
                              transition: 'background 0.1s', position: 'relative',
                            }}>
                              {showHeat && !isSel && count > 0 && (
                                <span style={{
                                  position: 'absolute', inset: 0,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '0.5rem', color: 'rgba(255,255,255,0.8)',
                                }}>{count}</span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend & submit */}
            {voterName && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.72rem', color: '#6A6A7A' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 12, height: 12, background: dungeonInfo.color, borderRadius: 1 }} /> 내 선택
                  </span>
                  {showOthers && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 12, height: 12, background: 'rgba(42,107,172,0.5)', borderRadius: 1 }} /> 다른 투표자
                    </span>
                  )}
                </div>
                <button onClick={handleSubmit} disabled={loading || selected.size === 0} style={{
                  background: selected.size > 0 ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selected.size > 0 ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
                  color: selected.size > 0 ? '#C9A84C' : '#3A3A5A',
                  padding: '0.7rem 2.5rem',
                  fontFamily: "'Cinzel', serif", fontSize: '0.85rem', letterSpacing: '0.1em',
                  borderRadius: 2, cursor: selected.size > 0 ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
                }}>
                  {loading ? '저장 중...' : submitted ? '다시 제출' : '투표 제출'}
                </button>
              </div>
            )}
          </>
        ) : (
          /* Results view */
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem',
              background: 'rgba(26,26,46,0.6)', border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: 4, padding: '1rem 1.5rem',
            }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.8rem', color: '#6A6A7A' }}>
                {dungeonInfo.icon} {dungeonInfo.name}
              </div>
              <div style={{ marginLeft: 'auto', color: '#C9A84C', fontFamily: "'Cinzel', serif", fontSize: '0.8rem' }}>
                총 {totalVoters}명 참여
              </div>
              <button onClick={fetchTally} style={{
                background: 'none', border: '1px solid rgba(201,168,76,0.2)',
                color: '#6A6A7A', padding: '0.3rem 0.75rem',
                borderRadius: 2, cursor: 'pointer', fontSize: '0.72rem',
              }}>새로고침</button>
            </div>

            <h3 style={{
              fontFamily: "'Cinzel', serif", fontSize: '0.85rem', color: '#C9A84C',
              letterSpacing: '0.15em', marginBottom: '1rem', textTransform: 'uppercase',
            }}>최다 투표 시간대 TOP 5</h3>

            {topSlots.length === 0 ? (
              <p style={{ color: '#3A3A5A', fontSize: '0.85rem' }}>아직 투표가 없습니다.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '3rem' }}>
                {topSlots.map(([slot, count], idx) => {
                  const [dayKey, time] = slot.split('-');
                  const dayLabel = DAY_KEY_TO_LABEL[dayKey] ?? dayKey;
                  const pct = totalVoters > 0 ? (count / totalVoters) * 100 : 0;
                  return (
                    <div key={slot} style={{
                      background: 'rgba(26,26,46,0.7)',
                      border: `1px solid ${idx === 0 ? '#C9A84C44' : 'rgba(201,168,76,0.1)'}`,
                      borderRadius: 4, padding: '0.85rem 1.25rem',
                      display: 'flex', alignItems: 'center', gap: '1rem',
                    }}>
                      <div style={{
                        fontFamily: "'Cinzel', serif", fontSize: '1.1rem',
                        color: idx === 0 ? '#C9A84C' : '#6A6A7A', width: 24, textAlign: 'center',
                      }}>{idx + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.9rem', color: '#F0F0F8', marginBottom: '0.35rem' }}>
                          {dayLabel}요일 {time}
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', width: `${pct}%`,
                            background: idx === 0 ? '#C9A84C' : dungeonInfo.color, borderRadius: 2,
                          }} />
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', color: idx === 0 ? '#C9A84C' : '#A8A8B8' }}>
                          {count}명
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#6A6A7A' }}>{Math.round(pct)}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <h3 style={{
              fontFamily: "'Cinzel', serif", fontSize: '0.85rem', color: '#C9A84C',
              letterSpacing: '0.15em', marginBottom: '1rem', textTransform: 'uppercase',
            }}>참여자 목록</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tally.votes.map(v => {
                const m = memberList.find(x => x.name === v.voterName);
                return (
                  <div key={v.voterName} style={{
                    background: 'rgba(26,26,46,0.5)', border: '1px solid rgba(201,168,76,0.1)',
                    borderRadius: 4, padding: '0.6rem 1rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{m?.avatar}</span>
                      <span style={{ fontFamily: "'Cinzel', serif", color: '#A8A8B8' }}>{v.voterName}</span>
                      {m && <span style={{ fontSize: '0.7rem', color: classColors[m.class as keyof typeof classColors] }}>{m.class}</span>}
                    </span>
                    <span style={{ color: '#6A6A7A' }}>{v.slots.length}개 시간 선택</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
