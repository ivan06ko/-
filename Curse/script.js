const modal = document.getElementById('modal');
const closeModalButton = document.getElementById('close-modal');
const searchBar = document.getElementById('search-bar');
const popularContainer = document.getElementById('popular-container');
const airingContainer = document.getElementById('airing-container');
const upcomingContainer = document.getElementById('upcoming-container');

// Завантаження аніме з API
async function fetchAnime(category, container) {
  let url = "";
  if (category === "popular") {
    url = "https://api.jikan.moe/v4/top/anime";
  } else if (category === "airing") {
    url = "https://api.jikan.moe/v4/seasons/now";
  } else if (category === "upcoming") {
    url = "https://api.jikan.moe/v4/seasons/upcoming";
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    container.innerHTML = '';
    data.data.forEach(anime => {
      const animeCard = document.createElement('div');
      animeCard.classList.add('anime-card');
      animeCard.innerHTML = `
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
        <h3>${anime.title}</h3>
      `;
      animeCard.addEventListener('click', () => showDetails(anime));
      container.appendChild(animeCard);
    });
  } catch (error) {
    container.innerHTML = '<p>Failed to load anime data. Please try again later.</p>';
    console.error("Error fetching anime data:", error);
  }
}

// Показ деталей аніме
function showDetails(anime) {
  modal.classList.add('show');
  document.getElementById('anime-title').innerText = anime.title;
  document.getElementById('anime-details').innerText = anime.synopsis || "No description available.";
  document.getElementById('anime-episodes').innerText = anime.episodes || "N/A";
  document.getElementById('anime-rating').innerText = anime.score || "N/A";

  const trailer = anime.trailer ? anime.trailer.embed_url : null;
  if (trailer) {
    document.getElementById('anime-trailer').innerHTML = `<iframe src="${trailer}" allowfullscreen></iframe>`;
  } else {
    document.getElementById('anime-trailer').innerHTML = "<p>No trailer available.</p>";
  }
}

// Закриття модального вікна
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.remove('show');
  }
});

closeModalButton.addEventListener('click', () => {
  modal.classList.remove('show');
});

// Завантаження секцій
fetchAnime("popular", popularContainer);
fetchAnime("airing", airingContainer);
fetchAnime("upcoming", upcomingContainer);

// Обробка пошуку
searchBar.addEventListener('keyup', async (event) => {
  if (event.key === 'Enter') {
    const query = searchBar.value.trim();
    if (!query) {
      // Якщо рядок порожній, повернутися до початкової сторінки
      fetchAnime("popular", popularContainer);
      fetchAnime("airing", airingContainer);
      fetchAnime("upcoming", upcomingContainer);
      return;
    }

    const url = `https://api.jikan.moe/v4/anime?q=${query}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      popularContainer.innerHTML = ''; // Очистити контейнери
      airingContainer.innerHTML = '';
      upcomingContainer.innerHTML = '';

      data.data.forEach(anime => {
        const animeCard = document.createElement('div');
        animeCard.classList.add('anime-card');
        animeCard.innerHTML = `
          <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
          <h3>${anime.title}</h3>
        `;
        animeCard.addEventListener('click', () => showDetails(anime));
        popularContainer.appendChild(animeCard); // Показувати результати у популярному
      });
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }
});
