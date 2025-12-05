import { GoogleGenAI, Chat } from "@google/genai";

let genAI: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

// Get API key from runtime environment (Docker) or build-time environment (dev)
const getApiKey = (): string | undefined => {
  // Check runtime environment (injected by Docker)
  if (typeof window !== 'undefined' && (window as any).ENV?.GEMINI_API_KEY) {
    return (window as any).ENV.GEMINI_API_KEY;
  }
  // Fallback to build-time environment (for local development)
  return process.env.API_KEY || process.env.GEMINI_API_KEY;
};

const initializeGenAI = () => {
  const apiKey = getApiKey();
  if (!genAI && apiKey) {
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

export const startChat = (context: string) => {
  const ai = initializeGenAI();
  if (!ai) throw new Error("API Key not found");

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: context + " Respond in Chinese (Simplified). Keep answers concise, encouraging, and formatted with Markdown.",
    },
  });
};

export const sendMessage = async (message: string): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "抱歉，我没有听清，请再说一遍。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "连接出现问题，请稍后再试。";
  }
};

export const generateSpecificAdvice = async (topic: string, userDetails: string): Promise<string> => {
    const ai = initializeGenAI();
    if (!ai) throw new Error("API Key not found");

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User needs advice on ${topic}. Details: ${userDetails}. Provide a bulleted list of 3-5 specific, actionable tips in Simplified Chinese.`,
        });
        return response.text || "无法生成建议。";
    } catch (e) {
        console.error(e);
        return "生成建议失败。";
    }
}
