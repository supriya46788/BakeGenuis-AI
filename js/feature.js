// Smooth scrolling with Lenis
function smoothScrolling() {
  // Check if Lenis is available
  if (typeof Lenis === 'undefined') {
    console.error('Lenis library not loaded. Please check if the script is included.');
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
    
    console.log('Smooth scrolling initialized successfully');
  } catch (error) {
    console.error('Error initializing smooth scrolling:', error);
  }
}

// Wait for DOM to be fully loaded before initializing
window.addEventListener('DOMContentLoaded', function() {
  setTimeout(smoothScrolling, 100); // Small delay to ensure everything is properly loaded
});