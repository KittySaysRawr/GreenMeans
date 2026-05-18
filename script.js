let lastFocusedElement;

function openModal(id) {
  lastFocusedElement = document.activeElement;
  document.body.style.overflow = 'hidden';
  const container = document.getElementById('modal-container');
  const pill = document.getElementById('modal-pill');
  
  ['about-content', 'contact-content', 'terms-content'].forEach(c => {
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
