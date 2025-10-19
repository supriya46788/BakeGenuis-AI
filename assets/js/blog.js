
        // Blog data with rich content - Articles, Recipes, and News
        const blogs = [
            // News Posts
            {
                id: 1,
                title: "BakeGenius.ai Launches AI-Powered Recipe Assistant",
                category: "news",
                excerpt: "Exciting news! We've launched our new AI assistant that helps you convert any recipe to precise measurements in seconds. Try it today!",
                image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&h=300&fit=crop",
                date: "Jan 20, 2025",
                readTime: "3 min",
                author: "Supriya Pandey"
            },
            {
                id: 2,
                title: "New Feature: Voice-Activated Conversions",
                category: "news",
                excerpt: "Hands covered in flour? No problem! Use voice commands to convert measurements while you bake. Rolling out this week!",
                image: "https://images.unsplash.com/photo-1589149098258-3e9102cd63d3?w=500&h=300&fit=crop",
                date: "Jan 18, 2025",
                readTime: "2 min",
                author: "BakeGenius Team"
            },
            {
                id: 3,
                title: "10,000+ Successful Conversions Milestone",
                category: "news",
                excerpt: "Thank you to our amazing community! We've helped convert over 10,000 recipes with perfect accuracy. Here's to many more!",
                image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&h=300&fit=crop",
                date: "Jan 15, 2025",
                readTime: "3 min",
                author: "Supriya Pandey"
            },
            
            // Recipe Posts
            {
                id: 4,
                title: "Classic French Croissants Recipe",
                category: "recipes",
                excerpt: "Master the art of laminated dough with our gram-perfect croissant recipe. Includes step-by-step photos and temperature guides.",
                image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&h=300&fit=crop",
                date: "Jan 16, 2025",
                readTime: "15 min",
                author: "Chef Marie"
            },
            {
                id: 5,
                title: "Ultimate Chocolate Chip Cookie Recipe",
                category: "recipes",
                excerpt: "The perfect balance of crispy edges and chewy centers. Precise measurements ensure bakery-quality cookies every time.",
                image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&h=300&fit=crop",
                date: "Jan 14, 2025",
                readTime: "8 min",
                author: "Baker Sarah"
            },
            {
                id: 6,
                title: "Artisan Sourdough Bread - Complete Guide",
                category: "recipes",
                excerpt: "From starter to bake, this comprehensive sourdough guide includes hydration ratios, timing schedules, and troubleshooting tips.",
                image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=300&fit=crop",
                date: "Jan 12, 2025",
                readTime: "20 min",
                author: "Master Baker Tom"
            },
            {
                id: 7,
                title: "Red Velvet Cupcakes with Cream Cheese Frosting",
                category: "recipes",
                excerpt: "Moist, tender red velvet cupcakes with the perfect tangy frosting. Includes natural coloring alternatives and scaling options.",
                image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=500&h=300&fit=crop",
                date: "Jan 10, 2025",
                readTime: "10 min",
                author: "Pastry Chef Lisa"
            },
            
            // Article Posts
            {
                id: 8,
                title: "The Science Behind Perfect Cake Texture",
                category: "articles",
                excerpt: "Dive deep into the chemistry of baking. Learn how protein, fat, and sugar ratios affect your cake's final texture and crumb.",
                image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=300&fit=crop",
                date: "Jan 17, 2025",
                readTime: "12 min",
                author: "Dr. Emma Wilson"
            },
            {
                id: 9,
                title: "Why Professional Bakers Use Weight, Not Volume",
                category: "articles",
                excerpt: "Understanding the critical difference between cups and grams. Why precision matters and how it transforms your baking results.",
                image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&h=300&fit=crop",
                date: "Jan 13, 2025",
                readTime: "8 min",
                author: "Baking Institute"
            },
            {
                id: 10,
                title: "Mastering Ingredient Temperatures in Baking",
                category: "articles",
                excerpt: "Room temperature butter, cold eggs, or warm milk? Learn when temperature matters and how it impacts your baked goods.",
                image: "https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=500&h=300&fit=crop",
                date: "Jan 11, 2025",
                readTime: "10 min",
                author: "Culinary Expert Mike"
            },
            {
                id: 11,
                title: "Understanding Different Types of Flour",
                category: "articles",
                excerpt: "All-purpose vs bread flour vs cake flour. A complete guide to protein content and how to choose the right flour for every recipe.",
                image: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&h=300&fit=crop",
                date: "Jan 9, 2025",
                readTime: "9 min",
                author: "Flour Expert Amy"
            },
            
            // Category-specific posts
            {
                id: 12,
                title: "Perfect Chocolate Cake Every Time",
                category: "cakes",
                excerpt: "Learn the science behind moist, fluffy chocolate cakes with our AI-powered tips for perfect measurements and temperature control.",
                image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=300&fit=crop",
                date: "Jan 8, 2025",
                readTime: "7 min",
                author: "Baker's Journal"
            },
            {
                id: 13,
                title: "Cookie Science: Crispy vs Chewy",
                category: "cookies",
                excerpt: "Discover how tiny measurement changes create dramatically different cookie textures. Master the art of precision baking.",
                image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=300&fit=crop",
                date: "Jan 6, 2025",
                readTime: "6 min",
                author: "Cookie Master"
            },
            {
                id: 14,
                title: "Bagels at Home: Boil & Bake",
                category: "breads",
                excerpt: "Achieve that perfect chewy texture with exact water ratios and boiling techniques for authentic New York-style bagels.",
                image: "https://images.unsplash.com/photo-1612187814158-8673e86c8e0b?w=500&h=300&fit=crop",
                date: "Jan 4, 2025",
                readTime: "11 min",
                author: "Bread Artisan"
            },
            {
                id: 15,
                title: "5 Common Baking Mistakes to Avoid",
                category: "tips",
                excerpt: "Stop making these measurement errors! Learn how AI precision prevents the most common baking failures and saves your recipes.",
                image: "https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=500&h=300&fit=crop",
                date: "Jan 2, 2025",
                readTime: "7 min",
                author: "Pro Baker Tips"
            },
            {
                id: 16,
                title: "Scaling Recipes: The Complete Guide",
                category: "tips",
                excerpt: "Learn why doubling recipes isn't always 2x and how to scale baking agents properly with AI-powered calculations.",
                image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=300&fit=crop",
                date: "Dec 30, 2024",
                readTime: "8 min",
                author: "Baking Science"
            }
        ];

        let currentCategory = 'all';
        let searchTerm = '';

        // Initialize
        function initBlogs() {
            renderBlogs();
        }

        // Render blogs
        function renderBlogs() {
            const blogGrid = document.getElementById('blogGrid');
            const noResults = document.getElementById('noResults');
            
            let filteredBlogs = blogs;

            // Filter by category
            if (currentCategory !== 'all') {
                filteredBlogs = filteredBlogs.filter(blog => blog.category === currentCategory);
            }

            // Filter by search
            if (searchTerm) {
                filteredBlogs = filteredBlogs.filter(blog => 
                    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Show/hide results
            if (filteredBlogs.length === 0) {
                blogGrid.style.display = 'none';
                noResults.style.display = 'block';
            } else {
                blogGrid.style.display = 'grid';
                noResults.style.display = 'none';
            }

            // Render cards
            blogGrid.innerHTML = filteredBlogs.map(blog => `
                <div class="blog-card">
                    <img src="${blog.image}" alt="${blog.title}" loading="lazy">
                    <div class="blog-content">
                        <span class="blog-category">${blog.category.charAt(0).toUpperCase() + blog.category.slice(1)}</span>
                        <h3>${blog.title}</h3>
                        <div class="blog-meta">
                            <span><i class="far fa-calendar"></i>${blog.date}</span>
                            <span><i class="far fa-clock"></i>${blog.readTime}</span>
                        </div>
                        <p>${blog.excerpt}</p>
                        <div class="blog-author">
                            <i class="fas fa-user-circle"></i>
                            <span>By ${blog.author}</span>
                        </div>
                        <button class="read-more-btn" onclick="openBlog(${blog.id})">
                            Read More<i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Filter by category
        function filterCategory(category) {
            currentCategory = category;
            
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            renderBlogs();
        }

        // Search blogs
        function searchBlogs() {
            searchTerm = document.getElementById('searchInput').value;
            renderBlogs();
        }

        // Open blog
        function openBlog(id) {
            const blog = blogs.find(b => b.id === id);
            alert(`Opening: "${blog.title}"\n\nIn production, this would navigate to a detailed blog page with the full article, images, and related content.`);
        }

        // Navigation toggle
        function toggleNav() {
            const navLinks = document.getElementById('navLinks');
            const hamburger = document.getElementById('hamburger');
            
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
        }

        // Scroll to top
        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Scroll to bottom
        function scrollToBottom() {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }

        // Toggle dark mode
        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            const icon = document.querySelector('#darkModeToggle i');
            
            if (document.body.classList.contains('dark-mode')) {
                icon.className = 'fas fa-sun';
                localStorage.setItem('darkMode', 'enabled');
            } else {
                icon.className = 'fas fa-moon';
                localStorage.setItem('darkMode', 'disabled');
            }
        }

        // Show/hide scroll buttons based on scroll position
        function handleScroll() {
            const backToTop = document.getElementById('backToTop');
            const topToBack = document.getElementById('Toptoback');
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Show back to top when scrolled down
            if (scrollTop > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
            
            // Show top to back when not at bottom
            if (scrollTop + windowHeight < documentHeight - 100) {
                topToBack.classList.add('show');
            } else {
                topToBack.classList.remove('show');
            }
        }

        // Load dark mode preference and initialize
        window.onload = function() {
            // Hide loading screen
            setTimeout(() => {
                document.getElementById('loading-screen').classList.add('hidden');
            }, 1000);
            
            // Initialize blogs
            initBlogs();
            
            // Set up dark mode
            if (localStorage.getItem('darkMode') === 'enabled') {
                document.body.classList.add('dark-mode');
                document.querySelector('#darkModeToggle i').className = 'fas fa-sun';
            }
            
            // Set up navigation
            document.getElementById('hamburger').addEventListener('click', toggleNav);
            
            // Set up dark mode toggle
            document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
            
            // Set up scroll buttons
            document.getElementById('backToTop').addEventListener('click', scrollToTop);
            document.getElementById('Toptoback').addEventListener('click', scrollToBottom);
            
            // Handle scroll events
            window.addEventListener('scroll', handleScroll);
            handleScroll(); // Initial check
        };
        
        // Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const darkModeIcon = darkModeToggle.querySelector('i');

const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
  body.classList.add('dark-mode');
  darkModeIcon.classList.replace('fa-moon','fa-sun');
}

darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  if (body.classList.contains('dark-mode')) {
    darkModeIcon.classList.replace('fa-moon','fa-sun');
    localStorage.setItem('theme','dark');
  } else {
    darkModeIcon.classList.replace('fa-sun','fa-moon');
    localStorage.setItem('theme','light');
  }
});
