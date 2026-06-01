import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, User, Settings, LogOut, X, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateContractor } from '../../api/authApi';

export default function Header({ user, onLogout, onUpdateUser }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    companyName: user?.companyName || '',
    password: ''
  });

  const premiumGradient = "linear-gradient(135deg, #FF0080 0%, #FF8C00 50%, #40E0D0 100%)";
  const userInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  const openSettings = (tab) => {
    setActiveSettingsTab(tab);
    setIsModalOpen(true);
    setShowProfileMenu(false);
    setFormData({ fullName: user?.fullName, companyName: user?.companyName, password: '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const loadingId = toast.loading("Updating your profile...");
    try {
      const response = await updateContractor(user.id, formData);
      toast.dismiss(loadingId);
      toast.success("Profile updated successfully! ✨");
      onUpdateUser(response.data);
      setIsModalOpen(false);
    } catch (err) {
      toast.dismiss(loadingId);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <>
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
              <p className="text-sm font-bold text-neutral-900 flex items-center gap-1">
                {user?.fullName || 'Admin User'} <ChevronDown className="w-3 h-3 text-neutral-400" />
              </p>
              <p className="text-[11px] font-extrabold text-[#FF8C00] uppercase tracking-wide">
                {user?.companyName || 'Contractor'}
              </p>
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl border border-neutral-100 rounded-[1.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden z-50">
                <div className="p-4 border-b border-neutral-100 bg-white/50">
                  <p className="text-sm font-bold text-neutral-900">{user?.fullName}</p>
                  <p className="text-xs font-medium text-neutral-500 truncate">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button onClick={() => openSettings('profile')} className="w-full flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-xl transition-colors text-sm font-bold text-neutral-700">
                    <User className="w-4 h-4 text-neutral-400" /> My Profile
                  </button>
                  <button onClick={() => openSettings('account')} className="w-full flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-xl transition-colors text-sm font-bold text-neutral-700">
                    <Settings className="w-4 h-4 text-neutral-400" /> Account Settings
                  </button>
                </div>
                <div className="p-2 border-t border-neutral-100">
                  <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold text-red-600">
                    <LogOut className="w-4 h-4" /> Secure Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Settings Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-white overflow-hidden flex flex-col md:flex-row">
              
              <div className="w-full md:w-1/3 bg-neutral-50/50 p-6 border-r border-neutral-100">
                <h3 className="text-lg font-black text-neutral-900 mb-6 px-2">Settings</h3>
                <div className="space-y-2">
                  <button onClick={() => setActiveSettingsTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeSettingsTab === 'profile' ? 'bg-white text-[#FF0080] shadow-sm border border-neutral-100' : 'text-neutral-500 hover:bg-white/50'}`}>
                    <User className="w-4 h-4" /> Profile Info
                  </button>
                  <button onClick={() => setActiveSettingsTab('account')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeSettingsTab === 'account' ? 'bg-white text-[#FF8C00] shadow-sm border border-neutral-100' : 'text-neutral-500 hover:bg-white/50'}`}>
                    <ShieldCheck className="w-4 h-4" /> Security
                  </button>
                </div>
              </div>

              <div className="w-full md:w-2/3 p-8 relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors">
                  <X className="w-4 h-4 text-neutral-600" />
                </button>

                <h2 className="text-2xl font-black text-neutral-900 mb-6">
                  {activeSettingsTab === 'profile' ? 'Public Profile' : 'Security Settings'}
                </h2>

                <form onSubmit={handleUpdate} className="space-y-5">
                  {activeSettingsTab === 'profile' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 mb-1.5 ml-1">FULL NAME</label>
                        <input required type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-[#FF0080]/20 focus:border-[#FF0080] outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 mb-1.5 ml-1">COMPANY NAME</label>
                        <input required type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-[#FF0080]/20 focus:border-[#FF0080] outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-400 mb-1.5 ml-1">EMAIL ADDRESS (Fixed)</label>
                        <input type="email" value={user?.email} disabled className="w-full bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-3 font-bold text-neutral-400 cursor-not-allowed" />
                      </div>
                    </motion.div>
                  )}

                  {activeSettingsTab === 'account' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 mb-1.5 ml-1">NEW PASSWORD</label>
                        <input type="password" placeholder="Leave blank to keep current password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-[#FF8C00]/20 focus:border-[#FF8C00] outline-none transition-all" />
                      </div>
                      <p className="text-xs font-medium text-neutral-400 leading-relaxed mt-2">
                        For security reasons, we recommend using a strong password.
                      </p>
                    </motion.div>
                  )}

                  <div className="pt-6 mt-6 border-t border-neutral-100 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-neutral-500 hover:bg-neutral-100 transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:opacity-90 transition-opacity" style={{ background: premiumGradient }}>Save Changes</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}