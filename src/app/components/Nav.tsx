'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const navItems = [
  { id: 'hero', label: '홈' },
  { id: 'info', label: '레기온 정보' },
];

export default function Nav() {
  const [active, setActive] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = navItems.map(n => document.getElementById(n.id));
      const current = sections.findLast(s => s && s.getBoundingClientRect().top <= 120);
      if (current) setActive(current.id);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

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
        <button onClick={() => scrollTo('hero')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: '1.1rem', color: '#C9A84C', letterSpacing: '0.1em',
          textShadow: '0 0 20px rgba(201,168,76,0.5)',
        }}>
          MVP레기온 성역
        </button>

        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0.4rem 0.85rem',
              fontFamily: "'Cinzel', serif",
              fontSize: '0.75rem', letterSpacing: '0.08em',
              color: active === item.id ? '#C9A84C' : '#A8A8B8',
              borderBottom: active === item.id ? '1px solid #C9A84C' : '1px solid transparent',
              transition: 'all 0.2s',
            }}>
              {item.label}
            </button>
          ))}
          <div style={{ width: 1, height: 16, background: 'rgba(201,168,76,0.2)', margin: '0 0.5rem' }} />
          <Link href="/schedule" style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.75rem', letterSpacing: '0.08em',
            color: '#2A6BAC', textDecoration: 'none',
            padding: '0.3rem 0.85rem',
            border: '1px solid rgba(42,107,172,0.3)', borderRadius: 2,
            transition: 'all 0.2s',
          }}>⏰ 시간투표</Link>
          <Link href="/admin" style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.75rem', letterSpacing: '0.08em',
            color: '#C9A84C', textDecoration: 'none',
            padding: '0.3rem 0.85rem',
            border: '1px solid rgba(201,168,76,0.25)', borderRadius: 2,
            transition: 'all 0.2s',
          }}>⚙ 관리</Link>
        </div>
      </div>
    </nav>
  );
}
