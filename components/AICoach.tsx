import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { startChat, sendMessage, hasApiKey } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AICoachProps {
  context: string;
  topicTitle: string;
  apiKey?: string;
}

const AICoach: React.FC<AICoachProps> = ({ context, topicTitle, apiKey }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatInitialized, setChatInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset chat when topic or API key changes
    setMessages([{
      id: 'init',
      role: 'model',
      text: `我是你的AI专属教练。关于${topicTitle}，你有什么具体想问的吗？`
    }]);
    
    setChatInitialized(false);
    
    // Check if API key is available using the service function
    const keyAvailable = hasApiKey();
    console.log('AICoach: API key available?', keyAvailable);
    
    if (!keyAvailable) {
      setMessages(prev => [...prev, {
        id: 'no-key',
        role: 'model',
        text: "⚠️ 请先在页面顶部配置你的 Gemini API Key 才能使用 AI 教练功能。"
      }]);
      return;
    }
    
    try {
        startChat(context);
        setChatInitialized(true);
        console.log('AICoach: Chat initialized successfully');
    } catch (e) {
        console.error("AICoach: Failed to start chat", e);
        setMessages(prev => [...prev, {
            id: 'error',
            role: 'model',
            text: "❌ 聊天初始化失败，请检查 API Key 是否正确。错误: " + (e as Error).message
        }]);
    }
  }, [context, topicTitle, apiKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessage(userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-2xl shadow-lg overflow-hidden border border-pink-100">
      <div className="bg-pink-100 p-4 border-b border-pink-200 flex items-center gap-2">
        <Bot className="text-pink-600" size={24} />
        <h3 className="font-semibold text-pink-800">Bloom AI 顾问</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-pink-500 text-white rounded-tr-none'
                  : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none shadow-sm'
              }`}
            >
               {msg.role === 'model' && (
                  <div className="flex items-center gap-2 mb-1 opacity-50">
                     <Bot size={12} />
                     <span className="text-xs">Bloom</span>
                  </div>
               )}
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-3 shadow-sm">
                <div className="flex gap-1">
                    <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-pink-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="问点什么... (例如：'方脸怎么修容？')"
            className="flex-1 px-4 py-2 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
