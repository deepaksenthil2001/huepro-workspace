import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Calculator, Download, FileSignature } from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Estimates() {
  const [estimates, setEstimates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState(null);
  
  const generateNumber = () => `EST-${Math.floor(1000 + Math.random() * 9000)}`;
  const [formData, setFormData] = useState({ estimateNumber: generateNumber(), clientName: '', projectName: '', estimatedAmount: '', date: new Date().toISOString().split('T')[0], validUntil: '', status: 'Draft', notes: '' });

  const API_URL = 'http://localhost:8082/api/estimates';

  useEffect(() => {
    fetchEstimates();
  }, []);

  const fetchEstimates = async () => {
    try {
      const response = await axios.get(API_URL);
      setEstimates(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching estimates:", error);
      setIsLoading(false);
    }
  };

  const openModal = (estimate = null) => {
    if (estimate) {
      setEditingEstimate(estimate);
      setFormData(estimate);
    } else {
      setEditingEstimate(null);
      setFormData({ estimateNumber: generateNumber(), clientName: '', projectName: '', estimatedAmount: '', date: new Date().toISOString().split('T')[0], validUntil: '', status: 'Draft', notes: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingEstimate) {
        await axios.put(`${API_URL}/${editingEstimate.id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchEstimates();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving estimate:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this estimate?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchEstimates();
      } catch (error) {
        console.error("Error deleting estimate:", error);
      }
    }
  };

  const downloadPDF = (est) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(255, 140, 0); // Orange tint for estimates
    doc.text('HuePro', 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Quotation / Estimate', 14, 30);
    
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('ESTIMATE', 150, 22);
    doc.setFontSize(10);
    doc.text(`# ${est.estimateNumber}`, 150, 30);
    doc.text(`Date: ${est.date}`, 150, 36);
    if(est.validUntil) doc.text(`Valid Until: ${est.validUntil}`, 150, 42);
    
    doc.text('Prepared For:', 14, 50);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(est.clientName, 14, 56);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Project: ${est.projectName}`, 14, 62);
    
    doc.autoTable({
      startY: 75,
      head: [['Description', 'Estimated Amount']],
      body: [
        [`Painting Services & Materials for ${est.projectName}`, `Rs. ${parseFloat(est.estimatedAmount).toFixed(2)}`]
      ],
      foot: [['Total Estimate', `Rs. ${parseFloat(est.estimatedAmount).toFixed(2)}`]],
      theme: 'grid',
      headStyles: { fillColor: [255, 140, 0] }
    });

    if(est.notes) {
      doc.text("Notes/Terms: " + est.notes, 14, doc.autoTable.previous.finalY + 20);
    }
    
    doc.save(`${est.estimateNumber}.pdf`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass p-8 rounded-[2.5rem]">
        <div>
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Quotations & Estimates</h2>
          <p className="text-neutral-500 mt-1.5 font-medium">Generate project estimates for clients before starting work.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => openModal()} className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white shadow-[0_8px_16px_rgba(255,140,0,0.2)] transition-all whitespace-nowrap bg-gradient-to-r from-[#FF8C00] to-[#FF0080]">
            <Calculator className="w-5 h-5" /> New Estimate
          </motion.button>
        </div>
      </div>

      <div className="glass rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200/50">
                <th className="p-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Details</th>
                <th className="p-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Estimated Amount</th>
                <th className="p-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/50">
              {isLoading ? (
                <tr><td colSpan="4" className="p-10 text-center text-neutral-500 font-medium">Loading estimates...</td></tr>
              ) : estimates.map((est) => (
                <motion.tr key={est.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-50/80 rounded-2xl text-orange-600">
                        <FileSignature className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-neutral-900 font-bold text-base">{est.estimateNumber}</h4>
                        <div className="text-xs font-medium text-neutral-500 mt-1">{est.clientName} - {est.projectName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-base font-extrabold text-neutral-900">₹ {est.estimatedAmount}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wide border ${
                      est.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                      est.status === 'Sent' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                      est.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' : 
                      'bg-neutral-50 text-neutral-600 border-neutral-200'
                    }`}>
                      {est.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => downloadPDF(est)} className="p-2.5 bg-white hover:bg-neutral-50 rounded-xl text-neutral-500 hover:text-indigo-600 transition-colors shadow-sm"><Download className="w-4 h-4" /></button>
                      <button onClick={() => openModal(est)} className="p-2.5 bg-white hover:bg-neutral-50 rounded-xl text-neutral-500 hover:text-indigo-600 transition-colors shadow-sm"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(est.id)} className="p-2.5 bg-white hover:bg-red-50 rounded-xl text-neutral-500 hover:text-red-500 transition-colors shadow-sm"><Trash2 className="w-4 h-4" /></button>
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
                <h3 className="text-2xl font-extrabold text-neutral-900">{editingEstimate ? 'Update Estimate' : 'New Estimate'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-neutral-500 mb-1">CLIENT NAME</label>
                    <input required type="text" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-neutral-500 mb-1">PROJECT / SITE NAME</label>
                    <input required type="text" value={formData.projectName} onChange={(e) => setFormData({...formData, projectName: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">ESTIMATED AMOUNT (₹)</label>
                    <input required type="number" value={formData.estimatedAmount} onChange={(e) => setFormData({...formData, estimatedAmount: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">STATUS</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500">
                      <option>Draft</option>
                      <option>Sent</option>
                      <option>Accepted</option>
                      <option>Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">ISSUE DATE</label>
                    <input required type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">VALID UNTIL</label>
                    <input type="date" value={formData.validUntil} onChange={(e) => setFormData({...formData, validUntil: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500" />
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-neutral-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/3 py-3.5 rounded-xl border border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50">Cancel</button>
                  <button type="submit" className="w-2/3 py-3.5 rounded-xl text-white font-bold bg-gradient-to-r from-[#FF8C00] to-[#FF0080] shadow-lg">Save Estimate</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
