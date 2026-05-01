import React from 'react';
import { motion } from 'motion/react';
import { Chrome, ArrowRight, ShieldCheck, Sparkles, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WoconAPI } from '../services/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await WoconAPI.loginWithGoogle();
      navigate('/');
    } catch (e) {
      console.error('Login failed', e);
    }
  };

  return (
    <div className="relative h-full w-full bg-[#050505] flex flex-col md:flex-row overflow-hidden">
      {/* Editorial Left Side */}
      <div className="relative flex-1 p-16 md:p-24 flex flex-col justify-between z-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-2xl overflow-hidden">
            <img src="/logo.png" alt="Wocon Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="font-black text-2xl tracking-tight text-white uppercase font-display">Wocon</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center space-x-3 mb-8">
            <span className="w-12 h-[1px] bg-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Secure Authentication</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter mb-10 font-display">
            A NEW <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-emerald-400 to-indigo-500">DIMENSION</span> <br />
            OF TRAVEL.
          </h1>
          <p className="max-w-md text-slate-500 text-lg md:text-xl font-medium leading-relaxed italic font-serif underline decoration-white/10 underline-offset-8">
            Verified expeditions for the discerning explorer. Join the global manifest.
          </p>
        </motion.div>

        <div className="flex items-center space-x-12 opacity-30">
           <div className="flex items-center space-x-2">
             <Globe size={16} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Global Nodes</span>
           </div>
           <div className="flex items-center space-x-2">
             <ShieldCheck size={16} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">End-to-End Encryption</span>
           </div>
        </div>
      </div>

      {/* Login Right Side */}
      <div className="relative w-full md:w-[600px] bg-[#0a0a0a] border-l border-white/5 p-16 md:p-24 flex flex-col justify-center z-10">
        <div className="max-w-sm mx-auto w-full">
           <div className="mb-16">
              <h2 className="text-4xl font-black text-white tracking-tight mb-4">Initialize Session</h2>
              <p className="text-slate-500 font-medium">Please authenticate your cryptographic profile to proceed to the workspace.</p>
           </div>

           <div className="space-y-6">
              <button 
                onClick={handleLogin}
                className="w-full flex items-center justify-between p-6 bg-white hover:bg-blue-600 hover:text-white text-black rounded-[32px] font-black transition-all group shadow-2xl shadow-white/5 active:scale-95"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Chrome size={20} />
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.2em]">Continue with Google</span>
                </div>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="py-8 flex items-center space-x-4 opacity-10">
                 <div className="flex-1 h-px bg-white" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Wocon Encryption</span>
                 <div className="flex-1 h-px bg-white" />
              </div>

              <div className="space-y-4">
                 <div className="relative group">
                    <label className="absolute -top-3 left-6 flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-slate-500 group-focus-within:text-blue-500 transition-colors">
                      <Sparkles size={10} />
                      <span>Direct Access</span>
                    </label>
                    <input 
                      type="email" 
                      placeholder="Access Token or Email"
                      className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-[32px] text-white outline-none focus:border-blue-500 transition-all font-mono text-sm"
                    />
                 </div>
                 <button className="w-full py-6 bg-white/5 text-slate-500 hover:text-white rounded-[32px] font-black text-[11px] uppercase tracking-[0.2em] transition-all border border-white/5 hover:border-white/10">
                   Request Access
                 </button>
              </div>
           </div>

           <p className="mt-20 text-[10px] text-slate-600 font-medium leading-relaxed font-mono uppercase tracking-widest">
             [SYSTEM NOTICE] Authentication is strictly regulated by Wocon's 256-bit security protocols.
           </p>
        </div>
      </div>

      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full -mr-96 -mt-96 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full -ml-40 -mb-40" />
    </div>
  );
};
