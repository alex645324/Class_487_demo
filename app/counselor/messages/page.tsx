"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userAuth } from "@/lib/userAuth";
import { collection, query, orderBy, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getUserData } from "@/lib/firestore";

interface Message {
  id: string;
  from: string;
  content: string;
  timestamp: any;
  read: boolean;
  userId?: string;
}

export default function CounselorMessagesPage() {
  const { user, loading } = userAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      getUserData(user).then((data) => {
        if (data.role === "counselor") {
          setIsAuthorized(true);
          fetchMessages();
        } else {
          router.push("/");
        }
      });
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

  const markAsRead = async (messageId: string) => {
    try {
      const messageRef = doc(db, "users", user!.uid, "messages", messageId);
      await updateDoc(messageRef, { read: true });
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const sendReply = async (messageId: string, studentUid: string, studentEmail: string) => {
    const reply = replyText[messageId];
    if (!reply?.trim()) return;
    if (!studentUid) {
      alert("Cannot reply to this message because it was sent before the update. Please ask the student to send a new message.");
      return;
    }
    try {
      const studentMessagesRef = collection(db, "users", studentUid, "messages");
      await addDoc(studentMessagesRef, {
        from: user?.email || "Counselor",
        content: reply.trim(),
        timestamp: new Date(),
        read: false,
      });
      setReplyText((prev) => ({ ...prev, [messageId]: "" }));
      alert("Reply sent!");
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply.");
    }
  };

  const filteredMessages = messages.filter((msg) =>
    filter === "unread" ? !msg.read : true
  );

  if (loading || !isAuthorized || isLoading) return <div className="min-h-dvh flex items-center justify-center">Loading...</div>;

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-dvh bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1E407C]">Messages from Students</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === "all" ? "bg-[#1E407C] text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === "unread" ? "bg-[#1E407C] text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {filteredMessages.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
            No {filter === "unread" ? "unread" : ""} messages.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`bg-white rounded-xl shadow p-4 border-l-4 ${
                  !msg.read ? "border-yellow-500 bg-yellow-50" : "border-[#1E407C]"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[#1E407C]">From: {msg.from}</p>
                    {!msg.read && (
                      <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-0.5 rounded-full">New</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {msg.timestamp?.toDate?.().toLocaleString() || "Just now"}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{msg.content}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {!msg.read && (
                    <button
                      onClick={() => markAsRead(msg.id)}
                      className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300"
                    >
                      Mark as read
                    </button>
                  )}
                  <textarea
                    rows={2}
                    placeholder="Type your reply..."
                    value={replyText[msg.id] || ""}
                    onChange={(e) => setReplyText({ ...replyText, [msg.id]: e.target.value })}
                    className="flex-1 p-2 border border-gray-200 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => sendReply(msg.id, msg.userId || "", msg.from)}
                    disabled={!replyText[msg.id]?.trim()}
                    className="bg-[#1E407C] text-white px-3 py-1 rounded-lg text-sm disabled:opacity-50"
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 text-center">
          <button onClick={() => router.push("/counselor")} className="text-[#1E407C] underline text-sm">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}