import { useMemo } from "react";
import { motion } from "motion/react";

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  splitBy?: "letters" | "words";
}

const SplitText = ({
  children,
  className = "",
  delay = 0,
  splitBy = "letters",
}: SplitTextProps) => {
  const items = useMemo(() => {
    if (splitBy === "letters") {
      return children.split("");
    }
    return children.split(" ");
  }, [children, splitBy]);

  return (
    <span className={className}>
      {items.map((item, index) => {
        const isSpace = item === " ";
        const content = isSpace ? "\u00A0" : item;
        const key = `${item}-${index}`;

        return (
          <motion.span
            key={key}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.5,
              delay: delay + index * 0.05,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="inline-block"
          >
            {content}
            {splitBy === "words" && index < items.length - 1 && "\u00A0"}
          </motion.span>
        );
      })}
    </span>
  );
};

export default SplitText;
