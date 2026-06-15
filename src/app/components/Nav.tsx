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
      background: scrolled ? 'rgba(10,10,15,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 2rem',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
      }}>
        <Link href="/" style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: '1.1rem', color: '#C9A84C', letterSpacing: '0.1em',
          textShadow: '0 0 20px rgba(201,168,76,0.5)',
          textDecoration: 'none',
        }}>
          MVP레기온
        </Link>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link href="/notice" style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.75rem', letterSpacing: '0.08em',
            color: '#A8A8B8', textDecoration: 'none',
            padding: '0.3rem 0.85rem',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2,
            transition: 'all 0.2s',
          }}>📢 공지</Link>
          <Link href="/schedule" style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.75rem', letterSpacing: '0.08em',
            color: '#2A6BAC', textDecoration: 'none',
            padding: '0.3rem 0.85rem',
            border: '1px solid rgba(42,107,172,0.3)', borderRadius: 2,
          }}>⏰ 시간투표</Link>
          <Link href="/admin" style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.75rem', letterSpacing: '0.08em',
            color: '#C9A84C', textDecoration: 'none',
            padding: '0.3rem 0.85rem',
            border: '1px solid rgba(201,168,76,0.25)', borderRadius: 2,
          }}>⚙ 관리</Link>
        </div>
      </div>
    </nav>
  );
}
