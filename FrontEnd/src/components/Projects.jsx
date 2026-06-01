import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, MoreHorizontal, Calendar, PaintRoller, GripVertical, IndianRupee } from 'lucide-react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// FIX 1: Added user prop
export default function Projects({ user }) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ name: '', client: '', status: 'Pending', budget: '', progress: 0, date: '', description: '', priority: 'Medium' });

  const API_URL = 'http://localhost:8082/api/projects';

  // FIX 2: Added user dependency
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      // FIX 3: Fetch only this user's projects
      const response = await axios.get(`${API_URL}/contractor/${user.id}`);
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
      setFormData({ name: '', client: '', status: 'Pending', budget: '', progress: 0, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), description: '', priority: 'Medium' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // FIX 4: Attach contractorId to the data being saved
      const payload = { ...formData, contractorId: user.id };

      if (editingProject) {
        await axios.put(`${API_URL}/${editingProject.id}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      fetchProjects();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project. Ensure Backend is running.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const draggedProject = projects.find(p => p.id.toString() === draggableId);
      const newStatus = destination.droppableId;
      
      setProjects(prev => prev.map(p => p.id.toString() === draggableId ? { ...p, status: newStatus } : p));

      try {
        // FIX 5: Ensure contractorId is maintained during drag & drop update
        const payload = { ...draggedProject, status: newStatus, contractorId: user.id };
        await axios.put(`${API_URL}/${draggableId}`, payload);
      } catch (error) {
        console.error("Failed to update status", error);
        fetchProjects(); 
      }
    }
  };

  const columns = {
    'Pending': { title: 'To Do (Pending)', color: 'bg-amber-500/10 text-amber-700 border-amber-200' },
    'In Progress': { title: 'In Progress', color: 'bg-blue-500/10 text-blue-700 border-blue-200' },
    'Completed': { title: 'Completed', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200' }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 relative h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass p-6 rounded-[2rem]">
        <div>
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Active Sites</h2>
          <p className="text-neutral-500 mt-1 font-medium">Drag and drop projects to update their status.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all whitespace-nowrap bg-gradient-to-r from-[#FF0080] to-[#FF8C00]"
        >
          <Plus className="w-5 h-5" /> New Site
        </motion.button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center h-64 glass rounded-[2rem]">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[500px]">
            {Object.entries(columns).map(([status, config]) => (
              <div key={status} className="glass rounded-[2rem] p-5 flex flex-col h-full bg-white/40">
                <div className={`px-4 py-2 rounded-xl border font-bold text-sm mb-4 inline-block w-max ${config.color}`}>
                  {config.title} <span className="ml-2 opacity-50">{projects.filter(p => p.status === status).length}</span>
                </div>
                
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                      className={`flex-1 space-y-4 rounded-xl transition-colors ${snapshot.isDraggingOver ? 'bg-indigo-50/50' : ''}`}
                    >
                      {projects.filter(p => p.status === status).map((project, index) => (
                        <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 transition-all ${snapshot.isDragging ? 'shadow-xl scale-105 rotate-2' : 'hover:shadow-md'}`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex gap-2 items-center">
                                  <div {...provided.dragHandleProps} className="text-neutral-300 hover:text-neutral-500 cursor-grab">
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                  <h4 className="font-extrabold text-neutral-900">{project.name}</h4>
                                </div>
                                <div className="flex gap-1">
                                  <button onClick={() => openModal(project)} className="p-1.5 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                  <button onClick={() => handleDelete(project.id)} className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              </div>
                              
                              <p className="text-sm font-medium text-neutral-500 mb-4">{project.client}</p>
                              
                              <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-md">
                                  <IndianRupee className="w-3.5 h-3.5" /> {project.budget}
                                </div>
                                <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                                  {project.progress}% Done
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 w-full max-w-xl shadow-2xl relative border border-white">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-extrabold text-neutral-900">{editingProject ? 'Update Site Details' : 'Create New Site'}</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-neutral-500 mb-1">PROJECT NAME</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">CLIENT NAME</label>
                    <input required type="text" value={formData.client} onChange={(e) => setFormData({...formData, client: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">BUDGET</label>
                    <input required type="text" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">STATUS</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none">
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">PRIORITY</label>
                    <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none">
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-neutral-500 mb-1">PROGRESS: {formData.progress}%</label>
                    <input type="range" min="0" max="100" value={formData.progress} onChange={(e) => setFormData({...formData, progress: e.target.value})} className="w-full mt-2 accent-indigo-600" />
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-neutral-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/3 py-3.5 rounded-xl border border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50">Cancel</button>
                  <button type="submit" className="w-2/3 py-3.5 rounded-xl text-white font-bold bg-gradient-to-r from-[#FF0080] to-[#FF8C00] shadow-lg">Save Project</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}