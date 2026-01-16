import ParallaxBackground from '../ParallaxBackground/ParallaxBackground';
import Title from '../Title/Title';
import SocialMedia from '../SocialMedia/SocialMedia';
import { useSectionTransition } from '../../hooks/useSectionTransition';
import { getTransitionClass, getContentTransitionClass } from '../../utils/transitionUtils';

const HomeView = () => {
  const { transitionState, isVisible } = useSectionTransition('home');

  return (
    <section 
      id="home" 
      className={`snap-section relative min-h-screen flex flex-col items-center justify-center overflow-hidden ${getTransitionClass(transitionState)}`}
    >
      <ParallaxBackground />
      
      {isVisible && (
        <div className={`relative w-full h-full flex flex-col items-center justify-center ${getContentTransitionClass(transitionState)}`}>
          <div className="relative w-full h-full flex flex-col items-center justify-center z-20 px-4 sm:px-6 md:px-8">
            <Title />
          </div>
          <SocialMedia />
        </div>
      )}
    </section>
  );
};

export default HomeView;
