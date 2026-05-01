import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, MapPin, Calendar, Lock, Globe, 
  ArrowRight, ArrowLeft, Search, Loader2,
  CheckCircle2, Sparkles, Plane
} from 'lucide-react';
import { WoconAPI } from '../../services/api';

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
      const results = await WoconAPI.searchPlaces(query);
      setSearchResults(results);
      setIsSearching(false);
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
    setSearchResults([]);
    setStep(2);
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
        className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6"
      >
        {/* Background Accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-600/10 blur-[160px] rounded-full" />
           <div className="absolute bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-emerald-600/10 blur-[160px] rounded-full" />
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 hover:bg-slate-900 rounded-2xl text-slate-500 hover:text-white transition-all z-20"
        >
          <X size={24} />
        </button>

        {/* Wizard Card */}
        <div className="w-full max-w-2xl relative z-10">
          {/* Progress Bar */}
          <div className="flex justify-center mb-12 space-x-2">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  step >= i ? 'w-12 bg-blue-600' : 'w-4 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                   <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <MapPin size={32} className="text-blue-500" />
                   </div>
                   <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Where are we going?</h2>
                   <p className="text-slate-500 font-medium">Search for a city, country, or specific landmark.</p>
                </div>

                <div className="relative">
                  <div className="flex items-center bg-slate-900/60 border border-white/10 rounded-3xl p-2 shadow-2xl focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                    <div className="flex-1 flex items-center px-4">
                      <Search size={24} className="text-slate-500 mr-4" />
                      <input 
                        autoFocus
                        type="text" 
                        value={formData.destination}
                        onChange={(e) => handleLocationSearch(e.target.value)}
                        placeholder="Search destination..."
                        className="bg-transparent border-none outline-none w-full text-slate-100 text-xl py-4"
                      />
                    </div>
                    {isSearching && <Loader2 className="animate-spin text-blue-500 mr-4" size={24} />}
                  </div>

                  {searchResults.length > 0 && (
                    <div className="absolute top-full mt-4 w-full bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl overflow-y-auto max-h-72">
                      {searchResults.map((res, i) => (
                        <button
                          key={i}
                          onClick={() => selectLocation(res)}
                          className="w-full px-6 py-4 text-left border-b border-white/5 hover:bg-blue-600/10 transition-colors flex items-center"
                        >
                          <MapPin size={18} className="text-blue-500 mr-4 shrink-0" />
                          <span className="text-slate-200 font-medium truncate">{res.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                   <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Sparkles size={32} className="text-blue-500" />
                   </div>
                   <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Tell us more</h2>
                   <p className="text-slate-500 font-medium">Give your journey a name and set the timeframe.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4">Journey Title</label>
                    <input 
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Summer Mediterranean Cruise"
                      className="w-full bg-slate-900/60 border border-white/10 rounded-2xl p-6 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4">Start Date</label>
                      <div className="relative">
                        <Calendar size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" />
                        <input 
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData(f => ({ ...f, startDate: e.target.value }))}
                          className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4">End Date</label>
                      <div className="relative">
                        <Calendar size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" />
                        <input 
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData(f => ({ ...f, endDate: e.target.value }))}
                          className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button onClick={prevStep} className="p-6 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-2xl transition-all">
                    <ArrowLeft size={24} />
                  </button>
                  <button 
                    disabled={!formData.title || !formData.startDate}
                    onClick={nextStep} 
                    className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-2xl font-black text-xl flex items-center justify-center space-x-3 transition-all"
                  >
                    <span>Continue</span>
                    <ArrowRight size={24} />
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
                className="space-y-8"
              >
                <div className="text-center">
                   <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Globe size={32} className="text-blue-500" />
                   </div>
                   <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Privacy Settings</h2>
                   <p className="text-slate-500 font-medium">How should others see your journey?</p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => setFormData(f => ({ ...f, privacy: 'public' }))}
                    className={`w-full p-8 border-2 rounded-[32px] text-left transition-all flex items-center space-x-6 ${
                      formData.privacy === 'public' ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-900/30 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className={`p-4 rounded-2xl ${formData.privacy === 'public' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                      <Globe size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">Public Recruitment</h3>
                      <p className="text-slate-500 text-sm">Visible on Explore page. Anyone can see and request to join.</p>
                    </div>
                    <CheckCircle2 className={`transition-all ${formData.privacy === 'public' ? 'text-blue-500 scale-100' : 'text-slate-800 scale-50 opacity-0'}`} size={24} />
                  </button>

                  <button 
                    onClick={() => setFormData(f => ({ ...f, privacy: 'private' }))}
                    className={`w-full p-8 border-2 rounded-[32px] text-left transition-all flex items-center space-x-6 ${
                      formData.privacy === 'private' ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-900/30 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className={`p-4 rounded-2xl ${formData.privacy === 'private' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                      <Lock size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">Private Collaborative</h3>
                      <p className="text-slate-500 text-sm">Only invited friends can view and edit the itinerary.</p>
                    </div>
                    <CheckCircle2 className={`transition-all ${formData.privacy === 'private' ? 'text-blue-500 scale-100' : 'text-slate-800 scale-50 opacity-0'}`} size={24} />
                  </button>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button onClick={prevStep} className="p-6 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-2xl transition-all">
                    <ArrowLeft size={24} />
                  </button>
                  <button 
                    onClick={() => onComplete(formData)}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xl flex items-center justify-center space-x-4 transition-all shadow-2xl shadow-blue-600/40 active:scale-95"
                  >
                    <Plane size={24} />
                    <span>Create Journey</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
