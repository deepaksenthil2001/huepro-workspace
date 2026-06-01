import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Phone, IndianRupee, X, Trash2, UserCircle2 } from 'lucide-react';
import { getWorkers, addWorker, updateWorker, deleteWorker } from '../../api/workerApi';

export default function Workers({ user }) {
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  
  const [formData, setFormData] = useState({ 
    name: '', role: '', phone: '', dailyWage: '', status: 'Active' 
  });

  const premiumGradient = "linear-gradient(135deg, #FF0080 0%, #FF8C00 50%, #40E0D0 100%)";

  useEffect(() => {
    if(user) fetchWorkers();
  }, [user]);

  const fetchWorkers = async () => {
    try {
      const response = await getWorkers(user.id);
      setWorkers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching workers:", error);
      setIsLoading(false);
    }
  };

  const openModal = (worker = null) => {
    if (worker) {
      setEditingWorker(worker);
      setFormData(worker); // Pre-fill data for editing
    } else {
      setEditingWorker(null);
      setFormData({ name: '', role: '', phone: '', dailyWage: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, contractorId: user.id };

      if (editingWorker) {
        await updateWorker(editingWorker.id, payload);
      } else {
        await addWorker(payload);
      }
      fetchWorkers();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving worker:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this worker?")) {
      try {
        await deleteWorker(id);
        fetchWorkers();
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error deleting worker:", error);
      }
    }
  };

  // Extract first letter for dynamic avatar
  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'W';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/70 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white shadow-xl">
        <div>
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Crew Management</h2>
          <p className="text-neutral-500 mt-1.5 font-medium">Manage painters, supervisors, and their schedules.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }} 
          onClick={() => openModal()} 
          className="flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-white shadow-[0_8px_16px_rgba(255,140,0,0.2)] transition-all whitespace-nowrap"
          style={{ background: premiumGradient }}
        >
          <Plus className="w-5 h-5" /> Add Worker
        </motion.button>
      </div>

      {/* Workers Grid */}
      {isLoading ? (
        <div className="text-center p-10 text-neutral-500 font-bold">Loading crew data...</div>
      ) : workers.length === 0 ? (
        <div className="text-center p-10 text-neutral-500 font-bold bg-white/50 rounded-[2rem] border border-white">No workers found. Add your first crew member!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <motion.div 
              key={worker.id}
              whileHover={{ y: -4 }}
              onClick={() => openModal(worker)} // Makes the entire card clickable
              className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-neutral-100 shadow-lg hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
            >
              {/* Card Background Glow */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#40E0D0]/10 rounded-full blur-2xl group-hover:bg-[#40E0D0]/20 transition-colors" />

              <div className="flex items-start gap-4 mb-6 relative z-10">
                {/* Dynamic Avatar instead of Static DP */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-md" style={{ background: premiumGradient }}>
                  {getInitial(worker.name)}
                </div>
                <div>
                  <h3 className="text-lg font-black text-neutral-900">{worker.name}</h3>
                  <p className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-md inline-block mt-1">
                    {worker.role || 'Worker'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-3 text-sm font-semibold text-neutral-600">
                  <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  {worker.phone || 'N/A'}
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-neutral-600">
                  <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  {worker.dailyWage || '0'} <span className="text-xs text-neutral-400 font-medium">/ day</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-between items-center relative z-10">
                <span className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-wide ${
                  worker.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {worker.status}
                </span>
                <span className="text-xs font-bold text-neutral-400 group-hover:text-indigo-500 transition-colors">
                  Tap to Edit &rarr;
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl relative border border-white"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <UserCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-neutral-900">
                    {editingWorker ? 'Update Details' : 'New Crew Member'}
                  </h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3.5 font-bold text-neutral-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="e.g. Murali" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
  <label className="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Role</label>
  <select required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3.5 font-bold text-neutral-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer">
    <option value="" disabled>Select a role...</option>
    <option value="Helper">Helper</option>
    <option value="Painter">Painter</option>
    <option value="Senior Painter">Senior Painter</option>
    <option value="Supervisor">Supervisor</option>
  </select>
</div>
                  <div>
                    <label className="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Daily Wage (₹)</label>
                    <input required type="number" value={formData.dailyWage} onChange={(e) => setFormData({...formData, dailyWage: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3.5 font-bold text-neutral-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="0" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Phone</label>
                    <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3.5 font-bold text-neutral-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="10-digit number" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3.5 font-bold text-neutral-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                      <option>Active</option>
                      <option>On Leave</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-neutral-100">
                  {editingWorker && (
                    <button type="button" onClick={() => handleDelete(editingWorker.id)} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors shrink-0">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <button type="submit" className="flex-1 py-4 rounded-2xl text-white font-black shadow-[0_8px_16px_rgba(255,140,0,0.2)] hover:opacity-90 transition-opacity flex justify-center items-center gap-2" style={{ background: premiumGradient }}>
                    {editingWorker ? 'Save Changes' : 'Add Worker'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}