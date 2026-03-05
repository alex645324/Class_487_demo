"use client";

import { motion } from "framer-motion";
import { EnergyType, energyProfiles } from "@/lib/data";

interface Props {
  energyType: EnergyType;
  onContinue: () => void;
}

export default function ResultScreen({ energyType, onContinue }: Props) {
  const profile = energyProfiles[energyType];

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-8 bg-white">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-8xl mb-4"
      >
        {profile.emoji}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2"
      >
        Your Career Energy
      </motion.p>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`text-5xl font-bold bg-gradient-to-r ${profile.color} bg-clip-text text-transparent mb-4`}
      >
        {energyType}
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-600 text-center text-lg leading-relaxed mb-10 max-w-xs"
      >
        {profile.description}
      </motion.p>

      {/* Progress indicator */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-xs mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">Level 1 Complete</span>
          <span className="text-sm font-bold text-gray-500">🏆</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-rainbow rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1, duration: 0.8 }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          You just completed Level 1!
        </p>
      </motion.div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        className="bg-gray-900 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-lg"
      >
        Next Challenge →
      </motion.button>
    </div>
  );
}
