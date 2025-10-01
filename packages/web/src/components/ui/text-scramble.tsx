import { type MotionProps, motion } from "motion/react";
import { type JSX, useEffect, useRef, useState } from "react";

export type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: React.ElementType;
  className?: string;
  baseWord?: string;
} & MotionProps;

const DEFAULT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = DEFAULT_CHARS,
  className,
  as: Component = "p",
  baseWord,
  ...props
}: TextScrambleProps) {
  const MotionComponent = motion.create(
    Component as keyof JSX.IntrinsicElements,
  );

  const [displayText, setDisplayText] = useState(children);
  const prevChildrenRef = useRef(children);

  useEffect(() => {
    const prevText = prevChildrenRef.current;

    // Only animate if transitioning FROM baseWord TO something else
    if (!baseWord || prevText !== baseWord || children === baseWord) {
      setDisplayText(children);
      prevChildrenRef.current = children;
      return;
    }

    // Run scramble animation
    const totalSteps = Math.ceil(duration / speed);
    let currentStep = 0;

    const interval = setInterval(() => {
      const progress = currentStep / totalSteps;
      let scrambledText = "";

      for (let i = 0; i < children.length; i++) {
        if (children[i] === " ") {
          scrambledText += " ";
          continue;
        }

        if (progress * children.length > i) {
          scrambledText += children[i];
        } else {
          const randomChar =
            characterSet[Math.floor(Math.random() * characterSet.length)];
          scrambledText += randomChar;
        }
      }

      setDisplayText(scrambledText);
      currentStep++;

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setDisplayText(children);
      }
    }, speed * 1000);

    prevChildrenRef.current = children;

    return () => clearInterval(interval);
  }, [children, baseWord, duration, speed, characterSet]);

  return (
    <MotionComponent className={className} aria-label={children} {...props}>
      {displayText}
    </MotionComponent>
  );
}
