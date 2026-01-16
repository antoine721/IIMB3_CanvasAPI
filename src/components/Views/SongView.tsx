import { useSectionTransition } from '../../hooks/useSectionTransition';
import { getTransitionClass, getContentTransitionClass } from '../../utils/transitionUtils';

const SongView = () => {
  const { transitionState, isVisible } = useSectionTransition('song');

  return (
    <section 
      id="song" 
      className={`snap-section relative min-h-screen flex items-center justify-center z-10 bg-black ${getTransitionClass(transitionState)}`}
    >
      {isVisible && (
        <div className={`text-white text-center px-4 sm:px-6 md:px-8 ${getContentTransitionClass(transitionState)}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8">
            SONG
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/80">
            Section Song
          </p>
        </div>
      )}
    </section>
  );
};

export default SongView;
