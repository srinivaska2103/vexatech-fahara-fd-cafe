'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Home, 
  ArrowLeft, 
  Store, 
  Calendar, 
  HelpCircle, 
  Sparkles, 
  Coffee, 
  Heart,
  Smile,
  Zap,
  Flame,
  Search,
  Compass
} from 'lucide-react';

const CARTOON_EXPRESSIONS = [
  { name: 'surprised', eyes: '👀', mouth: '😮', quote: "Oops! I spilled the 404 page!", mood: "Surprised" },
  { name: 'happy', eyes: '😄', mouth: '👅', quote: "Slurp! That was delicious coffee!", mood: "Happy" },
  { name: 'sleepy', eyes: '😴', mouth: '💤', quote: "Zzz... Page taking an espresso nap.", mood: "Sleepy" },
  { name: 'dizzy', eyes: '😵‍💫', mouth: '🌀', quote: "Whoa! You wandered off the map!", mood: "Dizzy" },
  { name: 'loving', eyes: '😍', mouth: '💖', quote: "Sending warm cafe love anyway!", mood: "Loved" },
];

export function CartoonNotFound({ dashboardLink = "/owner/dashboard", portalName = "Venue Partner Portal" }) {
  const router = useRouter();
  const [exprIdx, setExprIdx] = useState(0);
  const [pokeCount, setPokeCount] = useState(0);
  const [floatingParticles, setFloatingParticles] = useState([]);
  const [isSparkling, setIsSparkling] = useState(false);

  const currentExpr = CARTOON_EXPRESSIONS[exprIdx];

  const handlePokeCharacter = () => {
    setExprIdx((prev) => (prev + 1) % CARTOON_EXPRESSIONS.length);
    setPokeCount((prev) => prev + 1);
    setIsSparkling(true);
    setTimeout(() => setIsSparkling(false), 500);

    // Trigger Coffee Confetti Burst
    confetti({
      particleCount: 35,
      spread: 80,
      origin: { y: 0.52 },
      colors: ['#6F4E37', '#DDB892', '#A67B5B', '#FFF8F0', '#2C1810', '#E07A5F']
    });

    // Floating heart/star particle pop
    const id = Date.now();
    const newParticle = { id, x: (Math.random() - 0.5) * 90 };
    setFloatingParticles((prev) => [...prev, newParticle]);
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1300);
  };

  const handlePartyBurst = () => {
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#6F4E37', '#DDB892', '#A67B5B', '#FFF8F0', '#2C1810', '#F4A261', '#E76F51']
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2C1810] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden relative font-sans selection:bg-[#DDB892]/40">
      
      {/* Dynamic Background Lighting & Mesh Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#E6CCB2]/30 via-[#DDB892]/20 to-[#795548]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-12 left-10 w-72 h-72 bg-[#DDB892]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#B08968]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Animated Ambient Icons */}
      <motion.div 
        animate={{ y: [-8, 8, -8], rotate: [-6, 6, -6] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden sm:flex absolute top-16 left-12 sm:left-24 p-3.5 rounded-2xl bg-white/90 shadow-lg shadow-[#6F4E37]/5 border border-[#E6CCB2]/80 backdrop-blur-md text-[#6F4E37] items-center gap-2"
      >
        <Coffee className="w-5 h-5 text-[#795548]" />
        <span className="text-xs font-bold text-[#5C3D2E]">Fresh Brew</span>
      </motion.div>

      <motion.div 
        animate={{ y: [10, -10, 10], rotate: [8, -8, 8] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="hidden sm:flex absolute top-20 right-12 sm:right-24 p-3.5 rounded-2xl bg-white/90 shadow-lg shadow-[#6F4E37]/5 border border-[#E6CCB2]/80 backdrop-blur-md text-[#A67B5B] items-center gap-2"
      >
        <Sparkles className="w-5 h-5 text-amber-500" />
        <span className="text-xs font-bold text-[#5C3D2E]">Oops Moment</span>
      </motion.div>

      <motion.div 
        animate={{ y: [-10, 6, -10], rotate: [-8, 8, -8] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="hidden sm:flex absolute bottom-16 left-16 p-3 rounded-2xl bg-white/90 shadow-lg shadow-[#6F4E37]/5 border border-[#E6CCB2]/80 backdrop-blur-md text-[#6F4E37] items-center gap-2"
      >
        <Compass className="w-5 h-5 text-[#8D5B4C]" />
        <span className="text-xs font-bold text-[#5C3D2E]">Off the Map</span>
      </motion.div>

      {/* Main Glassmorphic Card Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-lg w-full bg-white/90 backdrop-blur-2xl border border-[#E6CCB2]/90 shadow-[0_20px_60px_-15px_rgba(60,35,20,0.12)] rounded-3xl p-6 sm:p-9 text-center flex flex-col items-center"
      >
        
        {/* Animated Speech Bubble */}
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          key={currentExpr.name}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="mb-3 px-4 py-2 bg-gradient-to-r from-[#FFF8F0] via-[#FAF0E6] to-[#FFF8F0] rounded-2xl border border-[#DDB892]/80 shadow-xs text-xs font-extrabold text-[#5C3D2E] flex items-center gap-2 relative"
        >
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
          <span>{currentExpr.quote}</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#DDB892]" />
          <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-[#FFF8F0]" />
        </motion.div>

        {/* Cartoon Character: Interactive Coffee Cup */}
        <div className="relative cursor-pointer group select-none my-1" onClick={handlePokeCharacter}>
          
          {/* Steam Particles */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-2.5 pointer-events-none">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [-2, -26],
                  x: [0, (i % 2 === 0 ? 6 : -6)],
                  opacity: [0, 0.75, 0]
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: 'easeInOut'
                }}
                className="w-2.5 h-7 bg-gradient-to-t from-[#B08968]/50 via-[#DDB892]/30 to-transparent rounded-full blur-[1px]"
              />
            ))}
          </div>

          {/* Floating heart pops on poke */}
          <AnimatePresence>
            {floatingParticles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ opacity: 1, y: 0, scale: 0.8 }}
                animate={{ opacity: 0, y: -75, scale: 1.4 }}
                exit={{ opacity: 0 }}
                style={{ left: `calc(50% + ${particle.x}px)` }}
                className="absolute -top-6 text-[#795548] pointer-events-none z-30 drop-shadow-xs"
              >
                <Heart className="w-6 h-6 fill-[#795548]" />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Cartoon Character SVG Body */}
          <motion.div
            whileHover={{ scale: 1.08, rotate: [0, -4, 4, 0] }}
            whileTap={{ scale: 0.9, rotate: 8 }}
            animate={isSparkling ? { rotate: [0, -8, 8, 0], scale: [1, 1.12, 1] } : {}}
            className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center"
          >
            {/* Soft Ambient Glow */}
            <div className="absolute inset-2 bg-gradient-to-tr from-[#795548]/15 to-[#DDB892]/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />

            {/* SVG Cartoon Character */}
            <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
              {/* Saucer Layer */}
              <ellipse cx="80" cy="138" rx="62" ry="12" fill="#DDB892" opacity="0.85" />
              <ellipse cx="80" cy="135" rx="52" ry="9" fill="#FFFBF7" />

              {/* Handle */}
              <path d="M 122 68 C 148 68 148 108 122 108" fill="none" stroke="#5C3D2E" strokeWidth="12" strokeLinecap="round" />

              {/* Cup Outer & Inner Body */}
              <path d="M 38 52 C 38 122 122 122 122 52 Z" fill="#FFF8F0" stroke="#5C3D2E" strokeWidth="5.5" strokeLinejoin="round" />
              <path d="M 42 54 C 44 116 116 116 118 54 Z" fill="#FFFFFF" />
              
              {/* Coffee Liquid Surface */}
              <ellipse cx="80" cy="52" rx="41" ry="10" fill="#5C3D2E" />
              <ellipse cx="76" cy="51" rx="33" ry="7.5" fill="#422A1D" />
              <ellipse cx="66" cy="50" rx="10" ry="3.5" fill="#A67B5B" opacity="0.75" />

              {/* Coffee Stamp / Icon Badge */}
              <circle cx="80" cy="97" r="11" fill="#5C3D2E" opacity="0.08" />
              <text x="80" y="101" fontSize="12" textAnchor="middle" fill="#5C3D2E">☕</text>

              {/* Animated Eyes & Expression */}
              <text x="64" y="77" fontSize="21" textAnchor="middle" className="select-none">{currentExpr.eyes.slice(0, 2)}</text>
              <text x="96" y="77" fontSize="21" textAnchor="middle" className="select-none">{currentExpr.eyes.slice(2) || currentExpr.eyes.slice(0, 2)}</text>
              <text x="80" y="92" fontSize="16" textAnchor="middle" className="select-none">{currentExpr.mouth}</text>

              {/* Rosy Cheeks */}
              <circle cx="55" cy="82" r="5.5" fill="#E07A5F" opacity="0.5" />
              <circle cx="105" cy="82" r="5.5" fill="#E07A5F" opacity="0.5" />
            </svg>

            {/* Interactive Tap Pill */}
            <motion.div 
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="absolute -bottom-0.5 -right-1 bg-[#5C3D2E] text-white text-[10px] font-black px-2.5 py-1 rounded-full border-2 border-white shadow-md flex items-center gap-1 hover:bg-[#422A1D] transition-colors"
            >
              <Smile className="w-3 h-3 text-amber-300" />
              <span>Tap Bippy!</span>
            </motion.div>
          </motion.div>
        </div>

        {/* 404 Headline Section */}
        <div className="mt-2 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C3D2E]/8 text-[#5C3D2E] font-black text-[11px] tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>404 — Page Not Found</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight leading-tight">
            Lost in the Cafe?
          </h1>

          <p className="text-xs sm:text-sm text-[#6F4E37]/85 max-w-sm mx-auto font-medium leading-relaxed">
            Oops! It seems you've wandered off the map. The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Poke Counter Pill */}
        {pokeCount > 0 && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-3 text-xs font-bold text-[#5C3D2E] bg-[#FFF8F0] px-3.5 py-1.5 rounded-xl border border-[#E6CCB2] shadow-2xs flex items-center gap-1.5"
          >
            <span>🎉 You poked Bippy</span>
            <span className="bg-[#5C3D2E] text-white font-extrabold px-2 py-0.5 rounded-md text-[11px]">{pokeCount}</span>
            <span>times!</span>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
          <Link href={dashboardLink} className="w-full sm:flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 rounded-xl bg-[#5C3D2E] hover:bg-[#422A1D] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#422A1D]"
            >
              <Home className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.back()}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white hover:bg-[#FFF8F0] text-[#5C3D2E] border border-[#E6CCB2] text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </motion.button>
        </div>

        {/* Confetti Trigger Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handlePartyBurst}
            className="text-[11px] font-bold text-[#8D5B4C] hover:text-[#5C3D2E] hover:underline flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Trigger Coffee Party Confetti 🎊</span>
          </button>
        </div>

        {/* Quick Access Navigation Links */}
        <div className="mt-6 pt-5 border-t border-[#E6CCB2]/60 w-full">
          <p className="text-[10px] font-extrabold text-[#795548]/70 uppercase tracking-widest mb-3">
            Quick Navigation Links
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            <Link 
              href="/owner/cafes"
              className="p-3 rounded-xl bg-[#FFFBF7] hover:bg-white border border-[#E6CCB2]/70 hover:border-[#795548] shadow-2xs hover:shadow-xs transition-all flex flex-col items-center gap-1.5 group text-center"
            >
              <Store className="w-4 h-4 text-[#795548] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-[#2C1810]">My Cafes</span>
            </Link>

            <Link 
              href="/owner/bookings"
              className="p-3 rounded-xl bg-[#FFFBF7] hover:bg-white border border-[#E6CCB2]/70 hover:border-[#795548] shadow-2xs hover:shadow-xs transition-all flex flex-col items-center gap-1.5 group text-center"
            >
              <Calendar className="w-4 h-4 text-[#795548] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-[#2C1810]">Bookings</span>
            </Link>

            <Link 
              href="/owner/support"
              className="p-3 rounded-xl bg-[#FFFBF7] hover:bg-white border border-[#E6CCB2]/70 hover:border-[#795548] shadow-2xs hover:shadow-xs transition-all flex flex-col items-center gap-1.5 group text-center"
            >
              <HelpCircle className="w-4 h-4 text-[#795548] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-[#2C1810]">Support</span>
            </Link>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

