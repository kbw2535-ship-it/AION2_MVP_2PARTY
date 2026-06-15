'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  pinned: boolean;
  created_at: string;
}

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selected, setSelected] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch('/api/notices');
    const data = await res.json();
    setNotices(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const pinned = notices.filter(n => n.pinned);
  const normal = notices.filter(n => !n.pinned);
  const sorted = [...pinned, ...normal];

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#F0F0F8', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '1rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(15,15,26,0.9)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/" style={{ fontFamily: "'Cinzel Decorative', serif", color: '#C9A84C', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← MVP레기온
        </Link>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', letterSpacing: '0.15em' }}>공지사항</h1>
        <div style={{ width: 80 }} />
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.75rem', letterSpacing: '0.4em', color: '#C9A84C', marginBottom: '0.5rem' }}>
            NOTICE BOARD
          </p>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)', margin: '0 auto' }} />
        </div>

        {/* Notice detail modal */}
        {selected && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, padding: '1rem',
          }} onClick={() => setSelected(null)}>
            <div style={{
              background: '#13131F', border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: 4, padding: '2rem', width: '100%', maxWidth: 600,
              maxHeight: '80vh', overflowY: 'auto',
            }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {selected.pinned && (
                    <span style={{
                      background: 'rgba(201,168,76,0.15)', border: '1px solid #C9A84C',
                      color: '#C9A84C', fontSize: '0.65rem', padding: '0.15rem 0.5rem',
                      borderRadius: 2, fontFamily: "'Cinzel', serif",
                    }}>📌 공지</span>
                  )}
                </div>
                <button onClick={() => setSelected(null)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: '#6A6A7A', fontSize: '1.2rem',
                }}>✕</button>
              </div>
              <h2 style={{
                fontFamily: "'Cinzel', serif", fontSize: '1.1rem',
                color: '#F0F0F8', marginBottom: '0.75rem', lineHeight: 1.4,
              }}>{selected.title}</h2>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.75rem', color: '#6A6A7A' }}>
                <span>✍ {selected.author}</span>
                <span>📅 {formatDate(selected.created_at)}</span>
              </div>
              <div style={{
                color: '#A8A8B8', fontSize: '0.9rem', lineHeight: 1.9,
                whiteSpace: 'pre-wrap',
                borderTop: '1px solid rgba(201,168,76,0.1)', paddingTop: '1.25rem',
              }}>
                {selected.content}
              </div>
            </div>
          </div>
        )}

        {/* Notice list */}
        {loading ? (
          <p style={{ color: '#3A3A5A', textAlign: 'center', padding: '3rem' }}>불러오는 중...</p>
        ) : sorted.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '4rem 2rem',
            border: '1px dashed rgba(201,168,76,0.15)', borderRadius: 4,
          }}>
            <p style={{ color: '#3A3A5A', fontSize: '0.85rem' }}>등록된 공지사항이 없습니다.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {sorted.map((n, idx) => (
              <button key={n.id} onClick={() => setSelected(n)} style={{
                background: n.pinned ? 'rgba(201,168,76,0.06)' : 'rgba(26,26,46,0.6)',
                border: `1px solid ${n.pinned ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.1)'}`,
                borderRadius: 4, padding: '1rem 1.25rem',
                cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: '1rem',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = n.pinned ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.1)')}>
                {/* Number / pin */}
                <div style={{
                  fontFamily: "'Cinzel', serif", fontSize: '0.75rem',
                  color: n.pinned ? '#C9A84C' : '#3A3A5A',
                  width: 28, textAlign: 'center', flexShrink: 0,
                }}>
                  {n.pinned ? '📌' : sorted.length - idx}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Cinzel', serif", fontSize: '0.9rem',
                    color: n.pinned ? '#E8C96A' : '#F0F0F8',
                    marginBottom: '0.25rem',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{n.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#6A6A7A' }}>
                    {n.author} · {formatDate(n.created_at)}
                  </div>
                </div>

                <div style={{ color: '#3A3A5A', fontSize: '0.8rem', flexShrink: 0 }}>▶</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
