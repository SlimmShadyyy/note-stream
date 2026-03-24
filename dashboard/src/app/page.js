"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-indigo-500/30 relative overflow-hidden">


      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      <nav className="max-w-6xl mx-auto px-6 py-10 flex justify-between items-center relative z-10 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-white rounded-sm flex items-center justify-center">
            <div className="w-3 h-3 bg-black transform rotate-45"></div>
          </div>
          <span className="font-bold tracking-[0.2em] text-white text-sm uppercase">Note Stream</span>
        </div>
        <a href="https://github.com/your-username/note-stream" target="_blank" className="text-[10px] font-bold tracking-widest bg-white/5 text-white px-6 py-2.5 rounded-sm hover:bg-white hover:text-black border border-white/10 transition-all uppercase">
          Source Code & Docs
        </a>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-32 pb-40 relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-7xl md:text-[120px] font-extrabold tracking-tighter mb-10 leading-[0.8] text-white">
            Architected for <br />
            <span className="text-slate-600">Deep Learning.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl leading-relaxed font-light italic">
            "Transforming passive video consumption into structured, stateful knowledge."
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-40 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          <div className="md:col-span-8 p-12 bg-white/[0.01] border border-white/5 rounded-3xl group hover:bg-white/[0.03] hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/10 transition-all"></div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-indigo-400 uppercase mb-6">Native DOM Interaction</h3>
            <h4 className="text-3xl font-bold text-white mb-6 tracking-tight">Synchronized Playback Engine</h4>
            <p className="text-slate-500 leading-relaxed max-w-xl">
              Engineered with a context-aware playback controller. The extension logic hooks into the YouTube HTML5 player to auto-pause on input focus and auto-resume on blur, eliminating manual control overhead.
            </p>
          </div>

          <div className="md:col-span-4 p-12 bg-white/[0.01] border border-white/5 rounded-3xl group hover:border-white/20 transition-all duration-500">
            <h3 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-6">Interface Layer</h3>
            <h4 className="text-2xl font-bold text-white mb-6 tracking-tight">Zero-Context Switching</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Query Gemini 1.5 Flash directly within the active viewport. The AI agent utilizes the video metadata to provide hyper-relevant technical clarifications without breaking the study flow.
            </p>
          </div>

          <div className="md:col-span-4 p-12 bg-white/[0.01] border border-white/5 rounded-3xl group hover:border-white/20 transition-all duration-500">
            <h3 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-6">Data Persistence</h3>
            <h4 className="text-2xl font-bold text-white mb-6 tracking-tight">Selective Cloud Sync</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Notes are only persisted to MongoDB when the user explicitly engages the extension. Implementation includes debounced auto-save triggers to ensure data integrity across browser refreshes.
            </p>
          </div>

          <div className="md:col-span-8 p-12 bg-white/[0.01] border border-white/5 rounded-3xl group hover:bg-white/[0.03] hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-all"></div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-indigo-400 uppercase mb-6">Cognitive Mastery</h3>
            <h4 className="text-3xl font-bold text-white mb-6 tracking-tight">Adaptive Gap Analysis</h4>
            <p className="text-slate-500 leading-relaxed max-w-xl">
              Post-assessment logic identifies specific conceptual weaknesses. The AI then regenerates and appends specialized content to your notes, specifically targeting identified unmastered domains.
            </p>
          </div>


          <div className="md:col-span-12 p-12 bg-white/[0.02] border border-white/10 rounded-3xl flex flex-col md:flex-row justify-between items-center group hover:bg-white/[0.04] transition-all">
            <div className="max-w-xl">
              <h3 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-4">Output Engine</h3>
              <h4 className="text-3xl font-bold text-white mb-4 tracking-tight">High-Fidelity PDF Generation</h4>
              <p className="text-slate-500 leading-relaxed">
                Utilizes a clean Markdown-to-PDF rendering engine. Exported documents are formatted for professional use, ensuring your digital notes translate perfectly to standardized physical documentation.
              </p>
            </div>
            <div className="mt-8 md:mt-0 px-10 py-5 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] rounded-full">
              Standardized Output Enabled
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-48 border-t border-white/5 relative z-10">
        <div className="absolute inset-0 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <p className="text-[50px] font-bold tracking-[0.5em] text-slate-500 uppercase mb-24 text-center">
          Engineered With
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center relative z-10">

           <div className="flex justify-center items-center h-40 bg-white/[0.03] border border-white/10 rounded-[2rem] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500 group shadow-2xl">
             <img src="/tech/nextjs.png" alt="Next.js" className="h-16 md:h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
           </div>
           <div className="flex justify-center items-center h-40 bg-white/[0.03] border border-white/10 rounded-[2rem] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500 group shadow-2xl">
             <img src="/tech/nodejs.png" alt="Node.js" className="h-20 md:h-24 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(131,205,41,0.2)]" />
           </div>
           <div className="flex justify-center items-center h-40 bg-white/[0.03] border border-white/10 rounded-[2rem] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500 group shadow-2xl">
             <img src="/tech/mongodb.png" alt="MongoDB" className="h-16 md:h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(71,162,72,0.2)]" />
           </div>

           <div className="flex justify-center items-center h-40 bg-white/[0.03] border border-white/10 rounded-[2rem] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500 group shadow-2xl">
             <img src="/tech/google-ai.png" alt="Gemini AI" className="h-12 md:h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(100,150,255,0.2)]" />
           </div>
           <div className="flex justify-center items-center h-40 bg-white/[0.03] border border-white/10 rounded-[2rem] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500 group shadow-2xl">
             <img src="/tech/tailwind.png" alt="Tailwind" className="h-10 md:h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(56,189,248,0.2)]" />
           </div>
        </div>

        <div className="mt-20 flex justify-center relative z-10">
          <div className="px-10 py-4 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-md">
            <p className="text-[11px] font-bold tracking-[0.4em] text-white uppercase">
              Core Stack <span className="mx-4 text-slate-700">|</span> <span className="text-indigo-400">Chrome Extension API</span>
            </p>
          </div>
        </div>
      </section>
      <footer className="max-w-6xl mx-auto px-6 py-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
        <div className="flex items-center gap-3 grayscale opacity-50">
           <div className="w-5 h-5 bg-white rounded-sm transform rotate-45"></div>
           <p className="text-[12px] font-black tracking-[0.5em] text-white uppercase">Note Stream</p>
        </div>
        
        <p className="text-[11px] font-medium tracking-[0.3em] text-slate-600 uppercase">
          Technical Documentation • 2026
        </p>

        <div className="flex gap-12">
           <a href="https://github.com/SlimmShadyyy/note-stream" target="_blank" className="text-[11px] font-bold text-white hover:text-indigo-400 uppercase tracking-[0.3em] transition-all border-b-2 border-transparent hover:border-indigo-400 pb-2">Repository</a>
           <a href="https://github.com/SlimmShadyyy/note-stream" target="_blank" className="text-[11px] font-bold text-white hover:text-indigo-400 uppercase tracking-[0.3em] transition-all border-b-2 border-transparent hover:border-indigo-400 pb-2">Docs</a>
        </div>
      </footer>


    </main>
  );
}