import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './content.css'

// Helper function to grab the YouTube Video ID
const getVideoId = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('v');
}

const SmartNoteWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [videoId, setVideoId] = useState(null)
  const [saveStatus, setSaveStatus] = useState('') 

  useEffect(() => {
    const currentVideoId = getVideoId();
    if (currentVideoId && isOpen) {
      setVideoId(currentVideoId);
      fetch(`https://note-stream-api-8agu.onrender.com/api/notes/${currentVideoId}`)
        .then(res => res.json())
        .then(data => setNotes(data.content || ''))
        .catch(err => console.error("Could not load notes", err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!videoId || !isOpen) return;

    setSaveStatus('Saving...');
    const delayDebounceFn = setTimeout(() => {
      fetch('https://note-stream-api-8agu.onrender.com/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: videoId,
          videoTitle: document.title,
          content: notes
        })
      })
        .then(() => setSaveStatus('Saved!'))
        .catch(() => setSaveStatus('Error saving'));
    }, 1000); 

    return () => clearTimeout(delayDebounceFn); 
  }, [notes, videoId, isOpen]);

  const handleAskAI = async () => {
    if (!question) return;
    setIsLoading(true);
    setAnswer('');

    try {
      const response = await fetch('https://note-stream-api-8agu.onrender.com/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question,
          currentNotes: notes,
          videoTitle: document.title
        })
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer("❌ Could not connect to the AI server.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button className="floating-toggle-btn" onClick={() => setIsOpen(true)}>
        Notes
      </button>
    )
  }

  return (
    <div className="smart-note-container">
      <div className="header">
        <h3>Note Stream <span style={{ fontSize: '10px', color: '#666', fontWeight: 'normal' }}>{saveStatus}</span></h3>
        <button className="close-btn" onClick={() => setIsOpen(false)}>✖</button>
      </div>

      <textarea
        placeholder="Take a note..."
        className="notes-textarea"
        value={notes} 
        onChange={(e) => setNotes(e.target.value)} 
        onFocus={() => {
          // Pause when clicking into the box
          const ytVideo = document.querySelector('video');
          if (ytVideo && !ytVideo.paused) ytVideo.pause();
        }}
        onBlur={() => {
          // Resume playing when clicking out of the box
          const ytVideo = document.querySelector('video');
          if (ytVideo && ytVideo.paused) ytVideo.play();
        }}
      />

      <div className="ai-chat-section">
        <input
          type="text"
          className="question-input"
          placeholder="Ask a question about the video..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button className="ask-btn" onClick={handleAskAI} disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Ask AI'}
        </button>
      </div>

      {answer && (
        <div className="ai-answer">
          <strong>AI:</strong> {answer}
        </div>
      )}
    </div>
  )
}

// --- SAFER INJECTION LOGIC ---
const initExtension = () => {
  if (document.getElementById('notes-stream-root')) return;

  const rootElement = document.createElement('div')
  rootElement.id = 'notes-stream-root'
  document.body.appendChild(rootElement)

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <SmartNoteWidget />
    </React.StrictMode>
  )
}

if (document.body) {
  initExtension();
} else {
  document.addEventListener('DOMContentLoaded', initExtension);
}