export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  coverUrl: string;
  previewContent: string[];
  previewImages?: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  rating: number;
  submittedBy?: string; // userId of the staff who submitted
  status?: 'pending' | 'approved' | 'rejected' | 'draft' | 'pending_deletion';
}

export interface CategoryRequest {
  id: string;
  type: 'add' | 'delete';
  category: string;
  submittedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface QandA {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  question: string;
  answer?: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoUrl: string | null;
  role: 'user' | 'staff';
  wishlist?: string[];
}

export interface CartItem {
  bookId: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
  coverUrl: string;
  stock: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
  shippingAddress?: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  statusHistory?: { status: string; date: string; note?: string }[];
}
