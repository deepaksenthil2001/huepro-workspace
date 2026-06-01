import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Briefcase, Users, Package, FileText } from 'lucide-react'; 
import { Toaster } from 'react-hot-toast';

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Login from './pages/Login';
import Register from './pages/Register';
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
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('huepro_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('huepro_user'));
  const [authView, setAuthView] = useState('login'); 
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ projects: 0, workers: 0, materials: 0, revenue: 0 });
  const [liveFeed, setLiveFeed] = useState([]);

  const bgGradient = "linear-gradient(135deg, rgba(255,0,128,0.06) 0%, rgba(255,140,0,0.06) 50%, rgba(64,224,208,0.08) 100%)";

  useEffect(() => {
    if (isAuthenticated && activeTab === 'dashboard') {
      loadDashboardData();
    }
  }, [isAuthenticated, activeTab]);

  const loadDashboardData = async () => {
    if (!user) return;
    try {
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
      feed.push({ id: 'welcome', text: `Welcome aboard, ${user.fullName}!`, time: 'Earlier', icon: LayoutDashboard, color: 'text-[#FF0080]', bg: 'bg-[#FF0080]/10' });

      if (projs.length > 0) feed.push({ id: `proj-${projs[projs.length - 1].id}`, text: `New site added: ${projs[projs.length - 1].name}`, time: 'Recently', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-50' });
      if (works.length > 0) feed.push({ id: `work-${works[works.length - 1].id}`, text: `Crew joined: ${works[works.length - 1].name}`, time: 'Recently', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' });
      if (mats.length > 0) feed.push({ id: `mat-${mats[mats.length - 1].id}`, text: `Stock updated: ${mats[mats.length - 1].name}`, time: 'Recently', icon: Package, color: 'text-amber-500', bg: 'bg-amber-50' });
      if (invs.length > 0) feed.push({ id: `inv-${invs[invs.length - 1].id}`, text: `Bill generated: ${invs[invs.length - 1].invoiceNumber}`, time: 'Recently', icon: FileText, color: 'text-rose-500', bg: 'bg-rose-50' });

      setLiveFeed(feed.reverse().slice(0, 4));
    } catch (error) {
      console.error("Dashboard data load error:", error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData); 
    setIsAuthenticated(true);
    localStorage.setItem('huepro_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthView('login');
    localStorage.removeItem('huepro_user');
  };

  // புதிய ஃபங்ஷன் - Profile அப்டேட் செய்ய
  const handleUpdateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('huepro_user', JSON.stringify(updatedUserData));
  };

  if (!isAuthenticated) {
    return authView === 'login' 
      ? <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} /> 
      : <Register onSwitchToLogin={() => setAuthView('login')} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard stats={stats} liveFeed={liveFeed} setActiveTab={setActiveTab} />;
      case 'projects': return <Projects user={user} />;
      case 'materials': return <Materials user={user} />;
      case 'workers': return <Workers user={user} />; 
      case 'invoices': return <Invoices user={user} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen font-sans antialiased overflow-hidden flex" style={{ background: bgGradient }}>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            color: '#171717',
            fontWeight: '800',
            fontSize: '14px',
            borderRadius: '100px',
            padding: '16px 24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5) inset',
          },
          success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#FF0080', secondary: '#fff' } },
        }}
      />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <div className="flex-1 ml-72 flex flex-col h-screen">
        {/* Header-ல் onUpdateUser-ஐ பாஸ் செய்கிறோம் */}
        <Header user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
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