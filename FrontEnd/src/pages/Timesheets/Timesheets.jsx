import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, UserCheck, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';

export default function Timesheets() {
  const [attendance, setAttendance] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  const ATTENDANCE_API_URL = 'http://localhost:8082/api/attendance';
  const WORKER_API_URL = 'http://localhost:8082/api/workers';

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const fetchData = async () => {
    try {
      const [attRes, workRes] = await Promise.all([
        axios.get(ATTENDANCE_API_URL),
        axios.get(WORKER_API_URL)
      ]);
      setAttendance(attRes.data);
      setWorkers(workRes.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const markAttendance = async (worker, status) => {
    // Check if attendance already exists for today
    const existing = attendance.find(a => a.workerId === worker.id && a.date === currentDate);
    try {
      if (existing) {
        await axios.put(`${ATTENDANCE_API_URL}/${existing.id}`, { ...existing, status });
      } else {
        await axios.post(ATTENDANCE_API_URL, { 
          workerId: worker.id, 
          workerName: worker.name, 
          date: currentDate, 
          status, 
          notes: '' 
        });
      }
      fetchData(); // Refresh
    } catch(err) {
      console.error("Error marking attendance", err);
    }
  };

  const getStatus = (workerId) => {
    const record = attendance.find(a => a.workerId === workerId && a.date === currentDate);
    return record ? record.status : 'Unmarked';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass p-8 rounded-[2.5rem]">
        <div>
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Timesheets & Attendance</h2>
          <p className="text-neutral-500 mt-1.5 font-medium">Mark daily attendance for your crew to calculate wages.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto items-center">
          <label className="font-bold text-neutral-600 text-sm">Select Date:</label>
          <input 
            type="date" 
            value={currentDate} 
            onChange={(e) => setCurrentDate(e.target.value)} 
            className="bg-white border border-neutral-200 rounded-xl px-4 py-2 font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm" 
          />
        </div>
      </div>

      <div className="glass rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b border-white/40 bg-white/30">
          <h3 className="font-extrabold text-lg flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-500" /> Attendance for {currentDate}</h3>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200/50">
                <th className="p-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Crew Member</th>
                <th className="p-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Current Status</th>
                <th className="p-4 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right">Mark Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/50">
              {isLoading ? (
                <tr><td colSpan="3" className="p-10 text-center text-neutral-500 font-medium">Loading crew...</td></tr>
              ) : workers.map((worker) => {
                const status = getStatus(worker.id);
                return (
                  <motion.tr key={worker.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden shadow-inner">
                          <img src={worker.avatarUrl || `https://i.pravatar.cc/150?u=${worker.id}`} alt={worker.name} />
                        </div>
                        <div>
                          <h4 className="text-neutral-900 font-bold text-base">{worker.name}</h4>
                          <div className="text-xs font-medium text-neutral-500 mt-0.5">{worker.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wide border ${
                        status === 'Present' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                        status === 'Absent' ? 'bg-red-50 text-red-600 border-red-200' : 
                        status === 'Half Day' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                        'bg-neutral-100 text-neutral-500 border-neutral-200'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-2 bg-white/50 p-1 rounded-xl border border-white/50 shadow-sm">
                        <button onClick={() => markAttendance(worker, 'Present')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${status === 'Present' ? 'bg-emerald-500 text-white shadow-md' : 'text-neutral-500 hover:bg-emerald-50 hover:text-emerald-600'}`}>
                          Present
                        </button>
                        <button onClick={() => markAttendance(worker, 'Half Day')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${status === 'Half Day' ? 'bg-amber-500 text-white shadow-md' : 'text-neutral-500 hover:bg-amber-50 hover:text-amber-600'}`}>
                          Half Day
                        </button>
                        <button onClick={() => markAttendance(worker, 'Absent')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${status === 'Absent' ? 'bg-red-500 text-white shadow-md' : 'text-neutral-500 hover:bg-red-50 hover:text-red-600'}`}>
                          Absent
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
