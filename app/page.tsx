"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import OpeningScreen from "@/components/OpeningScreen";
import QuizScreen from "@/components/QuizScreen";
import ResultScreen from "@/components/ResultScreen";
import ChallengeScreen from "@/components/ChallengeScreen";
import QuestMap from "@/components/QuestMap";
import { EnergyType, calculateEnergyType } from "@/lib/data";
import LoginScreen from "@/components/LoginScreen";
import { saveUserData, loadUserData } from "@/lib/storage";

type Screen = "login"|"opening" | "quiz" | "result" | "challenge" | "questmap";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("login");
  const [energyType, setEnergyType] = useState<EnergyType>("Explorer");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogin = () => {
  setIsAuthenticated(true);

  //this code would allow users who already created accounts and done the onboarding questionaire to skip that part aftr
  //logging back in with the same credentials, because we didnt implement a backend for the login function yet,
  //this code doesnt work as intended and will send any user that logged in after the first to the questmap page

  //const savedData = loadUserData();
  //if (savedData.energyType) {
      //setEnergyType(savedData.energyType);
      //if (savedData.challengeSelections.length > 0) {
        //setScreen("questmap");
     // } else {
        //setScreen("challenge");
     // }
   // } else {
     // setScreen("opening");
    //}
    setScreen("opening");
    console.log("[Main] User logged in, starting Questionnaire:");
};
  const handleQuizComplete = (answers: EnergyType[]) => {
    const type = calculateEnergyType(answers);
    setEnergyType(type);
    setScreen("result");
    saveUserData({ answers, energyType: type });
  console.log("[Main] Quiz completed, saved:", { answers, energyType: type });
  };

  if (!isAuthenticated) {
  return <LoginScreen onLogin={handleLogin} />;
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
