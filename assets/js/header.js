// Header functionality
function initializeHeader() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.querySelector('.main-nav');
    const menuLines = document.querySelectorAll('.menu-line');
    const navLinks = document.querySelectorAll('.nav-link');
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Set active page
    const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentLocation || 
            (currentLocation === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            if (mainNav) mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Animate menu icon
            menuLines.forEach((line, index) => {
                if (line && line.style) {
                    line.style.transform = this.classList.contains('active') ? 
                        `rotate(${index === 0 ? 45 : index === 1 ? 0 : -45}deg) translate(${index === 0 ? '4px, 4px' : index === 1 ? '0, 0' : '4px, -4px'})` : 
                        'none';
                    line.style.opacity = this.classList.contains('active') && index === 1 ? '0' : '1';
                }
            });
        });
    }
    
    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav && mainNav.classList.contains('active') && mobileMenuToggle) {
                mobileMenuToggle.click();
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mainNav && mainNav.classList.contains('active') && 
            mobileMenuToggle &&
            !e.target.closest('.main-nav') && 
            !e.target.closest('.mobile-menu-toggle')) {
            mobileMenuToggle.click();
        }
    });
}

// Dark mode functionality
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (darkModeToggle) {
        // Check for saved dark mode preference or use system preference
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const currentTheme = localStorage.getItem('darkMode');
        
        // Set initial theme
        if (currentTheme === 'true' || (currentTheme === null && prefersDarkScheme.matches)) {
            document.body.classList.add('dark-mode');
            updateDarkModeIcon(true);
        }
        
        // Toggle dark mode
        darkModeToggle.addEventListener('click', function() {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', isDark);
            updateDarkModeIcon(isDark);
        });
        
        // Listen for system theme changes
        prefersDarkScheme.addListener((e) => {
            if (localStorage.getItem('darkMode') === null) {
                const isDark = e.matches;
                document.body.classList.toggle('dark-mode', isDark);
                updateDarkModeIcon(isDark);
            }
        });
        
        function updateDarkModeIcon(isDark) {
            const icon = darkModeToggle.querySelector('i');
            if (icon) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHeader();
    initializeDarkMode();
});
