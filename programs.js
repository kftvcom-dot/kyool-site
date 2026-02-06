// ===============================
// PROGRAMMES.JS - Gestion du défilement Netflix-style
// ===============================

document.addEventListener('DOMContentLoaded', () => {
  
  // Gestion du son pour la vidéo hero
  const heroSoundBtn = document.querySelector('.hero-banner .sound-btn');
  if (heroSoundBtn) {
    heroSoundBtn.addEventListener('click', async () => {
      const video = document.getElementById('heroVideo');
      if (!video) return;
      
      const willUnmute = video.muted === true;
      video.muted = !willUnmute;
      
      try {
        await video.play();
      } catch(e) {
        console.log('Autoplay prevented');
      }
      
      heroSoundBtn.textContent = willUnmute ? "🔊" : "🔇";
    });
  }

  // Gestion des boutons de navigation pour chaque ligne
  const programRows = document.querySelectorAll('.program-row');
  
  programRows.forEach(row => {
    const slider = row.querySelector('.row-slider');
    const prevBtn = row.querySelector('.row-nav.prev');
    const nextBtn = row.querySelector('.row-nav.next');
    
    if (!slider || !prevBtn || !nextBtn) {
      console.log('Elements manquants dans une ligne');
      return;
    }
    
    // Largeur de défilement (afficher 3-4 cartes à la fois)
    const getScrollAmount = () => {
      const firstCard = slider.querySelector('.program-card');
      if (!firstCard) return 800; // valeur par défaut
      
      const cardWidth = firstCard.offsetWidth;
      const gap = 12;
      const cardsToScroll = 3;
      
      return (cardWidth + gap) * cardsToScroll;
    };
    
    // Défilement vers la gauche
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const scrollAmount = getScrollAmount();
      console.log('Scroll left:', scrollAmount);
      
      slider.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    });
    
    // Défilement vers la droite
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const scrollAmount = getScrollAmount();
      console.log('Scroll right:', scrollAmount);
      
      slider.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    });
    
    // Support du drag pour desktop
    let isDown = false;
    let startX;
    let scrollLeft;
    
    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    
    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.style.cursor = 'default';
    });
    
    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.style.cursor = 'default';
    });
    
    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });
  });
  
  console.log('Programs.js chargé - ' + programRows.length + ' lignes détectées');
});
