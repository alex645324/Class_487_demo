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
import Level5Screen from "@/components/Level5Screen";
import Level6Screen from "@/components/Level6Screen";
import { EnergyType, calculateEnergyType } from "@/lib/data";
import { userAuth } from "@/lib/userAuth";
import { getUserData, saveUserData } from "@/lib/firestore";
import CareerRoadmap from "@/components/CareerRoadmap";

type Screen = "opening" | "quiz" | "result" | "challenge" | "questmap" | "level2" | "level3" | "level4" | "level5" | "level6" | "roadmap";

export default function Home() {
  const { user, loading } = userAuth();
  const [screen, setScreen] = useState<Screen>("opening");
  const [energyType, setEnergyType] = useState<EnergyType>("Explorer");
  const [completedLevels, setCompletedLevels] = useState<number[]>([1]);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (user && !loading) {
      const loadProgress = async () => {
        const savedData = await getUserData(user);
        setUserData(savedData);
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
      const currentData = await getUserData(user);
      const newPoints = (currentData.points || 0) + 100;
      await saveUserData(user, { answers, energyType: type, points: newPoints });
    }
  };

  const handleLevelComplete = async (level: number) => {
    const alreadyCompleted = completedLevels.includes(level);
    if (alreadyCompleted) {
      setScreen("questmap");
      return;
    }

    const updated = [...completedLevels, level];
    setCompletedLevels(updated);

    if (user) {
      const currentData = await getUserData(user);
      // Award 50 points for levels 2-6 (level 1 already has points from quiz+challenge)
      const pointsToAdd = level >= 2 ? 50 : 0;
      const newPoints = (currentData.points || 0) + pointsToAdd;
      const newBadge = `🏅 Level ${level} Complete`;
      const currentBadges = currentData.badges || [];
      const updatedBadges = currentBadges.includes(newBadge) ? currentBadges : [...currentBadges, newBadge];

      await saveUserData(user, {
        completedLevels: updated,
        points: newPoints,
        badges: updatedBadges,
      });
      // Refresh userData
      const refreshed = await getUserData(user);
      setUserData(refreshed);
    }

    // If all levels 1-6 are complete, show roadmap
    const allLevels = [1, 2, 3, 4, 5, 6];
    const allCompleted = allLevels.every(l => updated.includes(l));
    if (allCompleted) {
      setScreen("roadmap");
    } else {
      setScreen("questmap");
    }
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-white">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

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
            onComplete={async () => {
              if (user) {
                const currentData = await getUserData(user);
                const newPoints = (currentData.points || 0) + 50;
                await saveUserData(user, { points: newPoints });
              }
              setScreen("questmap");
            }}
          />
        )}
        {screen === "questmap" && (
          <QuestMap
            key="questmap"
            energyType={energyType}
            completedLevels={completedLevels}
            onStartLevel={(level) => {
              if (level === 2) setScreen("level2");
              if (level === 3) setScreen("level5");
              if (level === 4) setScreen("level3");
              if (level === 5) setScreen("level6");
              if (level === 6) setScreen("level4");
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
            onComplete={() => handleLevelComplete(4)}
          />
        )}
        {screen === "level4" && (
          <Level4Screen
            key="level4"
            energyType={energyType}
            onComplete={() => handleLevelComplete(6)}
          />
        )}
        {screen === "level5" && (
          <Level5Screen
            key="level5"
            energyType={energyType}
            onComplete={() => handleLevelComplete(3)}
          />
        )}
        {screen === "level6" && (
          <Level6Screen
            key="level6"
            energyType={energyType}
            onComplete={() => handleLevelComplete(5)}
          />
        )}
        {screen === "roadmap" && <CareerRoadmap key="roadmap" />}
      </AnimatePresence>
    </main>
  );
}