import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Crown 
} from 'lucide-react';
import { User as UserType } from '../types';
import { MOROCCAN_CITIES } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState(MOROCCAN_CITIES[0]);
  const [regAddress, setRegAddress] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. OWNER AUTHENTICATION CHECK
    // Email: hocinbourchim5@gmail.com
    // Password: omil4aliya
    if (cleanEmail === 'hocinbourchim5@gmail.com' && cleanPass === 'omil4aliya') {
      const ownerUser: UserType = {
        id: 'owner-hocine',
        email: 'hocinbourchim5@gmail.com',
        name: 'الحسين بورشيم (مالك المتجر)',
        role: 'owner',
        phone: '0661000000',
        city: 'الدار البيضاء'
      };
      setSuccessMessage('تم التحقق بنجاح! جاري تحويلك للوحة المالك...');
      setTimeout(() => {
        setEmail('');
        setPassword('');
        onLoginSuccess(ownerUser);
        onClose();
      }, 700);
      return;
    }

    // 2. CHECK IF TRIED TO ENTER OWNER EMAIL WITH WRONG PASSWORD
    if (cleanEmail === 'hocinbourchim5@gmail.com' && cleanPass !== 'omil4aliya') {
      setErrorMessage('كلمة المرور غير صحيحة لحساب المالك.');
      setPassword('');
      return;
    }

    // 3. REGULAR CUSTOMER LOGIN
    if (!cleanEmail || !cleanPass) {
      setErrorMessage('يرجى ملء جميع الحقول.');
      return;
    }

    const customerUser: UserType = {
      id: `cust-${Date.now()}`,
      email: cleanEmail,
      name: cleanEmail.split('@')[0],
      role: 'customer',
      phone: '',
      city: 'الدار البيضاء'
    };

    setSuccessMessage('تم تسجيل الدخول بنجاح!');
    setTimeout(() => {
      setEmail('');
      setPassword('');
      onLoginSuccess(customerUser);
      onClose();
    }, 600);
  };

  // Handle Register (New Customer)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regPhone.trim()) {
      setErrorMessage('يرجى ملء جميع الحقول الإلزامية.');
      return;
    }

    if (regEmail.trim().toLowerCase() === 'hocinbourchim5@gmail.com') {
      setErrorMessage('هذا البريد مخصص لمالك المتجر، يرجى تسجيل الدخول من تبويب الدخول.');
      return;
    }

    const newCustomer: UserType = {
      id: `cust-${Date.now()}`,
      email: regEmail.trim().toLowerCase(),
      name: regName.trim(),
      role: 'customer',
      phone: regPhone.trim(),
      city: regCity,
      address: regAddress.trim()
    };

    setSuccessMessage('تم إنشاء حسابك بنجاح!');
    setTimeout(() => {
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegPhone('');
      setRegAddress('');
      onLoginSuccess(newCustomer);
      onClose();
    }, 600);
  };

  const handleCloseModal = () => {
    setEmail('');
    setPassword('');
    setRegPassword('');
    setErrorMessage('');
    setSuccessMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 my-auto text-right">
        
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 text-white font-black text-2xl mx-auto flex items-center justify-center shadow-lg mb-3">
            S
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
            تسجيل الدخول إلى صولديا
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            سجل دخولك كزبون لمتابعة طلباتك أو كمالك للمتجر للإدارة الكاملة
          </p>
        </div>

        {/* Tabs: Login vs Register */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            حساب جديد
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-950/70 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                البريد الإلكتروني:
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="off"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-10 pl-3 py-2.5 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden font-sans"
                />
                <Mail className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                كلمة المرور:
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-10 pl-3 py-2.5 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden font-sans"
                />
                <Lock className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>دخول</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          /* 2. CUSTOMER REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} autoComplete="off" className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                الاسم الكامل:
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="محمد المغربي"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-9 pl-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden"
                />
                <User className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                البريد الإلكتروني:
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="your-email@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-9 pl-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden"
                />
                <Mail className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                كلمة المرور:
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-9 pl-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden"
                />
                <Lock className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                  رقم الهاتف:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0612345678"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                  المدينة:
                </label>
                <select
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden"
                >
                  {MOROCCAN_CITIES.slice(0, 10).map((c) => (
                    <option key={c} value={c}>{c.split(' ')[0]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                عنوان التوصيل:
              </label>
              <input
                type="text"
                placeholder="الحي، الشارع، رقم المنزل"
                value={regAddress}
                onChange={(e) => setRegAddress(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>إنشاء الحساب ومتابعة التسوق</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
