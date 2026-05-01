import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Map as MapIcon, 
  Compass, 
  Users, 
  Briefcase, 
  Bell, 
  Settings,
  Plus,
  Menu,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { WoconAPI } from '../../services/api';
import { User as FirebaseUser } from 'firebase/auth';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = WoconAPI.onAuth((u) => {
      setUser(u);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await WoconAPI.logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'explore', label: 'Explore', icon: Compass, path: '/' },
    { id: 'map', label: 'Map', icon: MapIcon, path: '/map' },
    { id: 'trips', label: 'My Journeys', icon: Briefcase, path: '/trips' },
    { id: 'connections', label: 'Connections', icon: Users, path: '/connections' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden text-slate-200 font-sans">
      <motion.aside 
        initial={false}
        animate={{ width: isExpanded ? 260 : 88 }}
        className="relative flex flex-col py-8 bg-[#0a0a0a] border-r border-white/5 z-50 px-4"
      >
        <div className="mb-12 flex items-center shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-2xl overflow-hidden">
            <img src="/logo.png" alt="Wocon Logo" className="w-8 h-8 object-contain" />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="ml-4 font-black text-2xl tracking-tight font-display text-white"
              >
                Wocon
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `flex items-center w-full p-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <item.icon size={22} className={`shrink-0 transition-transform group-hover:scale-110 ${isExpanded ? 'mr-4' : 'mx-auto'}`} />
              {isExpanded && (
                <motion.span 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="font-bold text-xs uppercase tracking-[0.2em]"
                >
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-3 pt-8 border-t border-white/5">
          {user ? (
            <div className={`flex flex-col space-y-3 ${!isExpanded && 'items-center'}`}>
              <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center w-full ${!isExpanded && 'justify-center border-none bg-transparent'}`}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-600/20" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center ring-2 ring-blue-600/20">
                    <UserIcon size={18} className="text-slate-500" />
                  </div>
                )}
                {isExpanded && (
                  <div className="ml-3 overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{user.displayName || 'Explorer'}</p>
                    <p className="text-[10px] text-slate-500 truncate font-mono uppercase tracking-wider">Level 1</p>
                  </div>
                )}
              </div>
              <button 
                onClick={handleLogout}
                className={`flex items-center p-4 w-full rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all group ${!isExpanded && 'justify-center'}`}
              >
                <LogOut size={22} className="shrink-0 group-hover:translate-x-1 transition-transform" />
                {isExpanded && <span className="ml-4 font-bold text-xs uppercase tracking-[0.2em]">Logout</span>}
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className={`flex items-center p-4 w-full rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20 transition-all font-bold text-xs uppercase tracking-[0.2em] ${!isExpanded && 'justify-center'}`}
            >
              <UserIcon size={22} className="shrink-0" />
              {isExpanded && <span className="ml-4">Sign In</span>}
            </NavLink>
          )}

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center p-4 w-full rounded-2xl text-slate-600 hover:text-slate-200 transition-colors ${!isExpanded && 'justify-center'}`}
          >
            <Menu size={22} className="shrink-0" />
            {isExpanded && <span className="ml-4 font-bold text-xs uppercase tracking-[0.2em]">Collapse</span>}
          </button>
        </div>
      </motion.aside>

      <main className="relative flex-1 overflow-y-auto overflow-x-hidden bg-[#050505]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e3a8a33,transparent_60%)] pointer-events-none" />
        {children}
      </main>
    </div>
  );
};
