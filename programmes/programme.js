// PROGRAMME.JS - Gestion de la page fiche programme (VERSION FINALE)

let currentProgramme = null;
let allProgrammes = [];
let currentIndex = -1;

// Liste de tous les IDs de programmes (à maintenir à jour)
const ALL_PROGRAMME_IDS = [
  'My-mans-smartphone',
  // Ajouter les nouveaux IDs ici au fur et à mesure
];

// Charger le programme depuis l'URL
async function loadProgramme() {
  const urlParams = new URLSearchParams(window.location.search);
  const programmeId = urlParams.get('id');
  
  if (!programmeId) {
    window.location.href = '../programmes.html';
    return;
  }
  
  try {
    // Charger le JSON depuis le dossier du programme
    const jsonPath = `../media/fiche-programmes/${programmeId}/programme-data.json`;
    const response = await fetch(jsonPath);
    
    if (!response.ok) {
      console.error('Programme non trouvé:', programmeId);
      window.location.href = '../programmes.html';
      return;
    }
    
    currentProgramme = await response.json();
    currentProgramme.id = programmeId;
    currentProgramme.slug = programmeId;
    
    // Charger tous les programmes pour les recommandations
    await loadAllProgrammes();
    
    // Trouver l'index du programme actuel
    currentIndex = allProgrammes.findIndex(p => p.id === programmeId);
    
    displayProgramme();
    displayRecommendations();
    setupNavigation();
    setupYoutubeModal();
  } catch (error) {
    console.error('Erreur de chargement du programme:', error);
    window.location.href = '../programmes.html';
  }
}

// Charger tous les programmes pour les recommandations
async function loadAllProgrammes() {
  allProgrammes = [];
  
  for (const id of ALL_PROGRAMME_IDS) {
    try {
      const response = await fetch(`../media/fiche-programmes/${id}/programme-data.json`);
      if (response.ok) {
        const prog = await response.json();
        prog.id = id;
        prog.slug = id;
        allProgrammes.push(prog);
      }
    } catch (error) {
      console.error(`Erreur chargement ${id}:`, error);
    }
  }
}

// Extraire l'ID YouTube depuis différents formats d'URL
function extractYouTubeID(url) {
  if (!url) return null;
  
  // Formats supportés:
  // https://www.youtube.com/watch?v=VIDEO_ID
  // https://youtu.be/VIDEO_ID
  // https://www.youtube.com/embed/VIDEO_ID
  // https://www.youtube.com/watch?v=VIDEO_ID&list=...
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
    /youtube\.com\/watch\?.*v=([^&]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

// Afficher le programme
function displayProgramme() {
  // Titre de la page
  document.getElementById('programmeTitle').textContent = currentProgramme.titre + ' — KYOOL';
  document.getElementById('breadcrumbTitle').textContent = currentProgramme.titre;
  
  // Titre principal
  document.getElementById('mainTitle').textContent = currentProgramme.titre;
  
  // HERO : 3 images côte à côte
  const basePath = `../media/fiche-programmes/${currentProgramme.slug}/`;
  
  // Image 1 : Paysage (1920x720)
  document.getElementById('heroImage1').src = basePath + 'image_1920x720.jpg';
  document.getElementById('heroImage1').alt = currentProgramme.titre;
  
  // Image 2 : Portrait (1500x2100)
  document.getElementById('heroImage2').src = basePath + 'image_1500x2100.jpg';
  document.getElementById('heroImage2').alt = currentProgramme.titre;
  
  // Image 3 : Portrait grand (2100x1500)
  document.getElementById('heroImage3').src = basePath + 'image_2100x1500.jpg';
  document.getElementById('heroImage3').alt = currentProgramme.titre;
  
  // Synopsis
  document.getElementById('pitchText').textContent = currentProgramme.pitch || 'Non renseigné';
  document.getElementById('resumeText').textContent = currentProgramme.resume || 'Non renseigné';
  
  // Métadonnées
  document.getElementById('titreOriginalText').textContent = currentProgramme.titreOriginal || 'Non renseigné';
  document.getElementById('themesText').textContent = currentProgramme.themes || 'Non renseigné';
  document.getElementById('langueText').textContent = currentProgramme.langue || 'Coréen';
  document.getElementById('sousTitresText').textContent = currentProgramme.sousTitres || 'Français, Anglais';
  document.getElementById('anneeDiffusionText').textContent = currentProgramme.anneeDiffusion || 'Non renseigné';
  document.getElementById('publicText').textContent = currentProgramme.categoriesPublic || 'Non renseigné';
  
  // Équipe créative
  document.getElementById('realisateurText').textContent = currentProgramme.realisateur || 'Non renseigné';
  document.getElementById('scenaristeText').textContent = currentProgramme.scenariste || 'Non renseigné';
  document.getElementById('producteurText').textContent = currentProgramme.producteur || 'Non renseigné';
  document.getElementById('castingText').textContent = currentProgramme.casting || 'Non renseigné';
  
  // Droits
  document.getElementById('droitsText').textContent = currentProgramme.detenteursDroits || 'Non renseigné';
  
  // Bande-annonce avec thumbnail cliquable (NOUVELLE VERSION - ouvre modal)
  const trailerUrl = currentProgramme.bandeAnnonce || 'https://www.youtube.com/watch?v=HDSv3CddkjE';
  const youtubeID = extractYouTubeID(trailerUrl);
  const thumbnailPath = basePath + 'image_1920x1080.jpg';

  if (youtubeID) {
    document.getElementById('trailerContainer').innerHTML = `
      <div class="trailer-thumbnail" style="position: relative; width: 100%; height: 100%; cursor: pointer;" onclick="openYouTubeModal('${youtubeID}')">
        <img src="${thumbnailPath}" alt="Bande-annonce" style="width: 100%; height: 100%; object-fit: cover;">
        <div class="play-button" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80px; height: 80px; background: rgba(255,0,0,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    `;
  } else {
    // Fallback si l'URL n'est pas valide
    document.getElementById('trailerContainer').innerHTML = `
      <div style="padding: 40px; text-align: center; color: rgba(255,255,255,.7);">
        <p>Bande-annonce non disponible</p>
      </div>
    `;
  }
  
  // Titre dynamique dans le bloc QR codes
  document.getElementById('qrProgrammeTitle').textContent = currentProgramme.titre;
  
  // Mots-clés
  displayMotsCles();
  
  // SEO Meta Tags (avec vérification pour éviter les erreurs)
  try {
    const metaDescription = document.getElementById('metaDescription');
    const metaKeywords = document.getElementById('metaKeywords');
    const ogTitle = document.getElementById('ogTitle');
    const ogDescription = document.getElementById('ogDescription');
    const ogImage = document.getElementById('ogImage');

    if (metaDescription) metaDescription.content = currentProgramme.pitch || '';
    if (metaKeywords) metaKeywords.content = currentProgramme.motsCles || '';
    if (ogTitle) ogTitle.content = currentProgramme.titre + ' — KYOOL';
    if (ogDescription) ogDescription.content = currentProgramme.pitch || '';
    if (ogImage) ogImage.content = basePath + 'image_1920x1080.jpg';
  } catch (error) {
    console.log('Meta tags SEO non trouvés');
  }
}

// Fonction pour ouvrir la modal YouTube
window.openYouTubeModal = function(videoID) {
  const modal = document.getElementById('youtubeModal');
  const iframe = document.getElementById('youtubeIframe');
  
  // Paramètres YouTube pour optimiser l'expérience
  // rel=0 : Ne pas montrer de vidéos suggérées d'autres chaînes
  // modestbranding=1 : Logo YouTube discret
  // autoplay=1 : Démarre automatiquement
  // fs=1 : Plein écran autorisé
  const embedUrl = `https://www.youtube.com/embed/${videoID}?autoplay=1&rel=0&modestbranding=1&fs=1`;
  
  iframe.src = embedUrl;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Empêche le scroll
};

// Fonction pour fermer la modal YouTube
function closeYouTubeModal() {
  const modal = document.getElementById('youtubeModal');
  const iframe = document.getElementById('youtubeIframe');
  
  modal.classList.remove('active');
  iframe.src = ''; // Arrête la vidéo
  document.body.style.overflow = ''; // Réactive le scroll
}

// Configuration de la modal YouTube
function setupYoutubeModal() {
  const modal = document.getElementById('youtubeModal');
  const closeBtn = document.querySelector('.youtube-modal-close');
  const overlay = document.querySelector('.youtube-modal-overlay');
  
  // Fermer avec le bouton X
  if (closeBtn) {
    closeBtn.addEventListener('click', closeYouTubeModal);
  }
  
  // Fermer en cliquant sur l'overlay (fond noir)
  if (overlay) {
    overlay.addEventListener('click', closeYouTubeModal);
  }
  
  // Fermer avec la touche Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeYouTubeModal();
    }
  });
}

// Afficher les mots-clés
function displayMotsCles() {
  const container = document.getElementById('motsClesContainer');
  const motsCles = currentProgramme.motsCles || '';
  
  if (!motsCles) {
    container.innerHTML = '<p style="color: rgba(255,255,255,.6); font-size: 14px;">Aucun mot-clé</p>';
    return;
  }
  
  // Séparer les mots-clés par ";" et créer des badges
  const cles = motsCles.split(';').map(c => c.trim()).filter(c => c);
  
  container.innerHTML = cles.map(cle => 
    `<span class="mot-cle">${cle}</span>`
  ).join('');
}

// Afficher les recommandations basées sur les thèmes
function displayRecommendations() {
  const container = document.getElementById('recommendationsGrid');
  
  // Extraire les thèmes du programme actuel
  const currentThemes = (currentProgramme.themes || '').toLowerCase().split(',').map(t => t.trim());
  
  // Trouver les programmes avec des thèmes similaires
  const recommendations = allProgrammes
    .filter(p => p.id !== currentProgramme.id)
    .filter(p => {
      const themes = (p.themes || '').toLowerCase().split(',').map(t => t.trim());
      return themes.some(theme => currentThemes.includes(theme));
    })
    .slice(0, 4);
  
  if (recommendations.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,.7); grid-column: 1/-1;">Aucune recommandation disponible</p>';
    return;
  }
  
  container.innerHTML = recommendations.map(prog => {
    const imagePath = `../media/fiche-programmes/${prog.slug}/image_1500x2100.jpg`;
    const firstTheme = prog.themes ? prog.themes.split(',')[0].trim() : '';
    
    return `
      <a href="programme-fiche.html?id=${prog.id}" class="recommendation-card">
        <div class="recommendation-image">
          <img src="${imagePath}" alt="${prog.titre}" onerror="this.src='../media/kyool-mascot.png'">
          <div class="recommendation-overlay">
            <h3 class="recommendation-title">${prog.titre}</h3>
            <p class="recommendation-theme">${firstTheme}</p>
          </div>
        </div>
      </a>
    `;
  }).join('');
}

// Navigation entre programmes
function setupNavigation() {
  const prevBtn = document.getElementById('prevProgramme');
  const nextBtn = document.getElementById('nextProgramme');
  
  if (currentIndex > 0) {
    const prevProgramme = allProgrammes[currentIndex - 1];
    prevBtn.href = `programme-fiche.html?id=${prevProgramme.id}`;
    prevBtn.textContent = `← ${prevProgramme.titre}`;
  } else {
    prevBtn.style.display = 'none';
  }
  
  if (currentIndex < allProgrammes.length - 1) {
    const nextProgramme = allProgrammes[currentIndex + 1];
    nextBtn.href = `programme-fiche.html?id=${nextProgramme.id}`;
    nextBtn.textContent = `${nextProgramme.titre} →`;
  } else {
    nextBtn.style.display = 'none';
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
  loadProgramme();
});
