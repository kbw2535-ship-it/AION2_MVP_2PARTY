'use client';
import { useState } from 'react';
import { scheduleEvents, eventTypeColors, eventTypeLabels, type ScheduleEvent } from '../data';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function Calendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<ScheduleEvent | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return scheduleEvents.filter(e => e.date === dateStr);
  };

  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  // upcoming events sorted
  const upcoming = [...scheduleEvents]
    .filter(e => new Date(e.date + 'T' + e.time) >= new Date())
    .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
    .slice(0, 5);

  return (
    <section id="calendar" style={{
      padding: '6rem 2rem',
      background: 'linear-gradient(180deg, transparent 0%, rgba(15,15,26,0.7) 30%, rgba(15,15,26,0.7) 70%, transparent 100%)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.75rem', letterSpacing: '0.4em',
            color: '#C9A84C', marginBottom: '0.75rem', textTransform: 'uppercase',
          }}>Schedule</p>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            color: '#F0F0F8', fontWeight: 600, letterSpacing: '0.05em',
          }}>공격 일정</h2>
          <div style={{
            width: 60, height: 1,
            background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
            margin: '1.5rem auto 0',
          }} />
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 340px',
          gap: '2rem', alignItems: 'start',
        }}>

          {/* Calendar */}
          <div style={{
            background: 'rgba(26,26,46,0.7)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: 4, overflow: 'hidden',
          }}>
            {/* Month nav */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(201,168,76,0.1)',
            }}>
              <button onClick={prevMonth} style={{
                background: 'none', border: '1px solid rgba(201,168,76,0.2)',
                color: '#C9A84C', cursor: 'pointer', width: 32, height: 32,
                borderRadius: 2, fontSize: '0.9rem',
              }}>‹</button>
              <h3 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '1rem', color: '#F0F0F8', letterSpacing: '0.1em',
              }}>
                {year}년 {month + 1}월
              </h3>
              <button onClick={nextMonth} style={{
                background: 'none', border: '1px solid rgba(201,168,76,0.2)',
                color: '#C9A84C', cursor: 'pointer', width: 32, height: 32,
                borderRadius: 2, fontSize: '0.9rem',
              }}>›</button>
            </div>

            {/* Day headers */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
              borderBottom: '1px solid rgba(201,168,76,0.08)',
            }}>
              {DAYS.map((d, i) => (
                <div key={d} style={{
                  textAlign: 'center', padding: '0.6rem',
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.7rem', letterSpacing: '0.05em',
                  color: i === 0 ? '#C42B2B' : i === 6 ? '#2A6BAC' : '#6A6A7A',
                }}>{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} style={{ minHeight: 72, borderRight: '1px solid rgba(201,168,76,0.05)', borderBottom: '1px solid rgba(201,168,76,0.05)' }} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dayEvents = getEventsForDay(day);
                const todayCell = isToday(day);
                const col = (firstDay + day - 1) % 7;
                return (
                  <div key={day} style={{
                    minHeight: 72, padding: '0.4rem',
                    borderRight: '1px solid rgba(201,168,76,0.05)',
                    borderBottom: '1px solid rgba(201,168,76,0.05)',
                    background: todayCell ? 'rgba(201,168,76,0.05)' : 'transparent',
                    cursor: dayEvents.length ? 'pointer' : 'default',
                  }}>
                    <div style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: '0.75rem', marginBottom: '0.3rem',
                      color: todayCell ? '#C9A84C' :
                             col === 0 ? '#8B2020' :
                             col === 6 ? '#1A4A7A' : '#6A6A7A',
                      width: 22, height: 22,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: todayCell ? 'rgba(201,168,76,0.15)' : 'transparent',
                      borderRadius: '50%',
                    }}>{day}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {dayEvents.map(event => (
                        <button key={event.id} onClick={() => setSelected(event)} style={{
                          background: eventTypeColors[event.type] + '33',
                          border: `1px solid ${eventTypeColors[event.type]}55`,
                          borderRadius: 2, padding: '1px 4px',
                          fontSize: '0.6rem', color: eventTypeColors[event.type],
                          cursor: 'pointer', textAlign: 'left',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          width: '100%',
                        }}>
                          {event.time} {event.title}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Event detail */}
            {selected ? (
              <div style={{
                background: 'rgba(26,26,46,0.9)',
                border: `1px solid ${eventTypeColors[selected.type]}44`,
                borderRadius: 4, padding: '1.5rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{
                    background: eventTypeColors[selected.type] + '22',
                    border: `1px solid ${eventTypeColors[selected.type]}`,
                    color: eventTypeColors[selected.type],
                    fontSize: '0.65rem', padding: '0.2rem 0.6rem',
                    borderRadius: 2, fontFamily: "'Cinzel', serif",
                  }}>{eventTypeLabels[selected.type]}</span>
                  <button onClick={() => setSelected(null)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#6A6A7A', fontSize: '1rem',
                  }}>✕</button>
                </div>
                <h4 style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '1rem', color: '#F0F0F8', marginBottom: '0.5rem',
                }}>{selected.title}</h4>
                <p style={{ color: '#C9A84C', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                  📅 {selected.date} · ⏰ {selected.time}
                </p>
                <p style={{ color: '#A8A8B8', fontSize: '0.82rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                  {selected.description}
                </p>
                <div style={{
                  borderTop: '1px solid rgba(201,168,76,0.1)', paddingTop: '0.75rem',
                  fontSize: '0.75rem', color: '#6A6A7A',
                }}>
                  참여 {selected.signedUp.length} / {selected.maxMembers}명
                  <div style={{
                    marginTop: '0.5rem',
                    height: 4, background: 'rgba(255,255,255,0.05)',
                    borderRadius: 2, overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${(selected.signedUp.length / selected.maxMembers) * 100}%`,
                      background: eventTypeColors[selected.type],
                      borderRadius: 2,
                    }} />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'rgba(26,26,46,0.4)',
                border: '1px dashed rgba(201,168,76,0.15)',
                borderRadius: 4, padding: '1.5rem',
                textAlign: 'center', color: '#3A3A5A', fontSize: '0.8rem',
              }}>
                캘린더에서 일정을 클릭하세요
              </div>
            )}

            {/* Upcoming events */}
            <div style={{
              background: 'rgba(26,26,46,0.7)',
              border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: 4, padding: '1.25rem',
            }}>
              <h4 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.8rem', letterSpacing: '0.1em',
                color: '#C9A84C', marginBottom: '1rem', textTransform: 'uppercase',
              }}>다가오는 일정</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {upcoming.map(event => (
                  <button key={event.id} onClick={() => setSelected(event)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    textAlign: 'left', padding: '0.5rem',
                    borderRadius: 2, transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                    <div style={{
                      width: 4, alignSelf: 'stretch', flexShrink: 0,
                      background: eventTypeColors[event.type],
                      borderRadius: 2,
                    }} />
                    <div>
                      <div style={{ color: '#F0F0F8', fontSize: '0.82rem', marginBottom: '0.1rem' }}>
                        {event.title}
                      </div>
                      <div style={{ color: '#6A6A7A', fontSize: '0.7rem' }}>
                        {event.date} {event.time} · {eventTypeLabels[event.type]}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
