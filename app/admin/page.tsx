"use client";
import React, { useState } from "react";

const CREDENTIALS = [
  { user: "wallington.cameras@yahoo.com", pass: "Admin08" },
  { user: "wallington.cameras@gmail.com", pass: "Admin28" },
];

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  function tryLogin(e: React.FormEvent) {
    e.preventDefault();
    const found = CREDENTIALS.find(
      (c) => c.user === email && c.pass === password,
    );
    if (found) {
      setLoggedIn(true);
      setError(null);
      // Simple client-side flag; in a real app use secure auth
      localStorage.setItem("admin-auth", "1");
    } else {
      setError("Invalid credentials");
    }
  }

  function logout() {
    setLoggedIn(false);
    localStorage.removeItem("admin-auth");
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
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Admin Panel</h2>
              <button onClick={logout} className="text-sm text-blue-600">
                Logout
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-700">
              <p>
                Simple admin panel placeholder. You are logged in as{" "}
                <strong>{email}</strong>.
              </p>
              <p className="mt-3">Available actions (placeholders):</p>
              <ul className="list-disc pl-5 mt-2 text-sm">
                <li>View recent orders</li>
                <li>Manage pricing cards</li>
                <li>Update official links</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
