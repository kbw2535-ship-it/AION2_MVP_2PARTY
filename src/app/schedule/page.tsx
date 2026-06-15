'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { DungeonKey } from '../store';

const DUNGEONS: { key: DungeonKey; name: string; color: string; icon: string }[] = [
  { key: 'purification', name: '침식의 정화소', color: '#2A6BAC', icon: '💧' },
  { key: 'chalice',      name: '무스펠의 성배', color: '#C42B2B', icon: '🔥' },
];

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const DAY_KEYS = ['MON','TUE','WED','THU','FRI','SAT','SUN'];

function buildSlots() {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const hh = String(h).padStart(2,'0');
      const mm = String(m).padStart(2,'0');
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
}
const TIME_SLOTS = buildSlots();

interface TallyData {
  votes: { voterName: string; slots: string[] }[];
  tally: Record<string, number>;
}

export default function SchedulePage() {
  const [dungeon, setDungeon] = useState<DungeonKey>('purification');
  const [voterName, setVoterName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tally, setTally] = useState<TallyData>({ votes: [], tally: {} });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'add'|'remove'>('add');
  const [viewMode, setViewMode] = useState<'vote'|'result'>('vote');

  const dungeonInfo = DUNGEONS.find(d => d.key === dungeon)!;

  const fetchTally = useCallback(async () => {
    const res = await fetch(`/api/votes?dungeon=${dungeon}`);
    const data = await res.json();
    setTally(data);
  }, [dungeon]);

  useEffect(() => { fetchTally(); }, [fetchTally]);

  // Load existing vote if name known
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

  const toggleSlot = (key: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

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

  const handleReset = async () => {
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

  // Top slots by vote count
  const topSlots = Object.entries(tally.tally)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxCount = topSlots[0]?.[1] ?? 1;

  const totalVoters = tally.votes.length;

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#F0F0F8', padding: '0 0 4rem' }}
      onMouseUp={handleMouseUp}>

      {/* Header */}
      <div style={{
        borderBottom: '1px solid rgba(201,168,76,0.15)',
        padding: '1rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(15,15,26,0.9)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/" style={{
          fontFamily: "'Cinzel Decorative', serif",
          color: '#C9A84C', textDecoration: 'none', fontSize: '0.9rem',
          letterSpacing: '0.1em',
        }}>← MVP 레기온</Link>
        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '1rem', color: '#F0F0F8', letterSpacing: '0.15em',
        }}>공격 시간 투표</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['vote','result'] as const).map(m => (
            <button key={m} onClick={() => setViewMode(m)} style={{
              background: viewMode === m ? 'rgba(201,168,76,0.15)' : 'transparent',
              border: `1px solid ${viewMode === m ? '#C9A84C' : 'rgba(201,168,76,0.2)'}`,
              color: viewMode === m ? '#C9A84C' : '#6A6A7A',
              padding: '0.3rem 0.8rem', borderRadius: 2, cursor: 'pointer',
              fontFamily: "'Cinzel', serif", fontSize: '0.7rem', letterSpacing: '0.05em',
            }}>{m === 'vote' ? '투표' : '결과'}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>

        {/* Dungeon selector */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
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
            {/* Name input */}
            {!voterName ? (
              <div style={{
                background: 'rgba(26,26,46,0.8)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 4, padding: '2rem',
                maxWidth: 400, margin: '0 auto 2rem', textAlign: 'center',
              }}>
                <p style={{ fontFamily: "'Cinzel', serif", color: '#C9A84C', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  이름을 입력하세요
                </p>
                <input
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && nameInput.trim() && setVoterName(nameInput.trim())}
                  placeholder="캐릭터 이름"
                  style={{
                    background: 'rgba(10,10,15,0.8)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    color: '#F0F0F8', padding: '0.6rem 1rem',
                    borderRadius: 2, width: '100%', fontSize: '1rem',
                    outline: 'none', marginBottom: '0.75rem',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
                <button onClick={() => nameInput.trim() && setVoterName(nameInput.trim())} style={{
                  background: 'rgba(201,168,76,0.15)',
                  border: '1px solid #C9A84C',
                  color: '#C9A84C', padding: '0.6rem 2rem',
                  borderRadius: 2, cursor: 'pointer',
                  fontFamily: "'Cinzel', serif", fontSize: '0.85rem',
                }}>확인</button>
              </div>
            ) : (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(26,26,46,0.6)',
                border: '1px solid rgba(201,168,76,0.15)',
                borderRadius: 4, padding: '0.75rem 1.25rem',
                marginBottom: '1.5rem',
              }}>
                <span style={{ color: '#A8A8B8', fontSize: '0.85rem' }}>
                  <span style={{ color: '#C9A84C', fontFamily: "'Cinzel', serif" }}>{voterName}</span> 으로 투표 중
                  {submitted && <span style={{ color: '#2A8A4A', marginLeft: '0.5rem' }}>✓ 제출됨</span>}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {submitted && (
                    <button onClick={handleReset} style={{
                      background: 'none', border: '1px solid rgba(196,43,43,0.4)',
                      color: '#C42B2B', padding: '0.3rem 0.75rem',
                      borderRadius: 2, cursor: 'pointer', fontSize: '0.75rem',
                    }}>초기화</button>
                  )}
                  <button onClick={() => { setVoterName(''); setNameInput(''); setSelected(new Set()); setSubmitted(false); }} style={{
                    background: 'none', border: '1px solid rgba(201,168,76,0.2)',
                    color: '#6A6A7A', padding: '0.3rem 0.75rem',
                    borderRadius: 2, cursor: 'pointer', fontSize: '0.75rem',
                  }}>변경</button>
                </div>
              </div>
            )}

            {/* Instructions */}
            {voterName && (
              <p style={{ color: '#6A6A7A', fontSize: '0.78rem', textAlign: 'center', marginBottom: '1rem' }}>
                참여 가능한 시간대를 드래그하거나 클릭해서 선택하세요 · 선택: {selected.size}개
              </p>
            )}

            {/* Grid */}
            <div style={{ overflowX: 'auto', userSelect: 'none' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 700 }}>
                <thead>
                  <tr>
                    <th style={{
                      width: 64, padding: '0.5rem',
                      fontFamily: "'Cinzel', serif", fontSize: '0.7rem',
                      color: '#6A6A7A', borderBottom: '1px solid rgba(201,168,76,0.1)',
                    }}>시간</th>
                    {DAYS.map((d, i) => (
                      <th key={d} style={{
                        padding: '0.5rem',
                        fontFamily: "'Cinzel', serif", fontSize: '0.75rem',
                        color: i >= 5 ? '#C9A84C' : '#A8A8B8',
                        borderBottom: '1px solid rgba(201,168,76,0.1)',
                        textAlign: 'center',
                      }}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map(time => (
                    <tr key={time}>
                      <td style={{
                        padding: '1px 0.5rem',
                        fontFamily: 'monospace', fontSize: '0.65rem',
                        color: '#3A3A5A', textAlign: 'right',
                        borderRight: '1px solid rgba(201,168,76,0.08)',
                        whiteSpace: 'nowrap',
                      }}>{time}</td>
                      {DAY_KEYS.map((day, di) => {
                        const key = slotKey(day, time);
                        const isSel = selected.has(key);
                        const count = tally.tally[key] ?? 0;
                        const heat = count > 0 ? count / Math.max(maxCount, 1) : 0;
                        return (
                          <td key={day}
                            onMouseDown={() => voterName && handleMouseDown(key)}
                            onMouseEnter={() => voterName && handleMouseEnter(key)}
                            style={{
                              padding: '1px',
                              cursor: voterName ? 'pointer' : 'default',
                            }}>
                            <div style={{
                              height: 14,
                              borderRadius: 1,
                              background: isSel
                                ? dungeonInfo.color
                                : count > 0
                                  ? `rgba(${di >= 5 ? '201,168,76' : '42,107,172'}, ${0.15 + heat * 0.6})`
                                  : 'rgba(255,255,255,0.03)',
                              border: isSel ? `1px solid ${dungeonInfo.color}` : '1px solid transparent',
                              transition: 'background 0.1s',
                              position: 'relative',
                            }}>
                              {count > 0 && !isSel && (
                                <span style={{
                                  position: 'absolute', inset: 0,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '0.5rem', color: 'rgba(255,255,255,0.6)',
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
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: 12, height: 12, background: dungeonInfo.color, borderRadius: 1 }} /> 내 선택
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: 12, height: 12, background: 'rgba(42,107,172,0.5)', borderRadius: 1 }} /> 다른 투표자
                  </span>
                </div>
                <button onClick={handleSubmit} disabled={loading || selected.size === 0} style={{
                  background: selected.size > 0 ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selected.size > 0 ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
                  color: selected.size > 0 ? '#C9A84C' : '#3A3A5A',
                  padding: '0.7rem 2.5rem',
                  fontFamily: "'Cinzel', serif", fontSize: '0.85rem', letterSpacing: '0.1em',
                  borderRadius: 2, cursor: selected.size > 0 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
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
              display: 'flex', alignItems: 'center', gap: '1rem',
              marginBottom: '2rem',
              background: 'rgba(26,26,46,0.6)',
              border: '1px solid rgba(201,168,76,0.15)',
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

            {/* Top slots */}
            <h3 style={{
              fontFamily: "'Cinzel', serif", fontSize: '0.85rem',
              color: '#C9A84C', letterSpacing: '0.15em',
              marginBottom: '1rem', textTransform: 'uppercase',
            }}>최다 투표 시간대</h3>

            {topSlots.length === 0 ? (
              <p style={{ color: '#3A3A5A', fontSize: '0.85rem' }}>아직 투표가 없습니다.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '3rem' }}>
                {topSlots.map(([slot, count], idx) => {
                  const [dayKey, time] = slot.split('-');
                  const dayLabel = DAYS[DAY_KEYS.indexOf(dayKey)];
                  const pct = (count / totalVoters) * 100;
                  return (
                    <div key={slot} style={{
                      background: 'rgba(26,26,46,0.7)',
                      border: `1px solid ${idx === 0 ? '#C9A84C44' : 'rgba(201,168,76,0.1)'}`,
                      borderRadius: 4, padding: '0.85rem 1.25rem',
                      display: 'flex', alignItems: 'center', gap: '1rem',
                    }}>
                      <div style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '1.1rem', color: idx === 0 ? '#C9A84C' : '#6A6A7A',
                        width: 24, textAlign: 'center',
                      }}>{idx + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.9rem', color: '#F0F0F8', marginBottom: '0.35rem' }}>
                          {dayLabel}요일 {time}
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', width: `${pct}%`,
                            background: idx === 0 ? '#C9A84C' : dungeonInfo.color,
                            borderRadius: 2, transition: 'width 0.5s',
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

            {/* Who voted when */}
            <h3 style={{
              fontFamily: "'Cinzel', serif", fontSize: '0.85rem',
              color: '#C9A84C', letterSpacing: '0.15em',
              marginBottom: '1rem', textTransform: 'uppercase',
            }}>참여자 목록</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tally.votes.map(v => (
                <div key={v.voterName} style={{
                  background: 'rgba(26,26,46,0.5)',
                  border: '1px solid rgba(201,168,76,0.1)',
                  borderRadius: 4, padding: '0.6rem 1rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontSize: '0.82rem',
                }}>
                  <span style={{ fontFamily: "'Cinzel', serif", color: '#A8A8B8' }}>{v.voterName}</span>
                  <span style={{ color: '#6A6A7A' }}>{v.slots.length}개 시간 선택</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
