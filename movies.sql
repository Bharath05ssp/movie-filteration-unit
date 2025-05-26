CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  genre TEXT NOT NULL
);

INSERT INTO movies (title, genre) VALUES ('Inception', 'action');
INSERT INTO movies (title, genre) VALUES ('The Hangover', 'comedy');
INSERT INTO movies (title, genre) VALUES ('Titanic', 'romance');
INSERT INTO movies (title, genre) VALUES ('The Conjuring', 'horror');
INSERT INTO movies (title, genre) VALUES ('The Shawshank Redemption', 'drama');