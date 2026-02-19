// NEWS-ARTICLE.JS - VERSION FIXÉE COMPLÈTE

let currentArticle = null;

function parseFrontmatter(mdText) {
  const m = mdText.match(/^---\s*([\s\S]*?)\s*---\s*/);
  if (!m) return { meta: {}, body: mdText };

  const fm = m[1];
  const body = mdText.slice(m[0].length);

  const meta = {};
  const lines = fm.split(/\r?\n/);
  let currentListKey = null;

  for (const line of lines) {
    const l = line.trim();
    if (!l) continue;

    if (currentListKey && l.startsWith('- ')) {
      meta[currentListKey].push(l.slice(2).trim().replace(/^"|"$/g, ''));
      continue;
    }

    const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!kv) continue;

    const key = kv[1];
    let val = kv[2].trim();

    if (val === '') {
      meta[key] = [];
      currentListKey = key;
      continue;
    }

    currentListKey = null;
    val = val.replace(/^"|"$/g, '');
    meta[key] = val;
  }

  return { meta, body };
}

// Charger l'article
async function loadArticle() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  
  if (!articleId) {
    window.location.href = 'news.html';
    return;
  }
  
  try {
    const response = await fetch(`../media/news/${articleId}/article.md`);
    
    if (!response.ok) {
      console.error('Article non trouvé:', articleId);
      window.location.href = 'news.html';
      return;
    }
    
    const md = await response.text();
    const parsed = parseFrontmatter(md);
    currentArticle = { ...parsed.meta, body: parsed.body };
    displayArticle();
  } catch (error) {
    console.error('Erreur de chargement de l\'article:', error);
    window.location.href = 'news.html';
  }
}

// Afficher l'article
function displayArticle() {
  // Titre de la page
  document.getElementById('articleTitle').textContent = currentArticle.title + ' — KYOOL News';
  document.getElementById('breadcrumbTitle').textContent = currentArticle.title;
  
  // Hero
  displayHero();
  
  // Métadonnées
  document.getElementById('authorName').textContent = currentArticle.journalist;
  document.getElementById('publishDate').textContent = formatDate(currentArticle.date);
  document.getElementById('themeTag').textContent = currentArticle.theme;
  
  // Corps : HTML direct depuis article.md
  document.getElementById('articleBody').innerHTML = currentArticle.body || '';

  // Ancien container promo
  const promo = document.getElementById('promoPhotoContainer');
  if (promo) promo.style.display = 'none';

  // Open Graph pour partage social
  setupOpenGraph();
  
  // Boutons de partage (SANS Instagram)
  setupShareButtons();
}

// Afficher l'image hero
function displayHero() {
  const heroImage = document.getElementById('heroImage');
  const heroTitle = document.getElementById('heroTitle');
  
  heroImage.src = `../media/news/${currentArticle.folder}/hero.jpg`;
  heroImage.alt = currentArticle.title;
  
  // Gérer le retour à la ligne du titre (remplacer " :" par " :<br>")
  let titleHTML = currentArticle.title;
  if (titleHTML.includes(' :')) {
    titleHTML = titleHTML.replace(' :', ' :<br>');
  }
  heroTitle.innerHTML = titleHTML;
  
  // Fallback
  heroImage.onerror = function() {
    this.src = `../media/news/${currentArticle.folder}/${currentArticle.image}`;
    this.onerror = function() {
      this.src = '../media/news/ads/kyool_ad_01.jpg';
    };
  };
}

// Configuration Open Graph pour partage social
function setupOpenGraph() {
  const url = window.location.href;
  const baseUrl = window.location.origin;
  const heroImage = `${baseUrl}/media/news/${currentArticle.folder}/hero.jpg`;
  
  // Extraire un extrait du contenu
  let excerpt = '';
  if (currentArticle.intro) {
    excerpt = currentArticle.intro.replace(/<[^>]*>/g, '').substring(0, 200);
  } else {
    const bodyText = currentArticle.body.replace(/<[^>]*>/g, '');
    excerpt = bodyText.substring(0, 200);
  }
  
  // Titre complet avec auteur
  const fullTitle = `${currentArticle.title} - Par ${currentArticle.journalist}`;
  
  // Description enrichie
  const description = `${excerpt}... | Thème : ${currentArticle.theme} | ${currentArticle.journalist} | KYOOL News`;
  
  // Mettre à jour toutes les balises Open Graph
  document.getElementById('ogTitle').setAttribute('content', fullTitle);
  document.getElementById('ogDescription').setAttribute('content', description);
  document.getElementById('ogImage').setAttribute('content', heroImage);
  document.getElementById('ogUrl').setAttribute('content', url);
  document.getElementById('ogAuthor').setAttribute('content', currentArticle.journalist);
  document.getElementById('ogPublishedTime').setAttribute('content', currentArticle.date);
  
  // Twitter Card
  document.getElementById('twitterTitle').setAttribute('content', fullTitle);
  document.getElementById('twitterDescription').setAttribute('content', description);
  document.getElementById('twitterImage').setAttribute('content', heroImage);
}

// Configuration des boutons de partage (SANS Instagram)
function setupShareButtons() {
  const url = window.location.href;
  const title = currentArticle.title;
  const heroImage = `${window.location.origin}/media/news/${currentArticle.folder}/hero.jpg`;
  
  // Extraire un extrait
  let excerpt = '';
  if (currentArticle.intro) {
    excerpt = currentArticle.intro.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  } else {
    const bodyText = currentArticle.body.replace(/<[^>]*>/g, '');
    excerpt = bodyText.substring(0, 150) + '...';
  }
  
  // Texte enrichi pour partage
  const text = `📰 ${title}

✏️ Par ${currentArticle.journalist}
🏷️ Thème : ${currentArticle.theme}

${excerpt}

#KYOOL #KoreanCulture #Hallyu`;

  // LinkedIn
  document.getElementById('shareLinkedIn').href = 
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  
  // Facebook
  document.getElementById('shareFacebook').href = 
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  
  // Twitter/X
  document.getElementById('shareTwitter').href = 
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

// Formater la date
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}

// Gestion de la notation
function setupRating() {
  const ratingButtons = document.querySelectorAll('.rating-btn');
  const ratingThanks = document.querySelector('.rating-section .rating-thanks');
  
  if (!ratingButtons.length || !ratingThanks) return;
  
  ratingButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const rating = this.dataset.rating;
      ratingButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      ratingThanks.style.display = 'block';
      localStorage.setItem(`rating_${currentArticle.id}`, rating);
    });
  });
  
  const existingRating = localStorage.getItem(`rating_${currentArticle.id}`);
  if (existingRating) {
    const btn = document.querySelector(`[data-rating="${existingRating}"]`);
    if (btn) {
      btn.classList.add('active');
      ratingThanks.style.display = 'block';
    }
  }
}

// Gestion du signalement
function setupReport() {
  const reportBtn = document.getElementById('reportBtn');
  const reportForm = document.getElementById('reportForm');
  const submitReport = document.getElementById('submitReport');
  const cancelReport = document.getElementById('cancelReport');
  const reportThanks = document.querySelector('.report-form .report-thanks');
  
  if (!reportBtn || !reportForm) return;
  
  reportBtn.addEventListener('click', function() {
    reportForm.style.display = 'block';
    this.style.display = 'none';
  });
  
  cancelReport.addEventListener('click', function() {
    reportForm.style.display = 'none';
    reportBtn.style.display = 'inline-block';
    document.getElementById('reportText').value = '';
  });
  
  submitReport.addEventListener('click', function() {
    const reportText = document.getElementById('reportText').value.trim();
    if (!reportText) {
      alert('Veuillez décrire le problème.');
      return;
    }
    console.log('Signalement pour article:', currentArticle.id);
    console.log('Message:', reportText);
    document.getElementById('reportText').style.display = 'none';
    submitReport.style.display = 'none';
    cancelReport.style.display = 'none';
    reportThanks.style.display = 'block';
    setTimeout(() => {
      reportForm.style.display = 'none';
      reportBtn.style.display = 'inline-block';
      document.getElementById('reportText').value = '';
      document.getElementById('reportText').style.display = 'block';
      submitReport.style.display = 'inline-block';
      cancelReport.style.display = 'inline-block';
      reportThanks.style.display = 'none';
    }, 3000);
  });
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
  loadArticle();
  setupRating();
  setupReport();
});
