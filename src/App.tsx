/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  GraduationCap, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Headphones, 
  FileSpreadsheet, 
  ChevronRight,
  Star,
  Lock,
  Crown,
  MessageSquare
} from 'lucide-react';
import { 
  Product, 
  Course, 
  Order, 
  GoogleSheetConfig, 
  NotificationItem, 
  CourseRegistration,
  User as UserType,
  CustomerSettings,
  BroadcastCourseAd
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_COURSES, 
  INITIAL_ORDERS, 
  INITIAL_GSHEET_CONFIG, 
  INITIAL_NOTIFICATIONS, 
  CATEGORIES 
} from './data/mockData';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CoursesSection } from './components/CoursesSection';
import { AdminDashboard } from './components/AdminDashboard';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { CustomerSettingsModal } from './components/CustomerSettingsModal';
import { OwnerSettingsModal } from './components/OwnerSettingsModal';
import { ContactOwnerModal } from './components/ContactOwnerModal';

export default function App() {
  // Store Data States
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('soldeya_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('soldeya_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('soldeya_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [courseRegistrations, setCourseRegistrations] = useState<CourseRegistration[]>(() => {
    const saved = localStorage.getItem('soldeya_course_registrations');
    return saved ? JSON.parse(saved) : [
      {
        id: 'REG-101',
        courseId: 'course-1',
        courseTitle: 'دورة التجارة الإلكترونية المحلية والدفع عند الاستلام بالمغرب COD',
        courseDomain: 'التجارة الإلكترونية (E-commerce COD)',
        selectedSpecialization: 'التجارة الإلكترونية والدفع عند الاستلام',
        agreedAxes: ['اختيار المنتجات الرابحة والمربحة محلياً', 'إنشاء صفحات هبوط سريعة ومقنعة للزبون', 'إطلاق الحملات الإعلانية على فيسبوك وتيك توك'],
        whatsappNumber: '0661998877',
        visitorName: 'رضوان العمراني',
        status: 'new' as const,
        date: '2026-10-04 12:30',
        syncedToGoogleSheets: true
      }
    ];
  });

  const [sheetConfig, setSheetConfig] = useState<GoogleSheetConfig>(() => {
    const saved = localStorage.getItem('soldeya_sheet_config');
    return saved ? JSON.parse(saved) : INITIAL_GSHEET_CONFIG;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('soldeya_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Broadcasted Course Ads to Other Stores
  const [broadcastAds, setBroadcastAds] = useState<BroadcastCourseAd[]>(() => {
    const saved = localStorage.getItem('soldeya_broadcast_ads');
    return saved ? JSON.parse(saved) : [
      {
        id: 'AD-991',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
        description: 'تكوين تطبيقي عملي في التجارة الإلكترونية والدفع عند الاستلام بالمغرب COD مع مرافقة يومية لتحقيق أولى مبيعاتك.',
        specialization: 'التجارة الإلكترونية والدفع عند الاستلام',
        price: 490,
        targetStoreId: 'STORE-CASABLANCA-01',
        broadcastDate: '2026-10-04',
        status: 'active'
      }
    ];
  });

  // Current Authenticated User (Owner vs Customer)
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem('soldeya_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Customer Settings State
  const [customerSettings, setCustomerSettings] = useState<CustomerSettings>(() => {
    const saved = localStorage.getItem('soldeya_customer_settings');
    return saved ? JSON.parse(saved) : {
      name: 'زبون صولديا',
      email: 'customer@soldeya.ma',
      phone: '0661234567',
      city: 'الدار البيضاء (Casablanca)',
      address: 'شارع أنفا رقم 12',
      language: 'ar' as const,
      notificationsEnabled: true
    };
  });

  // UI Navigation & Filters
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'courses' | 'admin' | 'cart'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('جميع الأصناف');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isOwnerSettingsOpen, setIsOwnerSettingsOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Open appropriate settings based on user role
  const handleOpenSettings = () => {
    if (currentUser?.role === 'owner' || activeTab === 'admin') {
      setIsOwnerSettingsOpen(true);
    } else {
      setIsSettingsModalOpen(true);
    }
  };

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('soldeya_dark_mode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Sync Dark Mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('soldeya_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('soldeya_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('soldeya_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('soldeya_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('soldeya_course_registrations', JSON.stringify(courseRegistrations));
  }, [courseRegistrations]);

  useEffect(() => {
    localStorage.setItem('soldeya_sheet_config', JSON.stringify(sheetConfig));
  }, [sheetConfig]);

  useEffect(() => {
    localStorage.setItem('soldeya_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('soldeya_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('soldeya_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('soldeya_customer_settings', JSON.stringify(customerSettings));
  }, [customerSettings]);

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'جميع الأصناف' || p.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle Login Success (Owner vs Customer)
  const handleLoginSuccess = (user: UserType) => {
    setCurrentUser(user);
    if (user.role === 'owner') {
      setActiveTab('admin');
    } else {
      setCustomerSettings(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        city: user.city || prev.city,
        address: user.address || prev.address
      }));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    if (activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  // Add Product from Owner
  const handleAddNewProduct = (newProdData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]);

    // Send Notification to all Customers
    const notifItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'منتج جديد في صولديا!',
      message: `تمت إضافة "${newProduct.title}" بسعر ${newProduct.price} درهم مع التوصيل المجاني.`,
      type: 'new_product',
      targetId: newProduct.id,
      timestamp: 'الآن',
      read: false,
      imageUrl: newProduct.images[0]
    };
    setNotifications(prev => [notifItem, ...prev]);

    // Browser Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('منتج جديد متاح في متجر صولديا!', {
          body: `${newProduct.title} بسعر ${newProduct.price} درهم`,
          icon: newProduct.images[0]
        });
      } catch (e) {
        console.error('Notification error:', e);
      }
    }
  };

  // Add Course from Owner
  const handleAddNewCourse = (newCourseData: Omit<Course, 'id' | 'createdAt'>) => {
    const newCourse: Course = {
      ...newCourseData,
      id: `course-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setCourses(prev => [newCourse, ...prev]);

    const notifItem: NotificationItem = {
      id: `notif-course-${Date.now()}`,
      title: 'دورة تدريبية جديدة متاحة للتسجيل',
      message: `تم فتح باب الحجز في "${newCourse.title}" في مجال ${newCourse.domain}.`,
      type: 'course',
      targetId: newCourse.id,
      timestamp: 'الآن',
      read: false
    };
    setNotifications(prev => [notifItem, ...prev]);
  };

  // Handle Course Lead Registration from Visitor
  const handleCourseRegistration = (data: Omit<CourseRegistration, 'id' | 'date' | 'syncedToGoogleSheets'>) => {
    const nowStr = new Date().toLocaleString('ar-MA');
    const newReg: CourseRegistration = {
      ...data,
      id: `REG-${Date.now().toString().slice(-4)}`,
      date: nowStr,
      status: 'new',
      syncedToGoogleSheets: true
    };
    setCourseRegistrations(prev => [newReg, ...prev]);

    // Send Real-Time Notification to Store Owner
    const ownerNotif: NotificationItem = {
      id: `notif-course-${Date.now()}`,
      title: `تسجيل جديد في التكوين: ${data.visitorName || 'مستفيد'}`,
      message: `سجل المستفيد: ${data.visitorName} في دورة "${data.courseTitle}" (المجال: ${data.courseDomain}) - التخصص: ${data.selectedSpecialization} - الهاتف: ${data.whatsappNumber}`,
      type: 'course',
      recipientRole: 'owner',
      targetId: data.courseId,
      timestamp: 'الآن',
      read: false
    };
    setNotifications(prev => [ownerNotif, ...prev]);
  };

  // Handle Direct Message from Visitor to Owner
  const handleSendVisitorMessage = (msgData: { senderName: string; phone: string; subject: string; message: string }) => {
    const notifItem: NotificationItem = {
      id: `notif-msg-${Date.now()}`,
      title: `رسالة جديدة من: ${msgData.senderName}`,
      message: `الموضوع: ${msgData.subject} | الهاتف: ${msgData.phone} | النص: "${msgData.message}"`,
      type: 'message',
      recipientRole: 'owner',
      timestamp: 'الآن',
      read: false
    };
    setNotifications(prev => [notifItem, ...prev]);
  };

  // Export Courses Registrations to CSV
  const handleExportCoursesCSV = () => {
    const headers = ['رقم التسجيل', 'التاريخ', 'اسم المستفيد', 'رقم الواتساب', 'اسم الدورة', 'المجال', 'التخصص المختار', 'المحاور المطلوبة'];
    const rows = courseRegistrations.map(r => [
      r.id,
      r.date,
      r.visitorName,
      r.whatsappNumber,
      `"${r.courseTitle.replace(/"/g, '""')}"`,
      `"${r.courseDomain.replace(/"/g, '""')}"`,
      `"${r.selectedSpecialization.replace(/"/g, '""')}"`,
      `"${r.agreedAxes.join(' | ').replace(/"/g, '""')}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `soldeya_courses_sheet_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Place Order Handler
  const handlePlaceOrder = (orderData: Partial<Order>) => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: orderData.customerName || customerSettings.name || 'زبون صولديا',
      phone: orderData.phone || customerSettings.phone || '',
      city: orderData.city || customerSettings.city || 'الدار البيضاء',
      address: orderData.address || customerSettings.address || '',
      items: orderData.items || [],
      totalPrice: orderData.totalPrice || 0,
      shipping: 0,
      status: 'new',
      createdAt: new Date().toISOString(),
      notes: orderData.notes,
      syncedToGoogleSheet: true
    };
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);

    // Customer Notification
    const notifItemCustomer: NotificationItem = {
      id: `notif-ord-${Date.now()}`,
      title: 'تم تسجيل طلبك بنجاح',
      message: `طلبك رقم #${newOrder.id} بقيمة ${newOrder.totalPrice} درهم قيد التجهيز للتوصيل إلى ${newOrder.city}.`,
      type: 'order',
      recipientRole: 'customer',
      timestamp: 'الآن',
      read: false
    };

    // Real-Time Notification for Store Owner
    const notifItemOwner: NotificationItem = {
      id: `notif-ord-owner-${Date.now()}`,
      title: `طلب شراء جديد: ${newOrder.customerName}`,
      message: `طلب جديد #${newOrder.id} بقيمة ${newOrder.totalPrice} درهم بمدينة ${newOrder.city} - الهاتف: ${newOrder.phone} - جاهز للشحن والدفع عند الاستلام.`,
      type: 'order',
      recipientRole: 'owner',
      timestamp: 'الآن',
      read: false
    };
    setNotifications(prev => [notifItemOwner, notifItemCustomer, ...prev]);
  };

  // Cart operations
  const handleAddToCart = (product: Product, selectedColor?: string, quantity: number = 1) => {
    const existingIndex = cartItems.findIndex(
      item => item.product.id === product.id && item.selectedColor === selectedColor
    );
    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      setCartItems([...cartItems, { product, selectedColor, quantity }]);
    }
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    const updated = [...cartItems];
    updated[index].quantity = quantity;
    setCartItems(updated);
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  // Export orders to CSV
  const handleExportOrdersCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Phone', 'City', 'Address', 'Products', 'Color', 'Total (MAD)', 'Status', 'Date'];
    const rows = orders.map(o => [
      o.id,
      `"${o.customerName}"`,
      `"${o.phone}"`,
      `"${o.city}"`,
      `"${o.address}"`,
      `"${o.items.map(i => `${i.productTitle} (x${i.quantity})`).join(', ')}"`,
      `"${o.items.map(i => i.selectedColor || '-').join(', ')}"`,
      o.totalPrice,
      o.status,
      `"${new Date(o.createdAt).toLocaleDateString('ar-MA')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `طلبات_متجر_صولديا_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleGoHome = () => {
    setActiveTab('home');
    setSelectedCategory('جميع الأصناف');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isOwner = currentUser?.role === 'owner';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 flex flex-col transition-colors duration-300">
      
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notifications={notifications}
        markAllNotificationsAsRead={markAllNotificationsAsRead}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenSettingsModal={handleOpenSettings}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        onSelectProductNotification={(prodId) => {
          const prod = products.find(p => p.id === prodId);
          if (prod) {
            setSelectedProduct(prod);
          }
        }}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-12 pb-16">
            
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-950/30 dark:via-gray-950 py-10 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200/50 dark:border-gray-800/50">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Hero Content */}
                  <div className="lg:col-span-7 space-y-6 text-right">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black shadow-xs">
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>متجر صولديا - منصتك الأولى للتسوق والتكوينات بالمغرب</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                      أفضل المنتجات الحصرية <br />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        مع الدفع عند الاستلام والتوصيل السريع
                      </span>
                    </h1>

                    <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
                      نوفر لك أحدث الأجهزة الذكية، الإلكترونيات، والساعات العصرية بأفضل الأسعار، بالإضافة إلى دورات تدريبية عملية في التجارة الإلكترونية لمساعدتك في بناء مشروعك الخاص.
                    </p>

                    {/* Action CTA Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          setActiveTab('products');
                          setSelectedCategory('جميع الأصناف');
                        }}
                        className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>تصفح المنتجات ({products.length})</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('courses')}
                        className="px-6 py-3.5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl font-bold text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <GraduationCap className="w-4 h-4 text-amber-500" />
                        <span>أكاديمية التكوينات</span>
                      </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-gray-200 dark:border-gray-800 text-xs">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Truck className="w-5 h-5 text-emerald-500 shrink-0" />
                        <div>
                          <div className="font-bold">توصيل سريع</div>
                          <div className="text-[10px] text-gray-400">لكافة مدن المغرب</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                        <div>
                          <div className="font-bold">ضمان الجودة</div>
                          <div className="text-[10px] text-gray-400">معاينة قبل الدفع</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <RotateCcw className="w-5 h-5 text-emerald-500 shrink-0" />
                        <div>
                          <div className="font-bold">استبدال سهل</div>
                          <div className="text-[10px] text-gray-400">ضمان 100%</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Headphones className="w-5 h-5 text-emerald-500 shrink-0" />
                        <div>
                          <div className="font-bold">دعم متواصل</div>
                          <div className="text-[10px] text-gray-400">عبر الواتساب</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Hero Feature Card */}
                  <div className="lg:col-span-5 relative">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2">
                      <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={products[0]?.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'}
                          alt="المنتج المميز"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                          عرض خاص ومميز
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-400">{products[0]?.category}</span>
                          <span className="text-amber-500 font-bold flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {products[0]?.rating}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1 mb-2">
                          {products[0]?.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                            {products[0]?.price} درهم
                          </div>
                          <button
                            onClick={() => setSelectedProduct(products[0])}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            طلب المنتج الآن
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Categories Carousel */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                  أصناف المنتجات
                </h2>
                <button
                  onClick={() => {
                    setActiveTab('products');
                    setSelectedCategory('جميع الأصناف');
                  }}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>عرض الكل</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setActiveTab('products');
                      }}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 border cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                          : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-emerald-500'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Products Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                    منتجات مختارة لك
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    اختر منتجك المفضل وسيصلك إلى باب المنزل مع الدفع عند الاستلام
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {filteredProducts.length} منتج متاح
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onOpenDetail={(p) => setSelectedProduct(p)}
                    onAddToCart={(p) => handleAddToCart(p, p.colors?.[0]?.name, 1)}
                  />
                ))}
              </div>
            </section>

            {/* Courses Banner on Home */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl space-y-4 text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
                    <GraduationCap className="w-4 h-4 text-amber-300" />
                    <span>أكاديمية صولديا</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black leading-tight">
                    تعلّم أسرار التجارة الإلكترونية بالمغرب وحقق أولى مبيعاتك
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                    دورات تطبيقية شاملة مع مرافقة شخصية ونظام تسجيل مباشر يتم حفظه في قاعدة بيانات المتجر السحابية.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveTab('courses')}
                      className="px-6 py-3 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-extrabold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
                    >
                      استكشف الدورات المتاحة
                    </button>
                    {isOwner && (
                      <a
                        href={sheetConfig.coursesSheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 bg-emerald-700/60 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 border border-emerald-400/30 transition-all"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Google Sheet للمسجلين</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-800 gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                  كتالوج منتجات صولديا
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  تصفح المنتجات المتوفرة واطلب مباشرة مع خدمة الدفع عند الاستلام
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8">
                <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-bold text-base text-gray-900 dark:text-white">لا توجد منتجات مطابقة للبحث</h3>
                <p className="text-xs text-gray-400 mt-1">جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً</p>
                <button
                  onClick={() => {
                    setSelectedCategory('جميع الأصناف');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  إعادة ضبط البحث
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onOpenDetail={(p) => setSelectedProduct(p)}
                    onAddToCart={(p) => handleAddToCart(p, p.colors?.[0]?.name, 1)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: COURSES */}
        {activeTab === 'courses' && (
          <CoursesSection
            courses={courses}
            onRegisterCourse={handleCourseRegistration}
            registeredList={courseRegistrations}
          />
        )}

        {/* VIEW 4: ADMIN DASHBOARD (STRICTLY FOR STORE OWNER) */}
        {activeTab === 'admin' && (
          isOwner ? (
            <AdminDashboard
              orders={orders}
              products={products}
              sheetConfig={sheetConfig}
              onUpdateSheetConfig={setSheetConfig}
              onAddProduct={handleAddNewProduct}
              onDeleteProduct={(id) => setProducts(products.filter(p => p.id !== id))}
              onUpdateOrderStatus={(id, status) => {
                setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
              }}
              onExportOrdersCSV={handleExportOrdersCSV}
              onOpenProductLanding={(p) => setSelectedProduct(p)}
              currentUser={currentUser}
              onUpdateOwnerProfile={(updated) => setCurrentUser(updated)}
            />
          ) : (
            /* Secure Access Gate if Non-Owner attempts to open admin */
            <div className="max-w-md mx-auto px-4 py-16 sm:py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-4 shadow-md">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-2">
                لوحة الإدارة خاصة بمالك المتجر
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                يرجى تسجيل الدخول بحساب مالك المتجر المعتمد للوصول إلى لوحة العمليات المركزية.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>تسجيل دخول المالك</span>
              </button>
            </div>
          )
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, color, qty) => {
            handleAddToCart(p, color, qty);
            setSelectedProduct(null);
          }}
          onDirectOrder={(order) => {
            handlePlaceOrder(order);
          }}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onPlaceOrder={(order) => {
          handlePlaceOrder(order);
        }}
      />

      {/* Authentication Modal (Owner & Customer) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Customer Settings Modal (Language & Personal Info) */}
      <CustomerSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={customerSettings}
        onSaveSettings={(newSettings) => setCustomerSettings(newSettings)}
      />

      {/* Owner Settings Modal (Credentials & Store Configuration) */}
      <OwnerSettingsModal
        isOpen={isOwnerSettingsOpen}
        onClose={() => setIsOwnerSettingsOpen(false)}
        currentUser={currentUser}
        onSaveOwnerProfile={(updatedOwner) => setCurrentUser(updatedOwner)}
      />

      {/* Visitor Contact Owner Modal */}
      <ContactOwnerModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSendMessage={handleSendVisitorMessage}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-xs py-10 px-4 sm:px-6 lg:px-8 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-right">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs font-mono tracking-wider flex items-center justify-center">
                SOLDEYA
              </div>
              <span className="font-extrabold text-base text-gray-900 dark:text-white">متجر صولديا | SOLDEYA</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              منصة التسوق والتكوينات الاحترافية الرائدة بالمغرب. منتجات مميزة، دفع عند الاستلام، وتدريبات تطبيقية.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-3">روابط سريعة</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>
                <button onClick={handleGoHome} className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer">
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('products'); setSelectedCategory('جميع الأصناف'); }} className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer">
                  كتالوج المنتجات
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('courses')} className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer">
                  أكاديمية التكوينات
                </button>
              </li>
              <li>
                <button onClick={handleOpenSettings} className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer">
                  إعدادات الحساب
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-3">سياسات المتجر</h4>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400">
              <li>الدفع نقداً عند الاستلام COD</li>
              <li>التوصيل لجميع مدن المملكة</li>
              <li>معاينة المنتج قبل الدفع</li>
              <li>ضمان الاستبدال خلال 7 أيام</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-3">إدارة المتجر</h4>
            <p className="text-gray-500 dark:text-gray-400 mb-3">
              منطقة مخصصة لإدارة العمليات والمزامنة السحابية.
            </p>
            {isOwner ? (
              <button
                onClick={() => setActiveTab('admin')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-gray-950 font-bold rounded-xl text-xs shadow-xs cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>لوحة تحكم المتجر</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>دخول الإدارة</span>
              </button>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between text-gray-400 text-[11px] gap-2">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} متجر صولديا (SOLDEYA Store).
          </div>
          <div className="flex items-center gap-3">
            <span>الدار البيضاء، المملكة المغربية</span>
            <span>•</span>
            <span>الدرهم المغربي (MAD)</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Quick Contact Button (أيقونة وتساب فقط للزائر والمالك) */}
      {activeTab !== 'admin' && (
        <a
          href="https://wa.me/212600000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%85%D8%AA%D8%AC%D8%B1%20%D8%B5%D9%88%D9%84%D8%AF%D9%8A%D8%A7%20SOLDEYA"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-30 p-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center border-2 border-white/70 cursor-pointer shadow-emerald-900/30"
          title="تواصل عبر الواتساب"
          aria-label="واتساب"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </a>
      )}
    </div>
  );
}
