'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function PartyPage() {
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
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', letterSpacing: '0.15em' }}>파티 구성</h1>
        <div style={{ width: 80 }} />
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.75rem',
            letterSpacing: '0.4em', color: '#C9A84C', marginBottom: '0.5rem',
          }}>PARTY COMPOSITION</p>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)', margin: '0 auto' }} />
        </div>

        {/* Party image */}
        <div style={{
          background: 'rgba(26,26,46,0.6)',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: 4, padding: '1rem',
          boxShadow: '0 0 40px rgba(201,168,76,0.08)',
        }}>
          <Image
            src="/party.png"
            alt="파티 구성표"
            width={1200}
            height={800}
            style={{
              width: '100%', height: 'auto',
              borderRadius: 2,
              display: 'block',
            }}
            priority
          />
        </div>

        <p style={{
          textAlign: 'center', color: '#3A3A5A',
          fontSize: '0.72rem', marginTop: '1rem',
        }}>
          파티 구성 이미지를 업데이트하려면 public/party.png 파일을 교체하세요
        </p>
      </div>
    </div>
  );
}
