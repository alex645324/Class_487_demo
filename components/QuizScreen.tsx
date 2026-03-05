"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quizQuestions, EnergyType } from "@/lib/data";

interface Props {
  onComplete: (answers: EnergyType[]) => void;
}

export default function QuizScreen({ onComplete }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<EnergyType[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const question = quizQuestions[currentQ];
  const progress = ((currentQ) / quizQuestions.length) * 100;

  const handleSelect = (index: number, energy: EnergyType) => {
    if (selected !== null) return;
    setSelected(index);

    setTimeout(() => {
      const newAnswers = [...answers, energy];
      if (currentQ < quizQuestions.length - 1) {
        setAnswers(newAnswers);
        setCurrentQ(currentQ + 1);
        setSelected(null);
      } else {
        onComplete(newAnswers);
      }
    }, 400);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      {/* Progress bar */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-400">
            {currentQ + 1} of {quizQuestions.length}
          </span>
          <span className="text-sm font-medium text-gray-500">
            Level 1
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-rainbow rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelect(i, option.energy)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                    selected === i
                      ? "border-gray-900 bg-gray-50 shadow-md"
                      : "border-gray-100 bg-gray-50 active:border-gray-300"
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-lg font-medium text-gray-800">
                    {option.label}
                  </span>
                  {selected === i && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto text-gray-900 text-xl"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
