// Typing Animation
document.addEventListener('DOMContentLoaded', () => {
  initTypingAnimation();
  initCounterAnimation();
  initScrollAnimations();
});

// Typing effect for hero title
function initTypingAnimation() {
  const typingText = document.querySelector('.typing-text');
  if (!typingText) return;

  const text = typingText.innerText;
  typingText.innerText = '';
  let index = 0;

  function type() {
    if (index < text.length) {
      typingText.innerText += text.charAt(index);
      index++;
      setTimeout(type, 50);
    }
  }

  setTimeout(type, 500);
}

// Counter Animation
function initCounterAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000;
  const start = 0;
  const startTime = Date.now();

  function update() {
    const now = Date.now();
    const progress = Math.min((now - startTime) / duration, 1);
    const current = Math.floor(start + (target - start) * progress);
    
    element.innerText = formatNumber(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.innerText = formatNumber(target);
    }
  }

  update();
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
}

// Scroll Animations
function initScrollAnimations() {
  const cards = document.querySelectorAll('.feature-card, .stat-card, .command-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
  });
}

// Floating animation for icons and elements
function initFloatingElements() {
  const floatingElements = document.querySelectorAll('.floating');
  floatingElements.forEach((element, index) => {
    element.style.animation = `floating 3s ease-in-out infinite`;
    element.style.animationDelay = (index * 0.2) + 's';
  });
}

// Parallax scroll effect
function initParallaxScroll() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const elements = document.querySelectorAll('.hero-image img');
    elements.forEach(element => {
      element.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
  });
}

// Mouse follow effect
function initMouseFollowEffect() {
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      button.style.setProperty('--mouse-x', x + 'px');
      button.style.setProperty('--mouse-y', y + 'px');
    });
  });
}

// Initialize all effects
document.addEventListener('DOMContentLoaded', () => {
  initFloatingElements();
  initParallaxScroll();
  initMouseFollowEffect();
});
