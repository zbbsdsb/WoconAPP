import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  TrendingUp, 
  MapPin, 
  Users, 
  ArrowRight,
  Compass,
  Filter,
  Sparkles,
  Loader2,
  Plus
} from 'lucide-react';
import { Trip } from '../types';
import { WoconAPI } from '../services/api';
import { TripCreationWizard } from '../components/trip/TripCreationWizard';

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ name: string, lat: number, lon: number }>>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setIsLoading(true);
    const data = await WoconAPI.getPublicTrips();
    setTrips(data);
    setIsLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length < 3) return;
    const results = await WoconAPI.searchPlaces(searchQuery);
    setSearchResults(results);
  };

  const selectPlace = (place: { name: string, lat: number, lon: number }) => {
    navigate('/map', { state: { center: [place.lat, place.lon], zoom: 12 } });
  };

  const handleCreateTrip = async (data: any) => {
    const tripId = await WoconAPI.createTrip(data);
    if (tripId) {
      setIsWizardOpen(false);
      navigate(`/trips/${tripId}`);
    }
  };

  return (
    <div className="min-h-full pb-20">
      {/* Editorial Hero */}
      <section className="relative pt-32 pb-24 px-8 md:px-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-6 font-mono">
              <span className="w-12 h-[1px] bg-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Global Recruitment Hub</span>
            </div>
            <h1 className="text-7xl md:text-[10rem] font-black text-white leading-[0.8] tracking-tighter mb-12 font-display">
              DISCOVER <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">LEGENDS.</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-12"
          >
            <p className="max-w-md text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
              Find verified companions for high-fidelity expeditions. From Arctic research to Saharan stargazing.
            </p>

            <form onSubmit={handleSearch} className="relative w-full max-w-xl group">
              <div className="flex items-center border-b border-white/10 group-focus-within:border-blue-500 transition-colors">
                <input 
                  type="text" 
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent py-6 px-4 text-2xl font-medium text-white outline-none placeholder:text-slate-700"
                />
                <button className="p-3 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
                  <Search size={24} />
                </button>
              </div>

              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-4 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 divide-y divide-white/5"
                  >
                    {searchResults.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectPlace(result)}
                        className="w-full px-6 py-5 text-left hover:bg-white/5 transition-colors flex items-center group"
                      >
                        <MapPin size={20} className="text-blue-500 mr-4 group-hover:scale-125 transition-transform" />
                        <span className="text-slate-200 font-bold text-lg truncate">{result.name}</span>
                      </button>
                    ))}
                    <button 
                      onClick={() => setSearchResults([])}
                      className="w-full py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                    >
                      Close Results
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Discovery Hub */}
      <section className="p-8 md:p-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <div className="flex items-center text-emerald-400 font-black text-xs uppercase tracking-[0.3em] mb-4">
                <TrendingUp size={16} className="mr-2" />
                Trending Now
              </div>
              <h2 className="text-5xl font-black text-white tracking-tight leading-none italic font-serif">Open Trips</h2>
            </div>
            
            <div className="flex items-center space-x-3">
              {['Aurora', 'Kyoto', 'Sahara', 'Arctic'].map(tag => (
                <button key={tag} className="px-4 py-2 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-all">
                  #{tag}
                </button>
              ))}
              <div className="w-[1px] h-8 bg-white/10 mx-2" />
              <button 
                onClick={loadTrips}
                className="p-3 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors"
              >
                <Filter size={20} />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="animate-spin text-blue-500" size={40} />
              <p className="text-slate-500 font-mono uppercase tracking-widest text-[10px]">Syncing with Spacetime...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
              <Sparkles size={48} className="mx-auto mb-6 text-slate-700" />
              <p className="text-slate-500 text-xl font-serif italic mb-8">No public journeys active. Be the first to lead.</p>
              <button 
                onClick={() => setIsWizardOpen(true)}
                className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95"
              >
                Launch Expedition
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trips.map((trip) => (
                <motion.div 
                  key={trip.id}
                  whileHover={{ y: -12 }}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  className="group relative aspect-[3/4] rounded-[3rem] overflow-hidden cursor-pointer"
                >
                  <img 
                    src={trip.cover_url || `https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=800`} 
                    alt={trip.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  
                  <div className="absolute inset-0 p-10 flex flex-col justify-end">
                    <div className="flex items-center space-x-3 mb-4">
                       <span className="px-3 py-1 rounded-lg bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest leading-none">
                         {trip.status}
                       </span>
                       <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase">
                         {trip.destination}
                       </span>
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tighter mb-4 group-hover:text-blue-400 transition-colors leading-[0.9]">
                      {trip.title}
                    </h3>
                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                      <div className="flex items-center text-white/50 text-[10px] font-black uppercase tracking-widest">
                        <Users size={14} className="mr-2 text-blue-500" />
                        {trip.participants?.length || 0} Joined
                      </div>
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Create Trip FAB */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsWizardOpen(true)}
        className="fixed bottom-10 right-10 bg-blue-600 hover:bg-blue-500 text-white p-6 rounded-full shadow-2xl shadow-blue-600/30 flex items-center space-x-3 z-50 group border border-blue-400/20"
      >
        <Plus size={28} className="group-hover:rotate-90 transition-transform duration-500" />
        <span className="font-black text-[10px] uppercase tracking-widest pr-2">Launch Journey</span>
      </motion.button>

      <TripCreationWizard 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={handleCreateTrip}
      />
    </div>
  );
};
