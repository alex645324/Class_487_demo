"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userAuth } from "@/lib/userAuth";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

type UserRole = "student" | "counselor" | "admin";

interface UserData {
  uid: string;
  email: string;
  name: string;
  role?: UserRole;
  energyType: string | null;
  points: number;
  badges: string[];
  resumeUrl?: string;
  resumeFeedback?: string;
  year?: string;
  major?: string;
  completedLevels?: number[];
  interests?: string[];
  strengths?: string[];
}

export default function CounselorPage() {
  const { user, loading } = userAuth();
  const router = useRouter();
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [activeTab, setActiveTab] = useState<UserRole>("student");
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackInput, setFeedbackInput] = useState<Record<string, string>>({});
  const [messageInput, setMessageInput] = useState<Record<string, string>>({});
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("student");

  useEffect(() => {
    if (user) {
      import("@/lib/firestore").then(({ getUserData }) => {
        getUserData(user).then((data) => {
          setCurrentUserRole(data.role || "student");
        });
      });
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) router.push("/");
    if (user) fetchUsers();
  }, [user, loading, router]);

  const fetchUsers = async () => {
    try {
      const usersCol = collection(db, "users");
      const snapshot = await getDocs(usersCol);
      const usersList = snapshot.docs.map((doc) => ({
        uid: doc.id,
        email: doc.data().email || "unknown",
        name: doc.data().name || "Not set",
        role: doc.data().role || "student",
        energyType: doc.data().energyType || "Not set",
        points: doc.data().totalPoints || doc.data().points || 0,
        badges: doc.data().badges || [],
        resumeUrl: doc.data().resumeUrl,
        resumeFeedback: doc.data().resumeFeedback,
        year: doc.data().year,
        major: doc.data().major,
        completedLevels: doc.data().completedLevels || [],
        interests: doc.data().interests || [],
        strengths: doc.data().strengths || [],
      }));
      setAllUsers(usersList);
      const initFeedback: Record<string, string> = {};
      const initMessage: Record<string, string> = {};
      usersList.forEach((u) => {
        initFeedback[u.uid] = u.resumeFeedback || "";
        initMessage[u.uid] = "";
      });
      setFeedbackInput(initFeedback);
      setMessageInput(initMessage);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackChange = (uid: string, value: string) => {
    setFeedbackInput((prev) => ({ ...prev, [uid]: value }));
  };

  const saveFeedback = async (uid: string) => {
    const feedback = feedbackInput[uid];
    if (feedback === undefined) return;
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { resumeFeedback: feedback });
      setAllUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, resumeFeedback: feedback } : u))
      );
      alert("Resume feedback saved.");
    } catch (err) {
      console.error(err);
      alert("Failed to save feedback.");
    }
  };

  const sendMessage = async (uid: string, recipientName: string) => {
    const message = messageInput[uid];
    if (!message.trim()) return;
    try {
      const messageRef = doc(collection(db, "users", uid, "messages"));
      await updateDoc(messageRef, {
        from: user?.email,
        content: message,
        timestamp: new Date(),
        read: false,
      });
      alert(`Message sent to ${recipientName}`);
      setMessageInput((prev) => ({ ...prev, [uid]: "" }));
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const viewProgress = (student: UserData) => {
    setSelectedUser(student);
    setShowProgressModal(true);
  };

  const changeRole = async (uid: string, newRole: UserRole) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { role: newRole });
      setAllUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u))
      );
      alert(`Role updated to ${newRole}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update role.");
    }
  };

  const deleteUser = async (uid: string, name: string) => {
    if (confirm(`Delete ${name}?`)) {
      try {
        await deleteDoc(doc(db, "users", uid));
        setAllUsers((prev) => prev.filter((u) => u.uid !== uid));
        alert(`User ${name} deleted.`);
      } catch (err) {
        console.error(err);
        alert("Failed to delete user.");
      }
    }
  };

  const filteredUsers = allUsers.filter((u) => u.role === activeTab);
  const isAdmin = currentUserRole === "admin";
  const isCounselor = currentUserRole === "counselor";
  const canManageRoles = isAdmin;

  if (loading || isLoading) return <div className="min-h-dvh flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Header */}
      <div className="bg-[#1E407C] text-white px-6 py-4 shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#1E407C] font-bold text-lg">PSU</span>
            </div>
            <h1 className="text-xl font-bold">
              {isAdmin ? "Admin Dashboard" : "Counselor Dashboard"}
            </h1>
          </div>
          <button onClick={handleLogout} className="bg-white text-[#1E407C] px-4 py-2 rounded-lg font-semibold">Logout</button>
        </div>
        <p className="text-blue-100 text-sm mt-2">Career & Professional Development</p>
      </div>

      {/* Tabs with Messages button */}
      <div className="border-b border-gray-200 bg-white px-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            {(["student", "counselor", "admin"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-2 font-medium text-sm transition-colors ${
                  activeTab === tab ? "border-b-2 border-[#1E407C] text-[#1E407C]" : "text-gray-500"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}s
              </button>
            ))}
          </div>
          <button
            onClick={() => router.push("/counselor/messages")}
            className="flex items-center gap-1 text-gray-600 hover:text-[#1E407C] transition-colors py-2 px-3 text-sm font-medium"
          >
            <span>📧</span> Messages
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                {activeTab === "student" && <th className="text-left py-3 px-4">Year/Major</th>}
                {activeTab === "student" && <th className="text-left py-3 px-4">Points</th>}
                {activeTab === "student" && <th className="text-left py-3 px-4">Badges</th>}
                {activeTab === "student" && <th className="text-left py-3 px-4">Resume</th>}
                {activeTab === "student" && <th className="text-left py-3 px-4">Resume Feedback</th>}
                <th className="text-left py-3 px-4">Message</th>
                {activeTab === "student" && <th className="text-left py-3 px-4">Progress</th>}
                {canManageRoles && <th className="text-left py-3 px-4">Admin Tools</th>}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isSelf = u.uid === user?.uid;
                const showStudentSpecific = activeTab === "student";
                const showMessageForTab = true; // everyone can be messaged within the software atm
                const canMessage = (activeTab === "student" && (isCounselor || isAdmin)) ||
                                   (activeTab === "counselor" && (isCounselor || isAdmin)) ||
                                   (activeTab === "admin" && isAdmin);
                return (
                  <tr key={u.uid} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">{u.name}</td>
                    <td className="py-2 px-4 text-sm">{u.email}</td>
                    {showStudentSpecific && (
                      <>
                        <td className="py-2 px-4 text-sm">{u.year ? `${u.year} / ${u.major || "N/A"}` : "Not set"}</td>
                        <td className="py-2 px-4">{u.points}</td>
                        <td className="py-2 px-4 text-sm">{u.badges.slice(0,2).join(", ")}{u.badges.length>2?"...":""}</td>
                        <td className="py-2 px-4">
                          {u.resumeUrl ? <a href={u.resumeUrl} target="_blank" className="text-[#1E407C] underline text-sm">View</a> : <span className="text-gray-400 text-sm">No resume</span>}
                        </td>
                        <td className="py-2 px-4">
                          <textarea rows={2} className="w-40 p-1 border rounded text-sm" placeholder="Write feedback..." value={feedbackInput[u.uid]||""} onChange={(e)=>handleFeedbackChange(u.uid,e.target.value)} />
                          <button onClick={()=>saveFeedback(u.uid)} className="mt-1 px-2 py-1 bg-[#1E407C] text-white text-xs rounded">Save</button>
                        </td>
                      </>
                    )}
                    <td className="py-2 px-4">
                      {canMessage && !isSelf ? (
                        <>
                          <textarea rows={1} className="w-32 p-1 border rounded text-sm" placeholder="Type message..." value={messageInput[u.uid]||""} onChange={(e)=>setMessageInput(prev=>({...prev,[u.uid]:e.target.value}))} />
                          <button onClick={()=>sendMessage(u.uid, u.name)} className="mt-1 px-2 py-1 bg-green-600 text-white text-xs rounded">Send</button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs">{isSelf ? "You" : "No permission"}</span>
                      )}
                    </td>
                    {showStudentSpecific && (
                      <td className="py-2 px-4">
                        <button onClick={()=>viewProgress(u)} className="px-2 py-1 bg-gray-600 text-white text-xs rounded">View Progress</button>
                      </td>
                    )}
                    {canManageRoles && !isSelf && (
                      <td className="py-2 px-4">
                        <select value={u.role} onChange={(e)=>changeRole(u.uid, e.target.value as UserRole)} className="text-xs border rounded p-1">
                          <option value="student">Student</option>
                          <option value="counselor">Counselor</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button onClick={()=>deleteUser(u.uid, u.name)} className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded">Delete</button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Model*/}
      {showProgressModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="bg-[#1E407C] text-white px-6 py-3 flex justify-between items-center rounded-t-xl">
              <h2 className="text-xl font-bold">{selectedUser.name}'s Progress</h2>
              <button onClick={()=>setShowProgressModal(false)} className="text-white text-2xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div><h3 className="font-semibold">Email</h3><p>{selectedUser.email}</p></div>
              <div><h3 className="font-semibold">Year & Major</h3><p>{selectedUser.year||"Not set"} / {selectedUser.major||"Not set"}</p></div>
              <div><h3 className="font-semibold">Career Energy Type</h3><p>{selectedUser.energyType}</p></div>
              <div><h3 className="font-semibold">Total Points</h3><p>{selectedUser.points}</p></div>
              <div><h3 className="font-semibold">Badges Earned</h3><div className="flex flex-wrap gap-2">{selectedUser.badges.length ? selectedUser.badges.map((b,i)=><span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">{b}</span>) : "None"}</div></div>
              <div><h3 className="font-semibold">Completed Levels</h3><p>{selectedUser.completedLevels?.join(", ")||"None"}</p></div>
              <div><h3 className="font-semibold">Interests</h3><p>{selectedUser.interests?.slice(0,4).join(", ")||"Not specified"}</p></div>
              <div><h3 className="font-semibold">Strengths</h3><p>{selectedUser.strengths?.slice(0,3).join(", ")||"Not specified"}</p></div>
              {selectedUser.resumeUrl && <div><h3 className="font-semibold">Resume</h3><a href={selectedUser.resumeUrl} target="_blank" className="text-[#1E407C] underline">View/Download</a></div>}
              {selectedUser.resumeFeedback && <div><h3 className="font-semibold">Your Feedback</h3><p className="bg-gray-50 p-2 rounded">{selectedUser.resumeFeedback}</p></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}