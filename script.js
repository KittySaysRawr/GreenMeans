let lastFocusedElement;

function openModal(id) {
  lastFocusedElement = document.activeElement;
  document.body.style.overflow = 'hidden';
  const container = document.getElementById('modal-container');
  const pill = document.getElementById('modal-pill');
  
  ['about-content', 'contact-content', 'terms-content', 'settings-content'].forEach(c => {
    document.getElementById(c).classList.add('hidden');
  });
  
  const content = document.getElementById(id + '-content');
  content.classList.remove('hidden');
  
  // Update ARIA labelling
  container.setAttribute('aria-labelledby', id + '-title');
  
  container.classList.remove('hidden');
  // Force reflow
  void container.offsetWidth;
  
  container.classList.remove('opacity-0');
  pill.classList.remove('scale-95', 'opacity-0');
  pill.classList.add('scale-100', 'opacity-100');
  
  // Reset scroll position and focus management
  setTimeout(() => {
    const scrollArea = container.querySelector('.overflow-y-auto');
    if (scrollArea) {
      scrollArea.scrollTop = 0;
    }
    document.getElementById('modal-close-btn').focus();
  }, 10);
}

function closeModal() {
  document.body.style.overflow = '';
  const container = document.getElementById('modal-container');
  const pill = document.getElementById('modal-pill');
  
  container.classList.add('opacity-0');
  pill.classList.remove('scale-100', 'opacity-100');
  pill.classList.add('scale-95', 'opacity-0');
  
  setTimeout(() => {
    container.classList.add('hidden');
    if (lastFocusedElement) lastFocusedElement.focus();
  }, 300);
}

// Focus Trap
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  
  const container = document.getElementById('modal-container');
  if (container && !container.classList.contains('hidden')) {
     const focusableElements = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
     const firstElement = focusableElements[0];
     const lastElement = focusableElements[focusableElements.length - 1];

     if (e.key === 'Tab') {
        if (e.shiftKey) { // shift + tab
           if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
           }
        } else { // tab
           if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
           }
        }
     }
  }
});

// Loading screen logic
const loadingPhrases = [
  "Harvesting green energy...",
  "Optimising data routes...",
  "Cultivating sustainable code...",
  "Reducing carbon footprint...",
  "Preparing your green ecosystem...",
  "Connecting social hubs...",
  "Polishing core initiatives..."
];

let phraseIndex = 0;
const loadingTextElement = document.getElementById('loading-text');
const loadingScreen = document.getElementById('loading-screen');

const rotateText = () => {
  if (!loadingTextElement) return;
  loadingTextElement.style.opacity = '0';
  setTimeout(() => {
    phraseIndex = (phraseIndex + 1) % loadingPhrases.length;
    loadingTextElement.textContent = loadingPhrases[phraseIndex];
    loadingTextElement.style.opacity = '1';
  }, 500);
};

const textInterval = setInterval(rotateText, 2500);

window.addEventListener('load', () => {
  // Cookie Consent Logic
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieWarningModal = document.getElementById('cookie-warning-modal');
  let cookieConsent = localStorage.getItem('gm-cookie-consent');

  const saveToStorage = (key, value) => {
    if (localStorage.getItem('gm-cookie-consent') === 'accepted') {
      localStorage.setItem(key, value);
    }
  };

  window.showCookieWarning = () => {
    cookieWarningModal.classList.remove('hidden');
    void cookieWarningModal.offsetWidth;
    cookieWarningModal.classList.remove('opacity-0', 'pointer-events-none');
    cookieWarningModal.firstElementChild.classList.remove('scale-95');
    cookieWarningModal.firstElementChild.classList.add('scale-100');
  };

  window.hideCookieWarning = () => {
    cookieWarningModal.classList.add('opacity-0', 'pointer-events-none');
    cookieWarningModal.firstElementChild.classList.remove('scale-100');
    cookieWarningModal.firstElementChild.classList.add('scale-95');
    setTimeout(() => {
      cookieWarningModal.classList.add('hidden');
    }, 300);
  };

  window.acceptCookies = () => {
    localStorage.setItem('gm-cookie-consent', 'accepted');
    cookieConsent = 'accepted';
    
    // Save current settings now that we have consent
    localStorage.setItem('gm-dark', settings.dark);
    localStorage.setItem('gm-dyslexia', settings.dyslexia);
    localStorage.setItem('gm-motion', settings.motion);
    
    hideBanner();
    hideCookieWarning();
  };

  window.declineCookiesFinal = () => {
    localStorage.setItem('gm-cookie-consent', 'declined');
    cookieConsent = 'declined';
    
    // Clear any partially saved data
    localStorage.removeItem('gm-dark');
    localStorage.removeItem('gm-dyslexia');
    localStorage.removeItem('gm-motion');
    
    hideBanner();
    hideCookieWarning();
  };

  const showBanner = () => {
    cookieBanner.classList.remove('hidden');
    void cookieBanner.offsetWidth;
    cookieBanner.classList.remove('translate-y-full');
  };

  const hideBanner = () => {
    cookieBanner.classList.add('translate-y-full');
    setTimeout(() => {
      cookieBanner.classList.add('hidden');
    }, 500);
  };

  if (!cookieConsent) {
    setTimeout(showBanner, 2000);
  }

  // Initialize settings from localStorage
  const settings = {
    dark: localStorage.getItem('gm-dark') !== 'false', // Default true
    dyslexia: localStorage.getItem('gm-dyslexia') === 'true',
    motion: localStorage.getItem('gm-motion') === 'true'
  };

  // Apply initial settings
  if (!settings.dark) document.body.classList.add('light-mode');
  if (settings.dyslexia) document.body.classList.add('dyslexia-font');
  if (settings.motion) document.body.classList.add('reduced-motion');

  // Update toggle UI function
  const updateToggleUI = (key) => {
    const btn = document.getElementById(`toggle-${key}-mode`) || document.getElementById(`toggle-${key}`);
    const thumb = document.getElementById(`${key}-thumb`) || document.getElementById(`${key}-mode-thumb`);
    const isEnabled = key === 'dark' ? settings.dark : settings[key];
    if (thumb) {
      thumb.style.transform = isEnabled ? 'translateX(1.5rem)' : 'translateX(0.25rem)';
    }
    if (btn) {
      btn.classList.toggle('toggle-active', isEnabled);
      btn.setAttribute('aria-checked', isEnabled);
    }
  };

  // Update initial toggle UI
  ['dark', 'dyslexia', 'motion'].forEach(updateToggleUI);

  // Global settings access
  window.openSettings = () => {
    openModal('settings');
  };

  window.toggleMobileMenu = () => {
    const menu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    
    if (menu) {
      const isHidden = menu.classList.contains('hidden');
      if (isHidden) {
        menu.classList.remove('hidden');
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
      } else {
        menu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      }
    }
  };

  window.toggleSetting = (key) => {
    if (key === 'dark') {
      settings.dark = !settings.dark;
      document.body.classList.toggle('light-mode', !settings.dark);
      saveToStorage('gm-dark', settings.dark);
    } else if (key === 'dyslexia') {
      settings.dyslexia = !settings.dyslexia;
      document.body.classList.toggle('dyslexia-font', settings.dyslexia);
      saveToStorage('gm-dyslexia', settings.dyslexia);
    } else if (key === 'motion') {
      settings.motion = !settings.motion;
      document.body.classList.toggle('reduced-motion', settings.motion);
      saveToStorage('gm-motion', settings.motion);
    }
    
    // Smoothly update toggle positions and background
    updateToggleUI(key);
  };

  setTimeout(() => {
    clearInterval(textInterval);
    if (loadingScreen) {
      loadingScreen.classList.add('hidden-loader');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 800);
    }
  }, 1200); // Artificial delay for a smooth feel
});

// Setup admin email link handler
document.addEventListener('DOMContentLoaded', () => {
  const adminEmailLink = document.getElementById('admin-email-link');
  if (adminEmailLink) {
    adminEmailLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'mailto:admin' + '@' + 'greenmeans.ovh';
    });
  }
});
