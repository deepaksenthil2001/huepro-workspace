import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Briefcase, ArrowRight } from 'lucide-react';
import axios from 'axios'; 
import toast from 'react-hot-toast'; // FIX: Imported toast

export default function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({ fullName: '', companyName: '', email: '', password: '' });

  const premiumGradient = "linear-gradient(135deg, #40E0D0 0%, #FF8C00 50%, #FF0080 100%)";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingId = toast.loading("Creating your account..."); // Shows loading spinner
    try {
      await axios.post('http://localhost:8082/api/auth/register', formData);
      toast.dismiss(loadingId);
      toast.success("Account Created Successfully! Please login now."); // Premium Success Toast
      onSwitchToLogin(); 
    } catch (err) {
      toast.dismiss(loadingId);
      toast.error(err.response?.data || "Registration failed. Email might exist."); // Premium Error Toast
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#40E0D0]/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white/80 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white relative z-10 my-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Create Account</h1>
          <p className="text-sm font-medium text-neutral-500 mt-2">Join HuePro to manage your crew</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input type="text" required placeholder="Full Name" onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full bg-neutral-50/50 border border-neutral-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#40E0D0]/20 focus:border-[#40E0D0] transition-all" />
          </div>

          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input type="text" required placeholder="Company / Contractor Name" onChange={(e) => setFormData({...formData, companyName: e.target.value})} className="w-full bg-neutral-50/50 border border-neutral-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#40E0D0]/20 focus:border-[#40E0D0] transition-all" />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input type="email" required placeholder="Email Address" onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-neutral-50/50 border border-neutral-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#40E0D0]/20 focus:border-[#40E0D0] transition-all" />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input type="password" required placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-neutral-50/50 border border-neutral-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#40E0D0]/20 focus:border-[#40E0D0] transition-all" />
          </div>

          <button type="submit" className="w-full py-4 rounded-2xl text-white font-extrabold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-xl mt-6" style={{ background: premiumGradient }}>
            Register Now <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center text-sm font-bold text-neutral-500 mt-8">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-[#FF8C00] hover:underline">
            Login here
          </button>
        </p>
      </motion.div>
    </div>
  );
}