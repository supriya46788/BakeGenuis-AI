// Recipe Hub JavaScript - BakeGenius.ai

class RecipeHub {
    constructor() {
        this.recipes = [];
        this.filteredRecipes = [];
        this.currentPage = 1;
        this.recipesPerPage = 12;
        this.savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
        this.followedCreators = JSON.parse(localStorage.getItem('followedCreators') || '[]');
        this.likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
        this.recipeLikes = JSON.parse(localStorage.getItem('recipeLikes') || '{}');
        
        this.init();
    }

    init() {
        this.loadSampleRecipes();
        this.setupEventListeners();
        this.createSparkles();
        this.renderTrendingRecipes();
        this.renderFeaturedRecipes();
        this.renderRecipeGrid();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const filterToggle = document.getElementById('filterToggle');
        const filtersPanel = document.getElementById('filtersPanel');
        const sortBy = document.getElementById('sortBy');
        const loadMoreBtn = document.getElementById('loadMoreBtn');

        searchInput?.addEventListener('input', (e) => this.handleSearch(e.target.value));
        filterToggle?.addEventListener('click', () => this.toggleFilters());
        sortBy?.addEventListener('change', (e) => this.handleSort(e.target.value));
        loadMoreBtn?.addEventListener('click', () => this.loadMoreRecipes());

        // Filter inputs
        const filterInputs = ['difficultyFilter', 'timeFilter', 'dietaryFilter', 'ingredientFilter'];
        filterInputs.forEach(filterId => {
            const element = document.getElementById(filterId);
            element?.addEventListener('change', () => this.applyFilters());
        });

        // View All buttons for Trending and Featured (show in main grid)
        const trendingViewAll = document.getElementById('viewAllTrending');
        const featuredViewAll = document.getElementById('viewAllFeatured');
        if (trendingViewAll) {
            trendingViewAll.addEventListener('click', () => this.showAllTrendingInGrid());
        }
        if (featuredViewAll) {
            featuredViewAll.addEventListener('click', () => this.showAllFeaturedInGrid());
        }
    }

    showAllTrendingInGrid() {
        // Show all trending recipes in the main recipe grid
        this.filteredRecipes = this.recipes.filter(recipe => recipe.trending);
        this.currentPage = 1;
        this.renderRecipeGrid();
        // Optionally scroll to the grid
        const grid = document.getElementById('recipeGrid');
        if (grid) grid.scrollIntoView({ behavior: 'smooth' });
    }

    showAllFeaturedInGrid() {
        // Show all featured recipes in the main recipe grid
        this.filteredRecipes = this.recipes.filter(recipe => recipe.featured);
        this.currentPage = 1;
        this.renderRecipeGrid();
        // Optionally scroll to the grid
        const grid = document.getElementById('recipeGrid');
        if (grid) grid.scrollIntoView({ behavior: 'smooth' });
    }

    createSparkles() {
        const sparklesContainer = document.getElementById('sparkles');
        if (!sparklesContainer) return;

        // Clear existing sparkles
        sparklesContainer.innerHTML = '';
        
        // Create individual sparkle elements
        for (let i = 0; i < 30; i++) {
            const sparkle = document.createElement('div');
            sparkle.classList.add('sparkle');
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 3 + 's';
            sparklesContainer.appendChild(sparkle);
        }
    }

    loadSampleRecipes() {
        // Sample recipe data with reliable placeholder images
        this.recipes = [
            {
                id: 1,
                title: "Classic Chocolate Chip Cookies",
                description: "Soft, chewy, and packed with chocolate chips. The perfect comfort food that never goes out of style.",
                image: "https://images.pexels.com/photos/890577/pexels-photo-890577.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
                creator: {
                    name: "Sarah Baker",
                    avatar: "https://i.pravatar.cc/50?img=1"
                },
                difficulty: "easy",
                cookTime: 25,
                rating: 4.8,
                ratingCount: 324,
                likes: 156,
                comments: 23,
                dietary: ["vegetarian"],
                ingredients: ["flour", "chocolate chips", "butter", "sugar"],
                tags: ["cookies", "chocolate", "dessert", "easy"],
                trending: true,
                featured: false
            },
            {
                id: 2,
                title: "Artisan Sourdough Bread",
                description: "Traditional sourdough with a perfect crust and tangy flavor. Made with wild yeast starter for authentic taste.",
                image: "https://images.pexels.com/photos/209196/pexels-photo-209196.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
                creator: {
                    name: "Mike Artisan",
                    avatar: "https://i.pravatar.cc/50?img=2"
                },
                difficulty: "hard",
                cookTime: 240,
                rating: 4.9,
                ratingCount: 189,
                likes: 89,
                comments: 45,
                dietary: ["vegan"],
                ingredients: ["flour", "water", "salt", "sourdough starter"],
                tags: ["bread", "sourdough", "artisan", "vegan"],
                trending: false,
                featured: true
            },
            {
                id: 3,
                title: "Rainbow Unicorn Cupcakes",
                description: "Magical vanilla cupcakes with rainbow layers and sparkly buttercream frosting. Perfect for celebrations!",
                image: "https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
                creator: {
                    name: "Emma Sweet",
                    avatar: "https://i.pravatar.cc/50?img=3"
                },
                difficulty: "medium",
                cookTime: 45,
                rating: 4.7,
                ratingCount: 267,
                likes: 201,
                comments: 34,
                dietary: ["vegetarian"],
                ingredients: ["flour", "sugar", "eggs", "food coloring", "buttercream"],
                tags: ["cupcakes", "rainbow", "party", "colorful"],
                trending: true,
                featured: true
            },
            {
                id: 4,
                title: "Vegan Chocolate Brownies",
                description: "Rich, fudgy brownies that happen to be vegan. No one will believe they're dairy and egg-free!",
                image: "https://images.pexels.com/photos/2373520/pexels-photo-2373520.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
                creator: {
                    name: "Alex Green",
                    avatar: "https://i.pravatar.cc/50?img=4"
                },
                difficulty: "easy",
                cookTime: 35,
                rating: 4.6,
                ratingCount: 156,
                likes: 78,
                comments: 19,
                dietary: ["vegan", "dairy-free"],
                ingredients: ["cocoa powder", "flour", "coconut oil", "maple syrup"],
                tags: ["brownies", "vegan", "chocolate", "healthy"],
                trending: false,
                featured: false
            },
            {
                id: 5,
                title: "French Macarons Masterclass",
                description: "Delicate French macarons with perfect feet and smooth tops. Multiple flavor variations included.",
                image: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
                creator: {
                    name: "Chef Laurent",
                    avatar: "https://i.pravatar.cc/50?img=5"
                },
                difficulty: "hard",
                cookTime: 90,
                rating: 4.9,
                ratingCount: 145,
                likes: 234,
                comments: 67,
                dietary: ["gluten-free", "vegetarian"],
                ingredients: ["almond flour", "powdered sugar", "egg whites", "food coloring"],
                tags: ["macarons", "french", "elegant", "gluten-free"],
                trending: true,
                featured: true
            },
            {
                id: 6,
                title: "Quick Cinnamon Rolls",
                description: "Soft, gooey cinnamon rolls ready in just 30 minutes. Perfect for weekend breakfast treats.",
                image: "https://images.pexels.com/photos/1055270/pexels-photo-1055270.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
                creator: {
                    name: "Jenny Morning",
                    avatar: "https://i.pravatar.cc/50?img=6"
                },
                difficulty: "medium",
                cookTime: 30,
                rating: 4.5,
                ratingCount: 298,
                likes: 167,
                comments: 41,
                dietary: ["vegetarian"],
                ingredients: ["flour", "cinnamon", "butter", "brown sugar", "yeast"],
                tags: ["cinnamon rolls", "breakfast", "quick", "sweet"],
                trending: false,
                featured: false
            }
        ];

        this.filteredRecipes = [...this.recipes];
        this.recipes.forEach(recipe => {
            if (this.recipeLikes[recipe.id] !== undefined) {
                recipe.likes = this.recipeLikes[recipe.id];
            }
        });
    }

    toggleFilters() {
        const filtersPanel = document.getElementById('filtersPanel');
        filtersPanel?.classList.toggle('active');
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.filteredRecipes = [...this.recipes];
        } else {
            this.filteredRecipes = this.recipes.filter(recipe => 
                recipe.title.toLowerCase().includes(searchTerm) ||
                recipe.description.toLowerCase().includes(searchTerm) ||
                recipe.creator.name.toLowerCase().includes(searchTerm) ||
                recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm)) ||
                recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.filteredRecipes];
        
        const difficulty = document.getElementById('difficultyFilter')?.value;
        const time = document.getElementById('timeFilter')?.value;
        const dietary = document.getElementById('dietaryFilter')?.value;
        const ingredient = document.getElementById('ingredientFilter')?.value.toLowerCase().trim();
        
        if (difficulty) {
            filtered = filtered.filter(recipe => recipe.difficulty === difficulty);
        }
        
        if (time) {
            const maxTime = parseInt(time);
            filtered = filtered.filter(recipe => recipe.cookTime <= maxTime);
        }
        
        if (dietary) {
            filtered = filtered.filter(recipe => recipe.dietary.includes(dietary));
        }
        
        if (ingredient) {
            filtered = filtered.filter(recipe => 
                recipe.ingredients.some(ing => ing.toLowerCase().includes(ingredient))
            );
        }
        
        this.filteredRecipes = filtered;
        this.currentPage = 1;
        this.renderRecipeGrid();
    }

    handleSort(sortBy) {
        switch (sortBy) {
            case 'latest':
                this.filteredRecipes.sort((a, b) => b.id - a.id);
                break;
            case 'popular':
                this.filteredRecipes.sort((a, b) => b.likes - a.likes);
                break;
            case 'rated':
                this.filteredRecipes.sort((a, b) => b.rating - a.rating);
                break;
        }
        
        this.renderRecipeGrid();
    }

    renderTrendingRecipes() {
        const container = document.getElementById('trendingRecipes');
        if (!container) return;
        
        const trendingRecipes = this.recipes.filter(recipe => recipe.trending);
        container.innerHTML = trendingRecipes.map(recipe => this.createRecipeCard(recipe, true)).join('');
        this.attachCardEventListeners(container);
    }

    renderFeaturedRecipes() {
        const container = document.getElementById('featuredRecipes');
        if (!container) return;
        
        const featuredRecipes = this.recipes.filter(recipe => recipe.featured);
        container.innerHTML = featuredRecipes.map(recipe => this.createRecipeCard(recipe, true)).join('');
        this.attachCardEventListeners(container);
    }

    renderRecipeGrid() {
        const container = document.getElementById('recipeGrid');
        if (!container) return;
        // Show all recipes (no pagination)
        container.innerHTML = this.filteredRecipes.map(recipe => this.createRecipeCard(recipe)).join('');
        this.attachCardEventListeners(container);
        // Hide load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }

    loadMoreRecipes() {
        this.currentPage++;
        this.renderRecipeGrid();
    }

    createRecipeCard(recipe, isCarousel = false) {
        const isLiked = this.likedRecipes.includes(recipe.id);
        const isSaved = this.savedRecipes.includes(recipe.id);
        const isFollowing = this.followedCreators.includes(recipe.creator.name);
        
        const stars = this.createStarRating(recipe.rating);
        const difficultyClass = recipe.difficulty;
        const tags = recipe.tags.slice(0, 3).map(tag => `<span class="recipe-tag">${tag}</span>`).join('');
        
        return `
            <div class="recipe-card ${isCarousel ? 'carousel-card' : ''}" data-recipe-id="${recipe.id}">
                <div class="recipe-image-container">
                    <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
                    <div class="recipe-overlay">
                        <div class="recipe-difficulty ${difficultyClass}">${recipe.difficulty}</div>
                        <div class="recipe-time">
                            <i class="fas fa-clock"></i>
                            <span>${recipe.cookTime}m</span>
                        </div>
                    </div>
                    <button class="save-btn ${isSaved ? 'saved' : ''}" title="Save to Cookbook">
                        <i class="fas fa-bookmark"></i>
                    </button>
                </div>
                <div class="recipe-content">
                    <div class="recipe-header">
                        <h3 class="recipe-title">${recipe.title}</h3>
                        <div class="recipe-rating">
                            <div class="stars">${stars}</div>
                            <span class="rating-count">(${recipe.ratingCount})</span>
                        </div>
                    </div>
                    <p class="recipe-description">${recipe.description}</p>
                    <div class="recipe-creator">
                        <img src="${recipe.creator.avatar}" alt="${recipe.creator.name}" class="creator-avatar">
                        <span class="creator-name">${recipe.creator.name}</span>
                        <button class="follow-btn ${isFollowing ? 'following' : ''}">${isFollowing ? 'Following' : 'Follow'}</button>
                    </div>
                    <div class="recipe-actions">
                        <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" title="Like">
                            <i class="fas fa-heart"></i>
                            <span class="count">${recipe.likes}</span>
                        </button>
                        <button class="action-btn comment-btn" title="Comments">
                            <i class="fas fa-comment"></i>
                            <span class="count">${recipe.comments}</span>
                        </button>
                        <button class="action-btn share-btn" title="Share">
                            <i class="fas fa-share"></i>
                        </button>
                        <button class="action-btn copy-btn" title="Copy Recipe">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="recipe-tags">${tags}</div>
                </div>
            </div>
        `;
    }

    createStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star star filled"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt star filled"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star star"></i>';
        }
        
        return stars;
    }

    attachCardEventListeners(container) {
        // Save button functionality
        container.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const recipeId = parseInt(btn.closest('.recipe-card').dataset.recipeId);
                this.toggleSaveRecipe(recipeId, btn);
            });
        });

        // Like button functionality
        container.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const recipeId = parseInt(btn.closest('.recipe-card').dataset.recipeId);
                this.toggleLikeRecipe(recipeId, btn);
            });
        });

        // Follow button functionality
        container.querySelectorAll('.follow-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const creatorName = btn.previousElementSibling.textContent;
                this.toggleFollowCreator(creatorName, btn);
            });
        });

        // Share button functionality
        container.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const recipeId = parseInt(btn.closest('.recipe-card').dataset.recipeId);
                this.shareRecipe(recipeId);
            });
        });

        // Copy button functionality
        container.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const recipeId = parseInt(btn.closest('.recipe-card').dataset.recipeId);
                this.copyRecipe(recipeId);
            });
        });

        // Comment button functionality
        container.querySelectorAll('.comment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const recipeId = parseInt(btn.closest('.recipe-card').dataset.recipeId);
                this.showComments(recipeId);
            });
        });
    }

    toggleSaveRecipe(recipeId, btn) {
        const index = this.savedRecipes.indexOf(recipeId);
        
        if (index > -1) {
            this.savedRecipes.splice(index, 1);
            btn.classList.remove('saved');
            this.showNotification('Recipe removed from cookbook', 'info');
        } else {
            this.savedRecipes.push(recipeId);
            btn.classList.add('saved');
            this.showNotification('Recipe saved to cookbook!', 'success');
        }
        
        localStorage.setItem('savedRecipes', JSON.stringify(this.savedRecipes));
    }

    toggleLikeRecipe(recipeId, btn) {
        const index = this.likedRecipes.indexOf(recipeId);
        const countSpan = btn.querySelector('.count');
        const recipe = this.recipes.find(r => r.id === recipeId);

        if (index > -1) {
            this.likedRecipes.splice(index, 1);
            btn.classList.remove('liked');
            recipe.likes--;
        } else {
            this.likedRecipes.push(recipeId);
            btn.classList.add('liked');
            recipe.likes++;
        }

        this.recipeLikes[recipeId] = recipe.likes;
        countSpan.textContent = recipe.likes;
        localStorage.setItem('likedRecipes', JSON.stringify(this.likedRecipes));
        localStorage.setItem('recipeLikes', JSON.stringify(this.recipeLikes));
    }

    toggleFollowCreator(creatorName, btn) {
        const index = this.followedCreators.indexOf(creatorName);
        
        if (index > -1) {
            this.followedCreators.splice(index, 1);
            btn.classList.remove('following');
            btn.textContent = 'Follow';
            this.showNotification(`Unfollowed ${creatorName}`, 'info');
        } else {
            this.followedCreators.push(creatorName);
            btn.classList.add('following');
            btn.textContent = 'Following';
            this.showNotification(`Now following ${creatorName}!`, 'success');
        }
        
        localStorage.setItem('followedCreators', JSON.stringify(this.followedCreators));
    }

    shareRecipe(recipeId) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        
        if (navigator.share) {
            navigator.share({
                title: recipe.title,
                text: recipe.description,
                url: window.location.href + `?recipe=${recipeId}`
            });
        } else {
            // Fallback: copy to clipboard
            const shareUrl = window.location.href + `?recipe=${recipeId}`;
            navigator.clipboard.writeText(shareUrl).then(() => {
                this.showNotification('Recipe link copied to clipboard!', 'success');
            });
        }
    }

    copyRecipe(recipeId) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        const recipeText = `${recipe.title}\n\n${recipe.description}\n\nIngredients: ${recipe.ingredients.join(', ')}\nCook Time: ${recipe.cookTime} minutes\nDifficulty: ${recipe.difficulty}`;
        
        navigator.clipboard.writeText(recipeText).then(() => {
            this.showNotification('Recipe copied to clipboard!', 'success');
        });
    }

    showComments(recipeId) {
        // Placeholder for comments functionality
        this.showNotification('Comments feature coming soon!', 'info');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        // Set background color based on type
        const colors = {
            success: '#4ecdc4',
            error: '#ff6b6b',
            info: '#60a5fa'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize Recipe Hub when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RecipeHub();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RecipeHub;
}
// Baking Tips Array
const bakingTips = [
  "Always preheat your oven for even baking. 🔥",
  "Use room temperature eggs and butter for smoother batters. 🥚🧈",
  "Don’t open the oven door too often—it drops the temperature! 🚪❌",
  "Weigh your ingredients for accuracy instead of using cups. ⚖️",
  "Chill cookie dough before baking for thicker cookies. 🍪",
  "Line pans with parchment paper to prevent sticking. 📜",
  "Let cakes cool before frosting or the icing will melt. 🎂",
  "Use unsalted butter to control salt levels better. 🧈",
  "Always taste your batter for balance (except raw egg doughs 😉).",
  "A pinch of salt enhances the sweetness of desserts. 🧂🍫"
];

// DOM Elements
const tipBtn = document.getElementById("tipBtn");
const tipPopup = document.getElementById("tipPopup");
const tipText = document.getElementById("tipText");
const closeTip = document.getElementById("closeTip");

// Show Random Tip
tipBtn.addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * bakingTips.length);
  tipText.textContent = bakingTips[randomIndex];
  tipPopup.style.display = "block";
});

// Close Popup
closeTip.addEventListener("click", () => {
  tipPopup.style.display = "none";
});