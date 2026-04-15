"use client";
import { useRouter } from "next/navigation";
import OnboardingScreen from "@/components/OnboardingScreen";
import { userAuth } from "@/lib/userAuth";
import { getUserData } from "@/lib/firestore";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = userAuth();

  const handleComplete = async () => {
    if (user) {
      const userData = await getUserData(user);
      const role = userData.role || "student";
      if (role === "counselor") router.push("/counselor");
      else if (role === "admin") router.push("/admin");
      else router.push("/student/home");
    } else {
      router.push("/student/home");
    }
  };

  return <OnboardingScreen onComplete={handleComplete} />;
}