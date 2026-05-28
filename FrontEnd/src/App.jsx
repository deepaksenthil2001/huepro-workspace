import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Paintbrush, Users, FolderKanban, Receipt, Search, Lock, User, Settings, LogOut, ChevronDown, Droplet } from 'lucide-react';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Projects from './components/Projects'; 
import Workers from './pages/Workers/Workers';
import Materials from './pages/Materials/Materials';
import Invoices from './pages/Invoices/Invoices';

import { getProjects } from './api/projectApi';
import { getWorkers } from './api/workerApi';
import { getMaterials } from './api/materialApi';
import { getInvoices } from './api/invoiceApi';

export default function App() {
  // 1. LocalStorage-ல் இருந்து User டேட்டாவை எடுத்தல் (Refresh செய்தாலும் Logout ஆகாது)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('huepro_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('huepro_user');
  });

  const [authView, setAuthView] = useState('login'); 
  const [showProfileMenu, setShowProfileMenu] = useState(false); 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ projects: 0, workers: 0, materials: 0, revenue: 0 });
  const [liveFeed, setLiveFeed] = useState([]);

  // Logo colors-ஐ அடிப்படையாகக் கொண்ட Simple Gradient
  const premiumGradient = "linear-gradient(135deg, #FF0080 0%, #FF8C00 50%, #40E0D0 100%)";
  const bgGradient = "linear-gradient(135deg, rgba(255,0,128,0.06) 0%, rgba(255,140,0,0.06) 50%, rgba(64,224,208,0.08) 100%)";

  // Dashboard Tab-ஐ கிளிக் செய்யும்போதெல்லாம் Data தானாகவே Update ஆகும்
  useEffect(() => {
    if (isAuthenticated && activeTab === 'dashboard') {
      loadDashboardData();
    }
  }, [isAuthenticated, activeTab]);

  const loadDashboardData = async () => {
    if (!user) return;
    try {
      // 2. எந்த யூசரோ, அவருடைய ID-ஐ மட்டும் API-க்கு அனுப்புகிறோம்
      const [projRes, workRes, matRes, invRes] = await Promise.all([
        getProjects(user.id).catch(() => ({ data: [] })), 
        getWorkers(user.id).catch(() => ({ data: [] })),
        getMaterials(user.id).catch(() => ({ data: [] })),
        getInvoices(user.id).catch(() => ({ data: [] }))
      ]);

      const projs = projRes.data || [];
      const works = workRes.data || [];
      const mats = matRes.data || [];
      const invs = invRes.data || [];

      const totalRev = invs.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      setStats({ projects: projs.length, workers: works.length, materials: mats.length, revenue: totalRev });

      const feed = [];
      if (works.length > 0) { const last = works[works.length - 1]; feed.push({ id: `w-${last.id}`, text: `${last.name || 'New Worker'} joined`, time: 'Recently', icon: Users, color: 'text-[#FF8C00]', bg: 'bg-[#FF8C00]/10' }); }
      if (mats.length > 0) { const last = mats[mats.length - 1]; feed.push({ id: `m-${last.id}`, text: `Stock updated`, time: 'Recently', icon: Droplet, color: 'text-[#40E0D0]', bg: 'bg-[#40E0D0]/10' }); }
      if (invs.length > 0) { const last = invs[invs.length - 1]; feed.push({ id: `i-${last.id}`, text: `Bill generated`, time: 'Recently', icon: Receipt, color: 'text-[#FF0080]', bg: 'bg-[#FF0080]/10' }); }

      if (feed.length === 0) {
        feed.push({ id: 'welcome', text: `Welcome aboard, ${user.fullName}!`, time: 'Just now', icon: LayoutDashboard, color: 'text-[#FF0080]', bg: 'bg-[#FF0080]/10' });
      }

      setLiveFeed(feed.reverse());
    } catch (error) {
      console.error("Dashboard data load error:", error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData); 
    setIsAuthenticated(true);
    localStorage.setItem('huepro_user', JSON.stringify(userData)); // Login செய்ததும் Save செய்கிறோம்
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthView('login');
    setShowProfileMenu(false);
    localStorage.removeItem('huepro_user'); // Logout செய்ததும் அழிக்கிறோம்
  };

  if (!isAuthenticated) {
    if (authView === 'login') return <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} />;
    else return <Register onRegister={handleLogin} onSwitchToLogin={() => setAuthView('login')} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard stats={stats} liveFeed={liveFeed} setActiveTab={setActiveTab} />;
      case 'projects': return <Projects user={user} />;
      case 'materials': return <Materials user={user} />;
      case 'workers': return <Workers user={user} />; // Workers பேஜுக்கு User Data-வை அனுப்புகிறோம்
      case 'invoices': return <Invoices user={user} />;
      default: return null;
    }
  };

  const userInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen font-sans antialiased overflow-hidden flex" style={{ background: bgGradient }}>
      {/* Sidebar Navigation */}
      <nav className="w-72 h-screen bg-white/60 backdrop-blur-3xl border-r border-white flex flex-col p-6 fixed left-0 top-0 z-50 shadow-[4px_0_24px_rgb(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-10 px-4 mt-2">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="w-10 h-10 rounded-full shadow-xl" style={{ background: premiumGradient }} />
          <span className="text-3xl font-extrabold tracking-tighter text-neutral-900">Hue<span className="font-light text-neutral-500">Pro</span></span>
        </div>
        
        <div className="space-y-3 flex-1 mt-4">
          <p className="px-4 text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-3">Main Menu</p>
          {[
            { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
            { id: 'projects', name: 'Active Sites', icon: FolderKanban },
            { id: 'materials', name: 'Paint & Stock', icon: Paintbrush },
            { id: 'workers', name: 'Crew Management', icon: Users },
            { id: 'invoices', name: 'Billings', icon: Receipt },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className="w-full group relative flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-extrabold transition-all overflow-hidden">
              {activeTab === item.id && <motion.div layoutId="activeNav" className="absolute inset-0 bg-white shadow-sm border border-white rounded-2xl -z-10" />}
              <item.icon className={`w-5 h-5 z-10 transition-colors ${activeTab === item.id ? 'text-[#FF0080]' : 'text-neutral-400 group-hover:text-[#FF8C00]'}`} />
              <span className={`z-10 transition-colors ${activeTab === item.id ? 'text-neutral-900' : 'text-neutral-500 group-hover:text-neutral-900'}`}>{item.name}</span>
            </button>
          ))}
        </div>
        
        <button onClick={handleLogout} className="mt-auto flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-extrabold text-neutral-500 hover:bg-red-50 hover:text-red-500 transition-colors">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </nav>

      <div className="flex-1 ml-72 flex flex-col h-screen">
        {/* Header */}
        <header className="h-24 bg-white/40 backdrop-blur-2xl border-b border-white px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input type="text" placeholder="Search projects..." className="w-full bg-white/70 border border-white rounded-full pl-14 pr-6 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#40E0D0]/20 focus:bg-white transition-all" />
          </div>
          
          <div className="relative">
            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 pl-5 border-l border-neutral-200 hover:opacity-80 transition-opacity focus:outline-none">
              <div className="w-11 h-11 rounded-full p-[2px] shadow-sm relative" style={{ background: premiumGradient }}>
                <div className="w-full h-full bg-white rounded-full border-2 border-white flex items-center justify-center overflow-hidden">
                  <span className="text-lg font-extrabold text-neutral-800">{userInitial}</span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="hidden md:flex flex-col items-start">
                <p className="text-sm font-bold text-neutral-900 flex items-center gap-1">{user?.fullName} <ChevronDown className="w-3 h-3 text-neutral-400" /></p>
                <p className="text-[11px] font-extrabold text-[#FF8C00] uppercase tracking-wide">{user?.companyName}</p>
              </div>
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl border border-neutral-100 rounded-[1.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden z-50">
                  <div className="p-4 border-b border-neutral-100 bg-white/50">
                    <p className="text-sm font-bold text-neutral-900">{user?.fullName}</p>
                    <p className="text-xs font-medium text-neutral-500 truncate">{user?.email}</p>
                  </div>
                  <div className="p-2 border-t border-neutral-100">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold text-red-600">
                      <LogOut className="w-4 h-4" /> Secure Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 relative z-10 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}