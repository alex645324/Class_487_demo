"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import OpeningScreen from "@/components/OpeningScreen";
import QuizScreen from "@/components/QuizScreen";
import ResultScreen from "@/components/ResultScreen";
import ChallengeScreen from "@/components/ChallengeScreen";
import QuestMap from "@/components/QuestMap";
import Level2Screen from "@/components/Level2Screen";
import Level3Screen from "@/components/Level3Screen";
import Level4Screen from "@/components/Level4Screen";
import { EnergyType, calculateEnergyType } from "@/lib/data";
import LoginScreen from "@/components/LoginScreen";
import { userAuth } from "@/lib/userAuth";
import { getUserData, saveUserData } from "@/lib/firestore";

type Screen = "login" | "opening" | "quiz" | "result" | "challenge" | "questmap" | "level2" | "level3" | "level4";

export default function Home() {
  const { user, loading } = userAuth();
  const [screen, setScreen] = useState<Screen>("login");
  const [energyType, setEnergyType] = useState<EnergyType>("Explorer");
  const [completedLevels, setCompletedLevels] = useState<number[]>([1]);

  useEffect(() => {
    if (user && !loading) {
      const loadProgress = async () => {
        const savedData = await getUserData(user);
        if (savedData.completedLevels && savedData.completedLevels.length > 0) {
          setCompletedLevels(savedData.completedLevels);
        }
        if (savedData.energyType) {
          setEnergyType(savedData.energyType);
          if (savedData.challengeSelections.length > 0) {
            setScreen("questmap");
          } else {
            setScreen("challenge");
          }
        } else {
          setScreen("opening");
        }
      };
      loadProgress();
    }
  }, [user, loading]);

  const handleQuizComplete = async (answers: EnergyType[]) => {
    const type = calculateEnergyType(answers);
    setEnergyType(type);
    setScreen("result");
    if (user) {
      await saveUserData(user, { answers, energyType: type });
    }
  };

  const handleLevelComplete = async (level: number) => {
    const updated = completedLevels.includes(level)
      ? completedLevels
      : [...completedLevels, level];
    setCompletedLevels(updated);
    if (user) {
      await saveUserData(user, { completedLevels: updated });
    }
    setScreen("questmap");
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-white">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={() => {}} />;
  }

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
          <QuestMap
            key="questmap"
            energyType={energyType}
            completedLevels={completedLevels}
            onStartLevel={(level) => {
              if (level === 2) setScreen("level2");
              if (level === 3) setScreen("level3");
              if (level === 4) setScreen("level4");
            }}
          />
        )}
        {screen === "level2" && (
          <Level2Screen
            key="level2"
            energyType={energyType}
            onComplete={() => handleLevelComplete(2)}
          />
        )}
        {screen === "level3" && (
          <Level3Screen
            key="level3"
            energyType={energyType}
            onComplete={() => handleLevelComplete(3)}
          />
        )}
        {screen === "level4" && (
          <Level4Screen
            key="level4"
            energyType={energyType}
            onComplete={() => handleLevelComplete(4)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
