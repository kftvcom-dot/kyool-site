// PROGRAMMES-CATEGORIE.JS - Page "Tout explorer" (VERSION 4)
// Avec hero images dynamiques

let allProgrammes = [];
let filteredProgrammes = [];
let currentCategorie = null;

// Configuration des catégories avec hero images
const CATEGORIES_CONFIG = {
  'short-drama-vertical': {
    title: 'Short Drama Vertical',
    description: 'Découvrez la nouvelle tendance des short dramas verticaux ! Format court, addictif, parfaitement adapté à votre smartphone. De nombreux épisodes GRATUITS disponibles sur KYOOL — téléchargez l\'application maintenant !',
    jsonFile: 'short-drama-vertical.json',
    heroImage: 'categorie-01.jpg'
  },
  'drama-web-drama': {
    title: 'Drama & Web-Drama',
    description: 'Plongez dans les dramas et web-dramas coréens les plus captivants. Des histoires intenses, émouvantes et inoubliables vous attendent.',
    jsonFile: 'drama-web-drama.json',
    heroImage: 'categorie-02.jpg'
  },
  'film-short-film-animation': {
    title: 'Film & Short Film & Animation',
    description: 'Cinéma coréen d\'exception : longs métrages, courts métrages et animations qui ont marqué l\'industrie.',
    jsonFile: 'film-short-film-animation.json',
    heroImage: 'categorie-03.jpg'
  },
  'gl-girls-love': {
    title: 'GL (Girls Love)',
    description: 'Des histoires d\'amour entre femmes touchantes et authentiques. Le meilleur du Girls Love coréen.',
    jsonFile: 'gl-girls-love.json',
    heroImage: 'categorie-04.jpg'
  },
  'kyool-original': {
    title: 'KYOOL Original',
    description: 'Les productions exclusives KYOOL ! Du contenu original créé spécialement pour vous.',
    jsonFile: 'kyool-original.json',
    heroImage: 'categorie-05.jpg'
  },
  'documentaire': {
    title: 'Documentaire',
    description: 'Documentaires fascinants sur la culture coréenne, son histoire et ses personnalités.',
    jsonFile: 'documentaire.json',
    heroImage: 'categorie-06.jpg'
  },
  'tv-shows': {
    title: 'TV Shows',
    description: 'Émissions de télévision, talk-shows et programmes de variétés coréens à ne pas manquer.',
    jsonFile: 'tv-shows.json',
    heroImage: 'categorie-07.jpg'
  },
  'bl-boys-love': {
    title: 'BL (Boys Love)',
    description: 'Bientôt disponible ! Les meilleurs Boys Love coréens arrivent prochainement sur KYOOL.',
    jsonFile: 'bl-boys-love.json',
    heroImage: 'categorie-01.jpg', // Image par défaut
    comingSoon: true
  }
};

// Récupérer la catégorie depuis l'URL
function getCategorieFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('cat');
}

// Charger l'image hero selon la catégorie
function loadHeroImage(categorieSlug) {
  const heroImageElement = document.getElementById('categoryHeroImage');
  const config = CATEGORIES_CONFIG[categorieSlug];
  
  if (config && config.heroImage) {
    const imagePath = `../media/categories/hero/${config.heroImage}`;
    heroImageElement.src = imagePath;
    heroImageElement.alt = `Hero ${config.title}`;
    
    // Fallback si l'image n'existe pas
    heroImageElement.onerror = function() {
      console.warn(`Image hero non trouvée: ${imagePath}`);
      this.src = '../media/hero_pour_presentation_prgramme.jpg'; // Image par défaut
    };
  }
}
// Afficher le loader pendant le chargement
function showLoader() {
  const grid = document.getElementById('programmesGrid');
  const resultsCount = document.getElementById('resultsCount');
  
  // Afficher "Chargement..." dans le compteur
  resultsCount.textContent = '...';
  
  // Afficher le loader dans la grille
  grid.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 100px 20px;">
      <div style="display: inline-block; width: 60px; height: 60px; border: 4px solid rgba(36,199,235,.3); border-top-color: var(--kyool-blue); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
      <p style="font-size: 20px; color: var(--kyool-blue); font-weight: 700;">Chargement des programmes en cours...</p>
      <p style="font-size: 16px; color: rgba(255,255,255,.7); margin-top: 10px;">Veuillez patienter quelques instants ⏳</p>
    </div>
  `;
}
// Charger les données de la catégorie
async function loadCategorie() {
  const catSlug = getCategorieFromURL();
  
  if (!catSlug || !CATEGORIES_CONFIG[catSlug]) {
    console.error('Catégorie invalide:', catSlug);
    window.location.href = '../programmes.html';
    return;
  }
  
  currentCategorie = CATEGORIES_CONFIG[catSlug];
  
  // Charger l'image hero
  loadHeroImage(catSlug);
  
  // Mettre à jour le titre de la page
  document.getElementById('pageTitle').textContent = currentCategorie.title + ' — KYOOL';
  document.getElementById('breadcrumbTitle').textContent = currentCategorie.title;
  document.getElementById('categorieTitle').textContent = currentCategorie.title;
  document.getElementById('categorieDescription').textContent = currentCategorie.description;
  
  // ===== AJOUTER CETTE LIGNE (NOUVEAU) ===== ↓↓↓
  showLoader();
  // ========================================== ↑↑↑
  
  // Si catégorie "bientôt disponible", afficher message
  if (currentCategorie.comingSoon) {
    displayComingSoon();
    return;
  }
  
  // Charger la liste des IDs depuis le JSON
  let programmeIds = [];
  try {
    const response = await fetch(`../media/categories/${currentCategorie.jsonFile}`);
    if (!response.ok) {
      console.error('Fichier JSON non trouvé:', currentCategorie.jsonFile);
      programmeIds = [];
    } else {
      const data = await response.json();
      programmeIds = data.programmes || [];
    }
  } catch (error) {
    console.error('Erreur chargement JSON:', error);
    programmeIds = [];
  }
  
  // Charger les données complètes de chaque programme
  allProgrammes = [];
  for (const id of programmeIds) {
    try {
      const response = await fetch(`../media/fiche-programmes/${id}/programme-data.json`);
      if (response.ok) {
        const programmeData = await response.json();
        allProgrammes.push({
          id: id,
          titre: programmeData.titre,
          pitch: programmeData.pitch || '',
          themes: programmeData.themes || ''
        });
      } else {
        console.error(`Programme non trouvé: ${id}`);
      }
    } catch (error) {
      console.error(`Erreur chargement ${id}:`, error);
    }
  }
  
  // Trier par ordre alphabétique
  allProgrammes.sort((a, b) => a.titre.localeCompare(b.titre, 'fr'));
  
  // Afficher tous les programmes
  filteredProgrammes = [...allProgrammes];
  displayProgrammes();
  updateResultsCount();
}

// Configuration de la recherche
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  
  if (!searchInput) return;
  
  // Recherche en temps réel
  searchInput.addEventListener('input', (e) => {
    searchProgrammes(e.target.value);
  });
  
  // Effacer avec Escape
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      searchProgrammes('');
    }
  });
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
  loadCategorie();
  setupSearch();
});
