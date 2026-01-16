import ParallaxBackground from "../ParallaxBackground/ParallaxBackground";
import SocialMedia from "../SocialMedia/SocialMedia";
import Title from "../Title/Title";

const HomeView = () => {
  return (
    <section
      id="home"
      className="snap-section relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <ParallaxBackground />

      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div className="relative w-full h-full flex flex-col items-center justify-center z-20 px-4 sm:px-6 md:px-8">
          <Title />
        </div>
        <SocialMedia />
      </div>
    </section>
  );
};

export default HomeView;
