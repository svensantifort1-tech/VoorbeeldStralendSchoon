import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Handshake, Star, Replace, Leaf, Phone, Mail, MapPin, 
  Map, Layers, Building, Home, Instagram, Facebook, Code, CheckCircle, ArrowRight 
} from 'lucide-react';

// --- Reusable Components ---

// Smooth fade-in on scroll hook & component
const FadeIn = ({ children, delay = 0, className = "", threshold = 0.15 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold });
    
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.disconnect(); };
  }, [threshold]);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Luxury Before/After Slider
const BeforeAfterSlider = ({ beforeSrc, afterSrc, beforeAlt, afterAlt }) => {
  const [sliderVal, setSliderVal] = useState(50);
  
  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 group bg-black/50">
      <img src={afterSrc} alt={afterAlt} loading="lazy" className="absolute inset-0 w-full h-full object-cover object-left" />
      <div 
        className="absolute inset-0 w-full h-full z-10"
        style={{ clipPath: `polygon(0 0, ${sliderVal}% 0, ${sliderVal}% 100%, 0 100%)` }}
      >
        <img src={beforeSrc} alt={beforeAlt} loading="lazy" className="absolute inset-0 w-full h-full object-cover object-left" />
      </div>
      <input 
        type="range" 
        min="0" max="100" value={sliderVal} 
        onChange={(e) => setSliderVal(e.target.value)}
        aria-label="Vergelijk voor en na de schoonmaak"
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
      />
      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-[#2DD4BF] z-20 pointer-events-none shadow-[0_0_15px_rgba(0,0,0,0.8)]"
        style={{ left: `${sliderVal}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 backdrop-blur-md border border-[#2DD4BF] rounded-full flex items-center justify-center shadow-xl text-[#2DD4BF] group-hover:scale-110 transition-transform duration-300">
          <Code size={20} className="rotate-90" />
        </div>
      </div>
    </div>
  );
};

// Glass Modal Component for Legal Pages
const GlassModal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-label="Sluit pop-up"
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-[slideUp_0.4s_ease-out]">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="font-['Poppins'] text-2xl font-bold text-white">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto text-white/80 font-['Inter'] leading-relaxed custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'voorwaarden', 'privacy', 'impressum'

  // Inject fonts and styles optimally
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Simulate local storage check for cookies
    setTimeout(() => {
        if (sessionStorage.getItem('cookieSeen') === 'true') {
            setCookieAccepted(true);
        }
    }, 500);

    return () => document.head.removeChild(link);
  }, []);

  // Update active nav item based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'resultaten', 'werkwijze', 'diensten', 'offertes'];
      const scrollPosition = window.scrollY + 200; // Offset

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && 
            element.offsetTop <= scrollPosition && 
            (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const acceptCookie = () => {
      setCookieAccepted(true);
      sessionStorage.setItem('cookieSeen', 'true');
  };

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 8000);
  };

  return (
    <div className="relative min-h-screen text-white font-['Inter'] selection:bg-[#2DD4BF] selection:text-[#1A1A1A] overflow-x-hidden">
      
      {/* Global Luxury Wallpaper Background */}
      <div className="fixed inset-0 z-[-1] bg-[#050505]">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80" 
          alt="Luxury Architecture Background" 
          className="w-full h-full object-cover opacity-30"
        />
        {/* Gradient overlays to darken and enrich the background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f12]/90 via-[#0a0f12]/80 to-[#0a0f12]/95 backdrop-blur-[2px]"></div>
      </div>

      {/* Header - Glassmorphism */}
      <header className="fixed top-0 w-full bg-black/40 backdrop-blur-xl border-b border-white/10 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            {/* Logo */}
            <button 
              onClick={() => scrollToSection('home')}
              aria-label="Ga naar Home"
              className="font-['Poppins'] text-2xl md:text-3xl font-black text-white tracking-tight hover:opacity-80 transition-opacity"
            >
              Stralend<span className="text-[#2DD4BF]">Schoon</span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="Hoofdnavigatie">
              {['Home', 'Resultaten', 'Werkwijze', 'Diensten'].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`font-['Poppins'] font-semibold text-sm lg:text-base transition-colors relative group py-2 ${activeSection === item.toLowerCase() ? 'text-[#2DD4BF]' : 'text-white/80 hover:text-white'}`}
                >
                  {item}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#2DD4BF] transition-all duration-300 ${activeSection === item.toLowerCase() ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>
              ))}
              <button 
                onClick={() => scrollToSection('offertes')}
                className="bg-gradient-to-r from-[#2DD4BF] to-[#0D9488] text-white px-6 lg:px-8 py-3 rounded-full font-['Poppins'] font-bold text-sm shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:-translate-y-0.5 transition-all"
              >
                Offerte aanvragen
              </button>
            </nav>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Sluit menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        <nav 
          aria-label="Mobiele navigatie"
          className={`md:hidden absolute top-full left-0 w-full bg-[#0a0f12]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out origin-top ${isMenuOpen ? 'max-h-[500px] opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-0'}`}
        >
          <div className="flex flex-col p-6 gap-2">
             {['Home', 'Resultaten', 'Werkwijze', 'Diensten'].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`font-['Poppins'] font-bold text-xl p-4 rounded-2xl text-left ${activeSection === item.toLowerCase() ? 'bg-white/10 text-[#2DD4BF]' : 'text-white hover:bg-white/5'}`}
                >
                  {item}
                </button>
              ))}
              <div className="pt-4 mt-2 border-t border-white/10">
                <button 
                  onClick={() => scrollToSection('offertes')}
                  className="bg-gradient-to-r from-[#2DD4BF] to-[#0D9488] text-white w-full py-4 rounded-2xl font-['Poppins'] font-bold text-lg shadow-lg text-center"
                >
                  Offerte aanvragen
                </button>
              </div>
          </div>
        </nav>
      </header>

      {/* Main Content Area - One Page Structure */}
      <main>
        
        {/* --- Hero Section --- */}
        <section id="home" className="relative min-h-screen flex items-center justify-center text-center px-4 pt-20">
          <div className="relative z-10 max-w-5xl mx-auto">
            <FadeIn>
              <h1 className="font-['Poppins'] text-5xl md:text-6xl lg:text-8xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
                Stralend<span className="text-[#2DD4BF]">Schoon</span>
              </h1>
              <p className="font-['Inter'] text-xl md:text-3xl text-white/80 font-light mb-12 max-w-3xl mx-auto leading-relaxed">
                Uw specialist in premium oprit-, terras- en gevelreiniging. Ervaar pure luxe in reiniging.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button 
                  onClick={() => scrollToSection('diensten')}
                  className="bg-gradient-to-r from-[#2DD4BF] to-[#0D9488] text-white px-8 py-4 rounded-full font-['Poppins'] font-semibold text-lg shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  Ontdek onze diensten <ArrowRight size={20} />
                </button>
                <button 
                  onClick={() => scrollToSection('offertes')}
                  className="bg-white/5 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-['Poppins'] font-semibold text-lg hover:bg-white/10 transition-all duration-300 w-full sm:w-auto"
                >
                  Direct offerte
                </button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* --- Values Section --- */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative border-t border-white/5">
          <FadeIn className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-['Poppins'] text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">De <span className="text-[#2DD4BF]">Standaard</span> in Schoon</h2>
            <p className="font-['Inter'] text-white/70 text-xl leading-relaxed">
              Schoon is meer dan alleen netjes. Het is een frisse start, een prestigieuze uitstraling en een gezonde leefomgeving.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Handshake, title: "Betrouwbaar", desc: "Afspraken zijn er om na te komen. U kunt blindelings op ons rekenen." },
              { icon: Star, title: "Perfectie", desc: "We leveren consequent hoogwaardig werk, met ongekende precisie." },
              { icon: Replace, title: "Flexibiliteit", desc: "Ieder pand is uniek. Daarom bieden we altijd exclusief maatwerk." },
              { icon: Leaf, title: "Duurzaam", desc: "Milieuvriendelijke producten en methodes voor een heldere toekomst." }
            ].map((val, idx) => (
              <FadeIn key={idx} delay={idx * 100} className="bg-white/5 backdrop-blur-lg rounded-[2rem] p-8 shadow-2xl hover:shadow-[0_20px_50px_rgba(45,212,191,0.1)] transition-all duration-500 hover:-translate-y-2 border border-white/10 group">
                <div className="w-16 h-16 bg-white/10 group-hover:bg-[#2DD4BF] border border-white/20 group-hover:border-[#2DD4BF] rounded-2xl flex items-center justify-center text-[#2DD4BF] group-hover:text-black transition-all duration-500 mb-8 rotate-3 group-hover:rotate-0 shadow-lg">
                  <val.icon size={32} />
                </div>
                <h3 className="font-['Poppins'] text-2xl font-bold text-white mb-4">{val.title}</h3>
                <p className="font-['Inter'] text-white/60 leading-relaxed text-lg">{val.desc}</p>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* --- Before/After Section --- */}
        <section id="resultaten" className="py-32 px-4 sm:px-6 lg:px-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <FadeIn className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="font-['Poppins'] text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Verbluffende <span className="text-[#2DD4BF]">Resultaten</span></h2>
              <p className="font-['Inter'] text-white/70 text-xl leading-relaxed">
                Aanschouw de transformatie. Schuif de balk heen en weer om de impact van onze dieptereiniging te ervaren.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <FadeIn>
                <BeforeAfterSlider 
                  beforeSrc="voorterras.jpg" 
                  afterSrc="naterras.jpg" 
                  beforeAlt="Terras voor reiniging met vuil en mos" 
                  afterAlt="Terras na reiniging, schoon en stralend"
                />
                <p className="text-center mt-6 font-['Poppins'] font-semibold text-[#2DD4BF] text-lg uppercase tracking-widest">Terras Reiniging</p>
              </FadeIn>
              <FadeIn delay={200}>
                <BeforeAfterSlider 
                  beforeSrc="voorserre.jpg" 
                  afterSrc="naserre.jpg" 
                  beforeAlt="Serre voor reiniging met groene aanslag" 
                  afterAlt="Serre na reiniging, helder glas"
                />
                <p className="text-center mt-6 font-['Poppins'] font-semibold text-[#2DD4BF] text-lg uppercase tracking-widest">Glas & Serre Reiniging</p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* --- Timeline Section --- */}
        <section id="werkwijze" className="py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/5">
          <FadeIn className="text-center mb-20">
            <h2 className="font-['Poppins'] text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Exclusieve <span className="text-[#2DD4BF]">Werkwijze</span></h2>
            <p className="font-['Inter'] text-white/70 text-xl leading-relaxed">
              Een discrete en uiterst gestructureerde aanpak. Volledige transparantie vanaf het eerste moment.
            </p>
          </FadeIn>

          <div className="relative border-l-2 border-white/10 ml-6 md:ml-0 md:border-none">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2"></div>
            
            {[
              { title: "Consultatie", desc: "We starten met een persoonlijk gesprek en een grondige inventarisatie van uw wensen." },
              { title: "Offerte op Maat", desc: "U ontvangt van ons een duidelijke, hoogwaardige offerte zonder verborgen kosten." },
              { title: "Vakkundige Uitvoering", desc: "Onze experts gaan efficiënt, veilig en met uiterste precisie te werk." },
              { title: "Stralend Resultaat", desc: "We lopen samen alles na. Uw absolute tevredenheid is onze garantie." }
            ].map((step, idx) => (
              <FadeIn key={idx} delay={idx * 150} className={`relative flex items-center justify-between md:justify-normal w-full mb-16 last:mb-0 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Desktop Timeline dot */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-black border border-[#2DD4BF] items-center justify-center z-10 font-['Poppins'] font-bold text-xl text-[#2DD4BF] shadow-[0_0_15px_rgba(45,212,191,0.3)]">
                  {idx + 1}
                </div>
                
                {/* Mobile timeline dot */}
                <div className="md:hidden absolute -left-[29px] w-14 h-14 rounded-full bg-black border border-[#2DD4BF] flex items-center justify-center z-10 font-['Poppins'] font-bold text-xl text-[#2DD4BF] shadow-sm">
                  {idx + 1}
                </div>

                <div className="w-full md:w-[45%] pl-12 md:pl-0">
                  <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 hover:border-[#2DD4BF]/50 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group">
                    <h3 className="font-['Poppins'] text-2xl font-bold text-white mb-3 group-hover:text-[#2DD4BF] transition-colors">{step.title}</h3>
                    <p className="font-['Inter'] text-white/60 text-lg">{step.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* --- Diensten Section --- */}
        <section id="diensten" className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen border-t border-white/5">
          <FadeIn className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-['Poppins'] text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Onze <span className="text-[#2DD4BF]">Diensten</span></h2>
            <p className="font-['Inter'] text-white/70 text-xl leading-relaxed">
              Kies voor ultiem vakmanschap. Van nauwkeurig onderhoud tot een spectaculaire dieptereiniging, wij laten uw pand in oude glorie herstellen.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {[
              { img: "Gemini_Generated_Image_tn9jf0tn9jf0tn9j.jpg", icon: Map, title: "Oprit Reiniging", desc: "Een verzorgde oprit is het visitekaartje van uw woning. Wij verwijderen groene aanslag, olie- en bandensporen vakkundig." },
              { img: "Gemini_Generated_Image_6ez2sk6ez2sk6ez2.jpg", icon: Layers, title: "Terras Reiniging", desc: "Vuil, mos of verkleuring? Wij pakken uw terras uiterst grondig en veilig aan, zodat u er in luxe van kunt genieten." },
              { img: "Gemini_Generated_Image_kxpwo3kxpwo3kxpw.jpg", icon: Building, title: "Gevel Reiniging", desc: "Een schone gevel beschermt de waarde van uw pand. Wij zorgen dat uw woning er weer luxueus en representatief uitziet." },
              { img: "Gemini_Generated_Image_yedamiyedamiyeda.jpg", icon: Home, title: "Glas & Serre", desc: "Een schone overkapping of serre zorgt voor subliem helder uitzicht. Wij laten het glas glanzen met veilige, hoogwaardige technieken." }
            ].map((service, idx) => (
              <FadeIn key={idx} delay={idx * 100} className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_60px_rgba(45,212,191,0.1)] transition-all duration-500 group flex flex-col border border-white/10">
                <div className="relative h-72 overflow-hidden bg-black/50">
                  <img src={service.img} alt={service.title} loading="lazy" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                  <h3 className="absolute bottom-6 left-8 font-['Poppins'] text-3xl font-bold text-white z-10">{service.title}</h3>
                </div>
                <div className="p-8 relative flex-grow flex flex-col">
                  <div className="absolute -top-14 right-8 w-20 h-20 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl text-[#2DD4BF] group-hover:border-[#2DD4BF] transition-colors duration-500 rotate-3 group-hover:rotate-0">
                    <service.icon size={36} strokeWidth={1.5} />
                  </div>
                  <p className="font-['Inter'] text-white/70 text-lg mb-8 flex-grow leading-relaxed pr-8 mt-2">{service.desc}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="inline-block bg-white/5 border border-white/10 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
                      Vanaf €3,50 / m²
                    </span>
                    <button 
                      onClick={() => scrollToSection('offertes')}
                      className="text-[#2DD4BF] font-semibold hover:text-white transition-colors flex items-center gap-2"
                      aria-label={`Vraag offerte aan voor ${service.title}`}
                    >
                      Offerte <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* --- Offertes Section --- */}
        <section id="offertes" className="py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen border-t border-white/5">
          <FadeIn className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="font-['Poppins'] text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Vrijblijvende <span className="text-[#2DD4BF]">Offerte</span></h2>
            <p className="font-['Inter'] text-white/70 text-xl leading-relaxed">
              Vraag binnen enkele minuten een luxueuze offerte op maat aan. Duidelijke prijzen, absolute perfectie.
            </p>
          </FadeIn>

          <FadeIn>
            {submitted ? (
               <div className="bg-white/5 backdrop-blur-xl border border-[#2DD4BF]/50 rounded-[2.5rem] p-16 text-center shadow-2xl">
                  <div className="w-24 h-24 bg-black/50 border border-[#2DD4BF] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <CheckCircle size={48} className="text-[#2DD4BF]" />
                  </div>
                  <h3 className="font-['Poppins'] text-3xl font-bold text-white mb-4">Aanvraag in Behandeling!</h3>
                  <p className="text-white/70 text-lg max-w-lg mx-auto">Hartelijk dank voor uw interesse in StralendSchoon. Onze specialisten nemen zo spoedig mogelijk contact met u op. <br/><br/><span className="text-sm opacity-50">(Dit is een demonstratie applicatie, er is geen echte data verstuurd).</span></p>
               </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 p-8 md:p-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label htmlFor="naam" className="block font-['Poppins'] text-sm font-semibold text-white/80 mb-2">Volledige Naam <span className="text-[#2DD4BF]">*</span></label>
                    <input id="naam" type="text" required aria-required="true" className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-black/40 text-white placeholder-gray-500 focus:bg-black/60 focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF] focus:outline-none transition-all font-['Inter'] text-lg" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-['Poppins'] text-sm font-semibold text-white/80 mb-2">E-mailadres <span className="text-[#2DD4BF]">*</span></label>
                    <input id="email" type="email" required aria-required="true" className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-black/40 text-white placeholder-gray-500 focus:bg-black/60 focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF] focus:outline-none transition-all font-['Inter'] text-lg" />
                  </div>
                  <div>
                    <label htmlFor="telefoon" className="block font-['Poppins'] text-sm font-semibold text-white/80 mb-2">Telefoonnummer <span className="text-[#2DD4BF]">*</span></label>
                    <input id="telefoon" type="tel" required aria-required="true" className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-black/40 text-white placeholder-gray-500 focus:bg-black/60 focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF] focus:outline-none transition-all font-['Inter'] text-lg" />
                  </div>
                  <div>
                    <label htmlFor="oppervlakte" className="block font-['Poppins'] text-sm font-semibold text-white/80 mb-2">Geschatte oppervlakte (m²)</label>
                    <input id="oppervlakte" type="number" min="0" className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-black/40 text-white placeholder-gray-500 focus:bg-black/60 focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF] focus:outline-none transition-all font-['Inter'] text-lg" />
                  </div>
                </div>

                <div className="mb-8">
                  <label htmlFor="adres" className="block font-['Poppins'] text-sm font-semibold text-white/80 mb-2">Adres & Woonplaats <span className="text-[#2DD4BF]">*</span></label>
                  <input id="adres" type="text" required aria-required="true" className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-black/40 text-white placeholder-gray-500 focus:bg-black/60 focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF] focus:outline-none transition-all font-['Inter'] text-lg" />
                </div>

                <fieldset className="mb-8">
                  <legend className="block font-['Poppins'] text-sm font-semibold text-white/80 mb-4">Selecteer gewenste exclusieve diensten:</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Oprit reiniging', 'Terras reiniging', 'Gevel reiniging', 'Glas & Serre reiniging'].map((dienst, i) => (
                      <label key={i} className="flex items-center gap-4 p-5 border border-white/10 rounded-2xl bg-black/20 cursor-pointer hover:border-[#2DD4BF]/50 hover:bg-black/40 transition-colors group">
                        <input type="checkbox" name="diensten" value={dienst} className="w-6 h-6 bg-black/50 rounded-md border-white/20 text-[#2DD4BF] focus:ring-[#2DD4BF] focus:ring-offset-black cursor-pointer" />
                        <span className="font-['Inter'] text-white/80 font-medium text-lg group-hover:text-white">{dienst}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="mb-8">
                  <label htmlFor="foto" className="block font-['Poppins'] text-sm font-semibold text-white/80 mb-2">Upload foto van de situatie (Optioneel)</label>
                  <input id="foto" type="file" accept="image/*" className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-black/40 text-white/60 focus:bg-black/60 focus:border-[#2DD4BF] transition-colors font-['Inter'] file:mr-6 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-[#2DD4BF] hover:file:text-black file:cursor-pointer file:transition-colors" />
                </div>

                <div className="mb-10">
                  <label htmlFor="opmerkingen" className="block font-['Poppins'] text-sm font-semibold text-white/80 mb-2">Bijzonderheden of vragen</label>
                  <textarea id="opmerkingen" rows="4" className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-black/40 text-white placeholder-gray-500 focus:bg-black/60 focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF] focus:outline-none transition-all font-['Inter'] text-lg resize-none"></textarea>
                </div>

                <div className="text-center sm:text-right">
                  <button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-[#2DD4BF] to-[#0D9488] text-white px-12 py-5 rounded-full font-['Poppins'] font-bold text-lg shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:-translate-y-1 transition-all duration-300">
                    Verstuur Aanvraag
                  </button>
                </div>
              </form>
            )}
          </FadeIn>
        </section>
      </main>

      {/* --- Glass Modals for Legal Pages --- */}
      <GlassModal 
        isOpen={activeModal === 'voorwaarden'} 
        onClose={() => setActiveModal(null)} 
        title="Algemene Voorwaarden"
      >
        <p className="mb-4 text-lg">Deze algemene voorwaarden zijn van toepassing op alle offertes, diensten, overeenkomsten en leveringen van StralendSchoon, tenzij uitdrukkelijk schriftelijk anders is overeengekomen.</p>
        <p className="text-lg mb-4"><strong>Artikel 1: Aansprakelijkheid</strong><br/> StralendSchoon is niet aansprakelijk voor schade die ontstaat door het opvolgen van onjuiste of onvolledige informatie van de klant. De aansprakelijkheid is in alle gevallen beperkt tot het bedrag van de betreffende factuur.</p>
        <p className="text-lg mb-4"><strong>Artikel 2: Uitvoering</strong><br/> Wij verplichten ons om de werkzaamheden naar beste inzicht en vermogen en overeenkomstig de eisen van goed vakmanschap uit te voeren.</p>
      </GlassModal>

      <GlassModal 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal(null)} 
        title="Privacyverklaring"
      >
        <p className="text-lg mb-4">Bij StralendSchoon hechten we grote waarde aan uw privacy en de bescherming van uw persoonsgegevens. We gaan uiterst zorgvuldig om met uw informatie.</p>
        <p className="text-lg mb-4"><strong>Gegevensgebruik:</strong><br/> Wij gebruiken uw gegevens uitsluitend voor het beantwoorden van uw vragen, het opstellen van offertes en de uitvoering van overeengekomen diensten.</p>
        <p className="text-lg">Uw gegevens worden veilig opgeslagen en nooit zonder uw uitdrukkelijke toestemming met derden gedeeld.</p>
      </GlassModal>

      <GlassModal 
        isOpen={activeModal === 'impressum'} 
        onClose={() => setActiveModal(null)} 
        title="Impressum"
      >
        <address className="not-italic text-lg space-y-2">
          <strong>StralendSchoon B.V.</strong><br/>
          Voorbeeldstraat 123<br/>
          1234 AB Voorbeeldstad, Nederland<br/><br/>
          <span className="block mt-4">KVK-nummer: 12345678</span>
          <span className="block">BTW-nummer: NL123456789B01</span><br/>
          <strong>Directie:</strong><br/>
          Vertegenwoordigd door het bestuur van StralendSchoon.
        </address>
      </GlassModal>

      {/* --- Footer --- */}
      <footer className="bg-black/80 backdrop-blur-3xl border-t border-white/10 pt-24 pb-8 px-4 sm:px-6 lg:px-8 mt-auto rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5">
              <button 
                onClick={() => scrollToSection('home')}
                className="font-['Poppins'] text-3xl font-black text-white tracking-tight mb-6"
                aria-label="Terug naar Home"
              >
                Stralend<span className="text-[#2DD4BF]">Schoon</span>
              </button>
              <p className="font-light text-lg mb-8 max-w-md text-white/60 leading-relaxed">
                De absolute standaard in luxe buitenreiniging. Geef uw pand de prestige die het verdient.
              </p>
              <div className="flex gap-4">
                <a href="#" aria-label="Instagram pagina" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#2DD4BF] hover:bg-[#2DD4BF] hover:border-[#2DD4BF] hover:text-black hover:-translate-y-1 transition-all duration-300">
                  <Instagram size={20} />
                </a>
                <a href="#" aria-label="Facebook pagina" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#2DD4BF] hover:bg-[#2DD4BF] hover:border-[#2DD4BF] hover:text-black hover:-translate-y-1 transition-all duration-300">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
            
            <div className="md:col-span-3">
              <h3 className="font-['Poppins'] text-xl text-white font-bold mb-6">Contact</h3>
              <ul className="space-y-4 text-white/70">
                <li><a href="tel:0612345678" className="hover:text-[#2DD4BF] transition-colors flex items-center gap-3"><Phone size={18}/> 06-12345678</a></li>
                <li><a href="mailto:info@stralendschoon.nl" className="hover:text-[#2DD4BF] transition-colors flex items-center gap-3"><Mail size={18}/> info@stralendschoon.nl</a></li>
                <li className="flex items-center gap-3"><MapPin size={18}/> Zuid-Holland & Zeeland</li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h3 className="font-['Poppins'] text-xl text-white font-bold mb-6">Informatie</h3>
              <ul className="space-y-4 text-white/70">
                <li>
                  <button onClick={() => setActiveModal('voorwaarden')} className="hover:text-[#2DD4BF] transition-colors text-left">
                    Algemene voorwaarden
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('privacy')} className="hover:text-[#2DD4BF] transition-colors text-left">
                    Privacyverklaring
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('impressum')} className="hover:text-[#2DD4BF] transition-colors text-left">
                    Impressum
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/50">
            <p>&copy; {new Date().getFullYear()} StralendSchoon. Absolute Perfectie.</p>
            <div className="flex items-center gap-2">
              <span>Crafted by</span>
              <a href="https://www.fyxo.online/" target="_blank" rel="noreferrer" aria-label="Website gemaakt door FYXO" className="font-['Poppins'] font-black text-xl text-white tracking-widest hover:text-[#2DD4BF] transition-colors">
                FYXO
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- Cookie Banner --- */}
      {!cookieAccepted && (
        <aside 
          aria-label="Cookie instellingen"
          className="fixed bottom-6 left-6 right-6 md:left-8 md:right-auto md:max-w-md bg-black/80 backdrop-blur-2xl text-white p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 z-[90] flex flex-col sm:flex-row items-center gap-6 animate-[slideUp_0.5s_ease-out]"
        >
          <p className="text-sm font-['Inter'] leading-relaxed flex-grow text-center sm:text-left text-white/70">
            Wij gebruiken cookies voor een optimale ervaring. Bekijk onze <button onClick={() => setActiveModal('privacy')} className="text-[#2DD4BF] underline font-medium hover:text-white transition-colors">privacyverklaring</button>.
          </p>
          <div className="flex gap-3 w-full sm:w-auto shrink-0">
            <button 
              onClick={acceptCookie}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-colors"
            >
              Weigeren
            </button>
            <button 
              onClick={acceptCookie}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#0D9488] text-white text-sm font-bold hover:shadow-[0_0_15px_rgba(45,212,191,0.4)] transition-all"
            >
              Accepteren
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
