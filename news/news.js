// NEWS.JS - Version avec JSON séparés (UN FICHIER PAR ARTICLE)

let articles = [];

// Liste des IDs d'articles (à maintenir à jour quand vous ajoutez un article)
const ARTICLE_IDS = [
  'article-1',
  'article-2',
  'article-3',
  'article-4',
  'article-5'
  // Ajoutez les nouveaux IDs ici
];

// Charger tous les articles depuis leurs fichiers individuels
async function loadArticles() {
  try {
    articles = [];
    
    // Charger chaque article individuellement
    for (const articleId of ARTICLE_IDS) {
      try {
        const response = await fetch(`../media/news/${articleId}/article-data.json`);
        if (response.ok) {
          const article = await response.json();
          articles.push(article);
        } else {
          console.warn(`Article ${articleId} non trouvé`);
        }
      } catch (error) {
        console.error(`Erreur chargement ${articleId}:`, error);
      }
    }
    
    // Trier par date (plus récent en premier)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
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
