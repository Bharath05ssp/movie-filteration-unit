const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Connect to DB
const db = new sqlite3.Database('./db.sqlite');

// Movie recommendation endpoint
app.get('/recommend', (req, res) => {
  const genre = req.query.genre;
  db.get(
    'SELECT * FROM movies WHERE genre = ? ORDER BY RANDOM() LIMIT 1',
    [genre],
    (err, row) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(row || { title: 'No movie found.' });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});