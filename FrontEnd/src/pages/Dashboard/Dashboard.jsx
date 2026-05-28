import { motion, AnimatePresence } from 'framer-motion';
import { PaintRoller, Droplet, Users, Receipt, Palette, IndianRupee, ArrowUpRight, ChevronRight, Sparkles, Plus, Activity, Paintbrush } from 'lucide-react';

export default function Dashboard({ stats, liveFeed, setActiveTab }) {
  const premiumGradient = "linear-gradient(135deg, #FF0080 0%, #FF8C00 50%, #40E0D0 100%)";

  const containerAnim = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemAnim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={containerAnim} initial="hidden" animate="show" className="space-y-8 pb-10">
      <motion.div variants={itemAnim} className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative overflow-hidden rounded-[2.5rem] p-10 bg-white/70 backdrop-blur-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4"><Palette size={200} /></div>
          <div className="relative z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white text-neutral-800 font-extrabold text-[10px] tracking-widest uppercase mb-4 shadow-sm border border-neutral-100">HuePro Workspace</span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-neutral-900 mb-3">Business <span style={{ background: premiumGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Overview</span></h1>
            <p className="text-neutral-500 font-medium text-sm md:text-base max-w-lg">Monitor your active paint sites, manage crew attendance, and track inventory in real-time.</p>
          </div>
        </div>
        <div className="w-full md:w-80 rounded-[2.5rem] p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-[0_10px_40px_rgba(255,0,128,0.3)] hover:scale-[1.02] transition-transform duration-300" style={{ background: premiumGradient }}>
          <div>
            <p className="text-white/80 text-sm font-bold tracking-wide uppercase mb-1">Total Revenue</p>
            <h2 className="text-4xl font-extrabold flex items-center gap-1"><IndianRupee className="w-7 h-7 text-white/90" /> {stats.revenue.toLocaleString('en-IN')}</h2>
            <div className="flex items-center gap-1 text-white/90 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold mt-4 shadow-sm"><ArrowUpRight className="w-4 h-4" /> Live Updates</div>
          </div>
          <button onClick={() => setActiveTab('invoices')} className="mt-6 w-full py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 transition-all flex items-center justify-center gap-2 text-sm font-bold shadow-lg">View Billings <ChevronRight className="w-4 h-4" /></button>
        </div>
      </motion.div>

      <motion.div variants={itemAnim} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Active Sites', value: stats.projects, icon: PaintRoller, tab: 'projects', color: 'from-[#FF0080] to-[#FF4D94]' },
          { title: 'Inventory Stock', value: stats.materials, icon: Droplet, tab: 'materials', color: 'from-[#FF8C00] to-[#FFB04D]' },
          { title: 'Crew On-Site', value: stats.workers, icon: Users, tab: 'workers', color: 'from-[#40E0D0] to-[#66E8DA]' },
        ].map((stat, index) => (
          <motion.button key={index} whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveTab(stat.tab)} className={`text-left relative overflow-hidden bg-gradient-to-br ${stat.color} p-8 rounded-[2.5rem] shadow-lg group`}>
            <div className="absolute -right-4 -top-4 opacity-20 transform group-hover:scale-125 transition-transform duration-500 text-white"><stat.icon size={120} /></div>
            <div className="relative z-10 flex justify-between items-start mb-6">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-sm"><stat.icon className="w-6 h-6" /></div>
              <ArrowUpRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            </div>
            <h3 className="relative z-10 text-5xl font-extrabold text-white tracking-tight">{stat.value.toString().padStart(2, '0')}</h3>
            <p className="relative z-10 text-sm font-bold text-white/90 uppercase tracking-wider mt-2">{stat.title}</p>
          </motion.button>
        ))}
      </motion.div>

      <motion.div variants={itemAnim} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-extrabold text-neutral-900 flex items-center gap-2"><Sparkles className="text-[#FF0080] w-5 h-5" /> Quick Actions</h3>
            <span className="text-xs font-bold text-[#FF8C00] bg-[#FF8C00]/10 px-4 py-1.5 rounded-full border border-[#FF8C00]/20">CRUD Shortcuts</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'Start New Project', desc: 'Add client & site details', icon: Plus, tab: 'projects' },
              { name: 'Add Worker', desc: 'Register new crew member', icon: Users, tab: 'workers' },
              { name: 'Update Inventory', desc: 'Add paint or tools to stock', icon: Paintbrush, tab: 'materials' },
              { name: 'Generate Invoice', desc: 'Create bill for client', icon: Receipt, tab: 'invoices' }
            ].map((action, i) => (
              <motion.button key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveTab(action.tab)} className="flex items-center gap-4 p-5 rounded-2xl bg-white hover:bg-neutral-50/80 border border-neutral-100 transition-all group text-left shadow-sm">
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100 text-neutral-500 group-hover:shadow-md transition-all"><action.icon className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#FF0080] transition-colors">{action.name}</h4>
                  <p className="text-xs font-medium text-neutral-500 mt-0.5">{action.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          <div className="flex items-center gap-2 mb-8"><Activity className="w-5 h-5 text-[#40E0D0]" /><h3 className="text-xl font-extrabold text-neutral-900">Live Activity</h3></div>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
            <AnimatePresence>
              {liveFeed.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${item.bg} ${item.color}`}><item.icon className="w-4 h-4" /></div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white/80 border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-bold text-neutral-900">{item.text}</p>
                    <span className="text-xs font-bold text-neutral-400 mt-1 block">{item.time}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}