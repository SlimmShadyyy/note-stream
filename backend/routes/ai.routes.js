import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST /api/ask-ai
router.post('/ask-ai', async (req, res) => {
  try {
    const { question, currentNotes, videoTitle } = req.body;
    const systemPrompt = `You are a smart AI companion integrated directly into a user's YouTube tab. 
    The user is currently watching a video titled: "${videoTitle}". 
    Their current notes are: "${currentNotes || 'None yet'}". 
    Answer their question directly, naturally, and concisely. 
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

// POST /api/improve-notes
router.post('/improve-notes', async (req, res) => {
  try {
    const { currentNotes, videoTitle } = req.body;
    const systemPrompt = `You are an expert study assistant. Your job is to take the user's raw, messy notes from a YouTube video titled "${videoTitle}" and transform them into a beautifully organized summary.
    1. Fix typos and grammar.
    2. Organize the thoughts into logical bullet points.
    3. Add clear headings if necessary.
    Output clean, readable text with spacing.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${systemPrompt}\n\nRaw Notes:\n${currentNotes}`,
    });
    res.json({ improvedNotes: response.text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to improve notes' });
  }
});

// POST /api/generate-quiz
router.post('/generate-quiz', async (req, res) => {
  try {
    const { currentNotes, videoTitle } = req.body;
    const systemPrompt = `You are an expert educational quiz generator. 
    Analyze the video title "${videoTitle}" and the user's notes: "${currentNotes || 'No notes provided'}". 
    1. Determine the appropriate number of questions (minimum 3, maximum 10). 
    CRITICAL INSTRUCTION: Respond ONLY with a raw, valid JSON array.
    Format: [{"question": "...", "options": ["..."], "correctAnswer": "...", "explanation": "..."}]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
    });

    let rawText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    res.json({ quiz: JSON.parse(rawText) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate adaptive quiz.' });
  }
});

// POST /api/analyze-domain
router.post('/analyze-domain', async (req, res) => {
  try {
    const { quizResults, videoTitle } = req.body;
    const systemPrompt = `You are an AI tutor analyzing a student's quiz performance on: "${videoTitle}". 
    Results: ${JSON.stringify(quizResults)}
    CRITICAL INSTRUCTION: Respond ONLY with a raw, valid JSON object.
    Format: {"domain": "...", "strengths": ["..."], "weaknesses": ["..."], "feedback": "..."}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
    });

    let rawText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    res.json(JSON.parse(rawText));
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze domain.' });
  }
});

// POST /api/improve-notes-from-quiz
router.post('/improve-notes-from-quiz', async (req, res) => {
  try {
    const { currentNotes, videoTitle, quizResults } = req.body;
    const missedQuestions = quizResults.filter(r => !r.wasCorrect);
    const systemPrompt = `You are a personalized AI Tutor. The user took a quiz on "${videoTitle}". 
    Notes: "${currentNotes}". Missed: ${JSON.stringify(missedQuestions)}.
    Rewrite the notes into a study guide. Add a "⚠️ Review Needed" section for topics they missed.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
    });
    res.json({ improvedNotes: response.text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to adapt notes' });
  }
});

export default router;