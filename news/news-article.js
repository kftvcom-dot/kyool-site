// NEWS-ARTICLE.JS - Version avec JSON séparés (UN FICHIER PAR ARTICLE)

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
    // Charger le JSON individuel de cet article
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
  
  // En-tête
  document.getElementById('mainTitle').textContent = currentArticle.title;
  document.getElementById('authorName').textContent = currentArticle.journalist;
  document.getElementById('publishDate').textContent = formatDate(currentArticle.date);
  document.getElementById('themeTag').textContent = currentArticle.theme;
  
  // Corps de l'article
  document.getElementById('articleBody').innerHTML = currentArticle.content;
  
  // Galerie photos
  displayPhotoGallery();
  
  // Boutons de partage
  setupShareButtons();
}

// Afficher la galerie de photos
function displayPhotoGallery() {
  const gallery = document.getElementById('photoGallery');
  
  // Photos de l'article
  const photos = currentArticle.photos || [];
  
  // Photos publicitaires KYOOL si besoin
  const adsPhotos = [
    'kyool_ad_01.jpg',
    'kyool_ad_02.jpg',
    'kyool_ad_03.jpg',
    'kyool_ad_04.jpg'
  ];
  
  // Nombre de photos souhaitées (même nombre pour tous les articles)
  const targetPhotoCount = 6;
  
  // Compléter avec des photos KYOOL si nécessaire
  const allPhotos = [...photos];
  while (allPhotos.length < targetPhotoCount && adsPhotos.length > 0) {
    const randomAd = adsPhotos[Math.floor(Math.random() * adsPhotos.length)];
    allPhotos.push(`../media/news/ads/${randomAd}`);
  }
  
  // Limiter au nombre cible
  const finalPhotos = allPhotos.slice(0, targetPhotoCount);
  
  // Générer le HTML
  gallery.innerHTML = finalPhotos.map((photo, index) => {
    const photoSrc = photo.startsWith('../media') ? photo : `../media/news/${currentArticle.folder}/${photo}`;
    return `<img src="${photoSrc}" alt="Photo ${index + 1}" onerror="this.src='../media/news/ads/kyool_ad_01.jpg'">`;
  }).join('');
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

// Gestion de la notation
function setupRating() {
  const ratingButtons = document.querySelectorAll('.rating-btn');
  const ratingThanks = document.querySelector('.rating-section .rating-thanks');
  
  ratingButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const rating = this.dataset.rating;
      
      // Désactiver tous les boutons
      ratingButtons.forEach(b => b.classList.remove('active'));
      
      // Activer le bouton cliqué
      this.classList.add('active');
      
      // Afficher le message de remerciement
      ratingThanks.style.display = 'block';
      
      // Sauvegarder la notation (localStorage pour l'instant)
      localStorage.setItem(`rating_${currentArticle.id}`, rating);
      
      console.log('Article noté:', rating);
    });
  });
  
  // Charger la notation existante si présente
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
    
    // Envoyer le signalement (pour l'instant en console, à remplacer par un vrai système)
    console.log('Signalement pour article:', currentArticle.id);
    console.log('Message:', reportText);
    
    // Afficher le message de remerciement
    document.getElementById('reportText').style.display = 'none';
    submitReport.style.display = 'none';
    cancelReport.style.display = 'none';
    reportThanks.style.display = 'block';
    
    // Réinitialiser après 3 secondes
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
