import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowUpRight } from 'lucide-react';
import { loginUser } from '../../api/authApi';

export default function Login({ onLogin, onSwitchToRegister }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const premiumGradient = "linear-gradient(135deg, #FF0080 0%, #FF8C00 50%, #40E0D0 100%)";
  const bgGradient = "linear-gradient(135deg, rgba(255,0,128,0.06) 0%, rgba(255,140,0,0.06) 50%, rgba(64,224,208,0.08) 100%)";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await loginUser(formData);
      onLogin(response.data); // வெற்றிகரமாக லாகின் ஆனால் டேஷ்போர்டுக்கு அனுமதி
    } catch (err) {
      setError(err.response?.data || 'Invalid email or password!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden" style={{ background: bgGradient }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="bg-white/70 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-xl border border-white">
          <div className="flex flex-col items-center justify-center mb-10">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-16 h-16 rounded-full shadow-lg mb-4" style={{ background: premiumGradient }} />
            <h1 className="text-4xl font-extrabold tracking-tighter text-neutral-900">Hue<span className="font-light text-neutral-500">Pro</span></h1>
            <p className="text-sm font-bold text-neutral-400 tracking-widest uppercase mt-2">Contractor Portal</p>
          </div>

          {error && <div className="mb-6 p-3 bg-red-50 text-red-500 text-sm font-bold rounded-xl text-center border border-red-100">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-2 ml-1 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="hello@company.com" className="w-full bg-white/50 border border-neutral-200 rounded-2xl pl-12 pr-4 py-3.5 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#FF0080]/20 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-2 ml-1 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="w-full bg-white/50 border border-neutral-200 rounded-2xl pl-12 pr-4 py-3.5 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20 transition-all" />
              </div>
            </div>
            
            <button type="submit" disabled={isLoading} className="w-full mt-8 py-4 rounded-2xl text-white font-extrabold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex justify-center items-center gap-2 disabled:opacity-70" style={{ background: premiumGradient }}>
              {isLoading ? 'Verifying...' : 'Secure Login'} <ArrowUpRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-neutral-500">Don't have an account? <button onClick={onSwitchToRegister} className="text-[#FF8C00] font-bold hover:underline">Register here</button></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}