import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, MapPin, Calendar, Lock, Globe, 
  ArrowRight, ArrowLeft, Search, Loader2,
  CheckCircle2, Sparkles, Plane,
  Maximize2
} from 'lucide-react';
import { WoconAPI } from '../../services/api';
import { MapCanvas } from '../map/MapCanvas';

interface LocationResult {
  name: string;
  lat: number;
  lon: number;
}

interface WizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}

export const TripCreationWizard: React.FC<WizardProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(3);
  
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    coordinates: null as [number, number] | null,
    startDate: '',
    endDate: '',
    privacy: 'public' as 'public' | 'private'
  });

  const handleLocationSearch = async (query: string) => {
    setFormData(prev => ({ ...prev, destination: query }));
    if (query.length >= 3) {
      setIsSearching(true);
      try {
        const results = await WoconAPI.searchPlaces(query);
        setSearchResults(results);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const selectLocation = (loc: LocationResult) => {
    setFormData(prev => ({ 
      ...prev, 
      destination: loc.name.split(',')[0], 
      coordinates: [loc.lat, loc.lon] 
    }));
    setMapCenter([loc.lat, loc.lon]);
    setMapZoom(12);
    setSearchResults([]);
  };

  const handleMapClick = (latlng: { lat: number, lng: number }) => {
    setFormData(prev => ({
      ...prev,
      coordinates: [latlng.lat, latlng.lng],
      destination: prev.destination || `Coordinates: ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`
    }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#050505] flex flex-col font-sans"
      >
        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between z-50">
          <div className="flex items-center space-x-6">
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-2xl overflow-hidden">
                <img src="/logo.png" alt="Wocon Logo" className="w-8 h-8 object-contain" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-1">New Expedition</p>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-blue-600' : 'w-2 bg-white/10'}`} />
                  ))}
                </div>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="w-14 h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row h-full">
           {/* Editor Panel */}
           <div className="w-full md:w-[600px] border-r border-white/5 bg-[#0a0a0a] p-12 md:p-24 flex flex-col justify-center relative overflow-y-auto pt-32">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-12"
                  >
                    <div>
                      <h2 className="text-6xl font-black text-white italic font-serif leading-none tracking-tighter mb-6">Phase 01: <br />Coordinates.</h2>
                      <p className="text-slate-500 text-lg font-medium leading-relaxed italic border-l border-blue-600 pl-6">Specify the global coordinates for this mission. Select via search or direct map injection.</p>
                    </div>

                    <div className="space-y-8">
                       <div className="relative group">
                          <label className="absolute -top-3 left-6 px-2 bg-[#0a0a0a] text-[10px] font-black uppercase tracking-widest text-slate-500 group-focus-within:text-blue-500 transition-colors z-10">Destination Node</label>
                          <div className="flex items-center bg-white/[0.02] border border-white/10 rounded-[32px] p-2 focus-within:border-blue-500 transition-all">
                             <Search size={22} className="text-slate-600 ml-5 mr-3" />
                             <input 
                               autoFocus
                               type="text" 
                               placeholder="Search global directory..."
                               value={formData.destination}
                               onChange={(e) => handleLocationSearch(e.target.value)}
                               className="bg-transparent border-none outline-none flex-1 text-white text-xl py-6 placeholder:text-slate-700 font-bold"
                             />
                             {isSearching && <Loader2 className="animate-spin text-blue-500 mr-4" size={24} />}
                          </div>

                          <AnimatePresence>
                            {searchResults.length > 0 && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 right-0 mt-4 bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl z-50 divide-y divide-white/5"
                              >
                                {searchResults.map((res, i) => (
                                  <button
                                    key={i}
                                    onClick={() => selectLocation(res)}
                                    className="w-full px-8 py-5 text-left hover:bg-white/5 transition-colors flex items-center group"
                                  >
                                    <MapPin size={18} className="text-blue-500 mr-4 group-hover:scale-125 transition-transform" />
                                    <span className="text-slate-300 font-bold truncate">{res.name}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                       </div>

                       <div className="p-8 border border-dashed border-white/10 rounded-[40px] bg-white/[0.01]">
                          <div className="flex items-center space-x-4 mb-4 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                             <Maximize2 size={16} />
                             <span>Spatial Data Lock</span>
                          </div>
                          {formData.coordinates ? (
                            <div className="space-y-2">
                               <p className="text-3xl font-black text-white italic font-serif tracking-tight truncate">{formData.destination}</p>
                               <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest leading-none">LAT: {formData.coordinates[0].toFixed(4)} • LON: {formData.coordinates[1].toFixed(4)}</p>
                            </div>
                          ) : (
                            <p className="text-slate-600 font-bold italic">Awaiting coordinate injection from viewport...</p>
                          )}
                       </div>
                    </div>

                    <button 
                      onClick={nextStep}
                      disabled={!formData.coordinates}
                      className="w-full p-8 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-[40px] hover:bg-blue-600 hover:text-white transition-all shadow-2xl shadow-blue-600/10 active:scale-95 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black flex items-center justify-between group"
                    >
                      <span>Proceed to Manifest</span>
                      <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-12"
                  >
                    <div>
                         <h2 className="text-6xl font-black text-white italic font-serif leading-none tracking-tighter mb-6">Phase 02: <br />Manifest.</h2>
                         <p className="text-slate-500 text-lg font-medium leading-relaxed italic border-l border-blue-600 pl-6">Initialize the mission identifiers and temporal constraints.</p>
                    </div>

                    <div className="space-y-8">
                       <div className="relative group">
                          <label className="absolute -top-3 left-6 px-2 bg-[#0a0a0a] text-[10px] font-black uppercase tracking-widest text-slate-500 z-10">Mission Title</label>
                          <input 
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
                            placeholder="e.g. Expedition Arctic"
                            className="w-full bg-white/[0.02] border border-white/10 rounded-[32px] p-8 text-white outline-none focus:border-blue-500 transition-all font-black text-2xl placeholder:text-slate-700"
                          />
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="relative group">
                            <label className="absolute -top-3 left-6 px-2 bg-[#0a0a0a] text-[10px] font-black uppercase tracking-widest text-slate-500 z-10">Temporal Start</label>
                            <div className="flex items-center bg-white/[0.02] border border-white/10 rounded-[32px] p-6 focus-within:border-blue-500 transition-all">
                               <Calendar size={18} className="text-blue-500 mr-4" />
                               <input 
                                 type="date"
                                 value={formData.startDate}
                                 onChange={(e) => setFormData(f => ({ ...f, startDate: e.target.value }))}
                                 className="bg-transparent border-none outline-none flex-1 text-white font-bold"
                               />
                            </div>
                          </div>
                          <div className="relative group">
                            <label className="absolute -top-3 left-6 px-2 bg-[#0a0a0a] text-[10px] font-black uppercase tracking-widest text-slate-500 z-10">Temporal End</label>
                            <div className="flex items-center bg-white/[0.02] border border-white/10 rounded-[32px] p-6 focus-within:border-blue-500 transition-all">
                               <Calendar size={18} className="text-blue-500 mr-4" />
                               <input 
                                 type="date"
                                 value={formData.endDate}
                                 onChange={(e) => setFormData(f => ({ ...f, endDate: e.target.value }))}
                                 className="bg-transparent border-none outline-none flex-1 text-white font-bold"
                               />
                            </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex space-x-4">
                       <button onClick={prevStep} className="w-20 h-20 bg-white/5 hover:bg-white/10 text-slate-400 rounded-[32px] flex items-center justify-center transition-all">
                          <ArrowLeft size={24} />
                       </button>
                       <button 
                        onClick={nextStep}
                        disabled={!formData.title || !formData.startDate}
                        className="flex-1 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-[40px] hover:bg-blue-600 hover:text-white transition-all shadow-2xl shadow-blue-600/10 active:scale-95 disabled:opacity-30 flex items-center justify-between px-10 group"
                       >
                          <span>Validation Protocol</span>
                          <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                       </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-12"
                  >
                    <div>
                         <h2 className="text-6xl font-black text-white italic font-serif leading-none tracking-tighter mb-6">Phase 03: <br />Security.</h2>
                         <p className="text-slate-500 text-lg font-medium leading-relaxed italic border-l border-emerald-500 pl-6">Finalize the cryptographic visibility and mission launch protocol.</p>
                    </div>

                    <div className="space-y-4">
                        <button 
                          onClick={() => setFormData(f => ({ ...f, privacy: 'public' }))}
                          className={`w-full p-8 border-2 rounded-[40px] text-left transition-all flex items-center group relative overflow-hidden ${
                            formData.privacy === 'public' ? 'bg-blue-600/10 border-blue-500' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-8 transition-colors ${formData.privacy === 'public' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500'}`}>
                             <Globe size={28} />
                          </div>
                          <div>
                             <h4 className="font-black text-white text-xl uppercase tracking-tighter leading-none mb-1">Global Discovery</h4>
                             <p className="text-slate-500 text-xs font-bold font-mono">MANIFEST: ENCRYPTED • VISIBILITY: OPEN</p>
                          </div>
                          <CheckCircle2 className={`ml-auto transition-all ${formData.privacy === 'public' ? 'text-blue-500 scale-100' : 'scale-0 opacity-0'}`} />
                        </button>

                        <button 
                          onClick={() => setFormData(f => ({ ...f, privacy: 'private' }))}
                          className={`w-full p-8 border-2 rounded-[40px] text-left transition-all flex items-center group relative overflow-hidden ${
                            formData.privacy === 'private' ? 'bg-blue-600/10 border-blue-500' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-8 transition-colors ${formData.privacy === 'private' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500'}`}>
                             <Lock size={28} />
                          </div>
                          <div>
                             <h4 className="font-black text-white text-xl uppercase tracking-tighter leading-none mb-1">Private Node</h4>
                             <p className="text-slate-500 text-xs font-bold font-mono">MANIFEST: LOCKED • VISIBILITY: STEALTH</p>
                          </div>
                          <CheckCircle2 className={`ml-auto transition-all ${formData.privacy === 'private' ? 'text-blue-500 scale-100' : 'scale-0 opacity-0'}`} />
                        </button>
                    </div>

                    <div className="flex space-x-4">
                       <button onClick={prevStep} className="w-20 h-20 bg-white/5 hover:bg-white/10 text-slate-400 rounded-[32px] flex items-center justify-center transition-all">
                          <ArrowLeft size={24} />
                       </button>
                       <button 
                        onClick={() => {
                          onComplete({
                            title: formData.title,
                            destination: formData.destination,
                            coordinates: formData.coordinates,
                            start_date: formData.startDate,
                            end_date: formData.endDate,
                            is_public: formData.privacy === 'public'
                          });
                        }}
                        className="flex-1 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[40px] hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/40 active:scale-95 flex items-center justify-between px-10 group"
                       >
                          <span>Initialize Launch</span>
                          <Plane size={24} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           {/* Viewport Side (Map) */}
           <div className="flex-1 relative bg-[#050505] hidden md:block overflow-hidden">
              <MapCanvas 
                center={mapCenter}
                zoom={mapZoom}
                variant="dark"
                onMapClick={handleMapClick}
                trips={formData.coordinates ? [{
                  id: 'preview',
                  lat: formData.coordinates[0],
                  lng: formData.coordinates[1],
                  title: formData.title || 'Mission Preview',
                  description: formData.destination
                }] : []}
              />
              
              <div className="absolute inset-0 pointer-events-none border-l border-white/5" />
           </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
