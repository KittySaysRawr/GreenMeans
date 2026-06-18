// Ensure any registerable Service Workers or Cache Storage elements are cleaned up
// so that the browser's own native settings remain the absolute source of truth
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  }).catch((err) => {
    console.warn('Service Worker unregistration failed:', err);
  });
}

if ('caches' in window) {
  caches.keys().then((names) => {
    for (const name of names) {
      caches.delete(name);
    }
  }).catch((err) => {
    console.warn('Cache Storage deletion failed:', err);
  });
}

let lastFocusedElement;

function openModal(id) {
  lastFocusedElement = document.activeElement;
  document.body.style.overflow = 'hidden';
  const container = document.getElementById('modal-container');
  const pill = document.getElementById('modal-pill');
  
  ['settings-content'].forEach(c => {
    const el = document.getElementById(c);
    if (el) el.classList.add('hidden');
  });
  
  const content = document.getElementById(id + '-content');
  if (content) content.classList.remove('hidden');
  
  // Update ARIA labelling
  if (container) {
    container.setAttribute('aria-labelledby', id + '-title');
    container.classList.remove('hidden');
    // Force reflow
    void container.offsetWidth;
    container.classList.remove('opacity-0');
  }
  if (pill) {
    pill.classList.remove('scale-95', 'opacity-0');
    pill.classList.add('scale-100', 'opacity-100');
  }
  
  // Reset scroll position and focus management
  setTimeout(() => {
    if (container) {
      const scrollArea = container.querySelector('.overflow-y-auto');
      if (scrollArea) {
        scrollArea.scrollTop = 0;
      }
    }
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.focus();
  }, 10);
}

function closeModal() {
  document.body.style.overflow = '';
  const container = document.getElementById('modal-container');
  const pill = document.getElementById('modal-pill');
  
  if (container) container.classList.add('opacity-0');
  if (pill) {
    pill.classList.remove('scale-100', 'opacity-100');
    pill.classList.add('scale-95', 'opacity-0');
  }
  
  setTimeout(() => {
    if (container) container.classList.add('hidden');
    if (lastFocusedElement) lastFocusedElement.focus();
  }, 300);
}

// Focus Trap
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  
  const container = document.getElementById('modal-container');
  if (container && !container.classList.contains('hidden')) {
     const focusableElements = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
     if (focusableElements.length > 0) {
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

const textInterval = window.__skipLoader ? null : setInterval(rotateText, 2500);

// Helper to read settings from sessionStorage first, then localStorage
const getSetting = (key, defaultValue) => {
  try {
    const sVar = sessionStorage.getItem(key);
    if (sVar !== null) return sVar;
  } catch (e) {}
  try {
    const lVar = localStorage.getItem(key);
    if (lVar !== null) return lVar;
  } catch (e) {}
  return defaultValue;
};

// State variables in module scope
const settings = {
  dark: getSetting('gm-dark', 'true') !== 'false',
  dyslexia: getSetting('gm-dyslexia', 'false') === 'true',
  motion: getSetting('gm-motion', 'false') === 'true'
};

// Global storage persistence helper
const saveToStorage = (key, value) => {
  try {
    sessionStorage.setItem(key, value);
  } catch (e) {}
  try {
    if (localStorage.getItem('gm-cookie-consent') === 'accepted') {
      localStorage.setItem(key, value);
    }
  } catch (e) {}
};

// Immediate pre-load class execution
const applyImmediateClasses = () => {
  const isDark = getSetting('gm-dark', 'true') !== 'false';
  const isDyslexia = getSetting('gm-dyslexia', 'false') === 'true';
  const isMotion = getSetting('gm-motion', 'false') === 'true';

  if (document.documentElement) {
    document.documentElement.classList.toggle('light-mode', !isDark);
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('dyslexia-font', isDyslexia);
    document.documentElement.classList.toggle('reduced-motion', isMotion);
  }

  if (document.body) {
    document.body.classList.toggle('light-mode', !isDark);
    document.body.classList.toggle('dark', isDark);
    document.body.classList.toggle('dyslexia-font', isDyslexia);
    document.body.classList.toggle('reduced-motion', isMotion);
  }
};
applyImmediateClasses();
document.addEventListener('DOMContentLoaded', applyImmediateClasses);

// Element Injection Core Function
const injectEverything = () => {
  if (window.__elementsInjected) return;
  window.__elementsInjected = true;

  // Header Actions & Mobile Menu Injection
  const nav = document.querySelector('header nav');
  if (nav && !nav.querySelector('button[onclick="openSettings()"]')) {
    const container = document.createElement('div');
    container.className = 'flex items-center gap-1 sm:gap-3 shrink-0';
    container.innerHTML = `
      <!-- Settings (Always Visible) -->
      <button onclick="openSettings()" class="btn-shrink flex items-center justify-center md:justify-start gap-2 w-8 h-8 md:w-auto md:h-auto px-0 py-0 md:px-5 md:py-2 text-xs font-medium uppercase tracking-widest text-white/70 border border-white/10 rounded-full hover:text-white hover:border-[#1db441] hover:bg-[#1db441]/10 hover:shadow-[0_0_15px_rgba(29,180,65,0.3)] transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#1db441]/50 group shrink-0" aria-label="Open Settings">
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 md:w-4 md:h-4 transition-transform duration-400 group-hover:rotate-45 shrink-0"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        <span class="hidden md:inline">Settings</span>
      </button>

      <!-- Burger Menu Toggle -->
      <button id="mobile-menu-toggle" onclick="toggleMobileMenu()" class="w-11 h-11 flex items-center justify-center text-white/70 hover:text-[#1db441] border border-white/5 rounded-full hover:border-[#1db441]/30 hover:bg-[#1db441]/5 transition-all duration-300 focus:outline-none" aria-label="Toggle Navigation Menu">
        <svg aria-hidden="true" id="menu-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
        <svg aria-hidden="true" id="close-icon" class="hidden w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;
    nav.appendChild(container);
  }

  const header = document.querySelector('header');
  if (header && !document.getElementById('mobile-menu')) {
    const mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobile-menu';
    mobileMenu.className = 'hidden border-t border-white/5 bg-black/95 backdrop-blur-md transition-all duration-300';
    mobileMenu.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 justify-items-stretch">
        <!-- Guides Page -->
        <a href="guides.html" class="flex items-center justify-center gap-2 px-5 py-3 text-xs font-medium uppercase tracking-widest text-white/70 border border-white/10 rounded-full hover:text-white hover:border-[#1db441] hover:bg-[#1db441]/10 hover:shadow-[0_0_15px_rgba(29,180,65,0.3)] transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#1db441]/50 w-full text-center">
          <span>Guides</span>
        </a>

        <!-- Blog Page -->
        <a href="https://blog.greenmeans.ovh" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 px-5 py-3 text-xs font-medium uppercase tracking-widest text-white/70 border border-white/10 rounded-full hover:text-white hover:border-[#1db441] hover:bg-[#1db441]/10 hover:shadow-[0_0_15px_rgba(29,180,65,0.3)] transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#1db441]/50 w-full text-center">
          <span>Blog</span>
          <svg class="w-3.5 h-3.5 text-[#1db441] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg>
        </a>

        <!-- Green Policy Link -->
        <a href="https://policy.greenmeans.ovh" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 px-5 py-3 text-xs font-medium uppercase tracking-widest text-white/70 border border-white/10 rounded-full hover:text-white hover:border-[#1db441] hover:bg-[#1db441]/10 hover:shadow-[0_0_15px_rgba(29,180,65,0.3)] transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#1db441]/50 w-full text-center">
          <span>Green Policy</span>
          <svg class="w-3.5 h-3.5 text-[#1db441] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg>
        </a>

        <!-- Office Link -->
        <a href="https://office.greenmeans.ovh/" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 px-5 py-3 text-xs font-medium uppercase tracking-widest text-white/70 border border-white/10 rounded-full hover:text-white hover:border-[#1db441] hover:bg-[#1db441]/10 hover:shadow-[0_0_15px_rgba(29,180,65,0.3)] transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#1db441]/50 w-full text-center">
          <span>Office</span>
          <svg class="w-3.5 h-3.5 text-[#1db441] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg>
        </a>

        <!-- Toolkit Link -->
        <a href="https://toolkit.greenmeans.ovh" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 px-5 py-3 text-xs font-medium uppercase tracking-widest text-white/70 border border-white/10 rounded-full hover:text-white hover:border-[#1db441] hover:bg-[#1db441]/10 hover:shadow-[0_0_15px_rgba(29,180,65,0.3)] transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#1db441]/50 w-full text-center">
          <span>Toolkit</span>
          <svg class="w-3.5 h-3.5 text-[#1db441] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg>
        </a>

        <!-- Compost Guide Link -->
        <a href="https://compost.greenmeans.ovh" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 px-5 py-3 text-xs font-medium uppercase tracking-widest text-white/70 border border-white/10 rounded-full hover:text-white hover:border-[#1db441] hover:bg-[#1db441]/10 hover:shadow-[0_0_15px_rgba(29,180,65,0.3)] transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#1db441]/50 w-full text-center">
          <span>Compost Guide</span>
          <svg class="w-3.5 h-3.5 text-[#1db441] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg>
        </a>

        <!-- Native Plants Link -->
        <a href="https://plants.greenmeans.ovh" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 px-5 py-3 text-xs font-medium uppercase tracking-widest text-white/70 border border-white/10 rounded-full hover:text-white hover:border-[#1db441] hover:bg-[#1db441]/10 hover:shadow-[0_0_15px_rgba(29,180,65,0.3)] transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#1db441]/50 w-full text-center">
          <span>Native Plants</span>
          <svg class="w-3.5 h-3.5 text-[#1db441] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg>
        </a>

        <!-- Search Link -->
        <a href="https://search.greenmeans.ovh" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 px-5 py-3 text-xs font-medium uppercase tracking-widest text-[#1db441] border border-[#1db441]/30 rounded-full hover:text-white hover:border-[#1db441] hover:bg-[#1db441]/10 hover:shadow-[0_0_15px_rgba(29,180,65,0.3)] transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#1db441]/50 w-full text-center">
          <span>Search</span>
          <svg class="w-3.5 h-3.5 text-[#1db441] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg>
        </a>
      </div>
    `;
    header.appendChild(mobileMenu);
  }

  // Settings Modal Injection
  if (!document.getElementById('modal-container')) {
    const modalDiv = document.createElement('div');
    modalDiv.id = 'modal-container';
    modalDiv.className = 'fixed inset-0 z-50 hidden opacity-0 transition-opacity duration-300';
    modalDiv.setAttribute('role', 'dialog');
    modalDiv.setAttribute('aria-modal', 'true');
    modalDiv.innerHTML = `
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="closeModal()" aria-hidden="true"></div>
      
      <div class="absolute inset-0 md:inset-6 lg:inset-12 bg-black border border-white/10 shadow-2xl rounded-none md:rounded-[2rem] overflow-hidden flex flex-col transform scale-95 opacity-0 transition-all duration-300 ease-out" id="modal-pill">
        
        <!-- Header -->
        <div class="flex justify-end p-6 md:p-8 shrink-0 relative z-10">
          <button id="modal-close-btn" onclick="closeModal()" class="p-3 bg-zinc-900 border border-white/10 rounded-full text-white/80 hover:bg-[#18852c] hover:border-[#18852c] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#18852c]/50 cursor-pointer">
            <svg focusable="false" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" role="img" aria-label="Close modal"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            <span class="sr-only">Close Modal</span>
          </button>
        </div>

        <!-- Scrollable Content Area -->
        <div class="flex-grow overflow-y-auto px-6 md:px-12 lg:px-24 pb-16 relative z-0">
          
          <!-- Settings Content -->
          <div id="settings-content" class="hidden max-w-2xl mx-auto">
            <div class="bg-zinc-900/40 p-10 md:p-12 rounded-[2rem] border border-white/5 shadow-2xl">
              <h2 id="settings-title" class="text-3xl font-light tracking-tight text-[#1db441] mb-10 uppercase tracking-widest text-center">Settings</h2>
              
              <div class="space-y-8">
                <div class="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <div class="flex items-center gap-4">
                     <div class="p-2 bg-[#1db441]/10 rounded-lg text-[#1db441]">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                     </div>
                     <div>
                       <h3 class="text-white font-medium">Dark Mode</h3>
                       <p class="text-white/80 text-sm">Switch theme.</p>
                     </div>
                  </div>
                  <button id="toggle-dark-mode" onclick="toggleSetting('dark')" class="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1db441]" role="switch" aria-checked="true" aria-label="Toggle dark mode">
                    <span id="dark-mode-thumb" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-3"></span>
                  </button>
                </div>

                <div class="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <div class="flex items-center gap-4">
                     <div class="p-2 bg-[#1db441]/10 rounded-lg text-[#1db441]">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
                     </div>
                     <div>
                       <h3 class="text-white font-medium">Dyslexia Font</h3>
                       <p class="text-white/80 text-sm">Use Lexend.</p>
                     </div>
                  </div>
                  <button id="toggle-dyslexia" onclick="toggleSetting('dyslexia')" class="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1db441]" role="switch" aria-checked="false" aria-label="Toggle dyslexia friendly font">
                    <span id="dyslexia-thumb" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                  </button>
                </div>

                <div class="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <div class="flex items-center gap-4">
                     <div class="p-2 bg-[#1db441]/10 rounded-lg text-[#1db441]">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 22 20-20"/><path d="M8 8.91a4 4 0 0 0-5.91-5.91"/><path d="M16 15.09a4 4 0 0 0 5.91 5.91"/></svg>
                     </div>
                     <div>
                       <h3 class="text-white font-medium">Reduced Motion</h3>
                       <p class="text-white/80 text-sm">Turn off effects.</p>
                     </div>
                  </div>
                  <button id="toggle-motion" onclick="toggleSetting('motion')" class="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1db441]" role="switch" aria-checked="false" aria-label="Toggle reduced motion">
                    <span id="motion-thumb" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                  </button>
                </div>
              </div>
              
              <div class="mt-8 text-center">
                <button onclick="closeModal()" class="px-8 py-3 bg-[#18852c] text-white rounded-full font-medium hover:bg-[#1db441] transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
    document.body.appendChild(modalDiv);
  }
};

// Update individual toggle UI elements with correct positions and labels
const updateToggleUI = (key) => {
  const btn = document.getElementById(`toggle-${key}-mode`) || document.getElementById(`toggle-${key}`);
  const thumb = document.getElementById(`${key}-thumb`) || document.getElementById(`${key}-mode-thumb`);
  const isEnabled = key === 'dark' ? settings.dark : settings[key];
  if (thumb) {
    thumb.style.transform = isEnabled ? 'translateX(1.5rem)' : 'translateX(0.25rem)';
  }
  if (btn) {
    btn.classList.toggle('toggle-active', isEnabled);
    btn.setAttribute('aria-checked', isEnabled ? 'true' : 'false');
  }
};

// Core synchronization function that updates classes and toggle positions
const syncAllSettings = () => {
  settings.dark = getSetting('gm-dark', 'true') !== 'false';
  settings.dyslexia = getSetting('gm-dyslexia', 'false') === 'true';
  settings.motion = getSetting('gm-motion', 'false') === 'true';

  if (document.documentElement) {
    document.documentElement.classList.toggle('light-mode', !settings.dark);
    document.documentElement.classList.toggle('dark', settings.dark);
    document.documentElement.classList.toggle('dyslexia-font', settings.dyslexia);
    document.documentElement.classList.toggle('reduced-motion', settings.motion);
  }

  if (document.body) {
    document.body.classList.toggle('light-mode', !settings.dark);
    document.body.classList.toggle('dark', settings.dark);
    document.body.classList.toggle('dyslexia-font', settings.dyslexia);
    document.body.classList.toggle('reduced-motion', settings.motion);
  }

  ['dark', 'dyslexia', 'motion'].forEach(updateToggleUI);
};

// Define all global window methods immediately at parsing level
window.openSettings = () => {
  openModal('settings');
};

window.toggleSetting = (key) => {
  if (key === 'dark') {
    settings.dark = !settings.dark;
    saveToStorage('gm-dark', settings.dark ? 'true' : 'false');
  } else if (key === 'dyslexia') {
    settings.dyslexia = !settings.dyslexia;
    saveToStorage('gm-dyslexia', settings.dyslexia ? 'true' : 'false');
  } else if (key === 'motion') {
    settings.motion = !settings.motion;
    saveToStorage('gm-motion', settings.motion ? 'true' : 'false');
  }
  syncAllSettings();
};

window.toggleMobileMenu = () => {
  const menu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  
  if (menu) {
    const isHidden = menu.classList.contains('hidden');
    if (isHidden) {
      menu.classList.remove('hidden');
      if (menuIcon) menuIcon.classList.add('hidden');
      if (closeIcon) closeIcon.classList.remove('hidden');
    } else {
      menu.classList.add('hidden');
      if (menuIcon) menuIcon.classList.remove('hidden');
      if (closeIcon) closeIcon.classList.add('hidden');
    }
  }
};

window.showCookieWarning = () => {
  const cookieWarningModal = document.getElementById('cookie-warning-modal');
  if (cookieWarningModal) {
    cookieWarningModal.classList.remove('hidden');
    void cookieWarningModal.offsetWidth;
    cookieWarningModal.classList.remove('opacity-0', 'pointer-events-none');
    const firstChild = cookieWarningModal.firstElementChild;
    if (firstChild) {
      firstChild.classList.remove('scale-95');
      firstChild.classList.add('scale-100');
    }
  }
};

window.hideCookieWarning = () => {
  const cookieWarningModal = document.getElementById('cookie-warning-modal');
  if (cookieWarningModal) {
    cookieWarningModal.classList.add('opacity-0', 'pointer-events-none');
    const firstChild = cookieWarningModal.firstElementChild;
    if (firstChild) {
      firstChild.classList.remove('scale-100');
      firstChild.classList.add('scale-95');
    }
    setTimeout(() => {
      cookieWarningModal.classList.add('hidden');
    }, 300);
  }
};

window.acceptCookies = () => {
  try {
    localStorage.setItem('gm-cookie-consent', 'accepted');
  } catch (e) {}
  
  // Persist current settings since we got acceptance
  try {
    localStorage.setItem('gm-dark', settings.dark ? 'true' : 'false');
    localStorage.setItem('gm-dyslexia', settings.dyslexia ? 'true' : 'false');
    localStorage.setItem('gm-motion', settings.motion ? 'true' : 'false');
  } catch (e) {}
  
  hideBanner();
  window.hideCookieWarning();
};

window.declineCookiesFinal = () => {
  try {
    localStorage.setItem('gm-cookie-consent', 'declined');
  } catch (e) {}
  
  // Flush local storage settings
  try {
    localStorage.removeItem('gm-dark');
    localStorage.removeItem('gm-dyslexia');
    localStorage.removeItem('gm-motion');
  } catch (e) {}
  
  hideBanner();
  window.hideCookieWarning();
};

const showBanner = () => {
  const cookieBanner = document.getElementById('cookie-banner');
  if (cookieBanner) {
    cookieBanner.classList.remove('hidden');
    void cookieBanner.offsetWidth;
    cookieBanner.classList.remove('translate-y-full');
  }
};

const hideBanner = () => {
  const cookieBanner = document.getElementById('cookie-banner');
  if (cookieBanner) {
    cookieBanner.classList.add('translate-y-full');
    setTimeout(() => {
      cookieBanner.classList.add('hidden');
    }, 500);
  }
};

// Global pageshow event listener to catch back-navigation & initial loading flawlessly
window.addEventListener('pageshow', (event) => {
  // 1. Inject DOM elements (modals, menus, headers) if not already present
  try {
    injectEverything();
  } catch (e) {
    console.error("Pageshow Injection error:", e);
  }

  // 2. Set internal Loaded state
  try {
    sessionStorage.setItem('gm-loaded', 'true');
  } catch(e) {}

  // 3. Sync styles & layout classes & toggle switches
  syncAllSettings();

  // 4. Setup Cookie Dialog trigger
  let cookieConsent = null;
  try {
    cookieConsent = localStorage.getItem('gm-cookie-consent');
  } catch (e) {}
  if (!cookieConsent) {
    setTimeout(showBanner, 2000);
  }

  // 5. De-activate and clear loading screen helper
  const skipLoader = window.__skipLoader || event.persisted || getSetting('gm-loaded', 'false') === 'true';
  const loader = document.getElementById('loading-screen');
  
  if (skipLoader) {
    if (textInterval) clearInterval(textInterval);
    if (loader) {
      loader.style.transition = 'none';
      loader.classList.add('hidden-loader');
      loader.style.display = 'none';
    }
    if (document.body) document.body.classList.remove('loading-lock');
    if (document.documentElement) document.documentElement.classList.remove('loading-lock');
  } else {
    setTimeout(() => {
      if (textInterval) clearInterval(textInterval);
      if (loader) {
        loader.classList.add('hidden-loader');
        if (document.body) document.body.classList.remove('loading-lock');
        if (document.documentElement) document.documentElement.classList.remove('loading-lock');
        setTimeout(() => {
          loader.style.display = 'none';
        }, 800);
      }
    }, 1200);
  }
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
