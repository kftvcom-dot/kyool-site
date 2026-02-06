// Programs.js - Gestion du defilement Netflix-style avec boucle infinie

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
    
    // Fonction pour verifier si on est a la fin ou au debut
    function checkScrollPosition() {
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      const currentScroll = slider.scrollLeft;
      
      // Si on est a la fin (tolerance de 5px)
      if (currentScroll >= maxScroll - 5) {
        return 'end';
      }
      
      // Si on est au debut (tolerance de 5px)
      if (currentScroll <= 5) {
        return 'start';
      }
      
      return 'middle';
    }
    
    // Defilement vers la droite (avec boucle)
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const position = checkScrollPosition();
      const scrollAmount = getScrollAmount();
      
      if (position === 'end') {
        // On est a la fin, retour au debut
        console.log('Retour au debut');
        slider.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      } else {
        // Defilement normal vers la droite
        console.log('Scroll right:', scrollAmount);
        slider.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }
    });
    
    // Defilement vers la gauche (avec boucle)
    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const position = checkScrollPosition();
      const scrollAmount = getScrollAmount();
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      
      if (position === 'start') {
        // On est au debut, aller a la fin
        console.log('Aller a la fin');
        slider.scrollTo({
          left: maxScroll,
          behavior: 'smooth'
        });
      } else {
        // Defilement normal vers la gauche
        console.log('Scroll left:', scrollAmount);
        slider.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth'
        });
      }
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
  
  console.log('Programs.js initialise avec boucle infinie');
});
