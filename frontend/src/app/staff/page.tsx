'use client';

import { useState, useEffect } from 'react';
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
  Search,
  Filter,
  MessageSquare,
  Bell,
  Info,
  LayoutGrid,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/lib/useDebounce';
import { api, ApiBook, mapApiBookToBook, ApiCategory } from '@/lib/api';
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
  book_id: number;
  user_name: string;
  question: string;
  answer: string | null;
  is_answered: boolean;
  created_at: string;
  book_title?: string;
  book_cover_url?: string;
}

export default function StaffDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'my-books' | 'drafts' | 'add-book' | 'inventory' | 'categories' | 'qanda' | 'about' | 'orders'>('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [myBooks, setMyBooks] = useState<StaffBook[]>([]);
  const [draftBooks, setDraftBooks] = useState<StaffBook[]>([]);
  const [lowStockBooks, setLowStockBooks] = useState<StaffBook[]>([]);
  const [allBooks, setAllBooks] = useState<StaffBook[]>([]);
  const [inventoryBooks, setInventoryBooks] = useState<StaffBook[]>([]);
  const [inventoryTotal, setInventoryTotal] = useState(0);
  const [qandaItems, setQandaItems] = useState<StaffQuestion[]>([]);
  const [qandaFilter, setQandaFilter] = useState<'all' | 'answered' | 'unanswered'>('all');
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [staffOrders, setStaffOrders] = useState<{
    id: string;
    userId: string;
    items: CartItem[];
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
  const [loading, setLoading] = useState(false);

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
    coverUrl: '',
    previewContent: [],
    previewImages: [],
  });
  const [newBookCoverUploading, setNewBookCoverUploading] = useState(false);
  const [newBookPreviewUploading, setNewBookPreviewUploading] = useState(false);
  const [newBookCoverFile, setNewBookCoverFile] = useState<File | null>(null);
  const [newBookCoverPreview, setNewBookCoverPreview] = useState<string>('');
  const [newBookPreviewFiles, setNewBookPreviewFiles] = useState<File[]>([]);
  const [newBookPreviewPreviews, setNewBookPreviewPreviews] = useState<string[]>([]);

  const uploadImageFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/staff/books/upload-cover', {
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
      return data.url || `http://localhost:8000/storage/${data.path}`;
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image');
      return null;
    }
  };

  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);

  const [inventorySearch, setInventorySearch] = useState('');
  const debouncedInventorySearch = useDebounce(inventorySearch, 300);
  
  useEffect(() => {
    setInventoryCurrentPage(1);
  }, [debouncedInventorySearch]);
  
  const [inventoryCategories, setInventoryCategories] = useState<string[]>([]);
  const [inventorySort, setInventorySort] = useState('title');
  const [inventoryStockFilter, setInventoryStockFilter] = useState('all');
  const [inventoryPriceRange, setInventoryPriceRange] = useState<[number, number]>([0, 10000]);
  const [inventoryMaxPrice, setInventoryMaxPrice] = useState(10000);
  const [inventoryCurrentPage, setInventoryCurrentPage] = useState(1);
  const inventoryPerPage = 10;
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
    coverUrl: '',
    previewImages: [] as string[],
  });
  const [editSaving, setEditSaving] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [coverUploading, setCoverUploading] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const loadInventoryBooks = async () => {
    try {
      const params: Record<string, string> = {
        per_page: String(inventoryPerPage),
        page: String(inventoryCurrentPage),
        sort: inventorySort,
        stock_filter: inventoryStockFilter,
      };
      if (debouncedInventorySearch) params.search = debouncedInventorySearch;
      if (inventoryCategories.length > 0) params.categories = JSON.stringify(inventoryCategories);

      const [res, maxRes] = await Promise.all([
        api.get<any>('/staff/books', params),
        api.get<any>('/staff/books', { per_page: '1', sort: 'price-high' }),
      ]);
      
      const books = (res.data || []).map(mapApiBookToBook) as StaffBook[];
      setInventoryBooks(books);
      setInventoryTotal(res.total || 0);
      
      if (maxRes.data && maxRes.data.length > 0) {
        const highestPrice = maxRes.data[0].price;
        const roundedMax = Math.ceil(highestPrice / 1000) * 1000;
        const finalMax = Math.max(10000, roundedMax);
        setInventoryMaxPrice(finalMax);
        setInventoryPriceRange([0, finalMax]);
      }
    } catch {
      setInventoryBooks([]);
      setInventoryTotal(0);
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

  const loadOrders = async () => {
    try {
      const ordersRes = await api.get<any>('/staff/orders', { per_page: String(ordersPerPage), page: String(orderCurrentPage) });
      const ordersData = ordersRes.data || [];
      setStaffOrders(ordersData.map((order: any) => ({
        id: String(order.id),
        userId: String(order.user_id),
        items: (order.items || []).map((item: any) => ({
          bookId: String(item.book_id),
          id: String(item.book_id),
          title: item.book?.title || 'Unknown Book',
          author: item.book?.author || '',
          price: item.price,
          quantity: item.quantity,
          coverUrl: item.book?.image || '',
          stock: item.book?.stock || 0,
        } as CartItem)),
        total: parseFloat(order.total),
        status: order.status,
        paymentMethod: order.payment_method || 'unknown',
        createdAt: order.created_at,
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
    }
  }, [activeTab, inventoryCurrentPage, inventoryPerPage, inventorySearch, inventoryCategories, inventorySort, inventoryStockFilter, myBooksCurrentPage, draftBooksCurrentPage]);

  useEffect(() => {
    if (!user || user.role !== 'staff') {
      router.push('/');
      return;
    }

    const loadData = async () => {
      try {
        const [booksRes, categoriesRes] = await Promise.all([
          api.get<{ data: ApiBook[] }>('/staff/books', { per_page: '100' }),
          api.get<ApiCategory[]>('/categories'),
        ]);

        const mappedBooks = (booksRes.data || []).map(mapApiBookToBook) as StaffBook[];
        setAllBooks(mappedBooks);
        setMyBooks(mappedBooks.filter(b => b.status !== 'draft'));
        setDraftBooks(mappedBooks.filter(b => b.status === 'draft'));
        setLowStockBooks(mappedBooks.filter(b => b.stock < 10));
        
        setCategories(categoriesRes.map(c => c.name));
        setApiCategories(categoriesRes);
      } catch {
      }

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

      try {
        const ordersRes = await api.get<any>('/staff/orders', { per_page: String(ordersPerPage), page: String(orderCurrentPage) });
        const ordersData = ordersRes.data || [];
        setStaffOrders(ordersData.map((order: any) => ({
          id: String(order.id),
          userId: String(order.user_id),
          items: (order.items || []).map((item: any) => ({
            bookId: String(item.book_id),
            id: String(item.book_id),
            title: item.book?.title || 'Unknown Book',
            author: item.book?.author || '',
            price: item.price,
            quantity: item.quantity,
            coverUrl: item.book?.image || '',
            stock: item.book?.stock || 0,
          } as CartItem)),
          total: parseFloat(order.total),
          status: order.status,
          paymentMethod: order.payment_method || 'unknown',
          createdAt: order.created_at,
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
      const res = await api.get<any>('/staff/all-questions', {
        per_page: String(qandaPerPage),
        page: String(qandaCurrentPage),
      });
      
      const questionsWithBookInfo = (res.data || []).map((q: any) => ({
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
    } catch (err: any) {
      console.error('Failed to load Q&A:', err);
      setQandaItems([]);
      setQandaTotal(0);
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
    }
    if (activeTab === 'orders') {
      loadOrders();
    }
    if (activeTab === 'qanda') {
      loadQanda();
    }
  }, [activeTab, inventoryCurrentPage, inventoryPerPage, debouncedInventorySearch, inventoryCategories, inventorySort, inventoryStockFilter, myBooksCurrentPage, draftBooksCurrentPage, orderCurrentPage, qandaCurrentPage]);

  const filteredInventory = inventoryBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                         book.author.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesCategory = inventoryCategories.length === 0 || inventoryCategories.includes(book.category);
    const matchesStock = inventoryStockFilter === 'all' || 
                        (inventoryStockFilter === 'low' && book.stock < 10) ||
                        (inventoryStockFilter === 'out' && book.stock === 0) ||
                        (inventoryStockFilter === 'in' && book.stock >= 10);
    const matchesPrice = book.price >= inventoryPriceRange[0] && book.price <= inventoryPriceRange[1];
    return matchesSearch && matchesCategory && matchesStock && matchesPrice;
  }).sort((a, b) => {
    if (inventorySort === 'newest') return new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime();
    if (inventorySort === 'oldest') return new Date((a as any).createdAt).getTime() - new Date((b as any).createdAt).getTime();
    if (inventorySort === 'title') return a.title.localeCompare(b.title);
    if (inventorySort === 'stock-low') return a.stock - b.stock;
    if (inventorySort === 'stock-high') return b.stock - a.stock;
    if (inventorySort === 'price-low') return a.price - b.price;
    if (inventorySort === 'price-high') return b.price - a.price;
    return 0;
  });

  const filteredStaffOrders = staffOrders.filter(order => {
    const matchesFilter = orderFilter === 'all' || order.status === orderFilter;
    const matchesSearch = !orderSearch || 
      order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
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

    setLoading(true);
    try {
      const catObj = apiCategories.find(c => c.name === newBook.category);
      if (!catObj) {
        toast.error('Selected category not found');
        setLoading(false);
        return;
      }

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
          const url = await uploadImageFile(file);
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
        image: coverImage,
        preview_images: previewImages,
        status: saveAsDraft ? 'draft' : 'approved',
      });
      toast.success(saveAsDraft ? 'Book saved as draft!' : 'Book added successfully!');
      
      const booksRes = await api.get<{ data: ApiBook[] }>('/staff/books');
      const mappedBooks = (booksRes.data || []).map(mapApiBookToBook) as StaffBook[];
      setAllBooks(mappedBooks);
      setMyBooks(mappedBooks.filter(b => b.submittedBy === user?.uid && b.status !== 'draft'));
      setDraftBooks(mappedBooks.filter(b => b.status === 'draft'));
      setLowStockBooks(mappedBooks.filter(b => b.stock < 5));
      
      
      setActiveTab('my-books');
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
      setNewBookCoverFile(null);
      setNewBookCoverPreview('');
      setNewBookPreviewFiles([]);
      setNewBookPreviewPreviews([]);
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
      const response = await fetch('http://localhost:8000/api/staff/books/upload-cover', {
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
        const response = await fetch('http://localhost:8000/api/staff/books/upload-cover', {
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
      setMyBooks(mappedBooks.filter(b => b.submittedBy === user?.uid && b.status !== 'draft'));
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
          setMyBooks(mappedBooks.filter(b => b.submittedBy === user?.uid && b.status !== 'draft'));
          setDraftBooks(mappedBooks.filter(b => b.status === 'draft'));
          setLowStockBooks(mappedBooks.filter(b => b.stock < 5));
          
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

    setLoading(true);
    try {
      const catObj = apiCategories.find(c => c.name === newBook.category);
      await api.post('/staff/books', {
        title: newBook.title,
        author: newBook.author || '',
        description: newBook.description || '',
        category_id: catObj?.id || null,
        price: newBook.price || 0,
        stock: newBook.stock || 0,
        image: newBook.coverUrl || null,
        preview_images: newBook.previewImages || [],
        status: 'draft',
      });
      toast.success('Book saved as draft!');
      
      const booksRes = await api.get<{ data: ApiBook[] }>('/staff/books');
      const mappedBooks = (booksRes.data || []).map(mapApiBookToBook) as StaffBook[];
      setAllBooks(mappedBooks);
      setMyBooks(mappedBooks.filter(b => b.submittedBy === user?.uid && b.status !== 'draft'));
      setDraftBooks(mappedBooks.filter(b => b.status === 'draft'));
      setLowStockBooks(mappedBooks.filter(b => b.stock < 5));
      
      
      setActiveTab('drafts');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-2">
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-gray-900">Staff Panel</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Management</p>
              </div>
            </div>
          </div>

          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'my-books', label: 'My Submissions', icon: BookOpen },
            { id: 'drafts', label: 'Drafts', icon: FileText },
            { id: 'inventory', label: 'Inventory Management', icon: Package },
            { id: 'categories', label: 'Manage Categories', icon: Tag },
            { id: 'add-book', label: 'Add New Book', icon: PlusCircle },
            { id: 'qanda', label: 'Q&A Management', icon: MessageSquare },
            { id: 'orders', label: 'Order Management', icon: Package },
            { id: 'about', label: 'Edit About Page', icon: Info },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all text-left relative",
                activeTab === tab.id 
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Books</p>
                    <p className="text-4xl font-serif font-bold text-gray-900">{allBooks.length}</p>
                  </div>
                  <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Stock</p>
                    <p className="text-4xl font-serif font-bold text-green-600">{allBooks.reduce((acc, b) => acc + b.stock, 0)}</p>
                  </div>
                  <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Drafts</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-4xl font-serif font-bold text-orange-600">{draftBooks.length}</p>
                      <p className="text-xs font-bold text-gray-400">Books</p>
                    </div>
                  </div>
                  <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Categories</p>
                    <p className="text-4xl font-serif font-bold text-blue-600">{categories.length}</p>
                  </div>
                </div>

                <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <h3 className="text-2xl font-serif font-bold text-gray-900">Stock Alerts</h3>
                  </div>
                  
                  {lowStockBooks.length > 0 ? (
                    <div className="space-y-4">
                      {lowStockBooks.map(book => (
                        <div key={book.id} className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0">
                              <img src={book.coverUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{book.title}</p>
                              <p className="text-sm text-red-600 font-bold">Only {book.stock} left in stock</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              toast.info(`Restock requested for ${book.title}`);
                            }}
                            className="px-4 py-2 bg-white text-red-600 rounded-xl text-sm font-bold border border-red-200 hover:bg-red-600 hover:text-white transition-all"
                          >
                            Restock
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">All items are well-stocked!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'my-books' && (
              <motion.div
                key="my-books"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-3xl font-serif font-bold text-gray-900">My Submissions</h3>
                      <p className="text-sm text-gray-500">{myBooksTotal} books</p>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          viewMode === 'grid' ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          viewMode === 'list' ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {myBooks.length > 0 ? (
                    viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {myBooks.map(book => (
                          <div key={book.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <div className="flex gap-4">
                              <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0">
                                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-serif font-bold text-gray-900 truncate">{book.title}</h3>
                                <p className="text-sm text-gray-500 truncate">by {book.author}</p>
                                <p className="text-sm font-bold text-gray-900 mt-2">৳{book.price.toFixed(2)}</p>
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-2 inline-block",
                                  book.status === 'approved' ? 'bg-green-50 text-green-600' :
                                  book.status === 'draft' ? 'bg-yellow-50 text-yellow-600' :
                                  'bg-gray-50 text-gray-600'
                                )}>
                                  {book.status || 'draft'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Book</th>
                              <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                              <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                              <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {myBooks.map(book => (
                              <tr key={book.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0">
                                      <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-gray-900">{book.title}</p>
                                      <p className="text-sm text-gray-500">{book.author}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 text-sm font-bold text-gray-900">৳{book.price.toFixed(2)}</td>
                                <td className="p-4">
                                  <span className={cn(
                                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                    book.status === 'approved' ? 'bg-green-50 text-green-600' :
                                    book.status === 'draft' ? 'bg-yellow-50 text-yellow-600' :
                                    'bg-gray-50 text-gray-600'
                                  )}>
                                    {book.status || 'draft'}
                                  </span>
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                  {(book as any).createdAt ? new Date((book as any).createdAt).toLocaleDateString() : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">No submissions yet.</p>
                    </div>
                  )}

                  {myBooksTotal > myBooksPerPage && (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setMyBooksCurrentPage(p => Math.max(1, p - 1))}
                        disabled={myBooksCurrentPage === 1}
                        className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-sm text-gray-500">
                        Page {myBooksCurrentPage} of {Math.ceil(myBooksTotal / myBooksPerPage)}
                      </span>
                      <button
                        onClick={() => setMyBooksCurrentPage(p => p + 1)}
                        disabled={myBooksCurrentPage >= Math.ceil(myBooksTotal / myBooksPerPage)}
                        className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'drafts' && (
              <motion.div
                key="drafts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-3xl font-serif font-bold text-gray-900">Draft Books</h3>
                    <p className="text-sm text-gray-500">{draftBooksTotal} books</p>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        viewMode === 'grid' ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        viewMode === 'list' ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {draftBooks.length > 0 ? (
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {draftBooks.map(book => (
                        <div key={book.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                          <div className="flex gap-4">
                            <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0">
                              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-serif font-bold text-gray-900 truncate">{book.title}</h3>
                              <p className="text-sm text-gray-500 truncate">by {book.author}</p>
                              <p className="text-sm font-bold text-gray-900 mt-2">৳{book.price.toFixed(2)}</p>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-2 inline-block bg-yellow-50 text-yellow-600">
                                draft
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                            <button
                              onClick={() => openInventoryEdit(book)}
                              className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Book</th>
                            <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                            <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                            <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {draftBooks.map(book => (
                            <tr key={book.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0">
                                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900">{book.title}</p>
                                    <p className="text-sm text-gray-500">{book.author}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-sm font-bold text-gray-900">৳{book.price.toFixed(2)}</td>
                              <td className="p-4">
                                <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-50 text-yellow-600">
                                  draft
                                </span>
                              </td>
                              <td className="p-4 text-sm text-gray-500">
                                {(book as any).createdAt ? new Date((book as any).createdAt).toLocaleDateString() : '-'}
                              </td>
                              <td className="p-4">
                                <button
                                  onClick={() => openInventoryEdit(book)}
                                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No draft books yet.</p>
                  </div>
                )}

                {draftBooksTotal > draftBooksPerPage && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setDraftBooksCurrentPage(p => Math.max(1, p - 1))}
                      disabled={draftBooksCurrentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-500">
                      Page {draftBooksCurrentPage} of {Math.ceil(draftBooksTotal / draftBooksPerPage)}
                    </span>
                    <button
                      onClick={() => setDraftBooksCurrentPage(p => p + 1)}
                      disabled={draftBooksCurrentPage >= Math.ceil(draftBooksTotal / draftBooksPerPage)}
                      className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'inventory' && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-serif font-bold text-gray-900">Inventory Management</h3>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-500">{inventoryTotal} total books</p>
                    <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          viewMode === 'grid' ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          viewMode === 'list' ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      placeholder="Search by title or author..."
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                    />
                  </div>
                  <select
                    value={inventorySort}
                    onChange={(e) => setInventorySort(e.target.value)}
                    className="px-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Sort by Title</option>
                    <option value="stock-low">Stock: Low to High</option>
                    <option value="stock-high">Stock: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <select
                    value={inventoryStockFilter}
                    onChange={(e) => setInventoryStockFilter(e.target.value)}
                    className="px-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                  >
                    <option value="all">All Stock</option>
                    <option value="in">In Stock (10+)</option>
                    <option value="low">Low Stock (&lt;10)</option>
                    <option value="out">Out of Stock</option>
                  </select>
                  <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold">
                    <span className="text-gray-500">৳</span>
                    <input
                      type="range"
                      min="0"
                      max={inventoryMaxPrice}
                      value={inventoryPriceRange[1]}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setInventoryPriceRange([0, val]);
                      }}
                      className="w-24 accent-orange-600"
                    />
                    <span className="text-gray-700">৳{inventoryPriceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {filteredInventory.length > 0 ? (
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredInventory.map(book => (
                        <div key={book.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                          <div className="flex gap-4">
                            <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0">
                              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-serif font-bold text-gray-900 truncate">{book.title}</h3>
                              <p className="text-sm text-gray-500 truncate">by {book.author}</p>
                              <p className="text-sm font-bold text-gray-900 mt-2">৳{book.price.toFixed(2)}</p>
                              <div className="mt-2 flex items-center gap-2 flex-wrap">
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                  (book as any).status === 'draft' ? "bg-yellow-50 text-yellow-600" :
                                  "bg-green-50 text-green-600"
                                )}>
                                  {(book as any).status || 'approved'}
                                </span>
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                  book.stock === 0 ? "bg-red-50 text-red-600" :
                                  book.stock < 10 ? "bg-orange-50 text-orange-600" :
                                  "bg-green-50 text-green-600"
                                )}>
                                  {book.stock === 0 ? "Out of Stock" : book.stock < 10 ? `Low Stock (${book.stock})` : `In Stock (${book.stock})`}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                            <button
                              onClick={async () => {
                                const newFeatured = !(book as any).isFeatured;
                                setInventoryBooks(prev => prev.map(b => 
                                  b.id === book.id ? { ...b, isFeatured: newFeatured } as StaffBook : b
                                ));
                                try {
                                  await api.put(`/staff/books/${book.id}`, { is_featured: newFeatured });
                                  toast.success(newFeatured ? 'Added to featured' : 'Removed from featured');
                                } catch {
                                  setInventoryBooks(prev => prev.map(b => 
                                    b.id === book.id ? { ...b, isFeatured: !newFeatured } as StaffBook : b
                                  ));
                                  toast.error('Failed to update featured status');
                                }
                              }}
                              className={cn(
                                "flex-1 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                                (book as any).isFeatured 
                                  ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" 
                                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                              )}
                            >
                              {(book as any).isFeatured ? "★ Featured" : "☆ Feature"}
                            </button>
                            <button
                              onClick={() => openInventoryEdit(book)}
                              className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all"
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
                                      await api.delete(`/staff/books/${book.id}`);
                                      toast.success('Book deleted successfully');
                                      loadInventoryBooks();
                                    } catch {
                                      toast.error('Failed to delete book');
                                    }
                                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                                  }
                                });
                              }}
                              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Book</th>
                            <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                            <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                            <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                            <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredInventory.map(book => (
                            <tr key={book.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0">
                                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900 truncate max-w-[200px]">{book.title}</p>
                                    <p className="text-sm text-gray-500">{book.author}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-sm text-gray-600">{book.category}</td>
                              <td className="p-4 text-sm font-bold text-gray-900">৳{book.price.toFixed(2)}</td>
                              <td className="p-4">
                                <span className={cn(
                                  "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                  book.stock === 0 ? "bg-red-50 text-red-600" :
                                  book.stock < 10 ? "bg-orange-50 text-orange-600" :
                                  "bg-green-50 text-green-600"
                                )}>
                                  {book.stock === 0 ? "Out of Stock" : book.stock < 10 ? `Low (${book.stock})` : `${book.stock}`}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={cn(
                                  "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                  (book as any).status === 'draft' ? "bg-yellow-50 text-yellow-600" :
                                  "bg-green-50 text-green-600"
                                )}>
                                  {(book as any).status || 'approved'}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => openInventoryEdit(book)}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                                  >
                                    <Edit3 className="w-4 h-4" />
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
                                            await api.delete(`/staff/books/${book.id}`);
                                            toast.success('Book deleted');
                                            loadInventoryBooks();
                                          } catch {
                                            toast.error('Failed to delete');
                                          }
                                          setConfirmModal(prev => ({ ...prev, isOpen: false }));
                                        }
                                      });
                                    }}
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No books found in inventory</p>
                  </div>
                )}

                {inventoryTotal > inventoryPerPage && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setInventoryCurrentPage(p => Math.max(1, p - 1))}
                      disabled={inventoryCurrentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-500">
                      Page {inventoryCurrentPage} of {Math.ceil(inventoryTotal / inventoryPerPage)}
                    </span>
                    <button
                      onClick={() => setInventoryCurrentPage(p => p + 1)}
                      disabled={inventoryCurrentPage >= Math.ceil(inventoryTotal / inventoryPerPage)}
                      className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-serif font-bold text-gray-900">Manage Categories</h3>
                </div>

                <form onSubmit={handleAddCategory} className="flex gap-4">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name..."
                    className="flex-1 p-4 bg-white border border-gray-100 rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all"
                  >
                    Add Category
                  </button>
                </form>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categories.map(cat => (
                    <div key={cat} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <span className="font-bold text-gray-900">{cat}</span>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {categories.length === 0 && (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No categories yet</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'add-book' && (
              <motion.div
                key="add-book"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h3 className="text-3xl font-serif font-bold text-gray-900">Add New Book</h3>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Title *</label>
                        <input
                          type="text"
                          value={newBook.title || ''}
                          onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                          required
                          className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Author *</label>
                        <input
                          type="text"
                          value={newBook.author || ''}
                          onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
                          required
                          className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description *</label>
                      <textarea
                        rows={4}
                        value={newBook.description || ''}
                        onChange={(e) => setNewBook(prev => ({ ...prev, description: e.target.value }))}
                        required
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
                        <select
                          value={newBook.category || ''}
                          onChange={(e) => setNewBook(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none appearance-none"
                        >
                          <option value="">Select category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price (৳)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newBook.price || ''}
                          onChange={(e) => setNewBook(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</label>
                        <input
                          type="number"
                          value={newBook.stock || ''}
                          onChange={(e) => setNewBook(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                          className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cover Image</label>
                        <div className="flex gap-3">
                          <div className="flex-1 space-y-2">
                            <input
                              type="url"
                              value={newBook.coverUrl || ''}
                              onChange={(e) => {
                                setNewBook(prev => ({ ...prev, coverUrl: e.target.value }));
                                setNewBookCoverFile(null);
                                setNewBookCoverPreview('');
                              }}
                              placeholder="Or paste image URL..."
                              className="w-full p-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                            />
                            <label className="flex items-center justify-center gap-2 w-full p-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 transition-all">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  if (!file.type.startsWith('image/')) {
                                    toast.error('Please select an image file');
                                    return;
                                  }
                                  setNewBookCoverFile(file);
                                  setNewBook(prev => ({ ...prev, coverUrl: '' }));
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setNewBookCoverPreview(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }}
                                className="hidden"
                              />
                              <ImageIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-xs font-bold text-gray-500">Upload Cover Image</span>
                            </label>
                          </div>
                          {(newBookCoverPreview || newBook.coverUrl) && (
                            <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                              <img src={newBookCoverPreview || newBook.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preview Images</label>
                      <label className="flex items-center justify-center gap-2 w-full p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 transition-all">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            const imageFiles = files.filter(f => f.type.startsWith('image/'));
                            if (imageFiles.length === 0) {
                              toast.error('Please select image files');
                              return;
                            }
                            setNewBookPreviewFiles(prev => [...prev, ...imageFiles]);
                            imageFiles.forEach(file => {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNewBookPreviewPreviews(prev => [...prev, reader.result as string]);
                              };
                              reader.readAsDataURL(file);
                            });
                          }}
                          className="hidden"
                        />
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-bold text-gray-500">Upload Preview Images</span>
                      </label>
                      {newBookPreviewPreviews.length > 0 && (
                        <div className="grid grid-cols-4 gap-3">
                          {newBookPreviewPreviews.map((url, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                              <img src={url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                              <button
                                onClick={() => {
                                  setNewBookPreviewPreviews(prev => prev.filter((_, idx) => idx !== i));
                                  setNewBookPreviewFiles(prev => prev.filter((_, idx) => idx !== i));
                                }}
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
                      <button
                        onClick={(e) => handleAddBook(e, true)}
                        disabled={loading || newBookCoverUploading || newBookPreviewUploading}
                        className="px-6 py-3 bg-yellow-500 text-white rounded-2xl font-bold hover:bg-yellow-600 transition-all disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save as Draft'}
                      </button>
                      <button
                        onClick={(e) => handleAddBook(e, false)}
                        disabled={loading || newBookCoverUploading || newBookPreviewUploading}
                        className="flex-1 py-3 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all disabled:opacity-50"
                      >
                        {loading ? 'Adding...' : 'Add Book'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === 'qanda' && (
              <motion.div
                key="qanda"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-3xl font-serif font-bold text-gray-900">Q&A Management</h3>
                    <p className="text-sm text-gray-500">{qandaTotal} questions</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setQandaFilter('all')}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                        qandaFilter === 'all' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      All ({qandaItems.length})
                    </button>
                    <button
                      onClick={() => setQandaFilter('unanswered')}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                        qandaFilter === 'unanswered' ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      Unanswered ({qandaItems.filter(q => !q.answer).length})
                    </button>
                    <button
                      onClick={() => setQandaFilter('answered')}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                        qandaFilter === 'answered' ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      Answered ({qandaItems.filter(q => q.answer).length})
                    </button>
                  </div>
                </div>

                {(() => {
                  const filtered = qandaFilter === 'all' ? qandaItems :
                    qandaFilter === 'answered' ? qandaItems.filter(q => q.answer) :
                    qandaItems.filter(q => !q.answer);

                  return filtered.length > 0 ? (
                    filtered.map(item => (
                    <div key={item.id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                       <div className="flex items-start gap-4 mb-4">
                         <a href={`/book/${item.book_id}`} className="shrink-0 w-16 h-24 rounded-lg overflow-hidden border border-gray-200 hover:border-orange-400 transition-colors">
                           <img
                             src={item.book_cover_url || `https://picsum.photos/seed/book${item.book_id}/400/600`}
                             alt={item.book_title || 'Book cover'}
                             className="w-full h-full object-cover"
                           />
                         </a>
                         <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold shrink-0">Q</div>
                         <div>
                           <p className="font-bold text-gray-900">{item.question}</p>
                           <p className="text-xs text-gray-400">Asked by {item.user_name} • {new Date(item.created_at).toLocaleDateString()} • Book: {item.book_title}</p>
                         </div>
                       </div>
                      {item.answer ? (
                        <div className="flex items-start gap-4 pl-12">
                          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600 font-bold shrink-0">A</div>
                          <p className="text-gray-600 italic leading-relaxed">{item.answer}</p>
                        </div>
                      ) : (
                        <div className="pl-12">
                          {replyingToId === item.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write your answer..."
                                className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none resize-none"
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={async () => {
                                    if (!replyText.trim()) return;
                                    try {
                                      await api.put(`/staff/questions/${item.id}/answer`, {
                                        answer: replyText,
                                      });
                                      toast.success('Answer posted');
                                      setReplyingToId(null);
                                      setReplyText('');
                                      const allBooksRes = await api.get<{ data: ApiBook[] }>('/books');
                                      const allBooksList = (allBooksRes.data || []).map(mapApiBookToBook);
                                      const questionsPromises = allBooksList.map(async (book) => {
                                        try {
                                          const qRes = await api.get<{ questions: any[] }>(`/books/${book.id}/questions`);
                                           return (qRes.questions || []).map((q: any) => ({
                                             ...q,
                                             book_title: book.title,
                                             book_cover_url: book.coverUrl,
                                           }));
                                        } catch {
                                          return [];
                                        }
                                      });
                                      const allQuestions = await Promise.all(questionsPromises);
                                     setQandaItems(allQuestions.flat());
                                    } catch {
                                      toast.error('Failed to post answer');
                                    }
                                  }}
                                  className="px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-bold hover:bg-orange-700 transition-all"
                                >
                                  Post Answer
                                </button>
                                <button
                                  onClick={() => {
                                    setReplyingToId(null);
                                    setReplyText('');
                                  }}
                                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setReplyingToId(item.id)}
                              className="text-sm font-bold text-orange-600 hover:underline"
                            >
                              Reply to this question
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">
                        {qandaFilter === 'answered' ? 'No answered questions yet' :
                         qandaFilter === 'unanswered' ? 'No unanswered questions' :
                         'No questions yet'}
                      </p>
                    </div>
                  );
                })()}

                {qandaTotal > qandaPerPage && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setQandaCurrentPage(p => Math.max(1, p - 1))}
                      disabled={qandaCurrentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-500">
                      Page {qandaCurrentPage} of {Math.ceil(qandaTotal / qandaPerPage)}
                    </span>
                    <button
                      onClick={() => setQandaCurrentPage(p => p + 1)}
                      disabled={qandaCurrentPage >= Math.ceil(qandaTotal / qandaPerPage)}
                      className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-3xl font-serif font-bold text-gray-900">Order Management</h3>
                    <p className="text-sm text-gray-500">{ordersTotal} orders</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setOrderFilter('all')}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                        orderFilter === 'all' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      All ({staffOrders.length})
                    </button>
                    {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => setOrderFilter(status)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize",
                          orderFilter === status ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700",
                          status === 'pending' && orderFilter === status && 'text-orange-600',
                          status === 'processing' && orderFilter === status && 'text-purple-600',
                          status === 'shipped' && orderFilter === status && 'text-blue-600',
                          status === 'delivered' && orderFilter === status && 'text-green-600',
                          status === 'cancelled' && orderFilter === status && 'text-red-600'
                        )}
                      >
                        {status} ({staffOrders.filter(o => o.status === status).length})
                      </button>
                    ))}
                  </div>
                </div>

                {orderSearch && (
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search by order ID, customer name or email..."
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                    />
                  </div>
                )}

                {filteredStaffOrders.length > 0 ? (
                  <div className="space-y-4">
                    {filteredStaffOrders.map(order => (
                      <div key={order.id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-bold text-gray-900 font-mono text-lg">{order.id}</p>
                              <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                                order.status === 'delivered' && "bg-green-50 text-green-600",
                                order.status === 'shipped' && "bg-blue-50 text-blue-600",
                                order.status === 'processing' && "bg-purple-50 text-purple-600",
                                order.status === 'pending' && "bg-orange-50 text-orange-600",
                                order.status === 'cancelled' && "bg-red-50 text-red-600"
                              )}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {order.shippingAddress?.fullName || 'N/A'} • {order.shippingAddress?.email || 'N/A'} • {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-xl font-serif font-bold text-gray-900">৳{order.total.toFixed(2)}</p>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Items</p>
                          <div className="flex flex-wrap gap-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                                <div className="w-8 h-10 rounded overflow-hidden bg-gray-100">
                                  {item.coverUrl ? (
                                    <img src={item.coverUrl} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                      <BookOpen className="w-3 h-3" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-900">{item.title}</p>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity} × ৳{item.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {order.shippingAddress && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Shipping Address</p>
                            <p className="text-sm text-gray-700">{order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.zipCode}</p>
                            <p className="text-sm text-gray-700">{order.shippingAddress.phone}</p>
                          </div>
                        )}

                        {order.trackingNumber && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Tracking Number</p>
                            <p className="text-sm font-mono text-blue-700">{order.trackingNumber}</p>
                            {order.estimatedDelivery && <p className="text-xs text-blue-600 mt-1">Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>}
                          </div>
                        )}

                        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                          <select
                            value={order.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              try {
                                await api.put(`/staff/orders/${order.id}`, { status: newStatus });
                                setStaffOrders(prev => prev.map(o => 
                                  o.id === order.id ? { ...o, status: newStatus } : o
                                ));
                                toast.success(`Order marked as ${newStatus}`);
                              } catch {
                                toast.error('Failed to update order status');
                              }
                            }}
                            className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Tracking number"
                            defaultValue={(order as any).trackingNumber || ''}
                            onBlur={(e) => {
                              const val = e.target.value;
                              if (!val) return;
                              const updatedOrders = staffOrders.map(o =>
                                o.id === order.id ? { ...o, trackingNumber: val } : o
                              );
                              setStaffOrders(updatedOrders);
                              localStorage.setItem('lumina_orders', JSON.stringify(updatedOrders));
                              toast.success('Tracking number saved');
                            }}
                            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No orders found</p>
                  </div>
                )}

                {ordersTotal > ordersPerPage && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setOrderCurrentPage(p => Math.max(1, p - 1))}
                      disabled={orderCurrentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-500">
                      Page {orderCurrentPage} of {Math.ceil(ordersTotal / ordersPerPage)}
                    </span>
                    <button
                      onClick={() => setOrderCurrentPage(p => p + 1)}
                      disabled={orderCurrentPage >= Math.ceil(ordersTotal / ordersPerPage)}
                      className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h3 className="text-3xl font-serif font-bold text-gray-900 mb-8">Edit About Page</h3>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setAboutSaving(true);
                      try {
                        await api.post('/about', aboutForm);
                        toast.success('About page updated successfully');
                      } catch {
                        toast.error('Failed to update about page');
                      } finally {
                        setAboutSaving(false);
                      }
                    }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Page Title</label>
                      <input
                        type="text"
                        value={aboutForm.title}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hero Description</label>
                      <textarea
                        rows={3}
                        value={aboutForm.hero_description}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, hero_description: e.target.value }))}
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Our Story</label>
                      <textarea
                        rows={6}
                        value={aboutForm.our_story}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, our_story: e.target.value }))}
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Our Mission</label>
                      <textarea
                        rows={4}
                        value={aboutForm.our_mission}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, our_mission: e.target.value }))}
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Our Values</label>
                      <textarea
                        rows={4}
                        value={aboutForm.our_values}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, our_values: e.target.value }))}
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Email</label>
                        <input
                          type="email"
                          value={aboutForm.contact_email}
                          onChange={(e) => setAboutForm(prev => ({ ...prev, contact_email: e.target.value }))}
                          className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Phone</label>
                        <input
                          type="text"
                          value={aboutForm.contact_phone}
                          onChange={(e) => setAboutForm(prev => ({ ...prev, contact_phone: e.target.value }))}
                          className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Address</label>
                        <input
                          type="text"
                          value={aboutForm.contact_address}
                          onChange={(e) => setAboutForm(prev => ({ ...prev, contact_address: e.target.value }))}
                          className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={aboutSaving}
                        className="px-8 py-3 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all disabled:opacity-50"
                      >
                        {aboutSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
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
    </div>
  );
}