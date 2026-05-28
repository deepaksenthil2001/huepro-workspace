import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Lock, ArrowUpRight, Mail, Building2 } from 'lucide-react';
import { registerUser } from '../../api/authApi';

export default function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({ fullName: '', companyName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const premiumGradient = "linear-gradient(135deg, #FF0080 0%, #FF8C00 50%, #40E0D0 100%)";
  const bgGradient = "linear-gradient(135deg, rgba(255,0,128,0.06) 0%, rgba(255,140,0,0.06) 50%, rgba(64,224,208,0.08) 100%)";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); setSuccess('');
    
    try {
      await registerUser(formData);
      setSuccess('Account created successfully! Please login.');
      setFormData({ fullName: '', companyName: '', email: '', password: '' });
      setTimeout(() => onSwitchToLogin(), 2000); // 2 வினாடிகளில் லாகின் பேஜுக்கு செல்லும்
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden py-10" style={{ background: bgGradient }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="bg-white/70 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-xl border border-white">
          <div className="flex flex-col items-center justify-center mb-8">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-14 h-14 rounded-full shadow-lg mb-4" style={{ background: premiumGradient }} />
            <h1 className="text-3xl font-extrabold tracking-tighter text-neutral-900">Join Hue<span className="font-light text-neutral-500">Pro</span></h1>
            <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase mt-2">Create Contractor Account</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl text-center border border-red-100">{error}</div>}
          {success && <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl text-center border border-emerald-100">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input required type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="John Doe" className="w-full bg-white/50 border border-neutral-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20 transition-all" />
              </div>
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase tracking-wide">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input required type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} placeholder="JD Paints Ltd." className="w-full bg-white/50 border border-neutral-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#40E0D0]/20 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="hello@company.com" className="w-full bg-white/50 border border-neutral-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#FF0080]/20 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="w-full bg-white/50 border border-neutral-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20 transition-all" />
              </div>
            </div>
            
            <button type="submit" disabled={isLoading} className="w-full mt-6 py-3.5 rounded-2xl text-white text-sm font-extrabold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex justify-center items-center gap-2 disabled:opacity-70" style={{ background: premiumGradient }}>
              {isLoading ? 'Creating Account...' : 'Create Account'} <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-medium text-neutral-500">Already have an account? <button onClick={onSwitchToLogin} className="text-[#FF0080] font-bold hover:underline">Login here</button></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}