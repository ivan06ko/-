const modal = document.getElementById('modal');
const closeModalButton = document.getElementById('close-modal');
const searchBar = document.getElementById('search-bar');
const popularContainer = document.getElementById('popular-container');
const airingContainer = document.getElementById('airing-container');
const upcomingContainer = document.getElementById('upcoming-container');

let currentPage = {
  popular: 1,
  airing: 1,
  upcoming: 1
};

// Завантаження аніме
async function fetchAnime(category, page, container) {
  let url = "";
  if (category === "popular") {
    url = `https://api.jikan.moe/v4/top/anime?page=${page}`;
  } else if (category === "airing") {
    url = `https://api.jikan.moe/v4/seasons/now?page=${page}`;
  } else if (category === "upcoming") {
    url = `https://api.jikan.moe/v4/seasons/upcoming?page=${page}`;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

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
    console.error("Error fetching anime data:", error);
    container.innerHTML = '<p>Failed to load anime data. Please try again later.</p>';
  }
}

// Показ деталей
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

// Пошук
searchBar.addEventListener('keyup', async (event) => {
  if (event.key === 'Enter') {
    const query = searchBar.value.trim();
    if (!query) {
      // Якщо рядок порожній, повернути до початкових секцій
      fetchAnime("popular", 1, popularContainer);
      fetchAnime("airing", 1, airingContainer);
      fetchAnime("upcoming", 1, upcomingContainer);
      return;
    }

    const url = `https://api.jikan.moe/v4/anime?q=${query}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      [popularContainer, airingContainer, upcomingContainer].forEach(container => container.innerHTML = '');
      
      data.data.forEach(anime => {
        const animeCard = document.createElement('div');
        animeCard.classList.add('anime-card');
        animeCard.innerHTML = `
          <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
          <h3>${anime.title}</h3>
        `;
        animeCard.addEventListener('click', () => showDetails(anime));
        popularContainer.appendChild(animeCard);
      });
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }
});

// Завантаження початкових даних
fetchAnime("popular", currentPage.popular, popularContainer);
fetchAnime("airing", currentPage.airing, airingContainer);
fetchAnime("upcoming", currentPage.upcoming, upcomingContainer);

// Горизонтальне завантаження при скролі
[popularContainer, airingContainer, upcomingContainer].forEach((container, index) => {
  const category = ["popular", "airing", "upcoming"][index];
  container.addEventListener('scroll', () => {
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 50) {
      currentPage[category]++;
      fetchAnime(category, currentPage[category], container);
    }
  });
});
