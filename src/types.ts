export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
  inStock?: boolean;
}

export type Language = 'ar' | 'fr' | 'en';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'customer';
  phone?: string;
  city?: string;
  address?: string;
}

export interface CustomerSettings {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  language: Language;
  notificationsEnabled: boolean;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  wholesalePrice?: number;
  category: string;
  description: string;
  images: string[];
  videoUrl?: string;
  colors: ProductColor[];
  landingFeatures?: string[];
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
  stockCount?: number;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  domain: string;
  axes: string[];
  price: number;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  specializations: string[];
  googleSheetUrl?: string;
  instructor?: string;
  duration?: string;
  description?: string;
  badge?: string;
  targetStoreId?: string;
  createdAt: string;
}

export interface BroadcastCourseAd {
  id: string;
  image: string;
  description: string;
  specialization: string;
  price: number;
  targetStoreId: string;
  broadcastDate: string;
  status: 'active' | 'sent';
}

export interface CourseRegistration {
  id: string;
  courseId: string;
  courseTitle: string;
  courseDomain: string;
  visitorName: string;
  whatsappNumber: string;
  selectedSpecialization: string;
  agreedAxes: string[];
  notes?: string;
  ownerNotes?: string;
  status?: 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
  price?: number;
  date: string;
  syncedToGoogleSheets: boolean;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  quantity: number;
  price: number;
  selectedColor?: string;
  image?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  shipping: number;
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  notes?: string;
  syncedToGoogleSheet?: boolean;
}

export interface GoogleSheetConfig {
  ordersSheetUrl: string;
  coursesSheetUrl: string;
  webhookUrl: string;
  autoSync: boolean;
  lastSyncTime?: string;
  status: 'connected' | 'disconnected' | 'testing';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'new_product' | 'order' | 'course' | 'system' | 'message';
  targetId?: string;
  timestamp: string;
  read: boolean;
  imageUrl?: string;
  recipientRole?: 'owner' | 'customer' | 'all';
}
