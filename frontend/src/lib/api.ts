const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
// Storage base URL for public assets. Can be overridden per env (e.g., Vercel, Netlify, .env).
const STORAGE_BASE_URL = (typeof process !== 'undefined' && (process as any).env?.NEXT_PUBLIC_STORAGE_BASE) || 'http://localhost:8000/storage';

export function joinStorage(base: string, path: string) {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path.startsWith('/') ? path.slice(1) : path;
  return `${b}/${p}`;
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers: customHeaders, ...restOptions } = options;

  const fullUrl = `${API_URL}${endpoint}`;
  const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const url = new URL(fullUrl, base);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const headers: Record<string, any> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...customHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log('API Request:', url.toString(), 'Token:', token ? 'present' : 'none');

  const response = await fetch(url.toString(), {
    ...restOptions,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', response.status, fullUrl, errorText);
    let error = { message: 'Something went wrong' };
    try {
      error = JSON.parse(errorText);
    } catch {}

    if ((error as any).errors) {
      const detailedErrors = Object.entries((error as any).errors)
        .map(([field, messages]) => `${field}: ${(messages as string[])[0]}`)
        .join(', ');
      throw new Error(`${error.message} (${detailedErrors})`);
    }
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    apiFetch<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, data?: any) =>
    apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),

  put: <T>(endpoint: string, data?: any) =>
    apiFetch<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),

  delete: <T>(endpoint: string) =>
    apiFetch<T>(endpoint, { method: 'DELETE' }),
};

export interface ApiBook {
  id: number;
  category_id: number;
  title: string;
  author: string;
  description: string;
  price: string;
  stock: number;
  isbn: string | null;
  publisher: string | null;
  image: string | null;
  pages: number | null;
  language: string;
  is_featured: boolean;
  status: string;
  preview_content: string[] | null;
  preview_images: string[] | null;
  created_at: string;
  updated_at: string;
  category?: ApiCategory;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  books_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiOrder {
  id: number;
  user_id: number;
  total: string;
  status: string;
  payment_method: string | null;
  shipping_address: string;
  city: string;
  state: string | null;
  postal_code: string | null;
  phone: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user?: ApiUser;
  items?: ApiOrderItem[];
}

export interface ApiOrderItem {
  id: number;
  order_id: number;
  book_id?: number | null;
  course_id?: number | null;
  quantity: number;
  price: string;
  book?: ApiBook;
  course?: any;
}

export function mapApiBookToBook(apiBook: ApiBook) {
  const status = apiBook.status || 'draft';
  
  const fallbackPreview = apiBook.description 
    ? apiBook.description.substring(0, 150) + '...'
    : 'No description available';
  
  return {
    id: String(apiBook.id),
    title: apiBook.title,
    author: apiBook.author,
    description: apiBook.description,
    price: parseFloat(apiBook.price),
    stock: apiBook.stock,
    category: apiBook.category?.name || 'Unknown',
    coverUrl: apiBook.image
      ? (apiBook.image.startsWith('http')
          ? apiBook.image
          : joinStorage(STORAGE_BASE_URL, apiBook.image))
      : `https://picsum.photos/seed/book${apiBook.id}/400/600`,
    previewContent: (apiBook.preview_content && apiBook.preview_content.length > 0)
      ? apiBook.preview_content
      : [fallbackPreview],
    previewImages: (apiBook.preview_images && apiBook.preview_images.length > 0)
      ? apiBook.preview_images.map(img => img.startsWith('http') ? img : joinStorage(STORAGE_BASE_URL, img))
      : undefined,
    isFeatured: apiBook.is_featured,
    isNewArrival: false,
    createdAt: apiBook.created_at,
    rating: 4.5,
    submittedBy: undefined,
    status: status as 'pending' | 'approved' | 'rejected' | 'draft' | 'pending_deletion',
  };
}

export function mapApiUserToUserProfile(apiUser: ApiUser) {
  const hasAvatar = apiUser.avatar && apiUser.avatar.trim() !== '';
  const avatarUrl = hasAvatar
    ? `http://localhost:8000/storage/${apiUser.avatar}`
    : null;
  return {
    uid: String(apiUser.id),
    displayName: apiUser.name,
    email: apiUser.email,
    photoUrl: avatarUrl,
    role: (apiUser.role === 'staff' ? 'staff' : 'user') as 'user' | 'staff',
    wishlist: [],
  };
}

export function mapApiOrderToOrder(apiOrder: ApiOrder) {
  return {
    id: String(apiOrder.id),
    userId: String(apiOrder.user_id),
    items: (apiOrder.items || []).map((item) => {
      // Check if this is a course item
      const isCourse = item.course_id && !item.book_id;
      
      if (isCourse && item.course) {
        // Course item
        return {
          type: 'course',
          courseId: String(item.course_id),
          bookId: null,
          title: item.course?.title || 'Unknown Course',
          author: item.course?.instructor || 'Unknown',
          instructor: item.course?.instructor || 'Unknown',
          price: parseFloat(item.price),
          quantity: item.quantity,
          coverUrl: item.course?.image
            ? (item.course.image.startsWith('http') ? item.course.image : `http://localhost:8000/storage/${item.course.image}`)
            : `https://picsum.photos/seed/course${item.course_id}/400/600`,
          slug: item.course?.slug || '',
          course: item.course,
        };
      } else {
        // Book item
        return {
          type: 'book',
          bookId: String(item.book_id),
          courseId: null,
          title: item.book?.title || 'Unknown',
          author: item.book?.author || 'Unknown',
          price: parseFloat(item.price),
          quantity: item.quantity,
          coverUrl: item.book?.image
            ? (item.book.image.startsWith('http') ? item.book.image : `http://localhost:8000/storage/${item.book.image}`)
            : `https://picsum.photos/seed/book${item.book_id}/400/600`,
        };
      }
    }),
    total: parseFloat(apiOrder.total),
    status: apiOrder.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
    paymentMethod: apiOrder.payment_method || 'Unknown',
    createdAt: apiOrder.created_at,
  };
}
