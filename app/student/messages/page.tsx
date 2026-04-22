"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userAuth } from "@/lib/userAuth";
import { collection, getDocs, addDoc, query, orderBy, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import HamburgerMenu from "@/components/HamburgerMenu";

interface Message {
  id: string;
  from: string;
  content: string;
  timestamp: any;
  read: boolean;
}

interface User {
  uid: string;
  name: string;
  email: string;
  role: string;
}

export default function MessagesPage() {
  const { user, loading } = userAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [counselors, setCounselors] = useState<User[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/");
    if (user) {
      fetchMessages();
      fetchCounselors();
    }
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

  const fetchCounselors = async () => {
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      const counselorsList: User[] = [];
      usersSnap.forEach(doc => {
        const data = doc.data();
        if (data.role === "counselor") {
          counselorsList.push({
            uid: doc.id,
            name: data.name || "Counselor",
            email: data.email,
            role: data.role,
          });
        }
      });
      setCounselors(counselorsList);
    } catch (error) {
      console.error("Error fetching counselors:", error);
    }
  };

  const sendMessage = async () => {
    if (!selectedRecipient || !newMessage.trim()) return;
    setIsSending(true);
    try {
      const recipientRef = collection(db, "users", selectedRecipient, "messages");
      await addDoc(recipientRef, {
        from: user?.email || "Student",
        content: newMessage.trim(),
        timestamp: new Date(),
        read: false,
        userId: user?.uid
      });
      setNewMessage("");
      setSelectedRecipient("");
      setSendSuccess("Message sent!");
      setTimeout(() => setSendSuccess(""), 3000);
      // Optionally refresh messages (but this is sent, not received)
    } catch (error) {
      console.error("Error sending message:", error);
      setSendSuccess("Failed to send.");
    } finally {
      setIsSending(false);
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
        {/* Compose message */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Send a Message</h2>
          <select
            value={selectedRecipient}
            onChange={(e) => setSelectedRecipient(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-lg mb-3"
          >
            <option value="">Select a counselor...</option>
            {counselors.map(c => (
              <option key={c.uid} value={c.uid}>{c.name} ({c.email})</option>
            ))}
          </select>
          <textarea
            rows={3}
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E407C]"
          />
          <button
            onClick={sendMessage}
            disabled={!selectedRecipient || !newMessage.trim() || isSending}
            className="mt-3 bg-[#1E407C] text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {isSending ? "Sending..." : "Send Message"}
          </button>
          {sendSuccess && <p className="text-green-600 text-sm mt-2">{sendSuccess}</p>}
        </div>

        {/* Inbox */}
        <h2 className="text-lg font-semibold mb-3">Inbox</h2>
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
      <div className="mt-6 text-center">
        <button onClick={() => router.push("/student/home")} className="text-gray-500 underline text-sm">
         Back to Home Page
        </button>
      </div>
    </div>
  );
}