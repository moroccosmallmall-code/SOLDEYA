import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Globe, 
  User, 
  Phone, 
  MapPin, 
  Bell, 
  Check, 
  Save 
} from 'lucide-react';
import { CustomerSettings, Language } from '../types';
import { MOROCCAN_CITIES } from '../data/mockData';

interface CustomerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CustomerSettings;
  onSaveSettings: (newSettings: CustomerSettings) => void;
}

export const CustomerSettingsModal: React.FC<CustomerSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'language' | 'notifications'>('profile');
  const [formData, setFormData] = useState<CustomerSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleLanguageChange = (lang: Language) => {
    setFormData(prev => ({ ...prev, language: lang }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 my-auto text-right">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
              إعدادات حساب الزبون
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              تعديل بيانات التوصيل، اللغة، وتفضيلات الإشعارات
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>البيانات الشخصية</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('language')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'language'
                ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>اللغة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>الإشعارات</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* TAB 1: PERSONAL INFORMATION */}
          {activeTab === 'profile' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  الاسم الكامل:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-9 pl-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden"
                  />
                  <User className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  البريد الإلكتروني:
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    رقم الهاتف:
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0612345678"
                      className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-9 pl-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden font-mono"
                    />
                    <Phone className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    المدينة المفضلة:
                  </label>
                  <div className="relative">
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-8 pl-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden appearance-none"
                    >
                      {MOROCCAN_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <MapPin className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  عنوان التوصيل الافتراضي:
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="الحي، رقم المنزل"
                  className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>
          )}

          {/* TAB 2: LANGUAGE SELECTION */}
          {activeTab === 'language' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                اختر لغة واجهة المتجر:
              </label>
              <div className="space-y-2">
                {/* Arabic */}
                <button
                  type="button"
                  onClick={() => handleLanguageChange('ar')}
                  className={`w-full p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                    formData.language === 'ar'
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🇲🇦</span>
                    <div>
                      <div className="text-xs font-bold">العربية (المغرب)</div>
                      <div className="text-[10px] text-gray-400">اللغة الرسمية للمتجر بالدرهم المغربي</div>
                    </div>
                  </div>
                  {formData.language === 'ar' && <Check className="w-4 h-4 text-emerald-600" />}
                </button>

                {/* French */}
                <button
                  type="button"
                  onClick={() => handleLanguageChange('fr')}
                  className={`w-full p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                    formData.language === 'fr'
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🇫🇷</span>
                    <div>
                      <div className="text-xs font-bold">Français (Maroc)</div>
                      <div className="text-[10px] text-gray-400">Paiement à la livraison partout au Maroc</div>
                    </div>
                  </div>
                  {formData.language === 'fr' && <Check className="w-4 h-4 text-emerald-600" />}
                </button>

                {/* English */}
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={`w-full p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                    formData.language === 'en'
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🇬🇧</span>
                    <div>
                      <div className="text-xs font-bold">English</div>
                      <div className="text-[10px] text-gray-400">Cash on delivery in Morocco</div>
                    </div>
                  </div>
                  {formData.language === 'en' && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                تفضيلات التنبيهات:
              </label>
              <label className="flex items-center justify-between p-3 rounded-2xl border border-gray-200 dark:border-gray-700 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white">
                    تلقي إشعارات العروض والتخفيضات الجديدة
                  </div>
                  <div className="text-[10px] text-gray-400">
                    الحصول على تنبيه فوري عند إضافة منتجات جديدة أو خصومات خاصة
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notificationsEnabled}
                  onChange={(e) => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
              </label>
            </div>
          )}

          {/* Save Action */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>تم الحفظ بنجاح!</span>
              </span>
            ) : (
              <span className="text-[11px] text-gray-400">
                يتم حفظ التغييرات محلياً في متصفحك
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>حفظ الإعدادات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
