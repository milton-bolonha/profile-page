import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export const Parallax = ({ children, speed = 0.5, className = '' }: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
};
