import React from 'react';
import { motion } from 'framer-motion';

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.04 * i, duration: 0.5, ease: "easeOut" }
  })
};

const SplashScreen = () => {
  const word1 = "Career";
  const word2 = "Nest";

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Soft ambient glow */}
      <motion.div
        className="absolute h-72 w-72 rounded-full bg-foreground/5 blur-3xl"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1.4, opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
      />

      <div className="relative flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground flex">
          {word1.split("").map((char, i) => (
            <motion.span
              key={`w1-${i}`}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={letterVariants}
            >
              {char}
            </motion.span>
          ))}
          {word2.split("").map((char, i) => (
            <motion.span
              key={`w2-${i}`}
              custom={word1.length + i}
              initial="hidden"
              animate="visible"
              variants={letterVariants}
              className="text-muted-foreground font-medium"
            >
              {char}
            </motion.span>
          ))}
        </h1>

        <motion.div
          className="mt-6 h-[3px] w-0 bg-foreground/70 rounded-full"
          animate={{ width: 120 }}
          transition={{ delay: 0.55, duration: 0.5, ease: "easeOut" }}
        />

        <motion.p
          className="mt-4 text-sm text-muted-foreground font-light tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.5 }}
        >
          Revolutionizing Hiring
        </motion.p>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
