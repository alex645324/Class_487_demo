"use client";

import { motion } from "framer-motion";

export default function OpeningScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-dvh flex flex-col items-center justify-center px-8 text-center bg-white"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="text-7xl mb-6"
      >
        ⚡
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-4xl font-bold text-gray-900 mb-4 leading-tight"
      >
        Discover Your
        <br />
        Career Energy
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-500 text-lg mb-10"
      >
        3 minutes to learn how you work best.
      </motion.p>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="bg-gray-900 text-white font-bold text-xl px-12 py-4 rounded-2xl shadow-lg active:shadow-md transition-shadow"
      >
        Start
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 flex items-center gap-2 text-gray-400 text-sm"
      >
        <span>🎯</span>
        <span>Fun • Fast • Free</span>
      </motion.div>
    </motion.div>
  );
}
