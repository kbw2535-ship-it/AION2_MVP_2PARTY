import Nav from './components/Nav';
import Hero from './components/Hero';
import LegionInfo from './components/LegionInfo';
import Members from './components/Members';
import Calendar from './components/Calendar';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <LegionInfo />
        <Members />
        <Calendar />
      </main>
      <Footer />
    </>
  );
}
