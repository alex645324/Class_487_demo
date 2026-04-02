"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnergyType, interestsByType, getInterestReflection } from "@/lib/data";
import { userAuth } from "@/lib/userAuth";
import { saveUserData } from "@/lib/firestore";

interface Props {
  energyType: EnergyType;
  onComplete: () => void;
}

export default function Level2Screen({ energyType, onComplete }: Props) {
  const { user } = userAuth();
  const [selections, setSelections] = useState<string[]>([]);
  const [showReflection, setShowReflection] = useState(false);

  const interests = interestsByType[energyType];

  const toggle = (label: string) => {
    if (showReflection) return;
    setSelections((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const handleSubmit = async () => {
    if (selections.length === 0) return;
    if (user) {
      await saveUserData(user, { interests: selections });
    }
    setShowReflection(true);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-white bg-gray-900 px-3 py-1 rounded-full">
            Level 2
          </span>
          <span className="text-xs text-gray-400">Interests</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-4 pb-8">
        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          What lights you up?
        </motion.h2>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 mb-1"
        >
          Based on your <span className="font-semibold text-gray-900">{energyType}</span> energy — pick all that resonate.
        </motion.p>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-gray-400 text-sm mb-6"
        >
          Select as many as you'd like.
        </motion.p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {interests.map((item, i) => {
            const isSelected = selections.includes(item.label);
            return (
              <motion.button
                key={item.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggle(item.label)}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? "border-gray-900 bg-gray-50 shadow-md"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <span className="text-3xl mb-2">{item.icon}</span>
                <span
                  className={`text-sm font-medium text-center ${
                    isSelected ? "text-gray-900" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showReflection && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6"
            >
              <p className="text-sm font-semibold text-gray-500 mb-2">
                💡 Your Reflection
              </p>
              <p className="text-gray-700 leading-relaxed">
                {getInterestReflection(energyType, selections)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!showReflection ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={selections.length === 0}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              selections.length > 0
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            See My Reflection
          </motion.button>
        ) : (
          <motion.button
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="w-full py-4 rounded-2xl font-bold text-lg bg-gray-900 text-white shadow-lg"
          >
            Continue →
          </motion.button>
        )}
      </div>
    </div>
  );
}
