const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const db = new sqlite3.Database('./db.sqlite');
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Redirect if not logged in
function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect('/login.html');
  next();
}

// Signup
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], function(err) {
    if (err) return res.send('Username already exists.');
    req.session.userId = this.lastID;
    res.redirect('/');
  });
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) return res.send('User not found');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.send('Invalid credentials');
    req.session.userId = user.id;
    res.redirect('/');
  });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login.html'));
});

// Recommend movie (protected)
app.get('/recommend', requireLogin, (req, res) => {
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

// Home route
app.get('/', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));