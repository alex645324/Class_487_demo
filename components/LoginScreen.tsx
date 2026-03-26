// Mock login screen that simulates Penn State SSO authentication
// Real implementation would redirect to Microsoft Azure AD, plan on registering for that soon

"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { saveUserData } from "@/lib/storage";

interface Props {
  onLogin: () => void;
}
export default function LoginScreen({ onLogin }: Props) {
  // For the form inputs and loading/error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // simulate the way SSO authentication would work, added a delay
  const simulateAuth = (email: string) => {
    console.log(`[Login] Simulating authentication for ${email}...`);
    setIsLoading(true);
    // Simulate network request (in real SSO this would redirect to Microsoft)
    setTimeout(() => {
      console.log(`[Login] Authentication successful for ${email}`);
      // Store user data in localStorage (mock)
      saveUserData({
        user: {
          email: email,
          name: email.split("@")[0],
          isAuthenticated: true,
        },
      });
      setIsLoading(false);
      onLogin(); // proceed to the main app
    }, 1500);
  };

  // 3. Handle form submission (fallback for manual entry)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email domain
    if (!email.endsWith("@psu.edu")) {
      console.warn("[Login] Invalid email domain:", email);
      setError("Please use your Penn State email (@psu.edu)");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    // In a real implementation, this would send credentials to the backend.
    // For demo, we just simulate success.
    simulateAuth(email);
  };

  // 4. Mock SSO button – simulates redirect to Penn State's identity provider
  const handleSSORedirect = () => {
    console.log("[Login] Initiating Penn State SSO redirect (mock)");
    // Real SSO would redirect to:
    // https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/authorize...
    // For demo, we simulate the callback.
    simulateAuth("demo@psu.edu");
  };

  console.log("[Login] Rendering login screen");

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-white px-6">
      {/* 1. Penn State branding – blue circle with "PSU" */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 text-center"
      >
        <div className="w-20 h-20 bg-[#1E407C] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-3xl font-bold">PSU</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1E407C]">Penn State Sign In</h1>
        <p className="text-gray-500 text-sm mt-1">
          Use your Penn State Access Account
        </p>
      </motion.div>

      {/* 2. Primary SSO button – Penn State blue */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={handleSSORedirect}
        disabled={isLoading}
        className="w-full max-w-sm py-4 mb-4 bg-[#1E407C] text-white font-semibold rounded-xl shadow-lg hover:bg-[#0F2B55] transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Redirecting...</span>
          </div>
        ) : (
          "Sign in with Penn State SSO"
        )}
      </motion.button>

      {/* 3. Divider (fallback) */}
      <div className="flex items-center gap-4 w-full max-w-sm mb-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* 4. Manual login form (for demo only – real SSO wouldn't have this) */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Penn State Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="abc123@psu.edu"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E407C] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E407C] focus:border-transparent"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </motion.button>
      </form>

      {/* 5. Helper text (explains mock nature) */}
      <p className="text-xs text-gray-400 text-center mt-8 max-w-sm">
        This is a demo mockup. Real implementation requires registering for Penn State Azure SSO.
        <br />
        Format: username@psu.edu
      </p>
    </div>
  );
}