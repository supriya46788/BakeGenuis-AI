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
  // function initSmoothScrolling() {
  //     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  //         anchor.addEventListener('click', function (e) {
  //             e.preventDefault();
  //             const target = document.querySelector(this.getAttribute('href'));
  //             if (target) {
  //                 target.scrollIntoView({
  //                     behavior: 'smooth',
  //                     block: 'start'
  //                 });
  //             }
  //         });
  //     });
  // }

  // Mobile Menu Toggle (Corrected)
  // function initMobileMenu() {
  //     // 1. Select the button and the menu wrapper using their correct IDs
  //     const hamburgerBtn = document.getElementById('hamburger-menu');
  //     const menuWrapper = document.getElementById('menu-wrapper');

  //     // 2. Check if both elements actually exist before adding an event listener
  //     if (hamburgerBtn && menuWrapper) {
  //         hamburgerBtn.addEventListener('click', () => {
  //             // 3. Toggle the 'active' class on the menu-wrapper div
  //             // This matches the CSS rule: .menu-wrapper.active { display: flex; }
  //             menuWrapper.classList.toggle('active');
  //         });
  //     }
  // }

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
      // heroTitle.style.borderRight = '2px solid';

      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          heroTitle.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 100);
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

    // Try multiple possible repository URLs
    const possibleUrls = [
      `https://api.github.com/repos/Channpreetk/BakeGenuis-AI/contributors`,
      `https://api.github.com/repos/Channpreetk/BakeGenius-AI/contributors`,
      `https://api.github.com/repos/channpreetk/BakeGenuis-AI/contributors`
    ];

    for (let url of possibleUrls) {
      try {
        console.log('Trying URL:', url);
        const res = await fetch(url);
        
        console.log('Response status:', res.status);
        console.log('Response ok:', res.ok);
        
        if (res.ok) {
          const contributors = await res.json();
          console.log('Contributors data:', contributors);

          if (Array.isArray(contributors) && contributors.length > 0) {
            //store globally
            contributorsData = contributors;
            renderContributers(contributorsData);
            return; // Success, exit the function
          }
        }
      } catch (error) {
        console.log('Failed with URL:', url, 'Error:', error);
        continue; // Try next URL
      }
    }

    // If all API calls failed, show mock contributors
    console.log('All API calls failed, showing mock contributors');
    const mockContributors = [
      {
        login: "Channpreetk",
        avatar_url: "https://github.com/Channpreetk.png",
        html_url: "https://github.com/Channpreetk",
        contributions: 50
      },
      {
        login: "contributor1",
        avatar_url: "https://github.com/github.png",
        html_url: "https://github.com",
        contributions: 25
      },
      {
        login: "contributor2", 
        avatar_url: "https://github.com/github.png",
        html_url: "https://github.com",
        contributions: 15
      },
      {
        login: "contributor3",
        avatar_url: "https://github.com/github.png", 
        html_url: "https://github.com",
        contributions: 10
      }
    ];
    
    contributorsData = mockContributors;
    renderContributers(contributorsData);
    
    // Show a note about mock data
    const noteDiv = document.createElement('div');
    noteDiv.style.textAlign = 'center';
    noteDiv.style.marginTop = '10px';
    noteDiv.style.fontSize = '12px';
    noteDiv.style.color = '#666';
    noteDiv.innerHTML = `<p>📝 Showing sample contributors. Connect your repository to see actual contributors.</p>`;
    contributorsContainer.appendChild(noteDiv);
  }

  function renderContributers(contributer) {
    console.log('Rendering contributors:', contributer);
    contributorsContainer.innerHTML = ""; //clear previus

    if (contributer.length === 0) {
      contributorsContainer.innerHTML = "<p>😢 No contributors found</p>";
      return;
    }

    contributer.forEach((contri) => {
      console.log('Creating card for:', contri.login);
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
    
    console.log('Contributors container after rendering:', contributorsContainer.innerHTML);
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
  console.log('About to load contributors...');
  
  // Test if the container exists
  const testContainer = document.getElementById("contributors-container");
  console.log('Contributors container found:', testContainer);
  
  if (!testContainer) {
    console.error('Contributors container not found!');
    return;
  }
  
  // Simple immediate display first
  testContainer.innerHTML = `
    <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
      <div style="background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center; cursor: pointer;" onclick="window.open('https://github.com/Channpreetk', '_blank')">
        <img src="https://github.com/Channpreetk.png" alt="Channpreetk" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 10px;">
        <div style="font-weight: bold;">Channpreetk</div>
      </div>
      <div style="background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center; cursor: pointer;" onclick="window.open('https://github.com', '_blank')">
        <img src="https://github.com/github.png" alt="Contributor 1" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 10px;">
        <div style="font-weight: bold;">Contributor 1</div>
      </div>
      <div style="background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center; cursor: pointer;" onclick="window.open('https://github.com', '_blank')">
        <img src="https://github.com/github.png" alt="Contributor 2" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 10px;">
        <div style="font-weight: bold;">Contributor 2</div>
      </div>
      <div style="background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center; cursor: pointer;" onclick="window.open('https://github.com', '_blank')">
        <img src="https://github.com/github.png" alt="Contributor 3" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 10px;">
        <div style="font-weight: bold;">Contributor 3</div>
      </div>
    </div>
  `;
  
  // Then try to load the real contributors after a delay
  setTimeout(() => {
    loadContributors();
  }, 1000);
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
  // initScrollProgress();
  // Add some extra sparkle regeneration
  setInterval(createSparkles, 10000);
});
