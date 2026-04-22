import { useEffect, useState } from 'react';
import ParticleHero from './components/ParticleHero.jsx';
import Navigation from './components/Navigation.jsx';
import AlsoMeTeaser from './components/AlsoMeTeaser.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import BuilderLoop from './components/BuilderLoop.jsx';
import AlsoMe from './components/AlsoMe.jsx';
import ChatInterface from './components/ChatInterface.jsx';
import Footer from './components/Footer.jsx';
import MobileFAB from './components/MobileFAB.jsx';

export default function App() {
  const [heroDone, setHeroDone] = useState(false);

  useEffect(() => {
    // Log page view on mount (non-blocking)
    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: window.location.pathname,
        referrer: document.referrer,
      }),
    }).catch(() => {
      // Silently fail analytics
    });
  }, []);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navigation visible={heroDone} />
      <ParticleHero onComplete={() => setHeroDone(true)} />
      <ChatInterface />
      <AlsoMeTeaser />
      <About />
      <Projects />
      <BuilderLoop />
      <AlsoMe />
      <Footer />
      <MobileFAB />
    </div>
  );
}
