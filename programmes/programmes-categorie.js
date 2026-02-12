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

// Afficher message "Bientôt disponible"
function displayComingSoon() {
  const grid = document.getElementById('programmesGrid');
  const noResults = document.getElementById('noResults');
  const searchSection = document.querySelector('.search-section');
  
  // Masquer la recherche
  searchSection.style.display = 'none';
  
  // Afficher message
  grid.style.display = 'none';
  noResults.style.display = 'block';
  noResults.innerHTML = `
    <div style="padding: 100px 20px; text-align: center;">
      <h2 style="font-size: 36px; color: var(--kyool-blue); margin-bottom: 24px;">🎬 Bientôt disponible !</h2>
      <p style="font-size: 20px; color: rgba(255,255,255,.85); max-width: 600px; margin: 0 auto; line-height: 1.7;">
        La catégorie ${currentCategorie.title} arrive prochainement sur KYOOL avec des contenus exclusifs.
        Restez connectés !
      </p>
    </div>
  `;
}

// Afficher les programmes
function displayProgrammes() {
  const grid = document.getElementById('programmesGrid');
  const noResults = document.getElementById('noResults');

    // AJOUTER CES LIGNES (NOUVEAU) ↓↓↓
  // Afficher un loader pendant le chargement
  if (filteredProgrammes.length === 0 && allProgrammes.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 100px 20px;">
        <div style="display: inline-block; width: 60px; height: 60px; border: 4px solid rgba(36,199,235,.3); border-top-color: var(--kyool-blue); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
        <p style="font-size: 20px; color: var(--kyool-blue); font-weight: 700;">Chargement des programmes en cours...</p>
        <p style="font-size: 16px; color: rgba(255,255,255,.7); margin-top: 10px;">Veuillez patienter quelques instants</p>
      </div>
    `;
    return;
  }
  // FIN DU NOUVEAU CODE ↑↑↑
  
  if (filteredProgrammes.length === 0) {
    grid.style.display = 'none';
    noResults.style.display = 'block';
    noResults.innerHTML = `
      <p>Aucun programme trouvé pour votre recherche.</p>
    `;
    return;
  }
  
  grid.style.display = 'grid';
  noResults.style.display = 'none';
  
  grid.innerHTML = filteredProgrammes.map(prog => {
    const imagePath = `../media/fiche-programmes/${prog.id}/image_1500x2100.jpg`;
    
    return `
      <a href="programme-fiche.html?id=${prog.id}" class="programme-card">
        <div class="programme-image">
          <img src="${imagePath}" alt="${prog.titre}" onerror="this.src='../media/kyool-mascot.png'">
          <div class="programme-overlay">
            <h3 class="programme-title">${prog.titre}</h3>
            <span class="programme-link">En savoir plus →</span>
          </div>
        </div>
      </a>
    `;
  }).join('');
}

// Mettre à jour le compteur de résultats
function updateResultsCount() {
  document.getElementById('resultsCount').textContent = filteredProgrammes.length;
}

// Fonction de recherche
function searchProgrammes(query) {
  const searchTerm = query.toLowerCase().trim();
  
  if (searchTerm === '') {
    filteredProgrammes = [...allProgrammes];
  } else {
    filteredProgrammes = allProgrammes.filter(prog => 
      prog.titre.toLowerCase().includes(searchTerm) ||
      prog.pitch.toLowerCase().includes(searchTerm) ||
      prog.themes.toLowerCase().includes(searchTerm)
    );
  }
  
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
