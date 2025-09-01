import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import Header from './components/Header';
import Hero from './components/Hero';
import MainContent from './components/MainContent';
import Footer from './components/Footer';

// Stylish section divider component
const SectionDivider = ({ color = '#1b1a1a', flip = false }) => (
  <div className="relative w-full overflow-hidden">
    <svg
      className={`w-full h-24 ${flip ? 'rotate-180' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
    >
      <path
        fill={color}
        fillOpacity="1"
        d="M0,128L48,122.7C96,117,192,107,288,138.7C384,171,480,245,576,250.7C672,256,768,192,864,165.3C960,139,1056,149,1152,160C1248,171,1344,181,1392,186.7L1440,192L1440,320L0,320Z"
      ></path>
    </svg>
  </div>
);

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);

  useEffect(() => {
    const handleScroll = debounce(() => {
      setIsScrolled(window.scrollY > 100);
      setIsScrollTopVisible(window.scrollY > 100);
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, []);

  return (
    <div className="bg-[#040000] text-white font-['Roboto',sans-serif]">
      {/* Header */}
      <Header isScrolled={isScrolled} />

      {/* Hero Section */}
      <section id="hero-section">
        <Hero />
      </section>

      {/* Divider */}
      <SectionDivider color="#1b1a1a" />

      {/* Main Content Section */}
      <section id="main-content-sections">
        <MainContent />
      </section>

      {/* Divider */}
      <SectionDivider color="#040000" flip />

      {/* Footer Section */}
      <section id="footer-section" className="bg-[#1b1a1a]">
        <Footer isScrollTopVisible={isScrollTopVisible} />
      </section>
    </div>
  );
};

export default App;
