import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, MoreHorizontal, Calendar, PaintRoller } from 'lucide-react';
import axios from 'axios'; // Import Axios for API calls

export default function Projects() {
  // State for Projects Data
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // States for Modal and Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ name: '', client: '', status: 'Pending', budget: '', progress: 0, date: '' });

  // API Base URL (Spring Boot Backend)
  const API_URL = 'http://localhost:8082/api/projects';

  const premiumGradient = "linear-gradient(135deg, #FF0080 0%, #FF8C00 50%, #40E0D0 100%)";

  // 1. READ: Fetch all projects from Database on component load
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(API_URL);
      setProjects(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setIsLoading(false);
    }
  };

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({ name: '', client: '', status: 'Pending', budget: '', progress: 0, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });
    }
    setIsModalOpen(true);
  };

  // 2. CREATE & UPDATE: Save data to Database
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        // UPDATE Existing Project
        await axios.put(`${API_URL}/${editingProject.id}`, formData);
      } else {
        // CREATE New Project
        await axios.post(API_URL, formData);
      }
      fetchProjects(); // Refresh the table after saving
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project. Please ensure Backend is running.");
    }
  };

  // 3. DELETE: Remove data from Database
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchProjects(); // Refresh the table after deleting
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 relative">
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-[100px] -z-10 pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200/30 rounded-full blur-[100px] -z-10 pointer-events-none mix-blend-multiply" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Active Sites</h2>
          <p className="text-neutral-500 mt-1.5 font-medium">Manage your painting operations and site progress.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search sites..." 
              className="w-full bg-white border border-neutral-200 rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(255, 0, 128, 0.2)" }} whileTap={{ scale: 0.98 }}
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white shadow-lg transition-all whitespace-nowrap"
            style={{ background: premiumGradient }}
          >
            <Plus className="w-5 h-5" /> New Site
          </motion.button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-neutral-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-wider">Project Details</th>
                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-wider">Budget</th>
                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-wider">Status</th>
                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-wider">Progress</th>
                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-neutral-500 font-medium">Loading projects from Database...</td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-neutral-500 font-medium">No projects found. Add a new site!</td>
                </tr>
              ) : (
                projects.map((project) => (
                  <motion.tr key={project.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-neutral-50/80 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 border border-indigo-100/50">
                          <PaintRoller className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-neutral-900 font-bold text-base">{project.name}</h4>
                          <div className="flex items-center gap-2 mt-1 text-xs font-medium text-neutral-500">
                            <span>{project.client}</span>
                            <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {project.date}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-neutral-700 font-semibold">{project.budget}</td>
                    <td className="p-6">
                      <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border ${
                        project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                        project.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                        'bg-amber-50 text-amber-600 border-amber-200'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="p-6 min-w-[200px]">
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-neutral-500">Completion</span>
                        <span className="text-neutral-900">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} 
                          className="h-full rounded-full"
                          style={{ background: premiumGradient }}
                        />
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(project)} className="p-2.5 bg-white hover:bg-neutral-100 rounded-xl text-neutral-500 hover:text-indigo-600 transition-colors border border-neutral-200 shadow-sm">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(project.id)} className="p-2.5 bg-white hover:bg-red-50 rounded-xl text-neutral-500 hover:text-red-500 transition-colors border border-neutral-200 shadow-sm">
                          <Trash2 className="w-4 h-4" />
                        </button>
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
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5" style={{ background: premiumGradient }} />

              <div className="flex justify-between items-center mb-8 mt-2">
                <div>
                  <h3 className="text-2xl font-extrabold text-neutral-900">{editingProject ? 'Update Project' : 'New Painting Site'}</h3>
                  <p className="text-neutral-500 text-sm mt-1 font-medium">Fill in the details to manage this site.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5 ml-1 uppercase tracking-wide">Project Name</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium shadow-sm" placeholder="e.g. Skyline Apartments Exterior" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5 ml-1 uppercase tracking-wide">Client Name</label>
                    <input required type="text" value={formData.client} onChange={(e) => setFormData({...formData, client: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium shadow-sm" placeholder="Client name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5 ml-1 uppercase tracking-wide">Budget (₹)</label>
                    <input required type="text" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium shadow-sm" placeholder="e.g. ₹5,00,000" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5 ml-1 uppercase tracking-wide">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium shadow-sm appearance-none">
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5 ml-1 uppercase tracking-wide">Progress: {formData.progress}%</label>
                    <input type="range" min="0" max="100" value={formData.progress} onChange={(e) => setFormData({...formData, progress: e.target.value})} className="w-full mt-3 accent-indigo-600" />
                  </div>
                </div>

                <div className="flex gap-4 mt-10 pt-6 border-t border-neutral-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/3 py-4 rounded-2xl border border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50 transition-colors">Cancel</button>
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" className="w-2/3 py-4 rounded-2xl text-white font-bold shadow-lg" style={{ background: premiumGradient }}>
                    {editingProject ? 'Save Changes' : 'Create Project'}
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