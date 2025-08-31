import { useState, useEffect } from 'react';

// Mock analytics for tracking affiliate clicks
const trackClick = (label) => {
  console.log(`Tracking click: ${label}`);
  // Extend with Google Analytics: gtag('event', 'click', { event_category: 'Affiliate', event_label: label });
};

function App() {
  const [isMobileNavActive, setIsMobileNavActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [testimonialSlide, setTestimonialSlide] = useState(0);
  const [teamSlide, setTeamSlide] = useState(0);
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, error: '', success: '' });
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);

  // Scroll handling for header and scroll-top
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      setIsScrollTopVisible(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typing animation for Hero
  const typedStrings = ['Earn Commissions', 'Promote Products', 'Grow Your Income'];
  useEffect(() => {
    const type = () => {
      const currentString = typedStrings[stringIndex];
      if (isDeleting) {
        setTypedText(currentString.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
        if (charIndex === 0) {
          setIsDeleting(false);
          setStringIndex((stringIndex + 1) % typedStrings.length);
        }
      } else {
        setTypedText(currentString.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
        if (charIndex === currentString.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    };
    const timer = setTimeout(type, isDeleting ? 50 : 100);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, stringIndex]);

  // Carousel for Testimonials
  const testimonials = [
    { name: 'John Doe', role: 'Affiliate Marketer', quote: 'Payventrax helped me earn $5,000 in my first month!', image: 'https://via.placeholder.com/100' },
    { name: 'Jane Smith', role: 'Blogger', quote: 'The tracking tools are fantastic and easy to use.', image: 'https://via.placeholder.com/100' },
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Carousel for Team
  const team = [
    { name: 'Alice Brown', role: 'Affiliate Manager', image: 'https://via.placeholder.com/100', social: { twitter: '#', linkedin: '#' } },
    { name: 'Bob Green', role: 'Marketing Lead', image: 'https://via.placeholder.com/100', social: { twitter: '#', linkedin: '#' } },
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setTeamSlide((prev) => (prev + 1) % team.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [team.length]);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormStatus({ loading: false, error: 'Please fill in all fields.', success: '' });
      return;
    }
    setFormStatus({ loading: true, error: '', success: '' });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock AJAX
      setFormStatus({ loading: false, error: '', success: 'Your message has been sent. Thank you!' });
      setFormData({ name: '', email: '', subject: '', message: '' });
      trackClick('Contact_Form_Submit');
    } catch {
      setFormStatus({ loading: false, error: 'Failed to send message. Please try again.', success: '' });
    }
  };

  // Features data
  const features = [
    { title: 'High Commissions', description: 'Earn up to 50% commission on every sale.', icon: 'bi bi-cash-stack' },
    { title: 'Easy Tracking', description: 'Real-time analytics to monitor your clicks and earnings.', icon: 'bi bi-graph-up' },
    { title: 'Wide Range of Products', description: 'Promote from a curated selection of top-tier products.', icon: 'bi bi-box-seam' },
  ];

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackClick('Scroll_Top');
  };

  return (
    <div className="bg-[#040000] text-white font-['Roboto',sans-serif]">
      {/* Header */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all ${isScrolled ? 'bg-[#1b1a1a]/80 backdrop-blur-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-['Raleway',sans-serif] font-bold text-[#e59d02]">Payventrax</a>
          <nav className={`flex items-center ${isMobileNavActive ? 'flex-col fixed top-0 left-0 w-full h-full bg-[#1b1a1a] pt-20' : 'hidden md:flex'}`}>
            {['home', 'about', 'features', 'services', 'testimonials', 'pricing', 'faq', 'team', 'contact'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="px-4 py-2 text-white hover:text-[#e59d02] transition-colors"
                onClick={() => {
                  if (isMobileNavActive) setIsMobileNavActive(false);
                  trackClick(`Nav_${item}`);
                }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            ))}
          </nav>
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsMobileNavActive(!isMobileNavActive)}
            aria-expanded={isMobileNavActive}
            aria-label="Toggle navigation menu"
          >
            {isMobileNavActive ? <i className="bi bi-x"></i> : <i className="bi bi-list"></i>}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative pt-24 pb-12 flex items-center min-h-screen bg-gradient-to-b from-[#040000] to-[#1b1a1a]">
        <style>
          {`
            .hero::before {
              content: '';
              position: absolute;
              top: 20%;
              left: 10%;
              width: 300px;
              height: 300px;
              background: radial-gradient(circle, rgba(229, 157, 2, 0.3), transparent);
              border-radius: 50%;
              animation: float 6s ease-in-out infinite;
              z-index: 0;
            }
            .hero::after {
              content: '';
              position: absolute;
              bottom: 10%;
              right: 15%;
              width: 200px;
              height: 200px;
              background: radial-gradient(circle, rgba(229, 157, 2, 0.2), transparent);
              border-radius: 50%;
              animation: float 4s ease-in-out infinite;
              z-index: 0;
            }
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeInUp {
              animation: fadeInUp 0.6s ease-in-out;
            }
          `}
        </style>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10 animate-fadeInUp">
          <h1 className="text-4xl md:text-6xl font-['Raleway',sans-serif] font-bold mb-4">
            Join Payventrax for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e59d02] to-[#ffca5b]">{typedText}</span>
          </h1>
          <p className="text-lg md:text-xl mb-6">Start earning today by promoting top-tier products and services with our affiliate program.</p>
          <a
            href="https://example.com/signup?aff=payventrax"
            className="inline-block bg-[#e59d02] text-white px-6 py-3 rounded-full hover:bg-[#ffca5b] transition-transform transform hover:scale-105"
            onClick={() => trackClick('Hero_Signup')}
          >
            Join Now
          </a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-12 bg-[#040000]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-['Raleway',sans-serif] font-bold text-center mb-8 relative after:content-[''] after:block after:w-16 after:h-1 after:bg-[#e59d02] after:mx-auto after:mt-2">
            About Payventrax
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="animate-fadeInUp">
              <p className="text-lg">Payventrax is your gateway to earning passive income through affiliate marketing. Partner with us to promote high-quality products and earn competitive commissions.</p>
            </div>
            <div className="relative group animate-fadeInUp">
              <img src="https://via.placeholder.com/400" alt="Affiliate marketing" className="w-full rounded-lg shadow-lg group-hover:scale-105 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 bg-[#1b1a1a]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-['Raleway',sans-serif] font-bold text-center mb-8 relative after:content-[''] after:block after:w-16 after:h-1 after:bg-[#e59d02] after:mx-auto after:mt-2">
            Why Choose Payventrax
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-[#040000] rounded-lg shadow-lg hover:shadow-xl transition-shadow animate-fadeInUp">
                <i className={`${feature.icon} text-4xl text-[#e59d02] mb-4`}></i>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            {features.map((feature, index) => (
              <button
                key={index}
                className={`px-4 py-2 mr-2 ${activeFeatureTab === index ? 'bg-[#e59d02] text-white' : 'bg-[#040000] text-white'} rounded-full transition-colors`}
                onClick={() => setActiveFeatureTab(index)}
              >
                {feature.title}
              </button>
            ))}
            <div className="mt-6 p-6 bg-[#040000] rounded-lg animate-fadeInUp">
              <h3 className="text-xl font-bold mb-2">{features[activeFeatureTab].title}</h3>
              <p>{features[activeFeatureTab].description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-12 bg-[#040000]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-['Raleway',sans-serif] font-bold text-center mb-8 relative after:content-[''] after:block after:w-16 after:h-1 after:bg-[#e59d02] after:mx-auto after:mt-2">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Affiliate Training', description: 'Access free training to maximize your earnings.', icon: 'bi bi-book' },
              { title: 'Dedicated Support', description: 'Get 24/7 support from our affiliate team.', icon: 'bi bi-headset' },
              { title: 'Marketing Tools', description: 'Use our banners, links, and widgets to promote.', icon: 'bi bi-tools' },
            ].map((service, index) => (
              <div key={index} className="relative p-6 bg-[#1b1a1a] rounded-lg shadow-lg hover:shadow-xl transition-shadow animate-fadeInUp">
                <span className="absolute top-0 left-0 text-[#e59d02] text-2xl font-bold">{`0${index + 1}`}</span>
                <i className={`${service.icon} text-4xl text-[#e59d02] mb-4 mt-6`}></i>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-12 bg-[#1b1a1a]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-['Raleway',sans-serif] font-bold text-center mb-8 relative after:content-[''] after:block after:w-16 after:h-1 after:bg-[#e59d02] after:mx-auto after:mt-2">
            What Our Affiliates Say
          </h2>
          <div className="relative overflow-hidden">
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`w-full flex-shrink-0 transition-transform duration-500 ${index === testimonialSlide ? 'translate-x-0' : 'translate-x-full'}`}
                >
                  <div className="p-6 bg-[#040000] rounded-lg text-center animate-fadeInUp">
                    <img src={testimonial.image} alt={testimonial.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
                    <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                    <h3 className="text-xl font-bold">{testimonial.name}</h3>
                    <p className="text-[#e59d02]">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 mx-1 rounded-full ${index === testimonialSlide ? 'bg-[#e59d02]' : 'bg-gray-500'}`}
                  onClick={() => setTestimonialSlide(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-12 bg-[#040000]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-['Raleway',sans-serif] font-bold text-center mb-8 relative after:content-[''] after:block after:w-16 after:h-1 after:bg-[#e59d02] after:mx-auto after:mt-2">
            Affiliate Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Basic', price: 'Free', features: ['5% Commission', 'Basic Tracking', 'Email Support'], isPopular: false },
              { name: 'Pro', price: '$29/mo', features: ['20% Commission', 'Advanced Tracking', 'Priority Support'], isPopular: true },
              { name: 'Enterprise', price: '$99/mo', features: ['50% Commission', 'Full Analytics', 'Dedicated Manager'], isPopular: false },
            ].map((plan, index) => (
              <div key={index} className={`p-6 bg-[#1b1a1a] rounded-lg shadow-lg hover:shadow-xl transition-shadow relative ${plan.isPopular ? 'border-2 border-[#e59d02]' : ''}`}>
                {plan.isPopular && <span className="absolute top-0 right-0 bg-[#e59d02] text-white px-2 py-1 rounded-bl-lg">Popular</span>}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-2xl font-bold text-[#e59d02] mb-4">{plan.price}</p>
                <ul className="mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="mb-2">{feature}</li>
                  ))}
                </ul>
                <a
                  href={`https://example.com/signup?plan=${plan.name.toLowerCase()}&aff=payventrax`}
                  className="inline-block bg-[#e59d02] text-white px-6 py-3 rounded-full hover:bg-[#ffca5b] transition-transform transform hover:scale-105"
                  onClick={() => trackClick(`Pricing_${plan.name}`)}
                >
                  Choose Plan
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12 bg-[#1b1a1a]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-['Raleway',sans-serif] font-bold text-center mb-8 relative after:content-[''] after:block after:w-16 after:h-1 after:bg-[#e59d02] after:mx-auto after:mt-2">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              { question: 'How do I join Payventrax?', answer: 'Sign up via our website, choose a plan, and start promoting products with your unique affiliate links.' },
              { question: 'What is the commission rate?', answer: 'Commissions range from 5% to 50% depending on your plan.' },
              { question: 'How are payments processed?', answer: 'Payments are made monthly via PayPal or bank transfer.' },
            ].map((faq, index) => (
              <div key={index} className="bg-[#040000] rounded-lg overflow-hidden">
                <button
                  className="w-full text-left p-4 flex justify-between items-center"
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                  aria-expanded={activeFAQ === index}
                >
                  <h3 className="text-lg font-bold">{faq.question}</h3>
                  <i className={`bi bi-plus text-[#e59d02] ${activeFAQ === index ? 'rotate-45' : ''}`}></i>
                </button>
                <div className={`grid transition-all ${activeFAQ === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden p-4">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-12 bg-[#040000]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-['Raleway',sans-serif] font-bold text-center mb-8 relative after:content-[''] after:block after:w-16 after:h-1 after:bg-[#e59d02] after:mx-auto after:mt-2">
            Our Team
          </h2>
          <div className="relative overflow-hidden">
            <div className="flex">
              {team.map((member, index) => (
                <div
                  key={index}
                  className={`w-full flex-shrink-0 transition-transform duration-500 ${index === teamSlide ? 'translate-x-0' : 'translate-x-full'}`}
                >
                  <div className="p-6 bg-[#1b1a1a] rounded-lg text-center relative group animate-fadeInUp">
                    <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-[#e59d02] mb-4">{member.role}</p>
                    <div className="absolute inset-0 flex items-center justify-center bg-[#040000]/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={member.social.twitter} className="mx-2 text-[#e59d02]"><i className="bi bi-twitter-x"></i></a>
                      <a href={member.social.linkedin} className="mx-2 text-[#e59d02]"><i className="bi bi-linkedin"></i></a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              {team.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 mx-1 rounded-full ${index === teamSlide ? 'bg-[#e59d02]' : 'bg-gray-500'}`}
                  onClick={() => setTeamSlide(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-12 bg-[#1b1a1a]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-['Raleway',sans-serif] font-bold text-center mb-8 relative after:content-[''] after:block after:w-16 after:h-1 after:bg-[#e59d02] after:mx-auto after:mt-2">
            Contact Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="p-4 bg-[#040000] rounded-lg flex items-center">
                <i className="bi bi-geo-alt text-[#e59d02] text-2xl mr-2"></i>
                <span>123 Affiliate St, Marketing City, USA</span>
              </div>
              <div className="p-4 bg-[#040000] rounded-lg flex items-center">
                <i className="bi bi-envelope text-[#e59d02] text-2xl mr-2"></i>
                <span>support@payventrax.com</span>
              </div>
              <div className="p-4 bg-[#040000] rounded-lg flex items-center">
                <i className="bi bi-phone text-[#e59d02] text-2xl mr-2"></i>
                <span>+1 234 567 890</span>
              </div>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full p-3 bg-[#040000] border border-[#e59d02] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#e59d02]"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full p-3 bg-[#040000] border border-[#e59d02] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#e59d02]"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="w-full p-3 bg-[#040000] border border-[#e59d02] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#e59d02]"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
              <textarea
                name="message"
                placeholder="Message"
                className="w-full p-3 bg-[#040000] border border-[#e59d02] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#e59d02]"
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
              {formStatus.loading && <div className="text-center text-[#e59d02]">Loading...</div>}
              {formStatus.error && <div className="text-center text-red-500">{formStatus.error}</div>}
              {formStatus.success && <div className="text-center text-green-500">{formStatus.success}</div>}
              <button
                type="submit"
                className="w-full bg-[#e59d02] text-white px-6 py-3 rounded-full hover:bg-[#ffca5b] transition-transform transform hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Scroll Top */}
      <button
        className={`fixed bottom-4 right-4 bg-[#e59d02] text-white p-3 rounded-full transition-opacity ${isScrollTopVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <i className="bi bi-arrow-up"></i>
      </button>
    </div>
  );
}

export default App;