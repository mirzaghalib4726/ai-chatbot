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
  const inputRef = useRef<HTMLInputElement>(null);

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
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            AI Chat Assistant
          </h1>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <img 
                  src={user.photoURL || ''} 
                  alt={user.displayName || 'User'} 
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {user.displayName}
                </span>
              </div>
            )}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === "dark" ? "🌞" : "🌙"}
            </button>
            {user ? (
              <button 
                onClick={() => signOut()} 
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
              >
                <img src="/google.svg" alt="Google" className="w-4 h-4" />
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col">
        {!user ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to AI Chat Assistant</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Sign in to start chatting with our AI assistant
            </p>
            <button
              onClick={() => signInWithGoogle()}
              className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2 text-lg"
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto mb-4 space-y-6">
              {messages.map((msg, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white rounded-2xl rounded-tr-none py-3 px-4 max-w-[80%] shadow-sm">
                      {msg.query}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none py-3 px-4 max-w-[80%] shadow-sm">
                      {msg.response}
                    </div>
                  </div>
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 px-4">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setQuery(sug);
                            inputRef.current?.focus();
                          }}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
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
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none py-3 px-4">
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
            <div className="sticky bottom-0 bg-background/80 backdrop-blur-md py-4">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                  placeholder="Type your message..."
                  className="flex-1 border p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                />
                <button 
                  onClick={handleSend} 
                  disabled={loading || !query.trim()} 
                  className="px-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>Send</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
