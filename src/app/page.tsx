'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, Star, Heart, Send, CheckCircle, Copy, ExternalLink, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const experiences = [
  {
    emoji: '🍞',
    title: 'פחמימות מנחמות',
    desc: 'כי לחם טוב יותר מכל תרפיסט - מבטיחים!',
    longDesc: 'סדנת אפייה מקסימה שבה הצוות שלכם ילמד להכין לחמים, פוקצ׳ה, ועוגות מהממות. מושלם לגיבוש ולריח שיישאר בזיכרון לנצח!',
    price: '₪180 לאדם',
    image: '/hodiya_v24_baking.png',
  },
  {
    emoji: '🎉',
    title: 'הגיבוש שלא ירדים אתכם',
    desc: 'כן, גיבוש שאנשים מחכים לו. תאמינו.',
    longDesc: 'אירוע גיבוש דינמי ומותאם אישית שיחזק את הקשרים בצוות שלכם. פעילויות חברתיות, אתגרים כיפיים, וחוויה שכולם יזכרו.',
    price: '₪150 לאדם',
    image: '/hodiya_v24_gibush.png',
  },
  {
    emoji: '🎂',
    title: 'חגיגה מהאגדות',
    desc: 'כי כולם ראויים להרגיש כוכבים.',
    longDesc: 'חגיגת יום הולדת או אירוע מיוחד שמישהו בצוות לא ישכח לעולם. עיצוב מיוחד, הפתעות, ואווירה שעושה עגול לב.',
    price: '₪200 לאדם',
    image: '/hodiya_v24_party.png',
  },
  {
    emoji: '📿',
    title: 'תכשיטים של אלופים',
    desc: 'אזהרה: ייתכן שתתמכרו לייצור תכשיטים. לא אחראים.',
    longDesc: 'סדנת תכשיטים יצירתית שבה כל אחד מהצוות יצור תכשיט ייחודי משלו. חרוזים, חוטים, ויצירתיות בלי גבולות!',
    price: '₪160 לאדם',
    image: '/hodiya_v24_beads.png',
  },
  {
    emoji: '🎨',
    title: 'פיקסו להמונים',
    desc: 'הפנימו את פיקסו שבתוככם. ציורים מכוערים מתקבלים בברכה.',
    longDesc: 'סדנת ציור מהנה ומשוחררת שבה כולם הם אמנים. ציורים, צבעים, ואווירה יצירתית שתשחרר את האמן שבתוככם.',
    price: '₪170 לאדם',
    image: '/hodiya_v24_painting.png',
  },
  {
    emoji: '🛍️',
    title: 'הדיל של הודיה',
    desc: 'קניות קבוצתיות: כי ביחד חוסכים, ובנפרד בוכים.',
    longDesc: 'סיור קניות קבוצתי מודרך עם הודיה, גילוי המקומות הכי שווים, דילים מיוחדים ועוד. כי קניות זה ספורט קבוצתי!',
    price: '₪120 לאדם',
    image: '/hodiya_v24_shopping.png',
  },
];

const HEBREW_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const HEBREW_DAYS = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];

const STAR_POSITIONS = [
  { top: 5, left: 10, delay: 0, duration: 2.5, size: 12 },
  { top: 15, left: 80, delay: 0.5, duration: 3, size: 8 },
  { top: 25, left: 45, delay: 1, duration: 2, size: 16 },
  { top: 40, left: 70, delay: 0.3, duration: 3.5, size: 10 },
  { top: 60, left: 20, delay: 1.5, duration: 2.8, size: 14 },
  { top: 70, left: 90, delay: 0.8, duration: 2.2, size: 9 },
  { top: 80, left: 55, delay: 0.2, duration: 3.2, size: 11 },
  { top: 90, left: 30, delay: 1.2, duration: 2.6, size: 7 },
  { top: 10, left: 60, delay: 0.7, duration: 2.4, size: 13 },
  { top: 50, left: 5, delay: 1.8, duration: 3.1, size: 15 },
  { top: 35, left: 95, delay: 0.4, duration: 2.7, size: 8 },
  { top: 65, left: 40, delay: 1.1, duration: 3.3, size: 10 },
  { top: 85, left: 75, delay: 0.6, duration: 2.1, size: 12 },
  { top: 20, left: 25, delay: 1.6, duration: 2.9, size: 9 },
  { top: 45, left: 85, delay: 0.9, duration: 3.4, size: 11 },
  { top: 75, left: 15, delay: 1.3, duration: 2.3, size: 14 },
  { top: 55, left: 60, delay: 0.1, duration: 3.6, size: 8 },
  { top: 30, left: 35, delay: 1.7, duration: 2.5, size: 16 },
  { top: 95, left: 50, delay: 0.5, duration: 2.8, size: 7 },
  { top: 8, left: 92, delay: 1.4, duration: 3.2, size: 13 },
];

interface FormData {
  name: string;
  email: string;
  date: string;
  experience: string;
  details: string;
}

type Experience = typeof experiences[0];

// ── Calendar Picker ─────────────────────────────────────────────────────────

function CalendarPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const selectedDate = value ? new Date(value + 'T00:00:00') : null;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const selectDate = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    onChange(`${viewYear}-${m}-${d}`);
    setOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const displayValue = selectedDate
    ? `${selectedDate.getDate()} ${HEBREW_MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
    : '';

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-all text-gray-800 bg-white flex items-center gap-3 hover:border-purple-400 hover:shadow-md"
      >
        <Calendar size={20} className="text-purple-400 shrink-0" />
        <span className={displayValue ? 'text-gray-800 font-medium' : 'text-gray-400'}>
          {displayValue || 'בחרו תאריך...'}
        </span>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-purple-200/60 border border-purple-100 p-5 z-50 w-80">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-purple-100 transition-colors">
              <ChevronRight size={18} className="text-purple-600" />
            </button>
            <span className="font-bold text-gray-800 text-base">{HEBREW_MONTHS[viewMonth]} {viewYear}</span>
            <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-purple-100 transition-colors">
              <ChevronLeft size={18} className="text-purple-600" />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 mb-1">
            {HEBREW_DAYS.map(d => (
              <div key={d} className="text-center text-xs font-bold text-purple-400 py-1">{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-0.5">
            {[...Array(firstDayOfWeek)].map((_, i) => <div key={`e${i}`} />)}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const cellDate = new Date(viewYear, viewMonth, day);
              const isPast = cellDate < todayMidnight;
              const isToday = cellDate.getTime() === todayMidnight.getTime();
              const isSelected = selectedDate &&
                day === selectedDate.getDate() &&
                viewMonth === selectedDate.getMonth() &&
                viewYear === selectedDate.getFullYear();

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isPast}
                  onClick={() => !isPast && selectDate(day)}
                  className={[
                    'aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all',
                    isPast ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer',
                    isSelected ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-md scale-105' : '',
                    isToday && !isSelected ? 'ring-2 ring-purple-400 text-purple-700 font-bold' : '',
                    !isSelected && !isToday && !isPast ? 'text-gray-700 hover:bg-purple-50 hover:text-purple-700' : '',
                  ].join(' ')}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', date: '', experience: '', details: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);

  const formRef = useRef<HTMLElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setRequestId(data.id);
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusUrl = typeof window !== 'undefined' ? `${window.location.origin}/status/${requestId}` : `/status/${requestId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(statusUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openModal = (exp: Experience) => {
    setSelectedExp(exp);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedExp(null);
    document.body.style.overflow = '';
  };

  const handleBookNow = (expTitle: string) => {
    closeModal();
    setForm(f => ({ ...f, experience: expTitle }));
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Cleanup body overflow on unmount
  useEffect(() => {
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <main className="min-h-screen" dir="rtl">

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600">
        {/* Animated stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {STAR_POSITIONS.map((pos, i) => (
            <div
              key={i}
              className="absolute sparkle-animation"
              style={{ top: `${pos.top}%`, left: `${pos.left}%`, animationDelay: `${pos.delay}s`, animationDuration: `${pos.duration}s` }}
            >
              <Star size={pos.size} className="text-yellow-300 fill-yellow-300 opacity-70" />
            </div>
          ))}
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-pink-400 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-orange-400 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
          {/* Avatar - circular frame with glow */}
          <div className="float-animation flex-shrink-0">
            <div
              className="relative w-80 h-80 md:w-[32rem] md:h-[32rem] rounded-full overflow-hidden bg-white"
              style={{ boxShadow: '0 0 0 8px rgba(249,168,212,0.5), 0 0 80px 30px rgba(216,180,254,0.6), 0 0 140px 60px rgba(192,132,252,0.35)' }}
            >
              <Image
                src="/hodiya_v23_fixed_hero.png"
                alt="הודיה"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Text content */}
          <div className="flex flex-col items-center md:items-start text-center md:text-right">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-yellow-300 fill-yellow-300" size={32} />
              <h1
                className="text-5xl md:text-6xl font-black text-white"
                style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(249,168,212,0.5)' }}
              >
                הודיה
              </h1>
              <Sparkles className="text-yellow-300 fill-yellow-300" size={32} />
            </div>

            <h2
              className="text-2xl md:text-3xl font-bold text-pink-200 mb-4"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}
            >
              הופכת אירועי צוות לאגדות
            </h2>

            <p className="text-base md:text-lg text-purple-200 max-w-md mb-6 leading-relaxed">
              חוויות בלתי נשכחות שיגרמו לצוות שלכם לחייך, להתחבר, ולחזור הביתה עם סיפורים לספר
            </p>

            <div className="flex items-center gap-2 text-yellow-300 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="fill-yellow-300" />
              ))}
              <span className="text-white/80 text-sm mr-2">מאות צוותים מאושרים</span>
            </div>

            <a
              href="#request-form"
              className="px-8 py-4 text-lg font-bold text-white rounded-full bg-gradient-to-r from-pink-500 to-orange-400 shadow-xl hover:shadow-pink-500/50 hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              <span className="flex items-center gap-2">
                <Heart size={20} className="fill-white" />
                הזמינו חוויה עכשיו
                <Sparkles size={20} />
              </span>
            </a>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Experience Cards ───────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="text-purple-500" size={28} />
              <h2 className="text-3xl md:text-4xl font-black text-gray-800">החוויות שלנו</h2>
              <Sparkles className="text-purple-500" size={28} />
            </div>
            <p className="text-gray-500 text-lg">כי חוויה טובה שווה יותר מכל פגישת סיעור מוחות</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((exp, i) => (
              <button
                key={i}
                type="button"
                onClick={() => openModal(exp)}
                className="group relative p-6 rounded-2xl border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-200/60 transition-all duration-300 hover:-translate-y-2 cursor-pointer text-right w-full"
              >
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="text-pink-400" size={16} />
                </div>
                <div className="text-5xl mb-4">{exp.emoji}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{exp.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{exp.desc}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={13} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    {exp.price}
                  </span>
                </div>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs font-semibold text-purple-500 flex items-center gap-1">
                  <span>לחצו לפרטים נוספים</span>
                  <span>←</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Request Form ───────────────────────────────────────────────── */}
      <section id="request-form" ref={formRef} className="py-20 px-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Star className="text-yellow-400 fill-yellow-400" size={28} />
              <h2 className="text-3xl md:text-4xl font-black text-gray-800">בואו נתחיל את הקסם</h2>
              <Star className="text-yellow-400 fill-yellow-400" size={28} />
            </div>
            <p className="text-gray-500 text-lg">מלאו את הפרטים ונחזור אליכם בהקדם</p>
          </div>

          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-2xl shadow-purple-100 p-8 border border-purple-100"
            >
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">שם מלא ✨</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="איך קוראים לכם?"
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none focus:shadow-md transition-all text-gray-800 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">אימייל 📧</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none focus:shadow-md transition-all text-gray-800 placeholder-gray-400"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">תאריך מועדף 📅</label>
                  <CalendarPicker
                    value={form.date}
                    onChange={(v) => setForm(f => ({ ...f, date: v }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">בחירת חוויה 🎉</label>
                  <select
                    name="experience"
                    required
                    value={form.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none focus:shadow-md transition-all text-gray-800 bg-white"
                  >
                    <option value="">בחרו חוויה...</option>
                    {experiences.map((exp) => (
                      <option key={exp.title} value={exp.title}>{exp.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">פרטים נוספים 💬</label>
                  <textarea
                    name="details"
                    value={form.details}
                    onChange={handleChange}
                    placeholder="ספרו לנו עוד על הצוות שלכם, מה אוהבים, מה לא, כמה אנשים..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none focus:shadow-md transition-all text-gray-800 placeholder-gray-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-lg font-bold text-white rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg hover:shadow-xl hover:shadow-purple-300/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      שולחים...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={20} />
                      שלחו את הבקשה
                      <Sparkles size={20} />
                    </span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl shadow-purple-100 p-8 border border-purple-100 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="text-green-500" size={64} />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">הבקשה נשלחה! 🎉</h3>
              <p className="text-gray-500 mb-6">
                תודה {form.name}! קיבלנו את הבקשה שלכם ונחזור אליכם בהקדם.
              </p>
              <div className="bg-purple-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2 font-semibold">קישור למעקב הבקשה:</p>
                <a
                  href={`/status/${requestId}`}
                  className="text-purple-600 font-mono text-sm break-all hover:underline"
                  dir="ltr"
                >
                  {statusUrl}
                </a>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={copyLink}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors font-semibold text-sm"
                >
                  <Copy size={16} />
                  {copied ? 'הועתק!' : 'העתק קישור'}
                </button>
                <a
                  href={`/status/${requestId}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition-opacity font-semibold text-sm"
                >
                  <ExternalLink size={16} />
                  עקבו אחרי הבקשה
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-white py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="text-pink-400" size={20} />
          <span className="text-lg font-bold">הודיה</span>
          <Sparkles className="text-pink-400" size={20} />
        </div>
        <p className="text-gray-400 text-sm">הופכת אירועי צוות לאגדות</p>
        <p className="text-gray-600 text-xs mt-2">© 2024 כל הזכויות שמורות</p>
      </footer>

      {/* ── Experience Modal ───────────────────────────────────────────── */}
      {selectedExp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden modal-enter flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button — fixed top-right */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-md z-20"
            >
              <X size={18} className="text-gray-700" />
            </button>

            {/* Image — top */}
            <div className="relative aspect-square w-full">
              <Image
                src={selectedExp.image}
                alt={selectedExp.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Content — below */}
            <div className="px-6 py-6 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-3xl">{selectedExp.emoji}</span>
                  <h3 className="text-2xl font-black text-gray-800 mt-1">{selectedExp.title}</h3>
                </div>
                <div className="mt-2 bg-gradient-to-br from-purple-600 to-pink-500 text-white px-3 py-1.5 rounded-2xl font-bold text-sm shadow-md">
                  {selectedExp.price}
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-5">{selectedExp.longDesc}</p>

              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-xs text-gray-400 mr-1">דירוג מעולה</span>
              </div>

              <button
                onClick={() => handleBookNow(selectedExp.title)}
                className="w-full py-3.5 text-base font-bold text-white rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg hover:shadow-xl hover:shadow-purple-300/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Heart size={18} className="fill-white" />
                הזמינו עכשיו
                <Sparkles size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
