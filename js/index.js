
// ================= Mobile Navigation Toggle =================
// document.addEventListener('DOMContentLoaded', function() {
//     const hamburger = document.querySelector('.hamburger');
//     const menuWrapper = document.querySelector('.menu-wrapper');

//     if (hamburger && menuWrapper) {
//         hamburger.addEventListener('click', () => {
//             menuWrapper.classList.toggle('active');
//         });
//     }
// });

// ================= Smooth scroll for CTA button =================
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
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
}

// ================= Parallax effect for decorative icons =================
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallax = scrolled * 0.5;

  document.querySelectorAll('.baking-icon').forEach((icon, index) => {
    icon.style.transform = `translateY(${parallax * (index + 1) * 0.1}px) rotate(${parallax * 0.05}deg)`;
  });
});

// ================= Add sparkle effect on hover for feature cards =================
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

// Back to Top Button functionality
        let scrollBtn = document.getElementById("scrollTopBtn");

        window.onscroll = function () {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                scrollBtn.style.display = "block";
            } else {
                scrollBtn.style.display = "none";
            }
        };

        scrollBtn.onclick = function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        };

  window.addEventListener("scroll", toggleScrollBtns, { passive: true });
  toggleScrollBtns();

  // Scroll smoothly to bottom
  scrollToBottomBtn.addEventListener("click", () => {
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    window.scrollTo({ top: documentHeight, behavior: "smooth" });
  });

  // Scroll smoothly to top
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

