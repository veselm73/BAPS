
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { HeroScene, GraphNetworkScene } from './components/QuantumScene';
import { TrackingSimulation, ProbabilityMatrix, BenchmarkChart, GaussianUpdate, CrossingVisual, GatingVisual, HypothesisTree } from './components/Diagrams';
import { ArrowDown, Menu, X, BookOpen, Sigma, GitMerge, Target, Network } from 'lucide-react';

const AuthorCard = ({ name, role, institute, delay }: { name: string, role: string, institute: string, delay: string }) => {
  return (
    <div className="flex flex-col group animate-fade-in-up items-center p-8 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-xs hover:border-brand-blue/50" style={{ animationDelay: delay }}>
      <h3 className="font-serif text-2xl text-slate-900 text-center mb-3">{name}</h3>
      <div className="w-12 h-0.5 bg-brand-blue mb-4 opacity-60"></div>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest text-center leading-relaxed">{role}</p>
      <p className="text-xs text-slate-400 font-serif italic text-center mt-2">{institute}</p>
    </div>
  );
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-brand-blue selection:text-white">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-50/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white font-serif font-bold text-xl shadow-sm pb-1">β</div>
            <span className={`font-serif font-bold text-lg tracking-wide transition-opacity ${scrolled ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
              btrack <span className="font-normal text-slate-500">lib</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-slate-600">
            <a href="#theory" onClick={scrollToSection('theory')} className="hover:text-brand-blue transition-colors cursor-pointer uppercase">Teorie</a>
            <a href="#methodology" onClick={scrollToSection('methodology')} className="hover:text-brand-blue transition-colors cursor-pointer uppercase">Metodika</a>
            <a href="#bayesian" onClick={scrollToSection('bayesian')} className="hover:text-brand-blue transition-colors cursor-pointer uppercase">Bayes</a>
            <a href="#hypotheses" onClick={scrollToSection('hypotheses')} className="hover:text-brand-blue transition-colors cursor-pointer uppercase">Hypotézy</a>
            <a href="#optimization" onClick={scrollToSection('optimization')} className="hover:text-brand-blue transition-colors cursor-pointer uppercase">Optimalizace</a>
            <a href="#team" onClick={scrollToSection('team')} className="hover:text-brand-blue transition-colors cursor-pointer uppercase">Tým</a>
            <a 
              href="https://github.com/quantumjot/btrack" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-5 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              GitHub
            </a>
          </div>

          <button className="md:hidden text-slate-900 p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-50 flex flex-col items-center justify-center gap-8 text-xl font-serif animate-fade-in">
            <a href="#theory" onClick={scrollToSection('theory')} className="hover:text-brand-blue transition-colors cursor-pointer uppercase">Teorie</a>
            <a href="#methodology" onClick={scrollToSection('methodology')} className="hover:text-brand-blue transition-colors cursor-pointer uppercase">Metodika</a>
            <a href="#bayesian" onClick={scrollToSection('bayesian')} className="hover:text-brand-blue transition-colors cursor-pointer uppercase">Bayes</a>
            <a href="#hypotheses" onClick={scrollToSection('hypotheses')} className="hover:text-brand-blue transition-colors cursor-pointer uppercase">Hypotézy</a>
            <a href="#optimization" onClick={scrollToSection('optimization')} className="hover:text-brand-blue transition-colors cursor-pointer uppercase">Optimalizace</a>
            <a 
              href="https://github.com/quantumjot/btrack" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setMenuOpen(false)} 
              className="px-6 py-3 bg-slate-900 text-white rounded-full shadow-lg cursor-pointer"
            >
              Zdrojový kód
            </a>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <HeroScene />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(248,250,252,0.92)_0%,rgba(248,250,252,0.6)_50%,rgba(248,250,252,0.3)_100%)]" />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-block mb-4 px-3 py-1 border border-brand-blue text-brand-blue text-xs tracking-[0.2em] uppercase font-bold rounded-full backdrop-blur-sm bg-white/30">
            Bayesian Tracking Library
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl font-medium leading-tight md:leading-[0.9] mb-8 text-slate-900 drop-shadow-sm">
            btrack <br/><span className="italic font-normal text-slate-600 text-3xl md:text-5xl block mt-4">Multi-Objektové Sledování</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-700 font-light leading-relaxed mb-12">
            Pokročilá Python knihovna pro rekonstrukci trajektorií v komplexních biologických systémech pomocí Bayesovské inference a globální optimalizace.
          </p>
          
          <div className="flex justify-center">
             <a href="#theory" onClick={scrollToSection('theory')} className="group flex flex-col items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
                <span>OBJEVTE TEORII</span>
                <span className="p-2 border border-slate-300 rounded-full group-hover:border-slate-900 transition-colors bg-white/50">
                    <ArrowDown size={16} />
                </span>
             </a>
          </div>
        </div>
      </header>

      <main>
        {/* Introduction / Theory */}
        <section id="theory" className="py-24 bg-white">
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4">
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-slate-500 uppercase">Teorie</div>
              <h2 className="font-serif text-4xl mb-6 leading-tight text-slate-900">Deterministický vs. Pravděpodobnostní Přístup</h2>
              <div className="w-16 h-1 bg-brand-blue mb-6"></div>
            </div>
            <div className="md:col-span-8 text-lg text-slate-600 leading-relaxed space-y-6">
              <p>
                <span className="text-5xl float-left mr-3 mt-[-8px] font-serif text-brand-blue">S</span>ledování objektů (Multi-Object Tracking) v mikroskopických datech naráží na šum, okluze a dělení buněk. Zatímco klasické "greedy" algoritmy spojují detekce pouze na základě nejbližšího souseda, <strong>btrack</strong> využívá globální optimalizaci v čase.
              </p>
              <p>
                Jádrem knihovny je konstrukce orientovaného acyklického grafu (DAG) hypotéz. Každá možná trajektorie je ohodnocena věrohodnostní funkcí (likelihood). Úloha sledování je převedena na hledání podgrafu s maximální věrohodností, což zaručuje matematicky optimální řešení v rámci definovaného časového okna.
              </p>
            </div>
          </div>
        </section>

        {/* Methodology: Kalman & State Space */}
        <section id="methodology" className="py-24 bg-white border-t border-slate-100">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-slate-200">
                            <BookOpen size={14}/> STAVOVÝ PROSTOR
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl mb-6 text-slate-900">Kalmanův Filtr a Pohybové Modely</h2>
                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                           Každý objekt je reprezentován stavovým vektorem <span className="font-bold">x</span><sub>t</sub> a kovarianční maticí <span className="font-bold">P</span><sub>t</sub>. Knihovna využívá Kalmanův filtr pro rekurzivní Bayesovskou predikci (Prior) a update (Posterior):
                        </p>

                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 font-mono text-sm text-slate-700 space-y-3 mb-6 overflow-x-auto shadow-inner">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                            <span className="text-brand-blue font-bold opacity-70 text-xs tracking-wider">PREDIKCE</span>
                            <span><span className="font-bold">x</span><sub>t|t-1</sub> = <span className="font-bold">F</span><span className="font-bold">x</span><sub>t-1|t-1</sub> + <span className="font-bold">B</span><span className="font-bold">u</span><sub>t</sub> + <span className="font-bold">w</span><sub>t</sub></span>
                          </div>
                          <div className="w-full h-px bg-slate-200"></div>
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                            <span className="text-red-500 font-bold opacity-70 text-xs tracking-wider">UPDATE</span>
                            <span><span className="font-bold">x</span><sub>t|t</sub> = <span className="font-bold">x</span><sub>t|t-1</sub> + <span className="font-bold">K</span><sub>t</sub>(<span className="font-bold">z</span><sub>t</sub> - <span className="font-bold">H</span><span className="font-bold">x</span><sub>t|t-1</sub>)</span>
                          </div>
                        </div>

                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                           Vektor <span className="font-bold text-slate-800">x</span> obvykle obsahuje [x, y, z, v<sub>x</sub>, v<sub>y</sub>, v<sub>z</sub>]. Matice <span className="font-bold text-slate-800">K</span> (Kalman Gain) dynamicky váží důvěru mezi predikcí modelu (ovlivněnou procesním šumem <span className="font-bold">Q</span>) a novým měřením (ovlivněným šumem senzoru <span className="font-bold">R</span>).
                        </p>
                    </div>
                    <div>
                        <TrackingSimulation />
                    </div>
                </div>
            </div>
        </section>

        {/* Adaptive Gating */}
        <section id="gating" className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5">
                         <GatingVisual />
                    </div>
                    <div className="lg:col-span-7">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 text-slate-600 text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-slate-300">
                            <Target size={14}/> Probabilistic Search
                        </div>
                        <h2 className="font-serif text-4xl mb-6 text-slate-900">Adaptivní Gating</h2>
                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            Při hledání kandidátů pro propojení trajektorie nestačí hledat jen v kruhovém okolí (Euklidovská vzdálenost). Kalmanův filtr nám poskytuje odhad nejistoty predikce ve formě kovarianční matice.
                        </p>
                        <h3 className="font-serif text-xl text-slate-800 mb-3">Mahalanobisova Vzdálenost</h3>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            btrack využívá Mahalanobisovu metriku, která měří vzdálenost bodu od distribuce. Definuje eliptickou oblast hledání, která se natahuje ve směru největší nejistoty (např. ve směru pohybu).
                        </p>
                        <div className="bg-white p-4 rounded border border-slate-200 font-mono text-slate-700 text-sm mb-6 inline-block">
                             d<sub>M</sub>(x, y) = √[ (x-y)<sup>T</sup> S<sup>-1</sup> (x-y) ]
                        </div>
                        <p className="text-sm text-slate-500">
                            Kde <strong>S</strong> je matice kovariance inovace (Innovation Covariance). To umožňuje algoritmu "důvěřovat" detekcím, které jsou fyzicky dále, ale leží na očekávané trajektorii.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* ID Swaps / Crossing Trajectories */}
        <section id="id-swaps" className="py-24 bg-white border-t border-slate-200">
            <div className="container mx-auto px-6">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 order-2 lg:order-1">
                         <CrossingVisual />
                    </div>
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-amber-200">
                            <GitMerge size={14}/> Robustnost
                        </div>
                        <h2 className="font-serif text-4xl mb-6 text-slate-900">Řešení Konfliktů: ID Swaps</h2>
                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            Jedním z nejtěžších problémů při sledování hustých populací je <strong>křížení trajektorií</strong>. Když se dva objekty dostanou do těsné blízkosti (např. &lt; 5px), euklidovská metrika selhává.
                        </p>
                        <h3 className="font-serif text-xl text-slate-800 mb-3">Jak to btrack eliminuje?</h3>
                        <ul className="space-y-4 text-slate-600">
                            <li className="flex items-start gap-3">
                                <span className="mt-1 w-2 h-2 rounded-full bg-brand-blue flex-shrink-0"></span>
                                <p><span className="font-bold text-slate-900">Pohybová setrvačnost:</span> Stavový vektor v Kalmanově filtru uchovává hybnost. Predikovaná pozice (Prior) v dalším kroku respektuje vektor rychlosti, nikoliv jen aktuální polohu.</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 w-2 h-2 rounded-full bg-brand-blue flex-shrink-0"></span>
                                <p><span className="font-bold text-slate-900">Globální optimalizace:</span> ILP solver nehledí jen na aktuální krok ("greedy"), ale na celou historii.</p>
                            </li>
                        </ul>
                    </div>
                 </div>
            </div>
        </section>

        {/* Deep Dive: Bayesian Inference */}
        <section id="bayesian" className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
               <div className="lg:col-span-5">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-brand-blue/20">
                      <Sigma size={14}/> Matematické Jádro
                   </div>
                   <h2 className="font-serif text-4xl mb-6 text-slate-900">Bayesovská Inference</h2>
                   <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                     btrack propojuje dvě úrovně Bayesovské statistiky: <strong>Lokální</strong> (Kalmanův filtr pro rekurzivní update stavu jednotlivých objektů) a <strong>Globální</strong> (výběr hypotéz pro celý systém trajektorií).
                   </p>
                   
                   <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm mb-8 text-center">
                      <div className="font-serif text-2xl md:text-3xl text-slate-800 tracking-wide mb-2">
                        P(ω|X) ∝ P(X|ω) · P(ω)
                      </div>
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Bayesova Věta</div>
                   </div>

                   <ul className="space-y-4">
                     <li className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-serif font-bold text-slate-600">1</span>
                        <div>
                          <h4 className="font-bold text-slate-900">Prior P(ω)</h4>
                          <p className="text-sm text-slate-600">Apriorní znalosti o biologii a dynamice. Např. buňky nemizí náhodně (nízká pravděpodobnost apoptózy bez předchozích znaků) a pohyb je plynulý (Kalman motion model).</p>
                        </div>
                     </li>
                     <li className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center font-serif font-bold text-red-600">2</span>
                        <div>
                          <h4 className="font-bold text-slate-900">Likelihood P(X|ω)</h4>
                          <p className="text-sm text-slate-600">Věrohodnost dat. Měří se pomocí "innovation error" {'$\\tilde{y}$'} z Kalmanova filtru (rozdíl predikce a měření). Distribuční funkce je obvykle Gaussovská: {'$\\mathcal{N}(\\tilde{y}; 0, S)$'}.</p>
                        </div>
                     </li>
                     <li className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center font-serif font-bold text-brand-blue">3</span>
                        <div>
                          <h4 className="font-bold text-slate-900">Posterior P(ω|X)</h4>
                          <p className="text-sm text-slate-600">Cílová funkce optimalizace. Hledáme sadu trajektorií {'$\\omega$'}, která maximalizuje součin likelihoodů všech pozorování a priorů všech přechodů.</p>
                        </div>
                     </li>
                   </ul>
               </div>
               
               <div className="lg:col-span-7 flex flex-col gap-8">
                  <GaussianUpdate />
                  <div className="p-8 bg-white rounded-xl shadow-sm border border-slate-200">
                     <h3 className="font-serif text-xl mb-4 text-slate-900">Maximalizace Věrohodnosti</h3>
                     <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                        Globální log-likelihood funkce $L$, kterou maximalizuje ILP solver, je sumou logaritmů pravděpodobností vybraných hypotéz:
                     </p>
                     <div className="font-mono text-sm bg-slate-50 p-4 rounded border border-slate-200 text-slate-700 mb-4 overflow-x-auto">
                        {'L(T) = ∑ [ log P(z_t | x_t) + log P(x_t | x_{t-1}) ]'}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Hypothesis Construction */}
        <section id="hypotheses" className="py-24 bg-slate-900 text-slate-100">
             <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <HypothesisTree />
                    </div>
                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 text-brand-blue text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-slate-700">
                            <Network size={14}/> Graph Theory
                        </div>
                        <h2 className="font-serif text-4xl mb-6 text-white">Konstrukce Hypotéz</h2>
                        <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                            Místo jednoduchého spojování bodů btrack vytváří <strong>tracklety</strong> (krátké spolehlivé úseky) a následně je spojuje do globálního grafu. Pro každý konec trackletu uvažuje solver několik scénářů:
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
                                <span className="font-bold text-brand-blue uppercase text-xs w-16">Link</span>
                                <span className="text-slate-300 text-sm">Pokračování v pohybu (standardní hrana).</span>
                            </li>
                            <li className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
                                <span className="font-bold text-red-500 uppercase text-xs w-16">Apoptóza</span>
                                <span className="text-slate-300 text-sm">Zánik buňky. Penalizován, pokud chybí biologické markery smrti.</span>
                            </li>
                             <li className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
                                <span className="font-bold text-green-500 uppercase text-xs w-16">Mitóza</span>
                                <span className="text-slate-300 text-sm">Rozdělení na dvě dceřiné buňky. Vyžaduje splnění podmínek (např. zachování objemu).</span>
                            </li>
                        </ul>
                    </div>
                </div>
             </div>
        </section>

        {/* Optimization: ILP Solver */}
        <section id="optimization" className="py-24 bg-white border-t border-slate-200">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                     <div className="order-2 lg:order-1">
                        <ProbabilityMatrix />
                     </div>
                     <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-slate-200">
                            GLOBÁLNÍ OPTIMALIZACE
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl mb-6 text-slate-900">Integer Linear Programming (ILP)</h2>
                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            Finální sestavení trajektorií je formulováno jako problém celočíselného lineárního programování (ILP). Cílem je maximalizovat celkovou věrohodnost systému:
                        </p>
                        <div className="font-mono text-sm bg-slate-900 p-6 rounded-lg border border-slate-800 text-brand-blue mb-6 shadow-xl">
                            Maximize <span className="italic">L</span> = ∑<sub>h ∈ H</sub> w<sub>h</sub> x<sub>h</sub> <br/>
                            subject to flow constraints.
                        </div>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Kde x<sub>h</sub> je binární proměnná indikující výběr hypotézy h a w<sub>h</sub> je log-likelihood této hypotézy. Solver (např. GLPK nebo Gurobi) najde globálně optimální konfiguraci trajektorií, která respektuje biologická omezení (např. buňka se nedělí na 3 dceřiné).
                        </p>
                     </div>
                </div>
            </div>
        </section>

        {/* Performance Results */}
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h2 className="font-serif text-4xl md:text-5xl mb-6 text-slate-900">Benchmark Výkonnosti</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        btrack dosahuje v testech sledování buněk (Cell Tracking Challenge) excelentních výsledků, zejména v minimalizaci chyb typu "identity switch". Díky efektivní implementaci v C++ s Python wrapperem zpracuje miliony objektů v řádu minut.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto">
                    <BenchmarkChart />
                </div>
            </div>
        </section>

        {/* Impact / Application */}
        <section className="py-24 bg-white border-t border-slate-200">
             <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-5 relative">
                    <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200 shadow-inner">
                        <GraphNetworkScene />
                        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-400 font-serif italic">Vizualizace optimalizačního grafu</div>
                    </div>
                </div>
                <div className="md:col-span-7 flex flex-col justify-center">
                    <div className="inline-block mb-3 text-xs font-bold tracking-widest text-slate-500 uppercase">APLIKACE</div>
                    <h2 className="font-serif text-4xl mb-6 text-slate-900">Od Mikroskopie po Robotiku</h2>
                    <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                        Ačkoliv byl btrack vyvinut primárně pro sledování buněčných populací v <i>time-lapse</i> mikroskopii, jeho matematický základ je univerzální. Lze jej aplikovat na jakýkoliv problém sledování více agentů, kde je k dispozici model pohybu a detekce jsou zatíženy šumem.
                    </p>
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg border-l-4 border-l-brand-blue">
                        <p className="font-serif italic text-xl text-slate-800 mb-4">
                            "Robustní sledování buněčných linií v rozsáhlých experimentech vyžaduje globální časoprostorovou optimalizaci, kterou greedy algoritmy nemohou poskytnout."
                        </p>
                        <span className="text-sm font-bold text-slate-500 tracking-wider uppercase">— U.L.M. (2020)</span>
                    </div>
                </div>
             </div>
        </section>

        {/* Authors */}
        <section id="team" className="py-24 bg-slate-100 border-t border-slate-300">
           <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-block mb-3 text-xs font-bold tracking-widest text-slate-500 uppercase">VÝVOJÁŘI A VĚDCI</div>
                    <h2 className="font-serif text-3xl md:text-5xl mb-4 text-slate-900">Klíčoví Přispěvatelé</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">Software vyvíjený v laboratoři Alana R. Lowe na UCL a The Alan Turing Institute.</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 justify-center items-center flex-wrap">
                    <AuthorCard 
                        name="Alan R. Lowe" 
                        role="Lead Developer / PI" 
                        institute="University College London"
                        delay="0s" 
                    />
                    <AuthorCard 
                        name="Guillaume Jacquemet" 
                        role="Collaborator" 
                        institute="Åbo Akademi University"
                        delay="0.1s" 
                    />
                     <AuthorCard 
                        name="Benjamin Gallusser" 
                        role="Contributor" 
                        institute="EPFL"
                        delay="0.2s" 
                    />
                </div>
                <div className="text-center mt-12">
                    <p className="text-slate-500 italic">Open source projekt pod licencí MIT.</p>
                </div>
           </div>
        </section>

      </main>

      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
                <div className="text-white font-serif font-bold text-2xl mb-2">btrack</div>
                <p className="text-sm">Bayesian Tracking Library for Python</p>
            </div>
            <div className="text-xs text-slate-600">
                 Publikováno v Nature Communications (2020).
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
