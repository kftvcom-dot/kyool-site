// NEWS.JS - Gestion de la page listing des articles

// Charger les articles depuis le fichier JSON
let articles = [];

async function loadArticles() {
  try {
    const response = await fetch('articles-data.json');
    articles = await response.json();
    displayArticles();
    updateCount();
  } catch (error) {
    console.error('Erreur de chargement des articles:', error);
    document.getElementById('newsGrid').innerHTML = '<p style="text-align:center; color: rgba(255,255,255,.7);">Erreur de chargement des articles.</p>';
  }
}

// Afficher les articles dans la grille
function displayArticles() {
  const grid = document.getElementById('newsGrid');
  const noResults = document.getElementById('noResults');
  
  // Filtrer les articles
  const filteredArticles = filterArticles();
  
  // Trier les articles
  const sortedArticles = sortArticles(filteredArticles);
  
  if (sortedArticles.length === 0) {
    grid.style.display = 'none';
    noResults.style.display = 'block';
    return;
  }
  
  grid.style.display = 'grid';
  noResults.style.display = 'none';
  
  // Générer le HTML
  grid.innerHTML = sortedArticles.map(article => `
    <a href="news-article.html?id=${article.id}" class="article-card">
      <div class="article-image">
        <img src="../media/news/${article.folder}/${article.image}" 
             alt="${article.title}"
             onerror="this.src='../media/news/ads/kyool_ad_01.jpg'">
        <div class="article-image-title">${article.title}</div>
      </div>
      <div class="article-info">
        <div class="article-theme">${article.theme}</div>
        <div class="article-journalist">
          Par <strong>${article.journalist}</strong>
        </div>
      </div>
    </a>
  `).join('');
}

// Filtrer les articles
function filterArticles() {
  const themeFilter = document.getElementById('filterTheme').value;
  
  if (themeFilter === 'all') {
    return articles;
  }
  
  return articles.filter(article => article.theme.toLowerCase() === themeFilter.toLowerCase());
}

// Trier les articles
function sortArticles(articlesToSort) {
  const sortBy = document.getElementById('sortBy').value;
  
  const sorted = [...articlesToSort];
  
  switch(sortBy) {
    case 'date':
      // Par défaut : plus récent en premier
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
      
    case 'theme':
      sorted.sort((a, b) => a.theme.localeCompare(b.theme));
      break;
      
    case 'journalist':
      sorted.sort((a, b) => a.journalist.localeCompare(b.journalist));
      break;
      
    case 'rating':
      // Les mieux notés en premier
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
  }
  
  return sorted;
}

// Mettre à jour le compteur
function updateCount() {
  const filteredArticles = filterArticles();
  document.getElementById('articleCount').textContent = filteredArticles.length;
}

// Écouteurs d'événements
document.addEventListener('DOMContentLoaded', function() {
  loadArticles();
  
  // Tri
  document.getElementById('sortBy').addEventListener('change', function() {
    displayArticles();
  });
  
  // Filtre
  document.getElementById('filterTheme').addEventListener('change', function() {
    displayArticles();
    updateCount();
  });
});
