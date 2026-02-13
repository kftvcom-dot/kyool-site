// NEWS-ARTICLE.JS - Version améliorée avec hero et photos intercalées

let currentArticle = null;

// Charger l'article depuis son fichier individuel
async function loadArticle() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  
  if (!articleId) {
    window.location.href = 'news.html';
    return;
  }
  
  try {
    const response = await fetch(`../media/news/${articleId}/article-data.json`);
    
    if (!response.ok) {
      console.error('Article non trouvé:', articleId);
      window.location.href = 'news.html';
      return;
    }
    
    currentArticle = await response.json();
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
  
  // Corps de l'article avec photos intercalées
  displayContentWithPhotos();
  
  // Boutons de partage
  setupShareButtons();
}

// Afficher l'image hero
function displayHero() {
  const heroImage = document.getElementById('heroImage');
  const heroTitle = document.getElementById('heroTitle');
  
  // Image hero = cover.jpg
  heroImage.src = `../media/news/${currentArticle.folder}/${currentArticle.image}`;
  heroImage.alt = currentArticle.title;
  
  // Titre dans le hero
  heroTitle.textContent = currentArticle.title;
  
  // Fallback si image ne charge pas
  heroImage.onerror = function() {
    this.src = '../media/news/ads/kyool_ad_01.jpg';
  };
}

// Afficher le contenu avec photos intercalées
function displayContentWithPhotos() {
  const container = document.getElementById('articleBody');
  
  // Séparer le contenu en sections (par <h2>)
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = currentArticle.content;
  
  // Récupérer tous les éléments
  const elements = Array.from(tempDiv.children);
  
  // Photos disponibles
  const photos = currentArticle.photos || [];
  let photoIndex = 0;
  
  let finalHTML = '';
  
  elements.forEach((element, index) => {
    // Ajouter l'élément
    finalHTML += element.outerHTML;
    
    // Après chaque <h2> (sauf le dernier), insérer une photo
    if (element.tagName === 'H2' && photoIndex < photos.length && index < elements.length - 2) {
      const photoPath = `../media/news/${currentArticle.folder}/${photos[photoIndex]}`;
      finalHTML += `
        <figure class="article-photo">
          <img src="${photoPath}" alt="Photo ${photoIndex + 1}" onerror="this.src='../media/news/ads/kyool_ad_0${(photoIndex % 4) + 1}.jpg'">
        </figure>
      `;
      photoIndex++;
    }
  });
  
  // Ajouter les photos restantes à la fin en galerie
  if (photoIndex < photos.length) {
    finalHTML += '<div class="article-gallery">';
    for (let i = photoIndex; i < photos.length; i++) {
      const photoPath = `../media/news/${currentArticle.folder}/${photos[i]}`;
      finalHTML += `
        <figure class="gallery-photo">
          <img src="${photoPath}" alt="Photo ${i + 1}" onerror="this.src='../media/news/ads/kyool_ad_0${(i % 4) + 1}.jpg'">
        </figure>
      `;
    }
    finalHTML += '</div>';
  }
  
  container.innerHTML = finalHTML;
}

// Formater la date
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}

// Configuration des boutons de partage
function setupShareButtons() {
  const url = window.location.href;
  const title = currentArticle.title;
  const text = `${title} par ${currentArticle.journalist} sur KYOOL News`;
  
  document.getElementById('shareLinkedIn').href = 
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  
  document.getElementById('shareFacebook').href = 
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  
  document.getElementById('shareTwitter').href = 
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

// Gestion de la notation
function setupRating() {
  const ratingButtons = document.querySelectorAll('.rating-btn');
  const ratingThanks = document.querySelector('.rating-section .rating-thanks');
  
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
