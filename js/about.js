// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    
    // Generate Sparkles
    function createSparkles() {
        const sparklesContainer = document.getElementById('sparkles');
        const sparkleCount = 20;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 3 + 's';
            sparkle.style.animationDuration = (Math.random() * 2 + 2) + 's';
            sparklesContainer.appendChild(sparkle);
        }
    }

    // Scroll Animation Observer
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        // Observe all elements with animate-on-scroll class
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Smooth Scrolling for Navigation Links
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Mobile Menu Toggle (if needed for responsive design)
    function initMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const burger = document.querySelector('.burger-menu');
        
        if (burger) {
            burger.addEventListener('click', () => {
                navLinks.classList.toggle('nav-active');
                burger.classList.toggle('toggle');
            });
        }
    }

    // Add parallax effect to floating elements
    function initParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.floating-element');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Add hover effects for cards
    function initCardEffects() {
        const cards = document.querySelectorAll('.section-card, .step-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Add typing effect to hero title
    function initTypingEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            heroTitle.style.borderRight = '2px solid';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    heroTitle.style.borderRight = 'none';
                }
            };
            
            setTimeout(typeWriter, 500);
        }
    }

    // Add random floating animation to problem items
    function initProblemItemAnimations() {
        const problemItems = document.querySelectorAll('.problem-item');
        
        problemItems.forEach((item, index) => {
            item.style.animationDelay = (index * 0.2) + 's';
            
            item.addEventListener('mouseenter', function() {
                this.style.animation = 'none';
                this.style.transform = 'translateX(15px) scale(1.02)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0) scale(1)';
            });
        });
    }

    // Add interactive step card animations
    function initStepCardAnimations() {
        const stepCards = document.querySelectorAll('.step-card');
        
        stepCards.forEach((card, index) => {
            card.addEventListener('mouseenter', function() {
                // Add a subtle rotation based on card position
                const rotation = (index % 2 === 0) ? 'rotate(2deg)' : 'rotate(-2deg)';
                this.style.transform = `translateY(-10px) scale(1.05) ${rotation}`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
            });
        });
    }

    // Add floating animation to creator avatar
    function initCreatorAvatarEffect() {
        const avatar = document.querySelector('.creator-avatar');
        if (avatar) {
            let isHovered = false;
            
            avatar.addEventListener('mouseenter', function() {
                isHovered = true;
                this.style.animation = 'none';
                this.style.transform = 'translateY(-20px) scale(1.1) rotate(10deg)';
            });
            
            avatar.addEventListener('mouseleave', function() {
                isHovered = false;
                this.style.animation = 'avatarFloat 3s ease-in-out infinite';
                this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
            });
        }
    }

    // Add loading animation
    function initLoadingAnimation() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });
    }

    // Add scroll progress indicator
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
    const owner = "supriya46788";  
    const repo = "BakeGenuis-AI";  
    const token = "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";
    const contributorsContainer = document.getElementById("contributors-container");
    async function loadContributors(){
        try {
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors`,{
                headers: {
                    Authorization: `token ${token}`
      }
            });
            const contributors = await res.json();
            if (!Array.isArray(contributors)) {
            console.error("GitHub API Error:", contributors);
            contributorsContainer.innerHTML = "<p>⚠ Unable to load contributors. Please try again later.</p>";
            return;
    }

            contributors.forEach(contributor=>{
                const card = document.createElement("div");
                card.classList.add("contributor-card");
                card.innerHTML = `<img src="${contributor.avatar_url}" alt="${contributor.login}">
                <h3><a href="${contributor.html_url}" target="_blank">${contributor.login}</a></h3>
                <p>Contributions: ${contributor.contributions}</p>`;
                contributorsContainer.appendChild(card);

            })

            
        } catch (error) {
            console.error("Error fetching contributors:", error);
            
        }

       

    }

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
    initNavLinkEffects();
    initCreatorAvatarEffect();
    initLoadingAnimation();
    initScrollProgress();
    loadContributors();

    // Add some extra sparkle regeneration
    setInterval(createSparkles, 10000);
    
    console.log('🍰 BakeGenius.ai About Page Loaded Successfully!');
});
    