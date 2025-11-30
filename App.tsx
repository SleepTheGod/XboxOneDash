import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DashboardTab, User, Friend, Message, PartyMember, ThemeMode } from './types';
import Tile from './components/Tile';
import Modal from './components/Modal';
import { searchBing, generateGamertag, getGameDescription, generateRandomMessage } from './services/geminiService';

// --- Icons (Enhanced SVGs) ---
const Icons = {
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1-6.26-2.6.05-2.08 4.17-3.23 6.26-3.23s6.21 1.15 6.26 3.23c-1.55 1.6-3.76 2.6-6.26 2.6z"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Game: () => <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>,
  Message: () => <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>,
  Party: () => <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
  Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L3.15 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.04.24.24.41.48.41h3.84c.24 0.43-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.08-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>,
  Moon: () => <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M9 21c-.55 0-1.1-.04-1.63-.12 3.86-1.87 6.63-5.83 6.63-10.38 0-1.34-.25-2.62-.68-3.82C17.47 8.36 20 12.33 20 16.92 20 19.17 18.17 21 15.92 21H9z"/></svg>,
  Sun: () => <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.93c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-1.41 1.41c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.41-1.41zm13.42 13.42c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.41 1.41c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.41-1.41zM5.99 19.07l-1.41 1.41c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l1.41-1.41c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0zm12.02-13.42l1.41-1.41c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-1.41 1.41c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0z"/></svg>
};

// --- Constants ---
const TABS = Object.values(DashboardTab);

const INITIAL_FRIENDS: Friend[] = [
  { id: '1', gamertag: 'MasterChief117', status: 'Halo 3', isOnline: true, avatarUrl: 'https://picsum.photos/100/100?random=1' },
  { id: '2', gamertag: 'Cortana_AI', status: 'Online', isOnline: true, avatarUrl: 'https://picsum.photos/100/100?random=2' },
  { id: '3', gamertag: 'Arbiter_00', status: 'Offline', isOnline: false, avatarUrl: 'https://picsum.photos/100/100?random=3' },
  { id: '4', gamertag: 'SgtJohnson', status: 'Gears of War 2', isOnline: true, avatarUrl: 'https://picsum.photos/100/100?random=4' },
  { id: '5', gamertag: 'MarcusF', status: 'Dashboard', isOnline: true, avatarUrl: 'https://picsum.photos/100/100?random=5' },
];

const INITIAL_MESSAGES: Message[] = [
  { id: '1', from: 'Xbox Live', content: 'Welcome to the New Xbox Experience!', date: 'Just now', read: false },
  { id: '2', from: 'MasterChief117', content: 'Finish the fight?', date: '2m ago', read: false },
];

// --- Audio Engine ---
// Synthesized sounds so we don't rely on external assets that might 404
class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3; // Low volume
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("AudioContext not supported");
    }
  }

  playTone(freq: number, type: 'sine' | 'square' | 'triangle', duration: number, ramp = false) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    if (ramp) {
        osc.frequency.exponentialRampToValueAtTime(freq / 2, this.ctx.currentTime + duration);
    }

    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playHover() { this.playTone(600, 'sine', 0.1); }
  playSelect() { this.playTone(800, 'sine', 0.2); setTimeout(() => this.playTone(1200, 'sine', 0.4), 50); }
  playBack() { this.playTone(300, 'triangle', 0.2, true); }
  playSwoosh() { 
      // White noise burst simulation for swoosh
      if (!this.ctx || !this.masterGain) return;
      const bufferSize = this.ctx.sampleRate * 0.2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      
      // Lowpass filter to make it "whooshy" not "static-y"
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 500;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start();
  }
}

const sfx = new SoundEngine();


export default function App() {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.HOME);
  const [theme, setTheme] = useState<ThemeMode>('day');
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string, body: React.ReactNode }>({ title: '', body: null });
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [party, setParty] = useState<PartyMember[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize
  useEffect(() => {
    // Resume audio context on first interaction if needed
    const handleInteract = () => {
      if (sfx['ctx']?.state === 'suspended') sfx['ctx'].resume();
    };
    window.addEventListener('click', handleInteract);
    return () => window.removeEventListener('click', handleInteract);
  }, []);

  const changeTab = (tab: DashboardTab) => {
    if (tab !== activeTab) {
        sfx.playSwoosh();
        setActiveTab(tab);
    }
  };

  // --- Actions ---

  const handleSignIn = async () => {
    sfx.playSelect();
    setLoading(true);
    const tag = await generateGamertag();
    setUser({
      gamertag: tag,
      avatarUrl: 'https://picsum.photos/200/200?random=99',
      gamerscore: 1250,
      isOnline: true,
      status: 'Dashboard',
      rep: 5,
      zone: 'Pro',
      motto: 'Pro Gamer'
    });
    setLoading(false);
    setIsModalOpen(false);
  };

  const openSignInModal = () => {
    sfx.playSelect();
    setModalContent({
      title: 'Sign In',
      body: (
        <div className="flex flex-col items-center gap-6">
          <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg animate-pulse">
             <div className="text-6xl text-gray-500"><Icons.User /></div>
          </div>
          <div className="text-center">
             <h3 className="text-xl font-bold">Select a Profile</h3>
             <p className="text-sm text-gray-500">Sign in to Xbox Live</p>
          </div>
          <button 
            onClick={handleSignIn}
            disabled={loading}
            onMouseEnter={() => sfx.playHover()}
            className="w-full py-4 bg-xbox-green text-white font-bold rounded-lg shadow-md hover:bg-xbox-darkGreen hover:scale-105 transition-all flex justify-between px-6 items-center"
          >
            {loading ? 'Signing in...' : 'Create New Profile'}
            <span className="bg-white/20 px-2 rounded text-xs">A</span>
          </button>
        </div>
      )
    });
    setIsModalOpen(true);
  };

  const openSearch = () => {
    sfx.playSelect();
    setModalContent({
      title: 'Bing Search',
      body: <SearchBody />
    });
    setIsModalOpen(true);
  };

  const openGameDetails = async (gameTitle: string) => {
    sfx.playSelect();
    setLoading(true);
    setModalContent({
        title: gameTitle,
        body: <div className="p-8 text-center flex flex-col items-center gap-4"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div><p>Retrieving marketplace data...</p></div>
    });
    setIsModalOpen(true);

    const desc = await getGameDescription(gameTitle);
    
    setModalContent({
      title: gameTitle,
      body: (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="relative h-48 w-full rounded-lg overflow-hidden border-2 border-white shadow-lg group">
             <img src={`https://picsum.photos/400/200?seed=${gameTitle}`} className="w-full h-full object-cover" alt={gameTitle} />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                <span className="text-white font-bold text-2xl">{gameTitle}</span>
             </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs font-bold uppercase text-gray-500">
             <div className="bg-gray-200 p-2 text-center rounded">Rating: M</div>
             <div className="bg-gray-200 p-2 text-center rounded">Players: 1-4</div>
             <div className="bg-gray-200 p-2 text-center rounded">HDTV: 1080p</div>
          </div>

          <p className="text-gray-700 leading-relaxed font-medium bg-white p-4 rounded border border-gray-200 shadow-inner">
             {desc}
          </p>

          <div className="flex justify-between items-center mt-2 bg-gray-200 p-4 rounded border border-gray-300">
            <div className="flex flex-col">
                 <span className="font-bold text-2xl text-gray-800">$59.99</span>
                 <span className="text-xs text-gray-500">Download to HDD</span>
            </div>
            <button 
                className="bg-xbox-green text-white px-8 py-3 rounded-full font-bold shadow-lg hover:brightness-110 hover:scale-105 transition-all flex items-center gap-2"
                onMouseEnter={() => sfx.playHover()}
                onClick={() => sfx.playSelect()}
            >
                Confirm Purchase
            </button>
          </div>
        </div>
      )
    });
    setLoading(false);
  };

  const openParty = () => {
      sfx.playSelect();
      if (!user) {
          openSignInModal();
          return;
      }
      setModalContent({
          title: "Party",
          body: <PartyBody user={user} friends={friends} party={party} setParty={setParty} />
      });
      setIsModalOpen(true);
  };

  const openMessages = () => {
      sfx.playSelect();
      if (!user) {
          openSignInModal();
          return;
      }
      setModalContent({
          title: "Messages",
          body: <MessagesBody messages={messages} setMessages={setMessages} />
      });
      setIsModalOpen(true);
  };

  const SearchBody = () => {
    const [localQuery, setLocalQuery] = useState('');
    const [results, setResults] = useState<{title: string, snippet: string}[]>([]);
    const [searching, setSearching] = useState(false);

    const doSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      sfx.playSelect();
      setSearching(true);
      const res = await searchBing(localQuery);
      setResults(res);
      setSearching(false);
    };

    return (
      <div className="w-full">
        <form onSubmit={doSearch} className="flex gap-2 mb-4">
           <input 
            type="text" 
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search Xbox..."
            className="flex-1 p-3 border-2 border-gray-300 rounded focus:border-green-500 outline-none transition-colors"
            autoFocus
           />
           <button type="submit" className="bg-gray-700 text-white px-6 rounded font-bold hover:bg-gray-600 transition-colors">Bing</button>
        </form>
        {searching && <div className="text-center p-4 animate-pulse">Searching Xbox Live...</div>}
        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
          {results.map((r, i) => (
            <div key={i} className="bg-white p-4 rounded shadow-sm border border-gray-200 hover:bg-blue-50 cursor-pointer" onMouseEnter={() => sfx.playHover()}>
              <div className="font-bold text-blue-600 mb-1">{r.title}</div>
              <div className="text-xs text-gray-600">{r.snippet}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- Layout Helpers ---
  const activeIndex = TABS.indexOf(activeTab);
  
  return (
    <div className={`h-screen w-screen overflow-hidden font-sans select-none flex flex-col relative transition-colors duration-1000 ${theme === 'night' ? 'bg-gray-900 text-gray-100' : 'bg-nxe-gradient text-gray-800'}`}>
      
      {/* --- Dynamic Background --- */}
      <div 
        className={`absolute top-0 left-0 w-full h-[65%] bg-cover bg-center pointer-events-none z-0 transition-all duration-1000 ease-in-out`}
        style={{ 
          backgroundImage: theme === 'night' 
            ? 'url(https://picsum.photos/1920/1080?grayscale&blur=2)' 
            : 'url(https://picsum.photos/1920/1080?blur=4)',
          opacity: 0.6,
          filter: 'blur(2px)'
        }} 
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${theme === 'night' ? 'from-green-900/50 to-gray-900' : 'from-white/30 to-gray-300/80'}`}></div>
      </div>

      {/* --- Sphere/Logo Area --- */}
      <div className="absolute top-4 left-8 z-30 flex items-center gap-4">
         <div 
            className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-800 border-4 border-white/80 shadow-[0_0_20px_rgba(50,255,50,0.6)] flex items-center justify-center animate-pulse cursor-pointer hover:scale-110 transition-transform"
            onClick={() => {
                sfx.playSelect();
                setTheme(prev => prev === 'day' ? 'night' : 'day');
            }}
            title="Toggle Theme"
        >
             <div className="text-white text-4xl font-black italic select-none">X</div>
             {/* Gloss */}
             <div className="absolute top-0 left-0 w-full h-1/2 bg-white/30 rounded-t-full pointer-events-none"></div>
         </div>
         <div className="flex flex-col">
             <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white drop-shadow-md">Xbox Live</h1>
             <span className="text-xs text-white/80 font-bold uppercase tracking-widest">{theme === 'day' ? 'Afternoon' : 'Night'}</span>
         </div>
      </div>

      {/* --- Header / Navigation (Cover Flow Text) --- */}
      <header className="relative z-20 pt-8 pb-0 mt-8">
        <nav className="flex justify-center items-end h-24 space-x-12 perspective-500">
          {TABS.map((tab, index) => {
            const isActive = tab === activeTab;
            const distance = Math.abs(index - activeIndex);
            
            return (
              <button
                key={tab}
                onClick={() => changeTab(tab)}
                onMouseEnter={() => !isActive && sfx.playHover()}
                className={`
                  transition-all duration-500 ease-out uppercase font-bold tracking-widest
                  transform
                  ${isActive 
                    ? `text-white text-4xl border-b-4 border-xbox-green pb-2 mb-4 scale-110 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] z-10` 
                    : `text-gray-400 text-xl hover:text-white mb-6 scale-90 blur-[0.5px] opacity-70`}
                `}
                style={{
                    transform: isActive ? 'translateY(0) scale(1.2)' : `translateY(10px) scale(${1 - (distance * 0.1)})`
                }}
              >
                {tab}
              </button>
            );
          })}
        </nav>
      </header>

      {/* --- Main Stage (Horizontal Slider) --- */}
      <section className="flex-1 relative z-10 flex items-center perspective-1000 overflow-visible">
        <div 
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] h-[550px] items-center will-change-transform"
          style={{ 
            transform: `translateX(calc(50vw - 500px - ${activeIndex * 1000}px))` 
          }}
        >
          {TABS.map((tab, i) => {
             const isActive = activeTab === tab;
             const offset = i - activeIndex;

             return (
                <div 
                key={tab} 
                className={`
                    w-[1000px] h-full flex-shrink-0 flex items-center justify-center p-8 transition-all duration-700
                    ${isActive ? 'opacity-100 scale-100 rotate-y-0 z-10' : `opacity-40 scale-75 blur-[2px] z-0 ${offset < 0 ? 'rotate-y-12 origin-right' : '-rotate-y-12 origin-left'}`}
                `}
                >
                <PanelContent 
                    type={tab} 
                    user={user} 
                    onSignIn={openSignInModal} 
                    friends={friends}
                    openGame={openGameDetails}
                    openSearch={openSearch}
                    openParty={openParty}
                    openMessages={openMessages}
                    messages={messages}
                    sfx={sfx}
                />
                </div>
            );
          })}
        </div>
      </section>

      {/* --- Floor Reflection --- */}
      <div className={`absolute bottom-0 w-full h-64 bg-gradient-to-t ${theme === 'night' ? 'from-black to-transparent' : 'from-gray-400 to-transparent'} opacity-40 pointer-events-none z-0`} />

      {/* --- Footer Status Bar --- */}
      <footer className="absolute bottom-8 left-12 right-12 flex justify-between items-center z-20 text-white drop-shadow-lg">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold text-xs border border-white shadow-md">Y</div>
            <span className="uppercase text-xs font-bold tracking-wider">Xbox Home</span>
          </div>
          {activeTab === DashboardTab.HOME && (
             <div className="flex items-center gap-2 animate-fade-in">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs border border-white shadow-md">X</div>
                <span className="uppercase text-xs font-bold tracking-wider">Sign Out</span>
             </div>
          )}
        </div>
        
        {user ? (
           <div 
             className="flex items-center gap-4 bg-black/40 p-1.5 pl-6 pr-2 rounded-full backdrop-blur-md border border-white/30 cursor-pointer hover:bg-black/60 transition-colors"
             onClick={openSignInModal}
            >
             <div className="flex flex-col items-end">
               <span className="font-bold leading-none text-sm">{user.gamertag}</span>
               <div className="flex items-center gap-1.5 mt-0.5">
                 <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center text-[7px] text-black font-bold">G</div>
                 <span className="text-[10px] font-mono">{user.gamerscore}</span>
                 <div className="flex gap-0.5 ml-1">
                    {[...Array(5)].map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-yellow-400"></div>)}
                 </div>
               </div>
             </div>
             <img src={user.avatarUrl} className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-gray-500" alt="Avatar" />
           </div>
        ) : (
          <div className="flex items-center gap-4">
            <button onClick={openSignInModal} className="flex items-center gap-2 hover:text-green-300 transition-colors group">
              <span className="uppercase text-sm font-bold tracking-wide group-hover:scale-105 transition-transform">Sign In</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
             <span className="uppercase text-xs font-bold tracking-wider">Select</span>
             <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs border border-white shadow-md">A</div>
          </div>
          <div className="flex items-center gap-2">
             <span className="uppercase text-xs font-bold tracking-wider">Back</span>
             <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs border border-white shadow-md">B</div>
          </div>
        </div>
      </footer>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { sfx.playBack(); setIsModalOpen(false); }}
        title={modalContent.title}
        theme={theme}
      >
        {modalContent.body}
      </Modal>
    </div>
  );
}

// --- Sub-components for Panel Contents ---

const PanelContent = ({ type, user, onSignIn, friends, openGame, openSearch, openParty, openMessages, messages, sfx }: any) => {
  const containerClass = "grid grid-cols-4 gap-6 w-full h-full content-center p-4 drop-shadow-2xl";

  const handleTileClick = (action: () => void) => {
      sfx.playSelect();
      action();
  };
  
  const handleHover = () => sfx.playHover();

  switch (type) {
    case DashboardTab.BING:
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-full max-w-2xl transform hover:scale-105 transition-transform duration-300">
             <div 
               onClick={() => handleTileClick(openSearch)}
               onMouseEnter={handleHover}
               className="bg-white/90 rounded-full h-20 flex items-center px-8 gap-6 border-[6px] border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.3)] cursor-pointer overflow-hidden relative group"
             >
                <div className="text-gray-600 group-hover:text-blue-600 transition-colors text-3xl"><Icons.Search /></div>
                <span className="text-3xl text-gray-500 italic font-light group-hover:text-gray-800">Search Xbox Live...</span>
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 group-hover:animate-shine"></div>
             </div>
          </div>
        </div>
      );

    case DashboardTab.HOME:
      const unreadCount = messages.filter((m: Message) => !m.read).length;
      return (
        <div className={containerClass}>
          <Tile 
            size="large" 
            title={user ? "Play Disc" : "Sign In"} 
            subtitle={user ? "Halo 3" : "Connect to Xbox Live"} 
            image={user ? "https://picsum.photos/400/400?seed=halo" : undefined}
            color="bg-xbox-green"
            icon={!user && <Icons.User />}
            onClick={() => handleTileClick(user ? () => openGame("Halo 3") : onSignIn)}
            onHover={handleHover}
            selected
            className="col-span-2 row-span-2"
          />
          <Tile title="Quickplay" subtitle="Jump in" color="bg-blue-500" icon={<Icons.Game />} onClick={() => handleTileClick(() => {})} onHover={handleHover} />
          <Tile 
            title="Messages" 
            subtitle={`${unreadCount} Unread`} 
            color="bg-orange-500" 
            icon={<Icons.Message />}
            badge={unreadCount > 0 ? unreadCount : undefined}
            onClick={() => handleTileClick(openMessages)}
            onHover={handleHover}
          />
          <Tile title="Open Tray" subtitle="Reading..." color="bg-gray-600" onHover={handleHover} />
          <Tile title="System Settings" subtitle="Console" color="bg-purple-600" icon={<Icons.Settings />} onHover={handleHover} />
        </div>
      );

    case DashboardTab.SOCIAL:
      return (
        <div className={containerClass}>
          <Tile 
            size="wide"
            title="My Party" 
            subtitle={user ? "Start a Party" : "Sign in to start"} 
            color="bg-gray-700" 
            className="col-span-2"
            icon={<Icons.Party />}
            onClick={() => handleTileClick(openParty)}
            onHover={handleHover}
          />
           {friends.slice(0, 6).map((f: Friend, i: number) => (
             <Tile 
              key={f.id}
              title={f.gamertag}
              subtitle={f.isOnline ? f.status : 'Last seen 2h ago'}
              image={f.avatarUrl}
              size="small"
              onClick={() => handleTileClick(() => alert(`View profile: ${f.gamertag}`))}
              onHover={handleHover}
             />
           ))}
        </div>
      );

    case DashboardTab.GAMES:
      return (
        <div className={containerClass}>
           <Tile title="Game Library" subtitle="All Games" color="bg-xbox-green" size="medium" onHover={handleHover} />
           <Tile title="Achievements" subtitle="1250 G" color="bg-green-600" onHover={handleHover} />
           <Tile title="Demos" subtitle="Try for free" color="bg-blue-400" onHover={handleHover} />
           <Tile title="Arcade" subtitle="Xbox Live Arcade" color="bg-orange-400" onHover={handleHover} />
           
           <Tile title="Gears of War 2" image="https://picsum.photos/200/200?seed=gow" onClick={() => handleTileClick(() => openGame("Gears of War 2"))} onHover={handleHover} />
           <Tile title="Fable II" image="https://picsum.photos/200/200?seed=fable" onClick={() => handleTileClick(() => openGame("Fable II"))} onHover={handleHover} />
           <Tile title="Left 4 Dead" image="https://picsum.photos/200/200?seed=l4d" onClick={() => handleTileClick(() => openGame("Left 4 Dead"))} onHover={handleHover} />
           <Tile title="Fallout 3" image="https://picsum.photos/200/200?seed=fallout" onClick={() => handleTileClick(() => openGame("Fallout 3"))} onHover={handleHover} />
        </div>
      );
      
    case DashboardTab.TV_MOVIES:
      return (
         <div className={containerClass}>
            <Tile size="large" title="Netflix" subtitle="Watch Movies" color="bg-red-600" className="col-span-2 row-span-2" onHover={handleHover} />
            <Tile title="Video Library" color="bg-blue-800" onHover={handleHover} />
            <Tile title="Apps" color="bg-purple-800" onHover={handleHover} />
            <Tile title="Rentals" color="bg-green-800" onHover={handleHover} />
            <Tile title="Cinema" color="bg-gray-800" onHover={handleHover} />
         </div>
      );

    default:
      return (
        <div className="flex items-center justify-center w-full h-full">
           <div className="bg-white/20 p-8 rounded-xl border-2 border-white/40 text-white text-center shadow-xl backdrop-blur-sm">
             <h2 className="text-3xl font-bold uppercase mb-2 drop-shadow-md">{type}</h2>
             <p>Feature unavailable in preview.</p>
           </div>
        </div>
      );
  }
}

// --- Specific Modal Bodies ---

const PartyBody = ({ user, friends, party, setParty }: any) => {
    const addToParty = (friend: Friend) => {
        if (party.find((p: PartyMember) => p.gamertag === friend.gamertag)) return;
        setParty([...party, { gamertag: friend.gamertag, isSpeaking: false, avatarUrl: friend.avatarUrl }]);
    };

    return (
        <div className="flex gap-4 h-[400px]">
            <div className="w-1/2 bg-white/50 rounded p-4 flex flex-col gap-2 overflow-y-auto">
                <h4 className="font-bold uppercase text-xs text-gray-500 mb-2">My Party</h4>
                <div className="bg-white p-3 rounded shadow flex items-center gap-3 border-l-4 border-green-500">
                    <img src={user.avatarUrl} className="w-8 h-8 rounded-full" />
                    <span className="font-bold">{user.gamertag}</span>
                    <span className="ml-auto text-xs text-green-600 font-bold">HOST</span>
                </div>
                {party.map((p: PartyMember) => (
                    <div key={p.gamertag} className="bg-white p-3 rounded shadow flex items-center gap-3">
                        <img src={p.avatarUrl} className="w-8 h-8 rounded-full" />
                        <span>{p.gamertag}</span>
                    </div>
                ))}
                {party.length === 0 && <div className="text-center text-gray-500 mt-10 italic">Party is empty. Invite friends!</div>}
            </div>
            <div className="w-1/2 bg-gray-200 rounded p-4 flex flex-col gap-2 overflow-y-auto">
                <h4 className="font-bold uppercase text-xs text-gray-500 mb-2">Friends Online</h4>
                {friends.filter((f:Friend) => f.isOnline).map((f: Friend) => (
                    <button 
                        key={f.id} 
                        onClick={() => addToParty(f)}
                        className="bg-white p-2 rounded shadow flex items-center gap-2 hover:bg-green-100 transition-colors text-left"
                    >
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-bold">{f.gamertag}</span>
                        <span className="ml-auto text-xs text-blue-500 uppercase font-bold">Invite</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

const MessagesBody = ({ messages, setMessages }: any) => {
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    
    const sendReply = async (msgId: string) => {
        // Optimistic update
        setReplyingTo(msgId);
        const newMsgText = await generateRandomMessage();
        setReplyingTo(null);
        alert(`Reply sent: "${newMsgText}"`);
    }

    return (
        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto p-1">
            {messages.map((m: Message) => (
                <div key={m.id} className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${m.read ? 'border-gray-300' : 'border-orange-500'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-lg">{m.from}</span>
                        <span className="text-xs text-gray-500">{m.date}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{m.content}</p>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => sendReply(m.id)}
                            disabled={replyingTo === m.id}
                            className="bg-gray-200 px-3 py-1 rounded text-xs font-bold hover:bg-gray-300"
                        >
                            {replyingTo === m.id ? 'Sending...' : 'Reply'}
                        </button>
                        <button className="bg-gray-200 px-3 py-1 rounded text-xs font-bold hover:bg-gray-300">Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
