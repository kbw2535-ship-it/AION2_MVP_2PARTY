'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Member, MemberClass, MemberRole } from '../data';

const CLASSES: MemberClass[] = ['전사','검사','마법사','궁수','성직자','음유시인','정령사','공학자'];
const ROLES: MemberRole[] = ['레기온장','부레기온장','파티장','공격대원'];
const CLASS_AVATARS: Record<MemberClass, string> = {
  '전사':'⚔️','검사':'🗡️','마법사':'🔮','궁수':'🏹','성직자':'✨','음유시인':'🎵','정령사':'🌿','공학자':'⚙️'
};

const inputStyle = {
  background: 'rgba(10,10,15,0.8)',
  border: '1px solid rgba(201,168,76,0.25)',
  color: '#F0F0F8', padding: '0.5rem 0.75rem',
  borderRadius: 2, fontSize: '0.85rem',
  outline: 'none', width: '100%',
  fontFamily: 'Inter, sans-serif',
};

const selectStyle = { ...inputStyle, cursor: 'pointer' };

function MemberModal({ member, onSave, onClose }: {
  member: Partial<Member> | null;
  onSave: (m: Partial<Member>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<Member>>(member ?? {
    name: '', class: '전사', level: 60, role: '공격대원',
    party: 1, gearscore: 4000, joined: new Date().toISOString().slice(0,10), avatar: '⚔️',
  });

  const set = (k: keyof Member, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, padding: '1rem',
    }} onClick={onClose}>
      <div style={{
        background: '#13131F',
        border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: 4, padding: '2rem', width: '100%', maxWidth: 480,
      }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontFamily: "'Cinzel', serif", color: '#C9A84C', marginBottom: '1.5rem', fontSize: '1rem' }}>
          {member?.id ? '공격대원 편집' : '공격대원 추가'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.72rem', color: '#6A6A7A', display: 'block', marginBottom: '0.3rem' }}>이름</label>
            <input style={inputStyle} value={form.name ?? ''} onChange={e => set('name', e.target.value)} placeholder="캐릭터 이름" />
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', color: '#6A6A7A', display: 'block', marginBottom: '0.3rem' }}>클래스</label>
            <select style={selectStyle} value={form.class} onChange={e => {
              const cls = e.target.value as MemberClass;
              set('class', cls);
              set('avatar', CLASS_AVATARS[cls]);
            }}>
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', color: '#6A6A7A', display: 'block', marginBottom: '0.3rem' }}>역할</label>
            <select style={selectStyle} value={form.role} onChange={e => set('role', e.target.value as MemberRole)}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', color: '#6A6A7A', display: 'block', marginBottom: '0.3rem' }}>파티</label>
            <select style={selectStyle} value={form.party} onChange={e => set('party', Number(e.target.value) as 1|2)}>
              <option value={1}>1파티</option>
              <option value={2}>2파티</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', color: '#6A6A7A', display: 'block', marginBottom: '0.3rem' }}>레벨</label>
            <input style={inputStyle} type="number" min={1} max={60} value={form.level ?? 60}
              onChange={e => set('level', Number(e.target.value))} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.72rem', color: '#6A6A7A', display: 'block', marginBottom: '0.3rem' }}>기어스코어</label>
            <input style={inputStyle} type="number" value={form.gearscore ?? 4000}
              onChange={e => set('gearscore', Number(e.target.value))} />
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', color: '#6A6A7A', display: 'block', marginBottom: '0.3rem' }}>가입일</label>
            <input style={inputStyle} type="date" value={form.joined ?? ''}
              onChange={e => set('joined', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.1)',
            color: '#6A6A7A', padding: '0.5rem 1.25rem', borderRadius: 2, cursor: 'pointer', fontSize: '0.82rem',
          }}>취소</button>
          <button onClick={() => onSave(form)} style={{
            background: 'rgba(201,168,76,0.15)',
            border: '1px solid #C9A84C',
            color: '#C9A84C', padding: '0.5rem 1.5rem',
            borderRadius: 2, cursor: 'pointer',
            fontFamily: "'Cinzel', serif", fontSize: '0.82rem',
          }}>저장</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [editTarget, setEditTarget] = useState<Partial<Member> | null | undefined>(undefined);
  const [filter, setFilter] = useState<0|1|2>(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const loadMembers = async () => {
    const res = await fetch('/api/members');
    const data = await res.json();
    setMembers(data);
    setLoading(false);
  };

  useEffect(() => { loadMembers(); }, []);

  const handleSave = async (form: Partial<Member>) => {
    if (!form.name?.trim()) return;
    if (form.id) {
      await fetch('/api/members', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      showToast('✓ 수정 완료');
    } else {
      await fetch('/api/members', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      showToast('✓ 추가 완료');
    }
    setEditTarget(undefined);
    loadMembers();
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}" 을 삭제하시겠습니까?`)) return;
    await fetch('/api/members', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    showToast('삭제 완료');
    loadMembers();
  };

  const filtered = members.filter(m => filter === 0 || m.party === filter);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#F0F0F8', paddingBottom: '4rem' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(42,138,74,0.9)', border: '1px solid #2A8A4A',
          color: '#F0F0F8', padding: '0.6rem 1.5rem', borderRadius: 4,
          fontSize: '0.85rem', zIndex: 300,
        }}>{toast}</div>
      )}

      {editTarget !== undefined && (
        <MemberModal
          member={editTarget}
          onSave={handleSave}
          onClose={() => setEditTarget(undefined)}
        />
      )}

      {/* Header */}
      <div style={{
        borderBottom: '1px solid rgba(201,168,76,0.15)',
        padding: '1rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(15,15,26,0.9)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/" style={{ fontFamily: "'Cinzel Decorative', serif", color: '#C9A84C', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← MVP 레기온
        </Link>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', letterSpacing: '0.15em' }}>관리자 페이지</h1>
        <Link href="/schedule" style={{
          fontFamily: "'Cinzel', serif", fontSize: '0.75rem',
          color: '#2A6BAC', textDecoration: 'none',
          border: '1px solid rgba(42,107,172,0.3)',
          padding: '0.3rem 0.75rem', borderRadius: 2,
        }}>시간 투표 →</Link>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {([['전체', 0], ['1파티', 1], ['2파티', 2]] as const).map(([label, val]) => (
              <button key={val} onClick={() => setFilter(val)} style={{
                background: filter === val ? 'rgba(201,168,76,0.15)' : 'transparent',
                border: `1px solid ${filter === val ? '#C9A84C' : 'rgba(201,168,76,0.2)'}`,
                color: filter === val ? '#C9A84C' : '#6A6A7A',
                padding: '0.4rem 1rem', borderRadius: 2, cursor: 'pointer',
                fontFamily: "'Cinzel', serif", fontSize: '0.75rem',
              }}>{label} {filter === val && `(${filtered.length})`}</button>
            ))}
          </div>
          <button onClick={() => setEditTarget(null)} style={{
            background: 'rgba(201,168,76,0.15)',
            border: '1px solid #C9A84C',
            color: '#C9A84C', padding: '0.5rem 1.25rem',
            borderRadius: 2, cursor: 'pointer',
            fontFamily: "'Cinzel', serif", fontSize: '0.8rem', letterSpacing: '0.08em',
          }}>+ 공격대원 추가</button>
        </div>

        {/* Table */}
        {loading ? (
          <p style={{ color: '#3A3A5A', textAlign: 'center', padding: '3rem' }}>불러오는 중...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                  {['캐릭터','클래스','역할','파티','레벨','기어스코어','가입일','편집'].map(h => (
                    <th key={h} style={{
                      padding: '0.6rem 0.75rem', textAlign: 'left',
                      fontFamily: "'Cinzel', serif", fontSize: '0.7rem',
                      letterSpacing: '0.08em', color: '#6A6A7A',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.id} style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '0.6rem 0.75rem' }}>
                      <span style={{ marginRight: '0.4rem' }}>{m.avatar}</span>
                      <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.85rem' }}>{m.name}</span>
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.8rem', color: '#A8A8B8' }}>{m.class}</td>
                    <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.78rem', color: '#6A6A7A' }}>{m.role}</td>
                    <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.78rem', color: '#2A6BAC' }}>{m.party}파티</td>
                    <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.78rem', color: '#A8A8B8' }}>{m.level}</td>
                    <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.78rem', color: '#C9A84C' }}>{m.gearscore.toLocaleString()}</td>
                    <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.72rem', color: '#6A6A7A' }}>{m.joined}</td>
                    <td style={{ padding: '0.6rem 0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => setEditTarget(m)} style={{
                          background: 'none', border: '1px solid rgba(201,168,76,0.3)',
                          color: '#C9A84C', padding: '0.25rem 0.6rem',
                          borderRadius: 2, cursor: 'pointer', fontSize: '0.72rem',
                        }}>수정</button>
                        <button onClick={() => handleDelete(m.id, m.name)} style={{
                          background: 'none', border: '1px solid rgba(196,43,43,0.3)',
                          color: '#C42B2B', padding: '0.25rem 0.6rem',
                          borderRadius: 2, cursor: 'pointer', fontSize: '0.72rem',
                        }}>삭제</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p style={{ color: '#3A3A5A', fontSize: '0.72rem', marginTop: '1rem', textAlign: 'right' }}>
          ※ 변경사항은 서버 재시작 시 초기화됩니다. 영구 저장은 Supabase 연결을 권장합니다.
        </p>
      </div>
    </div>
  );
}
