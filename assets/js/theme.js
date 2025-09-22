// Centralized Dark Mode Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (!darkModeToggle) return; // Exit if the button isn't on the page

    const body = document.body;
    const darkModeIcon = darkModeToggle.querySelector("i");

    // Function to apply the theme based on localStorage
    const applyTheme = () => {
        const currentTheme = localStorage.getItem("theme") || "light";
        if (currentTheme === "dark") {
            body.classList.add("dark-mode");
            if (darkModeIcon) {
                darkModeIcon.classList.remove("fa-moon");
                darkModeIcon.classList.add("fa-sun");
            }
        } else {
            body.classList.remove("dark-mode");
            if (darkModeIcon) {
                darkModeIcon.classList.remove("fa-sun");
                darkModeIcon.classList.add("fa-moon");
            }
        }
    };

    // Event listener for the toggle button
    darkModeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        let theme = "light";
        if (body.classList.contains("dark-mode")) {
            theme = "dark";
        }
        localStorage.setItem("theme", theme);
        applyTheme(); // Update icon state
    });

    // Apply the theme on initial page load
    applyTheme();
});