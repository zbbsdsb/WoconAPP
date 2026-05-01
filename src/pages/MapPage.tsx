import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Layers, 
  Crosshair, 
  ZoomIn, 
  ZoomOut, 
  ArrowRight,
  TrendingUp,
  X,
  Loader2,
  Users
} from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { MapCanvas } from '../components/map/MapCanvas';
import { WoconAPI } from '../services/api';
import { Trip } from '../types';

export const MapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ name: string, lat: number, lon: number }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapVariant, setMapVariant] = useState<'dark' | 'satellite' | 'street'>('dark');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  
  const [mapState, setMapState] = useState<{ center: [number, number], zoom: number }>({
    center: [20, 0],
    zoom: 3
  });

  useEffect(() => {
    loadAllTrips();
    
    // Handle URL params or state from explore
    const lat = searchParams.get('lat') || location.state?.center?.[0];
    const lon = searchParams.get('lon') || location.state?.center?.[1];
    const zoom = searchParams.get('zoom') || location.state?.zoom;
    
    if (lat && lon) {
      setMapState({ 
        center: [parseFloat(lat.toString()), parseFloat(lon.toString())], 
        zoom: zoom ? parseInt(zoom.toString()) : 12 
      });
    }
  }, [searchParams, location.state]);

  const loadAllTrips = async () => {
    const data = await WoconAPI.getPublicTrips();
    setTrips(data);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length < 3) return;
    setIsSearching(true);
    const results = await WoconAPI.searchPlaces(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const selectPlace = (place: { lat: number, lon: number, name: string }) => {
    setMapState({ center: [place.lat, place.lon], zoom: 12 });
    setSearchResults([]);
    setSearchQuery('');
  };

  const toggleLayer = () => {
    const sequence: Array<'dark' | 'satellite' | 'street'> = ['dark', 'satellite', 'street'];
    const nextIndex = (sequence.indexOf(mapVariant) + 1) % sequence.length;
    setMapVariant(sequence[nextIndex]);
  };

  return (
    <div className="relative h-full w-full bg-[#050505] overflow-hidden">
      {/* Search Header Overlay */}
      <div className="absolute top-8 left-8 z-30 w-full max-w-sm">
        <form onSubmit={handleSearch} className="relative">
          <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-[24px] p-2 flex items-center shadow-2xl ring-1 ring-white/5">
            <Search size={18} className="text-slate-500 ml-4 mr-3" />
            <input 
              type="text" 
              placeholder="Search spacetime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-white text-sm py-2 placeholder:text-slate-600 font-medium"
            />
            {isSearching && <Loader2 className="animate-spin text-blue-500 mr-2" size={18} />}
          </div>

          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-full mt-3 w-full bg-[#0a0a0a] backdrop-blur-3xl border border-white/10 rounded-[24px] overflow-hidden shadow-2xl z-50 divide-y divide-white/5"
              >
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectPlace(result)}
                    className="w-full px-6 py-4 text-left hover:bg-white/5 transition-colors flex items-start group"
                  >
                    <MapPin size={16} className="text-blue-500 mt-0.5 mr-4 shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-xs text-slate-300 font-medium leading-relaxed">{result.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Main Map Canvas */}
      <MapCanvas 
        center={mapState.center}
        zoom={mapState.zoom}
        variant={mapVariant}
        onMarkerClick={(id) => {
          const trip = trips.find(t => t.id === id);
          if (trip) setSelectedTrip(trip);
        }}
        trips={trips.map(t => ({
          id: t.id,
          lat: t.coordinates?.[0] || 0,
          lng: t.coordinates?.[1] || 0,
          title: t.title,
          description: t.description
        }))}
      />

      {/* Map Tools Overlay */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col space-y-3">
        {[
          { icon: Crosshair, id: 'locate', action: () => setMapState({ center: [20, 0], zoom: 3 }) },
          { icon: Layers, id: 'layers', action: toggleLayer, active: mapVariant !== 'dark' },
          { icon: ZoomIn, id: 'zoomin', action: () => setMapState(s => ({ ...s, zoom: Math.min(s.zoom + 1, 18) })) },
          { icon: ZoomOut, id: 'zoomout', action: () => setMapState(s => ({ ...s, zoom: Math.max(s.zoom - 1, 3) })) }
        ].map(tool => (
          <button 
            key={tool.id}
            onClick={tool.action}
            className={`w-14 h-14 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
              tool.active ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-[#0a0a0a]/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <tool.icon size={22} />
          </button>
        ))}
      </div>

      {/* Selected Trip Details Overlay */}
      <AnimatePresence>
        {selectedTrip && (
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="absolute bottom-8 left-8 z-30 w-[420px]"
          >
            <div className="bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/10 rounded-[40px] overflow-hidden shadow-2xl relative">
              <button 
                onClick={() => setSelectedTrip(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-black/40 text-slate-400 hover:text-white transition-colors z-10"
              >
                <X size={18} />
              </button>

              <div className="h-48 relative">
                <img 
                  src={selectedTrip.cover_url || "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=800"} 
                  className="w-full h-full object-cover"
                  alt={selectedTrip.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
              </div>

              <div className="p-10 -mt-8 relative">
                <div className="flex items-center text-blue-500 font-black text-[10px] uppercase tracking-widest mb-4">
                  <TrendingUp size={14} className="mr-2" />
                  Trip Identified
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter mb-4 leading-none">{selectedTrip.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-2">{selectedTrip.description}</p>
                
                <div className="flex items-center justify-between pt-8 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#0a0a0a] flex items-center justify-center">
                          <Users size={12} className="text-slate-500" />
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {selectedTrip.participants?.length || 0} Joined
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/trips/${selectedTrip.id}`)}
                    className="flex items-center space-x-2 group"
                  >
                    <span className="text-blue-500 font-black text-[10px] uppercase tracking-widest group-hover:mr-2 transition-all">Join Journey</span>
                    <ArrowRight size={18} className="text-blue-500" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
