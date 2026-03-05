"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import OpeningScreen from "@/components/OpeningScreen";
import QuizScreen from "@/components/QuizScreen";
import ResultScreen from "@/components/ResultScreen";
import ChallengeScreen from "@/components/ChallengeScreen";
import QuestMap from "@/components/QuestMap";
import { EnergyType, calculateEnergyType } from "@/lib/data";

type Screen = "opening" | "quiz" | "result" | "challenge" | "questmap";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("opening");
  const [energyType, setEnergyType] = useState<EnergyType>("Explorer");

  const handleQuizComplete = (answers: EnergyType[]) => {
    setEnergyType(calculateEnergyType(answers));
    setScreen("result");
  };

  return (
    <main className="max-w-md mx-auto min-h-dvh">
      <AnimatePresence mode="wait">
        {screen === "opening" && (
          <OpeningScreen key="opening" onStart={() => setScreen("quiz")} />
        )}
        {screen === "quiz" && (
          <QuizScreen key="quiz" onComplete={handleQuizComplete} />
        )}
        {screen === "result" && (
          <ResultScreen
            key="result"
            energyType={energyType}
            onContinue={() => setScreen("challenge")}
          />
        )}
        {screen === "challenge" && (
          <ChallengeScreen
            key="challenge"
            onComplete={() => setScreen("questmap")}
          />
        )}
        {screen === "questmap" && (
          <QuestMap key="questmap" energyType={energyType} />
        )}
      </AnimatePresence>
    </main>
  );
}
