import { motion } from 'framer-motion';
import { LayoutDashboard, Paintbrush, Users, FolderKanban, Receipt, LogOut } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const premiumGradient = "linear-gradient(135deg, #4F46E5 0%, #9333EA 50%, #EC4899 100%)";

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', name: 'Projects (CRUD)', icon: FolderKanban },
    { id: 'materials', name: 'Paint Inventory', icon: Paintbrush },
    { id: 'workers', name: 'Worker Logs', icon: Users },
    { id: 'invoices', name: 'Quotations', icon: Receipt },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-neutral-100 flex flex-col justify-between p-6 fixed left-0 top-0 z-40">
      <div>
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-7 h-7 rounded-full shadow-md" 
            style={{ background: premiumGradient }}
          />
          <span className="text-2xl font-bold tracking-tight text-neutral-950">
            Hue<span className="font-light text-neutral-500">Pro</span>
          </span>
        </div>

        {/* Navigation Menu Links */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors text-left"
              >
                {/* Background Fluid Animation on Selection */}
                {isSelected && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-2xl opacity-10"
                    style={{ background: premiumGradient }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                
                <Icon className={`w-5 h-5 transition-colors z-10 ${isSelected ? 'text-[#9333EA]' : 'text-neutral-400'}`} />
                <span className={`z-10 transition-colors ${isSelected ? 'text-neutral-950 font-semibold' : 'text-neutral-600 hover:text-neutral-950'}`}>
                  {item.name}
                </span>

                {isSelected && (
                  <motion.div 
                    layoutId="activeDot"
                    className="absolute right-4 w-1.5 h-1.5 rounded-full"
                    style={{ background: premiumGradient }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all text-left w-full">
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  );
}