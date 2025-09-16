// Dark Mode Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Check for saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Apply dark mode if previously enabled
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }
    
    // Set up dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', isDark);
            updateDarkModeIcon(isDark);
        });
    }
    
    // Update the dark mode icon based on current state
    function updateDarkModeIcon(isDark) {
        const icon = darkModeToggle ? darkModeToggle.querySelector('i') : null;
        if (icon) {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
});
