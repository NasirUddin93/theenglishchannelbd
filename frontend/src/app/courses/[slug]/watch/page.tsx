'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  ArrowLeft, BookOpen, Clock, GraduationCap, FileText,
  ClipboardList, CheckCircle, Download, Award, RotateCcw,
  Play, Video, ChevronDown, ChevronUp, Lock, Sparkles, ShieldCheck,
  Trophy, Zap, TrendingUp, Star, BarChart2, Target,
} from 'lucide-react';
import CustomVideoPlayer from '@/components/CustomVideoPlayer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '@/context/AuthContext';

/* ── Types (unchanged) ──────────────────────────────────────────── */
interface Course {
  id: number; title: string; slug: string; instructor: string;
  description: string; price: string; duration_hours: number;
  lessons_count: number; level: string; preview_video: string | null;
  is_featured: boolean; is_active: boolean; category: string;
  sections?: CourseSection[]; quizzes?: CourseQuiz[];
}
interface CourseSection { id: number; course_id: number; title: string; order: number; lessons?: CourseLesson[]; }
interface CourseLesson {
  id: number; section_id: number; title: string; type: string;
  video_url: string | null; duration_minutes: number | null;
  is_free_preview: boolean; order: number;
  resources?: CourseResource[]; quizzes?: CourseQuiz[];
}
interface CourseResource { id: number; lesson_id: number; title: string; file_path: string; file_type: string; file_size: number; }
interface CourseQuiz { id: number; course_id: number; title: string; lesson_id?: number | null; questions?: QuizQuestion[]; }
interface QuizQuestion { id: number; quiz_id: number; question: string; options: string[]; correct_answer: number; order: number; }

declare global {
  interface Window { YT: any; onYouTubeIframeAPIReady: () => void; ytPlayer: any; }
}

const levelConfig: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  beginner:     { label: 'Beginner',     cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', icon: <Zap className="w-3 h-3" /> },
  intermediate: { label: 'Intermediate', cls: 'bg-amber-500/10  text-amber-400  border border-amber-500/20',  icon: <TrendingUp className="w-3 h-3" /> },
  advanced:     { label: 'Advanced',     cls: 'bg-rose-500/10   text-rose-400   border border-rose-500/20',   icon: <Star className="w-3 h-3" /> },
};

/* ── Micro-components ───────────────────────────────────────────── */
function Panel({ children, className = '', highlight = false }: { children: React.ReactNode; className?: string; highlight?: boolean }) {
  return (
    <div className={`
      rounded-3xl border shadow-xl
      ${highlight
        ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/80 border-orange-500/20 shadow-orange-900/10'
        : 'bg-gradient-to-br from-gray-800/70 to-gray-900/60 border-gray-700/40'}
      ${className}
    `}>
      {children}
    </div>
  );
}

function PanelHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3.5 mb-6">
      <div className="p-2.5 rounded-xl bg-gray-700/50 border border-gray-600/40 shadow-inner">{icon}</div>
      <div>
        <h3 className="text-base font-bold text-white leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const pass = score >= 70;
  return (
    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
      pass ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
           : 'bg-rose-500/10   text-rose-300   border-rose-500/20'
    }`}>{score}%</span>
  );
}

function ProgressRing({ percent, size = 56 }: { percent: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={4} className="fill-none stroke-gray-700/60" />
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={4} strokeLinecap="round"
        className="fill-none stroke-orange-500 transition-all duration-700"
        strokeDasharray={circ} strokeDashoffset={offset} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        className="fill-white text-[11px] font-bold" transform={`rotate(90,${size / 2},${size / 2})`}>
        {percent}%
      </text>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════ */
export default function CourseWatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [course,           setCourse]           = useState<Course | null>(null);
  const [loading,          setLoading]          = useState(true);
  const [activeLesson,     setActiveLesson]     = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number | string>>(new Set());

  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [lessonQuizScores, setLessonQuizScores] = useState<Record<number, number>>({});
  const [finalQuizScores,  setFinalQuizScores]  = useState<Record<number, number>>({});
  const [watchedLessons,   setWatchedLessons]   = useState<Set<number>>(new Set());
  const [videoProgress,    setVideoProgress]    = useState<Record<number, number>>({});
  const [videoEnded,       setVideoEnded]       = useState(false);

  const [activeLessonQuiz, setActiveLessonQuiz] = useState<number | null>(null);
  const [activeFinalQuiz,  setActiveFinalQuiz]  = useState<number | null>(null);
  const [lessonQuizAnswers,setLessonQuizAnswers]= useState<Record<number, number>>({});
  const [finalQuizAnswers, setFinalQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted,    setQuizSubmitted]    = useState(false);
  const [hasScored100Before, setHasScored100Before] = useState<Record<number, boolean>>({});

  const allLessons    = course?.sections?.flatMap(s => s.lessons || []) || [];
  const currentLesson = allLessons.find(l => l.id === activeLesson);
  const finalQuizzes  = course?.quizzes || [];
  const allLessonQuizzes = allLessons.flatMap(l => l.quizzes || []);
  const completedQuizzes = allLessonQuizzes.filter(q => lessonQuizScores[q.id] === 100).length;
  const totalItems    = allLessons.length + allLessonQuizzes.length;
  const completedCount= completedLessons.size + completedQuizzes;
  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  /* ── Data fetching ── */
  const fetchCourse = async () => {
    setLoading(true);
    try {
      const data = await api.get<Course>(`/courses/${slug}`);
      setCourse(data);
      if (data.sections?.length) {
        setExpandedSections(new Set([data.sections[0].id]));
        if (data.sections[0].lessons?.length) setActiveLesson(data.sections[0].lessons[0].id);
      }
    } catch { router.push('/profile'); }
    finally { setLoading(false); }
  };

  const saveProgress = async (
    completedLessons?: Set<number>,
    lessonQuizScores?: Record<number, number>,
    finalQuizScores?: Record<number, number>,
    watchedLessons?: Set<number>,
    videoProgress?: Record<number, number>
  ) => {
    if (!course || !user) return;
    console.log('Saving progress for course:', course.id, 'user:', user.email);
    try {
      await api.post(`/courses/${course.id}/progress`, {
        completed_lessons: Array.from(completedLessons || []),
        lesson_quiz_scores: lessonQuizScores || {},
        final_quiz_scores: finalQuizScores || {},
        watched_lessons: Array.from(watchedLessons || []),
        video_progress: videoProgress || {},
      });
    } catch (e) {
      console.log('Save error:', e);
    }
  };

  useEffect(() => { fetchCourse(); }, [slug]);

  // Save progress when leaving page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (course && user && (completedLessons.size > 0 || watchedLessons.size > 0)) {
        saveProgress(completedLessons, lessonQuizScores, finalQuizScores, watchedLessons, videoProgress);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [course, user, completedLessons, lessonQuizScores, finalQuizScores, watchedLessons, videoProgress]);

  useEffect(() => {
    if (course && user) {
      console.log('Loading progress for course:', course.id, 'user:', user.email);
      api.get<any[]>(`/courses/${course.id}/progress`)
        .then(progress => {
          const completedLessons = new Set<number>();
          const lessonQuizScores: Record<number,number> = {};
          const finalQuizScores: Record<number,number> = {};
          const watchedLessons = new Set<number>();
          const videoProgress: Record<number,number> = {};
          const s100: Record<number,boolean> = {};

          progress.forEach((p: any) => {
            if (p.lesson_id) {
              if (p.completed) completedLessons.add(p.lesson_id);
              if (p.watched) watchedLessons.add(p.lesson_id);
              if (p.video_seconds) videoProgress[p.lesson_id] = p.video_seconds;
            } else if (p.quiz_id) {
              lessonQuizScores[p.quiz_id] = p.score || 0;
              if (p.score === 100) s100[p.quiz_id] = true;
            }
          });

          setCompletedLessons(completedLessons);
          setLessonQuizScores(lessonQuizScores);
          setFinalQuizScores(finalQuizScores);
          setWatchedLessons(watchedLessons);
          setVideoProgress(videoProgress);
          setHasScored100Before(s100);
        })
        .catch((e) => {
          console.error('Error loading progress:', e);
        });
    }
  }, [course, user]);

  const canAccessLesson = (id: number, lessons: CourseLesson[]) => {
    const idx = lessons.findIndex(l => l.id === id);
    if (idx === 0) return true;
    const prev = lessons[idx - 1];
    return prev ? watchedLessons.has(prev.id) : true;
  };

  const handleVideoReady = () => {
    if (!activeLesson) return;
    const p = videoProgress[activeLesson] || 0;
    if (p > 0 && window.ytPlayer) window.ytPlayer.seekTo(p);
  };

  const handleVideoStateChange = (event: any) => {
    if (event.data === 0 && activeLesson) {
      setVideoEnded(true);
      const nw = new Set(watchedLessons); nw.add(activeLesson);
      setWatchedLessons(nw);
      saveProgress(completedLessons, lessonQuizScores, finalQuizScores, nw, videoProgress);
    }
  };

  const toggleLessonComplete = (id: number) => {
    if (!watchedLessons.has(id)) return;
    const n = new Set(completedLessons);
    n.has(id) ? n.delete(id) : n.add(id);
    setCompletedLessons(n);
    saveProgress(n, lessonQuizScores, finalQuizScores, watchedLessons, videoProgress);
  };

  const toggleSection = (id: number | string) => {
    const n = new Set(expandedSections);
    n.has(id) ? n.delete(id) : n.add(id);
    setExpandedSections(n);
  };

  const handleQuizAnswer = (qi: number, oi: number, type: 'lesson' | 'final') => {
    if (quizSubmitted) return;
    type === 'lesson'
      ? setLessonQuizAnswers(p => ({ ...p, [qi]: oi }))
      : setFinalQuizAnswers(p => ({ ...p, [qi]: oi }));
  };

  const submitLessonQuiz = (quizIdx: number) => {
    const lq = currentLesson?.quizzes?.filter(q => q.lesson_id === currentLesson.id) || [];
    const quiz = lq[quizIdx]; if (!quiz?.questions) return;
    let correct = 0;
    quiz.questions.forEach((q, i) => { if (lessonQuizAnswers[i] === q.correct_answer) correct++; });
    const score = Math.round((correct / quiz.questions.length) * 100);
    const ns = { ...lessonQuizScores, [quiz.id]: score };
    setLessonQuizScores(ns);
    if (score === 100) setHasScored100Before(p => ({ ...p, [quiz.id]: true }));
    setQuizSubmitted(true);
    saveProgress(completedLessons, ns, finalQuizScores, watchedLessons, videoProgress);
  };

  const submitFinalQuiz = (quizIdx: number) => {
    const quiz = finalQuizzes[quizIdx]; if (!quiz?.questions) return;
    let correct = 0;
    quiz.questions.forEach((q, i) => { if (finalQuizAnswers[i] === q.correct_answer) correct++; });
    const score = Math.round((correct / quiz.questions.length) * 100);
    const ns = { ...finalQuizScores, [quiz.id]: score };
    setFinalQuizScores(ns);
    if (score === 100) setHasScored100Before(p => ({ ...p, [quiz.id]: true }));
    setQuizSubmitted(true);
    saveProgress(completedLessons, lessonQuizScores, ns, watchedLessons, videoProgress);
  };

  const resetQuiz = () => { setLessonQuizAnswers({}); setFinalQuizAnswers({}); setQuizSubmitted(false); };

  useEffect(() => { if (activeLesson) setVideoEnded(false); }, [activeLesson]);

  const extractYouTubeId = (url: string | null) => {
    if (!url) return null;
    const m = url.match(/(?:embed\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  };
  const isYouTubeUrl = (url: string | null) => extractYouTubeId(url) !== null;
  const getVideoSrc = (url: string | null) => {
    if (!url) return '';
    if (url.startsWith('http')) {
      if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) return url;
      const m = url.match(/\/storage\/(.+)/);
      if (m) { const p = m[1].replace(/^courses\/videos\//, ''); return `http://localhost:8000/api/video/stream/${p}`; }
      return url;
    }
    const p = url.replace(/^storage\//, '').replace(/^courses\/videos\//, '');
    return `http://localhost:8000/api/video/stream/${p}`;
  };

  const initPlayer = (videoId: string) => {
    if (window.ytPlayer) window.ytPlayer.destroy();
    window.ytPlayer = new window.YT.Player('yt-player', {
      videoId, playerVars: { rel: 0, modestbranding: 1 },
      events: { onReady: handleVideoReady, onStateChange: handleVideoStateChange },
    });
  };

  const loadYouTubeAPI = (videoId: string) => {
    if (window.YT?.Player) { initPlayer(videoId); return; }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => initPlayer(videoId);
  };

  useEffect(() => {
    const id = extractYouTubeId(currentLesson?.video_url ?? null);
    if (id) loadYouTubeAPI(id);
    return () => { if (window.ytPlayer) { window.ytPlayer.destroy(); window.ytPlayer = null; } };
  }, [currentLesson?.video_url]);

  const downloadCertificate = async () => {
    const el = document.getElementById('certificate-template');
    if (!el) return;
    try {
      const canvas = await html2canvas(el, { scale: 2, logging: false, useCORS: true });
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${course?.slug}-certificate.pdf`);
    } catch (e) { console.error(e); }
  };

  const downloadResource = (doc: { file_path: string; title: string }) => {
    const base = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
    const a = document.createElement('a');
    a.href = `${base}/storage/${doc.file_path}`; a.download = doc.title; a.target = '_blank';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
      <div className="text-center space-y-5">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
          </div>
        </div>
        <p className="text-sm text-gray-500 tracking-widest uppercase font-medium animate-pulse">Loading your course…</p>
      </div>
    </div>
  );

  if (!course) return null;

  const allCompleted100 = finalQuizzes.length > 0 && finalQuizzes.every(q => Number(finalQuizScores[q.id]) === 100);
  const lvl = levelConfig[course.level];

  /* ── Quiz renderer ── */
  const renderQuizQuestions = (
    questions: QuizQuestion[],
    answers: Record<number, number>,
    quizId: number,
    type: 'lesson' | 'final',
  ) => questions.map((question, qIdx) => {
    const opts = Array.isArray(question.options) ? question.options : JSON.parse(question.options || '[]');
    const showResult = quizSubmitted && hasScored100Before[quizId];
    return (
      <div key={qIdx} className="rounded-3xl bg-gray-800/50 border border-gray-700/40 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-700/30 flex items-start gap-3">
          <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg bg-orange-500/15 border border-orange-500/20 flex items-center justify-center text-[11px] font-bold text-orange-400">
            {qIdx + 1}
          </span>
          <p className="text-sm font-medium text-gray-200 leading-relaxed">{question.question}</p>
        </div>
        <div className="p-3 space-y-2">
          {opts.map((option: string, oIdx: number) => {
            const isSelected = answers[qIdx] === oIdx;
            const isCorrect  = oIdx === question.correct_answer;
            let base = 'border-gray-600/40 bg-gray-700/30 hover:border-gray-500/60 hover:bg-gray-700/50';
            if (showResult) {
              if (isCorrect)              base = 'border-emerald-500/40 bg-emerald-500/10';
              else if (isSelected)        base = 'border-rose-500/40 bg-rose-500/10';
            } else if (isSelected)        base = 'border-orange-500/50 bg-orange-500/10';
            return (
              <button key={oIdx} disabled={quizSubmitted}
                onClick={() => handleQuizAnswer(qIdx, oIdx, type)}
                className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all duration-150 ${base} disabled:cursor-default`}>
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center text-[10px] font-bold border transition-all
                    ${showResult && isCorrect  ? 'bg-emerald-500 border-emerald-500 text-white'
                    : showResult && isSelected ? 'bg-rose-500 border-rose-500 text-white'
                    : isSelected              ? 'bg-orange-500 border-orange-500 text-white'
                    : 'border-gray-500/50 text-gray-400'}`}>
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span className={`flex-1 transition-colors ${
                    showResult && isCorrect  ? 'text-emerald-300'
                    : showResult && isSelected ? 'text-rose-300'
                    : 'text-gray-300'}`}>{option}</span>
                  {showResult && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  });

  const renderQuizResult = (questions: QuizQuestion[], answers: Record<number, number>, quizId: number, onReset: () => void) => {
    let correct = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correct_answer) correct++; });
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 70;
    const showAnswers = hasScored100Before[quizId];
    return (
      <div className="rounded-3xl border overflow-hidden bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/40">
        <div className="px-6 py-8 text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-3xl flex items-center justify-center
            bg-gradient-to-br from-orange-500/20 to-amber-400/10 border border-orange-500/20 shadow-lg shadow-orange-900/10">
            <Trophy className="w-9 h-9 text-orange-400" />
          </div>
          <div>
            <p className="text-4xl font-extrabold text-white tracking-tight">{score}%</p>
            <p className="text-sm text-gray-500 mt-1">{correct} / {questions.length} correct</p>
          </div>
          <span className={`inline-block text-sm font-semibold px-4 py-1.5 rounded-full border ${
            passed ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                   : 'bg-orange-500/10 text-orange-300 border-orange-500/20'}`}>
            {passed ? '🎉 Passed!' : '💪 Keep going!'}
          </span>
          {!showAnswers && score < 100 && (
            <p className="text-xs text-amber-400/80 bg-amber-900/20 border border-amber-700/20 px-3 py-2 rounded-xl inline-block">
              Score 100% to unlock answer explanations
            </p>
          )}
          <div className="mt-2">
            <button onClick={onReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-700/60 hover:bg-gray-600/60 border border-gray-600/40 text-white rounded-xl text-sm font-medium transition-all">
              <RotateCcw className="w-3.5 h-3.5" /> {showAnswers ? 'Retake' : 'Try Again'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0c0d0f] p-2 rounded-3xl overflow-hidden">
      <div className="min-h-screen bg-[#0c0d0f] text-white rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-gray-800/40 hover:shadow-orange-900/20 hover:border-orange-500/20 transition-all duration-500 max-w-[1600px] mx-auto">

      {/* ══ Top Navigation Bar ══ */}
      <nav className="bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/60">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/profile"
            className="group flex items-center gap-2.5 text-gray-400 hover:text-white transition-all duration-200">
            <span className="p-1.5 rounded-lg bg-gray-800/70 group-hover:bg-gray-700/70 border border-gray-700/40 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
            </span>
            <span className="text-sm font-medium hidden sm:block">Back to Profile</span>
          </Link>

          {/* Course title breadcrumb */}
          <div className="flex-1 min-w-0 text-center hidden md:block">
            <p className="text-sm font-semibold text-gray-300 truncate">{course.title}</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href={`/courses/${course.slug}`}
              className="text-sm text-orange-400/90 hover:text-orange-300 transition-colors font-medium hidden sm:block">
              Course Details
            </Link>
            {progressPercent === 100 && finalQuizzes.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300 hidden sm:block">Certificate Ready</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-7">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-7">

          {/* ══════════════════════════════════════════════
              LEFT COLUMN — Video + Content
          ══════════════════════════════════════════════ */}
          <div className="xl:col-span-2 space-y-6">

            {/* ── Video Player ── */}
            <div className="relative group">
              {/* glow ring */}
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-orange-500/20 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative aspect-video bg-gray-950 rounded-3xl overflow-hidden border border-gray-800/60 shadow-2xl shadow-black/60">
                {isYouTubeUrl(currentLesson?.video_url ?? null) ? (
                  <div id="yt-player" className="w-full h-full" />
                ) : currentLesson?.video_url ? (
                  <CustomVideoPlayer
                    src={getVideoSrc(currentLesson.video_url)}
                    autoPlay
                    onEnded={() => {
                      if (activeLesson) {
                        setVideoEnded(true);
                        const nw = new Set(watchedLessons); nw.add(activeLesson);
                        setWatchedLessons(nw);

                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-800/80 flex items-center justify-center border border-gray-700/40">
                        <Video className="w-7 h-7 text-gray-600" />
                      </div>
                      <p className="text-sm text-gray-500">No video available for this lesson</p>
                    </div>
                  </div>
                )}

                {/* Video ended overlay */}
                {videoEnded && (
                  <div className="absolute inset-0 bg-gray-950/85 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="w-full max-w-sm mx-4 p-8 rounded-3xl bg-gray-800/90 border border-orange-500/20 shadow-2xl shadow-black/60 text-center space-y-5">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Lesson Complete!</h3>
                        <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                          You've watched the entire video. Mark it complete to track your progress.
                        </p>
                      </div>
                      <button
                        onClick={() => activeLesson && toggleLessonComplete(activeLesson)}
                        className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:opacity-90 transition-opacity shadow-lg shadow-orange-900/30 active:scale-[0.98]">
                        Mark as Complete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Lesson Header Card ── */}
            <Panel className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                <div className="space-y-3 flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-white leading-snug">
                    {currentLesson?.title || course.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-700/50 border border-gray-600/40 rounded-xl text-gray-300">
                      <GraduationCap className="w-3.5 h-3.5 text-orange-400" /> {course.instructor}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-700/50 border border-gray-600/40 rounded-xl text-gray-300">
                      <Clock className="w-3.5 h-3.5 text-orange-400" />
                      {currentLesson?.duration_minutes ? `${currentLesson.duration_minutes}m` : `${course.duration_hours}h total`}
                    </span>
                    {lvl && (
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl ${lvl.cls}`}>
                        {lvl.icon} {lvl.label}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => activeLesson && toggleLessonComplete(activeLesson)}
                  disabled={!activeLesson || (!watchedLessons.has(activeLesson!) && !completedLessons.has(activeLesson!))}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex-shrink-0 border ${
                    activeLesson && completedLessons.has(activeLesson)
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-gray-700/50 border-gray-600/40 text-gray-300 hover:bg-gray-600/50 hover:border-gray-500/60'
                  } disabled:opacity-30 disabled:cursor-not-allowed`}>
                  <CheckCircle className="w-4 h-4" />
                  {activeLesson && completedLessons.has(activeLesson) ? 'Completed ✓' : 'Mark Complete'}
                </button>
              </div>

              {/* Progress bar */}
              <div className="mt-6 pt-5 border-t border-gray-700/40">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <ProgressRing percent={progressPercent} size={52} />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Course Progress</p>
                      <p className="text-sm text-gray-300 font-medium mt-0.5">{completedCount} of {totalItems} items done</p>
                    </div>
                  </div>
                  {progressPercent < 100 && (
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
                      <Lock className="w-3.5 h-3.5 text-orange-500/60" />
                      <span className="text-orange-400/70 font-medium">{100 - progressPercent}%</span> to unlock final exam
                    </div>
                  )}
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-600 via-amber-400 to-orange-500 transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </Panel>

            {/* ── Quiz + Files grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Lesson Quiz */}
              {(() => {
                const lq = currentLesson?.quizzes?.filter(q => q.lesson_id === currentLesson.id) || [];
                if (!lq.length) return null;
                return (
                  <Panel className="p-6">
                    <PanelHeader
                      icon={<ClipboardList className="w-5 h-5 text-violet-400" />}
                      title="Lesson Quiz"
                      subtitle={`${lq.length} quiz${lq.length > 1 ? 'zes' : ''} available`}
                    />

                    {activeLessonQuiz === null ? (
                      <div className="space-y-2.5">
                        {lq.map((quiz, i) => (
                          <button key={quiz.id}
                            onClick={() => { setActiveLessonQuiz(i); setLessonQuizAnswers({}); setQuizSubmitted(false); }}
                            className="w-full group flex items-center gap-4 p-4 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700/40 hover:border-gray-600/60 transition-all text-left">
                            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                              <ClipboardList className="w-4 h-4 text-violet-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-200 truncate">{quiz.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{quiz.questions?.length || 0} questions</p>
                            </div>
                            {lessonQuizScores[quiz.id] !== undefined && <ScoreBadge score={lessonQuizScores[quiz.id]} />}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <button onClick={() => { setActiveLessonQuiz(null); setLessonQuizAnswers({}); setQuizSubmitted(false); }}
                          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                          <ArrowLeft className="w-3.5 h-3.5" /> Back to Quizzes
                        </button>
                        <h4 className="font-bold text-white">{lq[activeLessonQuiz].title}</h4>

                        {quizSubmitted ? (
                          renderQuizResult(lq[activeLessonQuiz].questions || [], lessonQuizAnswers, lq[activeLessonQuiz].id, resetQuiz)
                        ) : (
                          <>
                            <div className="space-y-3">
                              {renderQuizQuestions(lq[activeLessonQuiz].questions || [], lessonQuizAnswers, lq[activeLessonQuiz].id, 'lesson')}
                            </div>
                            <button
                              onClick={() => submitLessonQuiz(activeLessonQuiz)}
                              disabled={Object.keys(lessonQuizAnswers).length < (lq[activeLessonQuiz].questions?.length || 0)}
                              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:opacity-90 transition-opacity disabled:opacity-30 shadow-lg shadow-orange-900/20">
                              Submit Quiz ({Object.keys(lessonQuizAnswers).length}/{lq[activeLessonQuiz].questions?.length})
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </Panel>
                );
              })()}

              {/* Lesson Files */}
              {currentLesson?.resources && currentLesson.resources.length > 0 && (
                <Panel className="p-6">
                  <PanelHeader
                    icon={<FileText className="w-5 h-5 text-orange-400" />}
                    title="Lesson Files"
                    subtitle={`${currentLesson.resources.length} downloadable resource${currentLesson.resources.length > 1 ? 's' : ''}`}
                  />
                  <div className="space-y-2.5">
                    {currentLesson.resources.map(doc => (
                      <button key={doc.id} onClick={() => downloadResource(doc)}
                        className="w-full group flex items-center gap-4 p-4 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700/40 hover:border-orange-500/30 transition-all text-left">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-orange-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-200 truncate">{doc.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 uppercase">{doc.file_type} · {Math.round(doc.file_size / 1024)}KB</p>
                        </div>
                        <Download className="w-4 h-4 text-gray-500 group-hover:text-orange-400 transition-colors flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </Panel>
              )}
            </div>

            {/* ── Final Assessment ── */}
            {progressPercent === 100 && finalQuizzes.length > 0 && (
              <Panel highlight className="p-7">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-3xl bg-gradient-to-br from-orange-500/20 to-amber-400/10 border border-orange-500/20 shadow-inner">
                    <Award className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Final Assessment</h3>
                    <p className="text-sm text-gray-400 mt-0.5">Test your mastery · Earn your certificate</p>
                  </div>
                </div>

                {/* Congrats notice */}
                <div className="mb-6 flex items-start gap-3 p-4 rounded-3xl bg-gradient-to-br from-orange-500/5 to-amber-500/5 border border-orange-500/15">
                  <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300 leading-relaxed">
                    🎉 Congratulations on completing all lessons! Take the final assessment to demonstrate your expertise and unlock your certificate.
                  </p>
                </div>

                {activeFinalQuiz === null ? (
                  <div className="space-y-3">
                    {finalQuizzes.map((quiz, i) => (
                      <button key={quiz.id}
                        onClick={() => { setActiveFinalQuiz(i); setFinalQuizAnswers({}); setQuizSubmitted(false); }}
                        className="w-full group flex items-center gap-4 p-5 rounded-3xl bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700/40 hover:border-orange-500/30 transition-all text-left">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                          <Target className="w-5 h-5 text-orange-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-200 truncate">{quiz.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{quiz.questions?.length || 0} questions</p>
                        </div>
                        {finalQuizScores[quiz.id] !== undefined && <ScoreBadge score={Number(finalQuizScores[quiz.id])} />}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-5">
                    <button onClick={() => { setActiveFinalQuiz(null); setFinalQuizAnswers({}); setQuizSubmitted(false); }}
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Assessments
                    </button>
                    <h4 className="text-lg font-bold text-white">{finalQuizzes[activeFinalQuiz].title}</h4>

                    {quizSubmitted ? (
                      renderQuizResult(finalQuizzes[activeFinalQuiz].questions || [], finalQuizAnswers, finalQuizzes[activeFinalQuiz].id, resetQuiz)
                    ) : (
                      <>
                        <div className="space-y-3">
                          {renderQuizQuestions(finalQuizzes[activeFinalQuiz].questions || [], finalQuizAnswers, finalQuizzes[activeFinalQuiz].id, 'final')}
                        </div>
                        <button
                          onClick={() => submitFinalQuiz(activeFinalQuiz)}
                          disabled={Object.keys(finalQuizAnswers).length < (finalQuizzes[activeFinalQuiz].questions?.length || 0)}
                          className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:opacity-90 transition-opacity disabled:opacity-30 shadow-lg shadow-orange-900/20">
                          Submit Final Assessment ({Object.keys(finalQuizAnswers).length}/{finalQuizzes[activeFinalQuiz].questions?.length})
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Certificate download */}
                {allCompleted100 && (
                  <div className="mt-7 pt-6 border-t border-gray-700/40 space-y-3">
                    <button onClick={downloadCertificate}
                      className="w-full flex items-center justify-center gap-3 py-4 rounded-3xl font-bold text-sm
                        bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500
                        hover:from-orange-500 hover:via-amber-400 hover:to-orange-400
                        text-white shadow-2xl shadow-orange-900/30 hover:shadow-orange-800/40
                        transition-all active:scale-[0.99]">
                      <Award className="w-5 h-5" />
                      Download Your Certificate
                      <Download className="w-4 h-4 opacity-80" />
                    </button>
                    <p className="text-xs text-center text-gray-600">High-quality PDF certificate generated instantly</p>
                  </div>
                )}
              </Panel>
            )}
          </div>

          {/* ══════════════════════════════════════════════
              RIGHT COLUMN — Playlist Sidebar
          ══════════════════════════════════════════════ */}
          <div className="xl:col-span-1">
            <div className="sticky top-[72px]">
              <div className="rounded-3xl border border-gray-700/40 bg-gray-900/60 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">

                {/* Sidebar header */}
                <div className="px-5 py-4 border-b border-gray-800/60 bg-gray-800/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                        <BookOpen className="w-4 h-4 text-orange-400" />
                      </div>
                      <h3 className="text-sm font-bold text-white">Course Playlist</h3>
                    </div>
                    <ProgressRing percent={progressPercent} size={40} />
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[11px] px-2.5 py-1 bg-gray-700/50 border border-gray-600/30 rounded-lg text-gray-400">
                      {allLessons.length} lessons
                    </span>
                    <span className="text-[11px] px-2.5 py-1 bg-gray-700/50 border border-gray-600/30 rounded-lg text-gray-400">
                      {allLessonQuizzes.length} quizzes
                    </span>
                    <span className="text-[11px] px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400">
                      {completedLessons.size} done
                    </span>
                  </div>
                </div>

                {/* Lesson list */}
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700">
                  {course.sections?.map((section, sIdx) => {
                    const isExp = expandedSections.has(section.id);
                    const lessons = section.lessons || [];
                    const sectionCompleted = lessons.filter(l => completedLessons.has(l.id)).length;

                    return (
                      <div key={section.id} className="border-b border-gray-800/50 last:border-0">
                        {/* Section toggle */}
                        <button onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-800/40 transition-colors text-left group">
                          <span className="w-5 h-5 rounded-md bg-gray-700/60 border border-gray-600/40 flex items-center justify-center flex-shrink-0 group-hover:border-orange-500/30 transition-colors">
                            {isExp ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-200 truncate group-hover:text-white transition-colors">
                              {section.title}
                            </p>
                            <p className="text-[10px] text-gray-600 mt-0.5">{sectionCompleted}/{lessons.length} completed</p>
                          </div>
                          {sectionCompleted === lessons.length && lessons.length > 0 && (
                            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          )}
                        </button>

                        {/* Lesson items */}
                        {isExp && (
                          <div className="bg-gray-900/50">
                            {lessons.map((lesson, lIdx) => {
                              const isActive    = activeLesson === lesson.id;
                              const isCompleted = completedLessons.has(lesson.id);
                              const canAccess   = canAccessLesson(lesson.id, allLessons);
                              const lq = lesson.quizzes?.filter(q => q.lesson_id === lesson.id) || [];
                              const allQ100 = lq.every(q => lessonQuizScores[q.id] === 100);
                              const anyAttempted = lq.some(q => lessonQuizScores[q.id] !== undefined);

                              return (
                                <button key={lesson.id}
                                  onClick={() => {
                                    if (!canAccess) return;
                                    setActiveLesson(lesson.id);
                                    setActiveLessonQuiz(null);
                                    setActiveFinalQuiz(null);
                                    setLessonQuizAnswers({});
                                    setFinalQuizAnswers({});
                                    setQuizSubmitted(false);
                                  }}
                                  disabled={!canAccess}
                                  className={`w-full flex items-start gap-3 px-5 py-3.5 text-left transition-all border-t border-gray-800/40
                                    ${isActive
                                      ? 'bg-gradient-to-r from-orange-600/12 to-transparent border-l-2 border-l-orange-500'
                                      : canAccess
                                        ? 'hover:bg-gray-800/40'
                                        : 'opacity-35 cursor-not-allowed'}`}>

                                  {/* Status icon */}
                                  <div className={`flex-shrink-0 mt-0.5 w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all ${
                                    !canAccess   ? 'bg-gray-800 border border-gray-700/40 text-gray-600'
                                    : isCompleted ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                                    : isActive    ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400'
                                    : 'bg-gray-800 border border-gray-700/40 text-gray-500'}`}>
                                    {!canAccess   ? <Lock className="w-3 h-3" />
                                    : isCompleted ? <CheckCircle className="w-3.5 h-3.5" />
                                    : isActive    ? <Play className="w-3 h-3 fill-current" />
                                    : <span>{lIdx + 1}</span>}
                                  </div>

                                  {/* Info */}
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-medium leading-snug truncate transition-colors ${
                                      isActive ? 'text-orange-300' : 'text-gray-300'}`}>
                                      {lesson.title}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                      {lesson.type === 'video' && (
                                        <span className="flex items-center gap-1 text-[10px] text-gray-600">
                                          <Video className="w-2.5 h-2.5" />
                                          {lesson.duration_minutes ? `${lesson.duration_minutes}m` : 'Video'}
                                        </span>
                                      )}
                                      {lq.length > 0 && (
                                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-lg border ${
                                          allQ100
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : anyAttempted
                                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                              : 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                                        }`}>
                                          {lq.length} Quiz{lq.length > 1 ? 'es' : ''}{allQ100 && ' ✓'}
                                        </span>
                                      )}
                                      {lesson.resources && lesson.resources.length > 0 && (
                                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-lg border bg-orange-500/10 text-orange-400 border-orange-500/20">
                                          {lesson.resources.length} File{lesson.resources.length > 1 ? 's' : ''}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Hidden Certificate Template ── */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div id="certificate-template" style={{
          width: '800px', height: '600px', backgroundColor: '#ffffff', padding: '48px',
          border: '20px double #ea580c', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          color: '#111827', fontFamily: 'serif',
        }}>
          <Award style={{ width: '96px', height: '96px', color: '#ea580c', marginBottom: '24px' }} />
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px' }}>Certificate of Completion</h1>
          <p style={{ fontSize: '20px', marginBottom: '32px' }}>This is to certify that</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold', borderBottom: '2px solid #9ca3af', padding: '0 32px 8px', marginBottom: '32px' }}>
            {user?.displayName || 'Our Student'}
          </p>
          <p style={{ fontSize: '20px', marginBottom: '32px' }}>has successfully completed the course</p>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#ea580c', marginBottom: '48px' }}>{course?.title}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 48px', marginTop: 'auto' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #9ca3af', paddingTop: '8px', width: '192px' }}>
                <p style={{ fontWeight: 'bold' }}>Instructor</p>
                <p style={{ fontSize: '14px' }}>{course?.instructor}</p>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #9ca3af', paddingTop: '8px', width: '192px' }}>
                <p style={{ fontWeight: 'bold' }}>Date</p>
                <p style={{ fontSize: '14px' }}>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}