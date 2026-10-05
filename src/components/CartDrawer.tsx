import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, MapPin, User, Phone, CheckCircle2 } from 'lucide-react';
import { Product, Order } from '../types';
import { MOROCCAN_CITIES } from '../data/mockData';

export interface CartItem {
  product: Product;
  selectedColor?: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onPlaceOrder: (order: Partial<Order>) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(MOROCCAN_CITIES[0]);
  const [address, setAddress] = useState('');
  const [orderDone, setOrderDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setErrorMessage('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setErrorMessage('');
    onPlaceOrder({
      customerName,
      phone,
      city,
      address,
      items: cartItems.map(item => ({
        productId: item.product.id,
        productTitle: item.product.title,
        quantity: item.quantity,
        price: item.product.price,
        selectedColor: item.selectedColor,
        image: item.product.images[0]
      })),
      totalPrice: subtotal,
      shipping: 0,
      status: 'new'
    });
    setOrderDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-gray-200 dark:border-gray-800">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="font-black text-base text-gray-900 dark:text-white">سلة المشتريات</h2>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
              {cartItems.length} عناصر
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto">
          {orderDone ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">تم تسجيل طلبك بنجاح!</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-6">
                سيتصل بك موزع صولديا لتسليم طلبيتك إلى عنوانك بمدينة {city}.
              </p>
              <button
                onClick={() => {
                  setOrderDone(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                متابعة التسوق
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-xs">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>سلتك فارغة حالياً</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
                >
                  <img src={item.product.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                      {item.product.title}
                    </h4>
                    {item.selectedColor && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                        اللون المختار: {item.selectedColor}
                      </span>
                    )}
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      {item.product.price} درهم
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-0.5 text-xs font-bold">
                        <button
                          onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                          className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="text-gray-400 hover:text-red-500 text-xs p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Fast Checkout in Drawer */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <h4 className="text-xs font-extrabold text-gray-900 dark:text-white mb-2">
                  بيانات التوصيل السريع (الدفع عند الاستلام)
                </h4>
                {errorMessage && (
                  <div className="text-xs text-red-500 mb-2 font-semibold">{errorMessage}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-2 text-xs">
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="الاسم الكامل"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 pr-8 pl-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 outline-hidden"
                    />
                    <User className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="رقم الهاتف (مثال: 0612345678)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 pr-8 pl-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 outline-hidden font-mono"
                    />
                    <Phone className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <div className="relative">
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 pr-8 pl-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 outline-hidden appearance-none"
                    >
                      {MOROCCAN_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <MapPin className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="العنوان الكامل للتوصل بالطلب"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 outline-hidden"
                  />
                  <div className="pt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>مجموع المنتجات:</span>
                      <span className="font-bold text-gray-900 dark:text-white">{subtotal} درهم</span>
                    </div>
                    <div className="flex justify-between text-xs text-emerald-600 font-bold mb-3">
                      <span>التوصيل:</span>
                      <span>مجاني</span>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow-lg transition-all cursor-pointer"
                    >
                      تأكيد الطلب الآن ({subtotal} درهم)
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
