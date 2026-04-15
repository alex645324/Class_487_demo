"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { userAuth } from "@/lib/userAuth";
import { getUserData } from "@/lib/firestore";

export default function CounselorLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = userAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      getUserData(user).then((data) => {
        if (data.role !== "counselor") {
          router.replace("/"); // send to login/home page if user is either not counselor or admin
        }
      });
    }
    if (!loading && !user) router.replace("/");
  }, [user, loading, router]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return null;
  return <>{children}</>;
}