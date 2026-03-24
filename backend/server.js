import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { GoogleGenAI } from '@google/genai';
import Note from './models/Note.js'; // Import our new model

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });



// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected successfully!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));


// --- AI ROUTE ---
app.post('/api/ask-ai', async (req, res) => {
  try {
    const { question, currentNotes, videoTitle } = req.body;
    const systemPrompt = `You are a smart AI companion integrated directly into a user's YouTube tab. 
    The user is currently watching a video titled: "${videoTitle}". 
    Their current notes are: "${currentNotes || 'None yet'}". 
    Answer their question directly, naturally, and concisely. 
    Use the video title and notes for context. 
    CRITICAL RULE: If the user's notes are empty, do NOT complain or mention that they are empty. Just answer the question directly using your general knowledge.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${systemPrompt}\n\nUser Question: ${question}`,
    });
    res.json({ answer: response.text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});



// --- DATABASE ROUTES ---

// --- IMPROVE NOTES ROUTE ---
app.post('/api/improve-notes', async (req, res) => {
  try {
    const { currentNotes, videoTitle } = req.body;

    const systemPrompt = `You are an expert study assistant. Your job is to take the user's raw, messy notes from a YouTube video titled "${videoTitle}" and transform them into a beautifully organized summary.
    1. Fix typos and grammar.
    2. Organize the thoughts into logical bullet points.
    3. Add clear headings if necessary.
    4. Do NOT add outside information that isn't at least implied by the notes or the video title.
    Output clean, readable text with spacing.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${systemPrompt}\n\nRaw Notes:\n${currentNotes}`,
    });

    res.json({ improvedNotes: response.text });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: 'Failed to improve notes' });
  }
});

// --- GENERATE QUIZ ROUTE ---
// --- UPDATED GENERATE QUIZ ROUTE ---
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { currentNotes, videoTitle } = req.body;

    // Notice the new instruction: "Determine the appropriate number of questions..."
    const systemPrompt = `You are an expert educational quiz generator. 
    Analyze the video title "${videoTitle}" and the user's notes: "${currentNotes || 'No notes provided'}". 
    
    1. Determine the appropriate number of questions based on the depth of the notes and video topic (minimum 3, maximum 10). 
    2. If the notes are detailed, generate more questions. If the notes are brief, stay closer to 3.
    3. Ensure every question is high quality and relevant.

    CRITICAL INSTRUCTION: Respond ONLY with a raw, valid JSON array. No markdown, no backticks.
    Format:
    [
      {
        "question": "...",
        "options": ["...", "...", "...", "..."],
        "correctAnswer": "...",
        "explanation": "..."
      }
    ]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
    });

    let rawText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const quizData = JSON.parse(rawText);
    res.json({ quiz: quizData });

  } catch (error) {
    console.error("Quiz Error:", error);
    res.status(500).json({ error: 'Failed to generate adaptive quiz.' });
  }
});

// --- DOMAIN ANALYTICS ROUTE ---
// --- ANALYZE DOMAIN KNOWLEDGE ROUTE ---
app.post('/api/analyze-domain', async (req, res) => {
  try {
    const { quizResults, videoTitle } = req.body;

    const systemPrompt = `You are an AI tutor analyzing a student's quiz performance on the topic: "${videoTitle}". 
    
    Here is the log of the questions they answered and whether they got them right or wrong:
    ${JSON.stringify(quizResults)}

    Based on these results, analyze their knowledge.
    
    CRITICAL INSTRUCTION: Respond ONLY with a raw, valid JSON object. No markdown formatting, no backticks.
    Format exactly like this:
    {
      "domain": "The core subject matter (e.g., 'React Hooks' or 'Machine Learning')",
      "strengths": ["One concept they understand well", "Another concept they understand"],
      "weaknesses": ["A concept they struggled with", "Another area to review"],
      "feedback": "A short, encouraging 1-sentence summary of their performance."
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
    });

    let rawText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const analysisData = JSON.parse(rawText);
    res.json(analysisData);

  } catch (error) {
    console.error("Domain Analysis Error:", error);
    res.status(500).json({ error: 'Failed to analyze domain.' });
  }
});
// --- IMPROVE NOTES BASED ON QUIZ RESULTS ---
app.post('/api/improve-notes-from-quiz', async (req, res) => {
  try {
    const { currentNotes, videoTitle, quizResults } = req.body;

    // Filter to find only the questions the user missed
    const missedQuestions = quizResults.filter(r => !r.wasCorrect);

    const systemPrompt = `You are a personalized AI Tutor. The user just took a quiz on "${videoTitle}". 
    
    Here are their original notes: "${currentNotes}".
    Here are the questions they got WRONG: ${JSON.stringify(missedQuestions)}.

    Your Task:
    1. Rewrite and improve their notes into a structured study guide.
    2. CRITICAL: For the topics they missed in the quiz, add a special "⚠️ Review Needed" section or highlight those concepts with extra detail so they don't forget them next time.
    3. Make the tone encouraging and helpful.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: systemPrompt,
  });

  res.json({ improvedNotes: response.text });

  } catch (error) {
    res.status(500).json({ error: 'Failed to adapt notes based on quiz' });
  }
});

// Fetch ALL saved notes (for the Next.js dashboard library)
app.get('/api/notes', async (req, res) => {
  try {
    // Finds all notes and sorts them by newest first
    const allNotes = await Note.find().sort({ updatedAt: -1 });
    res.json(allNotes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the notes library' });
  }
});


// 1. Fetch notes for a specific video
app.get('/api/notes/:videoId', async (req, res) => {
  try {
    const note = await Note.findOne({ videoId: req.params.videoId });
    res.json(note || { content: '' }); // Return empty content if no note exists yet
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// 2. Save or update notes
app.post('/api/notes', async (req, res) => {
  try {
    const { videoId, videoTitle, content } = req.body;
    
    // findOneAndUpdate with upsert: true will update the note if it exists, 
    // or create a brand new one if it doesn't!
    const savedNote = await Note.findOneAndUpdate(
      { videoId },
      { videoId, videoTitle, content },
      { new: true, upsert: true }
    );
    
    res.json(savedNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save notes' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});