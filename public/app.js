const FREE_REPORT_LIMIT = 3;
const historyKey = "binna:reports";
const countKey = "binna:free-report-count";

const translations = {
  en: {
    beta: "Free Beta",
    heroTag: "Saudi Arabia · Vision 2030",
    headline: "Know if your project is feasible before you build",
    subhead: "AI-powered feasibility and risk analysis tailored to Saudi regulations, Baladiya requirements, and Vision 2030 zoning rules.",
    statTime: "Analysis time",
    statRisk: "Risk dimensions",
    statReports: "Free reports left",
    tabAnalyze: "Analyze",
    tabMap: "Map",
    tabIntelligence: "Intelligence",
    tabHistory: "History",
    tabPlans: "Plans",
    mapTitle: "Saudi development map",
    mapSubtitle: "Zoom into Saudi cities, roads, districts, and building-level map detail where available.",
    mapBadge: "Interactive",
    mapHint: "Use + / - or pinch to move from national view into streets and buildings.",
    mapFallback: "Map tiles could not load. Check your internet connection and reload this tab.",
    mapContext: "Market context",
    mapPermit: "Typical permit path",
    mapRisk: "Watch points",
    mapPrefill: "Use this region in analyzer",
    projectDetails: "Project details",
    docUploadTitle: "Document intake",
    docUploadText: "Upload a deed, municipality letter, or notes file to extract clues and flag risks.",
    docUploadCta: "Choose document",
    voiceTitle: "Arabic voice input",
    voiceText: "Speak project details in Arabic or English and Binna will draft the context.",
    voiceCta: "Start voice input",
    voiceIdle: "Ready for speech",
    costTitle: "Live cost range",
    costText: "Rough Saudi construction estimate based on type, size, and city.",
    costNote: "Concept range only, excluding land and financing.",
    intelTitle: "Construction intelligence layer",
    intelSubtitle: "Workflow modules that turn a one-time feasibility report into a daily tool.",
    featureDocs: "AI document review",
    featureDocsText: "Extract deed constraints, municipality comments, drawing notes, setbacks, easements, and missing approvals.",
    featureZoning: "Real zoning lookup",
    featureZoningText: "Drop a pin on the map, then connect Balady/Amanah GIS layers for classification and district rules.",
    featureBenchmarks: "Comparable projects",
    featureBenchmarksText: "Show similar approvals from anonymized project history as Binna collects real user data.",
    featureWhatsApp: "WhatsApp delivery",
    featureWhatsAppText: "Prepare a formatted report summary for WhatsApp Business API delivery.",
    trackerTitle: "Permit tracker",
    whatsappTitle: "WhatsApp report",
    whatsappLabel: "Recipient number",
    whatsappDraft: "Prepare WhatsApp draft",
    marketTitle: "Verified consultants",
    collabTitle: "Team collaboration",
    commentPlaceholder: "Add a note for architect, engineer, or investor",
    addComment: "Add",
    alertsTitle: "Risk change alerts",
    alertsText: "Notify me when regulations or zoning assumptions change for saved projects.",
    benchmarksTitle: "Comparable approvals",
    proxyReady: "Secure API proxy ready",
    city: "City / Region",
    selectCity: "Select city",
    type: "Project type",
    selectType: "Select type",
    plot: "Plot area (m²)",
    bua: "Built-up area (m²)",
    floors: "Floors",
    budget: "Budget (SAR)",
    selectRange: "Select range",
    zone: "Zoning classification",
    selectZone: "Select zone",
    details: "Additional context (optional)",
    detailsPlaceholder: "Near a highway, adjacent to mosque, heritage area, giga-project zone, previous use of land, or specific concerns",
    analyze: "Analyze project feasibility",
    sampleReport: "Preview sample report",
    sampleReportNote: "Use this to see the output page before the AI key is connected.",
    shareReport: "Copy report link",
    shareCopied: "Report link copied. In production this should be backed by a public report URL.",
    confidence: "Confidence",
    deterministicFlags: "Automatic validation flags",
    dataFreshness: "Data freshness",
    analyzing: "Analyzing your project...",
    loading: "Analyzing Saudi regulations, zoning rules, and risk factors...",
    permitTimeline: "Permit timeline",
    visionNote: "Vision 2030",
    riskBreakdown: "Risk breakdown",
    approvals: "Required approvals",
    recommendations: "Key recommendations",
    another: "Analyze another project",
    print: "Download report (PDF)",
    email: "Email report",
    emailSoon: "Email delivery is ready for backend integration.",
    historyTitle: "Saved reports",
    clearHistory: "Clear history",
    emptyHistory: "No saved reports yet.",
    openReport: "Open report",
    freePlan: "Free",
    freePlanText: "3 feasibility reports for early evaluation.",
    resetCounter: "Reset beta counter",
    proPlan: "Pro",
    month: "/month",
    proPlanText: "Unlimited reports, saved history, PDF export, and email delivery.",
    joinWaitlist: "Join waitlist",
    disclaimer: "This tool is AI-generated and for informational purposes only. Always verify findings with a licensed Saudi engineer and your local Baladiya office before proceeding.",
    paywall: "You have used your 3 free reports. Upgrade to Pro for unlimited reports, PDF export, and saved history.",
    serverMissingKey: "The secure proxy is running, but the Anthropic API key is not configured on the server.",
    error: "Something went wrong analyzing your project. Please try again."
  },
  ar: {
    beta: "تجربة مجانية",
    heroTag: "السعودية · رؤية 2030",
    headline: "اعرف جدوى مشروعك قبل أن تبدأ البناء",
    subhead: "تحليل جدوى ومخاطر مدعوم بالذكاء الاصطناعي ومصمم للأنظمة السعودية ومتطلبات البلدية ومناطق رؤية 2030.",
    statTime: "مدة التحليل",
    statRisk: "محاور المخاطر",
    statReports: "تقارير مجانية متبقية",
    tabAnalyze: "تحليل",
    tabMap: "الخريطة",
    tabIntelligence: "الذكاء",
    tabHistory: "السجل",
    tabPlans: "الباقات",
    mapTitle: "خريطة التطوير في السعودية",
    mapSubtitle: "قرّب الخريطة لمشاهدة المدن والطرق والأحياء وتفاصيل المباني حيثما تتوفر.",
    mapBadge: "تفاعلية",
    mapHint: "استخدم + / - أو التكبير باللمس للانتقال من عرض المملكة إلى الشوارع والمباني.",
    mapFallback: "تعذر تحميل الخريطة. تحقق من اتصال الإنترنت وأعد تحميل التبويب.",
    mapContext: "سياق السوق",
    mapPermit: "مسار التصاريح المعتاد",
    mapRisk: "نقاط يجب الانتباه لها",
    mapPrefill: "استخدم هذه المنطقة في التحليل",
    projectDetails: "تفاصيل المشروع",
    docUploadTitle: "قراءة المستندات",
    docUploadText: "ارفع الصك أو خطاب البلدية أو ملاحظات المشروع لاستخراج المخاطر.",
    docUploadCta: "اختر مستنداً",
    voiceTitle: "إدخال صوتي عربي",
    voiceText: "تحدث بتفاصيل المشروع بالعربية أو الإنجليزية وسيتم تعبئة السياق.",
    voiceCta: "ابدأ التسجيل",
    voiceIdle: "جاهز للصوت",
    costTitle: "نطاق تكلفة مباشر",
    costText: "تقدير أولي لتكلفة البناء حسب النوع والمساحة والمدينة.",
    costNote: "نطاق مبدئي فقط ولا يشمل الأرض أو التمويل.",
    intelTitle: "طبقة ذكاء البناء",
    intelSubtitle: "وحدات تحول تقرير الجدوى إلى أداة عمل يومية.",
    featureDocs: "مراجعة المستندات بالذكاء الاصطناعي",
    featureDocsText: "استخراج قيود الصك وملاحظات البلدية والارتدادات والحقوق والموافقات الناقصة.",
    featureZoning: "استعلام النطاق العمراني",
    featureZoningText: "حدد الموقع على الخريطة ثم اربطه بطبقات بلدي أو الأمانات للتصنيف والاشتراطات.",
    featureBenchmarks: "مشاريع مشابهة",
    featureBenchmarksText: "عرض موافقات مشابهة من بيانات مجهولة المصدر عند تراكم سجل استخدام حقيقي.",
    featureWhatsApp: "إرسال واتساب",
    featureWhatsAppText: "تجهيز ملخص منسق للإرسال عبر WhatsApp Business API.",
    trackerTitle: "متابعة التصريح",
    whatsappTitle: "تقرير واتساب",
    whatsappLabel: "رقم المستلم",
    whatsappDraft: "جهز مسودة واتساب",
    marketTitle: "استشاريون معتمدون",
    collabTitle: "تعاون الفريق",
    commentPlaceholder: "أضف ملاحظة للمعماري أو المهندس أو المستثمر",
    addComment: "إضافة",
    alertsTitle: "تنبيهات تغير المخاطر",
    alertsText: "نبهني عند تغير اللوائح أو افتراضات النطاق للمشاريع المحفوظة.",
    benchmarksTitle: "موافقات مشابهة",
    proxyReady: "الاتصال الآمن جاهز",
    city: "المدينة / المنطقة",
    selectCity: "اختر المدينة",
    type: "نوع المشروع",
    selectType: "اختر النوع",
    plot: "مساحة الأرض (م²)",
    bua: "مساحة البناء (م²)",
    floors: "الأدوار",
    budget: "الميزانية (ريال)",
    selectRange: "اختر النطاق",
    zone: "تصنيف النطاق العمراني",
    selectZone: "اختر التصنيف",
    details: "معلومات إضافية (اختياري)",
    detailsPlaceholder: "قرب طريق سريع، مسجد، منطقة تراثية، نطاق مشروع ضخم، استخدام سابق للأرض، أو أي ملاحظات",
    analyze: "حلل جدوى المشروع",
    sampleReport: "معاينة تقرير تجريبي",
    sampleReportNote: "استخدمه لرؤية صفحة النتائج قبل ربط مفتاح الذكاء الاصطناعي.",
    shareReport: "نسخ رابط التقرير",
    shareCopied: "تم نسخ رابط التقرير. في النسخة الإنتاجية يجب حفظه كرابط عام.",
    confidence: "درجة الثقة",
    deterministicFlags: "تنبيهات التحقق الآلي",
    dataFreshness: "تحديث البيانات",
    analyzing: "جار تحليل المشروع...",
    loading: "جار تحليل اللوائح السعودية ومتطلبات البلدية وعوامل المخاطر...",
    permitTimeline: "مدة التصاريح",
    visionNote: "رؤية 2030",
    riskBreakdown: "تفصيل المخاطر",
    approvals: "الموافقات المطلوبة",
    recommendations: "التوصيات الرئيسية",
    another: "تحليل مشروع آخر",
    print: "تنزيل التقرير (PDF)",
    email: "إرسال التقرير",
    emailSoon: "إرسال البريد جاهز للربط بالخادم.",
    historyTitle: "التقارير المحفوظة",
    clearHistory: "مسح السجل",
    emptyHistory: "لا توجد تقارير محفوظة بعد.",
    openReport: "فتح التقرير",
    freePlan: "مجاني",
    freePlanText: "3 تقارير جدوى للتقييم الأولي.",
    resetCounter: "إعادة عداد التجربة",
    proPlan: "احترافي",
    month: "/شهرياً",
    proPlanText: "تقارير غير محدودة، سجل محفوظ، تصدير PDF، وإرسال بالبريد.",
    joinWaitlist: "انضم للقائمة",
    disclaimer: "هذه الأداة مولدة بالذكاء الاصطناعي ولغرض المعلومات فقط. تحقق دائماً مع مهندس سعودي معتمد ومكتب البلدية المحلي قبل تنفيذ أي مشروع.",
    paywall: "استخدمت 3 تقارير مجانية. قم بالترقية إلى الباقة الاحترافية للتقارير غير المحدودة وتصدير PDF والسجل المحفوظ.",
    serverMissingKey: "الخادم الآمن يعمل، لكن مفتاح Anthropic غير مضبوط على الخادم.",
    error: "حدث خطأ أثناء تحليل المشروع. حاول مرة أخرى."
  }
};

const regionData = {
  riyadh: {
    cityValue: "Riyadh",
    en: {
      name: "Riyadh",
      kicker: "Central growth engine",
      summary: "Strong demand for residential, commercial, logistics, and mixed-use projects, with fast-moving approvals when zoning and infrastructure capacity are clear.",
      demand: "Very high",
      timeline: "3-6 months",
      risk: "Medium",
      watch: [
        "Traffic impact and parking requirements can change commercial feasibility quickly.",
        "Utility connections and neighborhood density limits should be checked before design work.",
        "Diriyah and heritage-adjacent sites may require extra review."
      ]
    },
    ar: {
      name: "الرياض",
      kicker: "محرك النمو المركزي",
      summary: "طلب قوي على المشاريع السكنية والتجارية واللوجستية ومتعددة الاستخدامات، مع تسارع الموافقات عندما تكون الاشتراطات والبنية التحتية واضحة.",
      demand: "مرتفع جداً",
      timeline: "3-6 أشهر",
      risk: "متوسط",
      watch: [
        "اشتراطات الحركة المرورية والمواقف قد تؤثر بسرعة على جدوى المشاريع التجارية.",
        "يجب التحقق من خدمات المرافق وكثافة الحي قبل أعمال التصميم.",
        "المواقع القريبة من الدرعية أو المناطق التراثية قد تحتاج مراجعة إضافية."
      ]
    }
  },
  jeddah: {
    cityValue: "Jeddah",
    en: {
      name: "Jeddah",
      kicker: "Red Sea gateway",
      summary: "Hospitality, retail, and residential projects benefit from tourism and port activity, but coastal constraints and drainage history raise technical due diligence needs.",
      demand: "High",
      timeline: "4-8 months",
      risk: "Medium-high",
      watch: [
        "Coastal and flood-management requirements can affect basement, podium, and MEP strategy.",
        "Hospitality projects may need tourism, civil defense, and municipality alignment.",
        "Older plots can carry demolition, access, or title-history complications."
      ]
    },
    ar: {
      name: "جدة",
      kicker: "بوابة البحر الأحمر",
      summary: "تستفيد مشاريع الضيافة والتجزئة والسكن من السياحة ونشاط الميناء، لكن القيود الساحلية وتصريف المياه ترفع أهمية الفحص الفني المبكر.",
      demand: "مرتفع",
      timeline: "4-8 أشهر",
      risk: "متوسط إلى مرتفع",
      watch: [
        "اشتراطات الساحل وتصريف السيول قد تؤثر على الأقبية والمنصات وأنظمة الخدمات.",
        "مشاريع الضيافة قد تحتاج تنسيقاً مع السياحة والدفاع المدني والبلدية.",
        "الأراضي القديمة قد تحمل تعقيدات هدم أو وصول أو تاريخ ملكية."
      ]
    }
  },
  neom: {
    cityValue: "NEOM / Tabuk",
    en: {
      name: "NEOM / Tabuk",
      kicker: "Giga-project frontier",
      summary: "Major upside exists for logistics, workforce housing, hospitality, and specialist contractors, but procurement, environmental, and master-plan alignment risks are higher.",
      demand: "Selective high",
      timeline: "6-12 months",
      risk: "High",
      watch: [
        "Master-plan compatibility and client-side procurement rules can matter more than normal municipal flow.",
        "Environmental and coastal impact reviews may materially change schedule.",
        "Remote logistics and labor accommodation assumptions should be costed conservatively."
      ]
    },
    ar: {
      name: "نيوم / تبوك",
      kicker: "واجهة المشاريع العملاقة",
      summary: "توجد فرص كبيرة في اللوجستيات وسكن العمالة والضيافة والمقاولين المتخصصين، لكن مخاطر المشتريات والبيئة والمواءمة مع المخطط العام أعلى.",
      demand: "مرتفع انتقائياً",
      timeline: "6-12 شهراً",
      risk: "مرتفع",
      watch: [
        "مواءمة المخطط العام وقواعد المشتريات قد تكون أهم من مسار البلدية التقليدي.",
        "المراجعات البيئية والساحلية قد تغير الجدول بشكل كبير.",
        "يجب تسعير اللوجستيات البعيدة وسكن العمالة بتحفظ."
      ]
    }
  },
  eastern: {
    cityValue: "Dammam / Eastern Province",
    en: {
      name: "Eastern Province",
      kicker: "Industrial and logistics base",
      summary: "Industrial, warehousing, and staff housing projects are well matched to the region, with added attention needed for environmental, civil defense, and utility loads.",
      demand: "High",
      timeline: "3-7 months",
      risk: "Medium",
      watch: [
        "Industrial uses need early checks on environmental classification and hazardous materials.",
        "Warehouse fire strategy and civil defense requirements can drive layout changes.",
        "Power load, truck access, and port connectivity are central feasibility inputs."
      ]
    },
    ar: {
      name: "المنطقة الشرقية",
      kicker: "قاعدة صناعية ولوجستية",
      summary: "تناسب المنطقة المشاريع الصناعية والمستودعات وسكن الموظفين، مع ضرورة الانتباه للبيئة والدفاع المدني وأحمال المرافق.",
      demand: "مرتفع",
      timeline: "3-7 أشهر",
      risk: "متوسط",
      watch: [
        "الاستخدامات الصناعية تحتاج تحققاً مبكراً من التصنيف البيئي والمواد الخطرة.",
        "استراتيجية الحريق ومتطلبات الدفاع المدني قد تغير التخطيط الداخلي للمستودعات.",
        "أحمال الكهرباء ووصول الشاحنات والربط بالموانئ عناصر أساسية في الجدوى."
      ]
    }
  },
  qiddiya: {
    cityValue: "Qiddiya",
    en: {
      name: "Qiddiya",
      kicker: "Entertainment cluster",
      summary: "Entertainment, hospitality, retail, and contractor-support projects can benefit from destination growth, but approvals depend heavily on master developer rules.",
      demand: "Emerging high",
      timeline: "5-10 months",
      risk: "Medium-high",
      watch: [
        "Brand, visitor-flow, and master-developer controls can shape what is permitted.",
        "Event safety, crowd movement, and parking assumptions should be tested early.",
        "Temporary works and contractor facilities may have different approval routes."
      ]
    },
    ar: {
      name: "القدية",
      kicker: "تجمع الترفيه",
      summary: "يمكن لمشاريع الترفيه والضيافة والتجزئة وخدمات المقاولين الاستفادة من نمو الوجهة، لكن الموافقات تعتمد كثيراً على اشتراطات المطور الرئيسي.",
      demand: "مرتفع وناشئ",
      timeline: "5-10 أشهر",
      risk: "متوسط إلى مرتفع",
      watch: [
        "ضوابط العلامة التجارية وحركة الزوار والمطور الرئيسي قد تحدد المسموح.",
        "السلامة وحركة الحشود والمواقف يجب اختبارها مبكراً.",
        "الأعمال المؤقتة ومرافق المقاولين قد تسلك مسارات موافقة مختلفة."
      ]
    }
  },
  redsea: {
    cityValue: "Red Sea Project",
    en: {
      name: "Red Sea Project",
      kicker: "Luxury coastal destination",
      summary: "Premium hospitality and marine-adjacent work carry strong opportunity, with strict environmental, coastal, and sustainability expectations.",
      demand: "Selective high",
      timeline: "6-12 months",
      risk: "High",
      watch: [
        "Environmental sensitivity can affect site access, materials, and construction methods.",
        "Hospitality quality standards may require higher contingency and specialist suppliers.",
        "Marine, coastal, and protected-area interfaces should be clarified before concept design."
      ]
    },
    ar: {
      name: "مشروع البحر الأحمر",
      kicker: "وجهة ساحلية فاخرة",
      summary: "تحمل مشاريع الضيافة الفاخرة والأعمال القريبة من البحر فرصاً قوية، مع توقعات صارمة للبيئة والساحل والاستدامة.",
      demand: "مرتفع انتقائياً",
      timeline: "6-12 شهراً",
      risk: "مرتفع",
      watch: [
        "الحساسية البيئية قد تؤثر على الوصول للموقع والمواد وطرق التنفيذ.",
        "معايير الضيافة الفاخرة قد تتطلب احتياطياً أعلى وموردين متخصصين.",
        "يجب توضيح الواجهات البحرية والساحلية والمناطق المحمية قبل التصميم المبدئي."
      ]
    }
  }
};

const mapPlaces = [
  { region: "riyadh", label: "Riyadh", lat: 24.7136, lng: 46.6753, zoom: 12 },
  { region: "jeddah", label: "Jeddah", lat: 21.4858, lng: 39.1925, zoom: 12 },
  { region: "neom", label: "NEOM / Tabuk", lat: 28.3835, lng: 36.5662, zoom: 10 },
  { region: "eastern", label: "Dammam / Khobar", lat: 26.4207, lng: 50.0888, zoom: 11 },
  { region: "qiddiya", label: "Qiddiya", lat: 24.6333, lng: 46.3167, zoom: 12 },
  { region: "redsea", label: "Red Sea Project", lat: 25.6427, lng: 37.6361, zoom: 10 },
  { region: "mecca", label: "Mecca", lat: 21.3891, lng: 39.8579, zoom: 12 },
  { region: "medina", label: "Medina", lat: 24.5247, lng: 39.5692, zoom: 12 },
  { region: "diriyah", label: "Diriyah", lat: 24.7344, lng: 46.5756, zoom: 13 }
];

const consultantMatches = [
  { name: "Riyadh Permit Studio", specialty: "Balady submissions, zoning review, civil defense coordination" },
  { name: "Hijaz Engineering Office", specialty: "Jeddah hospitality, coastal sites, municipality letters" },
  { name: "Eastern Industrial Consultants", specialty: "Warehouses, logistics yards, environmental classification" }
];

const benchmarkProjects = [
  "Riyadh mixed-use, 2,400 m² BUA: approved in 5 months with Balady + Civil Defense review.",
  "Jeddah hospitality fit-out: 7 months due to coastal drainage and parking revisions.",
  "Eastern Province warehouse: 4 months after fire strategy was revised before submission."
];

const DATA_FRESHNESS_NOTE = "Based on Saudi Building Code 2021 and Baladiya guidelines current as of 2024. Regulations change — verify critical items with your local municipality before proceeding.";
const STANDARD_FAR_LIMIT = 2.5;

const costBenchmarks = {
  residential: { label: "Residential construction", low: 1200, high: 2800 },
  residentialHighEnd: { label: "High-end residential", low: 2800, high: 5000 },
  commercial: { label: "Commercial standard", low: 2000, high: 3500 },
  commercialPremium: { label: "Commercial premium", low: 3500, high: 6000 },
  industrial: { label: "Industrial/warehouse", low: 800, high: 1400 },
  hospitality: { label: "Hotel/hospitality", low: 4000, high: 9000 }
};

let language = localStorage.getItem("binna:language") || "en";
let latestReport = null;
let latestReportId = null;
let activeRegion = "riyadh";
let saudiMap = null;
const mapMarkers = new Map();

const form = document.getElementById("project-form");
const resultsEl = document.getElementById("results-section");
const reportsLeftEl = document.getElementById("reports-left");
const analyzeButton = document.getElementById("analyze-button");
const languageToggle = document.getElementById("language-toggle");

function t(key) {
  return translations[language][key] || translations.en[key] || key;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getReports() {
  try {
    return JSON.parse(localStorage.getItem(historyKey) || "[]");
  } catch {
    return [];
  }
}

function saveReports(reports) {
  localStorage.setItem(historyKey, JSON.stringify(reports.slice(0, 20)));
}

function getUsedCount() {
  return Number(localStorage.getItem(countKey) || "0");
}

function setUsedCount(count) {
  localStorage.setItem(countKey, String(count));
  updateReportCount();
}

function updateReportCount() {
  const left = Math.max(0, FREE_REPORT_LIMIT - getUsedCount());
  reportsLeftEl.textContent = String(left);
}

function setSelectByText(selectId, matcher) {
  const select = document.getElementById(selectId);
  const option = [...select.options].find((item) => matcher.test(item.textContent));
  if (option) select.value = option.value || option.textContent;
}

function getCostBenchmarkForType(type = "") {
  if (/warehouse|industrial/i.test(type)) return costBenchmarks.industrial;
  if (/hotel|hospitality/i.test(type)) return costBenchmarks.hospitality;
  if (/commercial|retail|mall|mixed-use/i.test(type)) return costBenchmarks.commercial;
  return costBenchmarks.residential;
}

function parseBudgetRange(value = "") {
  if (/Under 500K/i.test(value)) return { low: 0, high: 500_000 };
  if (/500K - 2M|500K – 2M/i.test(value)) return { low: 500_000, high: 2_000_000 };
  if (/2M - 10M|2M – 10M/i.test(value)) return { low: 2_000_000, high: 10_000_000 };
  if (/10M - 50M|10M – 50M/i.test(value)) return { low: 10_000_000, high: 50_000_000 };
  if (/50M - 200M|50M – 200M/i.test(value)) return { low: 50_000_000, high: 200_000_000 };
  if (/Over 200M/i.test(value)) return { low: 200_000_000, high: Number.POSITIVE_INFINITY };
  return null;
}

function updateCostEstimate() {
  const bua = Number(document.getElementById("bua").value || 0);
  const type = document.getElementById("type").value;
  const city = document.getElementById("city").value;
  const target = document.getElementById("live-cost");
  if (!target) return;

  if (!bua) {
    target.textContent = language === "ar" ? "أدخل مساحة البناء" : "Enter BUA to estimate";
    return;
  }

  const cityMultipliers = {
    Riyadh: 1.08,
    Jeddah: 1.06,
    "NEOM / Tabuk": 1.22,
    "Dammam / Eastern Province": 1.03,
    Qiddiya: 1.18,
    "Red Sea Project": 1.28
  };
  const benchmark = getCostBenchmarkForType(type);
  const multiplier = cityMultipliers[city] || 1;
  const low = Math.round((bua * benchmark.low * multiplier) / 10000) * 10000;
  const high = Math.round((bua * benchmark.high * multiplier) / 10000) * 10000;
  target.textContent = `${low.toLocaleString()} - ${high.toLocaleString()} SAR`;
}

function getDeterministicAssessment(project) {
  const flags = [];
  const city = project.city || "";
  const details = project.details || "";
  const type = project.type || "";
  const plot = Number(project.plot || 0);
  const bua = Number(project.bua || 0);
  const floors = Number(project.floors || 0);
  const budget = parseBudgetRange(project.budget);
  let far = null;
  let forceZoningHigh = false;
  let forceCostHigh = false;

  if (plot > 0 && bua > 0 && floors > 0) {
    far = (bua * floors) / plot;
    if (far > STANDARD_FAR_LIMIT) {
      forceZoningHigh = true;
      flags.push({
        level: "high",
        text: `Calculated FAR of ${far.toFixed(2)} exceeds standard limit of ${STANDARD_FAR_LIMIT} for most Saudi districts. This is the #1 cause of permit rejection.`
      });
    } else {
      flags.push({ level: "good", text: `Calculated FAR is ${far.toFixed(2)}, below the ${STANDARD_FAR_LIMIT} benchmark used for many Saudi districts.` });
    }
  }

  if (bua > 0 && budget) {
    const benchmark = getCostBenchmarkForType(type);
    const minimum = bua * benchmark.low;
    if (budget.high < minimum) {
      forceCostHigh = true;
      flags.push({
        level: "high",
        text: `Budget may be insufficient. ${benchmark.label} in Saudi runs ${benchmark.low.toLocaleString()}-${benchmark.high.toLocaleString()} SAR/m², suggesting a minimum budget of ${minimum.toLocaleString()} SAR for this scope.`
      });
    } else if (budget.low < minimum && Number.isFinite(budget.high)) {
      flags.push({
        level: "warn",
        text: `Selected budget range overlaps the minimum expected cost. ${benchmark.label} suggests at least ${minimum.toLocaleString()} SAR for this scope.`
      });
    }
  }

  if (/Jeddah/i.test(city)) flags.push({ level: "warn", text: "Jeddah selected: automatically flag coastal, drainage, seismic zone 2B, and heritage review exposure." });
  if (/NEOM|Tabuk/i.test(city)) flags.push({ level: "warn", text: "NEOM/Tabuk selected: standard Baladiya rules may not apply; NEOM Authority approvals are required." });
  if (/Mecca|Medina/i.test(city)) flags.push({ level: "warn", text: "Mecca/Medina selected: Haram boundary, access, and ownership restrictions may apply." });
  if (/mosque|مسجد/i.test(details)) flags.push({ level: "warn", text: "Plot adjacent to mosque: apply 10m minimum setback risk flag." });
  if (/coast|water|wadi|بحر|وادي/i.test(details)) flags.push({ level: "warn", text: "Near water/coastal/wadi: add Coastal Development Authority or flood/drainage review risk and 30-60 day add-on." });
  if (/heritage|diriyah|al-balad|تراث|تاريخ/i.test(details)) flags.push({ level: "warn", text: "Heritage district risk: SCTH/heritage review can add 60-90 days." });
  if (/airport|مطار/i.test(details)) flags.push({ level: "warn", text: "Airport proximity: GACA height restrictions and flight path clearance may apply." });

  return { flags, far, forceZoningHigh, forceCostHigh };
}

function analyzeDocumentText(text, fileName = "") {
  const findings = [];
  const source = `${fileName} ${text}`.toLowerCase();

  if (/riyadh|الرياض/.test(source)) setSelectByText("city", /Riyadh/);
  if (/jeddah|جدة/.test(source)) setSelectByText("city", /Jeddah/);
  if (/tabuk|neom|نيوم|تبوك/.test(source)) setSelectByText("city", /NEOM/);
  if (/warehouse|مستودع|logistics/.test(source)) setSelectByText("type", /Warehouse/);
  if (/villa|فيلا/.test(source)) setSelectByText("type", /villa/i);
  if (/commercial|تجاري/.test(source)) setSelectByText("zone", /Commercial/);
  if (/residential|سكني/.test(source)) setSelectByText("zone", /Residential/);

  const areaMatch = source.match(/(\d{3,6})\s*(m2|m²|sqm|م2|م²)/);
  if (areaMatch && !document.getElementById("plot").value) {
    document.getElementById("plot").value = areaMatch[1];
  }

  if (/setback|ارتداد|ارتدادات/.test(source)) findings.push(["warn", "Setback language found. Verify required setbacks before concept design."]);
  if (/easement|right of way|حق مرور|حرم/.test(source)) findings.push(["warn", "Possible easement or right-of-way restriction detected."]);
  if (/heritage|تراث|historic|تاريخ/.test(source)) findings.push(["warn", "Heritage or historic-area language detected. Expect additional review."]);
  if (/civil defense|الدفاع المدني|fire/.test(source)) findings.push(["good", "Civil Defense appears in the document. Include fire strategy early."]);
  if (!findings.length) findings.push(["good", "Document received. No obvious keyword risks found in this MVP scan."]);

  const details = document.getElementById("details");
  const note = `Document scan (${fileName || "uploaded file"}): ${findings.map((item) => item[1]).join(" ")}`;
  details.value = details.value ? `${details.value}\n\n${note}` : note;
  updateCostEstimate();
  return findings;
}

function renderDocumentFindings(findings) {
  const target = document.getElementById("document-findings");
  target.innerHTML = findings.map(([level, text]) => `<div class="mini-item ${level}">${escapeHtml(text)}</div>`).join("");
}

function renderIntelligenceLists() {
  const consultants = document.getElementById("consultant-list");
  if (consultants) {
    consultants.innerHTML = consultantMatches.map((item) => `
      <div class="consultant-card">
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(item.specialty)}</span>
      </div>
    `).join("");
  }

  const benchmarks = document.getElementById("benchmark-list");
  if (benchmarks) {
    benchmarks.innerHTML = benchmarkProjects.map((item) => `<div class="mini-item">${escapeHtml(item)}</div>`).join("");
  }
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.body.dir = document.documentElement.dir;
  languageToggle.textContent = language === "ar" ? "En" : "ع";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder));
  });

  updateReportCount();
  updateCostEstimate();
  renderHistory();
  renderIntelligenceLists();
  renderRegionDetail();
  if (latestReport) renderResults(latestReport.result, latestReport.project, false);
}

function readProject() {
  return Object.fromEntries(new FormData(form).entries());
}

function buildSampleResult(project) {
  const city = project.city || "Riyadh";
  const type = project.type || "Commercial building";

  return {
    feasibility_score: 72,
    verdict: "Proceed with Caution",
    summary: `${type} in ${city} appears feasible at concept stage, but zoning confirmation, parking strategy, and Civil Defense alignment should be checked before paying for detailed design. The strongest risk is approval timeline uncertainty if the site has district-specific constraints or incomplete utility capacity.`,
    estimated_permit_timeline: "4-7 months",
    risks: {
      compliance: {
        level: "Medium",
        confidence: "High",
        detail: "Saudi Building Code and Civil Defense requirements are manageable, but early fire strategy and accessibility review are needed before submission."
      },
      cost: {
        level: "Medium",
        confidence: "High",
        detail: "Current scope may face material and MEP cost pressure. Keep a 12-18% contingency until drawings and utility loads are confirmed."
      },
      timeline: {
        level: "Medium",
        confidence: "Medium",
        detail: `${city} approvals are usually efficient when documents are complete, but parking, traffic, and utility comments can add review cycles.`
      },
      zoning: {
        level: "High",
        confidence: "Low",
        detail: "Zoning is not verified from official GIS data yet. Confirm land-use classification, setbacks, and street frontage before concept approval."
      }
    },
    required_approvals: [
      "Balady building permit submission through the relevant Amanah/Municipality",
      "Saudi Civil Defense review for fire and life safety",
      "Saudi Building Code compliance certificate from licensed engineer",
      "Utility coordination with electricity, water, and telecom providers",
      "Traffic and parking review if commercial frontage or high visitor load applies"
    ],
    key_recommendations: [
      "Request official zoning confirmation before appointing the full design team.",
      "Prepare a parking and access sketch before concept submission.",
      "Ask the architect to flag setbacks, frontage, height limits, and Civil Defense access in the first drawing package."
    ],
    vision_2030_note: `${city} continues to benefit from Vision 2030-driven construction demand, especially for well-located commercial and mixed-use assets.`,
    data_freshness_note: DATA_FRESHNESS_NOTE
  };
}

function normalizeAnalysisResult(result, project) {
  const assessment = getDeterministicAssessment(project);
  const normalized = structuredClone(result);
  normalized.risks ||= {};

  ["compliance", "cost", "timeline", "zoning"].forEach((key) => {
    normalized.risks[key] ||= { level: "Medium", detail: "Needs manual verification." };
    normalized.risks[key].confidence ||= key === "zoning" ? "Low" : "Medium";
  });

  if (assessment.forceZoningHigh) {
    normalized.risks.zoning.level = "High";
    normalized.risks.zoning.confidence = "High";
    const farFlag = assessment.flags.find((flag) => flag.text.includes("Calculated FAR"));
    normalized.risks.zoning.detail = `${farFlag.text} ${normalized.risks.zoning.detail}`;
    normalized.feasibility_score = Math.min(Number(normalized.feasibility_score) || 65, 58);
    normalized.verdict = normalized.verdict === "Not Recommended" ? normalized.verdict : "High Risk";
  }

  if (assessment.forceCostHigh) {
    normalized.risks.cost.level = "High";
    normalized.risks.cost.confidence = "High";
    const budgetFlag = assessment.flags.find((flag) => flag.text.includes("Budget may be insufficient"));
    normalized.risks.cost.detail = `${budgetFlag.text} ${normalized.risks.cost.detail}`;
    normalized.feasibility_score = Math.min(Number(normalized.feasibility_score) || 65, 62);
  }

  normalized.deterministic_flags = assessment.flags;
  normalized.data_freshness_note = normalized.data_freshness_note || DATA_FRESHNESS_NOTE;
  return normalized;
}

function showLoading() {
  resultsEl.hidden = false;
  resultsEl.innerHTML = `
    <div class="section-card loading">
      <div class="spinner"></div>
      <p>${escapeHtml(t("loading"))}</p>
    </div>
  `;
  resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showError(message) {
  resultsEl.hidden = false;
  const copy = message.includes("ANTHROPIC_API_KEY") ? t("serverMissingKey") : t("error");
  resultsEl.innerHTML = `
    <div class="error-box">
      ${escapeHtml(copy)}
      <small>${escapeHtml(message)}</small>
    </div>
  `;
}

function showPaywall() {
  resultsEl.hidden = false;
  resultsEl.innerHTML = `
    <div class="paywall-box">
      ${escapeHtml(t("paywall"))}
    </div>
  `;
  switchPanel("plans");
}

function riskClass(level = "") {
  return String(level).toLowerCase();
}

function renderResults(result, project, shouldScroll = true, reportId = latestReportId) {
  if (!result.deterministic_flags) {
    result = normalizeAnalysisResult(result, project);
  }
  latestReport = { result, project };
  latestReportId = reportId;
  const risks = result.risks || {};
  const riskLabels = {
    compliance: "Compliance",
    cost: "Cost",
    timeline: "Timeline",
    zoning: "Zoning"
  };

  const riskCards = ["compliance", "cost", "timeline", "zoning"].map((key) => {
    const item = risks[key] || { level: "Medium", detail: "Needs further verification." };
    return `
      <div class="risk-item">
        <div class="risk-top">
          <span class="risk-name">${escapeHtml(riskLabels[key])}</span>
          <span class="risk-badge ${escapeHtml(riskClass(item.level))}">${escapeHtml(item.level)}</span>
        </div>
        <div class="confidence-line">${escapeHtml(t("confidence"))}: ${escapeHtml(item.confidence || "Medium")}</div>
        <div class="risk-detail">${escapeHtml(item.detail)}</div>
      </div>
    `;
  }).join("");

  const approvals = (result.required_approvals || []).map((approval, index) => `
    <div class="list-item">
      <span class="list-dot amber">${index + 1}</span>
      <span>${escapeHtml(approval)}</span>
    </div>
  `).join("");

  const recommendations = (result.key_recommendations || []).map((recommendation) => `
    <div class="list-item">
      <span class="list-dot green">✓</span>
      <span>${escapeHtml(recommendation)}</span>
    </div>
  `).join("");

  resultsEl.hidden = false;
  resultsEl.innerHTML = `
    <div class="results-wrap">
      <div class="share-box">
        <strong>Shareable report link</strong>
        <p>This MVP link reopens the saved report on this device. Production should store the report server-side so investors and clients can open it anywhere.</p>
        <div class="actions-row">
          <button class="btn-secondary" type="button" data-action="share">${escapeHtml(t("shareReport"))}</button>
        </div>
      </div>

      <div class="score-card">
        <div class="score-circle">
          <span class="score-num">${escapeHtml(result.feasibility_score)}</span>
          <span class="score-denom">/ 100</span>
        </div>
        <div class="score-info">
          <div class="score-verdict">${escapeHtml(result.verdict)}</div>
          <div class="score-summary">${escapeHtml(result.summary)}</div>
          <div class="score-pill">${escapeHtml(t("permitTimeline"))}: ${escapeHtml(result.estimated_permit_timeline)}</div>
          ${result.vision_2030_note ? `<div class="score-pill">${escapeHtml(t("visionNote"))}: ${escapeHtml(result.vision_2030_note)}</div>` : ""}
        </div>
      </div>

      <div class="section-card">
        <h3>${escapeHtml(t("riskBreakdown"))}</h3>
        <div class="risk-grid">${riskCards}</div>
      </div>

      <div class="section-card">
        <h3>${escapeHtml(t("deterministicFlags"))}</h3>
        ${(result.deterministic_flags?.length ? result.deterministic_flags : [{ level: "good", text: "No automatic FAR, city, or budget red flags triggered." }]).map((flag) => `<div class="mini-item ${escapeHtml(flag.level === "high" ? "warn" : flag.level)}">${escapeHtml(flag.text)}</div>`).join("")}
      </div>

      <div class="section-card">
        <h3>${escapeHtml(t("approvals"))}</h3>
        ${approvals}
      </div>

      <div class="section-card">
        <h3>${escapeHtml(t("recommendations"))}</h3>
        ${recommendations}
      </div>

      <div class="section-card">
        <h3>${escapeHtml(t("benchmarksTitle"))}</h3>
        ${benchmarkProjects.slice(0, 3).map((item) => `<div class="list-item"><span class="list-dot green">↗</span><span>${escapeHtml(item)}</span></div>`).join("")}
      </div>

      <div class="section-card">
        <h3>${escapeHtml(t("marketTitle"))}</h3>
        ${consultantMatches.map((item) => `<div class="list-item"><span class="list-dot amber">✓</span><span><strong>${escapeHtml(item.name)}</strong><br>${escapeHtml(item.specialty)}</span></div>`).join("")}
      </div>

      <div class="section-card">
        <h3>${escapeHtml(t("dataFreshness"))}</h3>
        <div class="risk-detail">${escapeHtml(result.data_freshness_note || DATA_FRESHNESS_NOTE)}</div>
      </div>

      <div class="actions-row">
        <button class="btn-secondary" type="button" data-action="reset">${escapeHtml(t("another"))}</button>
        <button class="btn-secondary" type="button" data-action="email">${escapeHtml(t("email"))}</button>
        <button class="btn-primary" type="button" data-action="print">${escapeHtml(t("print"))}</button>
      </div>
    </div>
  `;

  if (shouldScroll) resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

function persistReport(result, project) {
  const reports = getReports();
  const saved = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    project,
    result
  };
  reports.unshift(saved);
  saveReports(reports);
  renderHistory();
  return saved.id;
}

function renderHistory() {
  const list = document.getElementById("history-list");
  const reports = getReports();

  if (!reports.length) {
    list.innerHTML = `<div class="empty-state">${escapeHtml(t("emptyHistory"))}</div>`;
    return;
  }

  const scores = reports.map((report) => Number(report.result.feasibility_score) || 0);
  const best = reports[scores.indexOf(Math.max(...scores))];
  const avg = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);

  const compare = `
    <div class="compare-grid">
      <div class="compare-card">
        <strong>${reports.length}</strong>
        <span>Projects analyzed</span>
      </div>
      <div class="compare-card">
        <strong>${avg}/100</strong>
        <span>Average feasibility</span>
      </div>
      <div class="compare-card">
        <strong>${escapeHtml(best.project.city || "N/A")}</strong>
        <span>Strongest current option</span>
      </div>
    </div>
  `;

  list.innerHTML = compare + reports.map((report) => {
    const date = new Intl.DateTimeFormat(language === "ar" ? "ar-SA" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(report.createdAt));

    return `
      <article class="history-card">
        <div>
          <div class="history-title">${escapeHtml(report.project.city)} · ${escapeHtml(report.project.type)}</div>
          <div class="history-meta">${escapeHtml(report.result.verdict)} · ${escapeHtml(report.result.feasibility_score)}/100 · ${escapeHtml(date)}</div>
        </div>
        <button class="btn-secondary small" type="button" data-report-id="${escapeHtml(report.id)}">${escapeHtml(t("openReport"))}</button>
      </article>
    `;
  }).join("");
}

function renderRegionDetail() {
  const detail = document.getElementById("map-detail");
  if (!detail) return;

  const region = regionData[activeRegion];
  const copy = region[language] || region.en;

  document.querySelectorAll(".map-chip").forEach((pin) => {
    pin.classList.toggle("selected", pin.dataset.region === activeRegion);
  });

  detail.innerHTML = `
    <div class="map-kicker">${escapeHtml(copy.kicker)}</div>
    <h3>${escapeHtml(copy.name)}</h3>
    <p>${escapeHtml(copy.summary)}</p>
    <button class="btn-primary map-prefill-button" type="button" id="map-prefill">${escapeHtml(t("mapPrefill"))}</button>
    <div class="map-metrics">
      <div class="map-metric">
        <strong>${escapeHtml(copy.demand)}</strong>
        <span>${escapeHtml(t("mapContext"))}</span>
      </div>
      <div class="map-metric">
        <strong>${escapeHtml(copy.timeline)}</strong>
        <span>${escapeHtml(t("mapPermit"))}</span>
      </div>
      <div class="map-metric">
        <strong>${escapeHtml(copy.risk)}</strong>
        <span>${escapeHtml(t("mapRisk"))}</span>
      </div>
    </div>
    <ul class="map-list">
      ${copy.watch.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function initializeSaudiMap() {
  const mapEl = document.getElementById("saudi-map");
  if (!mapEl || saudiMap) return;

  if (!window.L) {
    mapEl.innerHTML = `<div class="map-fallback">${escapeHtml(t("mapFallback"))}</div>`;
    return;
  }

  saudiMap = window.L.map(mapEl, {
    center: [23.8859, 45.0792],
    zoom: 5,
    minZoom: 5,
    maxZoom: 19,
    zoomControl: true,
    scrollWheelZoom: true
  });

  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(saudiMap);

  const icon = window.L.divIcon({
    className: "",
    html: '<span class="map-marker"></span>',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -12]
  });

  mapPlaces.forEach((place) => {
    const marker = window.L.marker([place.lat, place.lng], { icon })
      .addTo(saudiMap)
      .bindPopup(`<strong>${escapeHtml(place.label)}</strong>`);

    marker.on("click", () => {
      activeRegion = regionData[place.region] ? place.region : activeRegion;
      renderRegionDetail();
      focusMapRegion(place.region, false);
    });

    mapMarkers.set(place.region, marker);
  });

  saudiMap.on("click", (event) => {
    const nearest = mapPlaces
      .map((place) => ({
        ...place,
        distance: Math.hypot(place.lat - event.latlng.lat, place.lng - event.latlng.lng)
      }))
      .sort((a, b) => a.distance - b.distance)[0];

    if (nearest?.region && regionData[nearest.region]) {
      activeRegion = nearest.region;
      renderRegionDetail();
      document.getElementById("details").value = `Map pin: ${event.latlng.lat.toFixed(5)}, ${event.latlng.lng.toFixed(5)} near ${nearest.label}. Real zoning lookup should connect this coordinate to Balady/Amanah GIS layers.`;
    }
  });

  setTimeout(() => saudiMap.invalidateSize(), 0);
}

function focusMapRegion(region, openPopup = true) {
  if (!saudiMap) return;
  const place = mapPlaces.find((item) => item.region === region);
  if (!place) return;

  saudiMap.flyTo([place.lat, place.lng], place.zoom, {
    animate: true,
    duration: 0.7
  });

  if (openPopup) {
    mapMarkers.get(region)?.openPopup();
  }
}

function switchPanel(panel) {
  document.querySelectorAll(".tab").forEach((tab) => {
    const active = tab.dataset.panel === panel;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  document.querySelectorAll(".panel").forEach((el) => {
    el.classList.toggle("active", el.id === `panel-${panel}`);
  });

  if (panel === "map") {
    initializeSaudiMap();
    renderRegionDetail();
    setTimeout(() => {
      saudiMap?.invalidateSize();
      focusMapRegion(activeRegion, false);
    }, 0);
  }
}

function switchPanelFromHash() {
  const hash = window.location.hash.replace("#", "");
  if (hash.startsWith("report=")) {
    const id = hash.replace("report=", "");
    const report = getReports().find((item) => item.id === id);
    if (report) {
      switchPanel("analyzer");
      renderResults(report.result, report.project, true, report.id);
      return;
    }
  }

  const panel = hash;
  if (["analyzer", "map", "intelligence", "history", "plans"].includes(panel)) {
    switchPanel(panel);
  }
}

async function analyze(event) {
  event.preventDefault();

  if (getUsedCount() >= FREE_REPORT_LIMIT) {
    showPaywall();
    return;
  }

  const project = readProject();
  analyzeButton.disabled = true;
  analyzeButton.textContent = t("analyzing");
  showLoading();

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(project)
    });

    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Analysis failed.");

    setUsedCount(getUsedCount() + 1);
    const result = normalizeAnalysisResult(payload.result, project);
    const reportId = persistReport(result, project);
    renderResults(result, project, true, reportId);
  } catch (error) {
    showError(error.message || "Analysis failed.");
  } finally {
    analyzeButton.disabled = false;
    analyzeButton.textContent = t("analyze");
  }
}

document.querySelector(".tabs").addEventListener("click", (event) => {
  const target = event.target.closest(".tab");
  if (!target) return;
  window.location.hash = target.dataset.panel;
  switchPanel(target.dataset.panel);
});

document.querySelectorAll(".map-chip").forEach((pin) => {
  pin.addEventListener("click", () => {
    activeRegion = pin.dataset.region;
    renderRegionDetail();
    focusMapRegion(activeRegion);
  });
});

form.addEventListener("submit", analyze);

document.getElementById("sample-report").addEventListener("click", () => {
  const project = {
    ...readProject(),
    city: document.getElementById("city").value || "Riyadh",
    type: document.getElementById("type").value || "Commercial building",
    bua: document.getElementById("bua").value || "1800",
    plot: document.getElementById("plot").value || "900",
    floors: document.getElementById("floors").value || "4",
    budget: document.getElementById("budget").value || "10M - 50M SAR",
    zone: document.getElementById("zone").value || "Commercial (تجاري)"
  };
  const result = normalizeAnalysisResult(buildSampleResult(project), project);
  const reportId = persistReport(result, project);
  renderResults(result, project, true, reportId);
});

["city", "type", "bua"].forEach((id) => {
  document.getElementById(id).addEventListener("input", updateCostEstimate);
  document.getElementById(id).addEventListener("change", updateCostEstimate);
});

document.getElementById("document-upload").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (file.type.startsWith("text/") || /\.txt$/i.test(file.name)) {
    const text = await file.text();
    renderDocumentFindings(analyzeDocumentText(text, file.name));
    return;
  }

  renderDocumentFindings(analyzeDocumentText(file.name, file.name));
});

document.getElementById("voice-input").addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const status = document.getElementById("voice-status");
  if (!SpeechRecognition) {
    status.textContent = "Voice input needs browser speech recognition. Production version should use Whisper.";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = language === "ar" ? "ar-SA" : "en-US";
  recognition.interimResults = false;
  status.textContent = language === "ar" ? "جار الاستماع..." : "Listening...";
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const details = document.getElementById("details");
    details.value = details.value ? `${details.value}\n${transcript}` : transcript;
    analyzeDocumentText(transcript, "voice input");
    status.textContent = transcript;
  };
  recognition.onerror = () => {
    status.textContent = "Voice capture stopped. Try again or use typed context.";
  };
  recognition.start();
});

languageToggle.addEventListener("click", () => {
  language = language === "en" ? "ar" : "en";
  localStorage.setItem("binna:language", language);
  applyLanguage();
});

resultsEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  if (button.dataset.action === "reset") {
    resultsEl.hidden = true;
    resultsEl.innerHTML = "";
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (button.dataset.action === "print") {
    window.print();
  }

  if (button.dataset.action === "email") {
    alert(t("emailSoon"));
  }

  if (button.dataset.action === "share") {
    const id = latestReportId || persistReport(latestReport.result, latestReport.project);
    latestReportId = id;
    const link = `${window.location.origin}${window.location.pathname}#report=${id}`;
    navigator.clipboard?.writeText(link);
    button.textContent = t("shareCopied");
  }
});

document.getElementById("history-list").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-report-id]");
  if (!button) return;
  const report = getReports().find((item) => item.id === button.dataset.reportId);
  if (!report) return;
  switchPanel("analyzer");
  renderResults(report.result, report.project);
});

document.getElementById("map-detail").addEventListener("click", (event) => {
  if (!event.target.closest("#map-prefill")) return;
  document.getElementById("city").value = regionData[activeRegion].cityValue;
  switchPanel("analyzer");
  form.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("clear-history").addEventListener("click", () => {
  saveReports([]);
  renderHistory();
});

document.getElementById("reset-free-counter").addEventListener("click", () => {
  setUsedCount(0);
});

document.getElementById("whatsapp-draft").addEventListener("click", () => {
  const number = document.getElementById("whatsapp-number").value.trim();
  document.getElementById("whatsapp-status").textContent = number
    ? `Draft ready for ${number}. Connect WhatsApp Business API to send.`
    : "Enter a recipient number to prepare the WhatsApp report draft.";
});

document.getElementById("add-comment").addEventListener("click", () => {
  const input = document.getElementById("team-comment");
  const value = input.value.trim();
  if (!value) return;
  const list = document.getElementById("comment-list");
  list.insertAdjacentHTML("afterbegin", `<div class="mini-item">${escapeHtml(value)}</div>`);
  input.value = "";
});

document.getElementById("risk-alerts").addEventListener("change", (event) => {
  document.getElementById("alerts-status").textContent = event.target.checked
    ? "Alerts enabled locally. Production should monitor Balady/Amanah rule sources and saved project assumptions."
    : "";
});

applyLanguage();
switchPanelFromHash();
window.addEventListener("hashchange", switchPanelFromHash);
