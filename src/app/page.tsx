"use client";

import React, { useState, useEffect, useRef } from "react";
import { auth, onAuthStateChanged, signInWithGoogle, signOut } from "../lib/firebase";
import { User } from "firebase/auth";
import { TypeAnimation } from "react-type-animation";
import { useTheme } from "next-themes";

type Message = {
  query: string;
  response: string;
  suggestions: string[];
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const currentQuery = query;
    setQuery("");
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: currentQuery }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { query: currentQuery, ...data }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-xl font-bold">AI-Powered Chatbot</h1>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {user.email}
            </span>
          )}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
          {user ? (
            <button 
              onClick={() => signOut()} 
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </header>
      <main className="flex flex-col flex-1 p-4">
        {!user ? (
          <div className="flex-1 flex items-center justify-center">Please sign in to start chatting.</div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white rounded-lg py-2 px-4 max-w-[80%]">
                      {msg.query}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg py-2 px-4 max-w-[80%]">
                      {msg.response}
                    </div>
                  </div>
                  {msg.suggestions && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setQuery(sug);
                            handleSend();
                          }}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg py-2 px-4">
                    <TypeAnimation
                      sequence={["Thinking...", 1000]}
                      repeat={0}
                      cursor={true}
                      className="italic text-gray-500"
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                placeholder="Type your question..."
                className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              />
              <button 
                onClick={handleSend} 
                disabled={loading} 
                className="px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
