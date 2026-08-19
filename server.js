const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/ar-restaurant')
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => console.log('❌ Database connection error:', err));

const Feedback = mongoose.model('Feedback', new mongoose.Schema({
  rating: Number,
  comment: String
}));

app.post('/api/feedback', async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    await newFeedback.save();
    res.status(201).json({ message: 'Saved!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.listen(5000, () => {
  console.log('🚀 Server is running on port 5000');
});