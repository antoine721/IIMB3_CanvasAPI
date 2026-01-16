import { useParallax } from "../../hooks/useParallax";
import SplitText from "../SplitText/SplitText";

const Title = () => {
  const { getTransform } = useParallax();

  return (
    <div
      className="relative w-full h-full flex flex-col justify-between items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16 lg:py-20 z-20 transition-transform duration-75 ease-out"
      style={{
        transform: getTransform(0.8, 0.8),
        willChange: "transform",
      }}
    >
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-7xl mx-auto">
        <div className="w-full text-center mb-2 sm:mb-4 md:mb-6">
          <h1 className="font-jaro text-white font-black leading-[0.9] sm:leading-[0.85] tracking-tighter uppercase drop-shadow-lg select-none pointer-events-none text-[3rem] sm:text-[5rem] md:text-[7rem] lg:text-[10rem] xl:text-[12rem] 2xl:text-[14rem] px-2 sm:px-4">
            <SplitText splitBy="letters" delay={0.2}>
              LA VIE DU J
            </SplitText>
          </h1>
        </div>

        <div className="w-full text-center">
          <h3 className="font-jaro text-white font-bold opacity-90 select-none pointer-events-none text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.25em] mt-2 sm:mt-3 md:mt-4">
            <SplitText splitBy="words" delay={0.3}>
              32 EME PROJET
            </SplitText>
          </h3>
        </div>
      </div>

      <div className="h-4 sm:h-6 md:h-8 lg:h-12" />
    </div>
  );
};

export default Title;
