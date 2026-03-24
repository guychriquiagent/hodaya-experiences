'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Sparkles, CheckCircle, XCircle, Clock, MessageSquare, CreditCard, Home } from 'lucide-react';

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

const STATUS_CONFIG = {
  pending: {
    label: 'בטיפול ✨',
    sublabel: 'הבקשה שלך נמצאת בבדיקה - נחזור אלייך בקרוב!',
    color: 'from-yellow-400 to-orange-400',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    textColor: 'text-yellow-700',
    icon: <Clock size={48} className="text-yellow-500" />,
  },
  approved: {
    label: 'אושר! 🎉',
    sublabel: 'מזל טוב! הבקשה שלך אושרה - מתרגשים לראותך!',
    color: 'from-green-400 to-emerald-500',
    bg: 'bg-green-50',
    border: 'border-green-200',
    textColor: 'text-green-700',
    icon: <CheckCircle size={48} className="text-green-500" />,
  },
  rejected: {
    label: 'לא אושר 😔',
    sublabel: 'מצטערים, הבקשה שלך לא אושרה הפעם. נשמח לעזור בהזדמנות אחרת!',
    color: 'from-red-400 to-red-500',
    bg: 'bg-red-50',
    border: 'border-red-200',
    textColor: 'text-red-700',
    icon: <XCircle size={48} className="text-red-500" />,
  },
};

export default function StatusPage() {
  const params = useParams();
  const id = params.id as string;
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(`/api/requests/${id}`);
        if (res.ok) {
          const data = await res.json();
          setRequest(data);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRequest();
  }, [id]);

  const handlePay = () => {
    setShowPayModal(true);
  };

  const handlePayConfirm = () => {
    setPaySuccess(true);
    setTimeout(() => {
      setShowPayModal(false);
      setPaySuccess(false);
    }, 3000);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('he-IL');
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">טוענת...</p>
        </div>
      </div>
    );
  }

  if (notFound || !request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4" dir="rtl">
        <div className="text-center">
          <Sparkles size={64} className="mx-auto mb-4 text-purple-300" />
          <h1 className="text-2xl font-black text-gray-700 mb-2">הבקשה לא נמצאה</h1>
          <p className="text-gray-500 mb-6">הקישור שגוי או שהבקשה לא קיימת</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold hover:opacity-90 transition-opacity"
          >
            <Home size={18} />
            חזרה לדף הבית
          </a>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[request.status];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-10 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <div className="mb-6">
          <a href="/" className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors">
            <Home size={15} />
            חזרה לדף הבית
          </a>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="text-purple-500 fill-purple-500" size={24} />
            <h1 className="text-2xl font-black text-gray-800">מעקב בקשה</h1>
            <Sparkles className="text-purple-500 fill-purple-500" size={24} />
          </div>
        </div>

        {/* Status Card */}
        <div className={`rounded-3xl border-2 ${statusConfig.border} ${statusConfig.bg} p-6 mb-6 text-center`}>
          <div className="flex justify-center mb-3">{statusConfig.icon}</div>
          <h2 className={`text-3xl font-black ${statusConfig.textColor} mb-2`}>
            {statusConfig.label}
          </h2>
          <p className="text-gray-600 text-base">{statusConfig.sublabel}</p>

          {/* Pay button for approved */}
          {request.status === 'approved' && (
            <button
              onClick={handlePay}
              className="mt-6 inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-black text-white font-bold text-lg shadow-xl hover:bg-gray-900 transition-colors hover:scale-105 transition-transform duration-200"
            >
              <CreditCard size={22} />
              שלם עכשיו
              <span className="text-xs opacity-60 mr-1">Apple Pay / Google Pay</span>
            </button>
          )}
        </div>

        {/* Request Details */}
        <div className="bg-white rounded-3xl border border-purple-100 shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-purple-500" />
            פרטי הבקשה
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="text-sm font-semibold text-gray-500">שם</span>
              <span className="text-sm font-bold text-gray-800">{request.name}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="text-sm font-semibold text-gray-500">אימייל</span>
              <span className="text-sm text-gray-800" dir="ltr">{request.email}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="text-sm font-semibold text-gray-500">תאריך</span>
              <span className="text-sm text-gray-800">{request.date}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="text-sm font-semibold text-gray-500">חוויה</span>
              <span className="text-sm font-bold text-purple-600">{request.experience}</span>
            </div>
            {request.details && (
              <div>
                <span className="text-sm font-semibold text-gray-500 block mb-1">פרטים</span>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">{request.details}</p>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-500">נשלח</span>
              <span className="text-sm text-gray-500">{formatDate(request.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-3xl border border-purple-100 shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MessageSquare size={18} className="text-purple-500" />
            הודעות ({request.comments.length})
          </h3>

          {request.comments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MessageSquare size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">אין הודעות עדיין</p>
            </div>
          ) : (
            <div className="space-y-3">
              {request.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl px-4 py-3 border border-purple-100"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-purple-600">{comment.author}</span>
                    <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => !paySuccess && setShowPayModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {paySuccess ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">תשלום בוצע בהצלחה!</h3>
                <p className="text-gray-500">תודה! נשלח אישור לאימייל שלך</p>
                <div className="mt-4 w-full bg-green-100 rounded-xl py-3">
                  <CheckCircle className="mx-auto text-green-500" size={32} />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CreditCard size={28} className="text-gray-700" />
                  <h3 className="text-xl font-black text-gray-800">תשלום מאובטח</h3>
                </div>
                <p className="text-gray-500 text-sm mb-6">בחרי שיטת תשלום</p>

                <div className="space-y-3 mb-6">
                  <button
                    onClick={handlePayConfirm}
                    className="w-full py-3.5 rounded-2xl bg-black text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors"
                  >
                    <span className="text-xl"></span>
                    Apple Pay
                  </button>
                  <button
                    onClick={handlePayConfirm}
                    className="w-full py-3.5 rounded-2xl bg-white border-2 border-gray-200 text-gray-800 font-bold text-base flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">G</span>
                    Google Pay
                  </button>
                </div>

                <button
                  onClick={() => setShowPayModal(false)}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ביטול
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
