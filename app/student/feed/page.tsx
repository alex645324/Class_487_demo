"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userAuth } from "@/lib/userAuth";
import { getUserData } from "@/lib/firestore";
import { collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import HamburgerMenu from "@/components/HamburgerMenu";

interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: any;
  isFlagged?: boolean;
}

export default function SocialFeedPage() {
  const { user, loading } = userAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/");
    if (user) {
      // Fetches the users name from Firestore database
      getUserData(user).then((data) => {
        setUserName(data.name || "Student");
      });
      fetchPosts();
    }
  }, [user, loading, router]);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, "socialFeed"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const postsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SocialPost[];
      setPosts(postsList);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSubmitPost = async () => {
    if (!newPostContent.trim() || !user) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "socialFeed"), {
        userId: user.uid,
        userName: userName,
        content: newPostContent.trim(),
        timestamp: new Date(),
        isFlagged: false,
      });
      setNewPostContent("");
      fetchPosts(); // allows refreshing of the social feed
    } catch (error) {
      console.error("Error posting:", error);
      alert("Failed to post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-dvh flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Header */}
      <div className="bg-[#1E407C] text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#1E407C] font-bold text-lg">PSU</span>
          </div>
          <h1 className="text-xl font-bold">Social Feed</h1>
        </div>
        <HamburgerMenu currentPage="feed" />
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        {/* New post form */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <textarea
            rows={3}
            placeholder="Share your achievement... (e.g., 'Just finished my resume workshop! 🎉')"
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E407C]"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button
            onClick={handleSubmitPost}
            disabled={isSubmitting || !newPostContent.trim()}
            className="mt-3 bg-[#1E407C] text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Post Achievement"}
          </button>
        </div>

        {/* Feed posts */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
            No posts yet. Be the first to share your achievement!
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow p-4 border-l-4 border-[#1E407C]">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-[#1E407C]">{post.userName}</p>
                  <span className="text-xs text-gray-400">
                    {post.timestamp?.toDate?.().toLocaleString() || "Just now"}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}