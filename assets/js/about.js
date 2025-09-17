document.addEventListener("DOMContentLoaded", function () {
  // Sparkle generator for background accent
  function createSparkles() {
    const sparklesContainer = document.getElementById("sparkles");
    sparklesContainer.innerHTML = '';
    const sparkleCount = 20;
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.left = Math.random() * 100 + "%";
      sparkle.style.top = Math.random() * 12 + "%";
      sparkle.style.animationDelay = Math.random() * 3 + "s";
      sparkle.style.animationDuration = Math.random() * 2 + 2 + "s";
      sparklesContainer.appendChild(sparkle);
    }
  }

  // Animate sections on scroll
  function initScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("animated");
      });
    }, observerOptions);
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });
  }

  // Contributor logic
  const owner = "supriya46788";
  const repo = "BakeGenuis-AI";
  const founderLogin = "supriya46788";
  const contributorsContainer = document.getElementById("contributors-container");
  let contributorsData = [];
  fetch("https://api.github.com/users/supriya46788")
  .then(response => response.json())
  .then(data => {
    const imgUrl = data.avatar_url; // this is the personal photo if set
    document.querySelector(".leader-img").src = imgUrl;
  });

  async function loadContributors() {
    contributorsContainer.innerHTML = "Loading contributors...";
    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contributors`
      );
      const contributors = await res.json();
      if (!Array.isArray(contributors)) {
        contributorsContainer.innerHTML = "<p>⚠ Unable to load contributors.</p>";
        return;
      }
      contributorsData = contributors.filter(contri => contri.login.toLowerCase() !== founderLogin.toLowerCase());
      renderContributors(contributorsData);
    } catch (error) {
      contributorsContainer.innerHTML =
        "<p>⚠ Unable to load contributors at this time.</p>";
    }
  }

  // Render contributor cards as per screenshot style
  function renderContributors(contributors) {
    contributorsContainer.innerHTML = "";
    if (contributors.length === 0) {
      contributorsContainer.innerHTML = "<p>😢 No contributors found</p>";
      return;
    }
    contributors.forEach((contri) => {
      const card = document.createElement("div");
      card.classList.add("contributor-card");
      card.setAttribute("data-username", contri.login.toLowerCase());
      card.innerHTML = `
        <img src="${contri.avatar_url}" alt="${contri.login}">
        <div class="contributor-info">
          <span class="contributor-username">${contri.login}</span>
          <span class="contributor-handle">@${contri.login}</span>
          <span class="contributor-badge">${contri.contributions} CONTRIBUTIONS</span>
        </div>
      `;
      card.addEventListener("click", function () {
        window.open(contri.html_url, "_blank");
      });
      contributorsContainer.appendChild(card);
    });
  }

  // Search bar logic
  document
    .getElementById("searchContributer")
    .addEventListener("keyup", function () {
      const filter = this.value.toLowerCase();
      const filtered = contributorsData.filter((contri) =>
        contri.login.toLowerCase().includes(filter)
      );
      renderContributors(filtered);
    });

  // Visual features
  createSparkles();
  setInterval(createSparkles, 10000); // Renew sparkles occasionally
  initScrollAnimations();
  loadContributors();

  // UNCHANGED: Other animation/scroll logic for the page
  // ...Leave other imported/scroll/hero logic unchanged
});
