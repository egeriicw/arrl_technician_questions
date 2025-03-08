const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();

app.use(express.json());
app.use(express.static('build'));

// Ensure incorrect_answers directory exists
const ensureDir = async () => {
  const dir = path.join(__dirname, 'incorrect_answers');
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
};

ensureDir();

// Handle file saving
app.post('/api/save-incorrect-answers', async (req, res) => {
  try {
    const { data, sessionId } = req.body;
    const dir = path.join(__dirname, 'incorrect_answers');
    const filePath = path.join(dir, `incorrect-answers-${sessionId}.json`);
    
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    res.json({ success: true, filePath });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ error: 'Failed to save file' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 