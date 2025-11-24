// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const toggleLabels = document.querySelectorAll('.toggle-label');
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';
    updateToggleLabels(savedTheme);
    
    // Toggle theme when switch is clicked
    themeToggle.addEventListener('change', function() {
        const theme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateToggleLabels(theme);
    });
    
    function updateToggleLabels(theme) {
        toggleLabels.forEach(label => {
            if (theme === 'dark') {
                label.textContent = label.textContent === 'Light' ? 'Dark' : 'Light';
            } else {
                label.textContent = label.textContent === 'Dark' ? 'Light' : 'Dark';
            }
        });
    }
    
    // Accordion functionality for all pill levels
    const pillItems = document.querySelectorAll('.pill-item');
    pillItems.forEach(item => {
        const title = item.querySelector('.pill-title');
        title.addEventListener('click', () => {
            // Close all other main pills
            pillItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current pill
            item.classList.toggle('active');
        });
    });

    // Sub-pills
    const subPillItems = document.querySelectorAll('.sub-pill-item');
    subPillItems.forEach(item => {
        const title = item.querySelector('.sub-pill-title');
        title.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering parent pill
            item.classList.toggle('active');
        });
    });

    // Rationale pills
    const rationalePillItems = document.querySelectorAll('.rationale-pill-item');
    rationalePillItems.forEach(item => {
        const title = item.querySelector('.rationale-pill-title');
        title.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering parent pills
            item.classList.toggle('active');
        });
    });

    // Close all pills when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.pill-item') && !e.target.closest('.sub-pill-item') && !e.target.closest('.rationale-pill-item')) {
            pillItems.forEach(item => {
                item.classList.remove('active');
            });
            subPillItems.forEach(item => {
                item.classList.remove('active');
            });
            rationalePillItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    });
});
