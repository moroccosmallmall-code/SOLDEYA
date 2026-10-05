import { Product, Course, Order, GoogleSheetConfig, NotificationItem } from '../types';

export const MOROCCAN_CITIES = [
  'الدار البيضاء (Casablanca)',
  'الرباط (Rabat)',
  'مراكش (Marrakech)',
  'طنجة (Tanger)',
  'فاس (Fès)',
  'أكادير (Agadir)',
  'مكناس (Meknès)',
  'وجدة (Oujda)',
  'القنيطرة (Kénitra)',
  'تطوان (Tétouan)',
  'تمارة (Témara)',
  'سلا (Salé)',
  'المحمدية (Mohammedia)',
  'الجديدة (El Jadida)',
  'خريبكة (Khouribga)',
  'بني ملال (Béni Mellal)',
  'الناظور (Nador)',
  'تازة (Taza)',
  'آسفي (Safi)',
  'العيون (Laâyoune)',
  'الداخلة (Dakhla)',
  'ورزازات (Ouarzazate)',
  'برشيد (Berrechid)',
  'سطات (Settat)',
  'الصويرة (Essaouira)'
];

export const CATEGORIES = [
  'جميع الأصناف',
  'إلكترونيات وساعات ذكية',
  'سماعات وصوتيات',
  'أجهزة المطبخ والمنزل',
  'أجهزة الصحة والجمال',
  'إكسسوارات وسيارات'
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'ساعة ذكية Ultra Pro بشاشة AMOLED مقاومة للماء',
    price: 349,
    originalPrice: 599,
    wholesalePrice: 220,
    category: 'إلكترونيات وساعات ذكية',
    description: 'ساعة ذكية عصرية بميزات متطورة تشمل قياس نبضات القلب، تتبع الأنشطة الرياضية، وإجراء المكالمات عبر البلوتوث مع بطارية تدوم حتى 7 أيام كاملة وشاحن مغناطيسي سريع.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-smartwatch-close-up-display-42035-large.mp4',
    landingFeatures: [
      'شاشة فائقة الوضوح AMOLED مريحة للعين تحت الشمس',
      'مقاومة تامة للماء والغبار بمعيار IP68',
      'إجراء واستقبال المكالمات بوضوح صوتي نقي عبر البلوتوث',
      'بطارية تدوم لأكثر من 7 أيام من الاستخدام المتواصل'
    ],
    colors: [
      { name: 'أزرق ملكي', hex: '#2563eb', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80', inStock: true },
      { name: 'أسود كربوني', hex: '#0f172a', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', inStock: true },
      { name: 'فضي رمادي', hex: '#94a3b8', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80', inStock: true },
      { name: 'أحمر رياضي', hex: '#dc2626', inStock: false }
    ],
    featured: true,
    rating: 4.9,
    reviewsCount: 142,
    stockCount: 18,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    title: 'سماعات لاسلكية احترافية مع عزل الضوضاء النشط ANC',
    price: 279,
    originalPrice: 450,
    wholesalePrice: 175,
    category: 'سماعات وصوتيات',
    description: 'سماعات أذن بلوتوث متطورة بتقنية إلغاء الضجيج النشط وميكروفونات مزدوجة للمكالمات النقية، مع علبة شحن توفر حتى 36 ساعة من الاستماع المستمر.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    landingFeatures: [
      'تقنية إلغاء الضوضاء الفعال بنسبة تصل إلى 95%',
      'صوت استريو محيطي مجسم وقوي بنغمات Bass نقية',
      'بطارية تدوم 36 ساعة مع الشحن السريع 10 دقائق = ساعتين استماع',
      'مقاومة للعرق والبلل مناسبة للرياضة والأنشطة اليومية'
    ],
    colors: [
      { name: 'أسود كربوني', hex: '#18181b', inStock: true },
      { name: 'أبيض لؤلؤي', hex: '#f8fafc', inStock: true },
      { name: 'أزرق داكن', hex: '#1d4ed8', inStock: true }
    ],
    featured: true,
    rating: 4.8,
    reviewsCount: 98,
    stockCount: 25,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    title: 'خلاط عصائر سموذي محمول 6 شفرات شحن USB',
    price: 199,
    originalPrice: 320,
    wholesalePrice: 110,
    category: 'أجهزة المطبخ والمنزل',
    description: 'خلاط عصائر قوي ومحمول لتحضير العصائر الطازجة ومخفوق البروتين أينما كنت. بطارية قابلة لإعادة الشحن عبر USB وشفرات ستانلس ستيل حادة.',
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=800&auto=format&fit=crop&q=80'
    ],
    landingFeatures: [
      '6 شفرات فولاذية مقاومة للصدأ 304 لطحن الثلج والفواكه الصلبة',
      'حجم مثالي للتنقل والرياضة والمكتب والسفر',
      'شحن سهل وسريع بواسطة منفذ USB من الباور بانك أو السيارة',
      'نظام أمان ذكي يمنع التشغيل عند فك الكوب'
    ],
    colors: [
      { name: 'أخضر نعناعي', hex: '#16a34a', inStock: true },
      { name: 'وردي لطيف', hex: '#ec4899', inStock: true },
      { name: 'أزرق سماوي', hex: '#0284c7', inStock: true }
    ],
    featured: false,
    rating: 4.7,
    reviewsCount: 64,
    stockCount: 14,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    title: 'مسدس تدليك العضلات الاحترافي لتخفيف الألم والتشنج',
    price: 389,
    originalPrice: 620,
    wholesalePrice: 245,
    category: 'أجهزة الصحة والجمال',
    description: 'جهاز مساج محمول فائق القوة والهدوء لعلاج آلام العضلات وتنشيط الدورة الدموية، مزود بـ 6 رؤوس تدليك مخصصة ومستويات سرعة قابلة للتعديل.',
    images: [
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80'
    ],
    landingFeatures: [
      'محرك فائق الهدوء بتقنية تخفيض الضجيج QuietGlide',
      '6 رؤوس تدليك سيليكونية لمختلف عضلات الجسم والمفاصل',
      'بطارية ليثيوم طويلة الأمد مع شاشة رقمية لعرض السرعة والشحن',
      'تخفيف فوري للتعب العضلي بعد التمارين الشاقة وأيام العمل الطويلة'
    ],
    colors: [
      { name: 'أسود كربوني', hex: '#0f172a', inStock: true },
      { name: 'رمادي تيتانيوم', hex: '#94a3b8', inStock: true },
      { name: 'أحمر ناري', hex: '#b91c1c', inStock: true }
    ],
    featured: true,
    rating: 4.9,
    reviewsCount: 110,
    stockCount: 9,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'دورة التجارة الإلكترونية المحلية والدفع عند الاستلام بالمغرب COD',
    domain: 'التجارة الإلكترونية (E-commerce COD)',
    axes: [
      'اختيار المنتجات الرابحة والمربحة محلياً وتحديد الموردين',
      'إنشاء وتصميم صفحات هبوط سريعة ومقنعة للزبون المغربي',
      'إطلاق الحملات الإعلانية على فيسبوك وتيك توك وتحقيق أفضل ROAS',
      'التفاوض مع الموردين ومستودعات التخزين وإدارة المخزون',
      'إدارة شركات التوصيل ورفع نسبة تأكيد الطلبات إلى أكثر من 85%'
    ],
    price: 799,
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    specializations: [
      'التجارة الإلكترونية والدفع عند الاستلام بالمغرب',
      'التسويق الرقمي وإدارة الحملات الإعلانية',
      'خدمة العملاء وتأكيد الطلبات وتتبع الشحنات'
    ],
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing',
    instructor: 'فريق خبراء صولديا',
    duration: '4 أسابيع تدريب مكثف',
    description: 'دورة تطبيقية عملية من الصفر حتى تحقيق أولى مبيعاتك المستقرة مع متابعة يومية وتطبيق عملي خطوة بخطوة على متجرك الخاص.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'course-2',
    title: 'احتراف إعلانات Meta و TikTok Ads للمتاجر الإلكترونية',
    domain: 'التسويق الرقمي والإعلانات الموجهة',
    axes: [
      'هيكلة الحساب الإعلاني واستراتيجيات الاستهداف الذكي بالمغرب',
      'صناعة المحتوى الإعلاني المقنع وفيديوهات UGC التي تحقق أعلى تحويل',
      'تحليل مؤشرات الأداء والتحسين المستمر لمضاعفة الأرباح',
      'Scaling ومضاعفة الميزانية اليومية دون الإضرار بتكلفة الطلب'
    ],
    price: 599,
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=1200&auto=format&fit=crop&q=80',
    specializations: [
      'إعلانات تيك توك التفاعلية',
      'إعلانات فيسبوك وإنستغرام',
      'صناعة إعلانات الفيديو UGC والمؤثرين'
    ],
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing',
    instructor: 'أستاذ التسويق المعتمد',
    duration: '3 أسابيع تدريب عملي',
    description: 'تعلم كيف تصنع إعلانات جذابة وتجلب مئات الطلبات يومياً بأقل تكلفة للطلب الواحد وأعلى عائد على الاستثمار ROAS.',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8821',
    customerName: 'حمزة التازي',
    phone: '0661234567',
    city: 'الدار البيضاء (Casablanca)',
    address: 'شارع أنفا، إقامة الياسمين رقم 45',
    items: [
      {
        productId: 'prod-1',
        productTitle: 'ساعة ذكية Ultra Pro بشاشة AMOLED',
        quantity: 1,
        price: 349,
        selectedColor: 'أزرق ملكي',
        image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
      }
    ],
    totalPrice: 349,
    shipping: 0,
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    notes: 'يرجى الاتصال قبل التوصيل في المساء',
    syncedToGoogleSheet: true
  },
  {
    id: 'ORD-8820',
    customerName: 'فاطمة الزهراء بنعلي',
    phone: '0672987654',
    city: 'الرباط (Rabat)',
    address: 'حي أكدال، شارع الأطلس عمارة 12',
    items: [
      {
        productId: 'prod-2',
        productTitle: 'سماعات لاسلكية احترافية ANC',
        quantity: 1,
        price: 279,
        selectedColor: 'أبيض لؤلؤي',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
      }
    ],
    totalPrice: 279,
    shipping: 0,
    status: 'processing',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    syncedToGoogleSheet: true
  }
];

export const INITIAL_GSHEET_CONFIG: GoogleSheetConfig = {
  ordersSheetUrl: 'https://docs.google.com/spreadsheets/d/1Xy9oQ-SoldeyaOrders2026/edit?usp=sharing',
  coursesSheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing',
  webhookUrl: 'https://script.google.com/macros/s/AKfycbz_soldeya_cloud_sync_api/exec',
  autoSync: true,
  lastSyncTime: 'مكتمل بنجاح 100%',
  status: 'connected'
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-owner-1',
    title: 'طلب شراء جديد',
    message: 'طلب جديد #ORD-8821 بقيمة 349 درهم لساعة Ultra Pro (الدار البيضاء).',
    type: 'order',
    targetId: 'ORD-8821',
    timestamp: 'منذ 15 دقيقة',
    read: false,
    recipientRole: 'owner'
  },
  {
    id: 'notif-owner-2',
    title: 'تسجيل مهتم جديد بدورة COD',
    message: 'قام المستفيد رضوان (0661998877) بالتسجيل في دورة التجارة الإلكترونية.',
    type: 'course',
    targetId: 'course-1',
    timestamp: 'منذ ساعة',
    read: false,
    recipientRole: 'owner'
  },
  {
    id: 'notif-1',
    title: 'تخفيض حصري اليوم',
    message: 'خصم خاص على ساعة Ultra Pro الذكية وشحن مجاني لجميع مدن المغرب.',
    type: 'new_product',
    targetId: 'prod-1',
    timestamp: 'منذ ساعتين',
    read: false,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80',
    recipientRole: 'all'
  },
  {
    id: 'notif-2',
    title: 'فتح باب التسجيل بالتكوينات',
    message: 'تم فتح التسجيل في الدفعة الجديدة لدورة التجارة الإلكترونية والتسويق الرقمي.',
    type: 'course',
    targetId: 'course-1',
    timestamp: 'اليوم',
    read: false,
    recipientRole: 'all'
  },
  {
    id: 'notif-3',
    title: 'خدمة التوصيل السريع متاحة',
    message: 'الدفع عند الاستلام متاح في جميع مدن المملكة المغربية مع المعاينة قبل الدفع.',
    type: 'system',
    timestamp: 'أمس',
    read: true,
    recipientRole: 'customer'
  }
];
