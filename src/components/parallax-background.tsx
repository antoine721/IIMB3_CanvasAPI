import { useEffect, useState } from "react";
import { PARALLAX_CONFIG } from "../constants/parallax";
import { useParallax } from "../hooks/use-parallax";

export default function ParallaxBackground() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInHomeSection, setIsInHomeSection] = useState(true);
  const { getTransform } = useParallax();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const homeSection = document.getElementById("home");
      if (homeSection) {
        const rect = homeSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setIsInHomeSection(isVisible);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isInHomeSection) {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {PARALLAX_CONFIG.layers.map((layer, index) => (
        <div
          key={`layer-${index}`}
          className="absolute inset-0 flex items-center justify-center transition-transform duration-75 ease-out"
          style={{
            zIndex: layer.zIndex,
            transform: getTransform(layer.speed),
            willChange: "transform",
          }}
        >
          <img
            src={layer.image}
            alt=""
            aria-hidden="true"
            width={1920}
            height={1080}
            className="w-full h-full sm:w-[110%] sm:h-[110%] md:w-[120%] md:h-[120%] object-cover sm:object-contain select-none transition-all duration-1000 ease-out"
            style={{
              filter: isLoaded ? "blur(0px)" : `blur(${20 - index * 2}px)`,
              opacity: isLoaded ? 1 : 0,
              transitionDelay: `${index * 100}ms`,
            }}
            draggable={false}
            loading="eager"
          />
        </div>
      ))}
    </div>
  );
}
