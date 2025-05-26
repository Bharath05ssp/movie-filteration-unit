document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const genre = document.getElementById('genre').value;
  
    const response = await fetch(`/recommend?genre=${genre}`);
    const movie = await response.json();
  
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = movie.title 
      ? `<h3>🎬 Recommended: ${movie.title}</h3>` 
      : `<p>No movie found for this genre.</p>`;
  });