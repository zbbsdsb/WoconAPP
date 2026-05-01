import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MessageSquare, 
  MoreHorizontal,
  Compass,
  Zap,
  Globe,
  ArrowUpRight,
  MapPin
} from 'lucide-react';

export const ConnectionsPage: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<'connections' | 'requests' | 'explorer'>('connections');

  const segments = [
    { id: 'connections', label: 'My Node', count: 12 },
    { id: 'requests', label: 'Inbound', count: 3 },
    { id: 'explorer', label: 'Discover', count: null }
  ];

  return (
    <div className="min-h-full p-12 md:p-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <span className="w-12 h-[1px] bg-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Neural Network</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white italic font-serif leading-[0.8] tracking-tighter">
              The <br /> Node.
            </h1>
          </div>

          <div className="flex items-center space-x-12">
             <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Global Reach</p>
                <div className="flex items-center text-xl font-black text-white space-x-2">
                   <Globe size={18} className="text-indigo-500" />
                   <span>1.4k Nodes</span>
                </div>
             </div>
             <button className="w-20 h-20 bg-indigo-600 hover:bg-white hover:text-black text-white rounded-[32px] flex items-center justify-center transition-all shadow-2xl shadow-indigo-600/20 active:scale-95 group">
                <UserPlus size={32} className="group-hover:scale-110 transition-transform duration-500" />
             </button>
          </div>
        </header>

        <div className="flex items-center mb-16 space-x-4 border-b border-white/5 pb-8 overflow-x-auto custom-scrollbar">
          {segments.map(seg => (
            <button
              key={seg.id}
              onClick={() => setActiveSegment(seg.id as any)}
              className={`flex items-center space-x-3 px-8 py-4 rounded-[24px] transition-all font-black text-[10px] uppercase tracking-widest whitespace-nowrap ${
                activeSegment === seg.id 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{seg.label}</span>
              {seg.count && <span className="bg-white/10 px-2 py-0.5 rounded-lg text-[8px]">{seg.count}</span>}
            </button>
          ))}
          <div className="flex-1" />
          <div className="relative w-full max-w-xs group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-indigo-500" />
            <input 
              type="text" 
              placeholder="Search IDs..."
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[
             { name: 'Dr. Aris Thorne', role: 'Geological Specialist', location: 'Oslo, Norway', mutual: 4 },
             { name: 'Kaelen Vance', role: 'Survival Expert', location: 'Denver, US', mutual: 12 },
             { name: 'Suki Min', role: 'Atmospheric Analyst', location: 'Seoul, KR', mutual: 8 },
             { name: 'Marcus Flint', role: 'Logistics Commander', location: 'London, UK', mutual: 2 },
             { name: 'Elara Sol', role: 'Astro-photographer', location: 'Atacama, CL', mutual: 15 },
             { name: 'Janus Gray', role: 'Security Node', location: 'Singapore, SG', mutual: 5 }
           ].map((node, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.05 }}
               className="glass-card rounded-[40px] p-10 hover:bg-white/[0.06] transition-all group"
             >
                <div className="flex items-start justify-between mb-8">
                   <div className="relative">
                      <div className="w-20 h-20 rounded-[28px] bg-gradient-to-tr from-indigo-600 to-emerald-500 p-[2px] shadow-xl shadow-indigo-600/10">
                         <div className="w-full h-full bg-[#0a0a0a] rounded-[26px] flex items-center justify-center font-black text-3xl italic text-white">
                           {node.name.charAt(0)}
                         </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-[3px] border-[#0a0a0a]" />
                   </div>
                   <button className="p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all">
                      <MoreHorizontal size={20} />
                   </button>
                </div>

                <div className="mb-10">
                   <h3 className="text-2xl font-black text-white tracking-tight uppercase mb-1">{node.name}</h3>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-6">{node.role}</p>
                   
                   <div className="flex items-center space-x-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-2 text-indigo-500" />
                        {node.location}
                      </div>
                      <div className="flex items-center">
                        <Zap size={14} className="mr-2 text-amber-500" />
                        {node.mutual} Mutual
                      </div>
                   </div>
                </div>

                <div className="flex space-x-3">
                   <button className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center space-x-2 group">
                      <span>Message</span>
                      <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </button>
                   <button className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all">
                      <Compass size={22} />
                   </button>
                </div>
             </motion.div>
           ))}
        </div>

        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-20">
           <p className="text-[10px] font-mono uppercase tracking-[0.4em]">Protocol Node Network v4.2.1 • Wocon Core</p>
           <button className="text-[10px] font-black uppercase tracking-[0.4em] hover:opacity-100 transition-opacity">Request Global Manifest</button>
        </div>
      </div>
    </div>
  );
};
