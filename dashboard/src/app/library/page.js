"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Library() {
  const [notesLibrary, setNotesLibrary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/notes")
      .then((res) => res.json())
      .then((data) => {
        setNotesLibrary(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load library:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-slate-300 p-6 md:p-12 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      

      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-white mb-10 transition-colors">
          <span className="mr-2">←</span> Back to Home
        </Link>

        <header className="mb-16 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-4 inline-flex items-center gap-3">
            My Library
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl font-medium">
            Your personalized knowledge base. Select a video to review notes or test your understanding.
          </p>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : notesLibrary.length === 0 ? (
          <div className="bg-white/[0.02] p-16 rounded-3xl border border-white/5 backdrop-blur-sm text-center max-w-2xl mx-auto">
            <div className="text-5xl mb-6 grayscale opacity-40">📭</div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Your library is empty</h2>
            <p className="text-slate-500 mt-2 mb-8">Watch a YouTube video and start taking notes with the extension to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {notesLibrary.map((note) => (
              <Link href={`/study/${note.videoId}`} key={note.videoId} className="group flex">
                <div className="bg-white/[0.03] rounded-3xl border border-white/5 hover:border-white/20 hover:bg-white/[0.06] shadow-2xl transition-all duration-300 w-full flex flex-col overflow-hidden backdrop-blur-md">
                  
                  <div className="relative aspect-video w-full overflow-hidden bg-white/5">
                    <img 
                      src={`https://img.youtube.com/vi/${note.videoId}/maxresdefault.jpg`}
                      onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${note.videoId}/mqdefault.jpg`;
                      }}
                      alt="Video Thumbnail" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-white text-black px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all">
                            Review Notes
                        </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="font-bold text-white text-lg leading-snug line-clamp-2 mb-3 group-hover:text-indigo-400 transition-colors tracking-tight">
                      {note.videoTitle ? note.videoTitle.replace(' - YouTube', '') : "Untitled Video"}
                    </h2>
                    <div className="flex-grow">
                        <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed font-medium">
                        {note.content || <span className="italic opacity-50">No notes recorded yet.</span>}
                        </p>
                    </div>
                    

                    <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                            {new Date(note.updatedAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 border border-white/5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}