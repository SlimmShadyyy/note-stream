"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Library() {
  const [notesLibrary, setNotesLibrary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // 1. Added Search State

  useEffect(() => {
    fetch("https://note-stream-api-8agu.onrender.com/api/notes")
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

  // 2. Filter logic for the Search Bar
  const filteredNotes = notesLibrary.filter((note) =>
    note.videoTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 3. Delete Logic
  const handleDelete = async (e, id) => {
    e.preventDefault(); // CRITICAL: Stops the <Link> from navigating to the video page!
    
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;

    // Optimistic UI update for a snappy feel
    setNotesLibrary((prevNotes) => prevNotes.filter((note) => note._id !== id));

    try {
      await fetch(`https://note-stream-api-8agu.onrender.com/api/notes/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-slate-300 p-6 md:p-12 font-sans selection:bg-indigo-500/30 relative overflow-hidden">

      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-white mb-10 transition-colors">
          <span className="mr-2">←</span> Back to Home
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <header className="text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-4 inline-flex items-center gap-3">
              My Library
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl font-medium">
              Your personalized knowledge base. Select a video to review notes or test your understanding.
            </p>
          </header>

          <div className="w-full md:w-80 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search your notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/[0.03] text-white border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all placeholder-slate-600 font-medium"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : notesLibrary.length === 0 ? (
          // Empty State (No notes in database at all)
          <div className="bg-white/[0.02] p-16 rounded-3xl border border-white/5 backdrop-blur-sm text-center max-w-2xl mx-auto">
            <div className="text-5xl mb-6 grayscale opacity-40">📭</div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Your library is empty</h2>
            <p className="text-slate-500 mt-2 mb-8">Watch a YouTube video and start taking notes with the extension to see them here.</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          // Empty State (Search returned no results)
          <div className="text-center py-20 border border-white/5 bg-white/[0.01] rounded-3xl backdrop-blur-sm">
            <p className="text-slate-400 text-lg font-medium">No videos found matching "{searchQuery}".</p>
            <button onClick={() => setSearchQuery("")} className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-bold uppercase tracking-widest transition-colors">
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredNotes.map((note) => (
              <Link href={`/study/${note.videoId}`} key={note.videoId} className="group flex relative">
                
                
                <button 
                  onClick={(e) => handleDelete(e, note._id)}
                  className="absolute top-4 right-4 z-20 p-2.5 bg-black/40 backdrop-blur-md text-slate-300 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-500/90 hover:text-white transition-all duration-300 border border-white/10 hover:border-red-400 shadow-xl"
                  title="Delete Note"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <div className="bg-white/[0.03] rounded-3xl border border-white/5 hover:border-white/20 hover:bg-white/[0.06] shadow-2xl transition-all duration-300 w-full flex flex-col overflow-hidden backdrop-blur-md relative z-10">
                  
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
                    <h2 className="font-bold text-white text-lg leading-snug line-clamp-2 mb-3 group-hover:text-indigo-400 transition-colors tracking-tight pr-4">
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