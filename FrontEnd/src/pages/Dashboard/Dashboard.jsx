import { motion } from 'framer-motion';
import { 
  PaintRoller, 
  Droplet, 
  Users, 
  Receipt, 
  Palette, 
  IndianRupee, 
  ArrowUpRight, 
  Plus, 
  Activity,
  Paintbrush
} from 'lucide-react';

export default function Dashboard({ stats, liveFeed, setActiveTab }) {
  // Premium Gradients matching the logo aesthetic
  const premiumGradient = "linear-gradient(135deg, #FF0080 0%, #FF8C00 50%, #40E0D0 100%)";
  const revenueGradient = "linear-gradient(135deg, #FF8C00 0%, #FF0080 100%)";

  // Card Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="space-y-8"
    >
      {/* Top Section: Overview & Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Business Overview Welcome Card */}
        <motion.div variants={itemVariants} className="col-span-2 bg-white/70 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white shadow-xl relative overflow-hidden flex flex-col justify-center">
          <Palette className="absolute -right-10 -bottom-10 w-64 h-64 text-neutral-100 opacity-50 rotate-12" />
          <div className="relative z-10">
            <p className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest mb-3">HuePro Workspace</p>
            <h1 className="text-5xl font-black text-neutral-900 tracking-tighter mb-4">
              Business <span style={{ background: premiumGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Overview</span>
            </h1>
            <p className="text-neutral-500 font-medium max-w-md leading-relaxed">
              Monitor your active paint sites, manage crew attendance, and track inventory in real-time.
            </p>
          </div>
        </motion.div>

        {/* Revenue Card (Dynamic) */}
        <motion.div variants={itemVariants} className="p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white flex flex-col justify-between" style={{ background: revenueGradient }}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-white/80 mb-2">Total Revenue</p>
            <h2 className="text-5xl font-black flex items-center gap-2">
              <IndianRupee className="w-8 h-8" /> 
              {stats.revenue.toLocaleString('en-IN')}
            </h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md mt-4 text-xs font-bold">
              <ArrowUpRight className="w-3 h-3" /> Live Updates
            </div>
          </div>
          <button onClick={() => setActiveTab('invoices')} className="w-full mt-6 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors text-sm font-extrabold flex justify-center items-center gap-2">
            View Billings <ArrowUpRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Middle Section: Quick Stats (Dynamic) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Active Sites */}
        <motion.div variants={itemVariants} className="bg-[#FF0080] p-8 rounded-[2rem] shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <PaintRoller className="absolute -right-4 -top-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
            <PaintRoller className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-5xl font-black text-white mb-1">{String(stats.projects).padStart(2, '0')}</h3>
          <p className="text-xs font-extrabold text-white/80 uppercase tracking-widest">Active Sites</p>
        </motion.div>

        {/* Inventory Stock */}
        <motion.div variants={itemVariants} className="bg-[#FF8C00] p-8 rounded-[2rem] shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <Droplet className="absolute -right-4 -top-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
            <Droplet className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-5xl font-black text-white mb-1">{String(stats.materials).padStart(2, '0')}</h3>
          <p className="text-xs font-extrabold text-white/80 uppercase tracking-widest">Inventory Stock</p>
        </motion.div>

        {/* Crew On-Site */}
        <motion.div variants={itemVariants} className="bg-[#40E0D0] p-8 rounded-[2rem] shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <Users className="absolute -right-4 -top-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-5xl font-black text-white mb-1">{String(stats.workers).padStart(2, '0')}</h3>
          <p className="text-xs font-extrabold text-white/80 uppercase tracking-widest">Crew On-Site</p>
        </motion.div>
      </div>

      {/* Bottom Section: Quick Actions & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Actions Shortcuts */}
        <motion.div variants={itemVariants} className="col-span-2 bg-white/70 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-extrabold text-neutral-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#FF0080]" /> Quick Actions
            </h3>
            <span className="text-[10px] font-extrabold text-[#FF8C00] bg-[#FF8C00]/10 px-3 py-1.5 rounded-full uppercase tracking-wider">CRUD Shortcuts</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={() => setActiveTab('projects')} className="group flex items-start gap-4 p-5 bg-white/50 hover:bg-white rounded-2xl border border-neutral-100 hover:border-neutral-200 hover:shadow-lg transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-[#FF0080] group-hover:bg-[#FF0080]/10 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900 mb-0.5">Start New Project</p>
                <p className="text-xs font-medium text-neutral-500">Add client & site details</p>
              </div>
            </button>
            
            <button onClick={() => setActiveTab('workers')} className="group flex items-start gap-4 p-5 bg-white/50 hover:bg-white rounded-2xl border border-neutral-100 hover:border-neutral-200 hover:shadow-lg transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-[#FF8C00] group-hover:bg-[#FF8C00]/10 transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900 mb-0.5">Add Worker</p>
                <p className="text-xs font-medium text-neutral-500">Register new crew member</p>
              </div>
            </button>

            <button onClick={() => setActiveTab('materials')} className="group flex items-start gap-4 p-5 bg-white/50 hover:bg-white rounded-2xl border border-neutral-100 hover:border-neutral-200 hover:shadow-lg transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-[#40E0D0] group-hover:bg-[#40E0D0]/10 transition-colors">
                <Paintbrush className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900 mb-0.5">Update Inventory</p>
                <p className="text-xs font-medium text-neutral-500">Add paint or tools to stock</p>
              </div>
            </button>

            <button onClick={() => setActiveTab('invoices')} className="group flex items-start gap-4 p-5 bg-white/50 hover:bg-white rounded-2xl border border-neutral-100 hover:border-neutral-200 hover:shadow-lg transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-[#FF0080] group-hover:bg-[#FF0080]/10 transition-colors">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900 mb-0.5">Generate Invoice</p>
                <p className="text-xs font-medium text-neutral-500">Create bill for client</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Live Activity Feed */}
        <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white shadow-xl h-[350px] overflow-hidden flex flex-col">
          <h3 className="text-xl font-extrabold text-neutral-900 flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-[#40E0D0]" /> Live Activity
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {liveFeed.map((item, index) => (
              <motion.div 
                key={item.id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className={`w-9 h-9 rounded-full ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 border-b border-neutral-100 pb-4">
                  <p className="text-sm font-bold text-neutral-900">{item.text}</p>
                  <p className="text-xs font-medium text-neutral-400">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
      </div>
    </motion.div>
  );
}