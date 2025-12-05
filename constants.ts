import { SectionContent, Tab } from './types';
import { Palette, Dumbbell, Mic, PersonStanding, Sparkles, Shirt } from 'lucide-react';

export const SECTIONS: Record<Tab, SectionContent> = {
  [Tab.HOME]: {
    title: "欢迎来到 Bloom",
    description: "你的个人女性化蜕变指南",
    coreTips: [],
    geminiPromptContext: "You are a helpful assistant for a male-to-female (MtF) or 'femboy' transformation app called Bloom. Be supportive, encouraging, and kind."
  },
  [Tab.MAKEUP]: {
    title: "妆容进阶",
    description: "从脸型分析到风格定型，打造专属你的美。",
    coreTips: [
      "脸型自测：撩起刘海，观察额头、颧骨、下颌的宽度比例。圆脸重修容，方脸重柔化。",
      "风格定位：五官立体选御姐/甜酷，五官柔和选少女/纯欲。日常伪街建议从伪素颜开始。",
      "工具投资：新手不要买大盘眼影，单色/四色最稳。必须投资一把好用的遮瑕刷处理胡青。",
      "底妆色号：宁可自然也不要假白，假白会放大男性骨骼感。"
    ],
    geminiPromptContext: "You are a professional makeup artist specializing in MtF transformations. Help the user identify their face shape (Square, Round, Oval, Heart) and suggest specific makeup techniques (contouring jawline, enlarging eyes) and products suitable for beginners."
  },
  [Tab.BODY]: {
    title: "身材精修",
    description: "科学控制体脂与针对性训练，重塑S型曲线。",
    coreTips: [
      "体脂率关键：女性化建议体脂维持在18%-24%，过低显男相，过高显壮硕。",
      "动作误区：深蹲容易粗大腿（练股四头肌），想练臀多做臀桥、跪姿后抬腿。",
      "腰腹核心：不要练腹肌撕裂者（会粗腰），多做真空腹和平板支撑练深层核心。",
      "日常体态：收肋骨，沉肩，时刻保持核心微收，这是显瘦的关键。"
    ],
    geminiPromptContext: "You are a fitness coach for MtF individuals. Focus on 'Glute Hypertrophy' (growing hips) and 'Waist Narrowing'. Advise against heavy upper body lifting. Explain body fat percentages for feminine softness."
  },
  [Tab.FASHION]: {
    title: "风格与穿搭",
    description: "寻找适合你的穿衣风格，用服饰语言表达自我。",
    coreTips: [
      "风格统一：发型、妆容、服装要成套。黑长直配JK是少女风，大波浪配西装是御姐风。",
      "鞋履心机：脚大（40+）选圆头玛丽珍或切尔西靴；小腿粗选膝下骑士靴。",
      "扬长避短：肩宽穿大V领、插肩袖；没胯穿A字伞裙、百褶裙；腰粗穿H型连衣裙。",
      "配饰加分：耳饰、项链能有效转移视觉重心，弱化喉结和下颌角。"
    ],
    geminiPromptContext: "You are a fashion stylist for MtF individuals. Help users choose between styles (Maiden, Royal Sister, Y2K/Cool, OL). Provide specific advice on shoe selection for larger feet and outfit coordination."
  },
  [Tab.VOICE]: {
    title: "伪声练习",
    description: "掌握声带闭合与共鸣位置，寻找本音。",
    coreTips: [
      "提升喉头：尝试吞咽动作，感受喉结上提并保持住（Whisper Siren练习）。",
      "共鸣转移：从胸腔共鸣转移到口腔/鼻腔共鸣（Head Voice）。",
      "气息控制：女性说话气息更柔和，避免短促的爆发音。",
      "声带闭合：减少漏气声，让声音听起来更明亮（Twang练习）。"
    ],
    geminiPromptContext: "You are a voice therapist specializing in feminization (MtF voice training). Explain concepts like resonance, pitch, and vocal weight simply. Provide safe exercises to avoid vocal strain."
  },
  [Tab.POSTURE]: {
    title: "仪态与举止",
    description: "从行走进坐，展现女性的优雅气场。",
    coreTips: [
      "站姿：重心放在一条腿上，呈现S型曲线，双肩下沉后张。",
      "走姿：走一字步，膝盖内扣，摆臂幅度小且靠近身体。",
      "手部动作：手指自然并在，避免握拳，拿东西时手指轻柔。",
      "坐姿：双膝并拢或斜放，避免‘大爷坐’（双腿岔开）。"
    ],
    geminiPromptContext: "You are an elegance coach. Explain how body language, gait, and posture differ between masculine and feminine presentations. Give practical tips for daily movements."
  }
};

export const ICONS = {
  [Tab.MAKEUP]: Palette,
  [Tab.BODY]: Dumbbell,
  [Tab.FASHION]: Shirt,
  [Tab.VOICE]: Mic,
  [Tab.POSTURE]: PersonStanding,
  [Tab.HOME]: Sparkles,
};