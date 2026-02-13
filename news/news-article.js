// NEWS-ARTICLE.JS - Version Magazine avec layouts variés

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
  
  // Corps de l'article avec layouts variés
  displayContentWithMagazineLayout();
  
  // Boutons de partage
  setupShareButtons();
}

// Afficher l'image hero
function displayHero() {
  const heroImage = document.getElementById('heroImage');
  const heroTitle = document.getElementById('heroTitle');
  
  heroImage.src = `../media/news/${currentArticle.folder}/hero.jpg`;
  heroImage.alt = currentArticle.title;
  heroTitle.textContent = currentArticle.title;
  
  // Fallback : hero → cover → ads
  heroImage.onerror = function() {
    this.src = `../media/news/${currentArticle.folder}/${currentArticle.image}`;
    this.onerror = function() {
      this.src = '../media/news/ads/kyool_ad_01.jpg';
    };
  };
}

// Afficher le contenu avec layout magazine
function displayContentWithMagazineLayout() {
  const container = document.getElementById('articleBody');
  const photos = currentArticle.photos || [];
  
  // Séparer le contenu en sections
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = currentArticle.content;
  const elements = Array.from(tempDiv.children);
  
  let finalHTML = '';
  let chapterCount = 0;
  
  elements.forEach((element, index) => {
    // Ajouter l'élément
    finalHTML += element.outerHTML;
    
    // Après chaque <h2>, insérer les photos selon le layout
    if (element.tagName === 'H2') {
      chapterCount++;
      
      // LAYOUT SPÉCIFIQUE PAR CHAPITRE
      switch(chapterCount) {
        case 1:
          // Après chapitre 1 : Photo 1 (format libre)
          if (photos[0]) {
            finalHTML += createSinglePhoto(photos[0], 1);
          }
          break;
          
        case 2:
          // Après chapitre 2 : Photos 2 & 3 côte à côte (1500x2100)
          if (photos[1] && photos[2]) {
            finalHTML += createDuoPhotos(photos[1], photos[2]);
          }
          break;
          
        case 3:
          // Après chapitre 3 : Photo 4 paysage large (1920x720)
          if (photos[3]) {
            finalHTML += createWideLandscapePhoto(photos[3], 4);
          }
          break;
          
        case 4:
          // Après chapitre 4 : Photo 5 standard (1920x1080)
          if (photos[4]) {
            finalHTML += createStandardPhoto(photos[4], 5);
          }
          break;
          
        case 5:
          // Après chapitre 5 : Photos 6, 7, 8 en trio (1500x2100)
          if (photos[5] && photos[6] && photos[7]) {
            finalHTML += createTrioPhotos(photos[5], photos[6], photos[7]);
          }
          break;
          
        case 6:
          // Après chapitre 6 : Photo 9 standard (1920x1080)
          if (photos[8]) {
            finalHTML += createStandardPhoto(photos[8], 9);
          }
          // Puis Photo 10 promo KYOOL (2100x1500)
          if (photos[9]) {
            finalHTML += createPromoPhoto(photos[9], 10);
          }
          break;
      }
    }
  });
  
  container.innerHTML = finalHTML;
}

// LAYOUTS SPÉCIFIQUES

// Photo simple fullwidth
function createSinglePhoto(photo, num) {
  const photoPath = `../media/news/${currentArticle.folder}/${photo}`;
  return `
    <figure class="article-photo single">
      <img src="${photoPath}" alt="Photo ${num}" onerror="this.src='../media/news/ads/kyool_ad_0${(num % 4) + 1}.jpg'">
    </figure>
  `;
}

// Duo de photos verticales côte à côte
function createDuoPhotos(photo1, photo2) {
  const path1 = `../media/news/${currentArticle.folder}/${photo1}`;
  const path2 = `../media/news/${currentArticle.folder}/${photo2}`;
  return `
    <div class="photo-duo">
      <figure class="photo-duo-item">
        <img src="${path1}" alt="Photo 2" onerror="this.src='../media/news/ads/kyool_ad_02.jpg'">
      </figure>
      <figure class="photo-duo-item">
        <img src="${path2}" alt="Photo 3" onerror="this.src='../media/news/ads/kyool_ad_03.jpg'">
      </figure>
    </div>
  `;
}

// Photo paysage large
function createWideLandscapePhoto(photo, num) {
  const photoPath = `../media/news/${currentArticle.folder}/${photo}`;
  return `
    <figure class="article-photo wide-landscape">
      <img src="${photoPath}" alt="Photo ${num}" onerror="this.src='../media/news/ads/kyool_ad_0${(num % 4) + 1}.jpg'">
    </figure>
  `;
}

// Photo standard
function createStandardPhoto(photo, num) {
  const photoPath = `../media/news/${currentArticle.folder}/${photo}`;
  return `
    <figure class="article-photo standard">
      <img src="${photoPath}" alt="Photo ${num}" onerror="this.src='../media/news/ads/kyool_ad_0${(num % 4) + 1}.jpg'">
    </figure>
  `;
}

// Trio de photos verticales
function createTrioPhotos(photo1, photo2, photo3) {
  const path1 = `../media/news/${currentArticle.folder}/${photo1}`;
  const path2 = `../media/news/${currentArticle.folder}/${photo2}`;
  const path3 = `../media/news/${currentArticle.folder}/${photo3}`;
  return `
    <div class="photo-trio">
      <figure class="photo-trio-item">
        <img src="${path1}" alt="Photo 6" onerror="this.src='../media/news/ads/kyool_ad_02.jpg'">
      </figure>
      <figure class="photo-trio-item">
        <img src="${path2}" alt="Photo 7" onerror="this.src='../media/news/ads/kyool_ad_03.jpg'">
      </figure>
      <figure class="photo-trio-item">
        <img src="${path3}" alt="Photo 8" onerror="this.src='../media/news/ads/kyool_ad_04.jpg'">
      </figure>
    </div>
  `;
}

// Photo promo KYOOL en bas
function createPromoPhoto(photo, num) {
  const photoPath = `../media/news/${currentArticle.folder}/${photo}`;
  return `
    <figure class="article-photo promo">
      <img src="${photoPath}" alt="Découvrez nos programmes KYOOL" onerror="this.src='../media/news/ads/kyool_ad_01.jpg'">
      <figcaption>Découvrez nos programmes sur KYOOL</figcaption>
    </figure>
  `;
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
