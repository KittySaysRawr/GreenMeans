---
layout: default
title: "Green Means – Green Party of England and Wales"
---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ page.title }}</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
    <link href="{{ '/assets/css/style.css' | relative_url }}" rel="stylesheet">
</head>
<body>
    <header>
        <div class="header-content">
            <div class="theme-toggle">
                <span class="toggle-label">Light</span>
                <label class="toggle-switch">
                    <input type="checkbox" id="theme-toggle">
                    <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">Dark</span>
            </div>
            
            <div class="logo-container">
                <svg class="logo" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#00A651" />
                            <stop offset="100%" stop-color="#8DC63F" />
                        </linearGradient>
                    </defs>
                    <rect x="10" y="15" width="40" height="30" rx="5" fill="url(#greenGradient)" />
                    <circle cx="30" cy="30" r="12" fill="white" />
                    <text x="65" y="35" font-family="Montserrat, sans-serif" font-weight="700" font-size="18" fill="#00A651">GREEN PARTY</text>
                    <text x="65" y="50" font-family="Montserrat, sans-serif" font-weight="400" font-size="12" fill="#2C2A29">of England and Wales</text>
                </svg>
            </div>
            
            <div class="site-title">
                <h1>Green Means</h1>
                <div class="site-subtitle">Real Change for People and Planet</div>
            </div>
            
            <nav>
                <ul>
                    <li><a href="#" class="active">Home</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <section class="hero">
        <div class="hero-content">
            <h2>Green Means Real Change</h2>
            <p>The Green Party stands for real change—where "Green Means" acting for nature, the climate, our communities, and the future. Discover what Green Means for you and for everyone.</p>
            <a href="https://www.greenparty.org.uk/" target="_blank" class="cta-button">Visit Official Website</a>
        </div>
    </section>

    <main>
        <section class="policies-section">
            <div class="section-title">
                <h2>What Does Green Mean?</h2>
            </div>
            
            <div class="pills-container">
                <!-- Jobs Pill -->
                <div class="pill-item">
                    <button class="pill-title">Green Means: Jobs</button>
                    <div class="pill-content">
                        <div class="policy-highlight">
                            <strong>Green New Deal:</strong> "A transformative economic programme to tackle the climate emergency and create over a million good green jobs in the process."
                        </div>
                        
                        <div class="sub-pills-container">
                            <div class="sub-pill-item">
                                <button class="sub-pill-title">Green Job Creation</button>
                                <div class="sub-pill-content">
                                    <ul>
                                        <li>
                                            <strong>£40 billion annual investment</strong> to create 1.2 million jobs in renewable energy, public transport, home insulation and nature restoration
                                            <div class="rationale-pills-container">
                                                <div class="rationale-pill-item">
                                                    <button class="rationale-pill-title">Why This Works</button>
                                                    <div class="rationale-pill-content">
                                                        <ul>
                                                            <li>Creates 5-7 jobs per £1 million invested compared to 2.7 jobs in fossil fuels (University of Massachusetts)</li>
                                                            <li>Addresses both climate crisis and economic inequality simultaneously</li>
                                                            <li>Builds resilient infrastructure that saves money long-term through reduced energy costs</li>
                                                            <li>Positions UK as global leader in green technology and sustainable development</li>
                                                        </ul>
                                                        <div class="reference">Source: Green Party UK, UN Sustainable Development Goals, University of Massachusetts "Green Growth" study</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <!-- Add other list items from your original HTML -->
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Add other pill items from your original HTML here -->
                <!-- Investment, Democracy, Nature, NHS, Community, Transport, Education, Immigration, Costed, Evidence -->

            </div>
        </section>
    </main>

    <footer>
        <div class="footer-container">
            <div class="footer-logo">
                <svg class="footer-logo" viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="footerGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#00A651" />
                            <stop offset="100%" stop-color="#8DC63F" />
                        </linearGradient>
                    </defs>
                    <rect x="5" y="10" width="30" height="20" rx="3" fill="url(#footerGreenGradient)" />
                    <circle cx="20" cy="20" r="8" fill="white" />
                    <text x="45" y="25" font-family="Montserrat, sans-serif" font-weight="700" font-size="12" fill="white">GREEN PARTY</text>
                </svg>
            </div>
            
            <div class="copyright">
                &copy; 2024 Green Party of England and Wales. All rights reserved. | This site is not an official Green Party website but supports their policies.
            </div>
        </div>
    </footer>

    <script>
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
    </script>
</body>
</html>
