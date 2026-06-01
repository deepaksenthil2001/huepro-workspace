import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Package, AlertCircle } from 'lucide-react';
import axios from 'axios';

// FIX 1: Added user prop
export default function Materials({ user }) {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'Paint', quantity: '', unit: 'Liters', status: 'In Stock', minStockLevel: 10 });

  const API_URL = 'http://localhost:8082/api/materials';

  // FIX 2: Added user dependency
  useEffect(() => {
    if (user) {
      fetchMaterials();
    }
  }, [user]);

  const fetchMaterials = async () => {
    try {
      // FIX 3: Fetch only this user's materials
      const response = await axios.get(`${API_URL}/contractor/${user.id}`);
      setMaterials(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching materials:", error);
      setIsLoading(false);
    }
  };

  const openModal = (material = null) => {
    if (material) {
      setEditingMaterial(material);
      setFormData(material);
    } else {
      setEditingMaterial(null);
      setFormData({ name: '', category: 'Paint', quantity: '', unit: 'Liters', status: 'In Stock', minStockLevel: 10 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // FIX 4: Attach contractorId to the data being saved
      const payload = { ...formData, contractorId: user.id };

      if (editingMaterial) {
        await axios.put(`${API_URL}/${editingMaterial.id}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      fetchMaterials();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving material:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this inventory item?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchMaterials();
      } catch (error) {
        console.error("Error deleting material:", error);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass p-8 rounded-[2.5rem]">
        <div>
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Inventory Tracking</h2>
          <p className="text-neutral-500 mt-1.5 font-medium">Monitor your paints, tools, and consumables levels.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input type="text" placeholder="Search inventory..." className="w-full bg-white border border-neutral-200 rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm" />
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => openModal()} className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white shadow-[0_8px_16px_rgba(255,0,128,0.2)] transition-all whitespace-nowrap bg-gradient-to-r from-[#FF0080] to-[#FF8C00]">
            <Plus className="w-5 h-5" /> Add Stock
          </motion.button>
        </div>
      </div>

      <div className="glass rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200/50">
                <th className="p-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Item & Category</th>
                <th className="p-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Stock Level</th>
                <th className="p-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/50">
              {isLoading ? (
                <tr><td colSpan="4" className="p-10 text-center text-neutral-500 font-medium">Loading inventory...</td></tr>
              ) : materials.map((item) => {
                const isLowStock = parseInt(item.quantity) <= (item.minStockLevel || 10);
                return (
                  <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${isLowStock ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-neutral-900 font-bold text-base">{item.name}</h4>
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mt-1 inline-block">{item.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-extrabold text-neutral-900">{item.quantity}</span>
                        <span className="text-sm font-medium text-neutral-500">{item.unit}</span>
                      </div>
                      {isLowStock && <div className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> Low Stock</div>}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wide border ${
                        item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(item)} className="p-2.5 bg-white hover:bg-neutral-50 rounded-xl text-neutral-500 hover:text-indigo-600 transition-colors shadow-sm"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-white hover:bg-red-50 rounded-xl text-neutral-500 hover:text-red-500 transition-colors shadow-sm"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 w-full max-w-xl shadow-2xl relative border border-white">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-extrabold text-neutral-900">{editingMaterial ? 'Update Inventory' : 'Add Stock Item'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-neutral-500 mb-1">ITEM NAME</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">CATEGORY</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500">
                      <option>Paint</option>
                      <option>Tools</option>
                      <option>Consumables</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-neutral-500 mb-1">QTY</label>
                      <input required type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500" />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs font-bold text-neutral-500 mb-1">UNIT</label>
                      <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500">
                        <option>Liters</option><option>Gal</option><option>Kg</option><option>Pcs</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">MIN STOCK LEVEL</label>
                    <input required type="number" value={formData.minStockLevel} onChange={(e) => setFormData({...formData, minStockLevel: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">STATUS</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500">
                      <option>In Stock</option>
                      <option>Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-neutral-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/3 py-3.5 rounded-xl border border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50">Cancel</button>
                  <button type="submit" className="w-2/3 py-3.5 rounded-xl text-white font-bold bg-gradient-to-r from-[#FF0080] to-[#FF8C00] shadow-lg">Save Item</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}