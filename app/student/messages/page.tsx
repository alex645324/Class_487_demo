"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userAuth } from "@/lib/userAuth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import HamburgerMenu from "@/components/HamburgerMenu";

interface Message {
  id: string;
  from: string;
  content: string;
  timestamp: any;
  read: boolean;
}

export default function MessagesPage() {
  const { user, loading } = userAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/");
    if (user) fetchMessages();
  }, [user, loading, router]);

  const fetchMessages = async () => {
    if (!user) return;
    try {
      const messagesRef = collection(db, "users", user.uid, "messages");
      const q = query(messagesRef, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(msgs);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) return <div className="min-h-dvh flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-dvh bg-gray-50">
      <div className="bg-[#1E407C] text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#1E407C] font-bold text-lg">PSU</span>
          </div>
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
        <HamburgerMenu currentPage="messages" />
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        {messages.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
            No messages yet. Counselors will reach out here.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-white rounded-xl shadow p-4 border-l-4 border-[#1E407C]">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-[#1E407C]">From: {msg.from}</p>
                  <span className="text-xs text-gray-400">
                    {msg.timestamp?.toDate?.().toLocaleString() || "Just now"}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{msg.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}