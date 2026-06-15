'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Member, MemberClass } from '../data';
import { classColors } from '../data';

const ADMIN_PASSWORD = '2535';
const CLASSES: MemberClass[] = ['수호성','검성','살성','치유성','호법성','정령성','마도성','궁성','권성'];
const CLASS_AVATARS: Record<MemberClass, string> = {
  '수호성':'🛡️','검성':'⚔️','살성':'🗡️','치유성':'✨','호법성':'🌙',
  '정령성':'🌿','마도성':'🔮','궁성':'🏹','권성':'👊',
};

interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  pinned: boolean;
  created_at: string;
}

const inp = {
  background: 'rgba(10,10,15,0.8)',
  border: '1px solid rgba(201,168,76,0.25)',
  color: '#F0F0F8', padding: '0.5rem 0.75rem',
  borderRadius: 2, fontSize: '0.85rem',
  outline: 'none', width: '100%',
  fontFamily: 'Inter, sans-serif',
} as React.CSSProperties;

// ── Password Gate ──────────────────────────────────────────
function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const handle = () => {
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem('admin_auth','1'); onSuccess(); }
    else { setError(true); setPw(''); setTimeout(() => setError(false), 1500); }
  };
  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0F', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{
        background:'rgba(26,26,46,0.9)',
        border:`1px solid ${error ? '#C42B2B' : 'rgba(201,168,76,0.25)'}`,
        borderRadius:4, padding:'2.5rem', width:'100%', maxWidth:360, textAlign:'center',
      }}>
        <div style={{ fontSize:'2rem', marginBottom:'1rem' }}>⚙️</div>
        <h2 style={{ fontFamily:"'Cinzel', serif", color:'#C9A84C', fontSize:'1rem', letterSpacing:'0.15em', marginBottom:'0.5rem' }}>관리자 페이지</h2>
        <p style={{ color:'#6A6A7A', fontSize:'0.78rem', marginBottom:'1.5rem' }}>비밀번호를 입력하세요</p>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key==='Enter' && handle()} placeholder="••••"
          style={{ ...inp, textAlign:'center', fontSize:'1.2rem', letterSpacing:'0.3em',
            border:`1px solid ${error ? '#C42B2B' : 'rgba(201,168,76,0.25)'}`, marginBottom:'1rem' }}
          autoFocus />
        {error && <p style={{ color:'#C42B2B', fontSize:'0.78rem', marginBottom:'0.75rem' }}>비밀번호가 틀렸습니다</p>}
        <button onClick={handle} style={{
          background:'rgba(201,168,76,0.15)', border:'1px solid #C9A84C',
          color:'#C9A84C', padding:'0.6rem 2rem', borderRadius:2, cursor:'pointer',
          fontFamily:"'Cinzel', serif", fontSize:'0.85rem', width:'100%',
        }}>확인</button>
        <div style={{ marginTop:'1.5rem' }}>
          <Link href="/" style={{ color:'#3A3A5A', fontSize:'0.72rem', textDecoration:'none' }}>← 메인으로</Link>
        </div>
      </div>
    </div>
  );
}

// ── Member Modal ───────────────────────────────────────────
function MemberModal({ member, onSave, onClose }: { member: Partial<Member>|null; onSave:(m:Partial<Member>)=>void; onClose:()=>void }) {
  const [form, setForm] = useState<Partial<Member>>(member ?? { name:'', class:'수호성', party:1, avatar:'🛡️' });
  const set = (k: keyof Member, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:'1rem' }} onClick={onClose}>
      <div style={{ background:'#13131F', border:'1px solid rgba(201,168,76,0.25)', borderRadius:4, padding:'2rem', width:'100%', maxWidth:400 }} onClick={e=>e.stopPropagation()}>
        <h3 style={{ fontFamily:"'Cinzel', serif", color:'#C9A84C', marginBottom:'1.5rem', fontSize:'1rem' }}>
          {member?.id ? '공격대원 수정' : '공격대원 추가'}
        </h3>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1.5rem' }}>
          <div>
            <label style={{ fontSize:'0.72rem', color:'#6A6A7A', display:'block', marginBottom:'0.3rem' }}>이름</label>
            <input style={inp} value={form.name??''} onChange={e=>set('name',e.target.value)} placeholder="캐릭터 이름" />
          </div>
          <div>
            <label style={{ fontSize:'0.72rem', color:'#6A6A7A', display:'block', marginBottom:'0.3rem' }}>클래스</label>
            <select style={{ ...inp, cursor:'pointer' }} value={form.class} onChange={e=>{ const c=e.target.value as MemberClass; set('class',c); set('avatar',CLASS_AVATARS[c]); }}>
              {CLASSES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:'0.72rem', color:'#6A6A7A', display:'block', marginBottom:'0.3rem' }}>파티</label>
            <select style={{ ...inp, cursor:'pointer' }} value={form.party} onChange={e=>set('party',Number(e.target.value) as 1|2)}>
              <option value={1}>1파티</option>
              <option value={2}>2파티</option>
            </select>
          </div>
        </div>
        <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ background:'none', border:'1px solid rgba(255,255,255,0.1)', color:'#6A6A7A', padding:'0.5rem 1.25rem', borderRadius:2, cursor:'pointer', fontSize:'0.82rem' }}>취소</button>
          <button onClick={()=>onSave(form)} style={{ background:'rgba(201,168,76,0.15)', border:'1px solid #C9A84C', color:'#C9A84C', padding:'0.5rem 1.5rem', borderRadius:2, cursor:'pointer', fontFamily:"'Cinzel', serif", fontSize:'0.82rem' }}>저장</button>
        </div>
      </div>
    </div>
  );
}

// ── Notice Modal ───────────────────────────────────────────
function NoticeModal({ notice, onSave, onClose }: { notice: Partial<Notice>|null; onSave:(n:Partial<Notice>)=>void; onClose:()=>void }) {
  const [form, setForm] = useState<Partial<Notice>>(notice ?? { title:'', content:'', author:'레기온장', pinned:false });
  const set = (k: keyof Notice, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:'1rem' }} onClick={onClose}>
      <div style={{ background:'#13131F', border:'1px solid rgba(201,168,76,0.25)', borderRadius:4, padding:'2rem', width:'100%', maxWidth:560 }} onClick={e=>e.stopPropagation()}>
        <h3 style={{ fontFamily:"'Cinzel', serif", color:'#C9A84C', marginBottom:'1.5rem', fontSize:'1rem' }}>
          {notice?.id ? '공지사항 수정' : '공지사항 작성'}
        </h3>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1.5rem' }}>
          <div>
            <label style={{ fontSize:'0.72rem', color:'#6A6A7A', display:'block', marginBottom:'0.3rem' }}>제목</label>
            <input style={inp} value={form.title??''} onChange={e=>set('title',e.target.value)} placeholder="공지 제목" />
          </div>
          <div>
            <label style={{ fontSize:'0.72rem', color:'#6A6A7A', display:'block', marginBottom:'0.3rem' }}>내용</label>
            <textarea style={{ ...inp, minHeight:140, resize:'vertical' as const }}
              value={form.content??''} onChange={e=>set('content',e.target.value)} placeholder="공지 내용을 입력하세요..." />
          </div>
          <div>
            <label style={{ fontSize:'0.72rem', color:'#6A6A7A', display:'block', marginBottom:'0.3rem' }}>작성자</label>
            <input style={inp} value={form.author??''} onChange={e=>set('author',e.target.value)} placeholder="작성자" />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <input type="checkbox" id="pinned" checked={form.pinned??false} onChange={e=>set('pinned',e.target.checked)}
              style={{ width:16, height:16, cursor:'pointer', accentColor:'#C9A84C' }} />
            <label htmlFor="pinned" style={{ fontSize:'0.82rem', color:'#A8A8B8', cursor:'pointer' }}>📌 상단 고정</label>
          </div>
        </div>
        <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ background:'none', border:'1px solid rgba(255,255,255,0.1)', color:'#6A6A7A', padding:'0.5rem 1.25rem', borderRadius:2, cursor:'pointer', fontSize:'0.82rem' }}>취소</button>
          <button onClick={()=>onSave(form)} style={{ background:'rgba(201,168,76,0.15)', border:'1px solid #C9A84C', color:'#C9A84C', padding:'0.5rem 1.5rem', borderRadius:2, cursor:'pointer', fontFamily:"'Cinzel', serif", fontSize:'0.82rem' }}>저장</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<'members'|'notices'>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [memberModal, setMemberModal] = useState<Partial<Member>|null|undefined>(undefined);
  const [noticeModal, setNoticeModal] = useState<Partial<Notice>|null|undefined>(undefined);
  const [filter, setFilter] = useState<0|1|2>(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => { if (sessionStorage.getItem('admin_auth')==='1') setAuthed(true); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(()=>setToast(''),2500); };

  const loadMembers = async () => {
    const res = await fetch('/api/members');
    setMembers(await res.json());
    setLoading(false);
  };
  const loadNotices = async () => {
    const res = await fetch('/api/notices');
    const data = await res.json();
    setNotices(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    if (!authed) return;
    if (tab === 'members') loadMembers();
    else loadNotices();
  }, [authed, tab]);

  const handleSaveMember = async (form: Partial<Member>) => {
    if (!form.name?.trim()) return;
    if (form.id) {
      await fetch('/api/members', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
      showToast('✓ 수정 완료');
    } else {
      await fetch('/api/members', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
      showToast('✓ 추가 완료');
    }
    setMemberModal(undefined); loadMembers();
  };

  const handleDeleteMember = async (id: number, name: string) => {
    if (!confirm(`"${name}" 을 삭제하시겠습니까?`)) return;
    await fetch('/api/members', { method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id}) });
    showToast('삭제 완료'); loadMembers();
  };

  const handleSaveNotice = async (form: Partial<Notice>) => {
    if (!form.title?.trim()) return;
    if (form.id) {
      await fetch('/api/notices', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
      showToast('✓ 수정 완료');
    } else {
      await fetch('/api/notices', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
      showToast('✓ 등록 완료');
    }
    setNoticeModal(undefined); loadNotices();
  };

  const handleDeleteNotice = async (id: number) => {
    if (!confirm('공지사항을 삭제하시겠습니까?')) return;
    await fetch('/api/notices', { method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id}) });
    showToast('삭제 완료'); loadNotices();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
  };

  if (!authed) return <PasswordGate onSuccess={() => setAuthed(true)} />;

  const filteredMembers = members.filter(m => filter===0 || m.party===filter);

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0F', color:'#F0F0F8', paddingBottom:'4rem' }}>
      {toast && (
        <div style={{ position:'fixed', top:80, left:'50%', transform:'translateX(-50%)', background:'rgba(42,138,74,0.9)', border:'1px solid #2A8A4A', color:'#F0F0F8', padding:'0.6rem 1.5rem', borderRadius:4, fontSize:'0.85rem', zIndex:300 }}>{toast}</div>
      )}
      {memberModal !== undefined && <MemberModal member={memberModal} onSave={handleSaveMember} onClose={()=>setMemberModal(undefined)} />}
      {noticeModal !== undefined && <NoticeModal notice={noticeModal} onSave={handleSaveNotice} onClose={()=>setNoticeModal(undefined)} />}

      {/* Header */}
      <div style={{ borderBottom:'1px solid rgba(201,168,76,0.15)', padding:'1rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(15,15,26,0.9)', backdropFilter:'blur(12px)', position:'sticky', top:0, zIndex:50 }}>
        <Link href="/" style={{ fontFamily:"'Cinzel Decorative', serif", color:'#C9A84C', textDecoration:'none', fontSize:'0.9rem' }}>← MVP레기온</Link>
        <h1 style={{ fontFamily:"'Cinzel', serif", fontSize:'1rem', letterSpacing:'0.15em' }}>관리자 페이지</h1>
        <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
          <Link href="/schedule" style={{ fontFamily:"'Cinzel', serif", fontSize:'0.72rem', color:'#2A6BAC', textDecoration:'none', border:'1px solid rgba(42,107,172,0.3)', padding:'0.3rem 0.6rem', borderRadius:2 }}>투표</Link>
          <Link href="/notice" style={{ fontFamily:"'Cinzel', serif", fontSize:'0.72rem', color:'#A8A8B8', textDecoration:'none', border:'1px solid rgba(255,255,255,0.1)', padding:'0.3rem 0.6rem', borderRadius:2 }}>공지</Link>
          <button onClick={()=>{ sessionStorage.removeItem('admin_auth'); setAuthed(false); }} style={{ background:'none', border:'1px solid rgba(196,43,43,0.3)', color:'#C42B2B', padding:'0.3rem 0.6rem', borderRadius:2, cursor:'pointer', fontSize:'0.72rem' }}>로그아웃</button>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'2rem' }}>
        {/* Tabs */}
        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'2rem', borderBottom:'1px solid rgba(201,168,76,0.1)', paddingBottom:'1rem' }}>
          {([['members','⚔️ 공격대원'],['notices','📢 공지사항']] as const).map(([key,label])=>(
            <button key={key} onClick={()=>{ setTab(key); setLoading(true); }} style={{
              background: tab===key ? 'rgba(201,168,76,0.15)' : 'transparent',
              border:`1px solid ${tab===key ? '#C9A84C' : 'rgba(201,168,76,0.2)'}`,
              color: tab===key ? '#C9A84C' : '#6A6A7A',
              padding:'0.5rem 1.25rem', borderRadius:2, cursor:'pointer',
              fontFamily:"'Cinzel', serif", fontSize:'0.8rem',
            }}>{label}</button>
          ))}
        </div>

        {/* Members tab */}
        {tab === 'members' && (
          <>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
              <div style={{ display:'flex', gap:'0.5rem' }}>
                {([['전체',0],['1파티',1],['2파티',2]] as const).map(([label,val])=>(
                  <button key={val} onClick={()=>setFilter(val)} style={{
                    background:filter===val?'rgba(201,168,76,0.15)':'transparent',
                    border:`1px solid ${filter===val?'#C9A84C':'rgba(201,168,76,0.2)'}`,
                    color:filter===val?'#C9A84C':'#6A6A7A',
                    padding:'0.4rem 1rem', borderRadius:2, cursor:'pointer',
                    fontFamily:"'Cinzel', serif", fontSize:'0.75rem',
                  }}>{label}</button>
                ))}
              </div>
              <button onClick={()=>setMemberModal(null)} style={{ background:'rgba(201,168,76,0.15)', border:'1px solid #C9A84C', color:'#C9A84C', padding:'0.5rem 1.25rem', borderRadius:2, cursor:'pointer', fontFamily:"'Cinzel', serif", fontSize:'0.8rem' }}>+ 공격대원 추가</button>
            </div>
            {loading ? <p style={{ color:'#3A3A5A', textAlign:'center', padding:'3rem' }}>불러오는 중...</p> : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'0.75rem' }}>
                {filteredMembers.map(m=>(
                  <div key={m.id} style={{ background:'rgba(26,26,46,0.7)', border:`1px solid ${classColors[m.class as keyof typeof classColors]}33`, borderRadius:4, padding:'1rem', display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                      <span style={{ fontSize:'1.3rem' }}>{m.avatar}</span>
                      <div>
                        <div style={{ fontFamily:"'Cinzel', serif", fontSize:'0.85rem', color:'#F0F0F8' }}>{m.name}</div>
                        <div style={{ fontSize:'0.7rem', color:classColors[m.class as keyof typeof classColors], marginTop:'0.1rem' }}>{m.class}</div>
                      </div>
                      <div style={{ marginLeft:'auto', fontSize:'0.65rem', color:'#2A6BAC', fontFamily:"'Cinzel', serif" }}>{m.party}파티</div>
                    </div>
                    <div style={{ display:'flex', gap:'0.4rem' }}>
                      <button onClick={()=>setMemberModal(m)} style={{ flex:1, background:'none', border:'1px solid rgba(201,168,76,0.25)', color:'#C9A84C', padding:'0.3rem', borderRadius:2, cursor:'pointer', fontSize:'0.72rem' }}>수정</button>
                      <button onClick={()=>handleDeleteMember(m.id, m.name)} style={{ flex:1, background:'none', border:'1px solid rgba(196,43,43,0.25)', color:'#C42B2B', padding:'0.3rem', borderRadius:2, cursor:'pointer', fontSize:'0.72rem' }}>삭제</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Notices tab */}
        {tab === 'notices' && (
          <>
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'1.5rem' }}>
              <button onClick={()=>setNoticeModal(null)} style={{ background:'rgba(201,168,76,0.15)', border:'1px solid #C9A84C', color:'#C9A84C', padding:'0.5rem 1.25rem', borderRadius:2, cursor:'pointer', fontFamily:"'Cinzel', serif", fontSize:'0.8rem' }}>+ 공지 작성</button>
            </div>
            {loading ? <p style={{ color:'#3A3A5A', textAlign:'center', padding:'3rem' }}>불러오는 중...</p> :
            notices.length === 0 ? <p style={{ color:'#3A3A5A', textAlign:'center', padding:'3rem' }}>등록된 공지가 없습니다.</p> : (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                {notices.map(n=>(
                  <div key={n.id} style={{ background:n.pinned?'rgba(201,168,76,0.06)':'rgba(26,26,46,0.6)', border:`1px solid ${n.pinned?'rgba(201,168,76,0.3)':'rgba(201,168,76,0.1)'}`, borderRadius:4, padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:'1rem' }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.25rem' }}>
                        {n.pinned && <span style={{ fontSize:'0.65rem', color:'#C9A84C' }}>📌</span>}
                        <span style={{ fontFamily:"'Cinzel', serif", fontSize:'0.88rem', color:'#F0F0F8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.title}</span>
                      </div>
                      <div style={{ fontSize:'0.7rem', color:'#6A6A7A' }}>{n.author} · {formatDate(n.created_at)}</div>
                    </div>
                    <div style={{ display:'flex', gap:'0.4rem', flexShrink:0 }}>
                      <button onClick={()=>setNoticeModal(n)} style={{ background:'none', border:'1px solid rgba(201,168,76,0.25)', color:'#C9A84C', padding:'0.25rem 0.6rem', borderRadius:2, cursor:'pointer', fontSize:'0.72rem' }}>수정</button>
                      <button onClick={()=>handleDeleteNotice(n.id)} style={{ background:'none', border:'1px solid rgba(196,43,43,0.25)', color:'#C42B2B', padding:'0.25rem 0.6rem', borderRadius:2, cursor:'pointer', fontSize:'0.72rem' }}>삭제</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
