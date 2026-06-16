'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(10,10,15,0.95)' : 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(201,168,76,0.12)',
      padding: '0 1rem',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 52,
      }}>
        <Link href="/" style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: '0.95rem', color: '#C9A84C', letterSpacing: '0.05em',
          textShadow: '0 0 20px rgba(201,168,76,0.5)',
          textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          MVP레기온
        </Link>

        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'nowrap' }}>
          <Link href="/notice" style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.7rem',
            color: '#A8A8B8', textDecoration: 'none',
            padding: '0.3rem 0.5rem',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2,
            whiteSpace: 'nowrap',
          }}>📢 공지</Link>
          <Link href="/party" style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.7rem',
            color: '#C9A84C', textDecoration: 'none',
            padding: '0.3rem 0.5rem',
            border: '1px solid rgba(201,168,76,0.3)', borderRadius: 2,
            whiteSpace: 'nowrap',
          }}>⚔️ 파티구성</Link>
          <Link href="/schedule" style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.7rem',
            color: '#2A6BAC', textDecoration: 'none',
            padding: '0.3rem 0.5rem',
            border: '1px solid rgba(42,107,172,0.3)', borderRadius: 2,
            whiteSpace: 'nowrap',
          }}>⏰ 투표</Link>
          <Link href="/admin" style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.7rem',
            color: '#6A6A7A', textDecoration: 'none',
            padding: '0.3rem 0.5rem',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2,
            whiteSpace: 'nowrap',
          }}>⚙ 관리</Link>
        </div>
      </div>
    </nav>
  );
}
