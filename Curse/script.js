const apiUrls = {
    popular: 'https://api.jikan.moe/v4/top/anime',
    latest: 'https://api.jikan.moe/v4/seasons/now',
    'most-viewed': 'https://api.jikan.moe/v4/top/manga'
};

async function loadAnimeData(category, listId) {
    try {
        const response = await fetch(`${apiUrls[category]}?page=1`);
        const data = await response.json();
        const animeList = data.data.slice(0, 12);

        const listElement = document.getElementById(listId);
        listElement.innerHTML = '';

        animeList.forEach(anime => {
            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                <div class="card-title">${anime.title}</div>
                <div class="card-rating">Рейтинг: ${anime.score}</div>
            `;

            listElement.appendChild(card);
        });
    } catch (error) {
        console.error(`Помилка для ${category}:`, error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAnimeData('popular', 'popular-list');
    loadAnimeData('latest', 'latest-list');
    loadAnimeData('most-viewed', 'most-viewed-list');

    // Темна тема
    const toggleThemeButton = document.getElementById('toggle-theme');
    toggleThemeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
});
