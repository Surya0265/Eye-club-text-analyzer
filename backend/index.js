const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 5000;


app.use(cors());
app.use(express.json());


const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading file' });
    }

    const wordCount = data.split(/\s+/).length;
    const charCount = data.length;
    const wordFrequency = {};

    data.split(/\s+/).forEach(word => {
      word = word.toLowerCase();
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });

    const sortedWords = Object.entries(wordFrequency).sort((a, b) => b[1] - a[1]);
    const mostFrequentWords = sortedWords.slice(0, 10);

    res.json({ wordCount, charCount, mostFrequentWords });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
