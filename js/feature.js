// Smooth scrolling with Lenis
function smoothScrolling() {
  // Check if Lenis is available
  if (typeof Lenis === 'undefined') {
    // Lenis library not available - use default scrolling
    return;
  }
  
  try {
    // Initialize Lenis with smooth scrolling settings
    const lenis = new Lenis({
      duration: 1.9,
      smooth: true,
      smoothTouch: false, // Disable smooth scrolling on touch devices for better performance
      touchMultiplier: 2,
    });

    // Create animation loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    // Start the animation loop
    requestAnimationFrame(raf);
    
    // Smooth scrolling initialized successfully
  } catch (error) {
    // Fallback to default scrolling behavior
  }
}

// Wait for DOM to be fully loaded before initializing
window.addEventListener('DOMContentLoaded', function() {
  setTimeout(smoothScrolling, 100); // Small delay to ensure everything is properly loaded
});


//globle scrolling progression bar across all pages
function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, var(--candy-red), var(--sky-blue), var(--sunny-yellow));
            z-index: 9999;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    initScrollProgress();


  // feature.js - This file should contain all shared JavaScript for your pages.

/**
 * Toggles the visibility of the mobile navigation menu.
 */
// This should be the complete code for your feature.js file

/**
 * Handles the main hamburger menu toggle functionality.
 * Toggles the menu visibility and the icon state (bars/cross).
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const menuWrapper = document.getElementById('menu-wrapper');

    if (hamburger && menuWrapper) {
        hamburger.addEventListener('click', () => {
            // Toggle the menu's visibility
            menuWrapper.classList.toggle('active');

            // Toggle the icon between bars and cross (times)
            const icon = hamburger.querySelector('i');
            if (menuWrapper.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

/**
 * Handles closing the mobile menu when a user clicks outside of it.
 */
function initClickOutsideToClose() {
    const hamburger = document.getElementById('hamburger-menu');
    const menuWrapper = document.getElementById('menu-wrapper');

    if (hamburger && menuWrapper) {
        document.addEventListener('click', function(event) {
            // Check if the menu is open and if the click was outside the menu AND the hamburger button
            const isMenuOpen = menuWrapper.classList.contains('active');
            const isClickOutside = !menuWrapper.contains(event.target) && !hamburger.contains(event.target);

            if (isMenuOpen && isClickOutside) {
                // Close the menu
                menuWrapper.classList.remove('active');

                // Reset the icon back to bars
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

/**
 * Makes the navbar background appear when the user scrolls down.
 */
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    // Exit if no navbar is found on the page
    if (!navbar) return; 

    const handleScroll = () => {
        // Add 'navbar-scrolled' class after scrolling 50px
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    };
    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
}

// This runs all initialization functions once the HTML page is loaded and ready.
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
     initClickOutsideToClose();
    initNavbarScrollEffect();
    // You can add calls to other shared functions here in the future.
});