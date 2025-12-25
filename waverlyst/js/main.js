/**
 * Waverly Street - Main JavaScript
 * Simple slideshow and utility functions
 */

// Initialize all slideshows on the page
document.addEventListener('DOMContentLoaded', function() {
  initSlideshows();
});

/**
 * Initialize all slideshow components
 */
function initSlideshows() {
  const slideshows = document.querySelectorAll('.slideshow');

  slideshows.forEach(slideshow => {
    const track = slideshow.querySelector('.slideshow-track');
    const slides = slideshow.querySelectorAll('.slideshow-slide');
    const dotsContainer = slideshow.querySelector('.slideshow-dots');

    if (!track || slides.length === 0) return;

    const autoplay = slideshow.dataset.autoplay === 'true';
    const interval = parseFloat(slideshow.dataset.interval) || 3;
    const draggable = slideshow.dataset.draggable === 'true';

    let currentIndex = 0;
    let autoplayTimer = null;

    // Create dots if container exists
    if (dotsContainer) {
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'slideshow-dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      track.style.transform = `translateX(-${index * 100}%)`;
      updateDots();
      resetAutoplay();
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      goToSlide(currentIndex);
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(currentIndex);
    }

    function updateDots() {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.slideshow-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    function startAutoplay() {
      if (!autoplay) return;
      autoplayTimer = setInterval(nextSlide, interval * 1000);
    }

    function resetAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
      }
      startAutoplay();
    }

    // Drag/swipe support
    if (draggable) {
      let startX = 0;
      let isDragging = false;

      slideshow.addEventListener('mousedown', e => {
        startX = e.clientX;
        isDragging = true;
      });

      slideshow.addEventListener('mousemove', e => {
        if (!isDragging) return;
        e.preventDefault();
      });

      slideshow.addEventListener('mouseup', e => {
        if (!isDragging) return;
        isDragging = false;
        const diff = startX - e.clientX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      });

      slideshow.addEventListener('mouseleave', () => {
        isDragging = false;
      });

      // Touch events
      slideshow.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        isDragging = true;
      }, { passive: true });

      slideshow.addEventListener('touchend', e => {
        if (!isDragging) return;
        isDragging = false;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      }, { passive: true });
    }

    // Start autoplay
    startAutoplay();

    // Pause on hover
    slideshow.addEventListener('mouseenter', () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
      }
    });

    slideshow.addEventListener('mouseleave', () => {
      startAutoplay();
    });
  });
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Simple image lazy loading fallback
 */
function initLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    return;
  }

  // Fallback for older browsers
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => observer.observe(img));
  }
}
