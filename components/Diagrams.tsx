
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, GitMerge, BarChart2, MousePointer2, Sigma, Shuffle, ArrowRight, Target, Network } from 'lucide-react';

// --- CROSSING VISUALIZATION ---
// Demonstrates ID Switching problem and solution
export const CrossingVisual: React.FC = () => {
    const [mode, setMode] = useState<'greedy' | 'btrack'>('btrack');
    const [key, setKey] = useState(0); // To restart animation

    // Animation variants
    const duration = 4;
    
    return (
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 my-8">
            <div className="flex items-center gap-2 mb-4">
                <Shuffle size={18} className="text-brand-blue" />
                <h3 className="font-serif text-xl text-slate-900">Křížení Trajektorií (Crossing)</h3>
            </div>
            
            <div className="flex gap-4 mb-6">
                <button 
                    onClick={() => { setMode('greedy'); setKey(k => k+1); }}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${mode === 'greedy' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                    Greedy (Nearest)
                </button>
                <button 
                    onClick={() => { setMode('btrack'); setKey(k => k+1); }}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${mode === 'btrack' ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                    btrack (Motion)
                </button>
            </div>

            <div className="relative w-full max-w-md h-48 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                 {/* Grid lines */}
                 <div className="absolute inset-0 grid grid-cols-4 grid-rows-2">
                    {[...Array(8)].map((_, i) => <div key={i} className="border-slate-100 border"></div>)}
                 </div>

                 <div key={key} className="absolute inset-0">
                    {/* Object A (Blue) */}
                    <motion.div
                        className="absolute w-6 h-6 rounded-full bg-brand-blue shadow-lg z-10 flex items-center justify-center text-[10px] text-white font-bold"
                        initial={{ top: '20%', left: '10%' }}
                        animate={{ 
                            top: mode === 'greedy' ? ['20%', '50%', '20%'] : ['20%', '50%', '80%'],
                            left: ['10%', '50%', '90%'],
                            backgroundColor: mode === 'greedy' ? ['#2563EB', '#2563EB', '#F59E0B'] : '#2563EB' // Blue -> Amber if swapped
                        }}
                        transition={{ duration: duration, ease: "linear", times: [0, 0.5, 1] }}
                    >
                        A
                    </motion.div>

                    {/* Object B (Amber) */}
                    <motion.div
                        className="absolute w-6 h-6 rounded-full bg-amber-500 shadow-lg z-10 flex items-center justify-center text-[10px] text-white font-bold"
                        initial={{ top: '80%', left: '10%' }}
                        animate={{ 
                            top: mode === 'greedy' ? ['80%', '50%', '80%'] : ['80%', '50%', '20%'],
                            left: ['10%', '50%', '90%'],
                            backgroundColor: mode === 'greedy' ? ['#F59E0B', '#F59E0B', '#2563EB'] : '#F59E0B' // Amber -> Blue if swapped
                        }}
                        transition={{ duration: duration, ease: "linear", times: [0, 0.5, 1] }}
                    >
                        B
                    </motion.div>
                    
                    {/* Collision Point Marker */}
                    <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-slate-300 rounded-full opacity-50 flex items-center justify-center">
                    </div>
                 </div>
            </div>

            <div className="mt-4 px-4 text-center">
                {mode === 'greedy' ? (
                    <p className="text-sm text-red-600 font-medium">
                        <span className="font-bold">Chyba (ID Swap):</span> V bodě křížení jsou objekty blízko sebe. Algoritmus omylem prohodí jejich identity.
                    </p>
                ) : (
                    <p className="text-sm text-brand-blue font-medium">
                        <span className="font-bold">Správně:</span> Pohybový model predikuje směr. I přes překryv si objekty udrží své trajektorie.
                    </p>
                )}
            </div>
        </div>
    )
}

// --- TRACKING SIMULATION DIAGRAM ---
// Visualizes particles moving and the tracker establishing links
export const TrackingSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [method, setMethod] = useState<'greedy' | 'bayesian'>('bayesian');
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simulation state
    let particles = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      history: [] as {x: number, y: number}[]
    }));

    let frame = 0;
    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      ctx.strokeStyle = '#e2e8f0'; // Slate 200
      ctx.lineWidth = 1;
      ctx.beginPath();
      for(let i=0; i<canvas.width; i+=40) { ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); }
      for(let i=0; i<canvas.height; i+=40) { ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); }
      ctx.stroke();

      // Update particles
      particles.forEach(p => {
        // Random walk / Brownian motion component
        p.vx += (Math.random() - 0.5) * 0.2;
        p.vy += (Math.random() - 0.5) * 0.2;
        
        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;

        // Bounce bounds
        if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if(p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Add to history (limit length)
        if(frame % 5 === 0) {
            p.history.push({x: p.x, y: p.y});
            if(p.history.length > 20) p.history.shift();
        }
      });

      // Draw tracks
      particles.forEach(p => {
        // Draw history line
        if (p.history.length > 1) {
            ctx.beginPath();
            ctx.moveTo(p.history[0].x, p.history[0].y);
            for(let i=1; i<p.history.length; i++) {
                ctx.lineTo(p.history[i].x, p.history[i].y);
            }
            // Style based on method
            if (method === 'bayesian') {
                ctx.strokeStyle = '#2563EB'; // Brand Blue
                ctx.lineWidth = 2;
                ctx.setLineDash([]);
            } else {
                ctx.strokeStyle = '#78716c'; // Slate for greedy
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 4]); // Dashed for uncertain/greedy
            }
            ctx.stroke();
        }

        // Draw particle
        ctx.fillStyle = '#1e293b'; // Slate 800
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Prediction Visual (Kalman)
        if (method === 'bayesian') {
             ctx.strokeStyle = 'rgba(37, 99, 235, 0.5)'; // Brand Blue transparent
             ctx.fillStyle = 'rgba(37, 99, 235, 0.1)';
             ctx.beginPath();
             ctx.arc(p.x + p.vx * 10, p.y + p.vy * 10, 8, 0, Math.PI * 2); // Predicted position
             ctx.stroke();
             ctx.fill();
        }
      });

      frame++;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [method]);

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 my-8">
      <h3 className="font-serif text-xl mb-4 text-slate-800">Simulace Sledování</h3>
      <div className="flex gap-4 mb-4">
        <button 
            onClick={() => setMethod('greedy')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${method === 'greedy' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
            Greedy (Nearest)
        </button>
        <button 
            onClick={() => setMethod('bayesian')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${method === 'bayesian' ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
            Bayesian (Optimized)
        </button>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={300} 
        className="w-full bg-slate-100 rounded-lg border border-slate-200 cursor-crosshair"
      />

      <div className="mt-4 text-sm font-serif italic text-slate-600 text-center px-4">
        {method === 'bayesian' 
            ? "Zobrazen Bayesovský update: Predikce (Prior) je korigována pozorováním pro získání a posteriori odhadu." 
            : "Zobrazena Greedy metoda: Deterministické spojování nejbližších bodů bez pravděpodobnostního modelu."}
      </div>
    </div>
  );
};

// --- GATING VISUALIZATION ---
// Demonstrates Mahalanobis vs Euclidean gating
export const GatingVisual: React.FC = () => {
    const [method, setMethod] = useState<'euclidean' | 'mahalanobis'>('mahalanobis');

    return (
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 my-8">
            <div className="flex items-center gap-2 mb-4">
                <Target size={18} className="text-brand-blue" />
                <h3 className="font-serif text-xl text-slate-900">Adaptivní Gating</h3>
            </div>
            
            <div className="flex gap-4 mb-6">
                <button 
                    onClick={() => setMethod('euclidean')}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${method === 'euclidean' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                    Euclidean (Kruh)
                </button>
                <button 
                    onClick={() => setMethod('mahalanobis')}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${method === 'mahalanobis' ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                    Mahalanobis (Elipsa)
                </button>
            </div>

            <div className="relative w-64 h-64 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center overflow-hidden">
                {/* Grid */}
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

                {/* Predicted Position Center */}
                <div className="w-2 h-2 bg-slate-900 rounded-full z-20 relative">
                     <div className="absolute -top-6 -left-8 text-[10px] whitespace-nowrap text-slate-500 font-mono">Predikce x(t|t-1)</div>
                </div>

                {/* Arrow indicating velocity */}
                <div className="absolute w-16 h-0.5 bg-slate-400 rotate-[-15deg] z-10 origin-left left-1/2 top-1/2">
                    <div className="absolute right-0 top-[-3px] w-2 h-2 border-t-2 border-r-2 border-slate-400 rotate-45"></div>
                </div>

                {/* Gating Regions */}
                <AnimatePresence mode="wait">
                    {method === 'euclidean' && (
                        <motion.div 
                            key="circle"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="absolute w-40 h-40 rounded-full border-2 border-dashed border-slate-400 bg-slate-200/20"
                        />
                    )}
                    {method === 'mahalanobis' && (
                        <motion.div 
                            key="ellipse"
                            initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
                            animate={{ scale: 1, opacity: 1, rotate: -15 }}
                            exit={{ scale: 0.8, opacity: 0, rotate: -15 }}
                            className="absolute w-56 h-24 rounded-[50%] border-2 border-dashed border-brand-blue bg-brand-blue/10"
                        />
                    )}
                </AnimatePresence>

                {/* Detection Points */}
                {/* Point A: Far away in distance, but aligns with motion (accepted by Mahalanobis, rejected by Euclidean sometimes or vice versa depending on scale) */}
                {/* Let's construct a case: Point aligned with motion (ellipse major axis) but far. */}
                <div className="absolute top-[38%] right-[15%] w-3 h-3 bg-green-500 rounded-full border border-white z-20 shadow-sm flex items-center justify-center">
                    <span className="absolute -bottom-4 text-[9px] font-bold text-slate-600">D1</span>
                </div>
                {/* Point B: Close in distance, but orthogonal to motion (accepted by Euclidean, rejected by Mahalanobis) */}
                <div className="absolute bottom-[20%] left-[45%] w-3 h-3 bg-red-500 rounded-full border border-white z-20 shadow-sm flex items-center justify-center">
                    <span className="absolute -bottom-4 text-[9px] font-bold text-slate-600">D2</span>
                </div>
            </div>

            <div className="mt-6 px-4 text-center max-w-sm">
                {method === 'euclidean' ? (
                    <p className="text-xs text-slate-600">
                        Euklidovská metrika ignoruje směr pohybu a nejistotu. Detekce D2 je přijata, přestože je nepravděpodobná (kolmá na pohyb). D1 může být odmítnuta pro vzdálenost.
                    </p>
                ) : (
                    <p className="text-xs text-brand-blue font-bold">
                        Mahalanobisova metrika respektuje kovarianční matici <span className="font-serif font-normal italic">P</span>. D1 je přijata (leží ve směru nejistoty), D2 je odmítnuta (statisticky nepravděpodobná).
                    </p>
                )}
            </div>
        </div>
    )
}

// --- HYPOTHESIS TREE VISUALIZATION ---
// Shows Link, Apoptosis, Mitosis logic
export const HypothesisTree: React.FC = () => {
    return (
        <div className="flex flex-col items-center p-8 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-lg my-8 w-full">
            <div className="flex items-center gap-2 mb-8">
                <Network size={18} className="text-brand-blue" />
                <h3 className="font-serif text-xl text-white">Generátor Hypotéz</h3>
            </div>

            <div className="relative w-full max-w-lg h-64 flex flex-col items-center justify-between">
                
                {/* Root Node (Tracklet End) */}
                <div className="flex flex-col items-center z-10">
                    <div className="w-12 h-12 bg-white text-slate-900 rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-slate-200">
                        T<sub>k</sub>
                    </div>
                    <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Konec Trajektorie</span>
                </div>

                {/* Edges Container */}
                <div className="absolute top-6 left-0 w-full h-full pointer-events-none">
                     <svg className="w-full h-full visible" style={{overflow: 'visible'}}>
                        {/* Left Branch (Link) */}
                        <path d="M 256 24 C 256 100, 100 100, 100 180" fill="none" stroke="#2563EB" strokeWidth="2" strokeDasharray="4 2" />
                        {/* Middle Branch (Apoptosis) */}
                        <path d="M 256 24 C 256 100, 256 100, 256 180" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
                        {/* Right Branch (Mitosis) */}
                        <path d="M 256 24 C 256 100, 412 100, 412 180" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 2" />
                        
                        {/* Cost Labels */}
                        <rect x="160" y="90" width="40" height="20" rx="4" fill="#0f172a" stroke="#1e293b" />
                        <text x="180" y="104" textAnchor="middle" fill="#94a3b8" fontSize="10">Cost L</text>

                        <rect x="236" y="90" width="40" height="20" rx="4" fill="#0f172a" stroke="#1e293b" />
                        <text x="256" y="104" textAnchor="middle" fill="#94a3b8" fontSize="10">Cost A</text>

                        <rect x="312" y="90" width="40" height="20" rx="4" fill="#0f172a" stroke="#1e293b" />
                        <text x="332" y="104" textAnchor="middle" fill="#94a3b8" fontSize="10">Cost M</text>
                     </svg>
                </div>

                {/* Leaf Nodes */}
                <div className="flex justify-between w-full z-10 px-8">
                    {/* Link */}
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold shadow-lg ring-4 ring-brand-blue/20">
                            D<sub>t+1</sub>
                        </div>
                        <span className="text-xs text-brand-blue mt-2 font-bold uppercase">Link</span>
                    </div>

                    {/* Apoptosis */}
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-slate-800 border border-slate-600 text-slate-400 rounded-full flex items-center justify-center font-bold shadow-lg">
                            ∅
                        </div>
                        <span className="text-xs text-red-500 mt-2 font-bold uppercase">Apoptóza</span>
                    </div>

                    {/* Mitosis */}
                    <div className="flex flex-col items-center relative">
                        <div className="flex gap-2">
                             <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">D<sub>a</sub></div>
                             <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">D<sub>b</sub></div>
                        </div>
                        <span className="text-xs text-green-500 mt-2 font-bold uppercase">Mitóza</span>
                    </div>
                </div>
            </div>
            
            <p className="mt-8 text-center text-sm text-slate-400 max-w-md">
                Algoritmus generuje hypotézy pro každé zakončení trackletu. Každá biologická událost (pohyb, smrt, dělení) má přiřazenou cenu (negative log-likelihood).
            </p>
        </div>
    )
}

// --- GAUSSIAN UPDATE VISUALIZATION ---
// Visualizes the 1D Bayesian update step
export const GaussianUpdate: React.FC = () => {
    return (
        <div className="w-full bg-white rounded-xl p-8 shadow-sm border border-slate-200 my-8">
             <h3 className="font-serif text-xl mb-6 text-slate-900 text-center">Bayesovský Update (1D)</h3>
             <div className="relative h-48 w-full flex items-end justify-center overflow-hidden">
                {/* Axes */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-slate-300"></div>
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-slate-100 border-l border-dashed border-slate-300"></div>

                {/* Prior (Prediction) */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    {/* Prior Curve - Wide, Offset Left */}
                    <path 
                        d="M 0 190 Q 100 190, 150 100 Q 200 10, 250 100 Q 300 190, 400 190" 
                        fill="none" 
                        stroke="#94a3b8" 
                        strokeWidth="2"
                        className="opacity-50"
                    />
                    <text x="20%" y="40" className="fill-slate-400 text-xs font-bold uppercase">Prior P(x)</text>

                    {/* Likelihood (Observation) - Narrower, Offset Right */}
                    <path 
                        d="M 200 190 Q 250 190, 300 80 Q 350 -10, 400 80 Q 450 190, 600 190" 
                        fill="none" 
                        stroke="#dc2626" 
                        strokeWidth="2"
                        className="opacity-50"
                    />
                    <text x="75%" y="40" className="fill-red-500 text-xs font-bold uppercase">Likelihood P(z|x)</text>

                    {/* Posterior (Result) - Tallest, Between them */}
                    <path 
                        d="M 150 190 Q 220 190, 260 50 Q 300 -50, 340 50 Q 380 190, 450 190" 
                        fill="rgba(37, 99, 235, 0.1)" 
                        stroke="#2563EB" 
                        strokeWidth="3" 
                    />
                     <text x="48%" y="20" className="fill-brand-blue text-xs font-bold uppercase">Posterior P(x|z)</text>
                </svg>
             </div>
             <div className="mt-6 flex justify-between text-xs text-slate-500 font-serif italic border-t border-slate-100 pt-4">
                 <div>Predikce modelu (s nejistotou)</div>
                 <div>+ Měření</div>
                 <div>= Zpřesněný odhad</div>
             </div>
        </div>
    )
}

// --- PROBABILITY MATRIX DIAGRAM ---
// Visualizes the transition matrix P(State_t | State_t-1)
export const ProbabilityMatrix: React.FC = () => {
  const [highlight, setHighlight] = useState<{r:number, c:number} | null>(null);

  // Simplified transition states
  const states = ['Init', 'Track', 'Lost', 'Divide', 'Merge'];
  
  // Fake probability data (heatmap style)
  const matrix = [
    [0.0, 0.8, 0.1, 0.1, 0.0], // Init -> Track heavily
    [0.0, 0.9, 0.05, 0.04, 0.01], // Track -> Track (persistence)
    [0.0, 0.3, 0.7, 0.0, 0.0], // Lost -> Lost or Recover
    [0.0, 1.0, 0.0, 0.0, 0.0], // Divide -> Starts new tracks
    [0.0, 0.5, 0.5, 0.0, 0.0], // Merge -> ambiguous
  ];

  return (
    <div className="flex flex-col items-center p-8 bg-slate-100 rounded-xl border border-slate-200 my-8">
      <div className="flex items-center gap-2 mb-4">
          <Sigma size={18} className="text-brand-blue"/>
          <h3 className="font-serif text-xl text-slate-900">Matice Přechodu (Priors)</h3>
      </div>
      <p className="text-sm text-slate-600 mb-6 text-center max-w-md">
        Vizualizace apriorních pravděpodobností přechodů P(s<sub>t</sub> | s<sub>t-1</sub>) pro stavový automat hypotéz.
      </p>

      <div className="relative p-4 bg-white rounded shadow-sm border border-slate-200">
        <div className="grid grid-cols-6 gap-1">
            {/* Header Row */}
            <div className="h-8 w-12"></div>
            {states.map((s, i) => (
                <div key={`h-${i}`} className="h-8 w-12 flex items-end justify-center text-[10px] font-bold text-slate-400 uppercase rotate-0">{s}</div>
            ))}

            {/* Matrix Rows */}
            {states.map((rowLabel, r) => (
                <React.Fragment key={`row-${r}`}>
                    <div className="h-12 w-12 flex items-center justify-end pr-2 text-[10px] font-bold text-slate-400 uppercase">{rowLabel}</div>
                    {matrix[r].map((val, c) => (
                        <motion.div
                            key={`${r}-${c}`}
                            onMouseEnter={() => setHighlight({r, c})}
                            onMouseLeave={() => setHighlight(null)}
                            className="h-12 w-12 border border-white relative cursor-pointer group"
                            style={{ backgroundColor: `rgba(37, 99, 235, ${val})` }} // Brand blue base
                        >
                             <div className="absolute inset-0 flex items-center justify-center text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity font-bold text-slate-900">
                                {val.toFixed(2)}
                             </div>
                        </motion.div>
                    ))}
                </React.Fragment>
            ))}
        </div>
      </div>

      <div className="mt-4 h-6 text-sm font-serif italic text-slate-600">
        {highlight 
            ? `P(${states[highlight.c]} | ${states[highlight.r]}) = ${matrix[highlight.r][highlight.c]}` 
            : "Najeďte myší pro zobrazení hodnot."}
      </div>
    </div>
  );
};

// --- BENCHMARK CHART ---
// MOTA Scores comparison
export const BenchmarkChart: React.FC = () => {
    // Data roughly based on general tracking improvements (MOTA scores)
    const metrics = [
        { name: 'Greedy (NN)', score: 0.82 },
        { name: 'Kalman Only', score: 0.89 },
        { name: 'btrack (Bayesian ILP)', score: 0.985 }
    ];

    return (
        <div className="flex flex-col md:flex-row gap-8 items-center p-8 bg-slate-900 text-slate-100 rounded-xl my-8 border border-slate-800 shadow-lg">
            <div className="flex-1 min-w-[240px]">
                <h3 className="font-serif text-xl mb-2 text-brand-blue">Přesnost Sledování (MOTA)</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    Kombinace Bayesovské aktualizace stavů a globální optimalizace hypotéz vede k signifikantní redukci chyb.
                </p>
                <div className="flex gap-2">
                    <span className="px-2 py-1 bg-slate-800 text-[10px] font-bold uppercase rounded text-slate-400">Recall</span>
                    <span className="px-2 py-1 bg-slate-800 text-[10px] font-bold uppercase rounded text-slate-400">Precision</span>
                    <span className="px-2 py-1 bg-brand-blue/20 text-brand-blue text-[10px] font-bold uppercase rounded border border-brand-blue/30">ID Switch ↓</span>
                </div>
            </div>
            
            <div className="flex flex-col gap-4 w-full md:w-80">
                {metrics.map((m, i) => (
                    <div key={m.name} className="relative">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                            <span>{m.name}</span>
                            <span>{(m.score * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-8 bg-slate-800 rounded-sm overflow-hidden border border-slate-700 relative">
                            <motion.div 
                                className={`h-full absolute top-0 left-0 ${i === 2 ? 'bg-brand-blue' : 'bg-slate-600'}`}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${m.score * 100}%` }}
                                transition={{ duration: 1, delay: i * 0.2 }}
                            >
                                {i === 2 && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 animate-pulse"></div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
