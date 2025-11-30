/**
 * Discord Bot Website By bmr
 * © 2025 bmr
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navContainer = document.querySelector('.nav-container');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileMenuToggle.addEventListener('click', () => {
    navContainer.classList.toggle('active');
    document.body.classList.toggle('menu-open');

    const icon = mobileMenuToggle.querySelector('i');
    if (navContainer.classList.contains('active')) {
      icon.className = 'fas fa-times';
    } else {
      icon.className = 'fas fa-bars';
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navContainer.classList.contains('active')) {
        navContainer.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (
      navContainer.classList.contains('active') &&
      !navContainer.contains(e.target) &&
      !mobileMenuToggle.contains(e.target)
    ) {
      navContainer.classList.remove('active');
      document.body.classList.remove('menu-open');
      mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  const categories = document.querySelectorAll('.category');
  
  if (categories.length === 0) {
    return;
  }

  let autoSwitchInterval;
  let userInteracted = false;
  let currentCategoryIndex = 0;

  function switchToCategory(categoryIndex) {
    const category = categories[categoryIndex];

    if (category.classList.contains('active')) {
      return;
    }

    categories.forEach(c => c.classList.remove('active'));
    category.classList.add('active');

    const activeGroup = document.querySelector('.command-group.active');
    const groupToShow = document.querySelector(`[data-group="${category.dataset.category}"]`);

    if (activeGroup) {
      const items = activeGroup.querySelectorAll('.command-item');
      items.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(-20px)';
        }, 30 * index);
      });

      setTimeout(() => {
        document.querySelectorAll('.command-group').forEach(g => {
          g.classList.remove('active');
        });

        if (groupToShow) {
          groupToShow.classList.add('active');

          const commandItems = groupToShow.querySelectorAll('.command-item');
          commandItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';

            setTimeout(() => {
              item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 50 * index); 
          });
        }
      }, 300);
    } else {
      document.querySelectorAll('.command-group').forEach(g => {
        g.classList.remove('active');
      });

      if (groupToShow) {
        groupToShow.classList.add('active');

        const commandItems = groupToShow.querySelectorAll('.command-item');
        commandItems.forEach((item, index) => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';

          setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50 * index); 
        });
      }
    }
  }

  const progressBar = document.querySelector('.category-progress');
  const switchInterval = 5000;
  let startTime;

  function animateProgress(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / switchInterval * 100, 100);

    progressBar.style.width = `${progress}%`;

    if (progress < 100 && !userInteracted) {
      requestAnimationFrame(animateProgress);
    } else if (progress >= 100 && !userInteracted) {
      startTime = null;
      progressBar.style.width = '0%';

      currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
      switchToCategory(currentCategoryIndex);

      requestAnimationFrame(animateProgress);
    } else if (userInteracted) {
      progressBar.style.width = '0%';
    }
  }

  function startAutoSwitch() {
    if (autoSwitchInterval) {
      clearInterval(autoSwitchInterval);
    }

    startTime = null;
    requestAnimationFrame(animateProgress);

    autoSwitchInterval = setInterval(() => {
      if (!userInteracted) {
        currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
        switchToCategory(currentCategoryIndex);

        progressBar.style.width = '0%';
        startTime = null;
      }
    }, switchInterval);
  }

  categories.forEach((category, index) => {
    category.addEventListener('click', () => {
      userInteracted = true;
      currentCategoryIndex = index;

      progressBar.style.width = '0%';

      switchToCategory(index);

      setTimeout(() => {
        userInteracted = false;
        requestAnimationFrame(function(timestamp) {
          startTime = timestamp;
          animateProgress(timestamp);
        });
      }, 10000);
    });
  });

  const commandsSection = document.querySelector('.commands');
  if (commandsSection) {
    commandsSection.addEventListener('mousemove', () => {
      userInteracted = true;

      progressBar.style.width = '0%';

      clearTimeout(commandsSection.mouseMoveTimeout);
      commandsSection.mouseMoveTimeout = setTimeout(() => {
        userInteracted = false;
        requestAnimationFrame(function(timestamp) {
          startTime = timestamp;
          animateProgress(timestamp);
        });
      }, 10000);
    });
  }

  // Only run command-related functions on pages with the commands section
  if (commandsSection) {
    generateCommandGroups();
    generateIconGrid();
  }

  initAnimations();

  setTimeout(() => {
    const activeGroup = document.querySelector('.command-group.active');
    if (activeGroup) {
      const commandItems = activeGroup.querySelectorAll('.command-item');
      commandItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';

        setTimeout(() => {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 50 * index);
      });
    }

    startAutoSwitch();
  }, 500);
});

function generateCommandGroups() {
  const commandList = document.querySelector('.command-list');

  if (!commandList) {
    return;
  }

  const aiCommands = `
    <div class="command-group active" data-group="ai">
      <h3 class="command-category-title"><i class="fas fa-brain"></i> AI Assistance</h3>
      <div class="command-category-list">
        <div class="command-item">
          <div class="command-name"><i class="fas fa-question-circle"></i> ask</div>
          <div class="command-description">Get deep, detailed answers to any question</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-book"></i> explain</div>
          <div class="command-description">Explain any topic clearly in simple language</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-star"></i> improve</div>
          <div class="command-description">Enhance any message, paragraph, or script</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-redo"></i> rewrite</div>
          <div class="command-description">Rewrite text in different tones or styles</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-compress"></i> summarize</div>
          <div class="command-description">Convert long text into short, clear summaries</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-microscope"></i> analyze</div>
          <div class="command-description">Analyze content and give insights or breakdowns</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-lightbulb"></i> idea</div>
          <div class="command-description">Generate ideas for videos, designs, content, or posts</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-dictionary"></i> define</div>
          <div class="command-description">Provide definitions for any word or concept</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-life-ring"></i> helper</div>
          <div class="command-description">Your all-in-one AI command for multi-purpose assistance</div>
        </div>
      </div>
    </div>
  `;

  const editingCommands = `
    <div class="command-group" data-group="editing">
      <h3 class="command-category-title"><i class="fas fa-pen-fancy"></i> Editing Tools</h3>
      <div class="command-category-list">
        <div class="command-item">
          <div class="command-name"><i class="fas fa-wrench"></i> fix</div>
          <div class="command-description">Correct grammar, spelling, and mistakes</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-scissors"></i> shorten</div>
          <div class="command-description">Make text shorter but keep meaning</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-expand"></i> expand</div>
          <div class="command-description">Add detail, depth, and clarity to text</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-image"></i> caption</div>
          <div class="command-description">Create captions for reels, videos, and posts</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-film"></i> script</div>
          <div class="command-description">Generate short scripts or dialogues</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-align-left"></i> format</div>
          <div class="command-description">Format text into clean structure or bullet points</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-heading"></i> title</div>
          <div class="command-description">Generate attractive titles for any content</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-globe"></i> translate</div>
          <div class="command-description">Translate text into any language</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-paragraph"></i> paragraph</div>
          <div class="command-description">Turn messy text into a clean, structured paragraph</div>
        </div>
      </div>
    </div>
  `;

  const utilityCommands = `
    <div class="command-group" data-group="utility">
      <h3 class="command-category-title"><i class="fas fa-cog"></i> Utility Tools</h3>
      <div class="command-category-list">
        <div class="command-item">
          <div class="command-name"><i class="fas fa-bell"></i> remind</div>
          <div class="command-description">Set reminders for tasks or deadlines</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-sticky-note"></i> note</div>
          <div class="command-description">Save small notes for later use</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-hourglass"></i> timer</div>
          <div class="command-description">Start a countdown timer</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-exchange-alt"></i> convert</div>
          <div class="command-description">Convert text formats (upper, lower, title case)</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-smile"></i> emoji</div>
          <div class="command-description">Suggest emojis based on your text</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-calculator"></i> calculate</div>
          <div class="command-description">Perform quick mathematical calculations</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-cloud"></i> weather</div>
          <div class="command-description">Get weather details for any location</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-user"></i> profile</div>
          <div class="command-description">Show user information in a clean summary</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-server"></i> serverinfo</div>
          <div class="command-description">Display server insights and statistics</div>
        </div>
      </div>
    </div>
  `;

  const creativeCommands = `
    <div class="command-group" data-group="creative">
      <h3 class="command-category-title"><i class="fas fa-palette"></i> Creative Tools</h3>
      <div class="command-category-list">
        <div class="command-item">
          <div class="command-name"><i class="fas fa-sparkles"></i> creative</div>
          <div class="command-description">Generate creative ideas & prompts</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-book-open"></i> story</div>
          <div class="command-description">Create short stories instantly</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-quote-left"></i> quote</div>
          <div class="command-description">Produce inspirational or funny quotes</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-brain"></i> brainstorm</div>
          <div class="command-description">Brainstorm ideas with AI</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-paint-brush"></i> design</div>
          <div class="command-description">Suggest design themes & creative layouts</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-tag"></i> name</div>
          <div class="command-description">Generate usernames, bot names, brand names</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-color"></i> aesthetic</div>
          <div class="command-description">Suggest color palettes + aesthetic styles</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-comments"></i> topics</div>
          <div class="command-description">Give conversation or content topics</div>
        </div>
        <div class="command-item">
          <div class="command-name"><i class="fas fa-heart"></i> motivate</div>
          <div class="command-description">Send motivational messages</div>
        </div>
      </div>
    </div>
  `;

  commandList.innerHTML = aiCommands + editingCommands + utilityCommands + creativeCommands;
}

function generateIconGrid() {
  const iconsContainer = document.querySelector('.icons-container');

  if (!iconsContainer) {
    return;
  }

  const icons = [
    { name: 'ask', icon: 'fas fa-question-circle' },
    { name: 'explain', icon: 'fas fa-book' },
    { name: 'improve', icon: 'fas fa-star' },
    { name: 'rewrite', icon: 'fas fa-redo' },
    { name: 'summarize', icon: 'fas fa-compress' },
    { name: 'analyze', icon: 'fas fa-microscope' },
    { name: 'idea', icon: 'fas fa-lightbulb' },
    { name: 'define', icon: 'fas fa-dictionary' },
    { name: 'fix', icon: 'fas fa-wrench' },
    { name: 'shorten', icon: 'fas fa-scissors' },
    { name: 'expand', icon: 'fas fa-expand' },
    { name: 'caption', icon: 'fas fa-image' },
    { name: 'script', icon: 'fas fa-film' },
    { name: 'format', icon: 'fas fa-align-left' },
    { name: 'title', icon: 'fas fa-heading' },
    { name: 'translate', icon: 'fas fa-globe' },
    { name: 'remind', icon: 'fas fa-bell' },
    { name: 'note', icon: 'fas fa-sticky-note' },
    { name: 'timer', icon: 'fas fa-hourglass' },
    { name: 'emoji', icon: 'fas fa-smile' },
    { name: 'creative', icon: 'fas fa-sparkles' },
    { name: 'story', icon: 'fas fa-book-open' },
    { name: 'quote', icon: 'fas fa-quote-left' },
    { name: 'design', icon: 'fas fa-paint-brush' },
    { name: 'heart', icon: 'fas fa-heart' },
    { name: 'bolt', icon: 'fas fa-bolt' },
    { name: 'fire', icon: 'fas fa-fire' },
    { name: 'star', icon: 'fas fa-star' },
  ];

  let iconsHTML = '';
  icons.forEach(icon => {
    iconsHTML += `
      <div class="icon-item" data-name="${icon.name}" title="${icon.name}">
        <span><i class="${icon.icon}"></i></span>
      </div>
    `;
  });

  iconsContainer.innerHTML = iconsHTML;

  const iconItems = document.querySelectorAll('.icon-item');
  iconItems.forEach(item => {
    const randomDelay = Math.random() * 2;
    item.style.animationDelay = `${randomDelay}s`;

    item.addEventListener('mouseenter', () => {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      item.appendChild(ripple);

      item.classList.add('glow');

      setTimeout(() => {
        ripple.remove();
        item.classList.remove('glow');
      }, 1000);
    });
  });
}

function initAnimations() {
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .pricing-card, .support-card');

    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;

      if (elementTop < window.innerHeight && elementBottom > 0) {
        element.classList.add('animate');
      }
    });
  };

  animateOnScroll();

  window.addEventListener('scroll', animateOnScroll);
}

function handleSpotifyAuth() {
  const callbackElement = document.getElementById('spotify-callback');

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    callbackElement.innerHTML = `<p>Authentication successful You can close this window.</p>`;
    callbackElement.style.display = 'block';

    setTimeout(() => {
      callbackElement.style.display = 'none';
    }, 5000);
  }
}

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      // Toggle current item
      item.classList.toggle('active');
    });
  });
});
// Add to script.js

function handleNewsletterSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const input = form.querySelector('input');
  
  // Show success message
  const btn = form.querySelector('button');
  const originalText = btn.innerText;
  btn.innerText = '✓ Subscribed!';
  btn.style.background = 'var(--primary)';
  
  setTimeout(() => {
    input.value = '';
    btn.innerText = originalText;
    btn.style.background = '';
  }, 2000);
}

// Animate activity feed items
document.addEventListener('DOMContentLoaded', function() {
  const activityItems = document.querySelectorAll('.activity-item');
  activityItems.forEach((item, index) => {
    item.style.animationDelay = (index * 0.1) + 's';
  });
});
