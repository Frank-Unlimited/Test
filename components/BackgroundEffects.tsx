import React from 'react';

const BackgroundEffects: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div 
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
      ></div>
      <div 
        className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
        style={{ animationDelay: '2s' }}
      ></div>
      <div 
        className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
        style={{ animationDelay: '4s' }}
      ></div>
    </div>
  );
};

export default BackgroundEffects;