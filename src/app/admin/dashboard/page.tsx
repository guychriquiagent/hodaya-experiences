'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Send,
  LogOut,
  RefreshCw,
  Users,
} from 'lucide-react';

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

interface Request {
  id: string;
  name: string;
  email: string;
  date: string;
  experience: string;
  details: string;
  status: 'pending' | 'approved' | 'rejected';
  comments: Comment[];
  createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: {
    label: 'ממתין',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: <Clock size={14} />,
  },
  approved: {
    label: 'אושר',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: <CheckCircle size={14} />,
  },
  rejected: {
    label: 'נדחה',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: <XCircle size={14} />,
  },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [commentLoading, setCommentLoading] = useState<Record<string, boolean>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth !== 'true') {
      router.push('/admin');
      return;
    }
    fetchRequests();
  }, [router]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleAddComment = async (id: string) => {
    const text = commentTexts[id]?.trim();
    if (!text) return;
    setCommentLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/requests/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, author: 'מנהל' }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setRequests((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, comments: [...r.comments, newComment] } : r
          )
        );
        setCommentTexts((prev) => ({ ...prev, [id]: '' }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCommentLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('he-IL');
    } catch {
      return dateStr;
    }
  };

  const counts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-pink-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="text-yellow-300 fill-yellow-300" size={24} />
            <div>
              <h1 className="text-xl font-black">הודיה - לוח בקרה</h1>
              <p className="text-purple-200 text-xs">ניהול בקשות</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchRequests}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              רענן
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors"
            >
              <LogOut size={15} />
              יציאה
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'סה"כ בקשות', value: counts.total, color: 'from-purple-500 to-purple-600', icon: <Users size={24} /> },
            { label: 'ממתינות', value: counts.pending, color: 'from-yellow-400 to-orange-400', icon: <Clock size={24} /> },
            { label: 'מאושרות', value: counts.approved, color: 'from-green-400 to-emerald-500', icon: <CheckCircle size={24} /> },
            { label: 'נדחות', value: counts.rejected, color: 'from-red-400 to-red-500', icon: <XCircle size={24} /> },
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${stat.color} text-white rounded-2xl p-5 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-2 opacity-80">{stat.icon}</div>
              <div className="text-3xl font-black">{stat.value}</div>
              <div className="text-sm opacity-80 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
            <MessageSquare size={20} className="text-purple-500" />
            כל הבקשות
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Sparkles size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">אין בקשות עדיין</p>
            </div>
          ) : (
            requests.map((req) => {
              const statusInfo = STATUS_LABELS[req.status];
              const isExpanded = expandedId === req.id;

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-purple-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Card Header */}
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : req.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-bold text-gray-800">{req.name}</h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}
                          >
                            {statusInfo.icon}
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span>{req.email}</span>
                          <span>📅 {req.date}</span>
                          <span>🎉 {req.experience}</span>
                          <span className="text-xs text-gray-400">נוצר: {formatDate(req.createdAt)}</span>
                        </div>
                        {req.details && (
                          <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                            {req.details}
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      {req.status === 'pending' && (
                        <div className="flex gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleStatusChange(req.id, 'approved')}
                            disabled={actionLoading[req.id]}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-bold transition-colors disabled:opacity-50"
                          >
                            <CheckCircle size={15} />
                            אשר
                          </button>
                          <button
                            onClick={() => handleStatusChange(req.id, 'rejected')}
                            disabled={actionLoading[req.id]}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors disabled:opacity-50"
                          >
                            <XCircle size={15} />
                            דחה
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded: Comments Section */}
                  {isExpanded && (
                    <div className="border-t border-purple-100 bg-purple-50/50 p-5">
                      <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <MessageSquare size={15} className="text-purple-500" />
                        הערות ({req.comments.length})
                      </h4>

                      {req.comments.length > 0 ? (
                        <div className="space-y-2 mb-4">
                          {req.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="bg-white rounded-xl px-4 py-3 border border-purple-100"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-purple-600">{comment.author}</span>
                                <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 mb-4">אין הערות עדיין</p>
                      )}

                      {/* Add Comment */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={commentTexts[req.id] || ''}
                          onChange={(e) =>
                            setCommentTexts((prev) => ({ ...prev, [req.id]: e.target.value }))
                          }
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment(req.id)}
                          placeholder="הוסף הערה..."
                          className="flex-1 px-3 py-2 rounded-lg border border-purple-200 focus:border-purple-500 focus:outline-none text-sm text-gray-800 placeholder-gray-400 bg-white"
                        />
                        <button
                          onClick={() => handleAddComment(req.id)}
                          disabled={commentLoading[req.id] || !commentTexts[req.id]?.trim()}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {commentLoading[req.id] ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Send size={15} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
