import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, MapPin, Users, Info, Settings, Plus, 
  Clock, Map as MapIcon, ChevronLeft, Share2, 
  CheckCircle2, Compass, ArrowRight, MessageSquare,
  Loader2,
  Lock,
  Globe
} from 'lucide-react';
import { Trip, ItineraryItem } from '../types';
import { WoconAPI } from '../services/api';
import { MapCanvas } from '../components/map/MapCanvas';

type TabType = 'timeline' | 'map' | 'team';

export const TripWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab ] = useState<TabType>('timeline');
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', time: '09:00', location: '' });

  useEffect(() => {
    if (id) loadTrip();
  }, [id]);

  const loadTrip = async () => {
    setIsLoading(true);
    const data = await WoconAPI.getTrip(id!);
    if (data) {
      setTrip(data);
    }
    setIsLoading(false);
  };

  const handleAddItem = async () => {
    if (!newItem.title || !trip) return;
    await WoconAPI.addItineraryItem(trip.id, {
      title: newItem.title,
      time: newItem.time,
      location_name: newItem.location,
      type: 'activity'
    });
    setNewItem({ title: '', time: '09:00', location: '' });
    setIsAddingItem(false);
    loadTrip(); // Refresh
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#050505]">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">Accessing Cryptographic Workspace</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#050505] p-8 text-center">
        <Lock className="text-red-500 mb-6" size={64} />
        <h1 className="text-4xl font-black text-white mb-4 italic font-serif">Journey Redacted</h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">This expedition is either private or does not exist in our current dimension.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#050505] overflow-hidden font-sans">
      {/* Editorial Header */}
      <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl border-b border-white/5 px-8 py-10 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
            <div className="flex items-start space-x-6">
              <Link to="/trips" className="mt-2 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all group">
                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <div>
                <div className="flex items-center space-x-4 mb-2">
                  <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border ${
                    trip.is_public 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {trip.is_public ? <Globe size={10} className="inline mr-1" /> : <Lock size={10} className="inline mr-1" />}
                    {trip.is_public ? 'Public Discovery' : 'Private Expedition'}
                  </span>
                  <div className="h-4 w-px bg-white/10" />
                  <span className="text-blue-500 text-[8px] font-black uppercase tracking-[0.3em]">
                    Workspace Ref: {trip.id.substring(0, 8)}
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none italic font-serif">
                  {trip.title}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
               <button className="flex items-center space-x-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 rounded-[20px] font-black text-[10px] uppercase tracking-widest transition-all">
                  <Share2 size={18} />
                  <span>Secure Share</span>
               </button>
               <button className="flex items-center space-x-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-[20px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all active:scale-95">
                  <Plus size={18} />
                  <span>Add Team</span>
               </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <div className="flex items-center group cursor-pointer hover:text-white transition-colors">
              <MapPin size={16} className="mr-3 text-blue-500 group-hover:scale-125 transition-transform" />
              {trip.destination}
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-3 text-blue-500" />
              {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'TBD'} — {trip.end_date ? new Date(trip.end_date).toLocaleDateString() : 'TBD'}
            </div>
            <div className="flex items-center">
              <Users size={16} className="mr-3 text-blue-500" />
              {trip.participants?.length || 0} Members Verified
            </div>
            <div className="ml-auto flex items-center space-x-1">
              {(['timeline', 'map', 'team'] as TabType[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl transition-all ${
                    activeTab === tab ? 'bg-white/10 text-white' : 'text-slate-600 hover:text-slate-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'timeline' && (
            <motion.div 
              key="timeline"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex p-12 pr-0 space-x-12 overflow-x-auto custom-scrollbar"
            >
              <div className="w-full max-w-4xl shrink-0">
                <div className="flex items-center justify-between mb-16">
                  <h2 className="text-4xl font-black text-white tracking-tight">Timeline</h2>
                  <div className="flex items-center space-x-2">
                    <button className="p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all">
                      <Settings size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-16 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-[2px] before:bg-white/5">
                  {trip.itinerary?.map((item, idx) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative pl-16 group"
                    >
                      <div className="absolute left-[18px] top-4 w-3 h-3 rounded-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)] z-10 group-hover:scale-150 transition-transform" />
                      
                      <div className="glass-card rounded-[40px] p-10 group-hover:bg-white/[0.06] transition-all hover:-translate-y-2">
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-3 block font-mono">
                              {item.time} • MISSION STATUS: ACTIVE
                            </span>
                            <h3 className="text-3xl font-black text-white tracking-tight italic font-serif">{item.title}</h3>
                          </div>
                          <div className="flex space-x-3">
                             <button className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all">
                                <MessageSquare size={20} />
                             </button>
                          </div>
                        </div>
                        <div className="flex items-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                          <MapPin size={14} className="mr-3 text-blue-500" />
                          {item.location_name}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <div className="pl-16">
                    <AnimatePresence mode="wait">
                      {isAddingItem ? (
                        <motion.div 
                          key="form"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="glass-card rounded-[40px] p-10"
                        >
                           <div className="space-y-6">
                             <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Activity Title</label>
                               <input 
                                 autoFocus
                                 className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-blue-500 transition-all font-bold text-lg"
                                 placeholder="e.g. Summit Attempt"
                                 value={newItem.title}
                                 onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                               />
                             </div>
                             <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Start Time</label>
                                 <input 
                                   type="time"
                                   className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-blue-500 transition-all font-mono"
                                   value={newItem.time}
                                   onChange={(e) => setNewItem({...newItem, time: e.target.value})}
                                 />
                               </div>
                               <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Location</label>
                                 <input 
                                   className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-blue-500 transition-all font-bold"
                                   placeholder="Destination name"
                                   value={newItem.location}
                                   onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                                 />
                               </div>
                             </div>
                             <div className="flex space-x-3 pt-4">
                                <button onClick={handleAddItem} className="flex-1 py-5 bg-blue-600 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">Commit Changes</button>
                                <button onClick={() => setIsAddingItem(false)} className="px-8 py-5 bg-white/5 rounded-2xl text-slate-400 font-black text-xs uppercase tracking-widest hover:text-white transition-all">Abort</button>
                             </div>
                           </div>
                        </motion.div>
                      ) : (
                        <motion.button 
                          key="button"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => setIsAddingItem(true)}
                          className="w-full py-16 border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center text-slate-600 hover:text-blue-400 hover:border-blue-500/20 hover:bg-white/[0.02] transition-all group"
                        >
                          <Plus size={32} className="mb-4 group-hover:rotate-90 transition-transform duration-500" />
                          <span className="font-black uppercase text-[10px] tracking-[0.4em]">Draft Next Phase</span>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="w-96 shrink-0 h-full overflow-y-auto pr-12 space-y-8 hidden xl:block">
                <div className="glass-card rounded-[40px] p-8 border-l-4 border-l-emerald-500/50">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 underline decoration-emerald-500 underline-offset-8">Financial Analysis</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Allocation</span>
                      <span className="text-xl font-black text-white">$4,250.00</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Utilized</span>
                        <span className="text-xs font-black text-white">42%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 w-[42%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed text-center">Data represents pooled resources from verified members.</p>
                  </div>
                </div>

                <div className="glass-card rounded-[40px] p-8">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Asset Checklist</h3>
                  <div className="space-y-4">
                     {[ 'Verify Field Equipment', 'Satellite Uplink Test', 'Medical Certifications' ].map((t, i) => (
                       <div key={i} className="flex items-center space-x-4 p-5 bg-white/[0.02] rounded-3xl border border-white/5 group hover:border-blue-500/20 transition-all cursor-pointer">
                          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-colors ${i === 0 ? 'border-blue-600 bg-blue-600' : 'border-white/10 group-hover:border-blue-500/50'}`}>
                            {i === 0 && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                          <span className={`text-[11px] font-bold tracking-tight ${i === 0 ? 'text-slate-200' : 'text-slate-500'}`}>{t}</span>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div 
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full relative"
            >
              <MapCanvas 
                center={trip.coordinates || [20, 0]} 
                zoom={12}
                trips={trip.itinerary?.map(i => ({
                  id: i.id,
                  lat: i.coordinates?.[0] || trip.coordinates?.[0] || 0,
                  lng: i.coordinates?.[1] || trip.coordinates?.[1] || 0,
                  title: i.title,
                  description: i.location_name
                }))}
              />
              <div className="absolute top-10 left-10 z-20 glass-card rounded-[32px] p-8 w-80 shadow-2xl">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6 flex items-center">
                    <Compass size={18} className="mr-3" />
                    Spatial Matrix
                 </h3>
                 <p className="text-[11px] text-slate-400 mb-6 font-medium leading-relaxed italic font-serif">Strategic coordinates plotted on the global coordinate system.</p>
                 <div className="space-y-2">
                    {trip.itinerary?.map((item, idx) => (
                      <button key={item.id} className="w-full text-left p-4 hover:bg-white/5 rounded-2xl flex items-center group transition-all">
                         <div className="w-6 h-6 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mr-4 group-hover:bg-blue-600 transition-all font-mono text-[10px] text-blue-400 group-hover:text-white">0{idx+1}</div>
                         <span className="text-[11px] font-bold text-slate-300 truncate tracking-tight">{item.title}</span>
                      </button>
                    ))}
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div 
              key="team"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="h-full p-12 overflow-y-auto"
            >
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                  <div>
                    <h2 className="text-5xl font-black text-white italic font-serif tracking-tight mb-4">Expedition Manifest</h2>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-xl">Review the tactical team for this mission. Trust is the only currency in high-fidelity expeditions.</p>
                  </div>
                  <div className="px-8 py-5 glass-card rounded-[30px] flex items-center">
                    <Info size={18} className="text-blue-500 mr-3" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{trip.participants?.length || 0} / 12 SLOTS OPERATIONAL</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {trip.participants?.map((person, idx) => (
                    <motion.div 
                      key={person.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass-card rounded-[40px] p-8 flex items-center group hover:bg-white/[0.06] transition-all"
                    >
                      <div className="w-20 h-20 rounded-[30px] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mr-8 shadow-xl shadow-blue-600/10 group-hover:rotate-6 transition-all">
                         <span className="text-3xl font-black text-white italic">{person.username.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="font-black text-white text-xl tracking-tight truncate uppercase leading-none">{person.username}</h3>
                          {idx === 0 && <span className="text-[8px] bg-blue-600/20 text-blue-500 px-3 py-1 rounded-full font-black border border-blue-600/20 uppercase tracking-widest">Captain</span>}
                        </div>
                        <p className="text-slate-500 text-xs truncate font-mono">{person.email}</p>
                      </div>
                      <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-600 hover:text-white transition-all">
                        <Settings size={20} />
                      </button>
                    </motion.div>
                  ))}
                  
                  <button className="border-2 border-dashed border-white/5 rounded-[40px] p-8 flex flex-col items-center justify-center space-y-4 hover:border-blue-500/20 hover:bg-white/[0.02] transition-all text-slate-700 hover:text-blue-500 group min-h-[140px]">
                    <Plus size={32} className="group-hover:rotate-180 transition-transform duration-700" />
                    <span className="font-black uppercase tracking-[0.3em] text-[10px]">Add Specialist</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute right-12 bottom-12 z-50">
        <button className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/30 hover:scale-110 active:scale-95 transition-all text-glow">
           <MessageSquare size={28} />
        </button>
      </div>
    </div>
  );
};
