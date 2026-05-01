import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  ChevronRight,
  Loader2,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { Trip } from '../types';
import { WoconAPI } from '../services/api';

export const MyTripsPage: React.FC = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMyTrips();
  }, []);

  const loadMyTrips = async () => {
    setIsLoading(true);
    const data = await WoconAPI.getMyTrips();
    setTrips(data);
    setIsLoading(false);
  };

  return (
    <div className="min-h-full p-12 md:p-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <span className="w-12 h-[1px] bg-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Expedition Ledger</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white italic font-serif leading-[0.8] tracking-tighter">
              My <br /> Journeys.
            </h1>
          </div>

          <div className="flex items-center space-x-6">
             <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Status</p>
                <p className="text-xl font-black text-white">Active manifested</p>
             </div>
             <button 
              onClick={() => navigate('/map')}
              className="w-20 h-20 bg-blue-600 hover:bg-white hover:text-black text-white rounded-[32px] flex items-center justify-center transition-all shadow-2xl shadow-blue-600/20 active:scale-95 group"
             >
                <Plus size={32} className="group-hover:rotate-90 transition-transform duration-500" />
             </button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <Loader2 className="animate-spin text-blue-500" size={48} />
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em]">Querying Distributed Ledger</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="py-24 text-center glass-card rounded-[60px] border-dashed">
            <Compass size={64} className="mx-auto mb-8 text-slate-700 animate-pulse" />
            <h2 className="text-3xl font-black text-white mb-4 italic font-serif">No Expeditions Logged.</h2>
            <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium">The journal is blank. It is time to plot your first set of coordinates.</p>
            <button 
              onClick={() => navigate('/map')}
              className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95"
            >
              Start Mission
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trips.map((trip, idx) => (
              <motion.div 
                key={trip.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="group relative aspect-[16/10] glass-card rounded-[50px] p-12 overflow-hidden flex flex-col justify-between cursor-pointer hover:bg-white/[0.06] transition-all"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -mr-32 -mt-32 group-hover:bg-blue-600/10 transition-all duration-1000" />
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live Mission</span>
                  </div>
                  <ArrowUpRight size={24} className="text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>

                <div>
                  <h3 className="text-4xl font-black text-white italic font-serif tracking-tighter mb-4 leading-tight">
                    {trip.title}
                  </h3>
                  <div className="flex items-center text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] space-x-6">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-2 text-blue-500" />
                      {trip.destination}
                    </div>
                    <div className="flex items-center text-slate-400">
                      <Calendar size={14} className="mr-2 text-blue-500" />
                      {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'TBD'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-3">
                       {[1, 2].map(i => (
                         <div key={i} className="w-10 h-10 rounded-2xl bg-slate-900 border-2 border-[#151515] flex items-center justify-center">
                            <Users size={16} className="text-slate-600" />
                         </div>
                       ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                       {trip.participants?.length || 0} Members
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Role: Lead
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-20">
           <p className="text-[10px] font-mono uppercase tracking-[0.4em]">Proprietary Data Manifest © 2026 Wocon</p>
           <div className="flex items-center space-x-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Protocol 4.1</span>
              <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Encrypted Nodes</span>
           </div>
        </div>
      </div>
    </div>
  );
};
