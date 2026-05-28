import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, FileText, User, IndianRupee } from 'lucide-react';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from '../../api/invoiceApi';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  
  const generateInvoiceNumber = () => `INV-${Math.floor(1000 + Math.random() * 9000)}`;
  const [formData, setFormData] = useState({ invoiceNumber: generateInvoiceNumber(), client: '', project: '', amount: '', date: new Date().toISOString().split('T')[0], status: 'Unpaid' });

  const premiumGradient = "linear-gradient(135deg, #FF0080 0%, #FF8C00 50%, #40E0D0 100%)";

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await getInvoices();
      setInvoices(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setIsLoading(false);
    }
  };

  const openModal = (invoice = null) => {
    if (invoice) {
      setEditingInvoice(invoice);
      setFormData(invoice);
    } else {
      setEditingInvoice(null);
      setFormData({ invoiceNumber: generateInvoiceNumber(), client: '', project: '', amount: '', date: new Date().toISOString().split('T')[0], status: 'Unpaid' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingInvoice) {
        await updateInvoice(editingInvoice.id, formData);
      } else {
        await createInvoice(formData);
      }
      fetchInvoices();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteInvoice(id);
        fetchInvoices();
      } catch (error) {
        console.error("Error deleting invoice:", error);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <div>
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Billings & Invoices</h2>
          <p className="text-neutral-500 mt-1.5 font-medium">Track client payments and generate invoices.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input type="text" placeholder="Search invoices..." className="w-full bg-neutral-50 border border-neutral-200 rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => openModal()} className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white shadow-lg transition-all whitespace-nowrap" style={{ background: premiumGradient }}>
            <Plus className="w-5 h-5" /> Generate Bill
          </motion.button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-neutral-100 overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-wider">Invoice Details</th>
                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-wider">Amount</th>
                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-wider">Date</th>
                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-wider">Status</th>
                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr><td colSpan="5" className="p-10 text-center text-neutral-500 font-medium">Loading invoices...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-neutral-500 font-medium">No invoices created yet.</td></tr>
              ) : (
                invoices.map((invoice) => (
                  <motion.tr key={invoice.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-neutral-50/80 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-neutral-100 rounded-2xl text-neutral-600 border border-neutral-200">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-neutral-900 font-bold text-base">{invoice.invoiceNumber}</h4>
                          <div className="flex items-center gap-1 mt-1 text-xs font-medium text-neutral-500">
                            <User className="w-3 h-3" /> {invoice.client} <span className="mx-1">•</span> {invoice.project}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-1 text-base font-extrabold text-neutral-900">
                        <IndianRupee className="w-4 h-4 text-neutral-500" />
                        {invoice.amount}
                      </div>
                    </td>
                    <td className="p-6 text-sm font-medium text-neutral-600">{invoice.date}</td>
                    <td className="p-6">
                      <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border ${
                        invoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(invoice)} className="p-2.5 bg-white hover:bg-neutral-100 rounded-xl text-neutral-500 hover:text-indigo-600 transition-colors border border-neutral-200 shadow-sm"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(invoice.id)} className="p-2.5 bg-white hover:bg-red-50 rounded-xl text-neutral-500 hover:text-red-500 transition-colors border border-neutral-200 shadow-sm"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5" style={{ background: premiumGradient }} />
              <div className="flex justify-between items-center mb-8 mt-2">
                <div>
                  <h3 className="text-2xl font-extrabold text-neutral-900">{editingInvoice ? 'Update Invoice' : 'Generate Bill'}</h3>
                  <p className="text-neutral-500 text-sm mt-1 font-medium">{formData.invoiceNumber}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-500 transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5 ml-1 uppercase tracking-wide">Client Name</label>
                    <input required type="text" value={formData.client} onChange={(e) => setFormData({...formData, client: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium" placeholder="e.g. Ramesh" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5 ml-1 uppercase tracking-wide">Project Name</label>
                    <input required type="text" value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium" placeholder="e.g. Skyline Exterior" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5 ml-1 uppercase tracking-wide">Amount (₹)</label>
                    <input required type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium" placeholder="e.g. 50000" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5 ml-1 uppercase tracking-wide">Date</label>
                    <input required type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5 ml-1 uppercase tracking-wide">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium appearance-none">
                      <option>Unpaid</option><option>Paid</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 mt-10 pt-6 border-t border-neutral-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/3 py-4 rounded-2xl border border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50 transition-colors">Cancel</button>
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" className="w-2/3 py-4 rounded-2xl text-white font-bold shadow-lg" style={{ background: premiumGradient }}>
                    {editingInvoice ? 'Save Changes' : 'Generate'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}