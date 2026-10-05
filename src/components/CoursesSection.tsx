import React, { useState } from 'react';
import { 
  GraduationCap, 
  Send, 
  BookOpen, 
  Sparkles, 
  Check, 
  PhoneCall, 
  Clock, 
  Award, 
  Video, 
  Image as ImageIcon,
  User, 
  ShieldCheck, 
  CheckSquare, 
  Square 
} from 'lucide-react';
import { Course, CourseRegistration } from '../types';

interface CoursesSectionProps {
  courses: Course[];
  onRegisterCourse: (registration: Omit<CourseRegistration, 'id' | 'date' | 'syncedToGoogleSheets'>) => void;
  registeredList?: CourseRegistration[];
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  courses,
  onRegisterCourse
}) => {
  // Visitor interactive form states per course
  const [visitorNames, setVisitorNames] = useState<Record<string, string>>({});
  const [whatsappNumbers, setWhatsappNumbers] = useState<Record<string, string>>({});
  const [selectedSpecializations, setSelectedSpecializations] = useState<Record<string, string>>({});
  const [selectedAxesMap, setSelectedAxesMap] = useState<Record<string, string[]>>({});
  const [submittedCourses, setSubmittedCourses] = useState<Record<string, boolean>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleNameChange = (courseId: string, value: string) => {
    setVisitorNames(prev => ({ ...prev, [courseId]: value }));
  };

  const handleWhatsappChange = (courseId: string, value: string) => {
    setWhatsappNumbers(prev => ({ ...prev, [courseId]: value }));
  };

  const handleSelectSpecialization = (courseId: string, spec: string) => {
    setSelectedSpecializations(prev => ({ ...prev, [courseId]: spec }));
  };

  const handleToggleAxis = (courseId: string, axis: string, allAxes: string[]) => {
    const current = selectedAxesMap[courseId] || [...allAxes];
    const exists = current.includes(axis);
    const updated = exists ? current.filter(a => a !== axis) : [...current, axis];
    setSelectedAxesMap(prev => ({ ...prev, [courseId]: updated }));
  };

  const handleSubmitCourseRegistration = (course: Course) => {
    const name = visitorNames[course.id] || '';
    const phone = whatsappNumbers[course.id] || '';
    const spec = selectedSpecializations[course.id] || (course.specializations && course.specializations[0]) || 'عام';
    const chosenAxes = selectedAxesMap[course.id] || [...course.axes];

    if (!name.trim()) {
      setFormErrors(prev => ({ ...prev, [course.id]: 'يرجى كتابة الاسم الكامل.' }));
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setFormErrors(prev => ({ ...prev, [course.id]: 'يرجى إدخال رقم واتساب صحيح.' }));
      return;
    }
    if (chosenAxes.length === 0) {
      setFormErrors(prev => ({ ...prev, [course.id]: 'يرجى اختيار محور تدريبي واحد على الأقل.' }));
      return;
    }

    setFormErrors(prev => ({ ...prev, [course.id]: '' }));

    // Send to State and Owner's database (which syncs to owner's Google Sheet)
    onRegisterCourse({
      courseId: course.id,
      courseTitle: course.title,
      courseDomain: course.domain,
      visitorName: name.trim(),
      selectedSpecialization: spec,
      agreedAxes: chosenAxes,
      whatsappNumber: phone.trim()
    });

    setSubmittedCourses(prev => ({ ...prev, [course.id]: true }));

    // Format WhatsApp direct message to Store Owner
    const message = encodeURIComponent(
      `مرحباً إدارة متجر صولديا، أرغب بالتسجيل في التكوين:\n- الاسم: ${name.trim()}\n- الدورة: ${course.title}\n- المجال: ${course.domain}\n- التخصص: ${spec}\n- الرسوم: ${course.price} درهم\n- المحاور المختارة:\n${chosenAxes.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n- رقم الواتساب: ${phone.trim()}\nيرجى التواصل معي لتأكيد الحجز وموعد الانطلاق.`
    );
    
    // Open WhatsApp directly to send to owner
    window.open(`https://wa.me/212600000000?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold text-xs mb-3 shadow-xs">
          <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>أكاديمية صولديا للتكوينات الاحترافية</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-3">
          تكوينات وتدريبات تطبيقية لصناعة مشروعك الناجح
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          اختر الدورة التدريبية والمحاور التي ترغب في إتقانها وسجل بياناتك للتواصل معك وتحديد برنامجك التدريبي الخاص.
        </p>
      </div>

      {/* Courses List */}
      <div className="space-y-12">
        {courses.map((course) => {
          const isSubmitted = submittedCourses[course.id];
          const chosenAxes = selectedAxesMap[course.id] || [...course.axes];
          const errorMsg = formErrors[course.id];

          return (
            <div
              key={course.id}
              className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                
                {/* Course Advertisement Media Column (Image or Video) */}
                <div className="lg:col-span-5 relative bg-gray-900 flex items-center justify-center min-h-[300px] overflow-hidden">
                  {course.mediaType === 'video' ? (
                    <video
                      src={course.mediaUrl}
                      controls
                      className="w-full h-full object-cover max-h-[480px]"
                    />
                  ) : (
                    <img
                      src={course.mediaUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'}
                      alt={course.title}
                      className="w-full h-full object-cover min-h-[320px] max-h-[480px]"
                    />
                  )}
                  {/* Media Badge */}
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                    {course.mediaType === 'video' ? (
                      <>
                        <Video className="w-3.5 h-3.5 text-amber-400" />
                        <span>فيديو إعلاني توضيحي</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                        <span>{course.badge || 'إعلان التكوين'}</span>
                      </>
                    )}
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-4 left-4 bg-emerald-600 text-white px-4 py-2 rounded-2xl shadow-xl flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-black">{course.price}</span>
                    <span className="text-xs font-bold">درهم مغربي</span>
                  </div>
                </div>

                {/* Course Info & Visitor Interactive Fill Form */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    {/* Domain & Duration Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full">
                        مجال التكوين: {course.domain}
                      </span>
                      {course.targetStoreId && (
                        <span className="bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-teal-300 dark:border-teal-800">
                          <Send className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                          <span>إعلان للمتجر: {course.targetStoreId}</span>
                        </span>
                      )}
                      {course.duration && (
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span>{course.duration}</span>
                        </span>
                      )}
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>شهادة إتمام معتمدة</span>
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-snug mb-2">
                      {course.title}
                    </h2>

                    {course.description && (
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {course.description}
                      </p>
                    )}

                    {/* INTERACTIVE COURSE AXES CHECKLIST FOR VISITOR */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-emerald-500" />
                          <span>محاور التكوين (يمكنك تحديد ما يناسبك):</span>
                        </h3>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                          المحدد: {chosenAxes.length} من {course.axes.length}
                        </span>
                      </div>

                      <div className="space-y-2 bg-gray-50 dark:bg-gray-800/40 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800">
                        {course.axes.map((axis, index) => {
                          const isChecked = chosenAxes.includes(axis);
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleToggleAxis(course.id, axis, course.axes)}
                              className={`w-full text-right p-2 rounded-xl transition-all flex items-start gap-2.5 text-xs cursor-pointer ${
                                isChecked
                                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold shadow-2xs border border-emerald-500/40'
                                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                              }`}
                            >
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                              )}
                              <span>{axis}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* VISITOR LEAD & REGISTRATION FORM */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    {isSubmitted ? (
                      <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl text-center animate-in fade-in">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-2">
                          <Check className="w-5 h-5" />
                        </div>
                        <h4 className="font-extrabold text-sm text-emerald-800 dark:text-emerald-300">
                          تم تسجيل اهتمامك بنجاح!
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          تم تحويل بياناتك إلى إدارة المتجر وسيتم إدراجك في جدول المستفيدين لمجال: <strong>{course.domain}</strong>.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-emerald-50/70 to-teal-50/50 dark:from-gray-800/80 dark:to-gray-800 p-4 sm:p-5 rounded-2xl border border-emerald-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span>تسجيل الاهتمام والحجز بالتكوين:</span>
                          </h4>
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            رسوم التكوين: {course.price} درهم
                          </span>
                        </div>

                        {errorMsg && (
                          <div className="mb-2 text-xs text-red-600 dark:text-red-400 font-semibold">
                            {errorMsg}
                          </div>
                        )}

                        {/* Specializations */}
                        <div className="mb-3">
                          <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                            اختر التخصص التدريبي المستهدف:
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {course.specializations.map((spec) => {
                              const isSelected = (selectedSpecializations[course.id] || course.specializations[0]) === spec;
                              return (
                                <button
                                  key={spec}
                                  type="button"
                                  onClick={() => handleSelectSpecialization(course.id, spec)}
                                  className={`text-right p-2 rounded-xl text-xs font-semibold transition-all border flex items-center justify-between cursor-pointer ${
                                    isSelected
                                      ? 'border-emerald-500 bg-white dark:bg-gray-900 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                                      : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/60 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                                  }`}
                                >
                                  <span className="truncate">{spec}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Name and WhatsApp fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="الاسم الكامل"
                              value={visitorNames[course.id] || ''}
                              onChange={(e) => handleNameChange(course.id, e.target.value)}
                              className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 pr-8 pl-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden font-medium"
                            />
                            <User className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                          <div className="relative">
                            <input
                              type="tel"
                              placeholder="رقم الواتساب (مثال: 0612345678)"
                              value={whatsappNumbers[course.id] || ''}
                              onChange={(e) => handleWhatsappChange(course.id, e.target.value)}
                              className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 pr-8 pl-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-hidden font-medium font-mono"
                            />
                            <PhoneCall className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="button"
                          onClick={() => handleSubmitCourseRegistration(course)}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          <span>تأكيد التسجيل وإرسال عبر الواتساب</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* NOTICE FOR VISITOR */}
              <div className="bg-gray-50 dark:bg-gray-800/70 px-6 py-2.5 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>تأطير شخصي ومتابعة مستمرة طيلة فترة التكوين</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {course.domain}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
