// Mobile Navigation Toggle
      // const hamburger = document.getElementById('hamburger');
     // const navLinks = document.getElementById('navLinks');

       //hamburger.addEventListener('click', () => {
         //   navLinks.classList.toggle('active');
         //  hamburger.classList.toggle('active');
     // });

       //Close mobile menu when clicking on a link
     // const navItems = document.querySelectorAll('.nav-links a');
      // navItems.forEach(item => {
        //   item.addEventListener('click', () => {
          //    navLinks.classList.remove('active');
          //     hamburger.classList.remove('active');
        //    });
    //   });

        // Smooth scroll for CTA button
        const ctaButton = document.querySelector('.cta-button');
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Add a fun animation on click
            ctaButton.style.animation = 'bounce 0.5s ease-in-out';
            setTimeout(() => {
                ctaButton.style.animation = 'pulse 2s ease-in-out infinite';
                // Navigate to convert page (in real app)
                window.location.href = 'html/convert.html';
            }, 500);
        });

        // Parallax effect for decorative icons
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            document.querySelectorAll('.baking-icon').forEach((icon, index) => {
                icon.style.transform = `translateY(${parallax * (index + 1) * 0.1}px) rotate(${parallax * 0.05}deg)`;
            });
        });

        // Add sparkle effect on hover for feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.background = 'rgba(255, 255, 255, 0.95)';
                card.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.background = 'rgba(255, 255, 255, 0.8)';
                card.style.boxShadow = 'none';
            });
        });
     

