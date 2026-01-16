import { useEffect, useState, useCallback, useRef } from 'react';

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'cover', label: 'Cover' },
  { id: 'artiste', label: 'Artiste' },
  { id: 'song', label: 'Song' },
] as const;

const VISIBILITY_THRESHOLD = 0.3;

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const tickingRef = useRef(false);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const viewportCenter = windowHeight / 2;

      let activeSectionId = SECTIONS[0].id;
      let maxVisibility = 0;

      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(windowHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const visibility = rect.height > 0 ? visibleHeight / rect.height : 0;

          if (visibility > maxVisibility) {
            maxVisibility = visibility;
            activeSectionId = section.id;
          }
        }
      }

      if (maxVisibility < VISIBILITY_THRESHOLD) {
        let closestSection = SECTIONS[0].id;
        let closestDistance = Infinity;

        for (const section of SECTIONS) {
          const element = document.getElementById(section.id);
          if (element) {
            const rect = element.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const distance = Math.abs(viewportCenter - sectionCenter);

            if (rect.top < windowHeight && rect.bottom > 0 && distance < closestDistance) {
              closestDistance = distance;
              closestSection = section.id;
            }
          }
        }
        activeSectionId = closestSection;
      }

      setActiveSection(activeSectionId);
    };

    const optimizedScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          handleScroll();
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    const scrollContainer = document.querySelector('.snap-y');
    
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', optimizedScroll, { passive: true });
    } else {
      window.addEventListener('scroll', optimizedScroll, { passive: true });
    }
    
    handleScroll();

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', optimizedScroll);
      } else {
        window.removeEventListener('scroll', optimizedScroll);
      }
    };
  }, []);

  return (
    <nav 
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50 ml-1 sm:ml-2 md:ml-4 lg:ml-6 xl:ml-8 hidden sm:block"
      aria-label="Navigation principale"
    >
      <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`relative px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 lg:py-3 text-left transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black ${
              activeSection === section.id
                ? 'text-white font-bold'
                : 'text-white/50 hover:text-white/80 active:text-white/90'
            }`}
            aria-label={`Aller à la section ${section.label}`}
            aria-current={activeSection === section.id ? 'page' : undefined}
          >
            <span className="relative z-10 text-[10px] sm:text-xs md:text-sm lg:text-base uppercase tracking-wider pointer-events-none">
              {section.label}
            </span>
            {activeSection === section.id && (
              <>
                <span 
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-5 sm:h-6 md:h-8 lg:h-10 bg-white rounded-r-full transition-all duration-300 shadow-lg shadow-white/50" 
                  aria-hidden="true"
                />
                <span 
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/20 transition-all duration-300" 
                  aria-hidden="true"
                />
              </>
            )}
            <span
              className={`absolute left-0 top-0 bottom-0 w-0.5 bg-white/10 transition-all duration-300 group-hover:bg-white/20 ${
                activeSection === section.id ? 'opacity-0' : 'opacity-100'
              }`}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
