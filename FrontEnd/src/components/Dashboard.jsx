import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { IndianRupee, TrendingUp, Users, FolderKanban } from 'lucide-react';

const data = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 2000, profit: 9800 },
  { name: 'Apr', revenue: 2780, profit: 3908 },
  { name: 'May', revenue: 1890, profit: 4800 },
  { name: 'Jun', revenue: 2390, profit: 3800 },
  { name: 'Jul', revenue: 3490, profit: 4300 },
];

const stats = [
  { title: "Total Revenue", value: "₹24.5L", icon: IndianRupee, trend: "+12.5%" },
  { title: "Active Sites", value: "12", icon: FolderKanban, trend: "+2" },
  { title: "Total Crew", value: "48", icon: Users, trend: "Stable" },
  { title: "Avg Profit Margin", value: "32%", icon: TrendingUp, trend: "+4.1%" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2.5rem] p-10 h-72 flex flex-col justify-end relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200/40 via-purple-200/40 to-indigo-200/40 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
        <h1 className="text-5xl font-extrabold tracking-tighter text-neutral-900 mb-2">
          Overview, <span className="text-gradient">HuePro</span>
        </h1>
        <p className="text-neutral-500 font-medium text-lg">Here is what's happening with your painting business today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass rounded-[2rem] p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-100 text-neutral-600'}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-neutral-500 text-sm font-bold uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-3xl font-extrabold text-neutral-900 mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 glass rounded-[2.5rem] p-8">
          <h3 className="text-xl font-extrabold text-neutral-900 mb-6">Revenue & Profit Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF0080" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF0080" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#40E0D0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#40E0D0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EA" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8E8E93', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8E8E93', fontSize: 12, fontWeight: 600 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#FF0080" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="profit" stroke="#40E0D0" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass rounded-[2.5rem] p-8">
          <h3 className="text-xl font-extrabold text-neutral-900 mb-6">Site Progress</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.slice(0, 4)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EA" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8E8E93', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8E8E93', fontSize: 12, fontWeight: 600 }} />
                <Tooltip cursor={{ fill: '#F5F5F7' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="revenue" fill="#FF8C00" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
