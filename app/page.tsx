"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import OpeningScreen from "@/components/OpeningScreen";
import QuizScreen from "@/components/QuizScreen";
import ResultScreen from "@/components/ResultScreen";
import ChallengeScreen from "@/components/ChallengeScreen";
import QuestMap from "@/components/QuestMap";
import { EnergyType, calculateEnergyType } from "@/lib/data";
import LoginScreen from "@/components/LoginScreen";
import { userAuth } from "@/lib/userAuth";
import { getUserData, saveUserData } from "@/lib/firestore";

type Screen = "login"|"opening" | "quiz" | "result" | "challenge" | "questmap";

export default function Home() {
  const { user, loading } = userAuth();
  const [screen, setScreen] = useState<Screen>("login");
  const [energyType, setEnergyType] = useState<EnergyType>("Explorer");

  useEffect(() => {
    if (user && !loading) {
      const loadProgress = async () => {
        const savedData = await getUserData(user);
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
    console.log("[Main] Quiz completed, saved:", { answers, energyType: type });
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
          <QuestMap key="questmap" energyType={energyType} />
        )}
      </AnimatePresence>
    </main>
  );
}