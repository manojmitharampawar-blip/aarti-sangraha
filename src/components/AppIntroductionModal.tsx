'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Sparkles,
  Search,
  FolderHeart,
  Mic,
  Camera,
  ChevronRight,
  ChevronLeft,
  Flame,
  CheckCircle2,
  BookOpen,
  Share2,
  Smartphone,
  HelpCircle,
  Clock,
  Compass,
} from 'lucide-react';

export function openAppGuide() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('vedic:open-app-guide'));
  }
}

export function AppIntroductionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Check if first load
    try {
      const hasCompleted = localStorage.getItem('vedic_onboarding_completed');
      if (!hasCompleted) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 700);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }

    const handler = () => {
      setCurrentSlide(0);
      setIsOpen(true);
    };

    window.addEventListener('vedic:open-app-guide', handler);
    return () => window.removeEventListener('vedic:open-app-guide', handler);
  }, []);

  const handleClose = () => {
    try {
      localStorage.setItem('vedic_onboarding_completed', 'true');
    } catch {
      // ignore
    }
    setIsOpen(false);
  };

  const slides = [
    // Slide 1: Welcome & Overview
    {
      id: 'welcome',
      icon: <Flame className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />,
      badge: 'स्वागतम • Welcome to Vedic Online',
      title: 'संपूर्ण डिजिटल आरती संग्रह व नित्य उपासना',
      subtitle:
        'सर्व देवी-देवतांच्या मराठी आरत्या, स्तोत्रे, नामावली व चालीसा एकाच ठिकाणी — १००% मोफत आणि जाहिरातमुक्त.',
      highlights: [
        {
          emoji: '🪔',
          title: '७५+ पारंपरिक आरत्या व स्तोत्रे',
          desc: 'श्री गणेश, शिव, देवी, विठ्ठल, मारुती, दत्त व सर्व देवतांचे संपूर्ण वाचन संग्रह.',
        },
        {
          emoji: '⚡',
          title: 'शून्य जाहिराती • पूर्णपणे मोफत',
          desc: 'पूजेदरम्यान कोणताही व्यत्यय नाही. पूर्ण मनःशांतीने आणि एकाग्रतेने उपासना करा.',
        },
        {
          emoji: '📶',
          title: 'सर्व डिव्हाइसेसवर १००% ऑफलाइन',
          desc: 'मोबाईल, टॅबलेट किंवा कॉम्प्युटरवर इंटरनेट नसतानाही त्वरित चालते.',
        },
      ],
    },

    // Slide 2: Search
    {
      id: 'search',
      icon: <Search className="w-6 h-6 text-saffron-600" />,
      badge: 'शोध वैशिष्ट्य • How Search Works',
      title: 'कोणतीही आरती सेकंदात कशी शोधावी?',
      subtitle:
        'अचूक, वेगवान आणि स्मार्ट शोध प्रणाली ज्याने तुम्हाला हवी असलेली उपासना त्वरित मिळते.',
      highlights: [
        {
          emoji: '🔍',
          title: 'स्मार्ट शोध बार (Instant Search)',
          desc: 'आरतीचे नाव किंवा ओळ टाइप करा (उदा. "सुखकर्ता", "लवथवती", "शेंदुर लाल") आणि त्वरित वाचा.',
        },
        {
          emoji: '🕉️',
          title: 'देवता व वर्गवारी फिल्टर्स',
          desc: 'गणपती, शंकर, विठ्ठल, किंवा देवीच्या टॅगवर टॅप करा आणि त्या देवतेच्या सर्व आरत्या एका क्लिकवर पाहा.',
        },
        {
          emoji: '🔤',
          title: 'मराठी किंवा English दोन्हीमध्ये',
          desc: '"ganpati" लिहा किंवा "गणपती", आमचे अल्गोरिदम दोन्ही लिपी सहज समजून योग्य निकाल देते.',
        },
      ],
    },

    // Slide 3: Groups & Collections
    {
      id: 'groups',
      icon: <FolderHeart className="w-6 h-6 text-rose-500" />,
      badge: 'पूजा संग्रह • How Collections & Groups Work',
      title: 'नित्य उपासना संग्रह व स्वतःची प्लेलिस्ट कशी बनवावी?',
      subtitle:
        'वार आणि सणानुसार तयार केलेले आरती संग्रह, आणि तुमच्या स्वतःच्या आवडीचा सानुकूल संच.',
      highlights: [
        {
          emoji: '📑',
          title: 'तयार नित्य उपासना संग्रह (Curated Playlists)',
          desc: 'मंगळवार गणेश पूजा, गुरुवार दत्त उपासना, प्रभात काकड आरती असे एकामागून एक सलग आरत्यांचे संच.',
        },
        {
          emoji: '➕',
          title: 'स्वतःचे सानुकूल संग्रह (Custom Groups)',
          desc: 'तुमच्या घरच्या पूजेच्या क्रमानुसार हव्या त्या आरत्या एकत्र जोडून स्वतःचा नवीन संग्रह बनवा.',
        },
        {
          emoji: '🔗',
          title: 'कुटुंबासोबत शेअर करा (WhatsApp & QR)',
          desc: 'तयार केलेला संग्रह एका क्लिकवर WhatsApp लिंक किंवा QR कोडने नातेवाईक व मित्रमंडळाला पाठवा.',
        },
      ],
    },

    // Slide 4: AI & Touchless Technology
    {
      id: 'ai-features',
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      badge: 'नाविन्यपूर्ण तंत्रज्ञान • AI & Touchless Features',
      title: 'वाणी स्क्रोल आणि स्पर्शविरहित आरती कशी मदत करते?',
      subtitle:
        'पूजा करताना प्रत्यक्ष येणाऱ्या अडचणींवर अत्याधुनिक AI तंत्रज्ञानाने केलेले मात.',
      highlights: [
        {
          emoji: '🎙️',
          title: 'वाणी स्क्रोल (AI Voice Scroll)',
          desc: 'हातात आरतीचे तबक असताना स्क्रीन स्क्रोल करणे अशक्य असते. ॲप तुमचा आवाज ऐकून आपोआप स्क्रीन खाली स्क्रोल करते!',
        },
        {
          emoji: '📹',
          title: 'स्पर्शविरहित व्हर्च्युअल आरती (Touchless Aarti)',
          desc: 'हळदी-कुंकवाचे हात स्क्रीनला न लावता फक्त कॅमेऱ्यासमोर हात ओवाळा — ३D दिवा फिरेल आणि घंटानाद होईल!',
        },
        {
          emoji: '📍',
          title: 'स्थानिक अचूक पंचांग व सूर्योदय',
          desc: 'तुमच्या गावातील/शहरातील अचूक सूर्योदय, सूर्यास्त आणि दैनिक तिथीनुसार योग्य उपासनेची शिफारस.',
        },
      ],
    },

    // Slide 5: Reading Experience & Offline PWA
    {
      id: 'reading',
      icon: <BookOpen className="w-6 h-6 text-emerald-600" />,
      badge: 'वाचन व ऑफलाइन • Kindle-Grade Reading',
      title: 'वाचनाचा समृद्ध अनुभव व ॲप इन्स्टॉलेशन',
      subtitle:
        'डोळ्यांना आराम देणारी रंगसंगती, अक्षरांचा आकार आणि ॲप होम स्क्रीनवर सेव्ह करण्याची सोय.',
      highlights: [
        {
          emoji: '🎨',
          title: '३ पवित्र रंगसंगती (Chandan, Pooja Diya, Dark)',
          desc: 'दिवसासाठी चंदन, संध्याकाळच्या पूजेसाठी सुवर्ण दीप, व रात्रीसाठी गडद रंगसंगती.',
        },
        {
          emoji: '🇮🇳',
          title: 'मराठी व English Dual-Script',
          desc: 'मराठी न वाचता येणाऱ्या तरुण पिढी व लहान मुलांसाठी इंग्रजी उच्चार (Roman Phonetics) एकाच वेळी.',
        },
        {
          emoji: '📲',
          title: 'होम स्क्रीनवर ॲप इन्स्टॉल करा (PWA)',
          desc: 'ॲप स्टोअरमध्ये न जाता थेट ब्राऊझरमधून मोबाईल किंवा लॅपटॉपवर इन्स्टॉल करा.',
        },
      ],
    },
  ];

  if (!isOpen) return null;

  const current = slides[currentSlide];
  const isLast = currentSlide === slides.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[var(--card-main)] border border-[var(--border-main)] shadow-2xl p-5 sm:p-6 overflow-hidden flex flex-col justify-between max-h-[92vh] space-y-4">
        {/* Top Header: Badge, Step Indicator & Close */}
        <div className="flex items-center justify-between gap-2 border-b border-[var(--border-main)]/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-500/15">{current.icon}</div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">
              {current.badge}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[var(--text-secondary)] font-mono">
              {currentSlide + 1} / {slides.length}
            </span>
            <button
              onClick={handleClose}
              aria-label="मार्गदर्शक बंद करा (Close Guide)"
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[var(--text-secondary)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto space-y-4 pr-1">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-black text-[var(--text-primary)] font-devanagari leading-snug">
              {current.title}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-devanagari leading-relaxed">
              {current.subtitle}
            </p>
          </div>

          {/* 3 Highlight Cards for Current Slide */}
          <div className="space-y-2.5 pt-1">
            {current.highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl border border-[var(--border-main)] bg-stone-500/5 hover:bg-stone-500/10 transition-colors flex items-start gap-3"
              >
                <div className="text-xl shrink-0 mt-0.5">{item.emoji}</div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-[var(--text-primary)] font-devanagari">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] font-devanagari leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation & Progress Dots */}
        <div className="pt-3 border-t border-[var(--border-main)]/60 space-y-3">
          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentSlide
                    ? 'w-6 bg-saffron-600'
                    : 'w-1.5 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3">
            {currentSlide > 0 ? (
              <button
                onClick={() => setCurrentSlide(prev => prev - 1)}
                className="px-3.5 py-2 rounded-xl border border-[var(--border-main)] text-xs font-bold text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>मागे</span>
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                वगळा (Skip)
              </button>
            )}

            {!isLast ? (
              <button
                onClick={() => setCurrentSlide(prev => prev + 1)}
                className="px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-saffron-600/20 active:scale-95 transition-all ml-auto"
              >
                <span>पुढे (Next)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-saffron-600/25 active:scale-95 transition-all ml-auto"
              >
                <Sparkles className="w-4 h-4" />
                <span>भक्ती सुरू करा (Start Exploring)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
