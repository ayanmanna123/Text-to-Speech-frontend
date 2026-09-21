import React, { useState } from 'react';
import { TtsProvider } from './context/TtsContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { TtsStudio } from './components/tts/TtsStudio';
import { VoicesPage } from './pages/VoicesPage';
import { HistoryPage } from './pages/HistoryPage';

export function AppContent() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-transparent text-black flex flex-col font-sans selection:bg-black selection:text-white relative overflow-x-hidden">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 relative z-10">
        {activeTab === 'home' && <LandingPage onGoToStudio={() => setActiveTab('studio')} />}
        {activeTab === 'studio' && <TtsStudio />}
        {activeTab === 'voices' && <VoicesPage onSelectVoiceAndGoToStudio={() => setActiveTab('studio')} />}
        {activeTab === 'history' && <HistoryPage />}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <TtsProvider>
      <AppContent />
    </TtsProvider>
  );
}
