// NEWS-ARTICLE.JS - Version Magazine CORRIGÉE

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
  
  // Corps de l'article avec layouts variés (photos 1-9)
  displayContentWithMagazineLayout();
  
  // Photo 10 promo KYOOL APRÈS l'article
  displayPromoPhoto();
  
  // Boutons de partage
  setupShareButtons();
  
  // Système de notation et signalement
  setupRating();
  setupReport();
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

// Afficher le contenu avec layout magazine (photos 1-9 seulement)
function displayContentWithMagazineLayout() {
  const container = document.getElementById('articleBody');
  const photos = currentArticle.photos || [];
  const chapters = currentArticle.chapters || [];
  
  let finalHTML = '';
  
  // AFFICHER L'INTRO (si présente)
  if (currentArticle.intro) {
    finalHTML += `<div class="article-intro">${currentArticle.intro}</div>`;
  }
  
  // AFFICHER CHAQUE CHAPITRE
  chapters.forEach((chapter, index) => {
    const chapterNum = index + 1;
    
    // Titre du chapitre
    finalHTML += `<h2 class="chapter-title">${chapter.title}</h2>`;
    
    // Contenu du chapitre
    finalHTML += chapter.content;
    
    // Insérer les photos selon le chapitre
    switch(chapterNum) {
      case 1:
        if (photos[0]) {
          finalHTML += createSinglePhoto(photos[0], 1);
        }
        break;
      case 2:
        if (photos[1] && photos[2]) {
          finalHTML += createDuoPhotos(photos[1], photos[2]);
        }
        break;
      case 3:
        if (photos[3]) {
          finalHTML += createWideLandscapePhoto(photos[3], 4);
        }
        break;
      case 4:
        if (photos[4]) {
          finalHTML += createStandardPhoto(photos[4], 5);
        }
        break;
      case 5:
        if (photos[5] && photos[6] && photos[7]) {
          finalHTML += createTrioPhotos(photos[5], photos[6], photos[7]);
        }
        break;
      case 6:
        if (photos[8]) {
          finalHTML += createStandardPhoto(photos[8], 9);
        }
        break;
    }
  });
  
  // SIGNATURE JOURNALISTE
  finalHTML += `
    <div class="article-signature">
      <div class="signature-line"></div>
      <p class="signature-text">
        <strong>${currentArticle.journalist}</strong><br>
        Journaliste KYOOL News
      </p>
    </div>
  `;
  
  container.innerHTML = finalHTML;
}

// Afficher la photo 10 (devient 10-11-12) promo APRÈS l'article (dans une section séparée)
function displayPromoPhoto() {
  const photos = currentArticle.photos || [];
  const promoContainer = document.getElementById('promoPhotoContainer');
  
  if (!promoContainer) return;
  
  // TRIO de photos 6, 7, 8 (indices 5, 6, 7)
  if (photos[5] && photos[6] && photos[7]) {
    const path6 = `../media/news/${currentArticle.folder}/${photos[5]}`;
    const path7 = `../media/news/${currentArticle.folder}/${photos[6]}`;
    const path8 = `../media/news/${currentArticle.folder}/${photos[7]}`;
    
    promoContainer.innerHTML = `
      <div class="wrap">
        <div class="promo-trio-container">
          <h2 class="promo-title">Découvrez nos programmes KYOOL</h2>
          <div class="promo-trio">
            <figure class="promo-trio-item">
              <img src="${path6}" alt="Programme 1">
            </figure>
            <figure class="promo-trio-item">
              <img src="${path7}" alt="Programme 2">
            </figure>
            <figure class="promo-trio-item">
              <img src="${path8}" alt="Programme 3">
            </figure>
          </div>
          <a href="../programmes.html" class="promo-btn">
            <span>🎬 Voir tous nos programmes</span>
            <span class="arrow">→</span>
          </a>
        </div>
      </div>
    `;
  }
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
  const heroImage = `${window.location.origin}/media/news/${currentArticle.folder}/hero.jpg`;
  const excerpt = currentArticle.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  
  // Texte enrichi pour partage
  const text = `📰 ${title}

✍️ Par ${currentArticle.journalist}
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
  
  // Instagram (copie le texte + ouvre Instagram)
  document.getElementById('shareInstagram').addEventListener('click', function(e) {
    e.preventDefault();
    const instagramText = `${text}

🔗 ${url}`;
    
    // Copier dans le presse-papiers
    navigator.clipboard.writeText(instagramText).then(() => {
      alert('✅ Texte copié ! Ouvrez Instagram et collez-le dans votre story ou post.');
      // Ouvrir Instagram
      window.open('https://www.instagram.com/', '_blank');
    }).catch(() => {
      alert('❌ Impossible de copier. Copiez manuellement le texte ci-dessous :\n\n' + instagramText);
    });
  });
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
  // setupRating();
  // setupReport();
});
