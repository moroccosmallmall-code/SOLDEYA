import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Star, 
  ShoppingBag, 
  Phone, 
  User, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  AlertCircle,
  Layers,
  Calculator,
  TrendingDown,
  Palette
} from 'lucide-react';
import { Product, ProductColor, Order } from '../types';
import { MOROCCAN_CITIES } from '../data/mockData';
import { ImageZoomViewer } from './ImageZoomViewer';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor?: string, quantity?: number) => void;
  onDirectOrder: (orderData: Partial<Order>) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectOrder
}) => {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'افتراضي', hex: '#10b981', inStock: true }
  );
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(MOROCCAN_CITIES[0]);
  const [address, setAddress] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Prices calculation
  const originalPrice = product.originalPrice || Math.round(product.price * 1.5);
  const realPrice = product.price;
  const wholesalePrice = product.wholesalePrice || Math.round(product.price * 0.65);

  const totalOriginal = originalPrice * quantity;
  const totalReal = realPrice * quantity;
  const totalWholesale = wholesalePrice * quantity;
  const totalSavings = totalOriginal - totalReal;
  const discountPercentage = Math.round(((originalPrice - realPrice) / originalPrice) * 100);

  // Handle direct COD order submission
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setOrderError('يرجى ملء كافة البيانات المطلوبة (الاسم، الهاتف، العنوان)');
      return;
    }
    if (phone.trim().length < 9) {
      setOrderError('يرجى إدخال رقم هاتف مغربي صحيح (مثال: 0612345678)');
      return;
    }

    setOrderError('');
    const newOrder: Partial<Order> = {
      customerName,
      phone,
      city,
      address,
      items: [
        {
          productId: product.id,
          productTitle: product.title,
          quantity,
          price: realPrice,
          selectedColor: selectedColor.name,
          image: selectedColor.image || product.images[0]
        }
      ],
      totalPrice: totalReal,
      shipping: 0,
      status: 'new',
      notes: `اللون: ${selectedColor.name} | الكمية: ${quantity} | التوفير: ${totalSavings} درهم`
    };

    onDirectOrder(newOrder);
    setOrderSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-gray-800 my-auto text-right">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {orderSubmitted ? (
          /* Order Confirmation Screen */
          <div className="p-8 sm:p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-6 shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
              تم استلام طلبك بنجاح!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto text-sm leading-relaxed mb-6">
              شكراً لثقتك في <strong className="text-emerald-600">متجر صولديا SOLDEYA</strong>. سيتصل بك فريق خدمة العملاء خلال ساعات لتأكيد الطلب وتوصيله إلى <strong className="text-emerald-600">{city}</strong>.
            </p>

            <div className="bg-gray-50 dark:bg-gray-800/60 p-5 rounded-2xl max-w-md mx-auto text-right text-xs space-y-2 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between font-bold text-gray-800 dark:text-gray-200">
                <span>المنتج:</span>
                <span className="truncate max-w-56">{product.title}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>اللون المختار:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedColor.name}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>الكمية:</span>
                <span>{quantity} قطع</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>المبلغ الإجمالي:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{totalReal} درهم</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold pt-1 border-t border-gray-200 dark:border-gray-700">
                <span>مصاريف التوصيل:</span>
                <span>مجاناً لجميع مدن المغرب</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer"
            >
              متابعة التسوق في المتجر
            </button>
          </div>
        ) : (
          /* Main Product Layout */
          <div className="p-5 sm:p-8 space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              
              {/* Media Gallery Column */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <ImageZoomViewer
                    images={product.images}
                    videoUrl={product.videoUrl}
                    selectedColorName={selectedColor.name}
                    altText={product.title}
                  />

                  {/* LANDING PAGE BROWSING BAR (NO DOWNLOAD) */}
                  <div className="mt-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white">
                          صفحة هبوط المنتج الرسمية
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">
                          تصفح المواصفات الكاملة والضمان مع الدفع عند الاستلام
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                      معاينة مباشرة
                    </span>
                  </div>

                  {/* IMTIAZAT COLOR TRACKING PRIVILEGES BELOW FRAME */}
                  <div className="mt-2.5 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-800/80 border border-emerald-200 dark:border-emerald-800/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-emerald-600" />
                        <span>امتيازات اللون المختار:</span>
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        تحديث فوري
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-4 h-4 rounded-full border border-gray-300 shadow-xs"
                          style={{ backgroundColor: selectedColor.hex }}
                        />
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          اللون المتاح: {selectedColor.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        {selectedColor.inStock !== false ? 'جاهز للشحن الفوري' : 'غير متوفر حالياً'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-gray-600 dark:text-gray-400">
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">توصيل سريع</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">ضمان الجودة</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center gap-1">
                    <RotateCcw className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">استبدال سهل</span>
                  </div>
                </div>
              </div>

              {/* Product Details & Automatic Prices Combination Column */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-md">
                      {product.category}
                    </span>
                    {product.rating && (
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-gray-400 text-[11px]">({product.reviewsCount || 48} تقييم)</span>
                      </div>
                    )}
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-snug">
                    {product.title}
                  </h1>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* AUTOMATIC PRICING COMBINATION BOX */}
                  <div className="my-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-900 dark:text-white">
                        <Calculator className="w-4 h-4 text-emerald-600" />
                        <span>حساب الأسعار والخصم التلقائي:</span>
                      </div>
                      <span className="text-xs bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 font-black px-2 py-0.5 rounded-md">
                        خصم {discountPercentage}%
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      {/* 1. السعر الأصلي */}
                      <div className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                        <span className="text-[10px] text-gray-400 font-bold block mb-0.5">قبل التخفيض:</span>
                        <span className="text-sm font-bold text-gray-400 line-through">
                          {totalOriginal} درهم
                        </span>
                        <span className="text-[9px] text-gray-400 block mt-0.5">سعر السوق</span>
                      </div>

                      {/* 2. السعر الحالي للبيع */}
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-500 shadow-2xs">
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-extrabold block mb-0.5">سعر العرض اليوم:</span>
                        <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                          {totalReal} درهم
                        </span>
                        <span className="text-[9px] text-emerald-700 dark:text-emerald-300 font-bold block mt-0.5">توصيل مجاني</span>
                      </div>

                      {/* 3. سعر الجملة التقريبي */}
                      <div className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                        <span className="text-[10px] text-gray-500 font-bold block mb-0.5">سعر الجملة:</span>
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                          {totalWholesale} درهم
                        </span>
                        <span className="text-[9px] text-gray-400 block mt-0.5">تكلفة المورد</span>
                      </div>
                    </div>

                    {/* Automatic calculation summary */}
                    <div className="p-2.5 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <TrendingDown className="w-4 h-4 text-emerald-600" />
                        <span>مجموع التوفير الحقيقي لك:</span>
                      </span>
                      <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">
                        {totalSavings} درهم
                      </span>
                    </div>
                  </div>

                  {/* COLOR SELECTION & DYNAMIC BOX */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mb-4 p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                          اختر اللون المفضل:
                        </label>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          {selectedColor.name}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {product.colors.map((c) => {
                          const isSelected = selectedColor.name === c.name;
                          return (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => setSelectedColor(c)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-emerald-500 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 shadow-xs ring-2 ring-emerald-500/20'
                                  : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                              }`}
                            >
                              <span 
                                className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shrink-0" 
                                style={{ backgroundColor: c.hex }}
                              />
                              <span>{c.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Dynamic Box below Color Selection */}
                      <div className="mt-3 p-2.5 rounded-xl bg-white dark:bg-gray-800 border-2 border-emerald-500/40 shadow-xs flex items-center justify-between animate-in fade-in duration-200">
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="w-7 h-7 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                            style={{ backgroundColor: selectedColor.hex }}
                          >
                            <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-sm" />
                          </div>
                          <div>
                            <div className="text-xs font-extrabold text-gray-900 dark:text-white">
                              اللون المختار: {selectedColor.name}
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">
                              {selectedColor.inStock !== false ? 'متوفر وجاهز للشحن الفوري' : 'غير متوفر حالياً'}
                            </div>
                          </div>
                        </div>
                        <span className="font-mono text-[11px] text-gray-400">{selectedColor.hex}</span>
                      </div>
                    </div>
                  )}

                  {/* Quantity Control & Add To Cart */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">الكمية:</span>
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 p-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-7 h-7 rounded-lg hover:bg-white dark:hover:bg-gray-700 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-9 text-center font-bold text-sm text-gray-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-7 h-7 rounded-lg hover:bg-white dark:hover:bg-gray-700 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddToCart(product, selectedColor.name, quantity)}
                      className="flex-1 py-2 px-3 border border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>إضافة للسلة ({totalReal} درهم)</span>
                    </button>
                  </div>

                  {/* COD Fast Order Form */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 dark:from-gray-800 dark:to-gray-800/80 border border-emerald-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">
                        طلب مباشر وسريع (الدفع عند الاستلام بالمغرب):
                      </h3>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                        توصيل مجاني
                      </span>
                    </div>

                    {orderError && (
                      <div className="mb-2 p-2 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{orderError}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmitOrder} className="space-y-2.5">
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="الاسم الكامل"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 pr-9 pl-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden"
                        />
                        <User className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>

                      <div className="relative">
                        <input
                          type="tel"
                          required
                          placeholder="رقم الهاتف (مثال: 0612345678)"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 pr-9 pl-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden font-mono"
                        />
                        <Phone className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="relative">
                          <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 pr-8 pl-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden appearance-none"
                          >
                            {MOROCCAN_CITIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <MapPin className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        <div>
                          <input
                            type="text"
                            required
                            placeholder="عنوان التوصيل (الحي، الشارع، رقم المنزل)"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-extrabold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>تأكيد الطلب الآن ({totalReal} درهم)</span>
                          <Check className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-center text-[10px] text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5 pt-1">
                        <span>الدفع نقداً بعد المعاينة عند الاستلام</span>
                        <span>•</span>
                        <span>توصيل سريع لباب منزلك</span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* LANDING PAGE EXTENDED FEATURES LIST */}
            {product.landingFeatures && product.landingFeatures.length > 0 && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>مميزات ومواصفات المنتج:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {product.landingFeatures.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
