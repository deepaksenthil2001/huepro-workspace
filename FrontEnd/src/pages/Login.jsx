import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast'; 

export default function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const premiumGradient = "linear-gradient(135deg, #FF0080 0%, #FF8C00 50%, #40E0D0 100%)";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingId = toast.loading("Verifying credentials..."); 
    try {
      // FIX: Changed localhost to Render Live URL
      const response = await axios.post('https://huepro-workspace.onrender.com/api/auth/login', { 
        email: email, 
        password: password 
      });
      toast.dismiss(loadingId);
      toast.success("Login Successful! Welcome back ✨"); 
      onLogin(response.data); 
    } catch (err) {
      toast.dismiss(loadingId);
      toast.error(err.response?.data || "Invalid email or password!"); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF8C00]/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white/80 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full mx-auto mb-6 shadow-xl" style={{ background: premiumGradient }} />
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Welcome Back</h1>
          <p className="text-sm font-medium text-neutral-500 mt-2">Sign in to HuePro Workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-neutral-50/50 border border-neutral-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF8C00]/20 focus:border-[#FF8C00] transition-all" />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-neutral-50/50 border border-neutral-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF8C00]/20 focus:border-[#FF8C00] transition-all" />
          </div>

          <button type="submit" className="w-full py-4 rounded-2xl text-white font-extrabold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-xl mt-4" style={{ background: premiumGradient }}>
            Secure Login <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center text-sm font-bold text-neutral-500 mt-8">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="text-[#FF0080] hover:underline">
            Register here
          </button>
        </p>
      </motion.div>
    </div>
  );
}