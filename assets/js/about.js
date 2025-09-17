// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", function () {
  // Generate Sparkles
  function createSparkles() {
    const sparklesContainer = document.getElementById("sparkles");
    const sparkleCount = 20;

    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.left = Math.random() * 100 + "%";
      sparkle.style.top = Math.random() * 100 + "%";
      sparkle.style.animationDelay = Math.random() * 3 + "s";
      sparkle.style.animationDuration = Math.random() * 2 + 2 + "s";
      sparklesContainer.appendChild(sparkle);
    }
  }

  // Scroll Animation Observer
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
        }
      });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });
  }

  // Smooth Scrolling for Navigation Links
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }


  // Dark Mode Toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;
  const darkModeIcon = darkModeToggle.querySelector('i');

  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    darkModeIcon.classList.remove('fa-moon');
    darkModeIcon.classList.add('fa-sun');
  }

  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    // Update icon
    if (body.classList.contains('dark-mode')) {
      darkModeIcon.classList.remove('fa-moon');
      darkModeIcon.classList.add('fa-sun');
      localStorage.setItem('theme', 'dark');
    } else {
      darkModeIcon.classList.remove('fa-sun');
      darkModeIcon.classList.add('fa-moon');
      localStorage.setItem('theme', 'light');
    }
  });

  // Mobile Menu Toggle (if needed for responsive design)
  function initMobileMenu() {
    const navLinks = document.querySelector(".nav-links");
    const burger = document.querySelector(".burger-menu");

    if (burger) {
      burger.addEventListener("click", () => {
        navLinks.classList.toggle("nav-active");
        burger.classList.toggle("toggle");
      });
    }
  }

  // Add parallax effect to floating elements
  function initParallaxEffect() {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll(".floating-element");

      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + index * 0.1;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  // Add hover effects for cards
  function initCardEffects() {
    const cards = document.querySelectorAll(".section-card, .step-card");

    cards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-10px) scale(1.02)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)";
      });
    });
  }

  // Add typing effect to hero title
  function initTypingEffect() {
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
      const text = heroTitle.textContent;
      heroTitle.textContent = "";
      heroTitle.style.borderRight = "2px solid";

      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          heroTitle.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 100);
        } else {
          heroTitle.style.borderRight = "none";
        }
      };

      setTimeout(typeWriter, 500);
    }
  }

  // Add random floating animation to problem items
  function initProblemItemAnimations() {
    const problemItems = document.querySelectorAll(".problem-item");

    problemItems.forEach((item, index) => {
      item.style.animationDelay = index * 0.2 + "s";

      item.addEventListener("mouseenter", function () {
        this.style.animation = "none";
        this.style.transform = "translateX(15px) scale(1.02)";
      });

      item.addEventListener("mouseleave", function () {
        this.style.transform = "translateX(0) scale(1)";
      });
    });
  }

  // Add interactive step card animations
  function initStepCardAnimations() {
    const stepCards = document.querySelectorAll(".step-card");

    stepCards.forEach((card, index) => {
      card.addEventListener("mouseenter", function () {
        // Add a subtle rotation based on card position
        const rotation = index % 2 === 0 ? "rotate(2deg)" : "rotate(-2deg)";
        this.style.transform = `translateY(-10px) scale(1.05) ${rotation}`;
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1) rotate(0deg)";
      });
    });
  }

  // Add dynamic color changes to nav links
  // function initNavLinkEffects() {
  //   const navLinks = document.querySelectorAll(".nav-links a:not(.active)");
  //   const colors = [
  //     "var(--candy-red)",
  //     "var(--sky-blue)",
  //     "var(--sunny-yellow)",
  //   ];

  //   navLinks.forEach((link, index) => {
  //     link.addEventListener("mouseenter", function () {
  //       this.style.backgroundColor = colors[index % colors.length];
  //     });
  //     link.addEventListener("mouseleave",function () {
  //       this.style.backgroundColor = "";
  //     })
  //   });
  // }

  // Add floating animation to creator avatar
  function initCreatorAvatarEffect() {
    const avatar = document.querySelector(".creator-avatar");
    if (avatar) {
      let isHovered = false;

      avatar.addEventListener("mouseenter", function () {
        isHovered = true;
        this.style.animation = "none";
        this.style.transform = "translateY(-20px) scale(1.1) rotate(10deg)";
      });

      avatar.addEventListener("mouseleave", function () {
        isHovered = false;
        this.style.animation = "avatarFloat 3s ease-in-out infinite";
        this.style.transform = "translateY(0) scale(1) rotate(0deg)";
      });
    }
  }

  // Add loading animation
  function initLoadingAnimation() {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.5s ease-in-out";

    window.addEventListener("load", () => {
      document.body.style.opacity = "1";
    });
  }

  // Add scroll progress indicator
  function initScrollProgress() {
    const progressBar = document.createElement("div");
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

    window.addEventListener("scroll", () => {
      const scrollPercent =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;
      progressBar.style.width = scrollPercent + "%";
    });
  }


  // Initialize all functions
  //  createSparkles();
  //  initScrollAnimations();
  //  initSmoothScrolling();
  //  initMobileMenu();
  //  initParallaxEffect();
  //  initCardEffects();
  //  initTypingEffect();
  //  initProblemItemAnimations();
  //  initStepCardAnimations();
  //  initCreatorAvatarEffect();
  //  initLoadingAnimation();
  //  initScrollProgress();

  // Dual Scroll Buttons
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const scrollBottomBtn = document.getElementById('scrollBottomBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }

    if (window.innerHeight + window.scrollY < document.body.offsetHeight - 300) {
      scrollBottomBtn.classList.add('show');
    } else {
      scrollBottomBtn.classList.remove('show');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  scrollBottomBtn.addEventListener('click', () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });


  // Add scroll progress indicator

  const owner = "supriya46788";
  const repo = "BakeGenuis-AI";
  const contributorsContainer = document.getElementById(
    "contributors-container"
  );
  let contributorsData = []; // store contributors globally
  async function loadContributors() {
    const contributorsContainer = document.getElementById(
      "contributors-container"
    );
    contributorsContainer.innerHTML = "Loading contributors...";

    try {
      const res = await fetch(
        "https://api.github.com/repos/supriya46788/BakeGenuis-AI/contributors"
      );
      const contributors = await res.json();

      if (!Array.isArray(contributors)) {
        contributorsContainer.innerHTML =
          "<p>⚠ Unable to load contributors.</p>";
        return;
      }

      //store golabally
      contributorsData = contributors;
      renderContributers(contributorsData); // intital render
    } catch (error) {
      // Handle contributor loading error gracefully
      contributorsContainer.innerHTML =
        "<p>⚠ Unable to load contributors at this time.</p>";
    }
  }

  function renderContributers(contributer) {
    contributorsContainer.innerHTML = ""; //clear previus

    if (contributer.length === 0) {
      contributorsContainer.innerHTML = "<p>😢 No contributors found</p>";
      return;
    }

    contributer.forEach((contri) => {
      const card = document.createElement("div");
      card.classList.add("contributor-card");
      card.setAttribute("data-username", contri.login.toLowerCase()); // for searching
      card.innerHTML = `
                <img src="${contri.avatar_url}" alt="${contri.login}">
                <span>${contri.login}</span>
            `;
      // added click event that will forced to open ghithub profile in new window of clicked contributer
      card.addEventListener("click", function () {
        window.open(contri.html_url, "_blank");
      });
      contributorsContainer.appendChild(card);
    });
  }

  // search functionality
  document
    .getElementById("searchContributer")
    .addEventListener("keyup", function () {
      const filter = this.value.toLowerCase();
      const filtered = contributorsData.filter((contributer) =>
        contributer.login.toLowerCase().includes(filter)
      );
      renderContributers(filtered);
    });

  //load contributers
  loadContributors();
  // Initialize all functions
  createSparkles();
  initScrollAnimations();
  initSmoothScrolling();
  initMobileMenu();
  initParallaxEffect();
  initCardEffects();
  initTypingEffect();
  initProblemItemAnimations();
  initStepCardAnimations();
  initCreatorAvatarEffect();
  initLoadingAnimation();
  initScrollProgress();


  // Add some extra sparkle regeneration
  setInterval(createSparkles, 10000);

  console.log("🍰 BakeGenius.ai About Page Loaded Successfully!");
});

