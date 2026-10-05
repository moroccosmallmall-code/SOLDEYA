import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Bell, 
  Sun, 
  Moon, 
  User, 
  GraduationCap, 
  Home, 
  X, 
  Sparkles,
  Tag,
  CheckCircle2,
  ChevronLeft,
  Settings,
  LogOut,
  Crown,
  MessageSquare,
  Phone
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { NotificationItem, User as UserType } from '../types';

interface HeaderProps {
  activeTab: 'home' | 'products' | 'courses' | 'admin' | 'cart';
  setActiveTab: (tab: 'home' | 'products' | 'courses' | 'admin' | 'cart') => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  openCart: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  notifications: NotificationItem[];
  markAllNotificationsAsRead: () => void;
  currentUser: UserType | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onOpenSettingsModal: () => void;
  onOpenContactModal?: () => void;
  onSelectProductNotification?: (productId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  cartCount,
  openCart,
  darkMode,
  setDarkMode,
  notifications,
  markAllNotificationsAsRead,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenSettingsModal,
  onOpenContactModal,
  onSelectProductNotification
}) => {
  const [showSearchCategories, setShowSearchCategories] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'message' | 'order' | 'course'>('all');

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const isOwner = currentUser?.role === 'owner';

  // Multi-channel notifications: Owner receives buyer orders, learner registrations & messages; Customer receives products/offers
  const roleNotifications = notifications.filter(n => {
    if (isOwner) {
      return n.recipientRole === 'owner' || n.recipientRole === 'all' || !n.recipientRole;
    } else {
      return n.recipientRole === 'customer' || n.recipientRole === 'all' || !n.recipientRole;
    }
  });

  const unreadCount = roleNotifications.filter(n => !n.read).length;

  const relevantNotifications = roleNotifications.filter(n => {
    if (isOwner && notifFilter !== 'all') {
      return n.type === notifFilter;
    }
    return true;
  });

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchCategories(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCategoryFromSearch = (cat: string) => {
    setSelectedCategory(cat);
    setShowSearchCategories(false);
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setSelectedCategory('جميع الأصناف');
    setSearchQuery('');
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-xs transition-colors">
      
      {/* Slow Marquee Announcement Bar */}
      <div className="bg-emerald-600 dark:bg-emerald-700 text-white text-xs sm:text-sm py-2 px-3 overflow-hidden select-none border-b border-emerald-500/30">
        <div className="animate-slow-marquee flex items-center space-x-12 space-x-reverse whitespace-nowrap font-medium">
          <span className="flex items-center gap-2">
            <span>🚚 توصيل مجاني لجميع مدن المغرب</span>
          </span>
          <span className="text-emerald-200">✦</span>
          <span className="flex items-center gap-2">
            <span>💵 الدفع نقداً عند الاستلام COD</span>
          </span>
          <span className="text-emerald-200">✦</span>
          <span className="flex items-center gap-2">
            <span>🛡️ ضمان الجودة والمعاينة قبل الدفع</span>
          </span>
          <span className="text-emerald-200">✦</span>
          <span className="flex items-center gap-2">
            <span>🔄 استبدال واسترجاع سهل وسريع</span>
          </span>
          <span className="text-emerald-200">✦</span>
          <span className="flex items-center gap-2">
            <span>🎓 تكوينات ودورات احترافية في التجارة الإلكترونية والتسويق</span>
          </span>
          <span className="text-emerald-200">✦</span>
          <span className="flex items-center gap-2">
            <span>💬 خدمة دعم سريعة ومباشرة عبر الواتساب</span>
          </span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3 sm:gap-6">
          
          {/* Brand Logo & Home trigger */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handleGoHome}
              className="flex items-center gap-2.5 text-right group focus:outline-hidden cursor-pointer"
              title="الصفحة الرئيسية - SOLDEYA"
            >
              <div className="h-10 sm:h-12 px-3 sm:px-4 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform border border-white/20">
                <span className="font-black text-sm sm:text-base tracking-widest font-mono">SOLDEYA</span>
              </div>
              <div className="flex flex-col text-right">
                <div className="font-black text-base sm:text-lg text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">SOLDEYA</span>
                  <span className="text-gray-400 text-xs">|</span>
                  <span className="text-xs sm:text-sm font-extrabold text-gray-800 dark:text-gray-200">متجر صولديا</span>
                  <span className="hidden sm:inline-block text-[10px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded-sm">
                    المغرب
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium">SOLDEYA Store - تجارة وتكوينات</div>
              </div>
            </button>
          </div>

          {/* Search Bar with rectangular categories banner */}
          <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث في المتجر عن المنتجات والتصنيفات..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchCategories(true);
                }}
                onFocus={() => setShowSearchCategories(true)}
                onClick={() => setShowSearchCategories(true)}
                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pl-10 pr-11 py-2.5 rounded-xl text-sm border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-hidden font-sans"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                <Search className="w-4 h-4" />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* RECTANGULAR ALL-CATEGORIES BANNER (للزائر والمالك) */}
            {showSearchCategories && (
              <div className="absolute top-full right-0 left-0 sm:-right-6 sm:-left-6 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-black text-gray-900 dark:text-white block">
                        لافتة تصنيفات المتجر الشاملة (SOLDEYA)
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-gray-400 block font-medium">
                        عرض مستطيل شامل لجميع تصنيفات المتجر (متاح للزائر والمالك)
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowSearchCategories(false)}
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 px-2.5 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors font-bold"
                  >
                    إغلاق ✕
                  </button>
                </div>

                {/* Rectangular Categories Grid encompassing all categories */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CATEGORIES.map((category) => {
                    const isSelected = selectedCategory === category;
                    return (
                      <button
                        key={category}
                        onClick={() => handleSelectCategoryFromSearch(category)}
                        className={`text-right p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                            : 'bg-gray-50 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300'
                        }`}
                      >
                        <span className="truncate">{category}</span>
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>تصفح مستطيل وشامل لكافة تصنيفات متجر SOLDEYA</span>
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCategory('جميع الأصناف');
                      setSearchQuery('');
                      setShowSearchCategories(false);
                      setActiveTab('products');
                    }}
                    className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 rounded-xl font-bold text-xs transition-colors cursor-pointer border border-emerald-500/20"
                  >
                    عرض كل المنتجات
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={handleGoHome}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('products');
                setSelectedCategory('جميع الأصناف');
              }}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>المنتجات</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-amber-500" />
              <span>التكوينات</span>
            </button>

            {/* OWNER-ONLY DASHBOARD LINK: Visible only when logged in as Store Owner */}
            {isOwner && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 font-bold cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-gray-950 shadow-md ring-2 ring-amber-400/50'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-200'
                }`}
              >
                <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>لوحة تحكم المالك</span>
              </button>
            )}
          </nav>

          {/* Action Icons Bar */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* أيقونة وتساب فقط مكان عبارة راسل مالك المتجر (للزائر والمالك معاً) */}
            <a
              href="https://wa.me/212600000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%85%D8%AA%D8%AC%D8%B1%20%D8%B5%D9%88%D9%84%D8%AF%D9%8A%D8%A7%20SOLDEYA"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-all border border-emerald-500/30 flex items-center justify-center cursor-pointer shadow-2xs"
              title="تواصل عبر الواتساب"
              aria-label="واتساب"
            >
              <svg className="w-5 h-5 fill-current text-[#25D366]" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </a>

            {/* Customer / Owner Settings Icon */}
            <button
              onClick={onOpenSettingsModal}
              className="p-2 sm:p-2.5 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              title={isOwner ? "إعدادات المالك" : "إعدادات الحساب واللغة"}
              aria-label="الإعدادات"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:rotate-45 transition-transform" />
            </button>

            {/* Notification Bell Icon */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 sm:p-2.5 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                title={isOwner ? "إشعارات لوحة المالك" : "التنبيهات والعروض"}
                aria-label="التنبيهات"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute top-full left-0 sm:right-auto sm:left-0 w-80 sm:w-96 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3.5 z-50 text-right">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800 mb-2">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold text-sm text-gray-900 dark:text-white">
                        {isOwner ? 'تنبيهات الإدارة والطلبات' : 'التنبيهات والعروض'}
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
                      >
                        تعليم الكل كمقروء
                      </button>
                    )}
                  </div>

                  {/* Owner-Specific Category Filters */}
                  {isOwner && (
                    <div className="flex items-center gap-1 pb-2 mb-2 border-b border-gray-100 dark:border-gray-800 text-[11px] overflow-x-auto no-scrollbar">
                      <button
                        type="button"
                        onClick={() => setNotifFilter('all')}
                        className={`px-2 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                          notifFilter === 'all'
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        الكل ({notifications.filter(n => n.recipientRole === 'owner' || !n.recipientRole).length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotifFilter('message')}
                        className={`px-2 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                          notifFilter === 'message'
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        الرسائل
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotifFilter('order')}
                        className={`px-2 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                          notifFilter === 'order'
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        طلبات الشراء
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotifFilter('course')}
                        className={`px-2 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                          notifFilter === 'course'
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        تسجيل التكوينات
                      </button>
                    </div>
                  )}

                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {relevantNotifications.length === 0 ? (
                      <div className="text-center py-8 text-xs text-gray-400">
                        {isOwner ? 'لا توجد تنبيهات جديدة في هذا التصنيف' : 'لا توجد تنبيهات جديدة'}
                      </div>
                    ) : (
                      relevantNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-xl text-xs transition-colors flex flex-col gap-1.5 ${
                            notif.read
                              ? 'bg-gray-50/70 dark:bg-gray-800/40 text-gray-600 dark:text-gray-300 border border-transparent'
                              : isOwner
                                ? 'bg-amber-50/90 dark:bg-amber-950/50 text-gray-900 dark:text-white border border-amber-300 dark:border-amber-800/80 shadow-2xs'
                                : 'bg-emerald-50/70 dark:bg-emerald-950/40 text-gray-900 dark:text-white border-r-2 border-emerald-500'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {notif.type === 'message' ? (
                              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                                <MessageSquare className="w-4 h-4" />
                              </div>
                            ) : notif.type === 'order' ? (
                              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
                                <ShoppingBag className="w-4 h-4" />
                              </div>
                            ) : notif.type === 'course' ? (
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
                                <GraduationCap className="w-4 h-4" />
                              </div>
                            ) : notif.imageUrl ? (
                              <img
                                src={notif.imageUrl}
                                alt=""
                                className="w-8 h-8 rounded-lg object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                                <Sparkles className="w-4 h-4" />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="font-extrabold text-gray-900 dark:text-white flex items-center justify-between">
                                <span className="truncate">{notif.title}</span>
                                <span className="text-[10px] text-gray-400 font-normal shrink-0">{notif.timestamp}</span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 mt-0.5 leading-relaxed break-words">{notif.message}</p>
                            </div>
                          </div>

                          {/* Quick Interactive Actions for Owner */}
                          {isOwner && (
                            <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-amber-200/50 dark:border-amber-900/50 mt-1">
                              {notif.type === 'order' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab('admin');
                                    setShowNotifications(false);
                                  }}
                                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 shadow-2xs cursor-pointer"
                                >
                                  <span>عرض في الطلبات</span>
                                </button>
                              )}
                              {notif.type === 'course' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab('admin');
                                    setShowNotifications(false);
                                  }}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 shadow-2xs cursor-pointer"
                                >
                                  <span>عرض المستفيدين</span>
                                </button>
                              )}
                              {/* WhatsApp Direct Reply for Messages */}
                              {notif.type === 'message' && (
                                <a
                                  href={`https://wa.me/212600000000?text=${encodeURIComponent(`رد إدارة صولديا: بخصوص ${notif.title}`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 shadow-2xs"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>رد فوري</span>
                                </a>
                              )}
                            </div>
                          )}

                          {/* Customer Action */}
                          {!isOwner && notif.targetId && onSelectProductNotification && (
                            <div className="flex justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectProductNotification(notif.targetId!);
                                  setShowNotifications(false);
                                }}
                                className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                              >
                                معاينة العرض
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 sm:p-2.5 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              title={darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
              aria-label="تبديل المظهر"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Authentication / User Account Button */}
            <div className="relative" ref={userRef}>
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isOwner
                        ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {isOwner ? (
                      <Crown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                    <span className="hidden sm:inline truncate max-w-28">
                      {isOwner ? 'المالك' : currentUser.name}
                    </span>
                  </button>

                  {/* Logged in Dropdown */}
                  {showUserDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-50 text-right">
                      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 text-xs">
                        <div className="font-extrabold text-gray-900 dark:text-white flex items-center justify-between">
                          <span>{currentUser.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isOwner ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isOwner ? 'مالك المتجر' : 'زبون'}
                          </span>
                        </div>
                        <div className="text-gray-400 text-[10px] truncate mt-0.5">{currentUser.email}</div>
                      </div>

                      {isOwner && (
                        <button
                          onClick={() => {
                            setActiveTab('admin');
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-right px-3 py-2 rounded-lg text-xs hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold flex items-center justify-between mt-1 cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <Crown className="w-3.5 h-3.5" />
                            <span>لوحة تحكم المتجر</span>
                          </span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onOpenSettingsModal();
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-right px-3 py-2 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Settings className="w-3.5 h-3.5" />
                          <span>إعدادات الحساب</span>
                        </span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          onLogout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-right px-3 py-2 rounded-lg text-xs hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold flex items-center gap-1.5 border-t border-gray-100 dark:border-gray-800 mt-1 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Not logged in: Show Login / Register trigger */
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">دخول</span>
                </button>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden xs:inline">السلة</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-gray-900 font-extrabold text-xs px-1.5 py-0.2 rounded-full min-w-4 text-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-between border-t border-gray-100 dark:border-gray-800 py-2 overflow-x-auto no-scrollbar gap-2 text-xs font-semibold">
          <button
            onClick={handleGoHome}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 cursor-pointer ${
              activeTab === 'home'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>الرئيسية</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('products');
              setSelectedCategory('جميع الأصناف');
            }}
            className={`px-3 py-1.5 rounded-lg shrink-0 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <span>المنتجات</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
            <span>التكوينات</span>
          </button>

          {/* Owner Dashboard link only shown to owner on mobile */}
          {isOwner && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 font-bold cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-gray-900'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>لوحة المالك</span>
            </button>
          )}

          <button
            onClick={onOpenSettingsModal}
            className="px-2.5 py-1.5 rounded-lg shrink-0 text-gray-600 dark:text-gray-300 flex items-center gap-1 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>الإعدادات</span>
          </button>
        </div>
      </div>
    </header>
  );
};
