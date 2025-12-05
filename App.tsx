import React, { useState } from 'react';
import { Tab } from './types';
import { SECTIONS, ICONS } from './constants';
import AICoach from './components/AICoach';
import VoiceVisualizer from './components/VoiceVisualizer';
import BackgroundEffects from './components/BackgroundEffects';
import ApiKeySettings from './components/ApiKeySettings';
import { setApiKey } from './services/geminiService';
import { Menu, X, ChevronRight, Star, ShoppingBag, Ruler, Activity, Dumbbell, Sparkles, Video, PlayCircle, ExternalLink, Shirt, Footprints } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userApiKey, setUserApiKey] = useState<string>('');

  const handleApiKeyChange = (apiKey: string) => {
    setUserApiKey(apiKey);
    setApiKey(apiKey);
  };

  // --- Helper Components for Illustrations ---

  // Makeup Tool SVG
  const MakeupToolIcon: React.FC<{ type: 'blender' | 'brush' | 'curler' | 'razor' }> = ({ type }) => {
    switch (type) {
      case 'blender':
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto drop-shadow-sm">
            <path d="M50,15 Q75,45 75,68 Q75,90 50,90 Q25,90 25,68 Q25,45 50,15" fill="#fda4af" />
            <path d="M50,15 Q65,40 65,60" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
            <circle cx="55" cy="35" r="3" fill="white" opacity="0.6" />
          </svg>
        );
      case 'brush':
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto drop-shadow-sm">
             <g transform="rotate(45, 50, 50)">
              <rect x="46" y="45" width="8" height="50" rx="1" fill="#44403c" /> {/* Handle */}
              <rect x="45" y="30" width="10" height="15" fill="#e7e5e4" /> {/* Ferrule */}
              <path d="M45,30 L55,30 L58,10 Q50,5 42,10 Z" fill="#f59e0b" /> {/* Bristles */}
              <line x1="50" y1="10" x2="50" y2="25" stroke="#b45309" strokeWidth="0.5" opacity="0.5" />
             </g>
          </svg>
        );
      case 'curler':
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto drop-shadow-sm">
            <path d="M30,85 L45,55 M70,85 L55,55" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            <circle cx="30" cy="85" r="6" stroke="#94a3b8" strokeWidth="3" fill="none"/>
            <circle cx="70" cy="85" r="6" stroke="#94a3b8" strokeWidth="3" fill="none"/>
            <path d="M25,25 Q50,10 75,25" stroke="#cbd5e1" strokeWidth="4" fill="none" />
            <path d="M25,30 Q50,15 75,30" stroke="#475569" strokeWidth="2" fill="none" />
            <line x1="50" y1="30" x2="50" y2="55" stroke="#94a3b8" strokeWidth="2" />
          </svg>
        );
      case 'razor':
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto drop-shadow-sm">
            <g transform="rotate(-30, 50, 50)">
               <path d="M40,90 L60,90 L60,35 L40,35 Z" fill="#fbcfe8" />
               <path d="M42,35 L50,10 L58,35 Z" fill="#e2e8f0" stroke="#cbd5e1" />
               <line x1="50" y1="15" x2="50" y2="30" stroke="#cbd5e1" strokeWidth="1" />
            </g>
          </svg>
        );
    }
  };

  // Makeup Style Face SVG
  const MakeupFace: React.FC<{ 
    type: 'loli' | 'maiden' | 'sister' | 'pure' | 'nomakeup' | 'cool', 
    label: string 
  }> = ({ type, label }) => {
    // Config for different styles
    const config = {
      loli: { brow: "M70,85 Q100,80 130,85", eye: "M70,100 Q100,90 130,100", blush: "#fca5a5", lip: "#f43f5e", blushPos: {cx:60, cy:130}, eyeShape: "round" },
      maiden: { brow: "M65,85 Q100,82 135,85", eye: "M65,100 Q100,95 135,100", blush: "#fdba74", lip: "#fb7185", blushPos: {cx:70, cy:125}, eyeShape: "almond" },
      sister: { brow: "M65,90 L90,80 L135,85", eye: "M65,105 Q100,90 140,95", blush: "#bea6a0", lip: "#be123c", blushPos: {cx:150, cy:125}, eyeShape: "sharp" }, // Upward brow
      pure: { brow: "M70,85 Q100,85 130,85", eye: "M70,105 Q100,105 130,105", blush: "#fbcfe8", lip: "#fda4af", blushPos: {cx:100, cy:125}, eyeShape: "droopy" }, // Centered blush, watery
      nomakeup: { brow: "M70,85 Q100,84 130,85", eye: "M70,100 Q100,98 130,100", blush: "transparent", lip: "#fecdd3", blushPos: {cx:100, cy:125}, eyeShape: "natural" },
      cool: { brow: "M65,88 L90,82 L135,82", eye: "M65,100 L140,95", blush: "#a8a29e", lip: "#881337", blushPos: {cx:150, cy:120}, eyeShape: "cat" },
    }[type];

    return (
      <div className="flex flex-col items-center gap-2 transform hover:-translate-y-1 transition-transform duration-300">
        <svg viewBox="0 0 200 200" className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full border border-pink-100 shadow-md">
           {/* Face Outline */}
           <path d="M50,80 Q100,220 150,80 Q150,30 100,30 Q50,30 50,80" fill="#fff1f2" stroke="#fecdd3" strokeWidth="2" />
           
           {/* Brows */}
           <path d={config.brow} fill="none" stroke="#57534e" strokeWidth="3" strokeLinecap="round" />
           
           {/* Eyes */}
           <path d={config.eye} fill="none" stroke="#1c1917" strokeWidth="2.5" />
           {type === 'cool' && <path d="M135,96 L150,90" stroke="#1c1917" strokeWidth="2" />} {/* Eyeliner wing */}
           {type === 'loli' && <circle cx="100" cy="100" r="3" fill="#1c1917" opacity="0.1" />} // Big pupil hint

           {/* Blush */}
           {type !== 'sister' && type !== 'cool' ? (
              <>
                 <circle cx={config.blushPos.cx} cy={config.blushPos.cy} r="12" fill={config.blush} opacity="0.4" filter="url(#blur)" />
                 <circle cx={200 - config.blushPos.cx} cy={config.blushPos.cy} r="12" fill={config.blush} opacity="0.4" filter="url(#blur)" />
              </>
           ) : (
              // Contour style blush for mature looks
              <>
                 <path d="M140,120 L160,110" stroke={config.blush} strokeWidth="8" opacity="0.3" filter="url(#blur)" />
                 <path d="M60,120 L40,110" stroke={config.blush} strokeWidth="8" opacity="0.3" filter="url(#blur)" />
              </>
           )}

           {/* Lips */}
           <path d="M90,150 Q100,160 110,150" fill="none" stroke={config.lip} strokeWidth="4" strokeLinecap="round" />
           {type === 'pure' && <circle cx="100" cy="150" r="2" fill="white" opacity="0.8" />} // Gloss highlight

           <defs>
             <filter id="blur">
               <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
             </filter>
           </defs>
        </svg>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
    )
  }

  // Body Exercise SVG
  const ExerciseVisual: React.FC<{ type: 'bridge' | 'vacuum' | 'kick' }> = ({ type }) => {
    return (
      <svg viewBox="0 0 200 120" className="w-full h-32 bg-pink-50/30 rounded-lg">
         {type === 'bridge' && (
           <>
             {/* Floor */}
             <line x1="20" y1="100" x2="180" y2="100" stroke="#cbd5e1" strokeWidth="2" />
             {/* Body Up */}
             <path d="M40,100 L70,80 L120,50 L160,80 L160,100" fill="none" stroke="#db2777" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <animate attributeName="d" values="M40,100 L70,90 L120,90 L160,90 L160,100; M40,100 L70,80 L120,50 L160,80 L160,100; M40,100 L70,90 L120,90 L160,90 L160,100" dur="3s" repeatCount="indefinite" />
             </path>
             <circle cx="160" cy="70" r="5" fill="#fbcfe8" />
             <text x="100" y="30" fontSize="10" fill="#db2777" textAnchor="middle">臀桥：针对臀大肌</text>
           </>
         )}
         {type === 'kick' && (
           <>
             {/* Floor */}
             <line x1="20" y1="100" x2="180" y2="100" stroke="#cbd5e1" strokeWidth="2" />
             {/* Kneeling Body */}
             <path d="M50,80 L50,100 M50,80 L100,80 L100,100" fill="none" stroke="#db2777" strokeWidth="4" strokeLinecap="round" />
             {/* Leg Lift Animation */}
             <path d="M50,80 L20,60" fill="none" stroke="#db2777" strokeWidth="4" strokeLinecap="round">
               <animate attributeName="d" values="M50,80 L40,100; M50,80 L20,60; M50,80 L40,100" dur="2s" repeatCount="indefinite" />
             </path>
             <text x="100" y="30" fontSize="10" fill="#db2777" textAnchor="middle">后抬腿：提臀线</text>
           </>
         )}
         {type === 'vacuum' && (
           <>
             {/* Standing Torso */}
             <path d="M80,40 Q70,70 80,100 L120,100 Q130,70 120,40" fill="#fce7f3" stroke="#db2777" strokeWidth="2" />
             {/* Stomach In Animation */}
             <path d="M80,70 Q100,70 120,70" stroke="#db2777" strokeWidth="1" fill="none">
               <animate attributeName="d" values="M80,70 Q100,70 120,70; M80,70 Q100,50 120,70; M80,70 Q100,70 120,70" dur="4s" repeatCount="indefinite" />
             </path>
             <text x="100" y="25" fontSize="10" fill="#db2777" textAnchor="middle">真空腹：收细腰围</text>
           </>
         )}
      </svg>
    )
  }

  // Fashion Visuals
  const FashionVisual: React.FC<{ type: 'shape' | 'shoe' }> = ({ type }) => {
    return (
       <svg viewBox="0 0 200 120" className="w-full h-32 bg-pink-50/30 rounded-lg">
        {type === 'shape' && (
          <>
             <g transform="translate(30,10)">
                <text x="30" y="15" fontSize="10" fill="#94a3b8" textAnchor="middle">倒三角 (避雷)</text>
                <path d="M10,30 L50,30 L30,80 Z" fill="#cbd5e1" opacity="0.5" />
                <path d="M5,35 L55,35" stroke="#ef4444" strokeWidth="2" /> 
                <text x="30" y="95" fontSize="10" fill="#ef4444" textAnchor="middle">肩宽显壮</text>
             </g>
             <g transform="translate(110,10)">
                <text x="30" y="15" fontSize="10" fill="#db2777" textAnchor="middle">X型 (推荐)</text>
                <path d="M10,30 L50,30 L30,80 Z" fill="#fbcfe8" />
                <path d="M5,80 L55,80 L30,30 Z" fill="#fbcfe8" opacity="0.8" />
                <path d="M10,80 L50,80" stroke="#db2777" strokeWidth="2" />
                <text x="30" y="95" fontSize="10" fill="#db2777" textAnchor="middle">A字裙平衡</text>
             </g>
          </>
        )}
        {type === 'shoe' && (
          <>
            <g transform="translate(40,40)">
               <path d="M0,20 Q10,0 40,20 Q40,40 0,20" fill="#cbd5e1" />
               <path d="M40,20 L60,20" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2"/>
               <text x="25" y="45" fontSize="10" fill="#64748b" textAnchor="middle">尖头显脚长</text>
            </g>
            <g transform="translate(110,40)">
               <path d="M0,20 Q5,5 30,20 Q30,40 0,20" fill="#fbcfe8" />
               <rect x="15" y="10" width="5" height="15" fill="#db2777" />
               <text x="20" y="45" fontSize="10" fill="#db2777" textAnchor="middle">圆头/带饰</text>
            </g>
          </>
        )}
       </svg>
    )
  }

  // Video Tutorial Card Component
  const VideoTutorialCard = ({ title, duration, color, url }: { title: string, duration: string, color: string, url: string }) => (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 block"
    >
      {/* Thumbnail Placeholder */}
      <div className={`h-32 sm:h-40 w-full ${color} flex items-center justify-center relative`}>
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
        <PlayCircle className="text-white drop-shadow-lg opacity-90 group-hover:scale-110 transition-all" size={48} />
        <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">{duration}</span>
        <ExternalLink size={16} className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-90 transition-opacity" />
      </div>
      {/* Info */}
      <div className="bg-white p-3 border border-t-0 border-pink-100 rounded-b-xl">
        <h4 className="font-bold text-slate-700 text-sm group-hover:text-pink-600 transition-colors line-clamp-1">{title}</h4>
        <div className="flex items-center gap-1 mt-1">
            <Video size={12} className="text-pink-400"/>
            <span className="text-xs text-slate-500">Bilibili 视频</span>
        </div>
      </div>
    </a>
  );


  const renderContent = () => {
    const section = SECTIONS[activeTab];

    if (activeTab === Tab.HOME) {
      return (
        <div className="space-y-8 animate-fade-in relative z-10">
          <div className="text-center py-12 px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4 tracking-tight drop-shadow-sm">Bloom</h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              探索自我，绽放美丽。<br/>
              专为想要探索女性化表达的你打造的入门指南。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
             {([Tab.MAKEUP, Tab.BODY, Tab.FASHION, Tab.VOICE, Tab.POSTURE] as Tab[]).map((tab, index) => {
               const Icon = ICONS[tab];
               return (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="group relative overflow-hidden bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-pink-100 text-left animate-slide-up"
                 >
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Icon size={100} className="text-pink-500" />
                   </div>
                   <div className="relative z-10 flex items-center gap-4">
                     <div className="p-3 bg-pink-100 rounded-full text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                        <Icon size={24} />
                     </div>
                     <div>
                       <h3 className="text-xl font-semibold text-slate-800">{SECTIONS[tab].title}</h3>
                       <p className="text-sm text-slate-500 mt-1">{SECTIONS[tab].description}</p>
                     </div>
                   </div>
                   <div className="mt-4 flex items-center text-pink-500 font-medium text-sm group-hover:translate-x-1 transition-transform">
                      开始学习 <ChevronRight size={16} />
                   </div>
                 </button>
               )
             })}
          </div>
        </div>
      );
    }

    // Generic layout for other tabs
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in relative z-10">
        <header className="mb-8">
          <button 
            onClick={() => setActiveTab(Tab.HOME)}
            className="text-sm text-slate-500 hover:text-pink-600 mb-2 flex items-center gap-1 transition-colors"
          >
             ← 返回首页
          </button>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-pink-100 rounded-xl text-pink-500">
               {React.createElement(ICONS[activeTab], { size: 28 })}
             </div>
             <div>
                <h2 className="text-3xl font-bold text-slate-800">
                   {section.title}
                </h2>
                <p className="text-slate-600 mt-1 text-lg">{section.description}</p>
             </div>
          </div>
        </header>

        {/* API Key Settings */}
        <div className="mb-6">
          <ApiKeySettings onApiKeyChange={handleApiKeyChange} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* --- VOICE VISUALIZER --- */}
            {activeTab === Tab.VOICE && (
              <>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-500 p-2 rounded-lg text-xl">🎵</span>
                    共鸣位置原理解析
                  </h3>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-full md:w-1/2 bg-purple-50/50 rounded-xl p-4 flex justify-center">
                       <svg viewBox="0 0 200 220" className="w-48 h-52">
                         <path d="M70,200 Q60,150 60,120 Q60,50 100,20 Q140,50 140,120 Q140,160 150,200" fill="none" stroke="#94a3b8" strokeWidth="2" />
                         <path d="M60,120 Q40,120 40,140" fill="none" stroke="#94a3b8" strokeWidth="2" /> 
                         <circle cx="100" cy="180" r="15" fill="#bae6fd" opacity="0.6">
                           <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite" />
                         </circle>
                         <text x="130" y="185" fontSize="10" fill="#0ea5e9" fontWeight="bold">胸腔共鸣 (男声)</text>
                         <circle cx="90" cy="80" r="15" fill="#fbcfe8" opacity="0.8">
                           <animate attributeName="r" values="15;20;15" dur="1.5s" repeatCount="indefinite" />
                         </circle>
                         <text x="120" y="85" fontSize="10" fill="#db2777" fontWeight="bold">口腔/鼻腔共鸣 (女声)</text>
                         <path d="M100,160 L100,110" stroke="#db2777" strokeWidth="2" markerEnd="url(#arrow-pink)" strokeDasharray="4,2" />
                         <defs>
                           <marker id="arrow-pink" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                             <path d="M0,0 L0,6 L6,3 z" fill="#db2777" />
                           </marker>
                         </defs>
                       </svg>
                    </div>
                    <div className="flex-1 space-y-3">
                      <p className="text-sm text-slate-600">
                        <strong className="text-purple-600">核心原理：</strong> 男声浑厚是因为声音在胸腔震动；女声明亮是因为声音位置上移至口腔和鼻腔前部。
                      </p>
                    </div>
                  </div>
                </div>
                <VoiceVisualizer />
              </>
            )}

            {/* --- POSTURE VISUALIZER --- */}
            {activeTab === Tab.POSTURE && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100 hover:shadow-md transition-shadow">
                 <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-500 p-2 rounded-lg text-xl">🚶‍♀️</span>
                    步态示意图：一字步
                  </h3>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-full md:w-1/2 bg-indigo-50/50 rounded-xl p-6 flex justify-center">
                       <svg viewBox="0 0 200 150" className="w-full max-w-sm">
                          <g transform="translate(20, 0)">
                            <text x="30" y="20" fontSize="12" fill="#64748b" textAnchor="middle">男士步态</text>
                            <line x1="15" y1="30" x2="15" y2="140" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,4" />
                            <line x1="45" y1="30" x2="45" y2="140" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,4" />
                            <rect x="5" y="40" width="20" height="35" rx="8" fill="#cbd5e1" />
                            <rect x="35" y="80" width="20" height="35" rx="8" fill="#cbd5e1" />
                            <text x="30" y="140" fontSize="10" fill="#94a3b8" textAnchor="middle">双轨平行</text>
                          </g>
                          <g transform="translate(120, 0)">
                            <text x="30" y="20" fontSize="12" fill="#db2777" textAnchor="middle" fontWeight="bold">女士步态</text>
                            <line x1="30" y1="30" x2="30" y2="140" stroke="#fbcfe8" strokeWidth="2" />
                            <g transform="rotate(-5, 30, 60)">
                               <rect x="20" y="40" width="20" height="35" rx="8" fill="#f472b6" />
                            </g>
                            <g transform="rotate(5, 30, 100)">
                               <rect x="20" y="80" width="20" height="35" rx="8" fill="#f472b6" />
                            </g>
                            <text x="30" y="140" fontSize="10" fill="#db2777" textAnchor="middle">单线行走</text>
                          </g>
                       </svg>
                    </div>
                    <div className="flex-1 space-y-3">
                       <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
                        <li><strong>落脚点：</strong> 双脚内侧应该落在直线上。</li>
                        <li><strong>重心：</strong> 移动时，重心完全转换到支撑腿。</li>
                      </ul>
                    </div>
                  </div>
              </div>
            )}

            {/* --- MAKEUP EXPANDED CONTENT --- */}
            {activeTab === Tab.MAKEUP && (
              <div className="space-y-8">
                {/* 1. Face Shape & Analysis */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Ruler className="text-pink-500" size={20}/> 第一步：认识你的脸型
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-4 rounded-xl text-sm space-y-2">
                      <p className="font-bold text-slate-700">如何自测？</p>
                      <p className="text-slate-600">将头发全部梳起，正对镜子，观察以下三处宽度：</p>
                      <ul className="list-disc list-inside text-slate-500 ml-2">
                        <li>A. 额头最宽处</li>
                        <li>B. 颧骨最宽处</li>
                        <li>C. 下颌角最宽处</li>
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-center">
                       <div className="p-2 border border-slate-200 rounded bg-white hover:bg-pink-50 transition-colors">
                         <span className="font-bold block text-pink-500">圆脸</span>
                         长宽近似，线条圆润<br/>适合：可爱/纯欲风
                       </div>
                       <div className="p-2 border border-slate-200 rounded bg-white hover:bg-pink-50 transition-colors">
                         <span className="font-bold block text-pink-500">方脸</span>
                         下颌角明显，C ≈ A<br/>适合：御姐/欧美风
                       </div>
                       <div className="p-2 border border-slate-200 rounded bg-white hover:bg-pink-50 transition-colors">
                         <span className="font-bold block text-pink-500">长形脸</span>
                         脸长 &gt; 脸宽<br/>适合：知性/清冷风
                       </div>
                       <div className="p-2 border border-slate-200 rounded bg-white hover:bg-pink-50 transition-colors">
                         <span className="font-bold block text-pink-500">菱形脸</span>
                         颧骨突出 (B最宽)<br/>适合：高级/模特感
                       </div>
                    </div>
                  </div>
                </div>

                {/* 2. Style Gallery */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Star className="text-pink-500" size={20}/> 第二步：选择你的风格
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
                     <MakeupFace type="loli" label="萝莉风 (Loli)" />
                     <MakeupFace type="maiden" label="少女风 (Maiden)" />
                     <MakeupFace type="pure" label="纯欲风 (Pure Lust)" />
                     <MakeupFace type="nomakeup" label="伪素颜 (Natural)" />
                     <MakeupFace type="sister" label="御姐风 (Sister)" />
                     <MakeupFace type="cool" label="甜酷/Y2K (Cool)" />
                  </div>
                  <div className="mt-6 p-4 bg-pink-50 rounded-xl text-sm text-slate-600">
                    <p><strong>风格差异速记：</strong></p>
                    <ul className="mt-2 space-y-1">
                      <li>• <span className="text-pink-600">萝莉/少女</span>：强调圆眼、卧蚕、短中庭，腮红打在眼下。</li>
                      <li>• <span className="text-pink-600">御姐/甜酷</span>：强调眼线、骨骼感修容，腮红打在颧骨斜向上。</li>
                    </ul>
                  </div>
                </div>

                {/* 3. Essential Tools */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 hover:shadow-md transition-shadow">
                   <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <ShoppingBag className="text-pink-500" size={20}/> 第三步：新手必备工具箱
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="text-center p-4 border border-slate-100 rounded-xl hover:border-pink-200 transition-colors">
                        <MakeupToolIcon type="blender" />
                        <p className="mt-2 font-medium text-slate-700">美妆蛋</p>
                        <p className="text-xs text-slate-500">湿用拍打底妆更服帖</p>
                     </div>
                     <div className="text-center p-4 border border-slate-100 rounded-xl hover:border-pink-200 transition-colors">
                        <MakeupToolIcon type="brush" />
                        <p className="mt-2 font-medium text-slate-700">遮瑕刷</p>
                        <p className="text-xs text-slate-500">扁头刷精准遮胡青</p>
                     </div>
                      <div className="text-center p-4 border border-slate-100 rounded-xl hover:border-pink-200 transition-colors">
                        <MakeupToolIcon type="curler" />
                        <p className="mt-2 font-medium text-slate-700">睫毛夹</p>
                        <p className="text-xs text-slate-500">放大双眼的关键</p>
                     </div>
                      <div className="text-center p-4 border border-slate-100 rounded-xl hover:border-pink-200 transition-colors">
                        <MakeupToolIcon type="razor" />
                        <p className="mt-2 font-medium text-slate-700">修眉刀</p>
                        <p className="text-xs text-slate-500">定期修整杂毛</p>
                     </div>
                  </div>
                </div>

                 {/* 4. Video Tutorials */}
                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 hover:shadow-md transition-shadow">
                   <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Video className="text-pink-500" size={20}/> 实战视频教程
                  </h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <VideoTutorialCard 
                        title="超全整容级修容教程 (程十安)" 
                        duration="10:24" 
                        color="bg-amber-100" 
                        url="https://www.bilibili.com/video/BV1dJ411S7eL/?share_source=copy_web"
                      />
                      <VideoTutorialCard 
                        title="分分钟学会超自然眼线 (程十安)" 
                        duration="08:15" 
                        color="bg-rose-100" 
                        url="https://www.bilibili.com/video/BV1NmEYzNE2q/?share_source=copy_web&vd_source=fb3a64df37df50bd46036c2b4e67d54e"
                      />
                      <VideoTutorialCard 
                        title="男生画女妆！新手进阶教程" 
                        duration="15:30" 
                        color="bg-pink-100" 
                        url="https://www.bilibili.com/video/BV1tR41z4EnZ/?share_source=copy_web&vd_source=fb3a64df37df50bd46036c2b4e67d54e"
                      />
                   </div>
                 </div>
              </div>
            )}

            {/* --- BODY CONTENT --- */}
            {activeTab === Tab.BODY && (
               <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-pink-100">
                         <ExerciseVisual type="bridge" />
                         <p className="mt-2 text-sm text-slate-600">臀桥是针对臀大肌最孤立的动作，不仅能改善臀型，还不会过度刺激大腿前侧（避免腿粗）。建议每天 4组 x 15次。</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-pink-100">
                         <ExerciseVisual type="kick" />
                         <p className="mt-2 text-sm text-slate-600">跪姿后抬腿能有效提高臀线，让腿部视觉看起来更长。注意腰部不要塌陷，核心收紧。建议左右各 4组 x 12次。</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-pink-100">
                         <ExerciseVisual type="vacuum" />
                         <p className="mt-2 text-sm text-slate-600">真空腹练习深层腹横肌，是缩减腰围的秘密武器。每天早晨空腹进行，吐气收腹保持15-30秒，重复5次。</p>
                      </div>
                  </div>
               </div>
            )}

            {/* --- FASHION CONTENT --- */}
            {activeTab === Tab.FASHION && (
               <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-xl border border-pink-100">
                         <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Shirt className="text-pink-500" size={18}/> 倒三角体型调整
                         </h3>
                         <FashionVisual type="shape" />
                         <p className="mt-3 text-sm text-slate-600">
                            <strong>原理：</strong> 很多 MtF 姐妹是倒三角身材（肩宽胯窄）。穿搭重点是“弱化肩部，加宽胯部”。
                            <br/><br/>
                            ❌ <strong>避免：</strong> 泡泡袖、垫肩、一字肩（会显得更壮）。<br/>
                            ✅ <strong>推荐：</strong> 大V领、插肩袖上衣 + A字裙、百褶裙（增加下半身量感，打造X型曲线）。
                         </p>
                      </div>
                      <div className="bg-white p-6 rounded-xl border border-pink-100">
                         <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Footprints className="text-pink-500" size={18}/> 大码鞋履选择法则
                         </h3>
                         <FashionVisual type="shoe" />
                         <p className="mt-3 text-sm text-slate-600">
                            <strong>痛点：</strong> 脚码通常在 40-44 之间，难买且显大。
                            <br/><br/>
                            ❌ <strong>避免：</strong> 尖头细跟鞋（视觉延长脚面，更显大）。<br/>
                            ✅ <strong>推荐：</strong> 圆头/方头玛丽珍鞋（系带会截断脚面视觉）、切尔西靴、马丁靴。颜色首选深色或裸色。
                         </p>
                      </div>
                  </div>
               </div>
            )}
            
            {/* Generic Core Tips for all non-home tabs */}
             <div className="bg-pink-50/50 rounded-2xl p-6 border border-pink-100">
                <h3 className="text-lg font-bold text-pink-800 mb-4 flex items-center gap-2">
                   <Activity className="text-pink-500" size={20}/> 核心要点
                </h3>
                <ul className="space-y-3">
                   {section.coreTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700">
                         <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0" />
                         <span>{tip}</span>
                      </li>
                   ))}
                </ul>
             </div>

          </div>

          {/* Right Column: AI Coach */}
          <div className="lg:col-span-1">
             <div className="sticky top-8">
                <AICoach context={section.geminiPromptContext} topicTitle={section.title} />
             </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-pink-50 font-sans text-slate-800 relative overflow-x-hidden">
        <BackgroundEffects />
        
        {/* Mobile Nav Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md p-4 flex justify-between items-center z-50 border-b border-pink-100 shadow-sm">
           <span className="font-bold text-xl text-pink-600 tracking-tight">Bloom</span>
           <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 hover:bg-pink-50 rounded-lg">
             {mobileMenuOpen ? <X /> : <Menu />}
           </button>
        </div>

        {/* Sidebar Navigation (Desktop) & Mobile Drawer */}
        <nav className={`fixed inset-y-0 left-0 w-64 bg-white/90 backdrop-blur-md border-r border-pink-100 transform transition-transform duration-300 z-40 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
           <div className="p-8 hidden lg:block">
              <h1 className="text-3xl font-bold text-pink-600 tracking-tight">Bloom</h1>
              <p className="text-xs text-pink-400 mt-1 uppercase tracking-widest">Transform & Bloom</p>
           </div>
           
           <div className="px-4 py-20 lg:py-4 space-y-1">
              {(Object.keys(SECTIONS) as Tab[]).map((tab) => {
                 const Icon = ICONS[tab];
                 const isActive = activeTab === tab;
                 return (
                    <button
                      key={tab}
                      onClick={() => {
                         setActiveTab(tab);
                         setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                         isActive 
                         ? 'bg-pink-500 text-white shadow-md shadow-pink-200' 
                         : 'text-slate-600 hover:bg-pink-50 hover:text-pink-600'
                      }`}
                    >
                       <Icon size={20} className={isActive ? 'text-pink-100' : 'text-slate-400'} />
                       <span className="font-medium">{SECTIONS[tab].title}</span>
                       {isActive && <ChevronRight size={16} className="ml-auto opacity-50" />}
                    </button>
                 )
              })}
           </div>

           <div className="absolute bottom-8 left-0 right-0 px-8 text-center">
              <p className="text-xs text-slate-400">Powered by Gemini 2.5</p>
           </div>
        </nav>

        {/* Main Content Area */}
        <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0">
           {renderContent()}
        </main>
    </div>
  );
};

export default App;