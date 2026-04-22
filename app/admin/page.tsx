"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userAuth } from "@/lib/userAuth";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserData } from "@/lib/firestore";

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
}

interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  isActive: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredPoints: number;
}

interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: any;
  isFlagged?: boolean;
}

type AdminTab = "users" | "quests" | "badges" | "feed" | "analytics";

export default function AdminPage() {
  const { user, loading } = userAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("users");

  // User management
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [feedbackInput, setFeedbackInput] = useState<Record<string, string>>({});
  const [messageInput, setMessageInput] = useState<Record<string, string>>({});
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showProgressModel, setShowProgressModel] = useState(false);

  // Quests
  const [quests, setQuests] = useState<Quest[]>([]);
  const [newQuest, setNewQuest] = useState({ title: "", description: "", points: 100, category: "Career", isActive: true });
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  // Badges
  const [badges, setBadges] = useState<Badge[]>([]);
  const [newBadge, setNewBadge] = useState({ name: "", description: "", icon: "🏆", requiredPoints: 100 });
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);

  // Social feed
  const [feedPosts, setFeedPosts] = useState<SocialPost[]>([]);

  // Analytics
  const [analyticsStats, setAnalyticsStats] = useState({ totalUsers: 0, totalActivities: 0, avgPoints: 0, activeLast7Days: 0 });
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Role checking
  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/");
      else {
        getUserData(user).then((data) => {
          if (data.role === "admin") setAuthorized(true);
          else router.replace("/");
        });
      }
    }
  }, [user, loading, router]);

  // Fetches cooresponding data based on the active tab
  useEffect(() => {
    if (authorized && user) {
      if (activeTab === "users") fetchUsers();
      if (activeTab === "quests") fetchQuests();
      if (activeTab === "badges") fetchBadges();
      if (activeTab === "feed") fetchFeedPosts();
      if (activeTab === "analytics") fetchAnalytics();
    }
  }, [authorized, user, activeTab]);

  // Analytics fetching
  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      const totalUsers = usersSnap.size;
      let totalPoints = 0;
      let totalActivities = 0;
      let activeCount = 0;
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      for (const docSnap of usersSnap.docs) {
        const data = docSnap.data();
        totalPoints += data.points || 0;
        const activities = data.activities || [];
        totalActivities += activities.length;
        const recentActivity = activities.some((act: any) => {
          const actDate = act.timestamp?.toDate?.() || new Date(act.timestamp);
          return actDate > sevenDaysAgo;
        });
        if (recentActivity) activeCount++;
      }
      setAnalyticsStats({
        totalUsers,
        totalActivities,
        avgPoints: totalUsers ? Math.round(totalPoints / totalUsers) : 0,
        activeLast7Days: activeCount,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // User Management (same as before)
  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
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
      console.error(error);
    }
  };

  const saveFeedback = async (uid: string) => {
    const feedback = feedbackInput[uid];
    if (feedback === undefined) return;
    try {
      await updateDoc(doc(db, "users", uid), { resumeFeedback: feedback });
      setAllUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, resumeFeedback: feedback } : u)));
      alert("Resume feedback saved.");
    } catch (err) {
      alert("Failed to save feedback.");
    }
  };

  const sendMessage = async (uid: string, recipientName: string) => {
    const message = messageInput[uid];
    if (!message.trim()) return;
    try {
      await setDoc(doc(collection(db, "users", uid, "messages")), {
        from: user?.email,
        content: message,
        timestamp: new Date(),
        read: false,
      });
      alert(`Message sent to ${recipientName}`);
      setMessageInput((prev) => ({ ...prev, [uid]: "" }));
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  const changeRole = async (uid: string, newRole: UserRole) => {
    try {
      await updateDoc(doc(db, "users", uid), { role: newRole });
      setAllUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u)));
      alert(`Role updated to ${newRole}`);
    } catch (err) {
      alert("Failed to update role.");
    }
  };

  const deleteUser = async (uid: string, name: string) => {
    if (confirm(`Delete ${name} permanently?`)) {
      try {
        await deleteDoc(doc(db, "users", uid));
        setAllUsers((prev) => prev.filter((u) => u.uid !== uid));
        alert(`User ${name} deleted.`);
      } catch (err) {
        alert("Failed to delete user.");
      }
    }
  };

  // Quest Management
  const fetchQuests = async () => {
    try {
      const snapshot = await getDocs(collection(db, "quests"));
      const questsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Quest));
      setQuests(questsList);
    } catch (error) {
      console.error(error);
    }
  };

  const addQuest = async () => {
    if (!newQuest.title || !newQuest.description) return alert("Title and description required");
    try {
      const docRef = await addDoc(collection(db, "quests"), newQuest);
      setQuests([...quests, { id: docRef.id, ...newQuest }]);
      setNewQuest({ title: "", description: "", points: 100, category: "Career", isActive: true });
      alert("Quest added.");
    } catch (err) {
      alert("Failed to add quest.");
    }
  };

  const updateQuest = async () => {
    if (!editingQuest) return;
    try {
      const questRef = doc(db, "quests", editingQuest.id);
      await updateDoc(questRef, {
        title: editingQuest.title,
        description: editingQuest.description,
        points: editingQuest.points,
        category: editingQuest.category,
        isActive: editingQuest.isActive,
      });
      setQuests(quests.map((q) => (q.id === editingQuest.id ? editingQuest : q)));
      setEditingQuest(null);
      alert("Quest updated.");
    } catch (err) {
      alert("Failed to update quest.");
    }
  };

  const deleteQuest = async (id: string) => {
    if (confirm("Delete this quest?")) {
      try {
        await deleteDoc(doc(db, "quests", id));
        setQuests(quests.filter((q) => q.id !== id));
        alert("Quest deleted.");
      } catch (err) {
        alert("Failed to delete quest.");
      }
    }
  };

  // Badge Management
  const fetchBadges = async () => {
    try {
      const snapshot = await getDocs(collection(db, "badges"));
      const badgesList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Badge));
      setBadges(badgesList);
    } catch (error) {
      console.error(error);
    }
  };

  const addBadge = async () => {
    if (!newBadge.name || !newBadge.description) return alert("Name and description required");
    try {
      const docRef = await addDoc(collection(db, "badges"), newBadge);
      setBadges([...badges, { id: docRef.id, ...newBadge }]);
      setNewBadge({ name: "", description: "", icon: "🏆", requiredPoints: 100 });
      alert("Badge added.");
    } catch (err) {
      alert("Failed to add badge.");
    }
  };

  const updateBadge = async () => {
    if (!editingBadge) return;
    try {
      const badgeRef = doc(db, "badges", editingBadge.id);
      await updateDoc(badgeRef, {
        name: editingBadge.name,
        description: editingBadge.description,
        icon: editingBadge.icon,
        requiredPoints: editingBadge.requiredPoints,
      });
      setBadges(badges.map((b) => (b.id === editingBadge.id ? editingBadge : b)));
      setEditingBadge(null);
      alert("Badge updated.");
    } catch (err) {
      alert("Failed to update badge.");
    }
  };

  const deleteBadge = async (id: string) => {
    if (confirm("Delete this badge?")) {
      try {
        await deleteDoc(doc(db, "badges", id));
        setBadges(badges.filter((b) => b.id !== id));
        alert("Badge deleted.");
      } catch (err) {
        alert("Failed to delete badge.");
      }
    }
  };

  // Social Feed Moderation
  const fetchFeedPosts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "socialFeed"));
      const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SocialPost));
      setFeedPosts(posts.sort((a, b) => (b.timestamp?.toDate?.() || 0) - (a.timestamp?.toDate?.() || 0)));
    } catch (error) {
      console.error(error);
    }
  };

  const deletePost = async (id: string) => {
    if (confirm("Delete this post?")) {
      try {
        await deleteDoc(doc(db, "socialFeed", id));
        setFeedPosts(feedPosts.filter((p) => p.id !== id));
        alert("Post deleted.");
      } catch (err) {
        alert("Failed to delete post.");
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading || !authorized) return <div className="min-h-dvh flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Header */}
      <div className="bg-[#1E407C] text-white px-6 py-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#1E407C] font-bold text-lg">PSU</span>
          </div>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="bg-white text-[#1E407C] px-4 py-2 rounded-lg font-semibold">
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white px-6">
        <div className="flex gap-4">
          {(["users", "quests", "badges", "feed", "analytics"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-2 font-medium text-sm transition-colors ${
                activeTab === tab ? "border-b-2 border-[#1E407C] text-[#1E407C]" : "text-gray-500"
              }`}
            >
              {tab === "users" && "Users"}
              {tab === "quests" && "Quests"}
              {tab === "badges" && "Badges"}
              {tab === "feed" && "Social Feed"}
              {tab === "analytics" && "Analytics"}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Year/Major</th>
                  <th className="text-left py-3 px-4">Points</th>
                  <th className="text-left py-3 px-4">Resume</th>
                  <th className="text-left py-3 px-4">Resume Feedback</th>
                  <th className="text-left py-3 px-4">Message</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => (
                  <tr key={u.uid} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{u.name}</td>
                    <td className="py-2 px-4 text-sm">{u.email}</td>
                    <td className="py-2 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.uid, e.target.value as UserRole)}
                        className="text-xs border rounded p-1"
                      >
                        <option value="student">Student</option>
                        <option value="counselor">Counselor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 text-sm">{u.year ? `${u.year} / ${u.major || "N/A"}` : "Not set"}</td>
                    <td className="py-2 px-4">{u.points}</td>
                    <td className="py-2 px-4">
                      {u.resumeUrl ? (
                        <a href={u.resumeUrl} target="_blank" className="text-[#1E407C] underline text-sm">View</a>
                      ) : "No resume"}
                    </td>
                    <td className="py-2 px-4">
                      <textarea rows={2} className="w-40 p-1 border rounded text-sm" placeholder="Feedback..." value={feedbackInput[u.uid] || ""} onChange={(e) => setFeedbackInput({ ...feedbackInput, [u.uid]: e.target.value })} />
                      <button onClick={() => saveFeedback(u.uid)} className="mt-1 px-2 py-1 bg-[#1E407C] text-white text-xs rounded">Save</button>
                    </td>
                    <td className="py-2 px-4">
                      <textarea rows={1} className="w-32 p-1 border rounded text-sm" placeholder="Message..." value={messageInput[u.uid] || ""} onChange={(e) => setMessageInput({ ...messageInput, [u.uid]: e.target.value })} />
                      <button onClick={() => sendMessage(u.uid, u.name)} className="mt-1 px-2 py-1 bg-green-600 text-white text-xs rounded">Send</button>
                    </td>
                    <td className="py-2 px-4">
                      <button onClick={() => setSelectedUser(u)} className="px-2 py-1 bg-gray-600 text-white text-xs rounded">View Progress</button>
                      {u.uid !== user?.uid && (
                        <button onClick={() => deleteUser(u.uid, u.name)} className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Quests Tab */}
        {activeTab === "quests" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-bold mb-3">Add New Quest</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="Title" className="border p-2 rounded" value={newQuest.title} onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })} />
                <input placeholder="Description" className="border p-2 rounded" value={newQuest.description} onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })} />
                <input type="number" placeholder="Points" className="border p-2 rounded" value={newQuest.points} onChange={(e) => setNewQuest({ ...newQuest, points: parseInt(e.target.value) })} />
                <input placeholder="Category" className="border p-2 rounded" value={newQuest.category} onChange={(e) => setNewQuest({ ...newQuest, category: e.target.value })} />
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={newQuest.isActive} onChange={(e) => setNewQuest({ ...newQuest, isActive: e.target.checked })} />
                  Active
                </label>
                <button onClick={addQuest} className="bg-[#1E407C] text-white p-2 rounded">Add Quest</button>
              </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Title</th>
                    <th className="text-left py-3 px-4">Description</th>
                    <th className="text-left py-3 px-4">Points</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Active</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quests.map((q) => (
                    <tr key={q.id} className="border-b">
                      {editingQuest?.id === q.id ? (
                        <>
                          <td className="py-2 px-4"><input value={editingQuest.title} onChange={(e) => setEditingQuest({ ...editingQuest, title: e.target.value })} className="border p-1 rounded" /></td>
                          <td className="py-2 px-4"><input value={editingQuest.description} onChange={(e) => setEditingQuest({ ...editingQuest, description: e.target.value })} className="border p-1 rounded" /></td>
                          <td className="py-2 px-4"><input type="number" value={editingQuest.points} onChange={(e) => setEditingQuest({ ...editingQuest, points: parseInt(e.target.value) })} className="border p-1 rounded w-20" /></td>
                          <td className="py-2 px-4"><input value={editingQuest.category} onChange={(e) => setEditingQuest({ ...editingQuest, category: e.target.value })} className="border p-1 rounded" /></td>
                          <td className="py-2 px-4"><input type="checkbox" checked={editingQuest.isActive} onChange={(e) => setEditingQuest({ ...editingQuest, isActive: e.target.checked })} /></td>
                          <td className="py-2 px-4">
                            <button onClick={updateQuest} className="bg-green-600 text-white px-2 py-1 rounded text-xs mr-1">Save</button>
                            <button onClick={() => setEditingQuest(null)} className="bg-gray-400 text-white px-2 py-1 rounded text-xs">Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-2 px-4">{q.title}</td>
                          <td className="py-2 px-4">{q.description}</td>
                          <td className="py-2 px-4">{q.points}</td>
                          <td className="py-2 px-4">{q.category}</td>
                          <td className="py-2 px-4">{q.isActive ? "✅" : "❌"}</td>
                          <td className="py-2 px-4">
                            <button onClick={() => setEditingQuest(q)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs mr-1">Edit</button>
                            <button onClick={() => deleteQuest(q.id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs">Delete</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === "badges" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-bold mb-3">Add New Badge</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="Name" className="border p-2 rounded" value={newBadge.name} onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })} />
                <input placeholder="Description" className="border p-2 rounded" value={newBadge.description} onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })} />
                <input placeholder="Icon (emoji)" className="border p-2 rounded" value={newBadge.icon} onChange={(e) => setNewBadge({ ...newBadge, icon: e.target.value })} />
                <input type="number" placeholder="Required Points" className="border p-2 rounded" value={newBadge.requiredPoints} onChange={(e) => setNewBadge({ ...newBadge, requiredPoints: parseInt(e.target.value) })} />
                <button onClick={addBadge} className="bg-[#1E407C] text-white p-2 rounded md:col-span-2">Add Badge</button>
              </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Icon</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Description</th>
                    <th className="text-left py-3 px-4">Required Points</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {badges.map((b) => (
                    <tr key={b.id} className="border-b">
                      {editingBadge?.id === b.id ? (
                        <>
                          <td className="py-2 px-4"><input value={editingBadge.icon} onChange={(e) => setEditingBadge({ ...editingBadge, icon: e.target.value })} className="border p-1 rounded w-20" /></td>
                          <td className="py-2 px-4"><input value={editingBadge.name} onChange={(e) => setEditingBadge({ ...editingBadge, name: e.target.value })} className="border p-1 rounded" /></td>
                          <td className="py-2 px-4"><input value={editingBadge.description} onChange={(e) => setEditingBadge({ ...editingBadge, description: e.target.value })} className="border p-1 rounded" /></td>
                          <td className="py-2 px-4"><input type="number" value={editingBadge.requiredPoints} onChange={(e) => setEditingBadge({ ...editingBadge, requiredPoints: parseInt(e.target.value) })} className="border p-1 rounded w-24" /></td>
                          <td className="py-2 px-4">
                            <button onClick={updateBadge} className="bg-green-600 text-white px-2 py-1 rounded text-xs mr-1">Save</button>
                            <button onClick={() => setEditingBadge(null)} className="bg-gray-400 text-white px-2 py-1 rounded text-xs">Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-2 px-4 text-2xl">{b.icon}</td>
                          <td className="py-2 px-4">{b.name}</td>
                          <td className="py-2 px-4">{b.description}</td>
                          <td className="py-2 px-4">{b.requiredPoints}</td>
                          <td className="py-2 px-4">
                            <button onClick={() => setEditingBadge(b)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs mr-1">Edit</button>
                            <button onClick={() => deleteBadge(b.id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs">Delete</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Social Feed Tab */}
        {activeTab === "feed" && (
          <div className="bg-white rounded-xl shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">Moderate Social Feed</h2>
              <p className="text-sm text-gray-500">Delete inappropriate posts</p>
            </div>
            {feedPosts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No posts yet.</div>
            ) : (
              <div className="divide-y">
                {feedPosts.map((post) => (
                  <div key={post.id} className="p-4 flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{post.userName}</p>
                      <p className="text-gray-600">{post.content}</p>
                      <p className="text-xs text-gray-400 mt-1">{post.timestamp?.toDate?.().toLocaleString() || "Just now"}</p>
                    </div>
                    <button onClick={() => deletePost(post.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold mb-4">Platform Analytics</h2>
            {loadingAnalytics ? (
              <div className="text-center py-8">Loading analytics...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-3xl font-bold">{analyticsStats.totalUsers}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Total Activities Logged</p>
                  <p className="text-3xl font-bold">{analyticsStats.totalActivities}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Average Points per User</p>
                  <p className="text-3xl font-bold">{analyticsStats.avgPoints}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Active Users (Last 7 Days)</p>
                  <p className="text-3xl font-bold">{analyticsStats.activeLast7Days}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Model (unchanged) */}
      {showProgressModel && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="bg-[#1E407C] text-white px-6 py-3 flex justify-between items-center rounded-t-xl">
              <h2 className="text-xl font-bold">{selectedUser.name}'s Progress</h2>
              <button onClick={() => setShowProgressModel(false)} className="text-white text-2xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div><h3 className="font-semibold">Email</h3><p>{selectedUser.email}</p></div>
              <div><h3 className="font-semibold">Role</h3><p>{selectedUser.role}</p></div>
              <div><h3 className="font-semibold">Year & Major</h3><p>{selectedUser.year || "Not set"} / {selectedUser.major || "Not set"}</p></div>
              <div><h3 className="font-semibold">Career Energy Type</h3><p>{selectedUser.energyType}</p></div>
              <div><h3 className="font-semibold">Total Points</h3><p>{selectedUser.points}</p></div>
              <div><h3 className="font-semibold">Badges Earned</h3><div className="flex flex-wrap gap-2">{selectedUser.badges.length ? selectedUser.badges.map((b,i)=><span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">{b}</span>) : "None"}</div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}