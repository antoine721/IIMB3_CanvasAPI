import ParallaxBackground from "../parallax-background";
import SocialMedia from "../social-media";
import Title from "../title";

export default function HomeSection() {
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
}
