import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Save, 
  Eye, 
  EyeOff, 
  Store, 
  Check 
} from 'lucide-react';
import { User as UserType } from '../types';

interface OwnerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType | null;
  onSaveOwnerProfile: (updatedOwner: UserType) => void;
}

export const OwnerSettingsModal: React.FC<OwnerSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveOwnerProfile
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'store_config' | 'security'>('profile');

  // Owner personal info
  const [ownerName, setOwnerName] = useState(currentUser?.name || 'الحسين بورشيم (المالك)');
  const [ownerEmail, setOwnerEmail] = useState(currentUser?.email || 'hocinbourchim5@gmail.com');
  const [ownerPassword, setOwnerPassword] = useState('omil4aliya');
  const [showPassword, setShowPassword] = useState(false);
  const [ownerPhone, setOwnerPhone] = useState(currentUser?.phone || '0661000000');
  const [ownerCity, setOwnerCity] = useState(currentUser?.city || 'الدار البيضاء (Casablanca)');

  // Store Config
  const [storeName, setStoreName] = useState('متجر صولديا | SOLDEYA Store');
  const [shippingPolicy, setShippingPolicy] = useState('شحن مجاني لكافة مدن المغرب مع الدفع عند الاستلام');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      onSaveOwnerProfile({
        ...currentUser,
        name: ownerName,
        email: ownerEmail,
        phone: ownerPhone,
        city: ownerCity
      });
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-400/40 dark:border-amber-500/30 my-auto text-right">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                إعدادات مالك المتجر (SOLDEYA Owner)
              </h2>
              <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                صلاحية كاملة
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              إدارة بيانات حساب المالك الحسين بورشيم وتهيئة سياسات المتجر
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-gray-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>بيانات المالك</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('store_config')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'store_config'
                ? 'bg-white dark:bg-gray-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>سياسات المتجر</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white dark:bg-gray-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>الأمان وكلمة السر</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* TAB 1: OWNER PERSONAL INFO */}
          {activeTab === 'profile' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-extrabold text-gray-900 dark:text-white mb-1">
                  اسم مالك المتجر:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-9 pl-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-amber-500 outline-hidden font-bold"
                  />
                  <User className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-900 dark:text-white mb-1">
                  البريد الإلكتروني المعتمد (Gmail):
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-9 pl-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-amber-500 outline-hidden font-mono font-bold"
                  />
                  <Mail className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  البريد الإداري: hocinbourchim5@gmail.com
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    رقم هاتف المالك:
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-9 pl-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-amber-500 outline-hidden font-mono"
                    />
                    <Phone className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    المدينة الرئيسية:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={ownerCity}
                      onChange={(e) => setOwnerCity(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-9 pl-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-amber-500 outline-hidden"
                    />
                    <MapPin className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STORE CONFIG */}
          {activeTab === 'store_config' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  اسم المتجر المعروض:
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-amber-500 outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  سياسة الشحن والتوصيل:
                </label>
                <input
                  type="text"
                  value={shippingPolicy}
                  onChange={(e) => setShippingPolicy(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-amber-500 outline-hidden"
                />
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>معايير التجارة بالمغرب:</span>
                </div>
                <div>الدفع عند الاستلام COD مفعل بشكل افتراضي لجميع المنتجات.</div>
                <div>العملة المعتمدة هي الدرهم المغربي (MAD).</div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & CREDENTIALS */}
          {activeTab === 'security' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  تعديل كلمة مرور حساب المالك:
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 pr-3 pl-10 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-gray-400 block">
                  الرمز السري الحالي المعتمد: <code className="font-bold text-amber-600">omil4aliya</code>
                </span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>تم تحديث بيانات المالك بنجاح!</span>
              </span>
            ) : (
              <span className="text-[11px] text-gray-400">
                يتم التحديث فورياً في النظام
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-950 rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>حفظ التعديلات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
