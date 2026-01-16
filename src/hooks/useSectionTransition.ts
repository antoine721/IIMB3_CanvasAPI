import { useEffect, useState, useRef } from 'react';

type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

const TRANSITION_DURATION = 600;
const INITIAL_CHECK_DELAY = 100;

export const useSectionTransition = (sectionId: string) => {
  const [transitionState, setTransitionState] = useState<TransitionState>('entered');
  const [isVisible, setIsVisible] = useState(true);
  const isVisibleRef = useRef(true);
  const tickingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById(sectionId);
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowCenter = windowHeight / 2;
      
      const isInView = rect.top <= windowCenter && rect.bottom >= windowCenter;
      const wasInView = isVisibleRef.current;

      if (isInView && !wasInView) {
        isVisibleRef.current = true;
        setIsVisible(true);
        setTransitionState('entering');
        setTimeout(() => setTransitionState('entered'), TRANSITION_DURATION);
      } else if (!isInView && wasInView) {
        isVisibleRef.current = false;
        setTransitionState('exiting');
        setTimeout(() => {
          setTransitionState('exited');
          setIsVisible(false);
        }, TRANSITION_DURATION);
      }
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

    const checkInitial = () => {
      const section = document.getElementById(sectionId);
      if (section) {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowCenter = windowHeight / 2;
        const isInView = rect.top <= windowCenter && rect.bottom >= windowCenter;
        isVisibleRef.current = isInView;
        setIsVisible(isInView);
        setTransitionState(isInView ? 'entered' : 'exited');
      }
    };

    setTimeout(checkInitial, INITIAL_CHECK_DELAY);

    const scrollContainer = document.querySelector('.snap-y');

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', optimizedScroll, { passive: true });
    } else {
      window.addEventListener('scroll', optimizedScroll, { passive: true });
    }
    window.addEventListener('resize', optimizedScroll, { passive: true });
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', optimizedScroll);
      } else {
        window.removeEventListener('scroll', optimizedScroll);
      }
      window.removeEventListener('resize', optimizedScroll);
    };
  }, [sectionId]);

  return { transitionState, isVisible };
};
