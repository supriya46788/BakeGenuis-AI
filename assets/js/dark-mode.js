/**
 * Dark Mode Functionality for BakeGenuis AI
 * This script handles the dark mode toggle and persistence across pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get dark mode elements
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return; // Skip if no dark mode toggle found
    
    const body = document.body;
    const darkModeIcon = darkModeToggle.querySelector('i');
    
    // Check for saved theme preference or use system preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = localStorage.getItem('theme');
    
    // If no theme is saved, use system preference
    if (!currentTheme) {
        currentTheme = prefersDarkScheme ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    }
    
    // Apply the saved theme
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        if (darkModeIcon) {
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
        }
    }
    
    // Set up the theme toggle
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Update icon and save preference
        if (body.classList.contains('dark-mode')) {
            if (darkModeIcon) {
                darkModeIcon.classList.remove('fa-moon');
                darkModeIcon.classList.add('fa-sun');
            }
            localStorage.setItem('theme', 'dark');
        } else {
            if (darkModeIcon) {
                darkModeIcon.classList.remove('fa-sun');
                darkModeIcon.classList.add('fa-moon');
            }
            localStorage.setItem('theme', 'light');
        }
    });
});
