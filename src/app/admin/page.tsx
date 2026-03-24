'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Lock, User, LogIn } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise((r) => setTimeout(r, 600));

    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('adminAuth', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('שם משתמש או סיסמה שגויים');
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 px-4"
      dir="rtl"
    >
      {/* Decorative sparkles */}
      <div className="absolute top-10 right-10 sparkle-animation">
        <Sparkles className="text-yellow-300 fill-yellow-300" size={32} />
      </div>
      <div className="absolute bottom-10 left-10 sparkle-animation" style={{ animationDelay: '1s' }}>
        <Sparkles className="text-pink-300 fill-pink-300" size={24} />
      </div>
      <div className="absolute top-1/3 left-20 sparkle-animation" style={{ animationDelay: '0.5s' }}>
        <Sparkles className="text-purple-300 fill-purple-300" size={20} />
      </div>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="text-yellow-300 fill-yellow-300" size={28} />
              <span className="text-3xl font-black text-white">הודיה</span>
              <Sparkles className="text-yellow-300 fill-yellow-300" size={28} />
            </div>
            <h1 className="text-xl font-bold text-pink-200">כניסת מנהל</h1>
            <p className="text-purple-300 text-sm mt-1">אזור מוגן - כניסה לבעלי הרשאה בלבד</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-purple-200 mb-1.5">שם משתמש</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <User size={18} className="text-purple-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="admin"
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-purple-400 focus:outline-none text-white placeholder-purple-400 transition-colors"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-purple-200 mb-1.5">סיסמה</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-purple-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••"
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-purple-400 focus:outline-none text-white placeholder-purple-400 transition-colors"
                  dir="ltr"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-3 text-red-300 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-base font-bold text-white rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  נכנסים...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={18} />
                  כניסה
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-purple-300 text-sm hover:text-white transition-colors">
              ← חזרה לדף הבית
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
