import React, { useState } from 'react';
import { Tab } from './types';
import { SECTIONS, ICONS } from './constants';
import AICoach from './components/AICoach';
import VoiceVisualizer from './components/VoiceVisualizer';
import { Menu, X, ChevronRight, Star, ShoppingBag, Ruler, Activity, Dumbbell } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- Helper Components for Illustrations ---

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
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 200 200" className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full border border-pink-100 shadow-sm">
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


  const renderContent = () => {
    const section = SECTIONS[activeTab];

    if (activeTab === Tab.HOME) {
      return (
        <div className="space-y-8 animate-fade-in">
          <div className="text-center py-12 px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4 tracking-tight">Bloom</h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              探索自我，绽放美丽。<br/>
              专为想要探索女性化表达的你打造的入门指南。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
             {([Tab.MAKEUP, Tab.BODY, Tab.FASHION, Tab.VOICE, Tab.POSTURE] as Tab[]).map((tab) => {
               const Icon = ICONS[tab];
               return (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-pink-100 text-left"
                 >
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Icon size={100} className="text-pink-500" />
                   </div>
                   <div className="relative z-10 flex items-center gap-4">
                     <div className="p-3 bg-pink-100 rounded-full text-pink-600 group-hover:bg-pink-200 transition-colors">
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
      <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
        <header className="mb-8">
          <button 
            onClick={() => setActiveTab(Tab.HOME)}
            className="text-sm text-slate-500 hover:text-pink-600 mb-2 flex items-center gap-1"
          >
             ← 返回首页
          </button>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
             {React.createElement(ICONS[activeTab], { className: "text-pink-500" })}
             {section.title}
          </h2>
          <p className="text-slate-600 mt-2 text-lg">{section.description}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* --- VOICE VISUALIZER --- */}
            {activeTab === Tab.VOICE && (
              <>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
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
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100">
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
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
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
                       <div className="p-2 border border-slate-200 rounded bg-white">
                         <span className="font-bold block text-pink-500">圆脸</span>
                         长宽近似，线条圆润<br/>适合：可爱/纯欲风
                       </div>
                       <div className="p-2 border border-slate-200 rounded bg-white">
                         <span className="font-bold block text-pink-500">方脸</span>
                         下颌角明显，C ≈ A<br/>适合：御姐/欧美风
                       </div>
                       <div className="p-2 border border-slate-200 rounded bg-white">
                         <span className="font-bold block text-pink-500">长形脸</span>
                         脸长 > 脸宽<br/>适合：知性/清冷风
                       </div>
                       <div className="p-2 border border-slate-200 rounded bg-white">
                         <span className="font-bold block text-pink-500">菱形脸</span>
                         颧骨突出 (B最宽)<br/>适合：高级/模特感
                       </div>
                    </div>
                  </div>
                </div>

                {/* 2. Style Gallery */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
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
                      <li>• <span className="text-pink-600">御姐/甜酷</span>：强调上扬眼线、红唇、清晰的眉峰，修容强调骨骼。</li>
                      <li>• <span className="text-pink-600">纯欲/伪素颜</span>：弱化眼影颜色，强调水光感和睫毛，唇色偏淡。</li>
                    </ul>
                  </div>
                </div>

                {/* 3. Tools and Brands */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <ShoppingBag className="text-pink-500" size={20}/> 第三步：新手工具箱
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-pink-400 pl-4">
                      <h4 className="font-bold text-slate-700">必备工具</h4>
                      <p className="text-sm text-slate-500 mt-1">
                        美妆蛋（上底妆）、<strong>遮瑕刷</strong>（关键！处理胡青）、睫毛夹、眉刀。
                      </p>
                    </div>
                    <div className="border-l-4 border-purple-400 pl-4">
                      <h4 className="font-bold text-slate-700">新手友好品牌推荐</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold">眼妆</span>
                          <span>Kiss Me (眼线/睫毛膏), Canmake (眼影)</span>
                        </li>
                         <li className="flex items-center gap-2">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold">底妆</span>
                          <span>欧莱雅吸油棒, 毛戈平(遮瑕)</span>
                        </li>
                         <li className="flex items-center gap-2">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold">国货</span>
                          <span>花知晓 (Flower Knows) - 包装很美，适合满足少女心</span>
                        </li>
                         <li className="flex items-center gap-2">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold">唇妆</span>
                          <span>Into You (唇泥), Romand (镜面唇釉)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Existing Beard Shadow Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="bg-orange-100 text-orange-500 p-2 rounded-lg text-xl">🎨</span> 
                    重点攻克：隐形胡青
                  </h3>
                  {/* Keep visuals simplistic for space */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                     <div className="bg-orange-50 p-2 rounded">1. 橘色遮瑕中和</div>
                     <div className="bg-orange-50 p-2 rounded">2. 垂直按压拍开</div>
                     <div className="bg-orange-50 p-2 rounded">3. 覆盖粉底液</div>
                  </div>
                </div>
              </div>
            )}

            {/* --- BODY EXPANDED CONTENT --- */}
            {activeTab === Tab.BODY && (
              <div className="space-y-8">
                 {/* 1. Body Fat Visual */}
                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Activity className="text-teal-500" size={20}/> 了解身体成分
                    </h3>
                    <div className="relative pt-6 pb-2">
                       <div className="h-4 w-full bg-gradient-to-r from-blue-200 via-purple-200 to-pink-300 rounded-full"></div>
                       {/* Markers */}
                       <div className="absolute top-0 left-[15%] flex flex-col items-center">
                          <span className="text-xs font-bold text-blue-600">10-15%</span>
                          <div className="h-6 w-0.5 bg-blue-600 mb-1"></div>
                          <span className="text-xs text-slate-500">男士健美</span>
                       </div>
                       <div className="absolute top-0 left-[45%] flex flex-col items-center">
                          <span className="text-xs font-bold text-pink-600">18-24%</span>
                          <div className="h-6 w-0.5 bg-pink-600 mb-1"></div>
                          <span className="text-xs font-bold text-pink-600">女性化柔美区间</span>
                       </div>
                       <div className="absolute top-0 left-[70%] flex flex-col items-center">
                          <span className="text-xs font-bold text-slate-500">25%+</span>
                          <div className="h-6 w-0.5 bg-slate-400 mb-1"></div>
                          <span className="text-xs text-slate-500">微胖</span>
                       </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-600">
                      雌激素需要一定的脂肪作为载体。如果体脂过低（小于15%），肌肉线条会过于硬朗。建议保持在<strong>20%左右</strong>，让皮下脂肪柔化骨骼轮廓。
                    </p>
                 </div>

                 {/* 2. Exercise Gallery */}
                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <Dumbbell className="text-teal-500" size={20}/> 针对性训练示意
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <ExerciseVisual type="bridge" />
                          <h4 className="font-bold text-slate-700">臀桥 (Glute Bridge)</h4>
                          <p className="text-xs text-slate-500">核心动作。每日3组，每组15次。注意是用臀部发力顶起，而不是腰部。</p>
                       </div>
                       <div className="space-y-2">
                          <ExerciseVisual type="kick" />
                          <h4 className="font-bold text-slate-700">跪姿后抬腿 (Donkey Kick)</h4>
                          <p className="text-xs text-slate-500">改善臀部凹陷，提高臀线，让腿看起来更长。</p>
                       </div>
                       <div className="space-y-2 md:col-span-2">
                          <div className="flex gap-4 items-center">
                             <div className="w-1/2">
                               <ExerciseVisual type="vacuum" />
                             </div>
                             <div className="flex-1">
                                <h4 className="font-bold text-slate-700">真空腹 (Stomach Vacuum)</h4>
                                <p className="text-sm text-slate-500 mt-1">
                                  这不是练腹肌，而是练“天然束腰”（腹横肌）。<br/>
                                  <strong>做法：</strong>呼气排空肺部空气，用力将肚皮贴向后背，保持15秒。<br/>
                                  <span className="text-pink-500">避免做仰卧起坐或大重量负重侧弯，那会把腰练粗！</span>
                                </p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* --- FASHION EXPANDED CONTENT --- */}
            {activeTab === Tab.FASHION && (
              <div className="space-y-8">
                {/* 1. Style Matrix */}
                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <ShoppingBag className="text-teal-500" size={20}/> 风格定位与对比
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-teal-50 text-teal-800">
                          <tr>
                            <th className="p-3 rounded-tl-lg">风格</th>
                            <th className="p-3">核心元素 (Key Items)</th>
                            <th className="p-3">适合身材/特点</th>
                            <th className="p-3 rounded-tr-lg">区别</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-teal-50">
                          <tr>
                            <td className="p-3 font-bold text-pink-600">少女风</td>
                            <td className="p-3">百褶裙、JK制服、粉白色系、花边</td>
                            <td className="p-3">个子偏小，骨架不大，圆脸</td>
                            <td className="p-3">强调“幼态”和曲线，弱化肩宽</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-purple-600">御姐风</td>
                            <td className="p-3">西装外套、开叉长裙、尖头鞋、深色系</td>
                            <td className="p-3">个子高挑（175+），骨架大，方/长脸</td>
                            <td className="p-3">强调“气场”和利落线条，利用身高优势</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-blue-600">甜酷/Y2K</td>
                            <td className="p-3">工装裤、短上衣(Crop top)、厚底鞋、金属配饰</td>
                            <td className="p-3">H型身材（腰线不明显），喜欢个性</td>
                            <td className="p-3">中性混搭，模糊性别界限，非常适合过渡期</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                 </div>

                 {/* 2. Shoe Guide */}
                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <span className="text-xl">👠</span> 鞋履选择：大码脚的救星
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Loafers */}
                      <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                         <div className="h-24 w-full flex items-center justify-center bg-slate-50 rounded-lg mb-3">
                            <svg viewBox="0 0 100 60" className="w-20">
                               <path d="M10,40 Q10,20 40,20 L70,20 Q90,20 90,40 L90,50 L10,50 Z" fill="#334155"/>
                               <rect x="10" y="50" width="80" height="5" fill="#0f172a"/>
                               <rect x="10" y="50" width="20" height="8" fill="#0f172a"/> {/* Heel */}
                            </svg>
                         </div>
                         <h4 className="font-bold text-slate-700">厚底乐福鞋 (Loafers)</h4>
                         <p className="text-xs text-slate-500 mt-1">
                           JK风必备。圆头设计不显脚长，厚底能拉长小腿比例，且男码女款很好买。
                         </p>
                      </div>

                      {/* Boots */}
                      <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                         <div className="h-24 w-full flex items-center justify-center bg-slate-50 rounded-lg mb-3">
                            <svg viewBox="0 0 60 80" className="w-12">
                               <path d="M15,70 L15,20 Q15,10 30,10 Q45,10 45,20 L45,70" fill="#334155"/>
                               <rect x="15" y="70" width="30" height="5" fill="#0f172a"/>
                            </svg>
                         </div>
                         <h4 className="font-bold text-slate-700">骑士靴/长筒靴</h4>
                         <p className="text-xs text-slate-500 mt-1">
                           <span className="text-pink-500 font-bold">推荐！</span>完全遮盖小腿肌肉线条，修正腿型，御姐风神器。
                         </p>
                      </div>

                      {/* Block Heels */}
                      <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                         <div className="h-24 w-full flex items-center justify-center bg-slate-50 rounded-lg mb-3">
                            <svg viewBox="0 0 100 60" className="w-20">
                               <path d="M20,40 Q20,20 50,30 L80,30 Q90,30 90,50 L30,50 Z" fill="#fbcfe8"/>
                               <rect x="25" y="50" width="15" height="10" fill="#db2777"/> {/* Block heel */}
                            </svg>
                         </div>
                         <h4 className="font-bold text-slate-700">粗跟玛丽珍</h4>
                         <p className="text-xs text-slate-500 mt-1">
                           避免细高跟（对比显腿粗）。3-5cm粗跟最稳，系带设计（Mary Jane）在视觉上截断脚面。
                         </p>
                      </div>
                    </div>
                 </div>

                 {/* Existing Triangle Body Guide */}
                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">
                      穿搭核心：倒三角身形的平衡术
                    </h3>
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                      <div className="w-full md:w-1/3 bg-teal-50/50 rounded-xl p-4 flex justify-center">
                         <svg viewBox="0 0 200 240" className="w-40 h-48">
                            <polygon points="60,60 140,60 115,140 85,140" fill="#ccfbf1" stroke="#2dd4bf" strokeWidth="2" />
                            <text x="100" y="50" fontSize="10" fill="#0f766e" textAnchor="middle">宽肩窄胯</text>
                            <path d="M85,140 L115,140 L150,220 L50,220 Z" fill="#fce7f3" stroke="#db2777" strokeWidth="2" strokeDasharray="4,2" />
                            <text x="100" y="235" fontSize="10" fill="#db2777" textAnchor="middle">A字裙加宽</text>
                            <path d="M85,60 L100,100 L115,60" fill="none" stroke="#db2777" strokeWidth="3" />
                         </svg>
                      </div>
                      <div className="flex-1 space-y-4 text-sm">
                        <p className="text-slate-600">
                           <span className="font-bold text-teal-600">公式：</span> <br/>
                           V领/大方领上衣 (弱化肩宽) + A字裙/阔腿裤 (增加胯宽) = <strong>X型身材</strong>
                        </p>
                      </div>
                    </div>
                 </div>
              </div>
            )}

            {/* Core Tips Section (Always Visible) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
              <h3 className="text-xl font-semibold text-pink-800 mb-4 flex items-center gap-2">
                <Star size={20} className="fill-pink-200 text-pink-400" />
                本章核心要点
              </h3>
              <ul className="space-y-4">
                {section.coreTips.map((tip, index) => (
                  <li key={index} className="flex gap-3 items-start text-slate-700 leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm font-bold mt-0.5">
                      {index + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: AI Assistant */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <AICoach context={section.geminiPromptContext} topicTitle={section.title} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setActiveTab(Tab.HOME)}
            >
              <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">B</div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-500">
                Bloom
              </span>
            </div>

            <div className="hidden md:flex space-x-1">
              {Object.values(Tab).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab 
                      ? 'bg-pink-50 text-pink-600' 
                      : 'text-slate-600 hover:text-pink-500 hover:bg-pink-50/50'
                  }`}
                >
                  {SECTIONS[tab].title.split(" ")[0]} 
                </button>
              ))}
            </div>

            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-600 hover:text-pink-600 p-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-pink-100 animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
               {Object.values(Tab).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    activeTab === tab 
                      ? 'bg-pink-50 text-pink-600' 
                      : 'text-slate-600 hover:text-pink-500 hover:bg-pink-50'
                  }`}
                >
                  {SECTIONS[tab].title}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-pink-100 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Bloom. 愿你绽放独特的美。</p>
          <p className="mt-2 text-xs text-slate-400">
            Powered by Gemini API & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;