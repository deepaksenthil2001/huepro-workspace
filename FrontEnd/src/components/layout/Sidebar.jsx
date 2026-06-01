import { motion } from 'framer-motion';
import { LayoutDashboard, Paintbrush, Users, FolderKanban, Receipt, LogOut } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const premiumGradient = "linear-gradient(135deg, #FF0080 0%, #FF8C00 50%, #40E0D0 100%)";

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', name: 'Active Sites', icon: FolderKanban },
    { id: 'materials', name: 'Paint & Stock', icon: Paintbrush },
    { id: 'workers', name: 'Crew Management', icon: Users },
    { id: 'invoices', name: 'Billings', icon: Receipt },
  ];

  return (
    <nav className="w-72 h-screen bg-white/60 backdrop-blur-3xl border-r border-white flex flex-col p-6 fixed left-0 top-0 z-50 shadow-[4px_0_24px_rgb(0,0,0,0.02)]">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 mb-10 px-4 mt-2">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="w-10 h-10 rounded-full shadow-xl" style={{ background: premiumGradient }} />
        <span className="text-3xl font-extrabold tracking-tighter text-neutral-900">Hue<span className="font-light text-neutral-500">Pro</span></span>
      </div>
      
      {/* Navigation Links */}
      <div className="space-y-3 flex-1 mt-4">
        <p className="px-4 text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-3">Main Menu</p>
        {menuItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)} 
            className="w-full group relative flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-extrabold transition-all overflow-hidden"
          >
            {activeTab === item.id && <motion.div layoutId="activeNav" className="absolute inset-0 bg-white shadow-sm border border-white rounded-2xl -z-10" />}
            <item.icon className={`w-5 h-5 z-10 transition-colors ${activeTab === item.id ? 'text-[#FF0080]' : 'text-neutral-400 group-hover:text-[#FF8C00]'}`} />
            <span className={`z-10 transition-colors ${activeTab === item.id ? 'text-neutral-900' : 'text-neutral-500 group-hover:text-neutral-900'}`}>{item.name}</span>
          </button>
        ))}
      </div>
      
      {/* Logout Action */}
      <button onClick={onLogout} className="mt-auto flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-extrabold text-neutral-500 hover:bg-red-50 hover:text-red-500 transition-colors">
        <LogOut className="w-5 h-5" /> Logout
      </button>
    </nav>
  );
}