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