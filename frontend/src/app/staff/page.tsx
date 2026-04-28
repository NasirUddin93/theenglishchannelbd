'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Edit3,
  Trash2,
  ChevronRight,
  Package,
  Image as ImageIcon,
  FileText,
  Tag,
  Layers,
  Images,
  Search,
  Filter,
  MessageSquare,
  Bell,
  Info,
  LayoutGrid,
  List,
  GraduationCap,
  X,
  Plus,
  Upload,
  ArrowLeft,
  ClipboardList,
  PlayCircle,
  Star,
  MapPin,
  Truck,
  ChevronDown,
  ChevronLeft,
  Save,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/lib/useDebounce';
import { api, ApiBook, mapApiBookToBook, ApiCategory, getBookPlaceholder } from '@/lib/api';
import { Book, CartItem } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface StaffBook extends Book {
  submittedBy?: string;
  status?: 'approved' | 'draft' | 'pending_deletion';
  previewImages?: string[];
}

interface StaffQuestion {
  id: number;
  book_id?: number;
  course_id?: number;
  user_name: string;
  question: string;
  answer: string | null;
  is_answered: boolean;
  created_at: string;
  book_title?: string;
  book_cover_url?: string;
  course_title?: string;
  course_image?: string;
}

export default function StaffDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'my-books' | 'drafts' | 'add-book' | 'add-course' | 'inventory' | 'categories' | 'qanda' | 'orders' | 'gallery' | 'about' | 'promo-codes'>('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [myBooks, setMyBooks] = useState<StaffBook[]>([]);
  const [draftBooks, setDraftBooks] = useState<StaffBook[]>([]);
  const [lowStockBooks, setLowStockBooks] = useState<StaffBook[]>([]);
  const [allBooks, setAllBooks] = useState<StaffBook[]>([]);
  const [inventoryBooks, setInventoryBooks] = useState<StaffBook[]>([]);
  const [inventoryTotal, setInventoryTotal] = useState(0);
  const [qandaItems, setQandaItems] = useState<StaffQuestion[]>([]);
  const [qandaFilter, setQandaFilter] = useState<'all' | 'answered' | 'unanswered'>('all');
  const [qandaType, setQandaType] = useState<'books' | 'courses'>('books');
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [staffOrders, setStaffOrders] = useState<{
    id: string;
    userId: string;
    orderNumber: string;
    items: (CartItem & { itemId?: string; isbn?: string })[];
    total: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
    shippingAddress?: { fullName: string; email: string; address: string; city: string; zipCode: string; phone: string };
    trackingNumber?: string;
    estimatedDelivery?: string;
    statusHistory?: { status: string; date: string; note?: string }[];
  }[]>([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [orderCurrentPage, setOrderCurrentPage] = useState(1);
  const ordersPerPage = 20;
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [qandaCurrentPage, setQandaCurrentPage] = useState(1);
  const qandaPerPage = 10;
  const [qandaTotal, setQandaTotal] = useState(0);
  const [qandaCounts, setQandaCounts] = useState({ all: 0, answered: 0, unanswered: 0 });
  const [loading, setLoading] = useState(false);
  const [courseOverview, setCourseOverview] = useState<{ total: number; recent: any[] } | null>(null);
  const [booksMetrics, setBooksMetrics] = useState({ totalTitles: 0, warehouseStock: 0, categories: 0, totalRevenue: 0 });
  const [coursesMetrics, setCoursesMetrics] = useState({ total: 0, total_videos: 0, categories: 0, revenue: 0 });

  const formatMoney = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return Math.floor(n / 1000) + 'k';
    return String(n);
  };

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'info'
  });
  
  const [newBook, setNewBook] = useState<Partial<Book & { previewImages?: string[] }>>({
    title: '',
    author: '',
    description: '',
    category: 'Fiction',
    price: 0,
    stock: 0,
    stockThreshold: 10,
    coverUrl: '',
    previewContent: [],
    previewImages: [],
    pages: 0,
    language: 'English',
    format: 'Paperback',
  });
  const [newBookCoverUploading, setNewBookCoverUploading] = useState(false);
  const [newBookPreviewUploading, setNewBookPreviewUploading] = useState(false);
  const [newBookCoverFile, setNewBookCoverFile] = useState<File | null>(null);
  const [newBookCoverPreview, setNewBookCoverPreview] = useState<string>('');
  const [newBookPreviewFiles, setNewBookPreviewFiles] = useState<File[]>([]);
  const [newBookPreviewPreviews, setNewBookPreviewPreviews] = useState<string[]>([]);
  const [newBookCoverUrl, setNewBookCoverUrl] = useState<string>('');
  const [newBookPreviewUrls, setNewBookPreviewUrls] = useState<string[]>([]);

  const [courseStep, setCourseStep] = useState<'overview' | 'curriculum' | 'quizzes' | 'review'>('overview');
  const [newCourse, setNewCourse] = useState({
    title: '', slug: '', instructor: '', description: '', image: '',
    price: 0, duration_hours: 0, lessons_count: 0,
    level: 'beginner', preview_video: '', category: 'language',
    is_featured: false, is_active: true,
    sections: [{ 
      title: '', 
      lessons: [{ 
        title: '', 
        description: '', 
        video_url: '', 
        video_file: null as File | null, 
        video_file_url: '', 
        duration_minutes: 0, 
        is_free_preview: false,
        resources: [],
        quizzes: []
      }] 
    }],
    quizzes: [{ title: '', questions: [{ question: '', options: ['', '', '', ''], correct_answer: 0 }] }],
  });
  const [courseFileUploading, setCourseFileUploading] = useState<Record<string, boolean>>({});

  const uploadImageFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/staff/books/upload-cover', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Upload failed');
      }
      const data = await response.json();
      const savedUrl = data.url || `http://localhost:8000/storage/${data.path}`;
      console.log('Image saved at:', savedUrl);
      toast.success(`Image saved: ${savedUrl}`);
      return savedUrl;
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image');
      return null;
    }
  };

  const uploadPreviewImageFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/staff/books/upload-preview', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Upload failed');
      }
      const data = await response.json();
      const savedUrl = `http://localhost:8000/storage/${data.path}`;
      console.log('Preview Image saved at:', savedUrl);
      toast.success(`Preview Image saved: ${savedUrl}`);
      return savedUrl;
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload preview image');
      return null;
    }
  };

  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);
  const [courseCategories, setCourseCategories] = useState<{ id?: number; name: string; slug: string; count?: number }[]>([]);
  const [newCourseCategory, setNewCourseCategory] = useState('');

  const [inventorySearch, setInventorySearch] = useState('');
  const debouncedInventorySearch = useDebounce(inventorySearch, 300);
  const [inventoryType, setInventoryType] = useState<'books' | 'courses'>('books');
  const [inventoryCourses, setInventoryCourses] = useState<any[]>([]);
  const [inventoryCoursesTotal, setInventoryCoursesTotal] = useState(0);
  const [courseSearch, setCourseSearch] = useState('');
  const debouncedCourseSearch = useDebounce(courseSearch, 300);
  const [courseSort, setCourseSort] = useState('newest');
  const [courseStatusFilter, setCourseStatusFilter] = useState<'all' | 'active' | 'inactive' | 'draft'>('all');
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [courseEditForm, setCourseEditForm] = useState({
    title: '',
    slug: '',
    instructor: '',
    description: '',
    image: '',
    price: 0,
    duration_hours: 0,
    lessons_count: 0,
    level: 'beginner',
    preview_video: '',
    category: 'language',
    is_featured: false,
    is_active: true,
  });
  const [courseCoverFile, setCourseCoverFile] = useState<File | null>(null);
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [promoCodesLoading, setPromoCodesLoading] = useState(false);
  const [promoExpanded, setPromoExpanded] = useState<number | null>(null);
  const [promoResettingUser, setPromoResettingUser] = useState<{ codeId: number; userId: number } | null>(null);
  const [promoForm, setPromoForm] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: 0,
    usage_limit: 100,
    per_user_limit: 1,
    min_order_amount: 0,
    valid_from: '',
    valid_until: '',
    is_active: true,
    description: '',
  });
  const [promoEditing, setPromoEditing] = useState<any | null>(null);
  const [promoSaving, setPromoSaving] = useState(false);

  const [draftCourses, setDraftCourses] = useState<any[]>([]);
  const [draftCoursesTotal, setDraftCoursesTotal] = useState(0);
  const [draftCoursesCurrentPage, setDraftCoursesCurrentPage] = useState(1);
  const draftCoursesPerPage = 10;

  useEffect(() => {
    if (promoEditing) {
      if (promoEditing.id) {
        setPromoForm({
          code: promoEditing.code || '',
          discount_type: promoEditing.discount_type || 'percentage',
          discount_value: promoEditing.discount_value || 0,
          usage_limit: promoEditing.usage_limit || 1,
          per_user_limit: promoEditing.per_user_limit || 1,
          min_order_amount: promoEditing.min_order_amount || 0,
          valid_from: promoEditing.valid_from ? promoEditing.valid_from.split('T')[0] : '',
          valid_until: promoEditing.valid_until ? promoEditing.valid_until.split('T')[0] : '',
          is_active: promoEditing.is_active !== false,
          description: promoEditing.description || '',
        });
      } else {
        setPromoForm({
          code: '',
          discount_type: 'percentage',
          discount_value: 0,
          usage_limit: 100,
          per_user_limit: 1,
          min_order_amount: 0,
          valid_from: '',
          valid_until: '',
          is_active: true,
          description: '',
        });
      }
    }
  }, [promoEditing]);
  const [courseCoverPreview, setCourseCoverPreview] = useState<string>('');
  const [courseCoverUploading, setCourseCoverUploading] = useState(false);
  const [courseVideoFile, setCourseVideoFile] = useState<File | null>(null);
  const [courseVideoPreview, setCourseVideoPreview] = useState<string>('');
  const [courseVideoUploading, setCourseVideoUploading] = useState(false);
  const [courseEditStep, setCourseEditStep] = useState<'overview' | 'curriculum' | 'quizzes' | 'review'>('overview');
  const [courseEditData, setCourseEditData] = useState<any>({
    sections: [],
    quizzes: [],
  });
  const [courseEditFileUploading, setCourseEditFileUploading] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    setInventoryCurrentPage(1);
  }, [debouncedInventorySearch]);
  
  const [inventoryCategories, setInventoryCategories] = useState<string[]>([]);
  const [inventorySort, setInventorySort] = useState('newest');
  const [inventoryStockFilter, setInventoryStockFilter] = useState('all');
  const [inventoryThreshold, setInventoryThreshold] = useState(10);
  const [inventoryPriceRange, setInventoryPriceRange] = useState<[number, number]>([0, 10000]);
  const [inventoryMaxPrice, setInventoryMaxPrice] = useState(10000);
  const [inventoryCurrentPage, setInventoryCurrentPage] = useState(1);
  const inventoryPerPage = 50;
  const [selectedBookIds, setSelectedBookIds] = useState<Set<string>>(new Set());
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [myBooksCurrentPage, setMyBooksCurrentPage] = useState(1);
  const myBooksPerPage = 10;
  const [myBooksTotal, setMyBooksTotal] = useState(0);
  const [draftBooksCurrentPage, setDraftBooksCurrentPage] = useState(1);
  const draftBooksPerPage = 10;
  const [draftBooksTotal, setDraftBooksTotal] = useState(0);
  const [aboutData, setAboutData] = useState<any>(null);
  const [aboutForm, setAboutForm] = useState({
    title: '',
    hero_description: '',
    our_story: '',
    our_mission: '',
    our_values: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
  });
  const [aboutSaving, setAboutSaving] = useState(false);
  const [editingInventoryBook, setEditingInventoryBook] = useState<StaffBook | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    stockThreshold: 10,
    coverUrl: '',
    previewImages: [] as string[],
  });
  const [editSaving, setEditSaving] = useState(false);
  const [restockModal, setRestockModal] = useState<{ isOpen: boolean; bookId: string; stock: number }>({
    isOpen: false,
    bookId: '',
    stock: 0,
  });
  const [restockSaving, setRestockSaving] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [coverUploading, setCoverUploading] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const loadInventoryBooks = async () => {
    setInventoryLoading(true);
    try {
      const [batchRes, maxRes] = await Promise.all([
        api.get<any>('/staff/books/batch'),
        api.get<any>('/staff/books', { per_page: '1', sort: 'price-high' }),
      ]);
      
      const allBooks = (batchRes.data || []).map(mapApiBookToBook) as StaffBook[];
      setInventoryBooks(allBooks);
      setInventoryTotal(allBooks.length);
      setSelectedBookIds(new Set());
      
      if (maxRes.data && maxRes.data.length > 0) {
        const highestPrice = maxRes.data[0].price;
        const roundedMax = Math.ceil(highestPrice / 1000) * 1000;
        const finalMax = Math.max(10000, roundedMax);
        setInventoryMaxPrice(finalMax);
        setInventoryPriceRange([0, finalMax]);
      }
    } catch (err) {
      console.error('Inventory load error:', err);
      setInventoryBooks([]);
      setInventoryTotal(0);
    } finally {
      setInventoryLoading(false);
    }
  };

  const loadInventoryCourses = async () => {
    setInventoryLoading(true);
    try {
      const res = await api.get<any>('/staff/courses');
      console.log('Courses API response:', res);
      const courses = Array.isArray(res) ? res : (res?.data || res?.courses || []);
      setInventoryCourses(courses);
      setInventoryCoursesTotal(courses.length);
    } catch (err) {
      console.error('Course inventory load error:', err);
      setInventoryCourses([]);
      setInventoryCoursesTotal(0);
    } finally {
      setInventoryLoading(false);
    }
  };

  const openCourseEdit = (course: any) => {
    setEditingCourse(course);
    setCourseEditForm({
      title: course.title || '',
      slug: course.slug || '',
      instructor: course.instructor || '',
      description: course.description || '',
      price: course.price || 0,
      duration_hours: course.duration_hours || 0,
      lessons_count: course.lessons_count || 0,
      level: course.level || 'beginner',
      preview_video: course.preview_video || '',
      category: course.category || 'language',
      is_featured: !!course.is_featured,
      is_active: !!course.is_active,
      image: course.image || '',
    });
    setCourseEditData({
      sections: course.sections || [{ title: '', lessons: [{ title: '', description: '', video_url: '', video_file: null, video_file_url: '', duration_minutes: 0, is_free_preview: false, resources: [], quizzes: [] }] }],
      quizzes: course.quizzes || [{ title: '', questions: [{ question: '', options: ['', '', '', ''], correct_answer: 0 }] }],
    });
    setCourseCoverFile(null);
    setCourseCoverPreview('');
    setCourseVideoFile(null);
    setCourseVideoPreview('');
    setCourseEditStep('overview');
  };

  const handleCourseCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setCourseCoverFile(file);
    setCourseEditForm(prev => ({ ...prev, image: '' }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setCourseCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadCourseCover = async (): Promise<string | null> => {
    if (!courseCoverFile) return null;
    setCourseCoverUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', courseCoverFile);
      formData.append('type', 'image');
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/staff/courses/upload-file', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      return data.url || `http://localhost:8000/storage/${data.path}`;
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image');
      return null;
    } finally {
      setCourseCoverUploading(false);
    }
  };

  const handleCourseVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      toast.error('Video file is too large (max 500MB)');
      return;
    }
    setCourseVideoFile(file);
    setCourseEditForm(prev => ({ ...prev, preview_video: '' }));
    setCourseVideoPreview(URL.createObjectURL(file));
  };

  const uploadCourseVideo = async (): Promise<string | null> => {
    if (!courseVideoFile) return null;
    setCourseVideoUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', courseVideoFile);
      formData.append('type', 'video');
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/staff/courses/upload-file', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      return data.url || `http://localhost:8000/storage/${data.path}`;
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload video');
      return null;
    } finally {
      setCourseVideoUploading(false);
    }
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(Math.ceil(video.duration / 60) || 0);
      };
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        resolve(0);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const handleCourseEditSave = async () => {
    if (!editingCourse) return;
    setEditSaving(true);
    try {
      let imageUrl: string | null = null;
      if (courseCoverFile) {
        imageUrl = await uploadCourseCover();
      }
      let videoUrl: string | null = null;
      if (courseVideoFile) {
        videoUrl = await uploadCourseVideo();
      }

      const cleanSections = courseEditData.sections
        .filter((s: any) => s.title.trim())
        .map((s: any, sIdx: number) => ({
          id: s.id || undefined,
          title: s.title,
          order: sIdx,
          lessons: (s.lessons || []).filter((l: any) => l.title.trim()).map((l: any, lIdx: number) => ({
            id: l.id || undefined,
            title: l.title,
            description: l.description || null,
            video_url: l.video_file_url || l.video_url || null,
            duration_minutes: l.duration_minutes || 0,
            is_free_preview: l.is_free_preview || false,
            order: lIdx,
            resources: (l.resources || []).map((r: any, rIdx: number) => ({
              id: r.id || undefined,
              title: r.title,
              file_path: r.file_path,
              file_type: r.file_type || 'document',
              file_size: r.file_size || 0,
            })),
            quizzes: (l.quizzes || []).filter((q: any) => q.title.trim()).map((q: any, qIdx: number) => ({
              id: q.id || undefined,
              title: q.title,
              order: qIdx,
              questions: (q.questions || []).filter((qq: any) => qq.question.trim()).map((qq: any, qqIdx: number) => {
                const opts = Array.isArray(qq.options) ? qq.options : JSON.parse(qq.options || '[]');
                return {
                  id: qq.id || undefined,
                  question: qq.question,
                  options: opts.filter((o: string) => o.trim()),
                  correct_answer: qq.correct_answer,
                  order: qqIdx,
                };
              }),
            })),
          })),
          lessons_count: (s.lessons || []).filter((l: any) => l.title.trim()).length,
        }));

      const cleanQuizzes = courseEditData.quizzes
        .filter((q: any) => q.title.trim())
        .map((q: any, qIdx: number) => ({
          id: q.id || undefined,
          title: q.title,
          order: qIdx,
          questions: (q.questions || []).filter((qq: any) => qq.question.trim()).map((qq: any, qqIdx: number) => {
            const opts = Array.isArray(qq.options) ? qq.options : JSON.parse(qq.options || '[]');
            return {
              id: qq.id || undefined,
              question: qq.question,
              options: opts.filter((o: string) => o.trim()),
              correct_answer: qq.correct_answer,
              order: qqIdx,
            };
          }),
        }));

      const totalMinutes = courseEditData.sections.reduce((acc: number, s: any) =>
        acc + (s.lessons || []).reduce((lAcc: number, l: any) => lAcc + (l.duration_minutes || 0), 0), 0);
      const totalLessons = courseEditData.sections.reduce((acc: number, s: any) =>
        acc + (s.lessons || []).filter((l: any) => l.title.trim()).length, 0);

      const updateData: any = {
        ...courseEditForm,
        sections: cleanSections,
        quizzes: cleanQuizzes,
        price: parseFloat(String(courseEditForm.price)) || 0,
        duration_hours: totalMinutes > 0 ? Math.ceil(totalMinutes / 60) : 0,
        lessons_count: totalLessons,
      };
      if (imageUrl) updateData.image = imageUrl;
      if (videoUrl) updateData.preview_video = videoUrl;

      await api.put(`/staff/courses/${editingCourse.id}`, updateData);
      toast.success('Course updated successfully');
      setEditingCourse(null);
      loadInventoryCourses();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update course');
    } finally {
      setEditSaving(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title.trim() || !newCourse.instructor.trim() || !newCourse.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    console.log('newCourse.image:', newCourse.image);
    setLoading(true);
    try {
      const validSections = newCourse.sections.filter(s => s.title.trim());
      const totalMinutes = validSections.reduce((acc, s) =>
        acc + s.lessons.reduce((lAcc, l) => lAcc + (l.duration_minutes || 0), 0), 0);
      const totalLessons = validSections.reduce((acc, s) =>
        acc + s.lessons.filter(l => l.title.trim()).length, 0);

      const courseData = {
        title: newCourse.title,
        slug: newCourse.slug || newCourse.title.toLowerCase().replace(/\s+/g, '-'),
        instructor: newCourse.instructor,
        description: newCourse.description,
        price: newCourse.price || 0,
        duration_hours: Math.ceil(totalMinutes / 60) || 0,
        lessons_count: totalLessons,
        level: newCourse.level,
        image: newCourse.image || null,
        preview_video: newCourse.preview_video || null,
        is_featured: newCourse.is_featured,
        is_active: newCourse.is_active,
        status: 'published',
        category: newCourse.category,
        sections: validSections.map((section, sIdx) => ({
          title: section.title,
          order: sIdx,
          lessons: section.lessons.filter(l => l.title.trim()).map((lesson, lIdx) => ({
            title: lesson.title,
            description: lesson.description || null,
            video_url: lesson.video_file_url || lesson.video_url || null,
            duration_minutes: lesson.duration_minutes || 0,
            is_free_preview: lesson.is_free_preview || false,
            order: lIdx,
            resources: (lesson.resources || []).map(r => ({
              title: r.title,
              file_path: r.file_path,
              file_type: r.file_type || 'document',
              file_size: r.file_size || 0,
            })),
            quizzes: (lesson.quizzes || []).filter(q => q.title.trim()).map(q => ({
              title: q.title,
              questions: (q.questions || []).filter(qq => qq.question.trim()).map(qq => ({
                question: qq.question,
                options: Array.isArray(qq.options) ? qq.options.filter(o => o.trim()) : JSON.parse(qq.options || '[]').filter(o => o.trim()),
                correct_answer: qq.correct_answer,
              })),
            })),
          })),
        })),
        quizzes: newCourse.quizzes.filter(q => q.title.trim()).map(quiz => ({
          title: quiz.title,
          questions: (quiz.questions || []).filter(q => q.question.trim()).map(q => ({
            question: q.question,
            options: Array.isArray(q.options) ? q.options.filter(o => o.trim()) : JSON.parse(q.options || '[]').filter(o => o.trim()),
            correct_answer: q.correct_answer,
          })),
        })),
      };

      console.log('Sending course data:', courseData);
      const response = await api.post('/staff/courses', courseData);
      console.log('Course creation response:', response);
      toast.success('Course published successfully!');

      // Reset form
      setNewCourse({
        title: '', slug: '', instructor: '', description: '', image: '',
        price: 0, duration_hours: 0, lessons_count: 0,
        level: 'beginner', preview_video: '', category: 'language',
        is_featured: false, is_active: true,
        sections: [{ title: '', lessons: [{ title: '', description: '', video_url: '', video_file: null, video_file_url: '', duration_minutes: 0, is_free_preview: false, resources: [], quizzes: [] }] }],
        quizzes: [{ title: '', questions: [{ question: '', options: ['', '', '', ''], correct_answer: 0 }] }],
      });

      setCourseStep('overview');
      setActiveTab('inventory');
      setInventoryType('courses');
      loadInventoryCourses();
    } catch (err: any) {
      console.error('Course creation error:', err);
      toast.error(err.message || 'Failed to publish course');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: number, courseTitle: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Course',
      message: `Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`,
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/staff/courses/${courseId}`);
          toast.success('Course deleted successfully');
          loadInventoryCourses();
        } catch {
          toast.error('Failed to delete course');
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleToggleCourseFeatured = async (course: any) => {
    const newFeatured = !course.is_featured;
    try {
      await api.put(`/staff/courses/${course.id}`, { is_featured: newFeatured });
      toast.success(newFeatured ? 'Course featured' : 'Course unfeatured');
      setInventoryCourses(prev => prev.map(c => c.id === course.id ? { ...c, is_featured: newFeatured } : c));
    } catch {
      toast.error('Failed to update featured status');
    }
  };

  const handleToggleCourseActive = async (course: any) => {
    const newActive = !course.is_active;
    try {
      await api.put(`/staff/courses/${course.id}`, { is_active: newActive });
      toast.success(newActive ? 'Course activated' : 'Course deactivated');
      setInventoryCourses(prev => prev.map(c => c.id === course.id ? { ...c, is_active: newActive } : c));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const toggleSelectBook = (id: string) => {
    setSelectedBookIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedBookIds.size === inventoryBooks.length) {
      setSelectedBookIds(new Set());
    } else {
      setSelectedBookIds(new Set(inventoryBooks.map(b => b.id)));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedBookIds.size === 0) return;
    setConfirmModal({
      isOpen: true,
      title: `Delete ${selectedBookIds.size} Books`,
      message: `Are you sure you want to delete ${selectedBookIds.size} selected books? This action cannot be undone.`,
      type: 'danger',
      onConfirm: async () => {
        try {
          const ids = Array.from(selectedBookIds);
          await Promise.all(ids.map(id => api.delete(`/staff/books/${id}`)));
          toast.success(`${ids.length} books deleted successfully`);
          setSelectedBookIds(new Set());
          loadInventoryBooks();
        } catch {
          toast.error('Failed to delete some books');
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleBatchRestock = async () => {
    if (selectedBookIds.size === 0) return;
    try {
      const ids = Array.from(selectedBookIds);
      await Promise.all(ids.map(id => api.put(`/staff/books/${id}`, { stock: 50 })));
      toast.success(`${ids.length} books restocked to 50 units`);
      setSelectedBookIds(new Set());
      loadInventoryBooks();
    } catch {
      toast.error('Failed to restock some books');
    }
  };

  const handleBatchFeature = async (featured: boolean) => {
    if (selectedBookIds.size === 0) return;
    try {
      const ids = Array.from(selectedBookIds);
      await Promise.all(ids.map(id => api.put(`/staff/books/${id}`, { is_featured: featured })));
      toast.success(`${ids.length} books ${featured ? 'featured' : 'unfeatured'}`);
      setSelectedBookIds(new Set());
      loadInventoryBooks();
    } catch {
      toast.error('Failed to update some books');
    }
  };

  const loadMyBooks = async () => {
    if (!user) return;
    try {
      const res = await api.get<any>('/staff/books', {
        per_page: String(myBooksPerPage),
        page: String(myBooksCurrentPage),
        status: 'approved',
      });
      const mappedBooks = (res.data || []).map(mapApiBookToBook) as StaffBook[];
      setMyBooks(mappedBooks);
      setMyBooksTotal(res.total || 0);
    } catch {
      setMyBooks([]);
      setMyBooksTotal(0);
    }
  };

  const loadDraftBooks = async () => {
    try {
      const res = await api.get<any>('/staff/books', {
        per_page: String(draftBooksPerPage),
        page: String(draftBooksCurrentPage),
        status: 'draft',
      });
      const mappedBooks = (res.data || []).map(mapApiBookToBook) as StaffBook[];
      setDraftBooks(mappedBooks);
      setDraftBooksTotal(res.total || 0);
    } catch {
      setDraftBooks([]);
      setDraftBooksTotal(0);
    }
  };

  const loadDraftCourses = async () => {
    try {
      const res = await api.get<any>('/staff/courses/drafts', {
        per_page: String(draftCoursesPerPage),
        page: String(draftCoursesCurrentPage),
      });
      setDraftCourses(res.data || []);
      setDraftCoursesTotal(res.total || 0);
    } catch {
      setDraftCourses([]);
      setDraftCoursesTotal(0);
    }
  };

  const loadPromoCodes = async () => {
    setPromoCodesLoading(true);
    try {
      const res = await api.get<any[]>('/staff/promo-codes');
      setPromoCodes(res);
    } catch (err) {
      console.error('Failed to load promo codes:', err);
      setPromoCodes([]);
    } finally {
      setPromoCodesLoading(false);
    }
  };

  const handleResetUserUsage = async (codeId: number, userId: number, userName: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset User Usage',
      message: `Allow "${userName}" to use this promo code again? This will delete their previous usage record.`,
      type: 'warning',
      onConfirm: async () => {
        setPromoResettingUser({ codeId, userId });
        try {
          await api.put(`/staff/promo-codes/${codeId}/reset-user`, { user_id: userId });
          toast.success('User usage reset successfully');
          loadPromoCodes();
        } catch (err) {
          toast.error('Failed to reset user usage');
        } finally {
          setPromoResettingUser(null);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const loadOverviewBooks = async () => {
    try {
      const res = await api.get<any>('/staff/books', { per_page: '300' });
      const mappedBooks = (res.data || []).map(mapApiBookToBook) as StaffBook[];
      setAllBooks(mappedBooks);
      setMyBooks(mappedBooks.filter(b => b.status !== 'draft'));
      setDraftBooks(mappedBooks.filter(b => b.status === 'draft'));
      setLowStockBooks(mappedBooks.filter(b => b.stock < inventoryThreshold && b.stock > 0));
    } catch {
      setAllBooks([]);
      setMyBooks([]);
      setDraftBooks([]);
      setLowStockBooks([]);
    }
  };

  const loadOrders = async () => {
    try {
      const ordersRes = await api.get<any>('/staff/orders', { per_page: String(ordersPerPage), page: String(orderCurrentPage) });
      const ordersData = ordersRes.data || [];
      setStaffOrders(ordersData.map((order: any) => ({
        id: String(order.id),
        orderNumber: order.order_number || String(order.id),
        userId: String(order.user_id),
        items: (order.items || []).map((item: any) => {
          const isCourse = item.course_id && !item.book_id;
          return {
            bookId: String(item.book_id || item.course_id),
            id: String(item.book_id || item.course_id),
            itemId: String(item.id),
            title: isCourse ? (item.course?.title || 'Unknown Course') : (item.book?.title || 'Unknown Book'),
            author: isCourse ? (item.course?.instructor || '') : (item.book?.author || ''),
            price: item.price,
            quantity: item.quantity,
            coverUrl: isCourse ? (item.course?.image || '') : (item.book?.image || ''),
            stock: 0,
            isbn: item.isbn || '',
            type: isCourse ? 'course' as const : 'book' as const,
          } as CartItem & { itemId?: string; isbn?: string };
        }),
        total: parseFloat(order.total),
        status: order.status,
        paymentMethod: order.payment_method || 'unknown',
        createdAt: order.created_at,
        trackingNumber: order.tracking_number || '',
        shippingAddress: {
          fullName: order.shipping_address || '',
          email: order.user?.email || '',
          address: order.shipping_address || '',
          city: order.city || '',
          zipCode: order.postal_code || '',
          phone: order.phone || '',
        },
      })));
      setOrdersTotal(ordersRes.total || 0);
    } catch {
      setStaffOrders([]);
      setOrdersTotal(0);
    }
  };

  useEffect(() => {
    if (activeTab === 'inventory') {
      loadInventoryBooks();
    }
    if (activeTab === 'my-books') {
      loadMyBooks();
    }
    if (activeTab === 'drafts') {
      loadDraftBooks();
      loadDraftCourses();
    }
    if (activeTab === 'overview' && allBooks.length === 0) {
      loadOverviewBooks();
    }
  }, [activeTab, inventoryCurrentPage, debouncedInventorySearch, inventoryCategories, inventorySort, inventoryStockFilter, myBooksCurrentPage, draftBooksCurrentPage, draftCoursesCurrentPage]);

  useEffect(() => {
    if (!user || user.role !== 'staff') {
      router.push('/');
      return;
    }

    const loadData = async () => {
      // Fetch dashboard metrics from staff dashboard endpoint
      try {
        const dashRes = await api.get<any>('/staff/dashboard');
        console.log('Dashboard response:', dashRes);
        if (dashRes) {
          const totalTitles = Number(dashRes.stats?.total_books) || 0;
          const warehouseStock = Number(dashRes.stats?.warehouse_stock) || 0;
          const categoriesCount = Number(dashRes.stats?.book_categories) || 0;
          const totalRevenue = Number(dashRes.stats?.total_revenue) || 0;
          setBooksMetrics({ totalTitles, warehouseStock, categories: categoriesCount, totalRevenue });
          const totalCourses = Number(dashRes.courses?.total) || 0;
          const totalVideos = Number(dashRes.courses?.total_videos) || 0;
          const courseCategoriesCount = Number(dashRes.courses?.categories) || 0;
          const courseRevenue = Number(dashRes.courses?.revenue) || 0;
          setCoursesMetrics({ total: totalCourses, total_videos: totalVideos, categories: courseCategoriesCount, revenue: courseRevenue });
          setCourseOverview({ total: totalCourses, recent: dashRes.courses?.recent ?? [] });
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setCourseOverview(null);
      }

      // Fetch categories
      try {
        const categoriesRes = await api.get<ApiCategory[]>('/categories');
        setCategories(categoriesRes.map(c => c.name));
        setApiCategories(categoriesRes);
      } catch {
      }

      // Fetch course categories
      try {
        const courseCatRes = await api.get<{ id: number; name: string; slug: string; count: number }[]>('/staff/course-categories');
        setCourseCategories(courseCatRes || []);
      } catch {
        setCourseCategories([]);
      }

      // Fetch about data
      try {
        const aboutRes = await api.get<any>('/about');
        setAboutData(aboutRes);
        setAboutForm({
          title: aboutRes.title || '',
          hero_description: aboutRes.hero_description || '',
          our_story: aboutRes.our_story || '',
          our_mission: aboutRes.our_mission || '',
          our_values: aboutRes.our_values || '',
          contact_email: aboutRes.contact_email || '',
          contact_phone: aboutRes.contact_phone || '',
          contact_address: aboutRes.contact_address || '',
        });
      } catch {
      }

      // Fetch orders
      try {
        const ordersRes = await api.get<any>('/staff/orders', { per_page: String(ordersPerPage), page: String(orderCurrentPage) });
        const ordersData = ordersRes.data || [];
        setStaffOrders(ordersData.map((order: any) => ({
          id: String(order.id),
          orderNumber: order.order_number || String(order.id),
          userId: String(order.user_id),
          items: (order.items || []).map((item: any) => {
            const isCourse = item.course_id && !item.book_id;
            return {
              bookId: String(item.book_id || item.course_id),
              id: String(item.book_id || item.course_id),
              itemId: String(item.id),
              title: isCourse ? (item.course?.title || 'Unknown Course') : (item.book?.title || 'Unknown Book'),
              author: isCourse ? (item.course?.instructor || '') : (item.book?.author || ''),
              price: item.price,
              quantity: item.quantity,
              coverUrl: isCourse ? (item.course?.image || '') : (item.book?.image || ''),
              stock: 0,
              isbn: item.isbn || '',
              type: isCourse ? 'course' as const : 'book' as const,
            } as CartItem & { itemId?: string; isbn?: string };
          }),
          total: parseFloat(order.total),
          status: order.status,
          paymentMethod: order.payment_method || 'unknown',
          createdAt: order.created_at,
          trackingNumber: order.tracking_number || '',
          shippingAddress: {
            fullName: order.shipping_address || '',
            email: order.user?.email || '',
            address: order.shipping_address || '',
            city: order.city || '',
            zipCode: order.postal_code || '',
            phone: order.phone || '',
          },
        })));
        setOrdersTotal(ordersRes.total || 0);
      } catch {
        setStaffOrders([]);
        setOrdersTotal(0);
      }
    };

    loadData();
  }, [user, router]);

  const loadQanda = async () => {
    try {
      if (qandaType === 'books') {
        const res = await api.get<any>('/staff/all-questions', {
          per_page: String(qandaPerPage),
          page: String(qandaCurrentPage),
          filter: qandaFilter,
        });

        const questionsWithBookInfo = ((res.data || [])).map((q: any) => ({
          id: q.id,
          book_id: q.book_id,
          user_name: q.user_name,
          question: q.question,
          answer: q.answer,
          is_answered: q.is_answered,
          created_at: q.created_at,
          book_title: q.book?.title || 'Unknown',
          book_cover_url: q.book?.image || '',
        }));

        setQandaItems(questionsWithBookInfo);
        setQandaTotal(res.total || 0);
        if (res.counts) {
          setQandaCounts(res.counts);
        }
      } else {
        const res = await api.get<any>('/staff/all-course-questions', {
          per_page: String(qandaPerPage),
          page: String(qandaCurrentPage),
          filter: qandaFilter,
        });

        const questionsWithCourseInfo = ((res.data || [])).map((q: any) => ({
          id: q.id,
          course_id: q.course_id,
          user_name: q.user_name,
          question: q.question,
          answer: q.answer,
          is_answered: q.is_answered,
          created_at: q.created_at,
          course_title: q.course?.title || 'Unknown',
          course_image: q.course?.image || '',
        }));

        setQandaItems(questionsWithCourseInfo);
        setQandaTotal(res.total || 0);
        if (res.counts) {
          setQandaCounts(res.counts);
        }
      }
    } catch (err: any) {
      console.error('Failed to load Q&A:', err);
      setQandaItems([]);
      setQandaTotal(0);
    }
  };

  useEffect(() => {
    if (activeTab === 'inventory') {
      if (inventoryType === 'books') {
        loadInventoryBooks();
      } else {
        loadInventoryCourses();
      }
    }
    if (activeTab === 'my-books') {
      loadMyBooks();
    }
    if (activeTab === 'drafts') {
      loadDraftBooks();
    }
    if (activeTab === 'orders') {
      loadOrders();
    }
    if (activeTab === 'qanda') {
      loadQanda();
    }
  }, [activeTab, inventoryType, inventoryCurrentPage, inventoryPerPage, debouncedInventorySearch, inventoryCategories, inventorySort, inventoryStockFilter, inventoryThreshold, myBooksCurrentPage, draftBooksCurrentPage, orderCurrentPage, qandaCurrentPage, qandaType, qandaFilter]);

  useEffect(() => {
    setQandaCurrentPage(1);
  }, [qandaFilter, qandaType]);

  useEffect(() => {
    if (activeTab === 'overview') {
      loadOverviewBooks();
    }
    if (activeTab === 'promo-codes') {
      loadPromoCodes();
    }
  }, [activeTab]);

  const filteredInventory = inventoryBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                         book.author.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesCategory = inventoryCategories.length === 0 || inventoryCategories.includes(book.category);
    const matchesStock = inventoryStockFilter === 'all' || 
                        (inventoryStockFilter === 'low' && book.stock < inventoryThreshold && book.stock > 0) ||
                        (inventoryStockFilter === 'out' && book.stock === 0) ||
                        (inventoryStockFilter === 'in' && book.stock >= inventoryThreshold);
    const matchesPrice = book.price >= inventoryPriceRange[0] && book.price <= inventoryPriceRange[1];
    return matchesSearch && matchesCategory && matchesStock && matchesPrice;
  }).sort((a, b) => {
    const aAny = a as any, bAny = b as any;
    let sortKey = inventorySort.replace('-asc', '');
    if (sortKey === 'oldest') sortKey = 'newest';
    const isAsc = inventorySort.endsWith('-asc');
    const getVal = (item: any, key: string) => {
      if (key === 'newest') return new Date(item.createdAt).getTime();
      if (key === 'title') return item.title || '';
      if (key === 'stock') return item.stock;
      if (key === 'price') return item.price;
      if (key === 'rating') return item.rating || 0;
      if (key === 'reviews') return item.reviews_count || 0;
      if (key === 'sold') return item.purchase_count || 0;
      if (key === 'featured') return item.isFeatured ? 1 : 0;
      return 0;
    };
    const aVal = getVal(a, sortKey), bVal = getVal(b, sortKey);
    if (typeof aVal === 'string') return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    return isAsc ? aVal - bVal : bVal - aVal;
  });

  const filteredStaffOrders = staffOrders.filter(order => {
    const matchesFilter = orderFilter === 'all' || order.status === orderFilter;
    const matchesSearch = !orderSearch || 
        (order.orderNumber || order.id).toLowerCase().includes(orderSearch.toLowerCase()) ||
      (order.shippingAddress?.fullName || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      (order.shippingAddress?.email || '').toLowerCase().includes(orderSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim() || !user) return;
    try {
      const existingCat = apiCategories.find(c => c.name.toLowerCase() === newCategory.trim().toLowerCase());
      if (existingCat) {
        toast.error('Category already exists');
        return;
      }
      await api.post('/staff/categories', { name: newCategory.trim() });
      toast.success('Category added successfully');
      setNewCategory('');
      const catsRes = await api.get<ApiCategory[]>('/categories');
      setCategories(catsRes.map(c => c.name));
      setApiCategories(catsRes);
    } catch {
      toast.error('Failed to add category');
    }
  };

  const handleDeleteCategory = async (cat: string) => {
    if (!user) return;
    try {
      const catObj = apiCategories.find(c => c.name === cat);
      if (catObj) {
        await api.delete(`/staff/categories/${catObj.id}`);
        toast.success('Category deleted successfully');
        const catsRes = await api.get<ApiCategory[]>('/categories');
        setCategories(catsRes.map(c => c.name));
        setApiCategories(catsRes);
      }
    } catch {
      toast.error('Failed to delete category');
    }
  };

  const handleAddCourseCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCategory.trim() || !user) return;
    try {
      const slug = newCourseCategory.trim().toLowerCase().replace(/\s+/g, '-');
      const existingCat = courseCategories.find(c => 
        c.name.toLowerCase() === newCourseCategory.trim().toLowerCase() || 
        c.slug === slug
      );
      if (existingCat) {
        toast.error('Course category already exists');
        return;
      }
      await api.post('/staff/course-categories', { name: newCourseCategory.trim() });
      toast.success('Course category added successfully');
      setNewCourseCategory('');
      const catRes = await api.get<{ id: number; name: string; slug: string; count: number }[]>('/staff/course-categories');
      setCourseCategories(catRes || []);
    } catch {
      toast.error('Failed to add course category');
    }
  };

  const handleDeleteCourseCategory = async (id: number) => {
    if (!user) return;
    try {
      await api.delete(`/staff/course-categories/${id}`);
      toast.success('Course category deleted successfully');
      const catRes = await api.get<{ id: number; name: string; slug: string; count: number }[]>('/staff/course-categories');
      setCourseCategories(catRes || []);
    } catch {
      toast.error('Failed to delete course category');
    }
  };

  const handleAddBook = async (e: React.FormEvent, saveAsDraft: boolean = false) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author || !newBook.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!newBook.category) {
      toast.error('Please select a category');
      return;
    }
    if (!newBookCoverFile && !newBook.coverUrl) {
      toast.error('Please upload a cover image');
      return;
    }

    setLoading(true);
    try {
      const catObj = apiCategories.find(c => c.name === newBook.category);
      if (!catObj) {
        toast.error('Selected category not found');
        setLoading(false);
        return;
      }

      let coverImage = newBookCoverUrl || newBook.coverUrl || null;
      if (newBookCoverFile && !newBookCoverUrl) {
        setNewBookCoverUploading(true);
        const uploadedUrl = await uploadImageFile(newBookCoverFile);
        setNewBookCoverUploading(false);
        if (uploadedUrl) {
          coverImage = uploadedUrl;
        }
      }

      let previewImages: string[] = [...newBookPreviewUrls];
      if (newBookPreviewFiles.length > 0 && newBookPreviewUrls.length === 0) {
        setNewBookPreviewUploading(true);
        for (const file of newBookPreviewFiles) {
          const url = await uploadPreviewImageFile(file);
          if (url) previewImages.push(url);
        }
        setNewBookPreviewUploading(false);
      }

      await api.post('/staff/books', {
        title: newBook.title,
        author: newBook.author,
        description: newBook.description,
        category_id: catObj.id,
        price: newBook.price || 0,
        stock: newBook.stock || 0,
        stock_threshold: newBook.stockThreshold || 10,
        image: coverImage,
        preview_images: previewImages,
        pages: newBook.pages || 0,
        language: newBook.language || 'English',
        format: newBook.format || 'Paperback',
        status: saveAsDraft ? 'draft' : 'approved',
      });
      toast.success(saveAsDraft ? 'Book saved as draft!' : 'Book added successfully!');
      
      const booksRes = await api.get<{ data: ApiBook[] }>('/staff/books');
      const mappedBooks = (booksRes.data || []).map(mapApiBookToBook) as StaffBook[];
      setAllBooks(mappedBooks);
      setMyBooks(mappedBooks.filter(b => b.status !== 'draft'));
      setDraftBooks(mappedBooks.filter(b => b.status === 'draft'));
      setLowStockBooks(mappedBooks.filter(b => b.stock < 5));
      
      // Refresh inventory too
      loadInventoryBooks();
      
      setActiveTab(saveAsDraft ? 'drafts' : 'my-books');
      setNewBook({
        title: '',
        author: '',
        description: '',
        category: categories[0] || 'Fiction',
        price: 0,
        stock: 0,
        stockThreshold: 10,
        coverUrl: '',
        previewContent: [],
        previewImages: [],
        pages: 0,
        language: 'English',
        format: 'Paperback',
      });
      setNewBookCoverFile(null);
      setNewBookCoverPreview('');
      setNewBookCoverUrl('');
      setNewBookPreviewFiles([]);
      setNewBookPreviewPreviews([]);
      setNewBookPreviewUrls([]);
    } catch (err: any) {
      const msg = err.message || err.error || 'Failed to add book';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBook = (book: StaffBook) => {
    setEditingBookId(book.id);
    setNewBook({
      title: book.title,
      author: book.author,
      description: book.description,
      category: book.category,
      price: book.price,
      stock: book.stock,
      stockThreshold: book.stockThreshold || 10,
      coverUrl: book.coverUrl,
      previewContent: book.previewContent
    });
    setActiveTab('add-book');
  };

  const openInventoryEdit = (book: StaffBook) => {
    setEditingInventoryBook(book);
    setEditForm({
      title: book.title,
      author: book.author,
      description: book.description || '',
      category: book.category,
      price: book.price,
      stock: book.stock,
      stockThreshold: book.stockThreshold || 10,
      coverUrl: book.coverUrl || '',
      previewImages: book.previewImages || [],
    });
    setCoverFile(null);
    setCoverPreview('');
    setPreviewFiles([]);
    setPreviewUrls(book.previewImages || []);
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setCoverFile(file);
    setEditForm(prev => ({ ...prev, coverUrl: '' }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadCover = async (): Promise<string | null> => {
    if (!coverFile) return null;
    setCoverUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', coverFile);
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/staff/books/upload-cover', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = err.message || err.error || 'Upload failed';
        throw new Error(msg);
      }
      const data = await response.json();
      return data.url || `http://localhost:8000/storage/${data.path}`;
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload cover image');
      return null;
    } finally {
      setCoverUploading(false);
    }
  };

  const handlePreviewFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error('Please select image files');
      return;
    }
    setPreviewFiles(prev => [...prev, ...imageFiles]);
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePreviewImage = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setPreviewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadPreviewImages = async (): Promise<string[]> => {
    if (previewFiles.length === 0) return [];
    const urls: string[] = [];
    for (const file of previewFiles) {
      const formData = new FormData();
      formData.append('image', file);
      const token = localStorage.getItem('auth_token');
      try {
        const response = await fetch('/api/staff/books/upload-cover', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          urls.push(data.url || `http://localhost:8000/storage/${data.path}`);
        }
      } catch {}
    }
    return urls;
  };

  const handleInventoryEditSave = async () => {
    if (!editingInventoryBook) return;
    setEditSaving(true);
    try {
      let imageUrl: string | null = null;
      if (coverFile) {
        imageUrl = await uploadCover();
      }
      const newPreviewUrls = await uploadPreviewImages();
      const allPreviewUrls = [...previewUrls.filter((_, i) => i < previewUrls.length - previewFiles.length), ...newPreviewUrls];
      const catObj = apiCategories.find(c => c.name === editForm.category);
      const updateData: any = {
        title: editForm.title,
        author: editForm.author,
        description: editForm.description,
        category_id: catObj?.id,
        price: editForm.price,
        stock: editForm.stock,
        stock_threshold: editForm.stockThreshold || 10,
        preview_images: allPreviewUrls,
      };
      if (imageUrl) {
        updateData.image = imageUrl;
      }
      await api.put(`/staff/books/${editingInventoryBook.id}`, updateData);
      toast.success('Book updated successfully');
      setEditingInventoryBook(null);
      const booksRes = await api.get<{ data: ApiBook[] }>('/staff/books');
      const mappedBooks = (booksRes.data || []).map(mapApiBookToBook) as StaffBook[];
      setAllBooks(mappedBooks);
      setMyBooks(mappedBooks.filter(b => b.status !== 'draft'));
      setDraftBooks(mappedBooks.filter(b => b.status === 'draft'));
      setLowStockBooks(mappedBooks.filter(b => b.stock < 5));
      
    } catch {
      toast.error('Failed to update book');
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this book? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await api.delete(`/staff/books/${bookId}`);
          toast.success('Book deleted successfully');
          const booksRes = await api.get<{ data: ApiBook[] }>('/staff/books');
          const mappedBooks = (booksRes.data || []).map(mapApiBookToBook) as StaffBook[];
          setAllBooks(mappedBooks);
          setMyBooks(mappedBooks.filter(b => b.status !== 'draft'));
          setDraftBooks(mappedBooks.filter(b => b.status === 'draft'));
setLowStockBooks(mappedBooks.filter(b => b.stock < inventoryThreshold && b.stock > 0));
          
        } catch {
          toast.error('Failed to delete book');
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      type: 'danger'
    });
  };

  const handleSaveDraft = async () => {
    if (!newBook.title) {
      toast.error('Please enter at least a book title to save as draft');
      return;
    }
    if (!newBookCoverFile && !newBook.coverUrl) {
      toast.error('Please upload a cover image');
      return;
    }

    setLoading(true);
    try {
      const catObj = apiCategories.find(c => c.name === newBook.category);

      let coverImage = newBook.coverUrl || null;
      if (newBookCoverFile) {
        setNewBookCoverUploading(true);
        const uploadedUrl = await uploadImageFile(newBookCoverFile);
        setNewBookCoverUploading(false);
        if (uploadedUrl) {
          coverImage = uploadedUrl;
        }
      }

      let previewImages: string[] = [];
      if (newBookPreviewFiles.length > 0) {
        setNewBookPreviewUploading(true);
        for (const file of newBookPreviewFiles) {
          const url = await uploadPreviewImageFile(file);
          if (url) previewImages.push(url);
        }
        setNewBookPreviewUploading(false);
      }

      await api.post('/staff/books', {
        title: newBook.title,
        author: newBook.author || '',
        description: newBook.description || '',
        category_id: catObj?.id || null,
        price: newBook.price || 0,
        stock: newBook.stock || 0,
        stock_threshold: newBook.stockThreshold || 10,
        image: coverImage,
        preview_images: previewImages,
        status: 'draft',
      });
      toast.success('Book saved as draft!');
      
      const res = await api.get<any>('/staff/books', {
        per_page: String(draftBooksPerPage),
        page: '1',
        status: 'draft',
      });
      const mappedBooks = (res.data || []).map(mapApiBookToBook) as StaffBook[];
      setDraftBooks(mappedBooks);
      setDraftBooksTotal(res.total || 0);
      
      loadInventoryBooks();
      
      setActiveTab('drafts');
      setNewBookCoverFile(null);
      setNewBookCoverPreview('');
      setNewBookCoverUrl('');
      setNewBookPreviewFiles([]);
      setNewBookPreviewPreviews([]);
      setNewBookPreviewUrls([]);
      setNewBook({
        title: '',
        author: '',
        description: '',
        category: categories[0] || 'Fiction',
        price: 0,
        stock: 0,
        coverUrl: '',
        previewContent: [],
        previewImages: [],
      });
    } catch (err: any) {
      const msg = err.message || err.error || 'Failed to save draft';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'draft': return <FileText className="w-4 h-4 text-gray-500" />;
      case 'pending_deletion': return <Trash2 className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-orange-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved': return 'bg-green-50 text-green-700 border-green-100';
      case 'draft': return 'bg-gray-50 text-gray-700 border-gray-100';
      case 'pending_deletion': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-orange-50 text-orange-700 border-orange-100';
    }
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8">
  <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full lg:w-80 shrink-0">
  <div className="sticky top-6 overflow-hidden rounded-[2rem] border border-orange-100 bg-white/90 backdrop-blur-xl shadow-[0_24px_80px_rgba(249,115,22,0.12)]">
    {/* Premium top accent */}
    <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

    {/* Header */}
    <div className="border-b border-orange-100/70 bg-gradient-to-b from-orange-50/90 via-white to-white p-6">
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="absolute -inset-2 rounded-3xl bg-orange-500/10 blur-md" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25">
            <LayoutDashboard className="h-7 w-7" />
          </div>
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-500">
            Staff Command Center
          </p>
          <h2 className="font-serif text-2xl font-bold leading-tight text-gray-900">
            Staff Panel
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Elegant management experience with premium control.
          </p>
        </div>
      </div>
    </div>

    {/* Navigation */}
    <div className="p-4 max-h-[calc(100vh-400px)] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-400">
        Navigation
      </p>

      <div className="space-y-2">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
          { id: 'my-books', label: 'My Submissions', icon: BookOpen },
          { id: 'drafts', label: 'Drafts', icon: FileText },
          { id: 'inventory', label: 'Inventory Management', icon: Package },
          { id: 'categories', label: 'Manage Categories', icon: Tag },
          { id: 'add-book', label: 'Add New Book', icon: PlusCircle },
          { id: 'add-course', label: 'Add New Course', icon: GraduationCap },
          { id: 'qanda', label: 'Q&A Management', icon: MessageSquare },
          { id: 'orders', label: 'Order Management', icon: Package },
          { id: 'gallery', label: 'Manage Gallery', icon: Images },
          { id: 'promo-codes', label: 'Promo Codes', icon: Tag },
          { id: 'about', label: 'Edit About Page', icon: Info },
        ].map((tab) => {
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "group relative w-full overflow-hidden rounded-2xl border px-4 py-4 text-left transition-all duration-300",
                isActive
                  ? "border-orange-500/20 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white shadow-[0_18px_40px_rgba(249,115,22,0.28)]"
                  : "border-transparent bg-white text-gray-600 hover:border-orange-100 hover:bg-orange-50/70 hover:text-gray-900"
              )}
            >
              {isActive && (
                <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-white/90" />
              )}

              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-300",
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-orange-100 text-orange-600 group-hover:bg-orange-200/70"
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                </span>

                <span className="flex-1 font-semibold tracking-tight">
                  {tab.label}
                </span>

                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-all duration-300",
                    isActive
                      ? "bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.18)]"
                      : "bg-orange-200 group-hover:bg-orange-400"
                  )}
                />
              </div>
            </button>
          )
        })}
      </div>
    </div>

    {/* Bottom luxury card */}
    <div className="p-4 pt-0">
      <div className="rounded-[1.75rem] border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-4 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-500">
          Premium Access
        </p>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Designed for a refined, high-end admin experience with clarity, elegance,
          and smooth navigation.
        </p>
      </div>
    </div>
  </div>
</aside>

       <main className="flex-1 min-w-0">
  <AnimatePresence mode="wait">
    {/* ====================================================== START: DASHBOARD OVERVIEW ====================================================== */}
    {activeTab === 'overview' && (
      <motion.div
        key="overview"
        initial={{ opacity: 0, y: 18, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -18, scale: 0.99 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="space-y-8"
      >
        {/* Premium Hero / Section Header */}
        <section className="overflow-hidden rounded-[2.5rem] border border-orange-100 bg-gradient-to-br from-white via-orange-50/40 to-white shadow-[0_30px_100px_rgba(249,115,22,0.10)]">
          <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
          <div className="p-6 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-600 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  Executive Dashboard
                </div>

                <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
                  Books & Courses Management Center
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 lg:text-base">
                  A refined premium workspace for monitoring inventory, managing courses,
                  tracking performance, and maintaining full operational control with elegance.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="inline-flex items-center justify-center rounded-full border border-orange-200 bg-white px-5 py-3 text-sm font-semibold text-orange-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
                >
                  Manage Books
                </button>
                <button
                  onClick={() => setActiveTab('add-course')}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(249,115,22,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(249,115,22,0.32)]"
                >
                  Manage Courses
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Books Management */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-500">
                Performance Snapshot
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                Books Management
              </h2>
            </div>

            <a
              href="/staff/inventory"
              className="text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700 hover:underline"
            >
              Open Inventory →
            </a>
          </div>

<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="group relative overflow-hidden rounded-[1.9rem] border border-orange-100 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(249,115,22,0.12)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-600">
                  Live
                </span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
                Total Titles
              </div>
              <div className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
                {booksMetrics.totalTitles}
              </div>
              <div className="mt-2 text-sm text-gray-500">Books in the catalog</div>
            </div>

            <div className="group relative overflow-hidden rounded-[1.9rem] border border-orange-100 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(249,115,22,0.12)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                  <Package className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-600">
                  Updated
                </span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
                Warehouse Stock
              </div>
              <div className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
                {booksMetrics.warehouseStock.toLocaleString()}
              </div>
              <div className="mt-2 text-sm text-gray-500">Total stock across all books</div>
            </div>

            <div className="group relative overflow-hidden rounded-[1.9rem] border border-orange-100 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(249,115,22,0.12)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                  <Tag className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-600">
                  Organized
                </span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
                Categories
              </div>
              <div className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
                {booksMetrics.categories.toString().padStart(2, '0')}
              </div>
              <div className="mt-2 text-sm text-gray-500">Book categories available</div>
            </div>

            <div className="group relative overflow-hidden rounded-[1.9rem] border border-orange-100 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(249,115,22,0.12)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-600">
                  Revenue
                </span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
                Total Revenue
              </div>
              <div className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
                {formatMoney(booksMetrics.totalRevenue)}
              </div>
              <div className="mt-2 text-sm text-gray-500">All-time generated revenue</div>
            </div>
          </div>
        </section>

        {/* Inventory Alert */}
        <section className="overflow-hidden rounded-[2.25rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-white shadow-[0_24px_80px_rgba(249,115,22,0.08)]">
          <div className="border-b border-orange-100/70 px-6 py-5 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 ring-1 ring-orange-200">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Inventory Alert: Books Needing Restock
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Priority attention for low-stock items.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-600">Low Stock</span>
                <input
                  type="number"
                  min="1"
                  value={inventoryThreshold}
                  onChange={(e) => setInventoryThreshold(parseInt(e.target.value) || 1)}
                  className="w-20 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm font-bold text-gray-900 outline-none focus:border-orange-400"
                />
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-8">
            <div className="mb-2 text-sm text-gray-500">
              Showing top 5 of {lowStockBooks.length} books below stock {inventoryThreshold}
            </div>
            {lowStockBooks.length > 0 ? (
<div className="space-y-4 overflow-x-auto">
                {lowStockBooks.slice(0, 5).map((book) => (
                  <div
                    key={book.id}
                    className="group flex flex-col gap-4 rounded-[1.75rem] border border-orange-100 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(249,115,22,0.12)] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-orange-100 bg-orange-50">
                        <img
                          src={book.coverUrl || getBookPlaceholder(book.title)}
                          alt={book.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getBookPlaceholder(book.title);
                          }}
                        />
                      </div>

                      <div>
                        <div className="text-lg font-semibold text-gray-900">{book.title}</div>
                        <div className="mt-1 inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                          Only {book.stock} left in stock
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setRestockModal({ isOpen: true, bookId: book.id, stock: book.stock })}
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(249,115,22,0.30)]"
                    >
                      Restock Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-orange-100 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                  <Package className="h-6 w-6" />
                </div>
                <p className="text-base font-semibold text-gray-900">All items are well-stocked.</p>
                <p className="mt-2 text-sm text-gray-500">
                  No urgent inventory issues detected at the moment.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Courses Management */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-500">
                Academy Snapshot
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                Course Academy
              </h2>
            </div>

            <a
              href="/staff/courses"
              className="text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700 hover:underline"
            >
              Open Courses →
            </a>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="group relative overflow-hidden rounded-[1.9rem] border border-orange-100 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(249,115,22,0.12)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-600">
                  Active
                </span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
                Total Courses
              </div>
              <div className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
                {coursesMetrics.total}
              </div>
              <div className="mt-2 text-sm text-gray-500">Courses in the academy</div>
            </div>

            <div className="group relative overflow-hidden rounded-[1.9rem] border border-orange-100 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(249,115,22,0.12)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                  <PlayCircle className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-600">
                  Media
                </span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
                Total Videos
              </div>
              <div className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
                {coursesMetrics.total_videos}
              </div>
              <div className="mt-2 text-sm text-gray-500">Educational video lessons</div>
            </div>

            <div className="group relative overflow-hidden rounded-[1.9rem] border border-orange-100 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(249,115,22,0.12)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                  <Tag className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-600">
                  Structured
                </span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
                Categories
              </div>
              <div className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
                {coursesMetrics.categories.toString().padStart(2, '0')}
              </div>
              <div className="mt-2 text-sm text-gray-500">Course categories available</div>
            </div>

            <div className="group relative overflow-hidden rounded-[1.9rem] border border-orange-100 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(249,115,22,0.12)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-600">
                  Earnings
                </span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
                Total Revenue
              </div>
              <div className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
                {formatMoney(coursesMetrics.revenue)}
              </div>
              <div className="mt-2 text-sm text-gray-500">Course revenue generated</div>
            </div>
          </div>
        </section>
      </motion.div>
    )}
    {/* ====================================================== END: DASHBOARD OVERVIEW ====================================================== */}
  {/* ====================================================== START: MY SUBMISSIONS ====================================================== */}
{activeTab === 'my-books' && (
  <motion.div
    key="my-books"
    initial={{ opacity: 0, y: 18, scale: 0.99 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -18, scale: 0.99 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="space-y-6"
  >
    {/* Premium Section Header */}
    <section className="overflow-hidden rounded-[2.5rem] border border-orange-100 bg-gradient-to-br from-white via-orange-50/40 to-white shadow-[0_28px_90px_rgba(249,115,22,0.08)]">
      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Submission Center
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <h3 className="font-serif text-3xl font-bold tracking-tight text-gray-900">
                My Submissions
              </h3>
              <p className="pb-1 text-sm text-gray-500">
                {myBooksTotal} books
              </p>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              A refined showcase of your published and draft submissions with premium clarity,
              elegant structure, and seamless control.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex items-center rounded-full border border-orange-100 bg-white p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                viewMode === 'grid'
                  ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_10px_25px_rgba(249,115,22,0.25)]"
                  : "text-gray-500 hover:bg-orange-50 hover:text-gray-900"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              Grid
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                viewMode === 'list'
                  ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_10px_25px_rgba(249,115,22,0.25)]"
                  : "text-gray-500 hover:bg-orange-50 hover:text-gray-900"
              )}
            >
              <List className="h-4 w-4" />
              List
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* Content */}
    {myBooks.length > 0 ? (
      viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {myBooks.map((book) => (
            <div
              key={book.id}
              className="group relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(249,115,22,0.12)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

              <div className="flex gap-4">
                <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-2xl border border-orange-100 bg-orange-50 shadow-sm">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold tracking-tight text-gray-900">
                        {book.title}
                      </h3>
                      <p className="mt-1 truncate text-sm text-gray-500">
                        by {book.author}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]",
                        book.status === 'approved'
                          ? 'bg-green-50 text-green-600 ring-1 ring-green-100'
                          : book.status === 'draft'
                            ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-100'
                            : 'bg-gray-50 text-gray-600 ring-1 ring-gray-100'
                      )}
                    >
                      {book.status || 'draft'}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-500">
                        Price
                      </p>
                      <p className="mt-1 text-xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                        ৳{book.price.toFixed(2)}
                      </p>
                    </div>

                    
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
          <div className="border-b border-orange-100/70 bg-gradient-to-r from-orange-50/80 to-white px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-gray-900">Submission List</h4>
                <p className="mt-1 text-sm text-gray-500">Elegant table view for streamlined review.</p>
              </div>
              <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-orange-600 shadow-sm ring-1 ring-orange-100">
                {myBooksTotal} Total
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-orange-50/80 backdrop-blur">
                <tr className="border-b border-orange-100">
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                    Book
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {myBooks.map((book) => (
                  <tr
                    key={book.id}
                    className="border-b border-gray-50 transition-colors hover:bg-orange-50/40"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-10 overflow-hidden rounded-xl border border-orange-100 bg-orange-50 shadow-sm">
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{book.title}</p>
                          <p className="mt-1 text-sm text-gray-500">{book.author}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ৳{book.price.toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]",
                          book.status === 'approved'
                            ? 'bg-green-50 text-green-600 ring-1 ring-green-100'
                            : book.status === 'draft'
                              ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-100'
                              : 'bg-gray-50 text-gray-600 ring-1 ring-gray-100'
                        )}
                      >
                        {book.status || 'draft'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(book as any).createdAt
                        ? new Date((book as any).createdAt).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    ) : (
      <div className="flex flex-col items-center justify-center rounded-[2.25rem] border border-dashed border-orange-200 bg-gradient-to-br from-white to-orange-50/40 py-20 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-orange-600 shadow-sm ring-1 ring-orange-100">
          <BookOpen className="h-7 w-7" />
        </div>
        <h4 className="text-xl font-bold text-gray-900">No submissions yet</h4>
        <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
          Your submissions will appear here in a refined, premium layout once you add your first book.
        </p>
      </div>
    )}

    {/* Pagination */}
    {myBooksTotal > myBooksPerPage && (
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={() => setMyBooksCurrentPage((p) => Math.max(1, p - 1))}
          disabled={myBooksCurrentPage === 1}
          className="inline-flex items-center justify-center rounded-full border border-orange-100 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-orange-200 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <div className="rounded-full border border-orange-100 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 shadow-sm">
          Page {myBooksCurrentPage} of {Math.ceil(myBooksTotal / myBooksPerPage)}
        </div>

        <button
          onClick={() => setMyBooksCurrentPage((p) => p + 1)}
          disabled={myBooksCurrentPage >= Math.ceil(myBooksTotal / myBooksPerPage)}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(249,115,22,0.30)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    )}
  </motion.div>
)}
{/* ====================================================== END: MY SUBMISSIONS ====================================================== */}
{/* ====================================================== START: DRAFTS ====================================================== */}
{activeTab === 'drafts' && (
  <motion.div
    key="drafts"
    initial={{ opacity: 0, y: 18, scale: 0.99 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -18, scale: 0.99 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="space-y-6"
  >
    {/* Premium Section Header */}
    <section className="overflow-hidden rounded-[2.5rem] border border-orange-100 bg-gradient-to-br from-white via-orange-50/40 to-white shadow-[0_28px_90px_rgba(249,115,22,0.08)]">
      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Draft Studio
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <h3 className="font-serif text-3xl font-bold tracking-tight text-gray-900">
                Draft Items
              </h3>
              <p className="pb-1 text-sm text-gray-500">
                {draftBooksTotal} books, {draftCoursesTotal} courses
              </p>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              A refined workspace for unfinished manuscripts, preview-ready drafts,
              and premium editing control in one elegant view.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex items-center rounded-full border border-orange-100 bg-white p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                viewMode === 'grid'
                  ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_10px_25px_rgba(249,115,22,0.25)]"
                  : "text-gray-500 hover:bg-orange-50 hover:text-gray-900"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              Grid
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                viewMode === 'list'
                  ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_10px_25px_rgba(249,115,22,0.25)]"
                  : "text-gray-500 hover:bg-orange-50 hover:text-gray-900"
              )}
            >
              <List className="h-4 w-4" />
              List
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* Content */}
    {draftBooks.length > 0 ? (
      viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {draftBooks.map((book) => (
            <div
              key={book.id}
              className="group relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(249,115,22,0.12)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

              <div className="flex gap-4">
                <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-2xl border border-orange-100 bg-orange-50 shadow-sm">
                  <img
                    src={book.coverUrl || getBookPlaceholder(book.title)}
                    alt={book.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getBookPlaceholder(book.title);
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold tracking-tight text-gray-900">
                        {book.title}
                      </h3>
                      <p className="mt-1 truncate text-sm text-gray-500">
                        by {book.author}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-600 ring-1 ring-orange-100">
                      Draft
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-500">
                        Price
                      </p>
                      <p className="mt-1 text-xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                        ৳{book.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-orange-100/70 pt-4 flex gap-2">
                    <button
                      onClick={() => openInventoryEdit(book)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(249,115,22,0.30)]"
                    >
                      <Edit3 className="h-4 w-4" />
                      Continue Editing
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm('Are you sure you want to delete this draft?')) return;
                        try {
                          await api.delete(`/staff/books/${book.id}`);
                          setDraftBooks(prev => prev.filter(b => b.id !== book.id));
                          setDraftBooksTotal(prev => prev - 1);
                          toast.success('Draft deleted');
                        } catch (err: any) {
                          toast.error(err.message || 'Failed to delete draft');
                        }
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 ring-1 ring-red-100 hover:bg-red-100 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
          <div className="border-b border-orange-100/70 bg-gradient-to-r from-orange-50/80 to-white px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900">Draft List</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Structured editing view for premium workflow control.
                </p>
              </div>
              <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-orange-600 shadow-sm ring-1 ring-orange-100">
                {draftBooksTotal} Total
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-orange-50/80 backdrop-blur">
                <tr className="border-b border-orange-100">
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                    Book
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {draftBooks.map((book) => (
                  <tr
                    key={book.id}
                    className="border-b border-gray-50 transition-colors hover:bg-orange-50/40"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-10 overflow-hidden rounded-xl border border-orange-100 bg-orange-50 shadow-sm">
                          <img
                            src={book.coverUrl || getBookPlaceholder(book.title)}
                            alt={book.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getBookPlaceholder(book.title);
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{book.title}</p>
                          <p className="mt-1 text-sm text-gray-500">{book.author}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ৳{book.price.toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-600 ring-1 ring-orange-100">
                        Draft
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(book as any).createdAt
                        ? new Date((book as any).createdAt).toLocaleDateString()
                        : '-'}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openInventoryEdit(book)}
                          className="inline-flex items-center justify-center rounded-full border border-orange-100 bg-white p-2 text-orange-600 shadow-sm transition-all duration-300 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm('Are you sure you want to delete this draft?')) return;
                            try {
                              await api.delete(`/staff/books/${book.id}`);
                              setDraftBooks(prev => prev.filter(b => b.id !== book.id));
                              setDraftBooksTotal(prev => prev - 1);
                              toast.success('Draft deleted');
                            } catch (err: any) {
                              toast.error(err.message || 'Failed to delete draft');
                            }
                          }}
                          className="inline-flex items-center justify-center rounded-full border border-red-100 bg-white p-2 text-red-500 shadow-sm transition-all duration-300 hover:border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    ) : (
      <div className="flex flex-col items-center justify-center rounded-[2.25rem] border border-dashed border-orange-200 bg-gradient-to-br from-white to-orange-50/40 py-20 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-orange-600 shadow-sm ring-1 ring-orange-100">
          <FileText className="h-7 w-7" />
        </div>
        <h4 className="text-xl font-bold text-gray-900">No draft books yet</h4>
        <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
          Drafts will appear here in a refined premium layout when you start creating
          unfinished book entries.
        </p>
      </div>
    )}

    {/* Pagination */}
    {draftBooksTotal > draftBooksPerPage && (
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={() => setDraftBooksCurrentPage((p) => Math.max(1, p - 1))}
          disabled={draftBooksCurrentPage === 1}
          className="inline-flex items-center justify-center rounded-full border border-orange-100 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-orange-200 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <div className="rounded-full border border-orange-100 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 shadow-sm">
          Page {draftBooksCurrentPage} of {Math.ceil(draftBooksTotal / draftBooksPerPage)}
        </div>

        <button
          onClick={() => setDraftBooksCurrentPage((p) => p + 1)}
          disabled={draftBooksCurrentPage >= Math.ceil(draftBooksTotal / draftBooksPerPage)}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(249,115,22,0.30)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    )}

    {/* Draft Courses Section */}
    {draftCourses.length > 0 && (
      <section className="overflow-hidden rounded-[2.5rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/40 to-white shadow-[0_28px_90px_rgba(59,130,246,0.08)]">
        <div className="h-1.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600" />
        <div className="p-6 lg:p-8">
          <div className="mb-6 flex flex-wrap items-end gap-3">
            <h3 className="font-serif text-2xl font-bold tracking-tight text-gray-900">
              Draft Courses
            </h3>
            <p className="pb-1 text-sm text-gray-500">
              {draftCoursesTotal} courses
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {draftCourses.map((course) => (
              <div
                key={course.id}
                className="group relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(59,130,246,0.12)]"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600" />

                <div className="flex gap-4">
                  <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 shadow-sm">
                    <img
                      src={course.image || '/placeholder-course.jpg'}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-course.jpg';
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold tracking-tight text-gray-900">
                          {course.title}
                        </h3>
                        <p className="mt-1 truncate text-sm text-gray-500">
                          by {course.instructor}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600 ring-1 ring-blue-100">
                        Draft
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-500">
                          Price
                        </p>
                        <p className="mt-1 text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                          ৳{Number(course.price).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-500">
                          Lessons
                        </p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {course.lessons_count || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-blue-100/70 pt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCourse(course);
                      setCourseEditForm({
                        title: course.title || '',
                        slug: course.slug || '',
                        instructor: course.instructor || '',
                        description: course.description || '',
                        image: course.image || '',
                        price: Number(course.price) || 0,
                        duration_hours: Number(course.duration_hours) || 0,
                        lessons_count: Number(course.lessons_count) || 0,
                        level: course.level || 'beginner',
                        preview_video: course.preview_video || '',
                        category: course.category || 'language',
                        is_featured: course.is_featured || false,
                        is_active: course.is_active || false,
                      });
                      setCourseStep('overview');
                      setActiveTab('add-course');
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(59,130,246,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(59,130,246,0.30)]"
                  >
                    <Edit3 className="h-4 w-4" />
                    Continue Editing
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm('Are you sure you want to publish this course?')) return;
                      try {
                        await api.put(`/staff/courses/${course.id}/publish`);
                        setDraftCourses(prev => prev.filter(c => c.id !== course.id));
                        setDraftCoursesTotal(prev => prev - 1);
                        toast.success('Course published successfully!');
                      } catch (err: any) {
                        toast.error(err.message || 'Failed to publish course');
                      }
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-green-50 px-4 py-3 text-sm font-semibold text-green-600 ring-1 ring-green-100 hover:bg-green-100 transition-all"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm('Are you sure you want to delete this draft?')) return;
                      try {
                        await api.delete(`/staff/courses/${course.id}`);
                        setDraftCourses(prev => prev.filter(c => c.id !== course.id));
                        setDraftCoursesTotal(prev => prev - 1);
                        toast.success('Draft deleted');
                      } catch (err: any) {
                        toast.error(err.message || 'Failed to delete draft');
                      }
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 ring-1 ring-red-100 hover:bg-red-100 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {draftCoursesTotal > draftCoursesPerPage && (
            <div className="flex items-center justify-center gap-3 pt-6">
              <button
                onClick={() => setDraftCoursesCurrentPage((p) => Math.max(1, p - 1))}
                disabled={draftCoursesCurrentPage === 1}
                className="inline-flex items-center justify-center rounded-full border border-blue-100 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <div className="rounded-full border border-blue-100 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 shadow-sm">
                Page {draftCoursesCurrentPage} of {Math.ceil(draftCoursesTotal / draftCoursesPerPage)}
              </div>
              <button
                onClick={() => setDraftCoursesCurrentPage((p) => p + 1)}
                disabled={draftCoursesCurrentPage >= Math.ceil(draftCoursesTotal / draftCoursesPerPage)}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(59,130,246,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(59,130,246,0.30)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    )}

    {draftBooks.length === 0 && draftCourses.length === 0 && (
      <div className="flex flex-col items-center justify-center rounded-[2.25rem] border border-dashed border-orange-200 bg-gradient-to-br from-white to-orange-50/40 py-20 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-orange-600 shadow-sm ring-1 ring-orange-100">
          <FileText className="h-7 w-7" />
        </div>
        <h4 className="text-xl font-bold text-gray-900">No drafts yet</h4>
        <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
          Drafts will appear here when you save books or courses as drafts.
        </p>
      </div>
    )}
  </motion.div>
)}
{/* ====================================================== END: DRAFTS ====================================================== */}
            {/* ====================================================== START: INVENTORY MANAGEMENT ====================================================== */}
{activeTab === 'inventory' && (
  <motion.div
    key="inventory"
    initial={{ opacity: 0, y: 18, scale: 0.99 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -18, scale: 0.99 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="space-y-6"
  >
    {/* Premium Section Header */}
    <section className="overflow-hidden rounded-[2.5rem] border border-orange-100 bg-gradient-to-br from-white via-orange-50/40 to-white shadow-[0_28px_90px_rgba(249,115,22,0.08)]">
      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

      <div className="p-6 lg:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between overflow-x-auto">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Inventory Control Suite
            </div>

            <h3 className="font-serif text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
              Inventory Management
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              Manage books and courses in one elegant premium workspace with refined filtering,
              powerful controls, and seamless operational clarity.
            </p>

            {/* Controls Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Type Toggle */}
              <div className="inline-flex items-center rounded-full border border-orange-100 bg-white p-1 shadow-sm">
                <button
                  onClick={() => setInventoryType('books')}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                    inventoryType === 'books'
                      ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_10px_25px_rgba(249,115,22,0.25)]"
                      : "text-gray-500 hover:bg-orange-50 hover:text-gray-900"
                  )}
                >
                  <BookOpen className="h-4 w-4" />
                  Books
                </button>

                <button
                  onClick={() => setInventoryType('courses')}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                    inventoryType === 'courses'
                      ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_10px_25px_rgba(249,115,22,0.25)]"
                      : "text-gray-500 hover:bg-orange-50 hover:text-gray-900"
                  )}
                >
                  <GraduationCap className="h-4 w-4" />
                  Courses
                </button>
              </div>

              {/* Total Count */}
              <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm">
                <span className="flex items-center justify-center min-w-[2.5rem] h-8 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-3 py-1 text-white shadow-md">
                  {inventoryType === 'books' ? inventoryTotal : inventoryCoursesTotal}
                </span>
                <span className="text-gray-400">{inventoryType === 'books' ? 'total books' : 'total courses'}</span>
              </div>

              {/* View Toggle */}
              <div className="inline-flex items-center rounded-full border border-orange-100 bg-white p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-semibold transition-all duration-300",
                    viewMode === 'grid'
                      ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_10px_25px_rgba(249,115,22,0.25)]"
                      : "text-gray-500 hover:bg-orange-50 hover:text-gray-900"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-semibold transition-all duration-300",
                    viewMode === 'list'
                      ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_10px_25px_rgba(249,115,22,0.25)]"
                      : "text-gray-500 hover:bg-orange-50 hover:text-gray-900"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Books Inventory Filters */}
    {inventoryType === 'books' && (
      <section className="rounded-[2rem] border border-orange-100 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] overflow-x-auto">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Search books..."
                className="w-full rounded-2xl border border-orange-100 bg-white py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
              />
            </div>

            <div>
<div className="flex items-center gap-2">
              <select
                value={inventorySort.replace('-asc', '').replace('oldest', 'newest')}
                onChange={(e) => setInventorySort(e.target.value)}
                className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
              >
                <option value="newest">Date</option>
                <option value="title">Title</option>
                <option value="stock">Stock</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="reviews">Reviews</option>
                <option value="sold">Sold</option>
                <option value="featured">Featured</option>
              </select>
              <button
                onClick={() => setInventorySort(prev => (prev.endsWith('-asc') ? prev.replace('-asc', '') : prev + '-asc'))}
                className="px-3 py-3 rounded-2xl border border-orange-100 bg-white text-orange-600 font-bold hover:bg-orange-50"
              >
                {inventorySort.endsWith('-asc') ? '↑' : '↓'}
              </button>
            </div>
            </div>

            <div>
              <select
                value={inventoryStockFilter}
                onChange={(e) => setInventoryStockFilter(e.target.value)}
                className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
              >
                <option value="all">All Stock</option>
                <option value="in">In Stock (above threshold)</option>
                <option value="low">Low Stock (below threshold)</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-600 whitespace-nowrap">Low Stock</span>
              <input
                type="number"
                min="1"
                value={inventoryThreshold}
                onChange={(e) => setInventoryThreshold(parseInt(e.target.value) || 1)}
                placeholder="10"
                className="w-20 rounded-2xl border border-orange-100 bg-white px-3 py-2 text-sm font-semibold outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-white px-4 py-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-600">৳</span>
              <input
                type="number"
                min="0"
                max={inventoryPriceRange[1]}
                value={inventoryPriceRange[0]}
                onChange={(e) => {
                  const val = Math.max(0, Math.min(parseInt(e.target.value) || 0, inventoryPriceRange[1]))
                  setInventoryPriceRange([val, inventoryPriceRange[1]])
                }}
                className="w-20 rounded-lg border border-orange-100 bg-white px-2 py-2 text-center text-xs font-semibold outline-none focus:border-orange-300"
              />
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-0 top-1/2 -translate-y-1/2">
                <div 
                  className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-orange-400 to-amber-400"
                  style={{
                    left: `${(inventoryPriceRange[0] / inventoryMaxPrice) * 100}%`,
                    right: `${100 - (inventoryPriceRange[1] / inventoryMaxPrice) * 100}%`
                  }}
                />
              </div>
              <input
                type="range"
                min="0"
                max={inventoryMaxPrice}
                value={inventoryPriceRange[0]}
                onChange={(e) => {
                  const val = Math.min(parseInt(e.target.value), inventoryPriceRange[1])
                  setInventoryPriceRange([val, inventoryPriceRange[1]])
                }}
                className="relative z-10 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-orange-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max={inventoryMaxPrice}
                value={inventoryPriceRange[1]}
                onChange={(e) => {
                  const val = Math.max(parseInt(e.target.value), inventoryPriceRange[0])
                  setInventoryPriceRange([inventoryPriceRange[0], val])
                }}
                className="absolute inset-0 z-20 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-orange-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer"
                style={{ pointerEvents: 'none' }}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={inventoryPriceRange[0]}
                max={inventoryMaxPrice}
                value={inventoryPriceRange[1]}
                onChange={(e) => {
                  const val = Math.min(inventoryMaxPrice, Math.max(parseInt(e.target.value) || inventoryMaxPrice, inventoryPriceRange[0]))
                  setInventoryPriceRange([inventoryPriceRange[0], val])
                }}
                className="w-20 rounded-lg border border-orange-100 bg-white px-2 py-2 text-center text-xs font-semibold outline-none focus:border-orange-300"
              />
              <span className="text-xs font-bold text-orange-600">৳</span>
            </div>
          </div>
        </div>
      </section>
    )}

    {/* Courses Inventory Filters */}
    {inventoryType === 'courses' && (
      <section className="rounded-[2rem] border border-orange-100 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="relative xl:col-span-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              placeholder="Search by title or instructor..."
              className="w-full rounded-2xl border border-orange-100 bg-white py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
            />
          </div>

          <div className="xl:col-span-3">
<div className="flex items-center gap-2">
              <select
                value={courseSort.replace('-asc', '').replace('oldest', 'newest')}
                onChange={(e) => setCourseSort(e.target.value)}
                className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-4 text-sm font-semibold outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
              >
                <option value="newest">Date</option>
                <option value="title">Title</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="reviews"> Reviews</option>
                <option value="enrolled">Enrolled</option>
                <option value="featured">Featured</option>
              </select>
              <button
                onClick={() => setCourseSort(prev => (prev.endsWith('-asc') ? prev.replace('-asc', '') : prev + '-asc'))}
                className="px-3 py-3 rounded-2xl border border-orange-100 bg-white text-orange-600 font-bold hover:bg-orange-50"
              >
                {courseSort.endsWith('-asc') ? '↑' : '↓'}
              </button>
            </div>
          </div>

          <div className="xl:col-span-4">
            <select
              value={courseStatusFilter}
              onChange={(e) => setCourseStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'draft')}
              className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-4 text-sm font-semibold outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </section>
    )}

    {/* Books Inventory Content */}
    {inventoryType === 'books' && filteredInventory.length > 0 ? (
      viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {filteredInventory.map((book) => (
            <div
              key={book.id}
              className="group relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(249,115,22,0.12)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

<div className="flex gap-4">
                <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-2xl border border-orange-100 bg-orange-50 shadow-sm">
                  <img
                    src={book.coverUrl || getBookPlaceholder(book.title)}
                    alt={book.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getBookPlaceholder(book.title);
                    }}
                  />
                </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-end mb-2">
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]",
                          (book as any).status === 'draft'
                            ? "bg-orange-50 text-orange-600 ring-1 ring-orange-100"
                            : "bg-green-50 text-green-600 ring-1 ring-green-100"
                        )}
                      >
                        {(book as any).status || 'approved'}
                      </span>
                    </div>
                    <h3 className="truncate text-base font-bold tracking-tight text-gray-900">
                      {book.title}
                    </h3>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      by {book.author}
                    </p>

                    <div className="mt-3 flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                        <span className="font-bold text-gray-700">
                          {book.rating ? parseFloat(String(book.rating)).toFixed(1) : '0.0'}
                        </span>
                      </div>
                      <span className="text-gray-400">({(book as any).reviews_count || 0} reviews)</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-500">{(book as any).purchase_count || 0} sold</span>
                    </div>

                    <div className="mt-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-500">
                        Price
                      </p>
                      <p className="mt-1 text-xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                        ৳{book.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]",
                          book.stock === 0
                            ? "bg-red-50 text-red-600 ring-1 ring-red-100"
                            : book.stock < inventoryThreshold
                              ? "bg-orange-50 text-orange-600 ring-1 ring-orange-100"
                              : "bg-green-50 text-green-600 ring-1 ring-green-100"
                        )}
                      >
                        {book.stock === 0
                          ? "Out of Stock"
                          : book.stock < inventoryThreshold
                            ? `Low Stock (${book.stock})`
                            : `In Stock (${book.stock})`}
                      </span>

                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]",
                          (book as any).isFeatured
                            ? "bg-yellow-50 text-yellow-600 ring-1 ring-yellow-100"
                            : "bg-gray-50 text-gray-500 ring-1 ring-gray-100"
                        )}
                      >
                        {(book as any).isFeatured ? "Featured" : "Standard"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-orange-100/70 pt-4">
                    <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={async () => {
                      const newFeatured = !(book as any).isFeatured
                      setInventoryBooks((prev) =>
                        prev.map((b) =>
                          b.id === book.id ? ({ ...b, isFeatured: newFeatured } as StaffBook) : b
                        )
                      )
                      try {
                        await api.put(`/staff/books/${book.id}`, { is_featured: newFeatured })
                        toast.success(newFeatured ? 'Added to featured' : 'Removed from featured')
                      } catch {
                        setInventoryBooks((prev) =>
                          prev.map((b) =>
                            b.id === book.id ? ({ ...b, isFeatured: !newFeatured } as StaffBook) : b
                          )
                        )
                        toast.error('Failed to update featured status')
                      }
                    }}
                    className={cn(
                      "inline-flex items-center justify-center rounded-full px-4 py-3 text-xs font-semibold transition-all duration-300",
                      (book as any).isFeatured
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-[0_10px_25px_rgba(249,115,22,0.18)] hover:-translate-y-0.5"
                        : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                    )}
                  >
                    {(book as any).isFeatured ? "★ Featured" : "☆ Feature"}
                  </button>

                  <button
                    onClick={() => openInventoryEdit(book)}
                    className="inline-flex items-center justify-center rounded-full bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setConfirmModal({
                        isOpen: true,
                        title: 'Delete Book',
                        message: `Are you sure you want to delete "${book.title}"? This action cannot be undone.`,
                        type: 'danger',
                        onConfirm: async () => {
                          try {
                            await api.delete(`/staff/books/${book.id}`)
                            toast.success('Book deleted successfully')
                            loadInventoryBooks()
                          } catch {
                            toast.error('Failed to delete book')
                          }
                          setConfirmModal((prev) => ({ ...prev, isOpen: false }))
                        }
                      })
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 transition-all duration-300 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
          <div className="border-b border-orange-100/70 bg-gradient-to-r from-orange-50/80 to-white px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-gray-900">Books Inventory</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Elegant tabular control for book operations.
                </p>
              </div>

              <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-orange-600 shadow-sm ring-1 ring-orange-100">
                {filteredInventory.length} Visible
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-orange-50/80 backdrop-blur">
                <tr className="border-b border-orange-100">
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                    Book
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500 min-w-[175px]">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredInventory.map((book) => (
                  <tr
                    key={book.id}
                    className="border-b border-gray-50 transition-colors hover:bg-orange-50/40"
                  >
                    <td className="px-6 py-4">
<div className="flex items-center gap-4">
                        <div className="h-14 w-10 overflow-hidden rounded-xl border border-orange-100 bg-orange-50 shadow-sm">
                          <img
                            src={book.coverUrl || getBookPlaceholder(book.title)}
                            alt={book.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getBookPlaceholder(book.title);
                            }}
                          />
                        </div>
                        <div>
                          <p className="max-w-[220px] truncate font-semibold text-gray-900">
                            {book.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">{book.author}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {book.category}
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ৳{book.price.toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]",
                          book.stock === 0
                            ? "bg-red-50 text-red-600 ring-1 ring-red-100"
                            : book.stock < inventoryThreshold
                              ? "bg-orange-50 text-orange-600 ring-1 ring-orange-100"
                              : "bg-green-50 text-green-600 ring-1 ring-green-100"
                        )}
                      >
                        {book.stock === 0
                          ? "Out of Stock"
                          : book.stock < inventoryThreshold
                            ? `Low (${book.stock})`
                            : `${book.stock}`}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]",
                          (book as any).status === 'draft'
                            ? "bg-orange-50 text-orange-600 ring-1 ring-orange-100"
                            : "bg-green-50 text-green-600 ring-1 ring-green-100"
                        )}
                      >
                        {(book as any).status || 'approved'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openInventoryEdit(book)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm ring-1 ring-orange-100 transition-all duration-300 hover:bg-orange-50 hover:text-orange-700"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: 'Delete Book',
                              message: `Are you sure you want to delete "${book.title}"?`,
                              type: 'danger',
                              onConfirm: async () => {
                                try {
                                  await api.delete(`/staff/books/${book.id}`)
                                  toast.success('Book deleted')
                                  loadInventoryBooks()
                                } catch {
                                  toast.error('Failed to delete')
                                }
                                setConfirmModal((prev) => ({ ...prev, isOpen: false }))
                              }
                            })
                          }}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm ring-1 ring-red-100 transition-all duration-300 hover:bg-red-100 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    ) : inventoryType === 'books' ? (
      <div className="flex flex-col items-center justify-center rounded-[2.25rem] border border-dashed border-orange-200 bg-gradient-to-br from-white to-orange-50/40 py-20 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-orange-600 shadow-sm ring-1 ring-orange-100">
          <Package className="h-7 w-7" />
        </div>
        <h4 className="text-xl font-bold text-gray-900">No books found in inventory</h4>
        <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
          Refine your filters or search criteria to discover matching inventory items.
        </p>
      </div>
    ) : null}

    {/* Courses Inventory Content */}
    {inventoryType === 'courses' &&
      (() => {
        const filteredCourses = inventoryCourses
          .filter((course) => {
            const matchesSearch =
              course.title?.toLowerCase().includes(courseSearch.toLowerCase()) ||
              course.instructor?.toLowerCase().includes(courseSearch.toLowerCase())

            const matchesStatus =
              courseStatusFilter === 'all' ||
              (courseStatusFilter === 'active' && course.is_active && course.status === 'published') ||
              (courseStatusFilter === 'inactive' && !course.is_active && course.status === 'published') ||
              (courseStatusFilter === 'draft' && course.status === 'draft')

            return matchesSearch && matchesStatus
          })
          .sort((a, b) => {
            let sortKey = courseSort.replace('-asc', '');
            if (sortKey === 'oldest') sortKey = 'newest';
            const isAsc = courseSort.endsWith('-asc');
            const getVal = (item: any, key: string) => {
              if (key === 'newest') return new Date(item.created_at || 0).getTime();
              if (key === 'title') return item.title || '';
              if (key === 'price') return item.price || 0;
              if (key === 'rating') return item.average_rating || 0;
              if (key === 'reviews') return item.reviews_count || 0;
              if (key === 'enrolled') return item.enrolled_count || 0;
              if (key === 'featured') return item.is_featured ? 1 : 0;
              return 0;
            };
            const aVal = getVal(a, sortKey), bVal = getVal(b, sortKey);
            if (typeof aVal === 'string') return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            return isAsc ? aVal - bVal : bVal - aVal;
          })

        return filteredCourses.length > 0 ? (
          viewMode === 'grid' ? (
<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {filteredCourses.map((course) => {
                const totalLessons = (course.sections || []).reduce(
                  (acc: number, s: any) => acc + (s.lessons?.length || 0),
                  0
                )
                const totalQuizzes =
                  (course.quizzes || []).length +
                  (course.sections || [])
                    .flatMap((s: any) => s.lessons || [])
                    .reduce((acc: number, l: any) => acc + (l.quizzes?.length || 0), 0)

                return (
                  <div
                    key={course.id}
                    className="group relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(249,115,22,0.12)]"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

                    <div className="mb-4 h-40 w-full overflow-hidden rounded-2xl border border-orange-100 bg-orange-50 shadow-sm">
                      {course.image ? (
                        <img
                          src={course.image}
                          alt={course.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-orange-300">
                          <GraduationCap className="h-10 w-10" />
                        </div>
                      )}
                    </div>

<div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold tracking-tight text-gray-900">
                          {course.title}
                        </h3>
                        <p className="mt-1 truncate text-xs text-gray-500">
                          by {course.instructor || 'Unknown'}
                        </p>
                      </div>

                      {course.is_featured && (
                        <span className="shrink-0 rounded-full bg-yellow-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-yellow-600 ring-1 ring-yellow-100">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                        <span className="font-bold text-gray-700">
                          {course.average_rating ? parseFloat(course.average_rating).toFixed(1) : '0.0'}
                        </span>
                      </div>
                      <span className="text-gray-400">({course.reviews_count || 0} reviews)</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-500">{course.enrolled_count || 0} enrolled</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-orange-700 ring-1 ring-orange-100">
                        <Clock className="h-3 w-3" />
                        {course.duration_hours || 0}h
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-orange-700 ring-1 ring-orange-100">
                        <BookOpen className="h-3 w-3" />
                        {totalLessons} lessons
                      </span>
                      {totalQuizzes > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-orange-700 ring-1 ring-orange-100">
                          <ClipboardList className="h-3 w-3" />
                          {totalQuizzes} quizzes
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]",
                          course.level === 'beginner'
                            ? "bg-green-50 text-green-600 ring-1 ring-green-100"
                            : course.level === 'intermediate'
                              ? "bg-orange-50 text-orange-600 ring-1 ring-orange-100"
                              : "bg-red-50 text-red-600 ring-1 ring-red-100"
                        )}
                      >
                        {course.level}
                      </span>

                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]",
                          course.status === 'draft'
                            ? "bg-blue-50 text-blue-600 ring-1 ring-blue-100"
                            : course.is_active
                              ? "bg-green-50 text-green-600 ring-1 ring-green-100"
                              : "bg-gray-50 text-gray-500 ring-1 ring-gray-100"
                        )}
                      >
                        {course.status === 'draft' ? 'Draft' : course.is_active ? 'Active' : 'Inactive'}
                      </span>

                      <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-600 ring-1 ring-orange-100">
                        ৳{course.price || 0}
                      </span>
                    </div>

                    <div className="mt-5 border-t border-orange-100/70 pt-4">
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          onClick={() => handleToggleCourseFeatured(course)}
                          className={cn(
                            "inline-flex items-center justify-center rounded-full px-3 py-3 text-xs font-semibold transition-all duration-300",
                            course.is_featured
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-[0_10px_25px_rgba(249,115,22,0.18)]"
                              : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                          )}
                        >
                          {course.is_featured ? "★" : "☆"}
                        </button>

                        <button
                          onClick={() => handleToggleCourseActive(course)}
                          className={cn(
                            "inline-flex items-center justify-center rounded-full px-3 py-3 text-xs font-semibold transition-all duration-300",
                            course.is_active
                              ? "bg-green-50 text-green-600 hover:bg-green-100"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          {course.is_active ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        </button>

                        <button
                          onClick={() => openCourseEdit(course)}
                          className="inline-flex items-center justify-center rounded-full bg-gray-50 px-3 py-3 text-xs font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-100"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteCourse(course.id, course.title)}
                          className="inline-flex items-center justify-center rounded-full bg-red-50 px-3 py-3 text-xs font-semibold text-red-600 transition-all duration-300 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
              <div className="border-b border-orange-100/70 bg-gradient-to-r from-orange-50/80 to-white px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Courses Inventory</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Refined table layout for course administration.
                    </p>
                  </div>

                  <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-orange-600 shadow-sm ring-1 ring-orange-100">
                    {filteredCourses.length} Visible
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="sticky top-0 z-10 bg-orange-50/80 backdrop-blur">
                    <tr className="border-b border-orange-100">
                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                        Course
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                        Level
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                        Duration
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                        Lessons
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCourses.map((course) => {
                      const totalLessons = (course.sections || []).reduce(
                        (acc: number, s: any) => acc + (s.lessons?.length || 0),
                        0
                      )

                      return (
                        <tr
                          key={course.id}
                          className="border-b border-gray-50 transition-colors hover:bg-orange-50/40"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-20 overflow-hidden rounded-xl border border-orange-100 bg-orange-50 shadow-sm">
                                {course.image ? (
                                  <img
                                    src={course.image}
                                    alt={course.title}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-orange-300">
                                    <GraduationCap className="h-4 w-4" />
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="max-w-[220px] truncate font-semibold text-gray-900">
                                  {course.title}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  {course.instructor}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                            {course.category || '-'}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]",
                                course.level === 'beginner'
                                  ? "bg-green-50 text-green-600 ring-1 ring-green-100"
                                  : course.level === 'intermediate'
                                    ? "bg-orange-50 text-orange-600 ring-1 ring-orange-100"
                                    : "bg-red-50 text-red-600 ring-1 ring-red-100"
                              )}
                            >
                              {course.level}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {course.duration_hours || 0}h
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {totalLessons}
                          </td>

                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            ৳{course.price || 0}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              <span
                                className={cn(
                                  "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]",
                                  course.is_active
                                    ? "bg-green-50 text-green-600 ring-1 ring-green-100"
                                    : "bg-gray-50 text-gray-500 ring-1 ring-gray-100"
                                )}
                              >
                                {course.is_active ? 'Active' : 'Inactive'}
                              </span>

                              {course.is_featured && (
                                <span className="rounded-full bg-yellow-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-yellow-600 ring-1 ring-yellow-100">
                                  Featured
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleCourseActive(course)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm ring-1 ring-orange-100 transition-all duration-300 hover:bg-green-50 hover:text-green-600"
                                title={course.is_active ? 'Deactivate' : 'Activate'}
                              >
                                {course.is_active ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                              </button>

                              <button
                                onClick={() => openCourseEdit(course)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm ring-1 ring-orange-100 transition-all duration-300 hover:bg-orange-50 hover:text-orange-700"
                                title="Edit"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteCourse(course.id, course.title)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm ring-1 ring-red-100 transition-all duration-300 hover:bg-red-100 hover:text-red-700"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[2.25rem] border border-dashed border-orange-200 bg-gradient-to-br from-white to-orange-50/40 py-20 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-orange-600 shadow-sm ring-1 ring-orange-100">
              <GraduationCap className="h-7 w-7" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">No courses found</h4>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              Try adjusting your search or filters to reveal matching courses.
            </p>
          </div>
        )
      })()}

    {/* Books Pagination */}
    {inventoryType === 'books' && inventoryTotal > inventoryPerPage && (
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={() => setInventoryCurrentPage((p) => Math.max(1, p - 1))}
          disabled={inventoryCurrentPage === 1}
          className="inline-flex items-center justify-center rounded-full border border-orange-100 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-orange-200 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <div className="rounded-full border border-orange-100 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 shadow-sm">
          Page {inventoryCurrentPage} of {Math.ceil(inventoryTotal / inventoryPerPage)}
        </div>

        <button
          onClick={() => setInventoryCurrentPage((p) => p + 1)}
          disabled={inventoryCurrentPage >= Math.ceil(inventoryTotal / inventoryPerPage)}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(249,115,22,0.30)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    )}
  </motion.div>
  )}
  {/* END: INVENTORY MANAGEMENT */}
  {/* START: MANAGE CATEGORIES */}
  {activeTab === 'categories' && (
  <motion.div
    key="categories"
    initial={{ opacity: 0, y: 18, scale: 0.99 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -18, scale: 0.99 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="space-y-6"
  >
    {/* Premium Section Header */}
    <section className="overflow-hidden rounded-[2.5rem] border border-orange-100 bg-gradient-to-br from-white via-orange-50/40 to-white shadow-[0_28px_90px_rgba(249,115,22,0.08)]">
      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Taxonomy Studio
            </div>

            <h3 className="font-serif text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
              Manage Categories
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              Organize your books and courses with a refined premium category system designed
              for clarity, elegance, and effortless management.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              {categories.length} Book Categories
            </div>
            <div className="rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              {courseCategories.length} Course Categories
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="grid grid-cols-1 gap-6">
      {/* Books Categories */}
      <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
        <div className="border-b border-orange-100/70 bg-gradient-to-r from-orange-50/80 to-white px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 ring-1 ring-orange-200">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Book Categories</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Curate and control your book taxonomy.
                </p>
              </div>
            </div>

            <div className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 ring-1 ring-orange-100">
              {categories.length} total
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleAddCategory} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New book category name..."
                className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(249,115,22,0.30)]"
            >
              Add Category
            </button>
          </form>

          <div className="mt-6">
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-gradient-to-r from-white to-orange-50/40 px-4 py-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(249,115,22,0.10)]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {cat}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 shadow-sm ring-1 ring-red-100 transition-all duration-300 hover:bg-red-50 hover:text-red-700"
                      title="Delete category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-orange-200 bg-gradient-to-br from-white to-orange-50/40 py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-50 text-orange-600 shadow-sm ring-1 ring-orange-100">
                  <Tag className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">No book categories yet</h4>
                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  Add your first book category to start organizing the catalog beautifully.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
        <div className="border-b border-orange-100/70 bg-gradient-to-r from-orange-50/80 to-white px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 ring-1 ring-orange-200">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Course Categories</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Structure your academy offerings with elegance.
                </p>
              </div>
            </div>

            <div className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 ring-1 ring-orange-100">
              {courseCategories.length} total
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleAddCourseCategory} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                value={newCourseCategory}
                onChange={(e) => setNewCourseCategory(e.target.value)}
                placeholder="New course category name..."
                className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(249,115,22,0.30)]"
            >
              Add Category
            </button>
          </form>

          <div className="mt-6">
            {courseCategories.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                {courseCategories.map((cat, idx) => (
                  <div
                    key={cat.id ?? `cat-${idx}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-gradient-to-r from-white to-orange-50/40 px-4 py-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(249,115,22,0.10)]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {cat.name}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteCourseCategory(cat.id!)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 shadow-sm ring-1 ring-red-100 transition-all duration-300 hover:bg-red-50 hover:text-red-700"
                      title="Delete category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-orange-200 bg-gradient-to-br from-white to-orange-50/40 py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-50 text-orange-600 shadow-sm ring-1 ring-orange-100">
                  <Tag className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">No course categories yet</h4>
                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  Add your first course category to build a premium academy structure.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  </motion.div>
)}
{/* ====================================================== END: MANAGE CATEGORIES ====================================================== */}
            {/* ====================================================== START: ADD NEW BOOK ====================================================== */}
{activeTab === 'add-book' && (
  <motion.div
    key="add-book"
    initial={{ opacity: 0, y: 18, scale: 0.99 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -18, scale: 0.99 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="space-y-6"
  >
    {/* Premium Header */}
    <section className="overflow-hidden rounded-[2.5rem] border border-orange-100 bg-gradient-to-br from-white via-orange-50/40 to-white shadow-[0_28px_90px_rgba(249,115,22,0.08)]">
      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Publishing Studio
            </div>

            <h3 className="font-serif text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
              Add New Book
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              Create and publish a premium book entry with elegant media handling,
              refined input structure, and a polished editorial workflow.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              {categories.length} Categories
            </div>
            <div className="rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              Premium Book Entry
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="grid gap-6">
      {/* Main Form */}
      <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
        <div className="border-b border-orange-100/70 bg-gradient-to-r from-orange-50/80 to-white px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900">Book Details</h4>
              <p className="mt-1 text-sm text-gray-500">
                Fill in the essentials with a refined publishing layout.
              </p>
            </div>

            <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-orange-600 shadow-sm ring-1 ring-orange-100">
              Draft-ready workflow
            </div>
          </div>
        </div>

        <form className="space-y-8 p-6 lg:p-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                Title *
              </label>
              <input
                type="text"
                value={newBook.title || ''}
                onChange={(e) => setNewBook((prev) => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Enter book title"
                className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                Author *
              </label>
              <input
                type="text"
                value={newBook.author || ''}
                onChange={(e) => setNewBook((prev) => ({ ...prev, author: e.target.value }))}
                required
                placeholder="Enter author name"
                className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
              Description *
            </label>
            <textarea
              rows={5}
              value={newBook.description || ''}
              onChange={(e) => setNewBook((prev) => ({ ...prev, description: e.target.value }))}
              required
              placeholder="Write a compelling book description..."
              className="w-full resize-none rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
            />
          </div>

          {/* Category + Price */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                Category
              </label>
              <select
                value={newBook.category || ''}
                onChange={(e) => setNewBook((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                Price (৳)
              </label>
              <input
                type="number"
                step="0.01"
                value={newBook.price || ''}
                onChange={(e) =>
                  setNewBook((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
                }
                placeholder="0.00"
                className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {/* Stock & Stock Threshold */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                Stock
              </label>
              <input
                type="number"
                value={newBook.stock || ''}
                onChange={(e) =>
                  setNewBook((prev) => ({ ...prev, stock: parseInt(e.target.value) || 0 }))
                }
                placeholder="Enter stock quantity"
                className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                Stock Threshold
              </label>
              <input
                type="number"
                value={newBook.stockThreshold || ''}
                onChange={(e) =>
                  setNewBook((prev) => ({ ...prev, stockThreshold: parseInt(e.target.value) || 10 }))
                }
                placeholder="10"
                className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {/* Pages, Format & Language */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                Pages
              </label>
              <input
                type="number"
                value={newBook.pages || ''}
                onChange={(e) =>
                  setNewBook((prev) => ({ ...prev, pages: parseInt(e.target.value) || 0 }))
                }
                placeholder="Enter number of pages"
                className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                Format
              </label>
              <select
                value={newBook.format || 'Paperback'}
                onChange={(e) => setNewBook((prev) => ({ ...prev, format: e.target.value }))}
                className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
              >
                <option value="Paperback">Paperback</option>
                <option value="Hardcover">Hardcover</option>
                <option value="ebook">eBook</option>
                <option value="Audiobook">Audiobook</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                Language
              </label>
              <select
                value={newBook.language || 'English'}
                onChange={(e) => setNewBook((prev) => ({ ...prev, language: e.target.value }))}
                className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
              >
                <option value="English">English</option>
                <option value="Bengali">Bengali</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Hindi">Hindi</option>
                <option value="Arabic">Arabic</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50/70 to-white p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
                Publishing Note
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Keep title, author, price, and media clean and consistent for a premium catalog experience.
              </p>
            </div>
          </div>

          {/* Cover Image */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
              Cover Image
            </label>

            <div className="space-y-4">
<label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/40 px-4 py-4 transition-all hover:border-orange-300 hover:bg-orange-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    if (!file.type.startsWith('image/')) {
                      toast.error('Please select an image file')
                      return
                    }

                    setNewBookCoverFile(file)
                    setNewBook((prev) => ({ ...prev, coverUrl: '' }))

                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setNewBookCoverPreview(reader.result as string)
                    }
                    reader.readAsDataURL(file)

                    const uploadedUrl = await uploadImageFile(file)
                    if (uploadedUrl) {
                      setNewBookCoverUrl(uploadedUrl)
                    }
                  }}
                  className="hidden"
                />
                  <ImageIcon className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-semibold text-gray-700">Upload Cover Image</span>
                  {newBookCoverUrl && (
                    <span className="ml-2 text-[10px] text-green-600 font-mono truncate max-w-[200px]">
                      {newBookCoverUrl}
                    </span>
                  )}
                </label>
              </div>

              {newBookCoverUrl && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-600 mb-1">
                    Cover Image URL
                  </p>
                  <p className="text-xs font-mono text-green-700 break-all">{newBookCoverUrl}</p>
                </div>
              )}

              <div>
                <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
                  <div className="bg-orange-50/70 px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-600">
                      Live Preview
                    </p>
                  </div>

                  <div className="p-4">
                    {newBookCoverPreview || newBook.coverUrl ? (
                      <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-orange-100 bg-orange-50">
                        <img
                          src={newBookCoverPreview || newBook.coverUrl}
                          alt="Cover Preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src =
                              'https://via.placeholder.com/400x500?text=Book+Cover'
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[4/5] items-center justify-center rounded-2xl border border-dashed border-orange-200 bg-gradient-to-br from-white to-orange-50/40">
                        <div className="text-center">
                          <BookOpen className="mx-auto h-8 w-8 text-orange-300" />
                          <p className="mt-3 text-sm font-semibold text-gray-500">
                            No cover selected
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
            </div>
          </div>

          {/* Preview Images */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
              Preview Images
            </label>

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/40 px-4 py-4 transition-all hover:border-orange-300 hover:bg-orange-50">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files || [])
                  const imageFiles = files.filter((f) => f.type.startsWith('image/'))

                  if (imageFiles.length === 0) {
                    toast.error('Please select image files')
                    return
                  }

                  setNewBookPreviewFiles((prev) => [...prev, ...imageFiles])

                  const uploadPromises = imageFiles.map(async (file) => {
                    const uploadedUrl = await uploadPreviewImageFile(file)
                    return uploadedUrl
                  })
                  const uploadedUrls = await Promise.all(uploadPromises)
                  setNewBookPreviewUrls(prev => [...prev, ...uploadedUrls.filter((url): url is string => Boolean(url))])

                  imageFiles.forEach((file) => {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setNewBookPreviewPreviews((prev) => [...prev, reader.result as string])
                    }
                    reader.readAsDataURL(file)
                  })
                }}
                className="hidden"
              />
              <ImageIcon className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-semibold text-gray-700">Upload Preview Images</span>
              {newBookPreviewUrls.length > 0 && (
                <span className="ml-2 text-[10px] text-green-600 font-mono">
                  {newBookPreviewUrls.length} uploaded
                </span>
              )}
            </label>

            {newBookPreviewUrls.length > 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-600 mb-1">
                  Preview Images URLs ({newBookPreviewUrls.length})
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {newBookPreviewUrls.map((url, i) => (
                    <p key={i} className="text-[10px] font-mono text-green-700 break-all">
                      {i + 1}. {url}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {newBookPreviewPreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {newBookPreviewPreviews.map((url, i) => (
                  <div
                    key={i}
                    className="group relative aspect-square overflow-hidden rounded-2xl border border-orange-100 bg-orange-50 shadow-sm"
                  >
                    <img src={url} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setNewBookPreviewPreviews((prev) => prev.filter((_, idx) => idx !== i))
                        setNewBookPreviewFiles((prev) => prev.filter((_, idx) => idx !== i))
                        setNewBookPreviewUrls((prev) => prev.filter((_, idx) => idx !== i))
                      }}
                      className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500 shadow-md ring-1 ring-red-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={(e) => handleAddBook(e, true)}
              disabled={loading || newBookCoverUploading || newBookPreviewUploading}
              className="inline-flex items-center justify-center rounded-2xl border border-orange-200 bg-white px-6 py-4 text-sm font-semibold text-orange-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save as Draft'}
            </button>

            <button
              type="button"
              onClick={(e) => handleAddBook(e, false)}
              disabled={loading || newBookCoverUploading || newBookPreviewUploading}
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(249,115,22,0.30)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </form>
      </section>
    </div>
  </motion.div>
)}
{/* ====================================================== END: ADD NEW BOOK ======================================================*/}
{/* ====================================================== START: ADD NEW COURSE ====================================================== */}
{activeTab === 'add-course' && (
  <motion.div
    key="add-course"
    initial={{ opacity: 0, y: 18, scale: 0.99 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -18, scale: 0.99 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="space-y-6 max-w-[1600px] mx-auto"
  >
    {/* Premium Header */}
    <section className="overflow-hidden rounded-[2.5rem] border border-orange-100 bg-gradient-to-br from-white via-orange-50/40 to-white shadow-[0_28px_90px_rgba(249,115,22,0.08)]">
      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Course Publishing Studio
            </div>

            <h3 className="font-serif text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
              Add New Course
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              Build a premium learning experience with elegant course setup,
              curriculum design, quizzes, and publishing control.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              {courseCategories.length} Categories
            </div>
            <div className="rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              Premium Course Workflow
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Step Indicator */}
    <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
      <div className="border-b border-orange-100/70 bg-gradient-to-r from-orange-50/80 to-white px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-gray-900">Course Build Progress</h4>
            <p className="mt-1 text-sm text-gray-500">
              A refined step-by-step publishing flow.
            </p>
          </div>

          <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-orange-600 shadow-sm ring-1 ring-orange-100">
            Step {['overview', 'curriculum', 'quizzes', 'review'].indexOf(courseStep) + 1} of 4
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {['overview', 'curriculum', 'quizzes', 'review'].map((step, i) => {
            const isActive = courseStep === step
            const isDone = ['overview', 'curriculum', 'quizzes', 'review'].indexOf(courseStep) > i

            return (
              <button
                key={step}
                onClick={() => setCourseStep(step as any)}
                className={cn(
                  "group flex items-center gap-4 rounded-[1.5rem] border px-4 py-4 text-left transition-all duration-300",
                  isActive
                    ? "border-orange-200 bg-gradient-to-br from-orange-600 to-orange-500 text-white shadow-[0_18px_45px_rgba(249,115,22,0.22)]"
                    : "border-orange-100 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50/60"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold transition-all",
                    isActive
                      ? "bg-white/15 text-white"
                      : isDone
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-50 text-orange-500"
                  )}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>

                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-sm font-bold capitalize",
                      isActive ? "text-white" : "text-gray-900"
                    )}
                  >
{step === 'quizzes' ? 'Final Assessment' : step}
                </p>
                <p
                  className={cn(
                    "mt-1 text-[11px] uppercase tracking-[0.2em]",
                    isActive ? "text-white/70" : "text-gray-400"
                  )}
                >
                  {step === 'overview' && 'Basic details'}
                  {step === 'curriculum' && 'Lessons & sections'}
                  {step === 'quizzes' && 'Assessment builder'}
                  {step === 'review' && 'Final publish'}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>

    {/* Main Layout */}
    <div className="grid gap-6">
      {/* LEFT: Wizard Content */}
      <div className="space-y-6">
        {/* Step 1: Overview */}
        {courseStep === 'overview' && (
          <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
            <div className="border-b border-orange-100/70 bg-gradient-to-r from-orange-50/80 to-white px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Course Overview</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Enter the essentials to define the course identity.
                  </p>
                </div>
                <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-orange-600 shadow-sm ring-1 ring-orange-100">
                  Required fields first
                </div>
              </div>
            </div>

            <div className="p-6 lg:p-8 space-y-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCourse.title}
                    onChange={(e) =>
                      setNewCourse((prev) => ({
                        ...prev,
                        title: e.target.value,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/^-|-$/g, ''),
                      }))
                    }
                    placeholder="Enter course title"
                    className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={newCourse.slug}
                    onChange={(e) => setNewCourse((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="course-url-slug"
                    className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                    Instructor *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCourse.instructor}
                    onChange={(e) => setNewCourse((prev) => ({ ...prev, instructor: e.target.value }))}
                    placeholder="Instructor name"
                    className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                    Category
                  </label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                  >
                    <option value="">Select a category</option>
                    {courseCategories.map((cat) => (
                      <option key={cat.id ?? cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                    Course Thumbnail
                  </label>

                  <div className="grid gap-4 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                      <div className="relative overflow-hidden rounded-[1.75rem] border border-orange-100 bg-gradient-to-br from-orange-50/70 to-white shadow-sm">
                         {newCourse.image ? (
                           <img
                             src={newCourse.image}
                             alt="Thumbnail"
                             className="h-56 w-full object-cover"
                             onError={(e) => {
                               console.log('Image load error for URL:', newCourse.image)
                               console.log('Current src:', e.currentTarget.src)
                             }}
                           />
                         ) : (
                          <div className="flex h-56 w-full flex-col items-center justify-center text-orange-300">
                            <ImageIcon className="mb-2 h-8 w-8" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.24em]">
                              No Image
                            </span>
                          </div>
                        )}

                        {newCourse.image && (
                          <button
                            type="button"
                            onClick={() => setNewCourse((prev) => ({ ...prev, image: '' }))}
                            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-md ring-1 ring-red-100 opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-8 space-y-3">
                      <input
                        type="text"
                        placeholder="Paste image URL..."
                        value={newCourse.image}
                        onChange={(e) => setNewCourse((prev) => ({ ...prev, image: e.target.value }))}
                        className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
                      />

                       <label
                         htmlFor="course-thumbnail-upload"
                         className={cn(
                           "flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/40 px-4 py-4 text-xs font-bold text-gray-700 transition-all hover:border-orange-300 hover:bg-orange-50",
                           courseFileUploading['course_image'] && 'opacity-50'
                         )}
                       >
                         {courseFileUploading['course_image'] ? (
                           <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                         ) : (
                           <>
                             <Upload className="h-3.5 w-3.5 text-orange-500" />
                             Upload Thumbnail
                           </>
                         )}
                       </label>
                       <input
                         id="course-thumbnail-upload"
                         type="file"
                         accept="image/*"
                         className="hidden"
                         onChange={(e) => {
                           console.log('File input changed, files:', e.target.files)
                           const file = e.target.files?.[0]
                           if (!file) {
                             console.log('No file selected')
                             return
                           }

                           console.log('Starting upload for file:', file.name, 'size:', file.size, 'type:', file.type)

                           // Start upload asynchronously
                           const uploadFile = async () => {
                             setCourseFileUploading((prev) => ({ ...prev, course_image: true }))
                             try {
                               const formData = new FormData()
                               formData.append('file', file)
                               formData.append('type', 'image')

                               const token = localStorage.getItem('auth_token')
                               console.log('Auth token exists:', !!token, 'Token length:', token?.length)
                               console.log('Making upload request to /api/staff/courses/upload-file')
                               const res = await fetch('/api/staff/courses/upload-file', {
                                 method: 'POST',
                                 headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
                                 body: formData,
                               })

                               console.log('Upload fetch response status:', res.status, res.statusText)

                               if (!res.ok) {
                                const errorText = await res.text()
                                console.log('Upload error response text:', errorText)
                                const errorData = await res.json().catch(() => ({ message: 'Upload failed' }))
                                throw new Error(errorData.message || `Upload failed with status ${res.status}`)
                               }

                               const data = await res.json()
                               console.log('Upload response data:', data)
                                if (data.url) {
                                  console.log('Setting newCourse.image to:', data.url)
                                  console.log('Data object:', data)

                                  setNewCourse((prev) => ({ ...prev, image: data.url }))
                                  toast.success('Thumbnail uploaded')
                                } else {
                                  toast.error('Upload failed - no URL returned')
                                }
                             } catch (error) {
                               console.error('Upload error:', error)
                               toast.error(error instanceof Error ? error.message : 'Thumbnail upload failed')
                             } finally {
                               setCourseFileUploading((prev) => ({ ...prev, course_image: false }))
                               // Reset the file input
                               e.target.value = ''
                             }
                           }

                           uploadFile()
                         }}
                       />
                    </div>
                  </div>
                </div>

                

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                  Description *
                </label>
                <textarea
                  required
                  rows={5}
                  value={newCourse.description}
                  onChange={(e) => setNewCourse((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Write a compelling course description..."
                  className="w-full resize-none rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                    Price (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newCourse.price}
                    onChange={(e) =>
                      setNewCourse((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
                    }
                    className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                    Duration (hours)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={Math.ceil(
                      (newCourse.sections || []).reduce(
                        (acc, s) =>
                          acc + (s.lessons || []).reduce((lAcc, l) => lAcc + (l.duration_minutes || 0), 0),
                        0
                      ) / 60
                    )}
                    className="w-full cursor-not-allowed rounded-2xl border border-orange-100 bg-orange-50/60 px-4 py-4 text-sm text-gray-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                    Total Lessons
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={(newCourse.sections || []).reduce((acc, s) => acc + (s.lessons || []).length, 0)}
                    className="w-full cursor-not-allowed rounded-2xl border border-orange-100 bg-orange-50/60 px-4 py-4 text-sm text-gray-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                    Level
                  </label>
                  <select
                    value={newCourse.level}
                    onChange={(e) => setNewCourse((prev) => ({ ...prev, level: e.target.value }))}
                    className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                  Promo Video
                </label>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="YouTube/Vimeo embed URL"
                    value={newCourse.preview_video}
                    onChange={(e) =>
                      setNewCourse((prev) => ({ ...prev, preview_video: e.target.value }))
                    }
                    className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
                  />

<div className="flex items-center gap-3">
                    <label
                      className={cn(
                        "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 py-4 text-xs font-bold text-white shadow-[0_14px_30px_rgba(249,115,22,0.22)] transition-all hover:-translate-y-0.5",
                        courseFileUploading['promo_video'] && 'opacity-50'
                      )}
                    >
                      {courseFileUploading['promo_video'] ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5" />
                          Upload Promo Video
                        </>
                      )}
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return

                          setCourseFileUploading((prev) => ({ ...prev, promo_video: true }))
                          try {
                            const formData = new FormData()
                            formData.append('file', file)
                            formData.append('type', 'video')

                            const token = localStorage.getItem('auth_token')
                            const res = await fetch('/api/staff/courses/upload-file', {
                              method: 'POST',
                              headers: { 
                                Authorization: `Bearer ${token}`,
                                'Accept': 'application/json',
                              },
                              body: formData,
                            })

                            const data = await res.json().catch(() => ({}))
                            
                            if (!res.ok) {
                              const url = prompt('Upload failed. Enter video URL instead:')
                              if (url) setNewCourse((prev) => ({ ...prev, preview_video: url }))
                              return
                            }

                            if (data.url) {
                              setNewCourse((prev) => ({ ...prev, preview_video: data.url }))
                              toast.success('Promo video saved')
                            }
                          } catch (err: any) {
                            const url = prompt('Upload error. Enter video URL instead:')
                            if (url) setNewCourse((prev) => ({ ...prev, preview_video: url }))
                          } finally {
                            setCourseFileUploading((prev) => ({ ...prev, promo_video: false }))
                          }
                        }}
                      />
                    </label>

                    {newCourse.preview_video && (
                      <button
                        type="button"
                        onClick={() => setNewCourse((prev) => ({ ...prev, preview_video: '' }))}
                        className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 shadow-sm ring-1 ring-orange-100 transition-all hover:bg-orange-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 rounded-[1.5rem] border border-orange-100 bg-gradient-to-r from-white to-orange-50/40 p-5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCourse.is_featured}
                    onChange={(e) =>
                      setNewCourse((prev) => ({ ...prev, is_featured: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">Featured Course</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCourse.is_active}
                    onChange={(e) =>
                      setNewCourse((prev) => ({ ...prev, is_active: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">Active</span>
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (
                      !newCourse.title.trim() ||
                      !newCourse.instructor.trim() ||
                      !newCourse.description.trim() ||
                      !newCourse.category.trim()
                    ) {
                      toast.error(
                        'Please fill in all required overview fields (Title, Instructor, Description, and Category) before proceeding'
                      )
                      return
                    }
                    setCourseStep('curriculum')
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(249,115,22,0.30)]"
                >
                  <span>Next: Curriculum</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Step 2: Curriculum Builder */}
        {courseStep === 'curriculum' && (
          <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
            <div className="border-b border-orange-100/70 bg-gradient-to-r from-orange-50/80 to-white px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Curriculum Builder</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Create sections, lessons, resources, and lesson quizzes.
                  </p>
                </div>

                <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-orange-600 shadow-sm ring-1 ring-orange-100">
                  {newCourse.sections.length} sections
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {newCourse.sections.map((section, sIdx) => (
                <div
                  key={sIdx}
                  className="overflow-hidden rounded-[1.75rem] border border-orange-100 bg-gradient-to-br from-white to-orange-50/30 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-orange-100/70 bg-white px-5 py-4">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => {
                        const updated = [...newCourse.sections]
                        updated[sIdx] = { ...updated[sIdx], title: e.target.value }
                        setNewCourse((prev) => ({ ...prev, sections: updated }))
                      }}
                      placeholder="Section Title (e.g., Module 1: Introduction)"
                      className="flex-1 bg-transparent text-base font-bold text-gray-900 outline-none placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = newCourse.sections.filter((_, i) => i !== sIdx)
                        setNewCourse((prev) => ({
                          ...prev,
                          sections: updated.length
                            ? updated
                            : [
                                {
                                  title: '',
                                  lessons: [
                                    {
                                      title: '',
                                      description: '',
                                      video_url: '',
                                      video_file: null,
                                      video_file_url: '',
                                      duration_minutes: 0,
                                      is_free_preview: false,
                                      resources: [],
                                      quizzes: [],
                                    },
                                  ],
                                },
                              ],
                        }))
                      }}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 transition-all hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="divide-y divide-orange-100/60">
                    {section.lessons.map((lesson, lIdx) => (
                      <div key={lIdx} className="p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                            {lIdx + 1}
                          </div>
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => {
                              const updated = [...newCourse.sections]
                              updated[sIdx].lessons[lIdx] = {
                                ...updated[sIdx].lessons[lIdx],
                                title: e.target.value,
                              }
                              setNewCourse((prev) => ({ ...prev, sections: updated }))
                            }}
                            placeholder="Lesson title"
                            className="flex-1 bg-transparent font-semibold text-gray-900 outline-none placeholder:text-gray-400"
                          />

                          <label className="flex cursor-pointer items-center gap-2 rounded-full bg-orange-50 px-3 py-2 text-xs font-semibold text-gray-600">
                            <input
                              type="checkbox"
                              checked={lesson.is_free_preview}
                              onChange={(e) => {
                                const updated = [...newCourse.sections]
                                updated[sIdx].lessons[lIdx] = {
                                  ...updated[sIdx].lessons[lIdx],
                                  is_free_preview: e.target.checked,
                                }
                                setNewCourse((prev) => ({ ...prev, sections: updated }))
                              }}
                              className="h-3.5 w-3.5 rounded border-gray-300 text-orange-600"
                            />
                            Free Preview
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...newCourse.sections]
                              updated[sIdx].lessons = updated[sIdx].lessons.filter((_, i) => i !== lIdx)
                              if (updated[sIdx].lessons.length === 0) {
                                updated[sIdx].lessons = [
                                  {
                                    title: '',
                                    description: '',
                                    video_url: '',
                                    video_file: null,
                                    video_file_url: '',
                                    duration_minutes: 0,
                                    is_free_preview: false,
                                    resources: [],
                                    quizzes: [],
                                  },
                                ]
                              }
                              setNewCourse((prev) => ({ ...prev, sections: updated }))
                            }}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="ml-11 space-y-4">
                          <textarea
                            rows={2}
                            value={lesson.description}
                            onChange={(e) => {
                              const updated = [...newCourse.sections]
                              updated[sIdx].lessons[lIdx] = {
                                ...updated[sIdx].lessons[lIdx],
                                description: e.target.value,
                              }
                              setNewCourse((prev) => ({ ...prev, sections: updated }))
                            }}
                            placeholder="Lesson description (optional)"
                            className="w-full resize-none rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                          />

                          <div className="flex flex-col gap-3 lg:flex-row">
                            <input
                              type="text"
                              value={lesson.video_url}
                              onChange={(e) => {
                                const updated = [...newCourse.sections]
                                updated[sIdx].lessons[lIdx] = {
                                  ...updated[sIdx].lessons[lIdx],
                                  video_url: e.target.value,
                                }
                                setNewCourse((prev) => ({ ...prev, sections: updated }))
                              }}
                              placeholder="Video URL (YouTube/Vimeo embed link)"
                              className="flex-1 rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                            />

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">
                                OR
                              </span>

                              <label
                                className={cn(
                                  "inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-3 text-xs font-bold text-white shadow-[0_12px_24px_rgba(249,115,22,0.20)] transition-all hover:-translate-y-0.5",
                                  courseFileUploading[`lesson_${sIdx}_${lIdx}`] && 'opacity-50'
                                )}
                              >
                                {courseFileUploading[`lesson_${sIdx}_${lIdx}`] ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                  <>
                                    <Upload className="h-3.5 w-3.5" />
                                    Upload Video
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="video/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return
                                    const key = `lesson_${sIdx}_${lIdx}`

                                    setCourseFileUploading((prev) => ({ ...prev, [key]: true }))
                                    try {
                                      const formData = new FormData()
                                      formData.append('file', file)
                                      formData.append('type', 'video')

                                      const token = localStorage.getItem('auth_token')
                                      const res = await fetch('/api/staff/courses/upload-file', {
                                        method: 'POST',
                                        headers: { 
                                          Authorization: `Bearer ${token}`,
                                          'Accept': 'application/json',
                                        },
                                        body: formData,
                                      })

const data = await res.json().catch(() => ({}))
                                       
                                       if (!res.ok || !data.url) {
                                         const url = prompt('Upload failed. Enter video URL instead:')
                                         if (url) {
                                           const updated = [...newCourse.sections]
                                           updated[sIdx].lessons[lIdx] = {
                                             ...updated[sIdx].lessons[lIdx],
                                             video_url: url,
                                           }
                                           setNewCourse((prev) => ({ ...prev, sections: updated }))
                                         }
                                       } else {
                                         const videoDuration = await getVideoDuration(file)
                                         const updated = [...newCourse.sections]
                                         updated[sIdx].lessons[lIdx] = {
                                           ...updated[sIdx].lessons[lIdx],
                                           video_file_url: data.url,
                                           video_file: file,
                                           duration_minutes: videoDuration > 0 ? videoDuration : updated[sIdx].lessons[lIdx].duration_minutes,
                                         }
                                        setNewCourse((prev) => ({ ...prev, sections: updated }))
                                        toast.success('Video uploaded')
                                      }
                                    } catch (err: any) {
                                      const url = prompt('Upload error. Enter video URL instead:')
                                      if (url) {
                                        const updated = [...newCourse.sections]
                                        updated[sIdx].lessons[lIdx] = {
                                          ...updated[sIdx].lessons[lIdx],
                                          video_url: url,
                                        }
                                        setNewCourse((prev) => ({ ...prev, sections: updated }))
                                      }
                                    } finally {
                                      setCourseFileUploading((prev) => ({ ...prev, [key]: false }))
                                    }
                                  }}
                                />
                              </label>
                            </div>

                            <input
                              type="number"
                              min="0"
                              value={lesson.duration_minutes || ''}
                              onChange={(e) => {
                                const updated = [...newCourse.sections]
                                updated[sIdx].lessons[lIdx] = {
                                  ...updated[sIdx].lessons[lIdx],
                                  duration_minutes: parseInt(e.target.value) || 0,
                                }
                                setNewCourse((prev) => ({ ...prev, sections: updated }))
                              }}
                              placeholder="Min"
                              className="w-24 rounded-2xl border border-orange-100 bg-white px-4 py-3 text-center text-sm outline-none transition-all placeholder:text-gray-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                            />
                          </div>

                          {lesson.video_file_url && (
                            <p className="flex items-center gap-2 text-xs font-medium text-green-600">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Video uploaded: {lesson.video_file_url.split('/').pop()}
                            </p>
                          )}

                          {/* Resources */}
                          <div className="rounded-[1.5rem] border border-orange-100 bg-white p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                                Lesson Resources
                              </span>

                              <label
                                className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-orange-50 px-3 py-2 text-xs font-bold text-orange-600 transition-all hover:bg-orange-100"
                              >
                                <Plus className="h-3 w-3" />
                                Add Resource
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return
                                    const key = `res_${sIdx}_${lIdx}`

                                    setCourseFileUploading((prev) => ({ ...prev, [key]: true }))
                                    try {
                                      const formData = new FormData()
                                      formData.append('file', file)
                                      formData.append('type', 'document')

                                      const token = localStorage.getItem('auth_token')
                                      const res = await fetch('/api/staff/courses/upload-file', {
                                        method: 'POST',
                                        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
                                        body: formData,
                                      })

                                      const data = await res.json()
                                      const updated = [...newCourse.sections]
                                      if (!updated[sIdx].lessons[lIdx].resources) updated[sIdx].lessons[lIdx].resources = []
                                      ;(updated[sIdx].lessons[lIdx].resources as any[]).push({
                                        title: file.name,
                                        file_path: data.path,
                                        file_type: 'document',
                                        file_size: file.size,
                                      })
                                      setNewCourse((prev) => ({ ...prev, sections: updated }))
                                      toast.success('Resource uploaded')
                                    } catch {
                                      toast.error('Resource upload failed')
                                    } finally {
                                      setCourseFileUploading((prev) => ({ ...prev, [key]: false }))
                                    }
                                  }}
                                />
                              </label>
                            </div>

                            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                              {((lesson.resources || []) as any[]).map((res: any, rIdx: number) => (
                                <div
                                  key={rIdx}
                                  className="group flex items-center gap-2 rounded-2xl border border-orange-100 bg-gradient-to-r from-white to-orange-50/40 px-3 py-3"
                                >
                                  <FileText className="h-4 w-4 text-orange-400" />
                                  <input
                                    type="text"
                                    value={res.title}
                                    onChange={(e) => {
                                      const updated = [...newCourse.sections]
                                      ;(updated[sIdx].lessons[lIdx].resources as any[])[rIdx].title = e.target.value
                                      setNewCourse((prev) => ({ ...prev, sections: updated }))
                                    }}
                                    className="flex-1 bg-transparent text-xs font-medium text-gray-700 outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...newCourse.sections] as any[]
                                      const lesson = updated[sIdx].lessons[lIdx]
                                      lesson.resources = lesson.resources?.filter((_: any, i: number) => i !== rIdx) || []
                                      setNewCourse((prev) => ({ ...prev, sections: updated } as any))
                                    }}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Lesson Quiz */}
                          <div className="rounded-[1.5rem] border border-orange-100 bg-white p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                                Lesson Quiz
                              </span>

                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...newCourse.sections] as any[]
                                  if (!updated[sIdx].lessons[lIdx].quizzes) updated[sIdx].lessons[lIdx].quizzes = []
                                  updated[sIdx].lessons[lIdx].quizzes.push({
                                    title: '',
                                    questions: [{ question: '', options: ['', '', '', ''], correct_answer: 0 }],
                                  })
                                  setNewCourse((prev) => ({ ...prev, sections: updated } as any))
                                }}
                                className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-2 text-xs font-bold text-orange-600 transition-all hover:bg-orange-100"
                              >
                                <Plus className="h-3 w-3" />
                                Add Quiz
                              </button>
                            </div>

                            <div className="mt-4 space-y-4">
                              {((lesson.quizzes || []) as any[]).map((quiz: any, qIdx: number) => (
                                <div
                                  key={qIdx}
                                  className="space-y-3 rounded-[1.5rem] border border-orange-100 bg-gradient-to-br from-orange-50/50 to-white p-4"
                                >
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={quiz.title}
                                      onChange={(e) => {
                                        const updated = [...newCourse.sections] as any[]
                                        updated[sIdx].lessons[lIdx].quizzes[qIdx].title = e.target.value
                                        setNewCourse((prev) => ({ ...prev, sections: updated } as any))
                                      }}
                                      placeholder="Quiz title"
                                      className="flex-1 rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...newCourse.sections] as any[]
                                        updated[sIdx].lessons[lIdx].quizzes = updated[sIdx].lessons[lIdx].quizzes.filter(
                                          (_: any, i: number) => i !== qIdx
                                        )
                                        setNewCourse((prev) => ({ ...prev, sections: updated } as any))
                                      }}
                                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>

                                  <div className="space-y-2">
                                    {quiz.questions.map((q: any, qqIdx: number) => (
                                      <div
                                        key={qqIdx}
                                        className="rounded-2xl border border-orange-100 bg-white p-3 space-y-3"
                                      >
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="text"
                                            value={q.question}
                                            onChange={(e) => {
                                              const updated = [...newCourse.sections] as any[]
                                              updated[sIdx].lessons[lIdx].quizzes[qIdx].questions[qqIdx].question = e.target.value
                                              setNewCourse((prev) => ({ ...prev, sections: updated } as any))
                                            }}
                                            placeholder="Question"
                                            className="flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updated = [...newCourse.sections] as any[]
                                              updated[sIdx].lessons[lIdx].quizzes[qIdx].questions = updated[sIdx].lessons[lIdx].quizzes[qIdx].questions.filter(
                                                (_: any, i: number) => i !== qqIdx
                                              )
                                              setNewCourse((prev) => ({ ...prev, sections: updated } as any))
                                            }}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-300 transition-all hover:bg-red-50 hover:text-red-600"
                                          >
                                            <X className="h-3 w-3" />
                                          </button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                          {q.options.map((opt: any, oIdx: number) => (
                                            <div key={oIdx} className="flex items-center gap-2">
                                              <input
                                                type="radio"
                                                name={`lq_${sIdx}_${lIdx}_${qIdx}_${qqIdx}`}
                                                checked={q.correct_answer === oIdx}
                                                onChange={() => {
                                                  const updated = [...newCourse.sections] as any[]
                                                  updated[sIdx].lessons[lIdx].quizzes[qIdx].questions[qqIdx].correct_answer = oIdx
                                                  setNewCourse((prev) => ({ ...prev, sections: updated } as any))
                                                }}
                                                className="h-4 w-4 text-orange-600"
                                              />
                                              <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => {
                                                  const updated = [...newCourse.sections] as any[]
                                                  const newOpts = [
                                                    ...updated[sIdx].lessons[lIdx].quizzes[qIdx].questions[qqIdx].options,
                                                  ]
                                                  newOpts[oIdx] = e.target.value
                                                  updated[sIdx].lessons[lIdx].quizzes[qIdx].questions[qqIdx].options = newOpts
                                                  setNewCourse((prev) => ({ ...prev, sections: updated } as any))
                                                }}
                                                placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                                className="flex-1 rounded-xl border border-orange-100 bg-orange-50/30 px-3 py-2 text-xs outline-none placeholder:text-gray-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...newCourse.sections] as any[]
                                        if (!updated[sIdx].lessons[lIdx].quizzes[qIdx].questions)
                                          updated[sIdx].lessons[lIdx].quizzes[qIdx].questions = []
                                        updated[sIdx].lessons[lIdx].quizzes[qIdx].questions.push({
                                          question: '',
                                          options: ['', '', '', ''],
                                          correct_answer: 0,
                                        })
                                        setNewCourse((prev) => ({ ...prev, sections: updated } as any))
                                      }}
                                      className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline"
                                    >
                                      <Plus className="h-3 w-3" />
                                      Add Question
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-orange-100/70 bg-white p-4">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...newCourse.sections]
                        updated[sIdx].lessons.push({
                          title: '',
                          description: '',
                          video_url: '',
                          video_file: null,
                          video_file_url: '',
                          duration_minutes: 0,
                          is_free_preview: false,
                          resources: [],
                          quizzes: [],
                        })
                        setNewCourse((prev) => ({ ...prev, sections: updated }))
                      }}
                      className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:underline"
                    >
                      <Plus className="h-4 w-4" />
                      Add Lesson
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setNewCourse((prev) => ({
                    ...prev,
                    sections: [
                      ...prev.sections,
                      {
                        title: '',
                        lessons: [
                          {
                            title: '',
                            description: '',
                            video_url: '',
                            video_file: null,
                            video_file_url: '',
                            duration_minutes: 0,
                            is_free_preview: false,
                            resources: [],
                            quizzes: [],
                          },
                        ],
                      },
                    ],
                  }))
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[1.75rem] border-2 border-dashed border-orange-200 bg-gradient-to-br from-white to-orange-50/40 px-4 py-5 text-sm font-bold text-gray-400 transition-all hover:border-orange-300 hover:text-orange-600"
              >
                <PlusCircle className="h-5 w-5" />
                Add New Section
              </button>

              <div className="flex justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCourseStep('overview')}
                  className="inline-flex items-center gap-2 rounded-2xl border border-orange-100 bg-white px-8 py-4 text-sm font-semibold text-gray-600 shadow-sm transition-all hover:bg-orange-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const hasEmptySection = newCourse.sections.some((s) => !s.title.trim())
                    if (hasEmptySection) {
                      toast.error('All sections must have a title before moving to quizzes')
                      return
                    }

                    const hasEmptyLesson = newCourse.sections.some((s) =>
                      s.lessons.some((l) => !l.title.trim())
                    )
                    if (hasEmptyLesson) {
                      toast.error('All lessons must have a title before moving to quizzes')
                      return
                    }

                    setCourseStep('quizzes')
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.22)] transition-all hover:-translate-y-0.5"
                >
                  Next: Final Assessment
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Step 3: Final Assessment */}
        {courseStep === 'quizzes' && (
          <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
            <div className="border-b border-orange-100/70 bg-gradient-to-r from-orange-50/80 to-white px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Final Assessment Builder</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Add course-level final assessment questions.
                  </p>
                </div>

                <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-orange-600 shadow-sm ring-1 ring-orange-100">
                  {newCourse.quizzes.length} quizzes
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {newCourse.quizzes.map((quiz, qIdx) => (
                <div
                  key={qIdx}
                  className="overflow-hidden rounded-[1.75rem] border border-orange-100 bg-gradient-to-br from-orange-50/40 to-white shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-orange-100/70 bg-white px-5 py-4">
                    <input
                      type="text"
                      value={quiz.title}
                      onChange={(e) => {
                        const updated = [...newCourse.quizzes]
                        updated[qIdx] = { ...updated[qIdx], title: e.target.value }
                        setNewCourse((prev) => ({ ...prev, quizzes: updated }))
                      }}
                      placeholder="Quiz Title (e.g., Mid-Course Quiz)"
                      className="flex-1 bg-transparent text-base font-bold text-gray-900 outline-none placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = newCourse.quizzes.filter((_, i) => i !== qIdx)
                        setNewCourse((prev) => ({
                          ...prev,
                          quizzes: updated.length
                            ? updated
                            : [{ title: '', questions: [{ question: '', options: ['', '', '', ''], correct_answer: 0 }] }],
                        }))
                      }}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 transition-all hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-5">
                    {quiz.questions.map((q, qQIdx) => (
                      <div key={qQIdx} className="space-y-3 rounded-2xl border border-orange-100 bg-white p-4">
                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-600">
                            Q{qQIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={q.question}
                            onChange={(e) => {
                              const updated = [...newCourse.quizzes]
                              updated[qIdx].questions[qQIdx] = {
                                ...updated[qIdx].questions[qQIdx],
                                question: e.target.value,
                              }
                              setNewCourse((prev) => ({ ...prev, quizzes: updated }))
                            }}
                            placeholder="Question text"
                            className="flex-1 rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...newCourse.quizzes]
                              updated[qIdx].questions = updated[qIdx].questions.filter((_, i) => i !== qQIdx)
                              if (updated[qIdx].questions.length === 0) {
                                updated[qIdx].questions = [
                                  { question: '', options: ['', '', '', ''], correct_answer: 0 },
                                ]
                              }
                              setNewCourse((prev) => ({ ...prev, quizzes: updated }))
                            }}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="ml-10 space-y-2">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`q_${qIdx}_${qQIdx}`}
                                checked={q.correct_answer === oIdx}
                                onChange={() => {
                                  const updated = [...newCourse.quizzes]
                                  updated[qIdx].questions[qQIdx] = {
                                    ...updated[qIdx].questions[qQIdx],
                                    correct_answer: oIdx,
                                  }
                                  setNewCourse((prev) => ({ ...prev, quizzes: updated }))
                                }}
                                className="h-4 w-4 text-orange-600"
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...newCourse.quizzes]
                                  const newOpts = [...updated[qIdx].questions[qQIdx].options]
                                  newOpts[oIdx] = e.target.value
                                  updated[qIdx].questions[qQIdx] = {
                                    ...updated[qIdx].questions[qQIdx],
                                    options: newOpts,
                                  }
                                  setNewCourse((prev) => ({ ...prev, quizzes: updated }))
                                }}
                                placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                className={cn(
                                  "flex-1 rounded-xl border px-3 py-2.5 text-sm outline-none transition-all",
                                  q.correct_answer === oIdx
                                    ? "border-orange-300 bg-orange-50/70"
                                    : "border-orange-100 bg-white"
                                )}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...newCourse.quizzes]
                        updated[qIdx].questions.push({
                          question: '',
                          options: ['', '', '', ''],
                          correct_answer: 0,
                        })
                        setNewCourse((prev) => ({ ...prev, quizzes: updated }))
                      }}
                      className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:underline"
                    >
                      <Plus className="h-4 w-4" />
                      Add Question
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setNewCourse((prev) => ({
                    ...prev,
                    quizzes: [
                      ...prev.quizzes,
                      { title: '', questions: [{ question: '', options: ['', '', '', ''], correct_answer: 0 }] },
                    ],
                  }))
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[1.75rem] border-2 border-dashed border-orange-200 bg-gradient-to-br from-white to-orange-50/40 px-4 py-5 text-sm font-bold text-gray-400 transition-all hover:border-orange-300 hover:text-orange-600"
              >
                <PlusCircle className="h-5 w-5" />
                Add New Quiz
              </button>

              <div className="flex justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCourseStep('curriculum')}
                  className="inline-flex items-center gap-2 rounded-2xl border border-orange-100 bg-white px-8 py-4 text-sm font-semibold text-gray-600 shadow-sm transition-all hover:bg-orange-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => setCourseStep('review')}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.22)] transition-all hover:-translate-y-0.5"
                >
                  Review & Publish
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Step 4: Review & Submit */}
        {courseStep === 'review' && (
          <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.05)] max-w-5xl mx-auto">
  
  {/* HEADER */}
  <div className="border-b border-orange-100/70 bg-gradient-to-r from-orange-50/80 to-white px-6 py-5">
    <h4 className="text-lg font-bold text-gray-900">Review Course</h4>
    <p className="mt-1 text-sm text-gray-500">
      Final check before publishing your premium course.
    </p>
  </div>

  <div className="p-6 lg:p-8 space-y-6">

    {/* ================= STATS LOGIC ================= */}
    {(() => {
      const validSections = newCourse.sections.filter(s => s.title.trim());

      const stats = {
        sections: validSections.length,

        lessons: validSections.reduce(
          (acc, s) => acc + s.lessons.filter(l => l.title.trim()).length,
          0
        ),

        videos: validSections.reduce(
          (acc, s) =>
            acc +
            s.lessons.filter(
              l => l.title.trim() && (l.video_url || l.video_file_url)
            ).length,
          0
        ),

        lessonQuizzes: validSections.reduce(
          (acc, s) =>
            acc +
            s.lessons.reduce(
              (a, l) =>
                a + (l.quizzes || []).filter(q => q.title?.trim()).length,
              0
            ),
          0
        ),

        assessments: newCourse.quizzes.filter(q => q.title.trim()).length,

        files: validSections.reduce(
          (acc, s) =>
            acc +
            s.lessons.reduce((a, l) => a + (l.resources || []).length, 0),
          0
        ),

        duration: validSections.reduce(
          (acc, s) =>
            acc +
            s.lessons.reduce((a, l) => a + (l.duration_minutes || 0), 0),
          0
        ),
      };

      const totalQuizzes = stats.lessonQuizzes + stats.assessments;

      const formattedDuration =
        stats.duration > 0
          ? `${Math.floor(stats.duration / 60)}h ${stats.duration % 60}m`
          : "0m";

      const statItems = [
        { label: "Sections", value: stats.sections },
        { label: "Lessons", value: stats.lessons },
        { label: "Videos", value: stats.videos },
        { label: "Quizzes", value: totalQuizzes },
        { label: "Files", value: stats.files },
        { label: "Duration", value: formattedDuration },
      ];

      return (
        <>
          {/* ================= STATS GRID ================= */}
          <div className="space-y-4">

            {/* PRIMARY STATS */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Sections", value: stats.sections },
                { label: "Lessons", value: stats.lessons },
                { label: "Duration", value: formattedDuration },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-orange-500 text-white p-5 text-center shadow-md"
                >
                  <p className="text-3xl font-bold">{item.value}</p>
                  <p className="text-xs uppercase tracking-wider opacity-80">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* SECONDARY STATS */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Videos", value: stats.videos },
                { label: "Quizzes", value: totalQuizzes },
                { label: "Files", value: stats.files },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-orange-100 bg-orange-50 p-4 text-center"
                >
                  <p className="text-xl font-semibold text-orange-600">
                    {item.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* ================= INFO CARDS ================= */}
          <div className="grid gap-4 md:grid-cols-3">

            {/* COURSE */}
            <div className="rounded-[1.5rem] border border-orange-100 bg-gradient-to-br from-white to-orange-50/40 p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                Course
              </p>
              <p className="mt-2 text-lg font-bold text-gray-900">
                {newCourse.title || 'Untitled'}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                by {newCourse.instructor || 'Unknown'}
              </p>
              <p className="mt-2 text-lg font-bold text-green-600">
                ৳{newCourse.price || 0}
              </p>
            </div>

            {/* CURRICULUM */}
            <div className="rounded-[1.5rem] border border-orange-100 bg-gradient-to-br from-white to-orange-50/40 p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                Curriculum
              </p>
              <p className="mt-2 text-lg font-bold text-gray-900">
                {stats.sections} Sections
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {stats.lessons} Lessons
              </p>
            </div>

            {/* FINAL ASSESSMENT */}
            <div className="rounded-[1.5rem] border border-orange-100 bg-gradient-to-br from-white to-orange-50/40 p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                Final Assessment
              </p>
              <p className="mt-2 text-lg font-bold text-gray-900">
                {stats.assessments} Assessments
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {newCourse.quizzes.reduce(
                  (acc, q) =>
                    acc + q.questions.filter(qq => qq.question.trim()).length,
                  0
                )} Questions
              </p>
            </div>
          </div>
        </>
      );
    })()}

    {/* ================= DESCRIPTION ================= */}
    <div className="rounded-[1.75rem] border border-orange-100 bg-gradient-to-r from-orange-50/60 to-white p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
        Publishing Snapshot
      </p>
      <p className="mt-2 text-sm leading-6 text-gray-600">
        {newCourse.description || 'No description added yet.'}
      </p>
    </div>

    {/* ================= ACTIONS ================= */}
    <div className="flex justify-between gap-3 pt-2 border-t border-orange-100/70">
      <button
        type="button"
        onClick={() => setCourseStep('quizzes')}
        className="inline-flex items-center gap-2 rounded-2xl border border-orange-100 bg-white px-8 py-4 text-sm font-semibold text-gray-600 shadow-sm transition-all hover:bg-orange-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <button
        type="button"
        onClick={handleCreateCourse}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.22)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Publishing...' : 'Publish Course'}
        {!loading && <ChevronRight className="h-4 w-4" />}
      </button>
    </div>

  </div>
</section>
        )}
      </div>


    </div>
  </motion.div>
)}
{/* ====================================================== END: ADD NEW COURSE ====================================================== */}
 {/* ====================================================== START: Q&A MANAGEMENT ====================================================== */}
{activeTab === 'qanda' && (
  <motion.div
    key="qanda"
    initial={{ opacity: 0, y: 18, scale: 0.99 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -18, scale: 0.99 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="space-y-6"
  >
    {/* Premium Header */}
    <section className="overflow-hidden rounded-[2.5rem] border border-orange-100 bg-gradient-to-br from-white via-orange-50/40 to-white shadow-[0_28px_90px_rgba(249,115,22,0.08)]">
      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Question Desk
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <h3 className="font-serif text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
                Q&A Management
              </h3>
              <p className="pb-1 text-sm text-gray-500">
                {qandaTotal} questions
              </p>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              A refined premium workspace for reviewing questions, answering inquiries,
              and managing support conversations across books and courses.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center rounded-full border border-orange-100 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setQandaType('books')}
                className={cn(
                  "rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                  qandaType === 'books'
                    ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_10px_25px_rgba(249,115,22,0.25)]"
                    : "text-gray-500 hover:bg-orange-50 hover:text-gray-900"
                )}
              >
                Books
              </button>
              <button
                type="button"
                onClick={() => setQandaType('courses')}
                className={cn(
                  "rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                  qandaType === 'courses'
                    ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_10px_25px_rgba(249,115,22,0.25)]"
                    : "text-gray-500 hover:bg-orange-50 hover:text-gray-900"
                )}
              >
                Courses
              </button>
            </div>

            <div className="inline-flex items-center rounded-full border border-orange-100 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setQandaFilter('all')}
                className={cn(
                  "rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                  qandaFilter === 'all'
                    ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_10px_25px_rgba(249,115,22,0.25)]"
                    : "text-gray-500 hover:bg-orange-50 hover:text-gray-900"
                )}
              >
                All ({qandaCounts.all})
              </button>
              <button
                type="button"
                onClick={() => setQandaFilter('unanswered')}
                className={cn(
                  "rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                  qandaFilter === 'unanswered'
                    ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_10px_25px_rgba(249,115,22,0.25)]"
                    : "text-gray-500 hover:bg-orange-50 hover:text-gray-900"
                )}
              >
                Unanswered ({qandaCounts.unanswered})
              </button>
              <button
                type="button"
                onClick={() => setQandaFilter('answered')}
                className={cn(
                  "rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                  qandaFilter === 'answered'
                    ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_10px_25px_rgba(249,115,22,0.25)]"
                    : "text-gray-500 hover:bg-orange-50 hover:text-gray-900"
                )}
              >
                Answered ({qandaCounts.answered})
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Content */}
    {(() => {
      const filtered =
        qandaFilter === 'all'
          ? qandaItems
          : qandaFilter === 'answered'
            ? qandaItems.filter((q) => q.answer)
            : qandaItems.filter((q) => !q.answer)

      return filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(249,115,22,0.12)]"
            >
              <div className="h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

              <div className="p-5 lg:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                  {/* Cover */}
                  <a
                    href={qandaType === 'books' ? `/book/${item.book_id}` : `/courses/${item.course_id}`}
                    className="shrink-0"
                  >
                    <div className="relative overflow-hidden rounded-[1.5rem] border border-orange-100 bg-orange-50 shadow-sm transition-all duration-300 group-hover:shadow-md">
                      {qandaType === 'books' ? (
                        <img
                          src={item.book_cover_url || `https://picsum.photos/seed/book${item.book_id}/400/600`}
                          alt={item.book_title || 'Book cover'}
                          className="h-28 w-20 object-cover sm:h-32 sm:w-24"
                        />
                      ) : (
                        <img
                          src={item.course_image || `https://picsum.photos/seed/course${item.course_id}/400/300`}
                          alt={item.course_title || 'Course cover'}
                          className="h-24 w-36 object-cover sm:h-28 sm:w-44"
                        />
                      )}

                      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600 shadow-sm">
                        {qandaType === 'books' ? 'Book' : 'Course'}
                      </div>
                    </div>
                  </a>

                  {/* Question / Answer */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-sm font-bold text-orange-600 ring-1 ring-orange-200">
                          Q
                        </div>

                        <div className="min-w-0">
                          <p className="text-lg font-bold tracking-tight text-gray-900">
                            {item.question}
                          </p>

                          <p className="mt-2 text-xs text-gray-400">
                            Asked by {item.user_name} • {new Date(item.created_at).toLocaleDateString()} •{' '}
                            {qandaType === 'books'
                              ? `Book: ${item.book_title}`
                              : `Course: ${item.course_title}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {item.answer ? (
                          <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-green-600 ring-1 ring-green-100">
                            Answered
                          </span>
                        ) : (
                          <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-600 ring-1 ring-orange-100">
                            Pending Reply
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Answer */}
                    <div className="mt-5">
                      {item.answer ? (
                        <div className="rounded-[1.5rem] border border-green-100 bg-green-50/40 p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-green-100 text-sm font-bold text-green-600 ring-1 ring-green-200">
                              A
                            </div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-green-600">
                              Staff Response
                            </p>
                          </div>
                          <p className="pl-11 text-sm leading-7 text-gray-700 italic">
                            {item.answer}
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-[1.5rem] border border-orange-100 bg-gradient-to-br from-orange-50/40 to-white p-4">
                          {replyingToId === item.id ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-100 text-sm font-bold text-orange-600 ring-1 ring-orange-200">
                                  A
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
                                  Write an official reply
                                </p>
                              </div>

                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write your answer..."
                                rows={4}
                                className="w-full resize-none rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
                              />

                              <div className="flex flex-col gap-3 sm:flex-row">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (!replyText.trim()) return

                                    try {
                                      const endpoint =
                                        qandaType === 'books'
                                          ? `/staff/questions/${item.id}/answer`
                                          : `/staff/course-questions/${item.id}/answer`

                                      await api.put(endpoint, {
                                        answer: replyText,
                                      })

                                      toast.success('Answer posted')
                                      setReplyingToId(null)
                                      setReplyText('')
                                      loadQanda()
                                    } catch {
                                      toast.error('Failed to post answer')
                                    }
                                  }}
                                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(249,115,22,0.30)]"
                                >
                                  Post Answer
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setReplyingToId(null)
                                    setReplyText('')
                                  }}
                                  className="inline-flex items-center justify-center rounded-2xl border border-orange-100 bg-white px-5 py-3 text-sm font-semibold text-gray-600 shadow-sm transition-all duration-300 hover:bg-orange-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setReplyingToId(item.id)}
                              className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 transition-colors hover:text-orange-700 hover:underline"
                            >
                              Reply to this question
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[2.25rem] border border-dashed border-orange-200 bg-gradient-to-br from-white to-orange-50/40 py-20 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-orange-600 shadow-sm ring-1 ring-orange-100">
            <MessageSquare className="h-7 w-7" />
          </div>
          <h4 className="text-xl font-bold text-gray-900">
            {qandaFilter === 'answered'
              ? 'No answered questions yet'
              : qandaFilter === 'unanswered'
                ? 'No unanswered questions'
                : 'No questions yet'}
          </h4>
          <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
            Questions and answers will appear here in a refined premium layout once users start interacting.
          </p>
        </div>
      )
    })()}

    {/* Pagination */}
    {qandaTotal > qandaPerPage && (
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => setQandaCurrentPage((p) => Math.max(1, p - 1))}
          disabled={qandaCurrentPage === 1}
          className="inline-flex items-center justify-center rounded-full border border-orange-100 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-orange-200 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <div className="rounded-full border border-orange-100 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 shadow-sm">
          Page {qandaCurrentPage} of {Math.ceil(qandaTotal / qandaPerPage)}
        </div>

        <button
          type="button"
          onClick={() => setQandaCurrentPage((p) => p + 1)}
          disabled={qandaCurrentPage >= Math.ceil(qandaTotal / qandaPerPage)}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(249,115,22,0.30)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    )}
  </motion.div>
)}
{/* ====================================================== END: Q&A MANAGEMENT ====================================================== */}
           {/* ====================================================== START: ORDER MANAGEMENT ====================================================== */}
{activeTab === 'orders' && (
  <motion.div
    key="orders"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-8"
  >
    {/* ── Header ── */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">
                Order Management
              </h3>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mt-0.5">
                {ordersTotal} Total Orders
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Pills ── */}
      <div className="flex items-center gap-1.5 bg-gradient-to-b from-white to-amber-50/60 border border-amber-100 rounded-2xl p-1.5 shadow-sm shadow-amber-100/50">
        <button
          onClick={() => setOrderFilter('all')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200",
            orderFilter === 'all'
              ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-orange-400/30 scale-105"
              : "text-amber-700/60 hover:text-amber-700 hover:bg-amber-50"
          )}
        >
          All ({staffOrders.length})
        </button>
        {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(status => {
          const cfg = {
            pending:    { active: 'from-amber-400 to-orange-500 shadow-orange-400/30',   label: 'text-amber-600' },
            processing: { active: 'from-violet-500 to-purple-600 shadow-purple-400/30',  label: 'text-purple-600' },
            shipped:    { active: 'from-sky-400 to-blue-500 shadow-blue-400/30',         label: 'text-blue-600' },
            delivered:  { active: 'from-emerald-400 to-green-500 shadow-green-400/30',   label: 'text-green-600' },
            cancelled:  { active: 'from-rose-400 to-red-500 shadow-red-400/30',          label: 'text-red-500' },
          }[status];
          return (
            <button
              key={status}
              onClick={() => setOrderFilter(status)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold tracking-wide capitalize transition-all duration-200",
                orderFilter === status
                  ? `bg-gradient-to-br ${cfg.active} text-white shadow-md scale-105`
                  : `${cfg.label} opacity-60 hover:opacity-100 hover:bg-amber-50`
              )}
            >
              {status} ({staffOrders.filter(o => o.status === status).length})
            </button>
          );
        })}
      </div>
    </div>

    {/* ── Search ── */}
    {orderSearch && (
      <div className="relative group">
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300" />
        <div className="relative flex items-center">
          <Search className="absolute left-5 w-5 h-5 text-amber-400" />
          <input
            type="text"
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            placeholder="Search by order ID, customer name or email…"
            className="w-full pl-14 pr-6 py-4 bg-white border border-amber-100 rounded-2xl text-sm text-gray-700 placeholder:text-amber-300 focus:border-amber-300 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none shadow-sm shadow-amber-50"
          />
        </div>
      </div>
    )}

    {/* ── Order Cards ── */}
    {filteredStaffOrders.length > 0 ? (
      <div className="space-y-5">
        {filteredStaffOrders.map((order, orderIdx) => {
          const statusCfg = {
            delivered:  { pill: 'bg-emerald-50 text-emerald-600 border-emerald-100',  dot: 'bg-emerald-400', glow: 'shadow-emerald-100' },
            shipped:    { pill: 'bg-sky-50 text-sky-600 border-sky-100',              dot: 'bg-sky-400',     glow: 'shadow-sky-100' },
            processing: { pill: 'bg-violet-50 text-violet-600 border-violet-100',     dot: 'bg-violet-400',  glow: 'shadow-violet-100' },
            pending:    { pill: 'bg-amber-50 text-amber-600 border-amber-100',        dot: 'bg-amber-400',   glow: 'shadow-amber-100' },
            cancelled:  { pill: 'bg-rose-50 text-rose-500 border-rose-100',           dot: 'bg-rose-400',    glow: 'shadow-rose-100' },
          }[order.status] ?? { pill: 'bg-gray-50 text-gray-500 border-gray-100', dot: 'bg-gray-400', glow: '' };

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: orderIdx * 0.04, duration: 0.35 }}
              className="relative group"
            >
              {/* Subtle ambient glow on hover */}
              <div className="absolute -inset-0.5 rounded-[28px] bg-gradient-to-br from-amber-200 via-orange-100 to-amber-50 opacity-0 group-hover:opacity-60 blur-sm transition-opacity duration-500" />

              <div className="relative bg-white border border-amber-50 rounded-3xl shadow-md shadow-amber-50/80 overflow-hidden">
                {/* Top accent bar */}
                <div className="h-0.5 w-full bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200" />

                <div className="p-7">
                  {/* ── Row 1: ID + Status + Amount ── */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-lg font-bold text-gray-900 tracking-tight">
                          {order.orderNumber || order.id}
                        </span>
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border",
                          statusCfg.pill
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", statusCfg.dot)} />
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-amber-700/50 font-medium">
                        {order.shippingAddress?.fullName || 'N/A'}
                        <span className="mx-1.5 text-amber-300">·</span>
                        {order.shippingAddress?.email || 'N/A'}
                        <span className="mx-1.5 text-amber-300">·</span>
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-400 mb-0.5">Total</p>
                      <p className="text-2xl font-serif font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                        ৳{order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* ── Items ── */}
                  <div className="mb-5">
                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-3">
                      Order Items
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 bg-gradient-to-b from-amber-50/60 to-orange-50/30 border border-amber-100/80 rounded-2xl px-4 py-3 shadow-sm"
                        >
                          {/* Book/Course Cover */}
                          <div className={`rounded-lg overflow-hidden bg-amber-100/50 shadow-sm flex-shrink-0 ${
                            (item as any).type === 'course' ? 'w-20 h-12' : 'w-12 h-20'
                          }`}>
                            {item.coverUrl ? (
                              <img src={item.coverUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-amber-300">
                                {(item as any).type === 'course' 
                                  ? <GraduationCap className="w-5 h-5" />
                                  : <BookOpen className="w-5 h-5" />
                                }
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-gray-900 leading-tight">{item.title}</p>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide ${
                                (item as any).type === 'course' 
                                  ? 'bg-purple-100 text-purple-700' 
                                  : 'bg-amber-100 text-amber-700'
                              }`}>
                                {(item as any).type === 'course' ? 'Course' : 'Book'}
                              </span>
                            </div>
                            <p className="text-[11px] text-amber-600/70 font-medium mt-0.5">
                              Qty {item.quantity} <span className="text-amber-300 mx-0.5">×</span> ৳{item.price}
                            </p>
                            {(item as any).type === 'book' && (item as any).bookId && (
                              <div className="mt-2 relative">
                                {order.status === 'processing' ? (
                                  <input
                                    type="text"
                                    placeholder="ISBN"
                                    defaultValue={(item as any).isbn || ''}
                                    onBlur={async (e) => {
                                      const newIsbn = e.target.value;
                                      if (newIsbn === (item as any).isbn) return;
                                      try {
                                        await api.put(`/staff/orders/${order.id}`, {
                                          items: [{ item_id: (item as any).itemId, isbn: newIsbn }]
                                        });
                                        setStaffOrders(prev => prev.map(o => {
                                          if (o.id !== order.id) return o;
                                          return {
                                            ...o,
                                            items: o.items.map((i, iIdx) =>
                                              iIdx === idx ? { ...i, isbn: newIsbn } : i
                                            )
                                          };
                                        }));
                                        toast.success('ISBN saved');
                                      } catch (err: any) {
                                        toast.error(err.message || 'Failed to save ISBN');
                                      }
                                    }}
                                    className="w-36 px-3 py-1.5 text-[11px] font-mono bg-white border border-amber-200 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 outline-none placeholder:text-amber-300 text-gray-700 shadow-sm transition-all"
                                  />
                                ) : (
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-lg">
                                    <span className="text-[9px] text-amber-400 font-semibold uppercase">ISBN:</span>
                                    <span className="text-[11px] font-mono text-gray-700">{(item as any).isbn || '-'}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Shipping Address ── */}
                  {order.shippingAddress && (
                    <div className="mb-5 flex items-start gap-3 p-4 bg-gradient-to-br from-amber-50/80 to-orange-50/40 border border-amber-100 rounded-2xl">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm shadow-orange-300/30 mt-0.5">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.18em] mb-1">
                          Shipping Address
                        </p>
                        <p className="text-sm text-gray-700 font-medium leading-relaxed">
                          {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.zipCode}
                        </p>
                        <p className="text-xs text-amber-600/70 font-semibold mt-0.5">
                          {order.shippingAddress.phone}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ── Tracking ── */}
                  {order.trackingNumber ? (
                    <div className="mb-5 flex items-center justify-between p-4 bg-gradient-to-r from-sky-50 to-blue-50/60 border border-sky-100 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-sm shadow-blue-300/30">
                          <Truck className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-sky-500 uppercase tracking-[0.18em] mb-0.5">
                            Tracking Number
                          </p>
                          <p className="text-sm font-mono font-bold text-sky-700 tracking-wider">
                            {order.trackingNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-100 rounded-xl">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wide">Active</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-5 flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/70 border-dashed rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center shadow-sm shadow-orange-200/50">
                          <Truck className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.18em] mb-0.5">
                            Tracking Number
                          </p>
                          <p className="text-xs text-amber-600/60 font-medium">Not yet generated</p>
                        </div>
                      </div>
                      {order.status === 'processing' && !order.trackingNumber && (
                        <button
                          onClick={async () => {
                            try {
                              const res = await api.post<any>(`/staff/orders/${order.id}/generate-tracking`);
                              setStaffOrders(prev => prev.map(o =>
                                o.id === order.id ? { ...o, trackingNumber: res.tracking_number } : o
                              ));
                              toast.success('Tracking number generated');
                            } catch (err: any) {
                              toast.error(err.message || 'Failed to generate tracking number');
                            }
                          }}
                          className="relative group/btn overflow-hidden px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md shadow-orange-400/30 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-orange-400/40"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 transition-all duration-300 group-hover/btn:from-amber-500 group-hover/btn:via-orange-600 group-hover/btn:to-amber-600" />
                          <span className="relative flex items-center gap-1.5">
                            <span>Generate</span>
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* ── Status Selector ── */}
                  <div className="flex items-center gap-4 pt-4 border-t border-amber-50">
                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.18em]">
                      Update Status
                    </p>
                    <div className="relative">
                      <select
                        value={order.status}
                         disabled={['delivered', 'cancelled'].includes(order.status)}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          const statusOrder = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
                          const currentIndex = statusOrder.indexOf(order.status);
                          const newIndex = statusOrder.indexOf(newStatus);
                          
                          if (newIndex > currentIndex) {
                            if (newStatus !== 'cancelled') {
                              const hasBookItems = order.items.some((item: any) => item.type === 'book');
                              const hasUnfilledIsbn = order.items.some((item: any) => item.type === 'book' && !item.isbn);
                              if (newStatus === 'shipped' && hasBookItems && hasUnfilledIsbn) {
                                toast.error('Please enter ISBN for all book items first');
                                return;
                              }
                              if (newStatus === 'shipped' && !order.trackingNumber) {
                                toast.error('Please generate tracking number first');
                                return;
                              }
                            }
                          } else {
                            toast.error('Cannot revert to previous status');
                            return;
                          }
                          try {
                            await api.put(`/staff/orders/${order.id}`, { status: newStatus });
                            setStaffOrders(prev => prev.map(o =>
                              o.id === order.id ? { ...o, status: newStatus } : o
                            ));
                            toast.success(`Order marked as ${newStatus}`);
                          } catch (err: any) {
                            toast.error(err?.error || err?.message || 'Failed to update order status');
                          }
                        }}
                        className={`appearance-none pl-4 pr-10 py-2.5 bg-gradient-to-b from-white to-amber-50/50 border border-amber-200 rounded-xl text-sm font-bold focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15 transition-all outline-none shadow-sm cursor-pointer ${
                           ['delivered', 'cancelled'].includes(order.status) ? 'opacity-60 cursor-not-allowed' : ''
                        }`}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="processing">⚙️ Processing</option>
                        <option value="shipped">🚚 Shipped</option>
                        <option value="delivered">✅ Delivered</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    ) : (
      /* ── Empty State ── */
      <div className="flex flex-col items-center justify-center py-28 rounded-3xl border border-dashed border-amber-200 bg-gradient-to-b from-amber-50/60 to-orange-50/30">
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 opacity-10 blur-xl" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200 flex items-center justify-center shadow-inner">
            <Package className="w-9 h-9 text-amber-400" />
          </div>
        </div>
        <p className="text-lg font-serif font-bold text-amber-700/60">No orders found</p>
        <p className="text-xs text-amber-400 font-medium mt-1 tracking-wide">Try adjusting your filters or search query</p>
      </div>
    )}

    {/* ── Pagination ── */}
    {ordersTotal > ordersPerPage && (
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={() => setOrderCurrentPage(p => Math.max(1, p - 1))}
          disabled={orderCurrentPage === 1}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-amber-100 rounded-xl text-sm font-bold text-amber-700 shadow-sm hover:border-amber-300 hover:shadow-md hover:shadow-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-b from-amber-50 to-orange-50/50 border border-amber-100 rounded-xl">
          <span className="text-xs font-bold text-amber-600">Page</span>
          <span className="text-sm font-black text-orange-600">{orderCurrentPage}</span>
          <span className="text-xs font-bold text-amber-400">of</span>
          <span className="text-sm font-black text-orange-600">{Math.ceil(ordersTotal / ordersPerPage)}</span>
        </div>

        <button
          onClick={() => setOrderCurrentPage(p => p + 1)}
          disabled={orderCurrentPage >= Math.ceil(ordersTotal / ordersPerPage)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl text-sm font-bold text-white shadow-md shadow-orange-400/30 hover:from-amber-500 hover:to-orange-600 hover:shadow-lg hover:shadow-orange-400/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    )}
  </motion.div>
)}
{/* ====================================================== END: ORDER MANAGEMENT ====================================================== */}
            {/* ====================================================== START: MANAGE GALLERY ====================================================== */}
{activeTab === 'gallery' && (
  <motion.div
    key="gallery"
    initial={{ opacity: 0, y: 18, scale: 0.99 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -18, scale: 0.99 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="space-y-6"
  >
    {/* Premium Header */}
    <section className="overflow-hidden rounded-[2.5rem] border border-orange-100 bg-gradient-to-br from-white via-orange-50/40 to-white shadow-[0_28px_90px_rgba(249,115,22,0.08)]">
      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Visual Asset Studio
            </div>

            <h3 className="font-serif text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
              Manage Gallery
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              Curate, organize, and showcase your visual collection with an elegant premium
              workflow designed for beautiful media management.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              Visual Collection
            </div>
            <div className="rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              Premium Media Control
            </div>
          </div>
        </div>
      </div>
</section>

        <aside className="overflow-hidden rounded-[2rem] border border-orange-100 bg-gradient-to-br from-white to-orange-50/40 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
          <div className="border-b border-orange-100/70 bg-white px-6 py-5">
            <h4 className="text-lg font-bold text-gray-900">Quick Access</h4>
            <p className="mt-1 text-sm text-gray-500">
              Open the gallery manager to upload, arrange, and refine your collection.
            </p>
          </div>

          <div className="p-6">
            <div className="rounded-[1.75rem] border border-orange-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-100 text-orange-600 ring-1 ring-orange-200">
                <Images className="h-7 w-7" />
              </div>

              <h5 className="text-xl font-bold text-gray-900">
                Open Gallery Manager
              </h5>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Manage your gallery photos, add new images, and organize your collection
                in a premium visual workspace.
              </p>

              <button
                onClick={() => (window.location.href = '/staff/gallery')}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(249,115,22,0.30)]"
              >
                <Images className="h-5 w-5" />
                Open Gallery Manager
              </button>
            </div>

            <div className="mt-5 rounded-[1.75rem] border border-orange-100 bg-white p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
                Premium Tips
              </p>
              <ul className="mt-3 space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                  Keep images consistent and high resolution
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                  Arrange visuals to match your brand story
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                  Use premium cover images for stronger presentation
                </li>
              </ul>
            </div>
          </div>
        </aside>
    </motion.div>
  )}
{/* ====================================================== END: MANAGE GALLERY ====================================================== */}
{/* ====================================================== START: MANAGE PROMO CODES ====================================================== */}
{activeTab === 'promo-codes' && (
  <motion.div
    key="promo-codes"
    initial={{ opacity: 0, y: 18, scale: 0.99 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -18, scale: 0.99 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="space-y-6"
  >
    <div className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Promo Codes</h2>
        <button
          onClick={() => setPromoEditing({ id: null } as any)}
          className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
        >
          + Add New Code
        </button>
      </div>

      {promoCodesLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : promoCodes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No promo codes yet. Create one!</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-orange-100">
                <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-400">Code</th>
                <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-400">Discount</th>
                <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-400">Usage</th>
                <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-400">Per User</th>
                <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-400">Valid</th>
                <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((code: any) => (
                <React.Fragment key={code.id}>
                  <tr className="border-b border-orange-50 hover:bg-orange-50/50">
                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-900">{code.code}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-orange-600">
                        {code.discount_type === 'percentage' ? `${code.discount_value}%` : `৳${code.discount_value}`}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => setPromoExpanded(promoExpanded === code.id ? null : code.id)}
                        className="text-gray-600 hover:text-orange-600 underline text-sm"
                      >
                        {code.usage_count} / {code.usage_limit || '∞'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{code.per_user_limit}x</td>
                    <td className="py-3 px-4 text-gray-600">
                      {code.valid_from && code.valid_until 
                        ? `${new Date(code.valid_from).toLocaleDateString()} - ${new Date(code.valid_until).toLocaleDateString()}`
                        : 'No expiry'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${code.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {code.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setPromoEditing(code)}
                          className="text-orange-500 hover:text-orange-700 text-sm font-bold"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={async () => {
                            try {
                              await api.put(`/staff/promo-codes/${code.id}/toggle`);
                              loadPromoCodes();
                            } catch (err) {
                              toast.error('Failed to toggle status');
                            }
                          }}
                          className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                          {code.is_active ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {promoExpanded === code.id && code.user_usages && code.user_usages.length > 0 && (
                    <tr key={`${code.id}-users`} className="bg-orange-50/30">
                      <td colSpan={7} className="py-3 px-4">
                        <div className="text-xs font-bold text-gray-500 uppercase mb-2">Users who used this code:</div>
                        <div className="flex flex-wrap gap-2">
                          {code.user_usages.map((usage: any) => (
                            <div key={usage.id} className="flex items-center gap-2 bg-white border border-orange-100 rounded-lg px-3 py-2">
                              <div>
                                <div className="text-sm font-bold text-gray-900">{usage.user_name}</div>
                                <div className="text-xs text-gray-500">{usage.user_email}</div>
                              </div>
                              <button 
                                onClick={() => handleResetUserUsage(code.id, usage.user_id, usage.user_name)}
                                disabled={promoResettingUser?.codeId === code.id && promoResettingUser?.userId === usage.user_id}
                                className="text-xs text-orange-500 hover:text-orange-700 font-bold disabled:opacity-50"
                              >
                                Reset
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </motion.div>
)}
{/* ====================================================== END: MANAGE PROMO CODES ====================================================== */}

            {/* ====================================================== START: EDIT ABOUT PAGE ====================================================== */}
{activeTab === 'about' && (
  <motion.div
    key="about"
    initial={{ opacity: 0, y: 18, scale: 0.99 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -18, scale: 0.99 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="space-y-6"
  >
    {/* Premium Header */}
    <section className="overflow-hidden rounded-[2.5rem] border border-orange-100 bg-gradient-to-br from-white via-orange-50/40 to-white shadow-[0_28px_90px_rgba(249,115,22,0.08)]">
      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Brand Narrative Studio
            </div>

            <h3 className="font-serif text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
              Edit About Page
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              Shape your story, mission, values, and contact identity through a refined
              editorial workspace designed for premium brand storytelling.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              Brand Story
            </div>
            <div className="rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              Contact Identity
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="grid gap-6">
      {/* Main Form */}
      <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
        <div className="border-b border-orange-100/70 bg-gradient-to-r from-orange-50/80 to-white px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900">About Page Content</h4>
              <p className="mt-1 text-sm text-gray-500">
                Write your story with clarity, elegance, and brand consistency.
              </p>
            </div>

            <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-orange-600 shadow-sm ring-1 ring-orange-100">
              Live content editor
            </div>
          </div>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setAboutSaving(true)
            try {
              await api.post('/about', aboutForm)
              toast.success('About page updated successfully')
            } catch {
              toast.error('Failed to update about page')
            } finally {
              setAboutSaving(false)
            }
          }}
          className="space-y-8 p-6 lg:p-8"
        >
          {/* Page Title */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
              Page Title
            </label>
            <input
              type="text"
              value={aboutForm.title}
              onChange={(e) => setAboutForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
              placeholder="Enter page title..."
            />
          </div>

          {/* Hero Description */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
              Hero Description
            </label>
            <textarea
              rows={4}
              value={aboutForm.hero_description}
              onChange={(e) =>
                setAboutForm((prev) => ({ ...prev, hero_description: e.target.value }))
              }
              className="w-full resize-none rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
              placeholder="Write a premium hero description..."
            />
          </div>

          {/* Story + Mission + Values */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                Our Story
              </label>
              <textarea
                rows={7}
                value={aboutForm.our_story}
                onChange={(e) => setAboutForm((prev) => ({ ...prev, our_story: e.target.value }))}
                className="w-full resize-none rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
                placeholder="Tell your brand story in detail..."
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                  Our Mission
                </label>
                <textarea
                  rows={7}
                  value={aboutForm.our_mission}
                  onChange={(e) =>
                    setAboutForm((prev) => ({ ...prev, our_mission: e.target.value }))
                  }
                  className="w-full resize-none rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
                  placeholder="Define your mission..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                  Our Values
                </label>
                <textarea
                  rows={7}
                  value={aboutForm.our_values}
                  onChange={(e) =>
                    setAboutForm((prev) => ({ ...prev, our_values: e.target.value }))
                  }
                  className="w-full resize-none rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
                  placeholder="List your core values..."
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="rounded-[1.75rem] border border-orange-100 bg-gradient-to-br from-white to-orange-50/40 p-5">
            <div className="mb-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
                Contact Identity
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Keep your contact information polished and accessible for a premium brand experience.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={aboutForm.contact_email}
                  onChange={(e) =>
                    setAboutForm((prev) => ({ ...prev, contact_email: e.target.value }))
                  }
                  className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
                  placeholder="hello@brand.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={aboutForm.contact_phone}
                  onChange={(e) =>
                    setAboutForm((prev) => ({ ...prev, contact_phone: e.target.value }))
                  }
                  className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
                  placeholder="+880 1XXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">
                  Contact Address
                </label>
                <textarea
                  value={aboutForm.contact_address}
                  onChange={(e) =>
                    setAboutForm((prev) => ({ ...prev, contact_address: e.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
                  placeholder="Your business address"
                />
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={aboutSaving}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-4 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(249,115,22,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(249,115,22,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {aboutSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </section>
    </div>
  </motion.div>
)}
{/* ====================================================== END: EDIT ABOUT PAGE ====================================================== */}
          </AnimatePresence>
        </main>
      </div>
</div>

      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">{confirmModal.title}</h3>
            <p className="text-gray-500 mb-6">{confirmModal.message}</p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className={cn(
                  "px-6 py-3 rounded-2xl font-bold text-white transition-all",
                  confirmModal.type === 'danger' ? "bg-red-600 hover:bg-red-700" : "bg-orange-600 hover:bg-orange-700"
                )}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {restockModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Restock Book</h3>
            <p className="text-gray-500 mb-6">Enter the new stock quantity for this book.</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-600 mb-2 block">New Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={restockModal.stock}
                  onChange={(e) => setRestockModal(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-2xl font-bold text-gray-900 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20"
                />
              </div>
              <div className="flex gap-4 justify-end pt-2">
                <button
                  onClick={() => setRestockModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      setRestockSaving(true);
                      await api.put(`/staff/books/${restockModal.bookId}`, { stock: restockModal.stock });
                      toast.success('Stock updated successfully');
                      setRestockModal(prev => ({ ...prev, isOpen: false }));
                      loadOverviewBooks();
                    } catch {
                      toast.error('Failed to update stock');
                    } finally {
                      setRestockSaving(false);
                    }
                  }}
                  disabled={restockSaving}
                  className="px-6 py-3 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all disabled:opacity-50"
                >
                  {restockSaving ? 'Saving...' : 'Update Stock'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {editingInventoryBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif font-bold text-gray-900">Edit Book</h3>
              <button
                onClick={() => setEditingInventoryBook(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Author</label>
                  <input
                    type="text"
                    value={editForm.author}
                    onChange={(e) => setEditForm(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none appearance-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cover Image</label>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <input
                        type="url"
                        value={editForm.coverUrl}
                        onChange={(e) => {
                          setEditForm(prev => ({ ...prev, coverUrl: e.target.value }));
                          setCoverFile(null);
                          setCoverPreview('');
                        }}
                        placeholder="Or paste image URL..."
                        className="w-full p-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                      />
                      <label className="flex items-center justify-center gap-2 w-full p-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 transition-all">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverFileChange}
                          className="hidden"
                        />
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-bold text-gray-500">Upload Image</span>
                      </label>
                    </div>
                    {(coverPreview || editForm.coverUrl) && (
                      <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                        <img src={coverPreview || editForm.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.price}
                    onChange={(e) => setEditForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</label>
                  <input
                    type="number"
                    value={editForm.stock}
                    onChange={(e) => setEditForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Low Stock Alert Threshold</label>
                  <input
                    type="number"
                    value={editForm.stockThreshold || 10}
                    onChange={(e) => setEditForm(prev => ({ ...prev, stockThreshold: parseInt(e.target.value) || 10 }))}
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preview Images</label>
                <label className="flex items-center justify-center gap-2 w-full p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePreviewFilesChange}
                    className="hidden"
                  />
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-bold text-gray-500">Upload Preview Images</span>
                </label>
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    {previewUrls.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                        <img src={url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removePreviewImage(i)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                {editingInventoryBook?.status === 'draft' && (
                  <button
                    onClick={async () => {
                      try {
                        await api.put(`/staff/books/${editingInventoryBook.id}`, { status: 'approved' });
                        toast.success('Book approved successfully');
                        setDraftBooks(prev => prev.filter(b => b.id !== editingInventoryBook.id));
                        setAllBooks(prev => prev.map(b => 
                          b.id === editingInventoryBook.id ? { ...b, status: 'approved' } as StaffBook : b
                        ));
                        setEditingInventoryBook(null);
                        loadInventoryBooks();
                      } catch {
                        toast.error('Failed to approve book');
                      }
                    }}
                    className="px-6 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={handleInventoryEditSave}
                  disabled={editSaving}
                  className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all disabled:opacity-50"
                >
                  {editSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setEditingInventoryBook(null)}
                  className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {editingCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif font-bold text-gray-900">Edit Course</h3>
              <button
                onClick={() => setEditingCourse(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Step Tabs */}
            <div className="flex items-center gap-2 mb-8 bg-gray-50 rounded-2xl p-2">
              {[
                { key: 'overview', label: 'Overview', icon: Layers },
                { key: 'curriculum', label: 'Curriculum', icon: BookOpen },
                { key: 'quizzes', label: 'Final Assessment', icon: ClipboardList },
                { key: 'review', label: 'Review', icon: CheckCircle2 },
              ].map((step, i) => (
                <button
                  key={step.key}
                  onClick={() => setCourseEditStep(step.key as any)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                    courseEditStep === step.key
                      ? "bg-white shadow-sm text-orange-600"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <step.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
              ))}
            </div>

            {/* Step 1: Overview */}
            {courseEditStep === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Title *</label>
                    <input
                      type="text"
                      required
                      value={courseEditForm.title}
                      onChange={(e) => setCourseEditForm(prev => ({ ...prev, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }))}
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Slug</label>
                    <input
                      type="text"
                      value={courseEditForm.slug}
                      onChange={(e) => setCourseEditForm(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Instructor *</label>
                    <input
                      type="text"
                      required
                      value={courseEditForm.instructor}
                      onChange={(e) => setCourseEditForm(prev => ({ ...prev, instructor: e.target.value }))}
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category *</label>
                    <select
                      required
                      value={courseEditForm.category}
                      onChange={(e) => setCourseEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none appearance-none"
                    >
                      {courseCategories.map(cat => (
                        <option key={cat.id} value={cat.slug || cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Thumbnail Image</label>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <input
                        type="url"
                        value={courseEditForm.image}
                        onChange={(e) => {
                          setCourseEditForm(prev => ({ ...prev, image: e.target.value }));
                          setCourseCoverFile(null);
                          setCourseCoverPreview('');
                        }}
                        placeholder="Paste image URL..."
                        className="w-full p-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                      />
                      <label className="flex items-center justify-center gap-2 w-full p-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 transition-all">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCourseCoverFileChange}
                          className="hidden"
                        />
                        {courseCoverUploading ? (
                          <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-xs font-bold text-gray-500">{courseCoverUploading ? 'Uploading...' : 'Upload Image'}</span>
                      </label>
                    </div>
                    {(courseCoverPreview || courseEditForm.image) && (
                      <div className="w-32 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                        <img src={courseCoverPreview || courseEditForm.image} alt="Thumbnail" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={courseEditForm.description}
                    onChange={(e) => setCourseEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price (৳)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={courseEditForm.price}
                      onChange={(e) => setCourseEditForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Duration (hours)</label>
                    <div className="p-4 bg-gray-50 border border-transparent rounded-2xl text-sm text-gray-500">
                      {courseEditForm.duration_hours || 0}h
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lessons</label>
                    <div className="p-4 bg-gray-50 border border-transparent rounded-2xl text-sm text-gray-500">
                      {courseEditForm.lessons_count || 0}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Level</label>
                  <select
                    value={courseEditForm.level}
                    onChange={(e) => setCourseEditForm(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none appearance-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Promo Video</label>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <input
                        type="url"
                        value={courseEditForm.preview_video}
                        onChange={(e) => {
                          setCourseEditForm(prev => ({ ...prev, preview_video: e.target.value }));
                          setCourseVideoFile(null);
                          setCourseVideoPreview('');
                        }}
                        placeholder="YouTube, Vimeo, or direct video URL..."
                        className="w-full p-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                      />
                      <label className="flex items-center justify-center gap-2 w-full p-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 transition-all">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleCourseVideoFileChange}
                          className="hidden"
                        />
                        {courseVideoUploading ? (
                          <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-xs font-bold text-gray-500">{courseVideoUploading ? 'Uploading...' : 'Upload Video (max 500MB)'}</span>
                      </label>
                    </div>
                    {(courseVideoPreview || courseEditForm.preview_video) && (
                      <div className="w-32 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm bg-black">
                        {courseVideoPreview ? (
                          <video src={courseVideoPreview} className="w-full h-full object-cover" muted />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-[10px] truncate px-1">
                            {courseEditForm.preview_video.split('/').pop()?.split('?')[0] || 'video'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={courseEditForm.is_active}
                      onChange={(e) => setCourseEditForm(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm font-bold text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={courseEditForm.is_featured}
                      onChange={(e) => setCourseEditForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                      className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm font-bold text-gray-700">Featured</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      if (!courseEditForm.title.trim() || !courseEditForm.instructor.trim() || !courseEditForm.description.trim() || !courseEditForm.category.trim()) {
                        toast.error('Please fill in all required overview fields (Title, Instructor, Description, and Category)');
                        return;
                      }
                      setCourseEditStep('curriculum');
                    }}
                    className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all"
                  >
                    Next: Curriculum
                  </button>
                  <button
                    onClick={() => setEditingCourse(null)}
                    className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Curriculum Builder */}
            {courseEditStep === 'curriculum' && (
              <div className="space-y-6">
                {courseEditData.sections.map((section: any, sIdx: number) => (
                  <div key={sIdx} className="bg-gray-50 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => {
                          const updated = [...courseEditData.sections];
                          updated[sIdx].title = e.target.value;
                          setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                        }}
                        placeholder="Section title..."
                        className="flex-1 p-3 bg-white border border-transparent rounded-xl text-sm font-bold focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                      />
                      {courseEditData.sections.length > 1 && (
                        <button
                          onClick={() => {
                            const updated = courseEditData.sections.filter((_: any, i: number) => i !== sIdx);
                            if (updated.length === 0) updated.push({ title: '', lessons: [{ title: '', description: '', video_url: '', video_file: null, video_file_url: '', duration_minutes: 0, is_free_preview: false, resources: [], quizzes: [] }] });
                            setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                          }}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {(section.lessons || []).map((lesson: any, lIdx: number) => (
                      <div key={lIdx} className="bg-white rounded-xl p-4 space-y-3 ml-4 border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">
                            {lIdx + 1}
                          </div>
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => {
                              const updated = [...courseEditData.sections];
                              updated[sIdx].lessons[lIdx].title = e.target.value;
                              setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                            }}
                            placeholder="Lesson title..."
                            className="flex-1 p-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                          />
                          <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={lesson.is_free_preview}
                              onChange={(e) => {
                                const updated = [...courseEditData.sections];
                                updated[sIdx].lessons[lIdx].is_free_preview = e.target.checked;
                                setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                              }}
                              className="w-3 h-3 rounded border-gray-300 text-orange-600"
                            />
                            Free
                          </label>
                          {(section.lessons || []).length > 1 && (
                            <button
                              onClick={() => {
                                const updated = [...courseEditData.sections];
                                updated[sIdx].lessons = updated[sIdx].lessons.filter((_: any, i: number) => i !== lIdx);
                                if (updated[sIdx].lessons.length === 0) updated[sIdx].lessons.push({ title: '', description: '', video_url: '', video_file: null, video_file_url: '', duration_minutes: 0, is_free_preview: false, resources: [], quizzes: [] });
                                setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                              }}
                              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <textarea
                          rows={2}
                          value={lesson.description || ''}
                          onChange={(e) => {
                            const updated = [...courseEditData.sections];
                            updated[sIdx].lessons[lIdx].description = e.target.value;
                            setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                          }}
                          placeholder="Lesson description..."
                          className="w-full p-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none resize-none"
                        />

                        <div className="space-y-2">
                          <div className="flex gap-3">
                            <input
                              type="url"
                              value={lesson.video_url || ''}
                              onChange={(e) => {
                                const updated = [...courseEditData.sections];
                                updated[sIdx].lessons[lIdx].video_url = e.target.value;
                                setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                              }}
                              placeholder="YouTube or video URL..."
                              className="flex-1 p-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                            />
                            <input
                              type="number"
                              value={lesson.duration_minutes || ''}
                              onChange={(e) => {
                                const updated = [...courseEditData.sections];
                                updated[sIdx].lessons[lIdx].duration_minutes = parseInt(e.target.value) || 0;
                                setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                              }}
                              placeholder="Min"
                              className="w-20 p-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                            />
                          </div>
                          <label className="flex items-center justify-center gap-2 w-full p-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 transition-all">
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (!file.type.startsWith('video/')) { toast.error('Please select a video file'); return; }
                                if (file.size > 500 * 1024 * 1024) { toast.error('Video file is too large (max 500MB)'); return; }
                                const key = `edit-vid-${sIdx}-${lIdx}`;
                                setCourseEditFileUploading(prev => ({ ...prev, [key]: true }));
                                try {
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  formData.append('type', 'video');
                                  const token = localStorage.getItem('auth_token');
                                  const response = await fetch('/api/staff/courses/upload-file', {
                                    method: 'POST',
                                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
                                    body: formData,
                                  });
                                  if (!response.ok) throw new Error('Upload failed');
                                  const data = await response.json();
                                  const videoUrl = data.url || `http://localhost:8000/storage/${data.path}`;
                                  const videoDuration = await getVideoDuration(file);
                                  const updated = [...courseEditData.sections];
                                  updated[sIdx].lessons[lIdx].video_file_url = videoUrl;
                                  updated[sIdx].lessons[lIdx].video_url = videoUrl;
                                  updated[sIdx].lessons[lIdx].duration_minutes = videoDuration > 0 ? videoDuration : updated[sIdx].lessons[lIdx].duration_minutes;
                                  setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                                  toast.success('Video uploaded');
                                } catch (err: any) {
                                  toast.error(err.message || 'Failed to upload video');
                                } finally {
                                  setCourseEditFileUploading(prev => ({ ...prev, [key]: false }));
                                }
                              }}
                            />
                            {courseEditFileUploading[`edit-vid-${sIdx}-${lIdx}`] ? (
                              <div className="w-3 h-3 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Upload className="w-3 h-3 text-gray-400" />
                            )}
                            <span className="text-xs font-bold text-gray-500">{courseEditFileUploading[`edit-vid-${sIdx}-${lIdx}`] ? 'Uploading...' : 'Upload Video'}</span>
                          </label>
                        </div>

                        {/* Lesson Resources */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Resources</span>
                            <label className="flex items-center gap-1 text-xs text-orange-600 cursor-pointer font-bold hover:underline">
                              <input
                                type="file"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const key = `edit-res-${sIdx}-${lIdx}`;
                                  setCourseEditFileUploading(prev => ({ ...prev, [key]: true }));
                                  try {
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    formData.append('type', 'document');
                                    const token = localStorage.getItem('auth_token');
                                    const response = await fetch('/api/staff/courses/upload-file', {
                                      method: 'POST',
                                      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
                                      body: formData,
                                    });
                                    if (!response.ok) throw new Error('Upload failed');
                                    const data = await response.json();
                                    const filePath = data.url || `http://localhost:8000/storage/${data.path}`;
                                    const updated = [...courseEditData.sections];
                                    if (!updated[sIdx].lessons[lIdx].resources) updated[sIdx].lessons[lIdx].resources = [];
                                    updated[sIdx].lessons[lIdx].resources.push({
                                      title: file.name,
                                      file_path: filePath,
                                      file_type: 'document',
                                      file_size: file.size,
                                    });
                                    setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                                    toast.success('Resource uploaded');
                                  } catch (err: any) {
                                    toast.error(err.message || 'Failed to upload');
                                  } finally {
                                    setCourseEditFileUploading(prev => ({ ...prev, [key]: false }));
                                  }
                                }}
                              />
                              <Plus className="w-3 h-3" />
                              Add
                            </label>
                          </div>
                          {(lesson.resources || []).map((res: any, rIdx: number) => (
                            <div key={rIdx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <FileText className="w-3 h-3 text-gray-400 shrink-0" />
                              <input
                                type="text"
                                value={res.title}
                                onChange={(e) => {
                                  const updated = [...courseEditData.sections];
                                  updated[sIdx].lessons[lIdx].resources[rIdx].title = e.target.value;
                                  setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                                }}
                                className="flex-1 text-xs bg-transparent outline-none"
                              />
                              <button
                                onClick={() => {
                                  const updated = [...courseEditData.sections];
                                  updated[sIdx].lessons[lIdx].resources = updated[sIdx].lessons[lIdx].resources.filter((_: any, i: number) => i !== rIdx);
                                  setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                                }}
                                className="text-red-400 hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Lesson Quizzes */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lesson Quiz</span>
                            <button
                              onClick={() => {
                                const updated = [...courseEditData.sections];
                                if (!updated[sIdx].lessons[lIdx].quizzes) updated[sIdx].lessons[lIdx].quizzes = [];
                                updated[sIdx].lessons[lIdx].quizzes.push({
                                  title: '',
                                  questions: [{ question: '', options: ['', '', '', ''], correct_answer: 0 }],
                                });
                                setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                              }}
                              className="flex items-center gap-1 text-xs text-purple-600 cursor-pointer font-bold hover:underline"
                            >
                              <Plus className="w-3 h-3" />
                              Add Quiz
                            </button>
                          </div>
                          {(lesson.quizzes || []).map((quiz: any, qIdx: number) => (
                            <div key={qIdx} className="p-3 bg-purple-50 rounded-lg space-y-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={quiz.title}
                                  onChange={(e) => {
                                    const updated = [...courseEditData.sections];
                                    updated[sIdx].lessons[lIdx].quizzes[qIdx].title = e.target.value;
                                    setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                                  }}
                                  placeholder="Quiz title..."
                                  className="flex-1 p-2 bg-white border border-transparent rounded-lg text-sm focus:border-purple-500/20 focus:ring-2 focus:ring-purple-500/10 transition-all outline-none"
                                />
                                <button
                                  onClick={() => {
                                    const updated = [...courseEditData.sections];
                                    updated[sIdx].lessons[lIdx].quizzes = updated[sIdx].lessons[lIdx].quizzes.filter((_: any, i: number) => i !== qIdx);
                                    setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                                  }}
                                  className="p-1 text-red-400 hover:text-red-600 rounded transition-all"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              {(quiz.questions || []).map((qq: any, qqIdx: number) => (
                                <div key={qqIdx} className="p-2 bg-white rounded-lg space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-purple-400">Q{qqIdx + 1}.</span>
                                    <input
                                      type="text"
                                      value={qq.question}
                                      onChange={(e) => {
                                        const updated = [...courseEditData.sections];
                                        updated[sIdx].lessons[lIdx].quizzes[qIdx].questions[qqIdx].question = e.target.value;
                                        setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                                      }}
                                      placeholder="Question..."
                                      className="flex-1 text-xs bg-gray-50 border border-transparent rounded-lg p-1.5 focus:border-purple-500/20 focus:ring-2 focus:ring-purple-500/10 transition-all outline-none"
                                    />
                                    {(quiz.questions || []).length > 1 && (
                                      <button
                                        onClick={() => {
                                          const updated = [...courseEditData.sections];
                                          updated[sIdx].lessons[lIdx].quizzes[qIdx].questions = updated[sIdx].lessons[lIdx].quizzes[qIdx].questions.filter((_: any, i: number) => i !== qqIdx);
                                          setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                                        }}
                                        className="text-red-400 hover:text-red-600"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 ml-4">
                                    {(() => {
                                      const lqOpts = Array.isArray(qq.options) ? qq.options : JSON.parse(qq.options || '[]');
                                      return lqOpts.map((opt: string, oIdx: number) => (
                                        <div key={oIdx} className="flex items-center gap-1">
                                          <input
                                            type="radio"
                                            name={`edit-lq-${sIdx}-${lIdx}-${qIdx}-${qqIdx}`}
                                            checked={qq.correct_answer === oIdx}
                                            onChange={() => {
                                              const updated = [...courseEditData.sections];
                                              updated[sIdx].lessons[lIdx].quizzes[qIdx].questions[qqIdx].correct_answer = oIdx;
                                              setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                                            }}
                                            className="w-3 h-3 accent-green-600"
                                          />
                                          <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => {
                                              const updated = [...courseEditData.sections];
                                              updated[sIdx].lessons[lIdx].quizzes[qIdx].questions[qqIdx].options[oIdx] = e.target.value;
                                              setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                                            }}
                                            placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                            className="flex-1 text-xs bg-gray-50 border border-transparent rounded p-1 focus:border-purple-500/20 focus:ring-2 focus:ring-purple-500/10 transition-all outline-none"
                                          />
                                        </div>
                                      ));
                                    })()}
                                  </div>
                                </div>
                              ))}
                              <button
                                onClick={() => {
                                  const updated = [...courseEditData.sections];
                                  updated[sIdx].lessons[lIdx].quizzes[qIdx].questions.push({ question: '', options: ['', '', '', ''], correct_answer: 0 });
                                  setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                                }}
                                className="text-xs text-purple-600 font-bold hover:underline"
                              >
                                + Add Question
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        const updated = [...courseEditData.sections];
                        updated[sIdx].lessons.push({ title: '', description: '', video_url: '', video_file: null, video_file_url: '', duration_minutes: 0, is_free_preview: false, resources: [], quizzes: [] });
                        setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                      }}
                      className="flex items-center gap-2 text-sm text-orange-600 font-bold hover:underline ml-4"
                    >
                      <Plus className="w-4 h-4" />
                      Add Lesson
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => {
                    const updated = [...courseEditData.sections];
                    updated.push({ title: '', lessons: [{ title: '', description: '', video_url: '', video_file: null, video_file_url: '', duration_minutes: 0, is_free_preview: false, resources: [], quizzes: [] }] });
                    setCourseEditData((prev: any) => ({ ...prev, sections: updated }));
                  }}
                  className="w-full p-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-500 hover:border-orange-300 hover:text-orange-600 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Section
                </button>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setCourseEditStep('overview')}
                    className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      const hasEmptySection = courseEditData.sections.some((s: any) => !s.title.trim());
                      if (hasEmptySection) {
                        toast.error('All sections must have a title before moving to quizzes');
                        return;
                      }
                      const hasEmptyLesson = courseEditData.sections.some((s: any) =>
                        s.lessons.some((l: any) => !l.title.trim())
                      );
                      if (hasEmptyLesson) {
                        toast.error('All lessons must have a title before moving to quizzes');
                        return;
                      }
                      setCourseEditStep('quizzes');
                    }}
                    className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all"
                  >
                    Next: Final Assessment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Course-Level Final Assessment */}
            {courseEditStep === 'quizzes' && (
              <div className="space-y-6">
                {courseEditData.quizzes.map((quiz: any, qIdx: number) => (
                  <div key={qIdx} className="bg-gray-50 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <ClipboardList className="w-5 h-5 text-purple-400" />
                      <input
                        type="text"
                        value={quiz.title}
                        onChange={(e) => {
                          const updated = [...courseEditData.quizzes];
                          updated[qIdx].title = e.target.value;
                          setCourseEditData((prev: any) => ({ ...prev, quizzes: updated }));
                        }}
                        placeholder="Quiz title..."
                        className="flex-1 p-3 bg-white border border-transparent rounded-xl text-sm font-bold focus:border-purple-500/20 focus:ring-2 focus:ring-purple-500/10 transition-all outline-none"
                      />
                      {courseEditData.quizzes.length > 1 && (
                        <button
                          onClick={() => {
                            const updated = courseEditData.quizzes.filter((_: any, i: number) => i !== qIdx);
                            if (updated.length === 0) updated.push({ title: '', questions: [{ question: '', options: ['', '', '', ''], correct_answer: 0 }] });
                            setCourseEditData((prev: any) => ({ ...prev, quizzes: updated }));
                          }}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {(quiz.questions || []).map((qq: any, qqIdx: number) => (
                      <div key={qqIdx} className="bg-white rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-purple-400">Q{qqIdx + 1}.</span>
                          <input
                            type="text"
                            value={qq.question}
                            onChange={(e) => {
                              const updated = [...courseEditData.quizzes];
                              updated[qIdx].questions[qqIdx].question = e.target.value;
                              setCourseEditData((prev: any) => ({ ...prev, quizzes: updated }));
                            }}
                            placeholder="Question..."
                            className="flex-1 p-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:border-purple-500/20 focus:ring-2 focus:ring-purple-500/10 transition-all outline-none"
                          />
                          {(quiz.questions || []).length > 1 && (
                            <button
                              onClick={() => {
                                const updated = [...courseEditData.quizzes];
                                updated[qIdx].questions = updated[qIdx].questions.filter((_: any, i: number) => i !== qqIdx);
                                setCourseEditData((prev: any) => ({ ...prev, quizzes: updated }));
                              }}
                              className="p-1 text-red-400 hover:text-red-600 rounded transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(() => {
                            const opts = Array.isArray(qq.options) ? qq.options : JSON.parse(qq.options || '[]');
                            return opts.map((opt: string, oIdx: number) => (
                              <div key={oIdx} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`edit-cq-${qIdx}-${qqIdx}`}
                                  checked={qq.correct_answer === oIdx}
                                  onChange={() => {
                                    const updated = [...courseEditData.quizzes];
                                    updated[qIdx].questions[qqIdx].correct_answer = oIdx;
                                    setCourseEditData((prev: any) => ({ ...prev, quizzes: updated }));
                                  }}
                                  className="w-4 h-4 accent-green-600"
                                />
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const updated = [...courseEditData.quizzes];
                                    updated[qIdx].questions[qqIdx].options[oIdx] = e.target.value;
                                    setCourseEditData((prev: any) => ({ ...prev, quizzes: updated }));
                                  }}
                                  placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                  className="flex-1 p-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:border-purple-500/20 focus:ring-2 focus:ring-purple-500/10 transition-all outline-none"
                                />
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        const updated = [...courseEditData.quizzes];
                        updated[qIdx].questions.push({ question: '', options: ['', '', '', ''], correct_answer: 0 });
                        setCourseEditData((prev: any) => ({ ...prev, quizzes: updated }));
                      }}
                      className="flex items-center gap-2 text-sm text-purple-600 font-bold hover:underline"
                    >
                      <Plus className="w-4 h-4" />
                      Add Question
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => {
                    courseEditData.quizzes.push({ title: '', questions: [{ question: '', options: ['', '', '', ''], correct_answer: 0 }] });
                    setCourseEditData((prev: any) => ({ ...prev, quizzes: [...courseEditData.quizzes] }));
                  }}
                  className="w-full p-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Quiz
                </button>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setCourseEditStep('curriculum')}
                    className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCourseEditStep('review')}
                    className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all"
                  >
                    Next: Review
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Save */}
            {courseEditStep === 'review' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <h4 className="font-bold text-gray-900">Course Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Title:</span>
                      <p className="font-bold text-gray-900">{courseEditForm.title}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Instructor:</span>
                      <p className="font-bold text-gray-900">{courseEditForm.instructor}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <p className="font-bold text-gray-900">৳{courseEditForm.price}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Level:</span>
                      <p className="font-bold text-gray-900 capitalize">{courseEditForm.level}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      {courseEditData.sections.length} sections, {courseEditData.sections.reduce((acc: number, s: any) => acc + (s.lessons || []).length, 0)} lessons, {courseEditData.quizzes.length} quiz(es)
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setCourseEditStep('quizzes')}
                    className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCourseEditSave}
                    disabled={editSaving || courseCoverUploading || courseVideoUploading}
                    className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all disabled:opacity-50"
                  >
                    {editSaving || courseCoverUploading || courseVideoUploading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {promoEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-xl w-full"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {promoEditing.id ? 'Edit Promo Code' : 'Create Promo Code'}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Code</label>
                  <input
                    type="text"
                    value={promoForm.code}
                    onChange={(e) => setPromoForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="SAVE20"
                    className="w-full p-3 border border-orange-200 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Discount Type</label>
                  <select
                    value={promoForm.discount_type}
                    onChange={(e) => setPromoForm(prev => ({ ...prev, discount_type: e.target.value }))}
                    className="w-full p-3 border border-orange-200 rounded-xl"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (৳)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Discount Value</label>
                  <input
                    type="number"
                    value={promoForm.discount_value}
                    onChange={(e) => setPromoForm(prev => ({ ...prev, discount_value: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-3 border border-orange-200 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Usage Limit</label>
                  <input
                    type="number"
                    value={promoForm.usage_limit}
                    onChange={(e) => setPromoForm(prev => ({ ...prev, usage_limit: parseInt(e.target.value) || 1 }))}
                    className="w-full p-3 border border-orange-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Per User Limit</label>
                  <input
                    type="number"
                    value={promoForm.per_user_limit}
                    onChange={(e) => setPromoForm(prev => ({ ...prev, per_user_limit: parseInt(e.target.value) || 1 }))}
                    className="w-full p-3 border border-orange-200 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Min Order (৳)</label>
                  <input
                    type="number"
                    value={promoForm.min_order_amount}
                    onChange={(e) => setPromoForm(prev => ({ ...prev, min_order_amount: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-3 border border-orange-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Valid From</label>
                  <input
                    type="date"
                    value={promoForm.valid_from}
                    onChange={(e) => setPromoForm(prev => ({ ...prev, valid_from: e.target.value }))}
                    className="w-full p-3 border border-orange-200 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Valid Until</label>
                  <input
                    type="date"
                    value={promoForm.valid_until}
                    onChange={(e) => setPromoForm(prev => ({ ...prev, valid_until: e.target.value }))}
                    className="w-full p-3 border border-orange-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                <textarea
                  value={promoForm.description}
                  onChange={(e) => setPromoForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full p-3 border border-orange-200 rounded-xl"
                  placeholder="Optional description"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => { setPromoEditing(null); setPromoForm({ code: '', discount_type: 'percentage', discount_value: 0, usage_limit: 100, per_user_limit: 1, min_order_amount: 0, valid_from: '', valid_until: '', is_active: true, description: '' }); }}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    setPromoSaving(true);
                    if (promoEditing.id) {
                      await api.put(`/staff/promo-codes/${promoEditing.id}`, promoForm);
                      toast.success('Promo code updated');
                    } else {
                      await api.post('/staff/promo-codes', promoForm);
                      toast.success('Promo code created');
                    }
                    setPromoEditing(null);
                    loadPromoCodes();
                  } catch (err: any) {
                    toast.error(err.message || 'Failed to save promo code');
                  } finally {
                    setPromoSaving(false);
                  }
                }}
                disabled={promoSaving}
                className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50"
              >
                {promoSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
