// PROGRAMME.JS - VERSION PROPRE ET FONCTIONNELLE
// ✅ Support : YouTube classique + YouTube Shorts + TikTok + Instagram

let currentProgramme = null;
let allProgrammes = [];
let currentIndex = -1;

// Liste complète de tous les programmes
const ALL_PROGRAMME_IDS = [
  '3-sec-daiting-real-dm-s01',
  '3-sec-daiting-real-dm-s02',
  '48-days-later',
  'My-mans-smartphone',
  'a-boy-and-sungreen',
  'a-company-like-john',
  'a-contracting-school',
  'a-quiet-dream',
  'aancod-street-concert',
  'acquaintance-woman',
  'along-the-dotted-line',
  'another-miss-oh',
  'antarctic-journal',
  'banseom-pirates-seoul-inferno',
  'because-i-want-to-talk',
  'becoming-the-monarch',
  'belle-ville',
  'bloody-blossom',
  'bori',
  'bts-variety-chronicles',
  'camouflage',
  'casa-amor-exclusive-for-ladies',
  'chapter1-sinmyeong-awaken',
  'chapter2-yin-and-yang',
  'chapter3-kut-ritual',
  'chicken-game',
  'christmas-in-august',
  'cohabitation-101',
  'dances-with-the-wind',
  'dear-x',
  'derailed',
  'dongju-the-portrait-of-a-poet',
  'drama_rama',
  'duet',
  'elise-ducamp-quelque-chose-de-coree-du-sud',
  'fengshui',
  'finally-got-romanced',
  'flirting-with-the-intp',
  'floral-odyssey',
  'girlfriend-project-day-1',
  'gods-guest',
  'gwangjang-market',
  'gyeongju',
  'hitchhiker',
  'i-married-my-exs-brother',
  'il-mare',
  'inkigayo',
  'jane',
  'jeronimo',
  'juror-8',
  'kai',
  'keep-fantasizing-about-me',
  'korean_music_games',
  'le-grand-chef',
  'le-parfum-du-sang',
  'les-films-coreens-qui-ont-marque-ma-vie-partie1',
  'les-films-coreens-qui-ont-marque-ma-vie-partie2',
  'little-forest',
  'live-hard',
  'live-to-die-die-to-live',
  'long-live-the-king',
  'love-as-you-taste',
  'love-perfume',
  'love-tech',
  'marriage-blue',
  'medical-scandal',
  'microhabitat',
  'miss-baek',
  'miss-of-the-day',
  'moi-et-la-coree',
  'more-than-or-equal-to-75-celsius',
  'my-girlfriend-is-an-agent',
  'my-little-old-boy',
  'my-ordinary-love-story',
  'namnam-buknyeo',
  'national-security',
  'night-portrait',
  'no-bother-me',
  'november-will-be-may',
  'on-your-wedding-day',
  'one-shot',
  'our-body',
  'our-love-story',
  'paju',
  'phantom-school',
  'portraits-de-femmes-coreennes-shin-mi-he',
  'rencontre-avec-eric-nam',
  'rencontre-avec-rocky',
  'retweet',
  'run-off',
  'running-man',
  'running-mate',
  'school-nurses-files',
  'schoolgirl-detectives',
  'secret-sunshine',
  'shake-it',
  'socialphobia',
  'somebody',
  'sori-voice-from-the-heart',
  'sparkling-girls',
  'spring-day',
  'still-human',
  'sudden-death-match',
  'survival-island-the-last-girl-standing',
  'sweet-sixteen',
  'the-after-party',
  'the-bird-who-stops-in-the-air',
  'the-call',
  'the-classic',
  'the-client',
  'the-day-i-died-unclosed-case',
  'the-eighth-night',
  'the-fake',
  'the-guy-with-the-weird-stutter',
  'the-king-of-pigs',
  'the-merciless',
  'the-most-beautiful-divorce',
  'the-net',
  'the-royal-tailor',
  'the-seed-of-violence',
  'the-terror-live',
  'the-throne',
  'the-truth-beneath',
  'the-unfair',
  'the-wicked',
  'time-to-hunt'
];

async function loadProgramme() {
  const urlParams = new URLSearchParams(window.location.search);
  const programmeId = urlParams.get('id');
  
  if (!programmeId) {
    console.error('Aucun ID de programme fourni');
    window.location.href = '../programmes.html';
    return;
  }
  
  try {
    const response = await fetch(`../media/fiches-programmes/${programmeId}.json`);
    
    if (!response.ok) {
      throw new Error(`Programme non trouvé: ${programmeId}`);
    }
    
    currentProgramme = await response.json();
    
    currentIndex = ALL_PROGRAMME_IDS.indexOf(programmeId);
    
    displayProgramme();
    setupYoutubeModal();
    
    await loadAllProgrammes();
    
    displayRecommendations();
    
    await setupNavigation();
    
  } catch (error) {
    console.error('Erreur chargement programme:', error);
    window.location.href = '../programmes.html';
  }
}

async function loadAllProgrammes() {
  const promises = ALL_PROGRAMME_IDS.map(async id => {
    try {
      const response = await fetch(`../media/fiches-programmes/${id}.json`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.log(`Programme ${id} non trouvé`);
    }
    return null;
  });
  
  const results = await Promise.all(promises);
  allProgrammes = results.filter(p => p !== null);
  
  console.log(`✅ ${allProgrammes.length} programmes chargés pour les recommandations`);
}

// ===========================
// EXTRACTION D'ID VIDÉOS
// ===========================

function extractYouTubeID(url) {
  if (!url) return null;
  
  const patterns = [
    // YouTube classique
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
    /youtube\.com\/watch\?.*v=([^&]+)/,
    // YouTube Shorts
    /youtube\.com\/shorts\/([^&\?\/]+)/,
    /youtu\.be\/shorts\/([^&\?\/]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

function extractTikTokID(url) {
  if (!url) return null;
  
  const patterns = [
    /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
    /tiktok\.com\/v\/(\d+)/,
    /vm\.tiktok\.com\/([\w]+)/,
    /vt\.tiktok\.com\/([\w]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

function extractInstagramID(url) {
  if (!url) return null;
  
  const patterns = [
    /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/tv\/([A-Za-z0-9_-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

function extractTwitterID(url) {
  if (!url) return null;
  
  const patterns = [
    /(?:twitter\.com|x\.com)\/[\w]+\/status\/(\d+)/,
    /(?:twitter\.com|x\.com)\/i\/status\/(\d+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

function detectVideoType(url) {
  if (!url) return null;
  
  // YouTube (classique et Shorts)
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const id = extractYouTubeID(url);
    if (id) {
      return { type: 'youtube', id: id };
    }
  }
  
  // TikTok
  if (url.includes('tiktok.com')) {
    const id = extractTikTokID(url);
    if (id) {
      return { type: 'tiktok', id: id };
    }
  }
  
  // Instagram
  if (url.includes('instagram.com')) {
    const id = extractInstagramID(url);
    if (id) {
      return { type: 'instagram', id: id };
    }
  }
  
  // X/Twitter
  if (url.includes('twitter.com') || url.includes('x.com')) {
    const id = extractTwitterID(url);
    if (id) {
      return { type: 'twitter', id: id };
    }
  }
  
  return null;
}

// ===========================
// AFFICHAGE DU PROGRAMME
// ===========================

function displayProgramme() {
  document.getElementById('programmeTitle').textContent = currentProgramme.titre + ' — KYOOL';
  document.getElementById('breadcrumbTitle').textContent = currentProgramme.titre;
  document.getElementById('mainTitle').textContent = currentProgramme.titre;
  
  const basePath = `../media/fiche-programmes/${currentProgramme.slug}/`;
  
  document.getElementById('heroImage1').src = basePath + 'image_1920x720.jpg';
  document.getElementById('heroImage1').alt = currentProgramme.titre;
  
  document.getElementById('heroImage2').src = basePath + 'image_1500x2100.jpg';
  document.getElementById('heroImage2').alt = currentProgramme.titre;
  
  document.getElementById('heroImage3').src = basePath + 'image_2100x1500.jpg';
  document.getElementById('heroImage3').alt = currentProgramme.titre;
  
  document.getElementById('pitchText').textContent = currentProgramme.pitch || 'Non renseigné';
  document.getElementById('resumeText').textContent = currentProgramme.resume || 'Non renseigné';
  
  document.getElementById('titreOriginalText').textContent = currentProgramme.titreOriginal || 'Non renseigné';
  document.getElementById('themesText').textContent = currentProgramme.themes || 'Non renseigné';
  document.getElementById('langueText').textContent = currentProgramme.langue || 'Coréen';
  document.getElementById('sousTitresText').textContent = currentProgramme.sousTitres || 'Français, Anglais';
  document.getElementById('anneeDiffusionText').textContent = currentProgramme.anneeDiffusion || 'Non renseigné';
  document.getElementById('publicText').textContent = currentProgramme.categoriesPublic || 'Non renseigné';
  
  document.getElementById('realisateurText').textContent = currentProgramme.realisateur || 'Non renseigné';
  document.getElementById('scenaristeText').textContent = currentProgramme.scenariste || 'Non renseigné';
  document.getElementById('producteurText').textContent = currentProgramme.producteur || 'Non renseigné';
  document.getElementById('castingText').textContent = currentProgramme.casting || 'Non renseigné';
  
  document.getElementById('droitsText').textContent = currentProgramme.detenteursDroits || 'Non renseigné';
  
  // ✅ Gestion universelle des vidéos
  const trailerUrl = currentProgramme.bandeAnnonce || 'https://www.youtube.com/@KoreanFrenchTeleVision';
  const videoInfo = detectVideoType(trailerUrl);
  const thumbnailPath = basePath + 'image_1920x1080.jpg';

  if (videoInfo) {
    // Vidéo supportée (YouTube, TikTok, Instagram)
    document.getElementById('trailerContainer').innerHTML = `
      <div class="trailer-thumbnail" style="position: relative; width: 100%; height: 100%; cursor: pointer;" onclick="openVideoModal('${videoInfo.type}', '${videoInfo.id}')">
        <img src="${thumbnailPath}" alt="Bande-annonce" style="width: 100%; height: 100%; object-fit: cover;">
        <div class="play-button" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80px; height: 80px; background: rgba(255,0,0,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    `;
  } else {
    // Lien non supporté - ouvrir dans un nouvel onglet
    document.getElementById('trailerContainer').innerHTML = `
      <div class="trailer-thumbnail" style="position: relative; width: 100%; height: 100%; cursor: pointer;" onclick="window.open('${trailerUrl}', '_blank')">
        <img src="${thumbnailPath}" alt="Bande-annonce" style="width: 100%; height: 100%; object-fit: cover;">
        <div class="play-button" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80px; height: 80px; background: rgba(255,0,0,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    `;
  }
  
  document.getElementById('qrProgrammeTitle').textContent = currentProgramme.titre;
  
  displayMotsCles();
  
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

// ===========================
// MODALE VIDÉO UNIVERSELLE
// ===========================

window.openVideoModal = function(videoType, videoID) {
  const modal = document.getElementById('youtubeModal');
  const iframe = document.getElementById('youtubeIframe');
  
  let embedUrl = '';
  
  switch(videoType) {
    case 'youtube':
      // YouTube classique ET Shorts (même embed)
      embedUrl = `https://www.youtube.com/embed/${videoID}?autoplay=1&rel=0&modestbranding=1&fs=1`;
      break;
      
    case 'tiktok':
      // TikTok embed
      embedUrl = `https://www.tiktok.com/embed/v2/${videoID}`;
      break;
      
    case 'instagram':
      // Instagram embed
      embedUrl = `https://www.instagram.com/p/${videoID}/embed`;
      break;
      
    case 'twitter':
      // X/Twitter - Ouvrir dans nouvel onglet
      window.open(`https://twitter.com/i/status/${videoID}`, '_blank');
      return;
      
    default:
      console.error('Type de vidéo non supporté:', videoType);
      return;
  }
  
  iframe.src = embedUrl;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

// Compatibilité avec l'ancien code
window.openYouTubeModal = function(videoID) {
  window.openVideoModal('youtube', videoID);
};

function closeYouTubeModal() {
  const modal = document.getElementById('youtubeModal');
  const iframe = document.getElementById('youtubeIframe');
  
  modal.classList.remove('active');
  iframe.src = '';
  document.body.style.overflow = '';
}

function setupYoutubeModal() {
  const modal = document.getElementById('youtubeModal');
  const closeBtn = document.querySelector('.youtube-modal-close');
  const overlay = document.querySelector('.youtube-modal-overlay');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeYouTubeModal);
  }
  
  if (overlay) {
    overlay.addEventListener('click', closeYouTubeModal);
  }
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeYouTubeModal();
    }
  });
}

function displayMotsCles() {
  const container = document.getElementById('motsClesContainer');
  const motsCles = currentProgramme.motsCles || '';
  
  if (!motsCles) {
    container.innerHTML = '<p style="color: rgba(255,255,255,.6); font-size: 14px;">Aucun mot-clé</p>';
    return;
  }
  
  const cles = motsCles.split(';').map(c => c.trim()).filter(c => c);
  
  container.innerHTML = cles.map(cle => 
    `<span class="mot-cle">${cle}</span>`
  ).join('');
}

function displayRecommendations() {
  const container = document.getElementById('recommendationsGrid');
  
  if (!container) return;
  
  const currentThemes = (currentProgramme.themes || '')
    .toLowerCase()
    .split(';')
    .map(t => t.trim())
    .filter(t => t);
  
  console.log('🔍 Thèmes du programme actuel:', currentThemes);
  console.log('📊 Programmes disponibles:', allProgrammes.length);
  
  const recommendations = allProgrammes
    .filter(p => {
      if (p.id === currentProgramme.id) return false;
      
      const themes = (p.themes || '')
        .toLowerCase()
        .split(';')
        .map(t => t.trim())
        .filter(t => t);
      
      const hasCommonTheme = themes.some(theme => currentThemes.includes(theme));
      
      if (hasCommonTheme) {
        console.log(`✅ Match trouvé: ${p.titre}`);
      }
      
      return hasCommonTheme;
    })
    .slice(0, 4);
  
  console.log(`🎯 ${recommendations.length} recommandations trouvées`);
  
  if (recommendations.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,.7); grid-column: 1/-1;">Aucune recommandation disponible pour le moment</p>';
    return;
  }
  
  container.innerHTML = recommendations.map(prog => {
    const imagePath = `../media/fiche-programmes/${prog.slug}/image_1500x2100.jpg`;
    const firstTheme = prog.themes ? prog.themes.split(';')[0].trim() : '';
    
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

const CATEGORY_NAMES = {
  'short-drama-vertical': 'Short Drama Vertical',
  'drama-web-drama': 'Drama & Web-Drama',
  'film-short-film-animation': 'Film & Short Film & Animation',
  'gl-girls-love': 'GL (Girls Love)',
  'tv-shows': 'TV Shows',
  'documentaire': 'Documentaire',
  'kyool-original': 'KYOOL Original',
  'bl-boys-love': 'BL (Boys Love)'
};

const CATEGORY_FILES = [
  'short-drama-vertical.json',
  'drama-web-drama.json',
  'film-short-film-animation.json',
  'gl-girls-love.json',
  'tv-shows.json',
  'documentaire.json',
  'kyool-original.json',
  'bl-boys-love.json'
];

async function findProgrammeCategory(programmeId) {
  for (const file of CATEGORY_FILES) {
    try {
      const response = await fetch(`../media/categories/${file}`);
      if (response.ok) {
        const data = await response.json();
        const programmes = data.programmes || [];
        
        if (programmes.includes(programmeId)) {
          const categorySlug = file.replace('.json', '');
          return categorySlug;
        }
      }
    } catch (error) {
      console.error(`Erreur chargement ${file}:`, error);
    }
  }
  
  return 'short-drama-vertical';
}

async function setupNavigation() {
  const buttonContainer = document.getElementById('exploreCategoryButton');
  if (!buttonContainer) return;

  const categorySlug = await findProgrammeCategory(currentProgramme.id);
  const categoryName = CATEGORY_NAMES[categorySlug] || 'cette catégorie';

  buttonContainer.innerHTML = `
    <a href="programmes-categorie.html?cat=${categorySlug}" class="explore-category-btn">
      <span>Explorer ${categoryName}</span>
      <span class="arrow">→</span>
    </a>
  `;
}

document.addEventListener('DOMContentLoaded', function() {
  loadProgramme();
});
