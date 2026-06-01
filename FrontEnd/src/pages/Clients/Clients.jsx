import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Briefcase, Mail, Phone, MapPin } from 'lucide-react';
import axios from 'axios';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '', address: '', status: 'Lead', totalRevenue: '0' });

  const API_URL = 'http://localhost:8082/api/clients';

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get(API_URL);
      setClients(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setIsLoading(false);
    }
  };

  const openModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData(client);
    } else {
      setEditingClient(null);
      setFormData({ name: '', company: '', email: '', phone: '', address: '', status: 'Lead', totalRevenue: '0' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await axios.put(`${API_URL}/${editingClient.id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchClients();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this client from CRM?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchClients();
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass p-8 rounded-[2.5rem]">
        <div>
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Client CRM</h2>
          <p className="text-neutral-500 mt-1.5 font-medium">Manage leads, active clients, and view total revenue generated.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input type="text" placeholder="Search clients..." className="w-full bg-white border border-neutral-200 rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm" />
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => openModal()} className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white shadow-[0_8px_16px_rgba(255,0,128,0.2)] transition-all whitespace-nowrap bg-gradient-to-r from-[#FF0080] to-[#FF8C00]">
            <Plus className="w-5 h-5" /> Add Client
          </motion.button>
        </div>
      </div>

      <div className="glass rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200/50">
                <th className="p-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Client Info</th>
                <th className="p-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Contact</th>
                <th className="p-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Revenue</th>
                <th className="p-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/50">
              {isLoading ? (
                <tr><td colSpan="5" className="p-10 text-center text-neutral-500 font-medium">Loading CRM data...</td></tr>
              ) : clients.map((client) => (
                <motion.tr key={client.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-50/80 rounded-2xl text-indigo-600">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-neutral-900 font-bold text-base">{client.name}</h4>
                        <div className="text-xs font-medium text-neutral-500 mt-1">{client.company || 'Individual'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-neutral-600"><Mail className="w-3.5 h-3.5 text-neutral-400" /> {client.email}</div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600"><Phone className="w-3.5 h-3.5 text-neutral-400" /> {client.phone}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-base font-extrabold text-neutral-900">₹ {client.totalRevenue}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wide border ${
                      client.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                      client.status === 'Lead' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(client)} className="p-2.5 bg-white hover:bg-neutral-50 rounded-xl text-neutral-500 hover:text-indigo-600 transition-colors shadow-sm"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(client.id)} className="p-2.5 bg-white hover:bg-red-50 rounded-xl text-neutral-500 hover:text-red-500 transition-colors shadow-sm"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 w-full max-w-xl shadow-2xl relative border border-white">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-extrabold text-neutral-900">{editingClient ? 'Update Client' : 'Add New Client'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-neutral-500 mb-1">CLIENT NAME</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-neutral-500 mb-1">COMPANY NAME (Optional)</label>
                    <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">EMAIL</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">PHONE</label>
                    <input required type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">STATUS</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500">
                      <option>Lead</option>
                      <option>Active</option>
                      <option>Past</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">TOTAL REVENUE (₹)</label>
                    <input type="number" value={formData.totalRevenue} onChange={(e) => setFormData({...formData, totalRevenue: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500" />
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-neutral-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/3 py-3.5 rounded-xl border border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50">Cancel</button>
                  <button type="submit" className="w-2/3 py-3.5 rounded-xl text-white font-bold bg-gradient-to-r from-[#FF0080] to-[#FF8C00] shadow-lg">Save Client</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
