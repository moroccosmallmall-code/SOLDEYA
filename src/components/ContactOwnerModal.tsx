import React, { useState } from 'react';
import { X, Send, MessageSquare, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContactOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (data: { senderName: string; phone: string; subject: string; message: string }) => void;
}

export const ContactOwnerModal: React.FC<ContactOwnerModalProps> = ({
  isOpen,
  onClose,
  onSendMessage
}) => {
  const [senderName, setSenderName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('استفسار عن طلب');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !phone.trim() || !message.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    if (phone.trim().length < 8) {
      setError('يرجى إدخال رقم هاتف صحيح');
      return;
    }
    setError('');
    onSendMessage({
      senderName: senderName.trim(),
      phone: phone.trim(),
      subject,
      message: message.trim()
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSenderName('');
      setPhone('');
      setMessage('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-800 my-auto text-right">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
              تم إرسال رسالتك بنجاح!
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              وصلت رسالتك مباشرة إلى لوحة تحكم إدارة متجر صولديا وسيقوم الفريق بالتواصل معك.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                  تواصل مع إدارة متجر صولديا
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  اطرح استفساراتك وسيقوم مالك المتجر بالرد عليك مباشرة
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                الاسم الكامل:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="محمد المغربي"
                  className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pl-3 pr-9 py-2.5 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden"
                />
                <User className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                رقم الهاتف (واتساب):
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="مثال: 0612345678"
                  className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pl-3 pr-9 py-2.5 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden font-mono"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                موضوع الاستفسار:
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2.5 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden"
              >
                <option value="استفسار عن طلب">استفسار عن طلب شراء</option>
                <option value="حجز دورة تكوينية">حجز دورة تكوينية وتدريب</option>
                <option value="استفسار عن مواصفات منتج">استفسار عن مواصفات منتج</option>
                <option value="طلبات الجملة (Wholesale)">طلبات الجملة والتوريد (Wholesale)</option>
                <option value="اقتراح أو شكوى">اقتراح أو ملاحظة</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                نص الرسالة:
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب استفسارك هنا بكل وضوح..."
                className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>إرسال الرسالة إلى إدارة صولديا</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
