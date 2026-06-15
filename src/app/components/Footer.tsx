import { legionInfo } from '../data';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(201,168,76,0.1)',
      padding: '3rem 2rem',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: '1rem', color: '#C9A84C',
        textShadow: '0 0 15px rgba(201,168,76,0.3)',
        marginBottom: '0.75rem',
      }}>
        MVP 레기온
      </div>
      <p style={{ color: '#3A3A5A', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
        아이온2 · {legionInfo.server} · {legionInfo.faction}
      </p>
      <p style={{ color: '#2A2A3A', fontSize: '0.7rem', marginTop: '1.5rem' }}>
        © 2025 MVP Legion · Made with Next.js · Deployed on Vercel
      </p>
    </footer>
  );
}
