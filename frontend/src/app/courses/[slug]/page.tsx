'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Clock, BookOpen, GraduationCap, ArrowLeft, CheckCircle, Play, X,
  ChevronDown, ChevronUp, Lock, Video, FileText, HelpCircle, AlertCircle,
  Star, MessageSquare, Send, Sparkles, Award, Users, TrendingUp, Zap,
  Shield, Globe, Infinity, Download, BarChart2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CourseCartItem } from '@/types';
import CustomVideoPlayer from '@/components/CustomVideoPlayer';

/* ── Types (unchanged) ─────────────────────────────────────────── */
interface Course {
  id: number; title: string; slug: string; instructor: string;
  description: string; syllabus: string | null; price: string;
  duration_hours: number; lessons_count: number; level: string;
  image: string | null; preview_video: string | null;
  is_featured: boolean; is_active: boolean; category: string;
  created_at: string; updated_at: string;
}
interface CourseLesson {
  id: number; section_id: number; title: string; type: string;
  content: string | null; video_url: string | null;
  duration_minutes: number | null; is_free_preview: boolean;
  order: number; resources?: any[]; quizzes?: any[];
}
interface CourseSection {
  id: number; course_id: number; title: string;
  description: string | null; order: number; lessons?: CourseLesson[];
}
interface CourseQuiz {
  id: number; course_id: number; section_id: number; title: string;
  description: string | null; passing_score: number; order: number;
}
interface CourseDetailResponse extends Course {
  sections?: CourseSection[]; quizzes?: CourseQuiz[];
}
interface ApiCourseReview {
  id: number; course_id: number; user_id: number | null;
  user_name: string; user_email: string | null; rating: number;
  comment: string; is_approved: boolean; created_at: string;
}
interface ApiCourseQuestion {
  id: number; course_id: number; user_id: number | null;
  user_name: string; user_email: string | null; question: string;
  answer: string | null; is_answered: boolean; is_approved: boolean;
  created_at: string;
}

/* ── Constants ──────────────────────────────────────────────────── */
const levelConfig: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  beginner:     { label: 'Beginner',     cls: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20', icon: <Zap className="w-3 h-3" /> },
  intermediate: { label: 'Intermediate', cls: 'bg-amber-500/10  text-amber-600  border border-amber-500/20',  icon: <TrendingUp className="w-3 h-3" /> },
  advanced:     { label: 'Advanced',     cls: 'bg-rose-500/10   text-rose-600   border border-rose-500/20',   icon: <Award className="w-3 h-3" /> },
};
const categoryLabels: Record<string, string> = {
  writing: 'Writing', literature: 'Literature', language: 'Language', general: 'General',
};

/* ── Helper: Star renderer ──────────────────────────────────────── */
function Stars({
  rating, interactive = false, onRate, size = 'md',
}: { rating: number; interactive?: boolean; onRate?: (r: number) => void; size?: 'sm' | 'md' }) {
  const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${sz} transition-transform ${interactive ? 'cursor-pointer hover:scale-125' : ''}
            ${s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
          onClick={() => interactive && onRate?.(s)}
        />
      ))}
    </div>
  );
}

/* ── Helper: Avatar initials ────────────────────────────────────── */
function Avatar({ name, size = 10 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['from-orange-400 to-amber-400', 'from-rose-400 to-pink-400',
    'from-violet-400 to-purple-400', 'from-teal-400 to-cyan-400', 'from-blue-400 to-indigo-400'];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br ${colors[idx]}
      flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}>
      {initials}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
export default function CourseDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const { addToCartCourse, cart } = useCart();
  const { user } = useAuth();
  const isStaff  = user?.role === 'staff';

  const [course,           setCourse]           = useState<CourseDetailResponse | null>(null);
  const [loading,          setLoading]          = useState(true);
  const [errorMessage,     setErrorMessage]     = useState<string | null>(null);
  const [syllabus,         setSyllabus]         = useState<string[]>([]);
  const [showPreview,      setShowPreview]      = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [previewVideoUrl,  setPreviewVideoUrl]  = useState<string | null>(null);

  const [activeTab,          setActiveTab]          = useState<'overview' | 'reviews' | 'qanda'>('overview');
  const [reviews,            setReviews]            = useState<ApiCourseReview[]>([]);
  const [questions,          setQuestions]          = useState<ApiCourseQuestion[]>([]);
  const [averageRating,      setAverageRating]      = useState(0);
  const [newReview,          setNewReview]          = useState({ rating: 5, comment: '' });
  const [newQuestion,        setNewQuestion]        = useState('');
  const [submitting,         setSubmitting]         = useState(false);
  const [hasEnrolled,        setHasEnrolled]        = useState(false);
  const [userReview,         setUserReview]         = useState<ApiCourseReview | null>(null);
  const [editingReview,      setEditingReview]      = useState(false);

  useEffect(() => { if (params.slug) fetchCourse(); }, [params.slug]);

  useEffect(() => {
    if (course?.sections?.length) setExpandedSections(new Set([course.sections[0].id]));
  }, [course]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${params.slug}`);
      if (res.ok) {
        const data: CourseDetailResponse = await res.json();
        setCourse(data);
        if (data.syllabus) { try { setSyllabus(JSON.parse(data.syllabus)); } catch { setSyllabus([]); } }
        if (data.sections) {
          for (const sec of data.sections) {
            const freeLesson = sec.lessons?.find(l => l.is_free_preview && l.video_url);
            if (freeLesson?.video_url) { setPreviewVideoUrl(freeLesson.video_url); break; }
          }
        }
      } else {
        setErrorMessage(`Course not found (Error ${res.status}).`);
      }
    } catch {
      setErrorMessage('A network error occurred while fetching the course.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!course?.id) return;
    Promise.all([
      fetch(`/api/courses/${course.slug}/reviews`).then(r => r.ok ? r.json() : Promise.reject()),
      fetch(`/api/courses/${course.slug}/questions`).then(r => r.ok ? r.json() : Promise.reject()),
    ]).then(([rev, q]) => {
      setReviews(rev.reviews || []);
      setAverageRating(rev.average_rating || 0);
      setQuestions(q.questions || []);
    }).catch(() => {});
  }, [course?.id, course?.slug]);

  useEffect(() => {
    if (!user || !course?.id) { setHasEnrolled(false); return; }
    const check = async () => {
      let enrolled = false;
      const local = JSON.parse(localStorage.getItem('lumina_orders') || '[]');
      for (const o of local) {
        if (!o?.items) continue;
        if (o.userId && o.userId !== user.uid) continue;
        if (!['delivered', 'completed'].includes(o.status)) continue;
        if (o.items.some((i: any) => i?.type === 'course' && String(i.courseId || i.bookId) === String(course.id))) { enrolled = true; break; }
      }
      if (!enrolled) {
        try {
          const token = localStorage.getItem('auth_token');
          const r = await fetch('/api/orders', { headers: { 'Authorization': `Bearer ${token}` } });
          if (r.ok) {
            const orders = await r.json();
            for (const o of orders) {
              if (!['delivered', 'completed'].includes(o.status)) continue;
              if ((o.items || []).some((i: any) => String(i.course_id || i.courseId) === String(course.id))) { enrolled = true; break; }
            }
          }
        } catch {}
      }
      setHasEnrolled(enrolled);
    };
    check();
    const stored = localStorage.getItem(`course_reviews_${user.email}_${course.id}`);
    if (stored) { try { setUserReview(JSON.parse(stored)); } catch {} }
  }, [user, course?.id]);

  /* ── Handlers ── */
  const handleReviewSubmit = async () => {
    if (!course || !user || !hasEnrolled || !newReview.comment) return;
    setSubmitting(true);
    try {
      let res;
      if (editingReview && userReview) {
        res = await fetch(`/api/reviews/${userReview.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rating: newReview.rating, comment: newReview.comment }) });
      } else {
        res = await fetch(`/api/courses/${course.slug}/reviews`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_name: user.displayName, user_email: user.email, ...newReview }) });
      }
      if (!res.ok) throw new Error();
      const { review: rv } = await res.json();
      localStorage.setItem(`course_reviews_${user.email}_${course.id}`, JSON.stringify(rv));
      setReviews(prev => [rv, ...prev.filter(r => r.id !== rv.id)]);
      setUserReview(rv); setEditingReview(false); setNewReview({ rating: 5, comment: '' });
    } catch { alert('Failed to submit review.'); } finally { setSubmitting(false); }
  };

  const handleQuestionSubmit = async () => {
    if (!course || !user || !hasEnrolled || !newQuestion) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/courses/${course.slug}/questions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_name: user.displayName, user_email: user.email, question: newQuestion }) });
      if (!res.ok) throw new Error();
      const { question: q } = await res.json();
      setQuestions(prev => [q, ...prev]); setNewQuestion('');
    } catch { alert('Failed to submit question.'); } finally { setSubmitting(false); }
  };

  const handleEnroll = () => {
    if (!course) return;
    addToCartCourse({ id: course.id, title: course.title, slug: course.slug, instructor: course.instructor, description: course.description, price: parseFloat(course.price), duration_hours: course.duration_hours, lessons_count: course.lessons_count, level: course.level, category: course.category, preview_video: course.preview_video, is_featured: course.is_featured, image: course.image } as CourseCartItem);
  };

  const toggleSection = (id: number) => setExpandedSections(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const isYouTube = (url: string | null) => url?.includes('youtube.com') || url?.includes('youtu.be') || url?.includes('vimeo.com');

  const getVideoSrc = (url: string | null) => {
    if (!url) return '';
    if (url.startsWith('http')) {
      const m = url.match(/\/storage\/(.+)/);
      if (m) { const p = m[1].replace(/^courses\/videos\//, ''); return `http://localhost:8000/api/video/stream/${p}`; }
      return url;
    }
    const p = url.replace(/^storage\//, '').replace(/^courses\/videos\//, '');
    return `http://localhost:8000/api/video/stream/${p}`;
  };

  const isInCart = cart.some(i => i.courseId === String(course?.id));

  /* ── Loading skeleton ── */
  if (loading) return (
    <div className="min-h-screen bg-[#faf9f7] animate-pulse">
      <div className="h-14 bg-white border-b border-gray-100" />
      <div className="h-[420px] bg-gradient-to-br from-orange-100 to-amber-50" />
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-5">
          {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-200 rounded-3xl" />)}
        </div>
        <div className="h-72 bg-gray-200 rounded-3xl" />
      </div>
    </div>
  );

  if (!course) return null;

  const totalLessons  = course.sections?.reduce((a, s) => a + (s.lessons?.length || 0), 0) || 0;
  const totalFiles    = course.sections?.reduce((a, s) => a + (s.lessons?.reduce((b, l) => b + (l.resources?.length || 0), 0) || 0), 0) || 0;
  const totalDuration = course.sections?.reduce((a, s) => a + (s.lessons?.reduce((b, l) => b + (l.duration_minutes || 0), 0) || 0), 0) || 0;
  const lvl = levelConfig[course.level];

  return (
    <div className="min-h-screen bg-[#faf9f7]">

      {/* ══ Preview Modal ══ */}
      {showPreview && previewVideoUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4" onClick={() => setShowPreview(false)}>
          <div className="relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] border border-white/10" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowPreview(false)} className="absolute top-4 right-4 z-20 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-all border border-white/10 hover:scale-110">
              <X className="w-4 h-4" />
            </button>
            <div className="aspect-video bg-black">
              {isYouTube(previewVideoUrl)
                ? <iframe src={`${previewVideoUrl}?autoplay=1`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                : <CustomVideoPlayer src={getVideoSrc(previewVideoUrl)} autoPlay />}
            </div>
          </div>
        </div>
      )}

      {/* ══ Back Nav ══ */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100/80 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors group">
            <span className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-orange-50 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
            </span>
            Back to Courses
          </Link>
        </div>
      </div>

      {/* ══ Hero Banner ══ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400">
        {/* decorative */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          {/* badges */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {course.is_featured && (
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
                <Star className="w-3 h-3 fill-white" /> Featured
              </span>
            )}
            {lvl && (
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full">
                {lvl.icon} {lvl.label}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-orange-100 text-xs font-semibold px-3.5 py-1.5 rounded-full">
              {categoryLabels[course.category] || course.category}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-center">
            {/* Video thumb */}
            <div className="w-full lg:w-[52%] aspect-video rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.35)] border-2 border-white/20 bg-black relative group flex-shrink-0">
              {course.preview_video ? (
                isYouTube(course.preview_video) ? (
                  <iframe src={`${course.preview_video}?autoplay=0`} className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                ) : (
                  <CustomVideoPlayer key={`pv-${course.slug}`} src={getVideoSrc(course.preview_video)} />
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="p-5 rounded-full bg-orange-500/20 border border-orange-400/30">
                    <Play className="w-12 h-12 text-orange-400" />
                  </div>
                  <p className="text-gray-400 text-sm font-medium">No preview available</p>
                </div>
              )}
              {/* preview play overlay for free lessons */}
              {previewVideoUrl && previewVideoUrl !== course.preview_video && (
                <button onClick={() => setShowPreview(true)}
                  className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-sm hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all border border-white/10">
                  <Play className="w-3 h-3 fill-white" /> Preview Lesson
                </button>
              )}
            </div>

            {/* Text */}
            <div className="flex-1 space-y-5">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-white leading-tight tracking-tight">
                {course.title}
              </h1>
              <p className="text-orange-50/85 text-lg leading-relaxed line-clamp-4">
                {course.description}
              </p>

              {/* quick stats */}
              <div className="flex flex-wrap gap-4 pt-2">
                {[
                  { icon: <Clock className="w-4 h-4" />, label: `${course.duration_hours}h total` },
                  { icon: <BookOpen className="w-4 h-4" />, label: `${course.lessons_count} lessons` },
                  { icon: <Globe className="w-4 h-4" />, label: 'Lifetime access' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-1.5 text-sm text-white/80">
                    {s.icon} <span>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* instructor mini */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[11px] text-orange-200 uppercase tracking-widest font-semibold">Instructor</p>
                  <p className="text-white font-semibold text-sm">{course.instructor}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* wave divider */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none" fill="#faf9f7">
          <path d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" />
        </svg>
      </section>

      {/* ══ Body ══ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {errorMessage ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-5">
            <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-center shadow-sm">
              <AlertCircle className="w-9 h-9 text-red-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Something went wrong</h3>
              <p className="text-gray-500 max-w-md">{errorMessage}</p>
            </div>
            <button onClick={() => router.push('/courses')}
              className="px-8 py-2.5 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200">
              Back to Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* ─── Left / Main ─── */}
            <div className="lg:col-span-2 space-y-6">

              {/* What You'll Learn */}
              <Card>
                <SectionTitle icon={<Sparkles className="w-5 h-5 text-orange-500" />}>What You'll Learn</SectionTitle>
                <p className="text-gray-600 leading-relaxed">{course.description}</p>
              </Card>

              {/* Syllabus fallback */}
              {syllabus.length > 0 && !course.sections?.length && (
                <Card>
                  <SectionTitle icon={<BarChart2 className="w-5 h-5 text-orange-500" />}>Course Syllabus</SectionTitle>
                  <div className="space-y-2.5">
                    {syllabus.map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-orange-50 transition-colors group border border-transparent hover:border-orange-100">
                        <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold flex-shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                          {i + 1}
                        </div>
                        <p className="text-sm text-gray-800 font-medium flex-1 pt-0.5">{item}</p>
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Course Content */}
              {course.sections?.length ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* header */}
                  <div className="px-7 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-5 h-5 text-orange-500" />
                        <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                      </div>
                      <p className="text-sm text-gray-500">
                        {course.sections.length} sections · {totalLessons} lessons
                        {totalFiles > 0 && ` · ${totalFiles} files`}
                        · {totalDuration > 0 ? `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m` : `${course.duration_hours}h`} total
                      </p>
                    </div>
                    <button onClick={() => setExpandedSections(expandedSections.size === course.sections!.length ? new Set() : new Set(course.sections!.map(s => s.id)))}
                      className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors self-start sm:self-auto">
                      {expandedSections.size === course.sections.length ? 'Collapse all' : 'Expand all'}
                    </button>
                  </div>

                  <div className="divide-y divide-gray-50">
                    {course.sections.map((section, secIdx) => {
                      const isExp = expandedSections.has(section.id);
                      const lessons = section.lessons || [];
                      const secDur = lessons.reduce((a, l) => a + (l.duration_minutes || 0), 0);
                      const freePreviews = lessons.filter(l => l.is_free_preview).length;
                      const secQuizzes = lessons.reduce((a, l) => a + (l.quizzes?.length || 0), 0);
                      const secFiles   = lessons.reduce((a, l) => a + (l.resources?.length || 0), 0);

                      return (
                        <div key={section.id}>
                          <button onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center gap-4 px-7 py-4 hover:bg-gray-50/80 transition-colors text-left group">
                            {/* section number */}
                            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xs font-bold flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                              {secIdx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{section.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5 flex flex-wrap gap-1.5">
                                <span>{lessons.length} lesson{lessons.length !== 1 ? 's' : ''}</span>
                                {secFiles > 0 && <><span className="opacity-30">·</span><span>{secFiles} file{secFiles !== 1 ? 's' : ''}</span></>}
                                {secQuizzes > 0 && <><span className="opacity-30">·</span><span>{secQuizzes} quiz{secQuizzes !== 1 ? 'zes' : ''}</span></>}
                                {secDur > 0 && <><span className="opacity-30">·</span><span>{secDur}m</span></>}
                                {freePreviews > 0 && <><span className="opacity-30">·</span><span className="text-orange-500 font-medium">{freePreviews} free</span></>}
                              </p>
                            </div>
                            <div className={`p-1 rounded-lg transition-colors ${isExp ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                              {isExp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </button>

                          {isExp && (
                            <div className="bg-gray-50/60 border-t border-gray-100/80">
                              {lessons.map((lesson, lIdx) => {
                                const hasVideo = lesson.type === 'video' || !!lesson.video_url;
                                const canPreview = lesson.is_free_preview && !!lesson.video_url;

                                return (
                                  <div key={lesson.id}
                                    className={`flex items-center gap-4 px-7 py-3.5 border-b border-gray-100/60 last:border-0
                                      transition-colors ${canPreview ? 'cursor-pointer hover:bg-orange-50/70' : ''}`}
                                    onClick={() => { if (canPreview && lesson.video_url) { setPreviewVideoUrl(lesson.video_url); setShowPreview(true); } }}>

                                    {/* thumbnail */}
                                    <div className="relative w-[72px] h-[44px] rounded-xl overflow-hidden bg-gray-200 flex-shrink-0 shadow-sm">
                                      {hasVideo && lesson.video_url ? (
                                        <>
                                          <img
                                            src={`https://img.youtube.com/vi/${
                                              lesson.video_url.includes('youtu.be/')
                                                ? lesson.video_url.split('/').pop()?.split('?')[0]
                                                : lesson.video_url.includes('v=')
                                                  ? lesson.video_url.split('v=')[1]?.split('&')[0]
                                                  : ''
                                            }/mqdefault.jpg`}
                                            alt=""
                                            className="w-full h-full object-cover"
                                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                          />
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            {canPreview
                                              ? <Play className="w-4 h-4 text-white fill-white" />
                                              : <Lock className="w-3.5 h-3.5 text-white/80" />}
                                          </div>
                                        </>
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                          {lesson.type === 'document' ? <FileText className="w-4 h-4 text-gray-400" />
                                            : lesson.type === 'quiz'  ? <HelpCircle className="w-4 h-4 text-gray-400" />
                                            : <Video className="w-4 h-4 text-gray-400" />}
                                        </div>
                                      )}
                                    </div>

                                    {/* info */}
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-sm font-medium truncate ${canPreview ? 'text-orange-700' : 'text-gray-700'}`}>
                                        <span className="text-gray-400 mr-1.5 text-xs">{lIdx + 1}.</span>
                                        {lesson.title}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        {lesson.quizzes?.length ? (
                                          <span className="text-[10px] font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-1.5 py-0.5 rounded-full">
                                            {lesson.quizzes.length} quiz
                                          </span>
                                        ) : null}
                                        {lesson.resources?.length ? (
                                          <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">
                                            {lesson.resources.length} file
                                          </span>
                                        ) : null}
                                        {lesson.duration_minutes ? (
                                          <span className="text-[10px] text-gray-400">{lesson.duration_minutes}m</span>
                                        ) : null}
                                        {canPreview && (
                                          <span className="text-[10px] font-semibold text-orange-500 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded-full">
                                            Free preview
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* lock / play */}
                                    <div className="flex-shrink-0">
                                      {canPreview
                                        ? <div className="p-1.5 rounded-lg bg-orange-100"><Play className="w-3.5 h-3.5 text-orange-600 fill-orange-600" /></div>
                                        : <div className="p-1.5 rounded-lg bg-gray-100"><Lock className="w-3.5 h-3.5 text-gray-400" /></div>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Card className="text-center py-14">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-7 h-7 text-gray-400" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Curriculum coming soon</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">The course content is being updated. Check back shortly!</p>
                </Card>
              )}

              {/* Instructor card */}
              <Card>
                <SectionTitle icon={<GraduationCap className="w-5 h-5 text-orange-500" />}>Your Instructor</SectionTitle>
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center shadow-sm border border-orange-100 flex-shrink-0">
                    <GraduationCap className="w-8 h-8 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">{course.instructor}</p>
                    <p className="text-sm text-gray-500 mt-0.5">Course Instructor</p>
                  </div>
                </div>
              </Card>

              {/* Reviews & Q&A tabs */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Tab bar */}
                <div className="flex border-b border-gray-100 bg-gray-50/50">
                  {([ 
                    { key: 'overview', label: 'Overview',  icon: <Sparkles className="w-4 h-4" /> },
                    { key: 'reviews',  label: `Reviews (${reviews.length})`,  icon: <Star className="w-4 h-4" /> },
                    { key: 'qanda',    label: `Q&A (${questions.length})`,    icon: <MessageSquare className="w-4 h-4" /> },
                  ] as const).map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all relative
                        ${activeTab === tab.key ? 'text-orange-600 bg-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                      {tab.icon} {tab.label}
                      {activeTab === tab.key && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-orange-500 rounded-full" />}
                    </button>
                  ))}
                </div>

                <div className="p-7">

                  {/* Overview tab */}
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { icon: <Clock className="w-5 h-5 text-orange-500" />,    label: 'Duration',   value: `${course.duration_hours}h` },
                        { icon: <BookOpen className="w-5 h-5 text-orange-500" />, label: 'Lessons',    value: course.lessons_count },
                        { icon: <Users className="w-5 h-5 text-orange-500" />,    label: 'Level',      value: lvl?.label || course.level },
                        { icon: <Star className="w-5 h-5 text-orange-500" />,     label: 'Rating',     value: averageRating.toFixed(1) },
                        { icon: <Infinity className="w-5 h-5 text-orange-500" />, label: 'Access',     value: 'Lifetime' },
                        { icon: <Download className="w-5 h-5 text-orange-500" />, label: 'Resources',  value: `${totalFiles} files` },
                      ].map(s => (
                        <div key={s.label} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-orange-100 hover:bg-orange-50/30 transition-colors">
                          <div className="mb-2">{s.icon}</div>
                          <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">{s.label}</p>
                          <p className="text-base font-bold text-gray-900 mt-0.5">{s.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reviews tab */}
                  {activeTab === 'reviews' && (
                    <div className="space-y-6">
                      {reviews.length > 0 && (
                        <div className="flex items-center gap-6 p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100">
                          <div className="text-center">
                            <p className="text-5xl font-extrabold text-orange-600 leading-none">{averageRating.toFixed(1)}</p>
                            <div className="mt-2"><Stars rating={Math.round(averageRating)} /></div>
                            <p className="text-xs text-gray-500 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                          </div>
                          <div className="flex-1 space-y-1.5">
                            {[5,4,3,2,1].map(n => {
                              const cnt = reviews.filter(r => Math.round(r.rating) === n).length;
                              const pct = reviews.length ? (cnt / reviews.length) * 100 : 0;
                              return (
                                <div key={n} className="flex items-center gap-2 text-xs">
                                  <span className="w-3 text-right text-gray-500 font-medium">{n}</span>
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                  </div>
                                  <span className="w-6 text-gray-400">{cnt}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Review form */}
                      {user && hasEnrolled && (!userReview || editingReview) && (
                        <div className="border border-gray-200 rounded-2xl p-5 space-y-4">
                          <h3 className="font-bold text-gray-900">{editingReview ? 'Edit Your Review' : 'Write a Review'}</h3>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Your Rating</p>
                            <Stars rating={newReview.rating} interactive onRate={r => setNewReview(p => ({ ...p, rating: r }))} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Your Review</p>
                            <textarea
                              value={newReview.comment}
                              onChange={e => setNewReview(p => ({ ...p, comment: e.target.value }))}
                              rows={4}
                              placeholder="Share your experience with this course..."
                              className="w-full p-4 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all placeholder-gray-400"
                            />
                          </div>
                          <div className="flex gap-2">
                            {editingReview && (
                              <button onClick={() => { setEditingReview(false); setNewReview({ rating: 5, comment: '' }); }}
                                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors">
                                Cancel
                              </button>
                            )}
                            <button onClick={handleReviewSubmit} disabled={submitting}
                              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md shadow-orange-200">
                              {submitting ? 'Submitting…' : editingReview ? 'Update Review' : 'Submit Review'}
                            </button>
                          </div>
                        </div>
                      )}

                      {user && hasEnrolled && userReview && !editingReview && (
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-emerald-700">
                            <CheckCircle className="w-4 h-4" /> You've already reviewed this course.
                          </div>
                          <button onClick={() => { setNewReview({ rating: userReview.rating, comment: userReview.comment }); setEditingReview(true); }}
                            className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                            Edit
                          </button>
                        </div>
                      )}

                      {!user && (
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-center text-sm text-gray-600">
                          <Link href="/auth" className="text-orange-600 font-semibold hover:underline">Sign in</Link> to write a review.
                        </div>
                      )}

                      {/* Reviews list */}
                      {reviews.length > 0 ? (
                        <div className="space-y-4">
                          {reviews.map(rev => (
                            <div key={rev.id} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                              <Avatar name={rev.user_name} />
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <div>
                                    <p className="font-semibold text-gray-900 text-sm">{rev.user_name}</p>
                                    <p className="text-xs text-gray-400">{new Date(rev.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                  </div>
                                  <Stars rating={rev.rating} size="sm" />
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{rev.comment}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Star className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="font-semibold text-gray-700">No reviews yet</p>
                          <p className="text-sm text-gray-500 mt-1">Be the first to share your experience!</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Q&A tab */}
                  {activeTab === 'qanda' && (
                    <div className="space-y-6">
                      {user && hasEnrolled ? (
                        <div className="border border-gray-200 rounded-2xl p-5 space-y-3">
                          <h3 className="font-bold text-gray-900">Ask a Question</h3>
                          <textarea
                            value={newQuestion}
                            onChange={e => setNewQuestion(e.target.value)}
                            rows={3}
                            placeholder="What would you like to know about this course?"
                            className="w-full p-4 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all placeholder-gray-400"
                          />
                          <button onClick={handleQuestionSubmit} disabled={submitting || !newQuestion}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md shadow-orange-200">
                            <Send className="w-4 h-4" /> {submitting ? 'Submitting…' : 'Submit Question'}
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-center text-sm text-gray-600">
                          {user ? 'Enroll in this course to ask a question.' : (
                            <><Link href="/auth" className="text-orange-600 font-semibold hover:underline">Sign in</Link> and enroll to ask a question.</>
                          )}
                        </div>
                      )}

                      {questions.length > 0 ? (
                        <div className="space-y-4">
                          {questions.map(q => (
                            <div key={q.id} className="rounded-2xl border border-gray-100 overflow-hidden">
                              <div className="flex gap-3 p-4 bg-gray-50">
                                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">Q</div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{q.question}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">{q.user_name} · {new Date(q.created_at).toLocaleDateString()}</p>
                                </div>
                              </div>
                              {q.answer ? (
                                <div className="flex gap-3 p-4 border-t border-gray-100">
                                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">A</div>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-700">{q.answer}</p>
                                    {q.is_answered && (
                                      <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1.5">
                                        <CheckCircle className="w-3 h-3" /> Answered by instructor
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="px-4 py-3 border-t border-gray-100">
                                  <p className="text-xs text-gray-400 italic">Awaiting instructor response…</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <HelpCircle className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="font-semibold text-gray-700">No questions yet</p>
                          <p className="text-sm text-gray-500 mt-1">Be the first to ask!</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ─── Right / Sidebar ─── */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-4">
                {/* Pricing card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/60 overflow-hidden">
                  {/* Price header */}
                  <div className="px-7 pt-7 pb-5">
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-4xl font-extrabold text-orange-500 tracking-tight">৳{course.price}</span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">One-time payment · Lifetime access</p>
                  </div>

                  {/* CTA button */}
                  <div className="px-7 pb-5">
                    <button
                      onClick={() => {
                        if (!course?.slug) return;
                        if (isStaff || hasEnrolled) router.push(`/courses/${course.slug}/watch`);
                        else handleEnroll();
                      }}
                      disabled={!isStaff && isInCart && !hasEnrolled}
                      className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-lg
                        ${isStaff
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 shadow-blue-200'
                          : hasEnrolled
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90 shadow-emerald-200'
                            : isInCart
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                              : 'bg-gradient-to-r from-orange-500 to-amber-400 text-white hover:opacity-90 shadow-orange-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                        }`}
                    >
                      <Play className={`w-5 h-5 ${isInCart && !hasEnrolled && !isStaff ? '' : 'fill-current'}`} />
                      {isStaff ? 'Preview Course' : hasEnrolled ? 'Access Course' : isInCart ? '✓ Added to Cart' : 'Enroll Now'}
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="mx-7 border-t border-gray-100" />

                  {/* Course meta */}
                  <div className="px-7 py-5 space-y-4">
                    {[
                      { icon: <Clock className="w-4 h-4 text-orange-400" />,        label: 'Duration',   value: `${course.duration_hours} hours` },
                      { icon: <BookOpen className="w-4 h-4 text-orange-400" />,      label: 'Lessons',    value: `${course.lessons_count} lessons` },
                      { icon: <GraduationCap className="w-4 h-4 text-orange-400" />, label: 'Level',      value: lvl?.label || course.level },
                      { icon: <Globe className="w-4 h-4 text-orange-400" />,         label: 'Language',   value: 'Bengali / English' },
                      { icon: <Infinity className="w-4 h-4 text-orange-400" />,      label: 'Access',     value: 'Lifetime' },
                      { icon: <Shield className="w-4 h-4 text-orange-400" />,        label: 'Certificate', value: 'On completion' },
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {row.icon}
                          <span className="text-sm text-gray-500">{row.label}</span>
                        </div>
                        {row.label === 'Level' && lvl ? (
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${lvl.cls}`}>
                            {lvl.icon} {lvl.label}
                          </span>
                        ) : (
                          <span className="text-sm font-semibold text-gray-900">{row.value}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Guarantee */}
                  <div className="mx-5 mb-5 p-4 rounded-2xl bg-orange-50 border border-orange-100 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-orange-700 uppercase tracking-wide">Satisfaction Guaranteed</p>
                      <p className="text-xs text-orange-600/80 mt-0.5 leading-relaxed">Access quality learning materials crafted by expert instructors.</p>
                    </div>
                  </div>
                </div>

                {/* Share / save card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">Share this course</p>
                  <div className="flex gap-2">
                    {['Facebook', 'Twitter', 'Copy link'].map(s => (
                      <button key={s} className="flex-1 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 border border-gray-100 hover:border-orange-100 transition-all">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

/* ── Micro layout helpers ─────────────────────────────────────── */
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-3xl border border-gray-100 shadow-sm p-7 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <h2 className="text-xl font-bold text-gray-900">{children}</h2>
    </div>
  );
}