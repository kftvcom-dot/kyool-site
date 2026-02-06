// Programs.js - Gestion du defilement Netflix-style

document.addEventListener('DOMContentLoaded', function() {
  
  // Gestion du son pour la video hero
  const heroSoundBtn = document.querySelector('.hero-banner .sound-btn');
  if (heroSoundBtn) {
    heroSoundBtn.addEventListener('click', async function() {
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
  
  console.log('Lignes trouvees:', programRows.length);
  
  programRows.forEach(function(row) {
    const slider = row.querySelector('.row-slider');
    const prevBtn = row.querySelector('.row-nav.prev');
    const nextBtn = row.querySelector('.row-nav.next');
    
    if (!slider || !prevBtn || !nextBtn) {
      console.log('Elements manquants dans une ligne');
      return;
    }
    
    // Largeur de defilement
    function getScrollAmount() {
      const firstCard = slider.querySelector('.program-card');
      if (!firstCard) return 800;
      
      const cardWidth = firstCard.offsetWidth;
      const gap = 12;
      const cardsToScroll = 3;
      
      return (cardWidth + gap) * cardsToScroll;
    }
    
    // Defilement vers la gauche
    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const scrollAmount = getScrollAmount();
      console.log('Scroll left:', scrollAmount);
      
      slider.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    });
    
    // Defilement vers la droite
    nextBtn.addEventListener('click', function(e) {
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
    
    slider.addEventListener('mousedown', function(e) {
      isDown = true;
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    
    slider.addEventListener('mouseleave', function() {
      isDown = false;
      slider.style.cursor = 'default';
    });
    
    slider.addEventListener('mouseup', function() {
      isDown = false;
      slider.style.cursor = 'default';
    });
    
    slider.addEventListener('mousemove', function(e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });
  });
  
  console.log('Programs.js initialise');
});
