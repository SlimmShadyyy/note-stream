import express from 'express';
import Note from '../models/Note.js';

const router = express.Router();

// GET /api/notes (Fetch ALL notes)
router.get('/', async (req, res) => {
  try {
    const allNotes = await Note.find().sort({ updatedAt: -1 });
    res.json(allNotes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the notes library' });
  }
});

// GET /api/notes/:videoId (Fetch specific video note)
router.get('/:videoId', async (req, res) => {
  try {
    const note = await Note.findOne({ videoId: req.params.videoId });
    res.json(note || { content: '' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// POST /api/notes (Save/Update notes)
router.post('/', async (req, res) => {
  try {
    const { videoId, videoTitle, content } = req.body;
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

// DELETE /api/notes/:id 
router.delete('/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error while deleting" });
  }
});

export default router;