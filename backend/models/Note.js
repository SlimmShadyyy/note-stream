import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  videoId: { 
    type: String, 
    required: true, 
    unique: true // One note document per YouTube video
  },
  videoTitle: {
    type: String,
  },
  content: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);