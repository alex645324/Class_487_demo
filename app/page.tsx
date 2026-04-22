"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { userAuth } from "@/lib/userAuth";
import LoginScreen from "@/components/LoginScreen";
import { getUserData } from "@/lib/firestore";

export default function Home() {
  const { user, loading } = userAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      getUserData(user).then((data) => {
        const role = data.role || "student";
        // For students: check if they have a name
        if (role === "student") {
          if (!data.name || data.name.trim() === "" || data.name === "Not set") {
            router.replace("/student/onboarding");
          } else {
            router.replace("/student/home");
          }
        } else if (role === "counselor") {
          router.replace("/counselor");
        } else if (role === "admin") {
          router.replace("/admin");
        }
      });
    }
  }, [user, loading, router]);

  if (loading) return <div className="min-h-dvh flex items-center justify-center">Loading...</div>;
  if (!user) return <LoginScreen />;
  return <div className="min-h-dvh flex items-center justify-center">Redirecting...</div>;
}