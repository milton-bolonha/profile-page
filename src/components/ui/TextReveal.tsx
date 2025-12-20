"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface TextRevealProps {
  children: string;
  className?: string;
}

export const TextReveal = ({ children, className = "" }: TextRevealProps) => {
  const targetRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.9", "start 0.25"],
  });

  const words = children.split(" ");

  return (
    <p ref={targetRef} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} range={[start, end]} progress={scrollYProgress}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

const Word = ({
  children,
  range,
  progress,
}: {
  children: string;
  range: [number, number];
  progress: any;
}) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative mr-3 mt-3">
      <span className="absolute opacity-20">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
};
