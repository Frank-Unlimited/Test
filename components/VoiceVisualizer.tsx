import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square } from 'lucide-react';

const VoiceVisualizer: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const requestRef = useRef<number>();

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      sourceRef.current = source;
      
      setIsListening(true);
      draw();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("无法访问麦克风。请检查权限设置。");
    }
  };

  const stopListening = () => {
    if (sourceRef.current) {
      sourceRef.current.mediaStream.getTracks().forEach(track => track.stop());
      sourceRef.current.disconnect();
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    
    setIsListening(false);
  };

  const draw = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    analyserRef.current.getByteFrequencyData(dataArray);

    ctx.fillStyle = '#fdf2f8'; // bg-sakura-50
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 2;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, '#f9a8d4'); // Light pink
      gradient.addColorStop(1, '#db2777'); // Dark pink

      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }

    requestRef.current = requestAnimationFrame(draw);
  };

  // Clean up
  useEffect(() => {
    return () => {
      if (isListening) stopListening();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-pink-100 my-4">
      <h3 className="text-lg font-semibold text-pink-600 mb-2">声音可视化工具</h3>
      <p className="text-sm text-gray-600 mb-4">
        观察你的声音频率。尝试提高喉头位置，你会发现频率分布向右移动（高频增加）。
      </p>
      
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={100} 
        className="w-full h-32 bg-sakura-50 rounded-lg mb-4 border border-pink-200"
      />

      <div className="flex justify-center">
        {!isListening ? (
          <button 
            onClick={startListening}
            className="flex items-center gap-2 px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors shadow-md"
          >
            <Mic size={18} />
            开始监测
          </button>
        ) : (
          <button 
            onClick={stopListening}
            className="flex items-center gap-2 px-6 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition-colors shadow-md"
          >
            <Square size={18} fill="currentColor" />
            停止
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceVisualizer;
