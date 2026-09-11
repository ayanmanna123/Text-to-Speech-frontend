import React, { useState } from 'react';
import { TtsProvider } from './context/TtsContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { TtsStudio } from './components/tts/TtsStudio';
import { VoicesPage } from './pages/VoicesPage';
import { HistoryPage } from './pages/HistoryPage';

export function AppContent() {
  const [activeTab, setActiveTab] = useState('studio');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-[#85D1DB]/40 selection:text-[#093d43]">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1">
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
