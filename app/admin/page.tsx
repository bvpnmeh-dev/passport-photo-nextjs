"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CREDENTIALS = [
  { user: "wallington.cameras@yahoo.com", pass: "Admin08" },
  { user: "wallington.cameras@gmail.com", pass: "Admin28" },
];

const ADMIN_KEY = "wallington-admin-2024";

export default function AdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [photoUuid, setPhotoUuid] = useState("");
  const [bypassMessage, setBypassMessage] = useState("");
  const [isBypassing, setIsBypassing] = useState(false);

  function tryLogin(e: React.FormEvent) {
    e.preventDefault();
    const found = CREDENTIALS.find(
      (c) => c.user === email && c.pass === password,
    );
    if (found) {
      setLoggedIn(true);
      setError(null);
      localStorage.setItem("admin-auth", "1");
    } else {
      setError("Invalid credentials");
    }
  }

  function logout() {
    setLoggedIn(false);
    localStorage.removeItem("admin-auth");
  }

  async function handleBypassPayment(e: React.FormEvent) {
    e.preventDefault();
    setIsBypassing(true);
    setBypassMessage("");

    try {
      const response = await fetch("/api/admin/bypass-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoUuid,
          adminKey: ADMIN_KEY,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBypassMessage("✅ Payment bypassed successfully!");
        // Redirect to order page
        setTimeout(() => {
          router.push(`/orders/${photoUuid}?payment_intent=admin-bypass`);
        }, 1500);
      } else {
        const errorData = await response.json();
        setBypassMessage(
          `❌ Error: ${errorData.error || "Failed to bypass payment"}`,
        );
      }
    } catch (error) {
      console.error(error);
      setBypassMessage("❌ Network error occurred");
    } finally {
      setIsBypassing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border rounded-lg p-6">
        {!loggedIn ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
            <form onSubmit={tryLogin} className="space-y-4">
              <div>
                <label className="block text-sm">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <div className="flex justify-between items-center">
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  Login
                </button>
                <div className="text-xs text-gray-500">
                  Use provided credentials
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Admin Panel</h2>
              <button onClick={logout} className="text-sm text-blue-600">
                Logout
              </button>
            </div>

            <div className="space-y-6">
              <div className="border-b pb-4">
                <p className="text-sm text-gray-700 mb-2">
                  Logged in as <strong>{email}</strong>
                </p>
              </div>

              {/* Payment Bypass Tool */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  🔓 Bypass Payment System
                </h3>
                <p className="text-xs text-gray-600 mb-4">
                  Enter a photo UUID to bypass payment and access the photo
                  directly. This is for testing purposes only.
                </p>
                <form onSubmit={handleBypassPayment} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Photo UUID
                    </label>
                    <input
                      type="text"
                      value={photoUuid}
                      onChange={(e) => setPhotoUuid(e.target.value)}
                      placeholder="e.g., 2506231150DRDGH3MUF"
                      className="w-full border px-3 py-2 rounded text-sm"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isBypassing}
                    className="w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:bg-gray-400"
                  >
                    {isBypassing ? "Processing..." : "Bypass & View Photo"}
                  </button>
                  {bypassMessage && (
                    <p className="text-sm mt-2">{bypassMessage}</p>
                  )}
                </form>
              </div>

              {/* Other Admin Tools */}
              <div className="mt-4 text-sm text-gray-700">
                <p className="font-medium mb-2">Other available actions:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>View recent orders</li>
                  <li>Manage pricing packages</li>
                  <li>Update official links</li>
                  <li>Export customer data</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
