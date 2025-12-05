import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check, X } from 'lucide-react';

interface ApiKeySettingsProps {
  onApiKeyChange: (apiKey: string) => void;
}

const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    // 检查是否已有 API key（从环境变量或 localStorage）
    const envKey = (window as any).ENV?.GEMINI_API_KEY;
    const storedKey = localStorage.getItem('gemini_api_key');
    
    if (envKey && envKey !== 'PLACEHOLDER_API_KEY') {
      setApiKey(envKey);
      setHasKey(true);
      onApiKeyChange(envKey);
    } else if (storedKey) {
      setApiKey(storedKey);
      setHasKey(true);
      onApiKeyChange(storedKey);
    } else {
      setIsEditing(true);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setHasKey(true);
      setIsEditing(false);
      onApiKeyChange(apiKey.trim());
    }
  };

  const handleClear = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setHasKey(false);
    setIsEditing(true);
    onApiKeyChange('');
  };

  if (!isEditing && hasKey) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-700">API Key 已配置</span>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm text-green-600 hover:text-green-700 underline"
        >
          修改
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-pink-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-pink-600">
        <Key className="w-5 h-5" />
        <h3 className="font-semibold">Gemini API Key 设置</h3>
      </div>
      
      <p className="text-sm text-slate-600">
        请输入你的 Gemini API Key 以使用 AI 教练功能。
        <a 
          href="https://aistudio.google.com/app/apikey" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-pink-500 hover:text-pink-600 underline ml-1"
        >
          获取 API Key
        </a>
      </p>

      <div className="relative">
        <input
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="AIza..."
          className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
        <button
          onClick={() => setShowKey(!showKey)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!apiKey.trim()}
          className="flex-1 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          保存
        </button>
        {hasKey && (
          <button
            onClick={handleClear}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <p className="text-xs text-slate-500">
        💡 API Key 将保存在浏览器本地存储中，不会上传到服务器
      </p>
    </div>
  );
};

export default ApiKeySettings;
