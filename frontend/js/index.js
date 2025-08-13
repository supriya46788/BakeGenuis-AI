function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return; // stop if button not found

  if (document.documentElement.scrollHeight <= window.innerHeight) {
    btn.style.display = "block"; // always visible if no scroll
  } else if (
    document.body.scrollTop > 0 ||
    document.documentElement.scrollTop > 0
  ) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
}

window.addEventListener("scroll", toggleBackToTop);
window.addEventListener("load", toggleBackToTop);

// Show button when scrolled down 300px
//   window.onscroll = function() {
//     document.getElementById("backToTop").style.display =
//       document.documentElement.scrollTop > 0 ? "block" : "none";
//   };

//   // Scroll smoothly to top
//   document.getElementById("backToTop").onclick = function() {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark-mode");
}
// Mobile Navigation Toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  hamburger.classList.toggle("active");
});

// Close mobile menu when clicking on a link
const navItems = document.querySelectorAll(".nav-links a");
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("active");
    hamburger.classList.remove("active");
  });
});

// Smooth scroll for CTA button
const ctaButton = document.querySelector(".cta-button");
ctaButton.addEventListener("click", (e) => {
  e.preventDefault();
  // Add a fun animation on click
  ctaButton.style.animation = "bounce 0.5s ease-in-out";
  setTimeout(() => {
    ctaButton.style.animation = "pulse 2s ease-in-out infinite";
    // Navigate to convert page (in real app)
    window.location.href = "convert.html";
  }, 500);
});

// Add random colors to floating sweets
const sweets = document.querySelectorAll(".sweet");
const colors = [
  "var(--candy-red)",
  "var(--sky-blue)",
  "var(--sunny-yellow)",
  "var(--soft-pink)",
  "var(--mint-green)",
];

sweets.forEach((sweet) => {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  sweet.style.color = randomColor;
  sweet.style.filter = "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))";
});

// Parallax effect for decorative icons
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallax = scrolled * 0.5;

  document.querySelectorAll(".baking-icon").forEach((icon, index) => {
    icon.style.transform = `translateY(${
      parallax * (index + 1) * 0.1
    }px) rotate(${parallax * 0.05}deg)`;
  });
});

// Remove sparkle effect on hover for feature cards
document.querySelectorAll(".feature-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    // Removed background change
    // card.style.background = 'rgba(255, 255, 255, 0.95)';
    card.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.15)";
  });

  card.addEventListener("mouseleave", () => {
    // Removed background change
    // card.style.background = 'rgba(255, 255, 255, 0.8)';
    card.style.boxShadow = "none";
  });
});

// Add loading animation
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transform = "translateY(20px)";
  document.body.style.transition = "all 0.8s ease-out";

  setTimeout(() => {
    document.body.style.opacity = "1";
    document.body.style.transform = "translateY(0)";
  }, 100);
});

// Dark/Light Mode Toggle Logic
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = themeToggleBtn.querySelector("i");

function updateToggleIcon() {
  if (document.documentElement.classList.contains("dark-mode")) {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }
}

themeToggleBtn.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark-mode");

  if (document.documentElement.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }

  updateToggleIcon();
});

updateToggleIcon();

// Music Toggle Logic
const musicToggleBtn = document.getElementById("music-toggle");
const music = document.getElementById("background-music");
const musicIcon = musicToggleBtn.querySelector("i");

// Check user preference from localStorage on page load
const savedMusicPreference = localStorage.getItem("music");

function updateMusicIcon() {
  if (music.paused) {
    musicIcon.classList.remove("fa-volume-up");
    musicIcon.classList.add("fa-volume-mute");
  } else {
    musicIcon.classList.remove("fa-volume-mute");
    musicIcon.classList.add("fa-volume-up");
  }
}

// Auto-play if not previously muted
if (savedMusicPreference !== "muted") {
  const playPromise = music.play();
  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      // Autoplay was prevented. Show the button, but don't play.
      console.log("Autoplay was prevented. User needs to click to play.");
    });
  }
}

// Update icon on initial load
updateMusicIcon();

musicToggleBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    localStorage.setItem("music", "playing");
  } else {
    music.pause();
    localStorage.setItem("music", "muted");
  }
  updateMusicIcon();
});
