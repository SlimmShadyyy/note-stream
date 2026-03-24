"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';

export default function StudyRoom() {
  const params = useParams();
  const videoId = params.videoId;
  const [noteData, setNoteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImproving, setIsImproving] = useState(false);

  // Quiz & Analysis States
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultsLog, setResultsLog] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/notes/${videoId}`)
      .then((res) => res.json())
      .then((data) => {
        setNoteData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load notes:", err);
        setIsLoading(false);
      });
  }, [videoId]);

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleImproveNotes = async () => {
    if (!noteData?.content) return;
    setIsImproving(true);
    try {
      const res = await fetch('http://localhost:5000/api/improve-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentNotes: noteData.content, videoTitle: noteData.videoTitle })
      });
      const data = await res.json();
      setNoteData({ ...noteData, content: data.improvedNotes });
      await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, videoTitle: noteData.videoTitle, content: data.improvedNotes })
      });
    } catch (err) { alert("AI Error"); }
    finally { setIsImproving(false); }
  };

  const handleGenerateQuiz = async () => {
    setIsQuizLoading(true);
    setQuizQuestions(null);
    setCurrentQuestionIdx(0);
    setScore(0);
    setResultsLog([]); 
    setAnalysis(null);
    try {
      const res = await fetch('http://localhost:5000/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentNotes: noteData?.content, videoTitle: noteData?.videoTitle })
      });
      const data = await res.json();
      setQuizQuestions(data.quiz);
    } catch (err) { alert("Failed to generate quiz."); }
    finally { setIsQuizLoading(false); }
  };

  const handleAnswerSubmit = (option) => {
    if (showExplanation) return;
    setSelectedOption(option);
    const isCorrect = option === quizQuestions[currentQuestionIdx].correctAnswer;
    if (isCorrect) setScore((prev) => prev + 1);
    setResultsLog((prev) => [...prev, {
        question: quizQuestions[currentQuestionIdx].question,
        wasCorrect: isCorrect
    }]);
    setShowExplanation(true);
  };

  const getAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('http://localhost:5000/api/analyze-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizResults: resultsLog, videoTitle: noteData.videoTitle })
      });
      if (!res.ok) throw new Error("Backend failed");
      const data = await res.json();
      setAnalysis(data);
    } catch (err) { 
      console.error(err); 
      alert("Uh oh! The AI failed to analyze. Check your backend terminal."); 
    }
    finally { setIsAnalyzing(false); }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setCurrentQuestionIdx(currentQuestionIdx + 1);
  };

  const handleImproveFromQuiz = async () => {
    setIsImproving(true);
    try {
      const res = await fetch('http://localhost:5000/api/improve-notes-from-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currentNotes: noteData.content, 
          videoTitle: noteData.videoTitle,
          quizResults: resultsLog 
        })
      });
      const data = await res.json();
      setNoteData({ ...noteData, content: data.improvedNotes });
      await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, videoTitle: noteData.videoTitle, content: data.improvedNotes })
      });
      setQuizQuestions(null);
      alert("Notes updated based on your quiz performance!");
    } catch (err) { alert("Failed to update notes."); }
    finally { setIsImproving(false); }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>;

  return (
    <main className="min-h-screen bg-[#050505] text-slate-300 p-6 md:p-10 font-sans selection:bg-indigo-500/30 print:bg-white print:text-black print:p-0 relative overflow-hidden">
      
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none print:hidden"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        <Link href="/library" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white mb-8 transition-colors print:hidden">
          <span className="mr-2">←</span> Back to Library
        </Link>

        <header className="mb-8 print:hidden">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">{noteData?.videoTitle?.replace(' - YouTube', '')}</h1>
          <p className="text-slate-500 font-medium">Master this topic with AI-generated feedback.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block">
          

          <div className="flex flex-col gap-5 print:hidden">
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/10 bg-black">
              <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen></iframe>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <button onClick={handleImproveNotes} className="bg-transparent border border-white/15 text-white font-semibold py-4 rounded-xl hover:bg-white/5 hover:border-white/30 transition-all flex justify-center items-center gap-2">
                ✨ Improve Notes
              </button>
              <button onClick={handleGenerateQuiz} className="bg-white text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:bg-slate-200 hover:scale-[1.02] transition-all flex justify-center items-center gap-2">
                📝 Test Knowledge
              </button>
            </div>
          </div>

          <div className="bg-white/[0.02] backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl p-8 h-[600px] overflow-y-auto relative custom-scrollbar print:h-auto print:shadow-none print:border-none print:p-0 print:overflow-visible print:bg-transparent">
            {!quizQuestions && !isQuizLoading ? (
              <div className="markdown-content-wrapper">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 print:border-black">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2 print:hidden">
                    <span>⚡</span> Smart Notes
                  </h2>
                  <h1 className="hidden print:block text-3xl font-bold mb-4 text-black">{noteData?.videoTitle?.replace(' - YouTube', '')}</h1>
                  
                  {noteData?.content && (
                    <button 
                      onClick={handleDownloadPDF}
                      className="text-xs bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-full transition-all flex items-center gap-2 print:hidden border border-white/5"
                    >
                      📥 Export PDF
                    </button>
                  )}
                </div>
                {noteData?.content ? (
                  <div className="prose prose-invert max-w-none 
                    prose-headings:text-white prose-headings:font-extrabold prose-headings:tracking-tight
                    prose-p:text-slate-300 prose-p:leading-relaxed
                    prose-strong:text-indigo-300 prose-strong:font-bold
                    prose-li:text-slate-300 prose-ul:list-disc
                    prose-hr:border-white/10 prose-hr:my-8
                    print:prose-p:text-black print:prose-headings:text-black print:prose-strong:text-black print:prose-li:text-black"
                  >
                    <ReactMarkdown>{noteData.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-slate-500 italic text-center mt-20">No notes recorded for this video yet.</p>
                )}
              </div>
            ) : isQuizLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 print:hidden">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
                <p className="text-indigo-400 font-medium animate-pulse">AI is generating your quiz...</p>
              </div>
            ) : (
              // Quiz UI
              <div className="h-full flex flex-col print:hidden">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-white">Smart Quiz</h2>
                  <span className="bg-indigo-500/20 border border-indigo-500/30 px-4 py-1.5 rounded-full text-indigo-300 text-sm font-bold">Score: {score}/{quizQuestions.length}</span>
                </div>

                {currentQuestionIdx < quizQuestions.length ? (
                  <div className="flex flex-col gap-6">
                    <h3 className="text-lg font-semibold text-white leading-relaxed">Q{currentQuestionIdx + 1}: {quizQuestions[currentQuestionIdx].question}</h3>
                    <div className="flex flex-col gap-3">
                      {quizQuestions[currentQuestionIdx].options.map((option, i) => (
                        <button
                          key={i}
                          onClick={() => handleAnswerSubmit(option)}
                          className={`p-4 rounded-xl text-left border transition-all font-medium ${
                            selectedOption === option 
                            ? (option === quizQuestions[currentQuestionIdx].correctAnswer ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400') 
                            : 'bg-white/5 border-white/5 hover:border-indigo-500/50 hover:bg-white/10 text-slate-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    {showExplanation && (
                      <div className="bg-indigo-500/10 p-5 rounded-xl border border-indigo-500/20 mt-2">
                        <p className="text-indigo-200 text-sm leading-relaxed"><strong>Explanation:</strong> {quizQuestions[currentQuestionIdx].explanation}</p>
                        <button onClick={nextQuestion} className="mt-5 w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-slate-200 transition-all">Next Question →</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <div className="text-6xl mb-6 grayscale opacity-80">🏆</div>
                    <h2 className="text-3xl font-extrabold text-white mb-2">Quiz Complete</h2>
                    <p className="text-slate-400 mb-8">You scored {score} out of {quizQuestions.length}</p>
                    
                    {resultsLog.some(r => !r.wasCorrect) && (
                      <button onClick={handleImproveFromQuiz} disabled={isImproving} className="w-full bg-indigo-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-indigo-500 transition-all mb-4">
                        {isImproving ? "AI is rewriting notes..." : "✨ Fix Notes Based on Mistakes"}
                      </button>
                    )}

                    {!analysis && !isAnalyzing ? (
                      <button onClick={getAnalysis} className="w-full bg-transparent border border-white/20 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/5 transition-all">
                        Analyze My Knowledge
                      </button>
                    ) : isAnalyzing ? (
                        <p className="mt-6 text-indigo-400 animate-pulse font-medium">AI is identifying your weak areas...</p>
                    ) : analysis && (
                      <div className="mt-8 w-full text-left bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <h3 className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-4">Domain: {analysis.domain}</h3>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-green-400 font-bold text-sm mb-2 flex items-center gap-2">✅ Strengths</h4>
                            <ul className="text-sm text-slate-400 list-disc list-inside space-y-1">{analysis.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul>
                          </div>
                          <div>
                            <h4 className="text-red-400 font-bold text-sm mb-2 flex items-center gap-2">⚠️ Weaknesses</h4>
                            <ul className="text-sm text-slate-400 list-disc list-inside space-y-1">{analysis.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}</ul>
                          </div>
                        </div>
                        <p className="mt-6 text-sm font-medium text-slate-300 italic border-t border-white/10 pt-4">"{analysis.feedback}"</p>
                        <button onClick={() => {setQuizQuestions(null); setAnalysis(null);}} className="mt-6 w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-slate-200 transition-all">Back to Notes</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}