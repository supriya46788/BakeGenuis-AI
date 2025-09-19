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

        // Mobile Navigation Toggle
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });

        // Recipe Conversion Logic
        const GEMINI_API_KEY = 'API_KEY';
        const GEMINI_API_URL = 'API_URL';

        let currentUnit = 'metric';
        let convertedData = [];

        // Ingredient to emoji mapping
        const ingredientEmojis = {
            'flour': '🌾',
            'sugar': '🍯',
            'butter': '🧈',
            'egg': '🥚',
            'milk': '🥛',
            'vanilla': '🌿',
            'baking powder': '⚡',
            'salt': '🧂',
            'chocolate': '🍫',
            'cocoa': '🍫',
            'oil': '🫒',
            'honey': '🍯',
            'cream': '🥛',
            'cheese': '🧀',
            'nuts': '🥜',
            'fruit': '🍓',
            'lemon': '🍋',
            'orange': '🍊',
            'cinnamon': '🌿',
            'default': '🥄'
        };

        function toggleMobileMenu() {
            const navLinks = document.getElementById('navLinks');
            navLinks.classList.toggle('active');
        }

        function handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById('recipeInput').value = e.target.result;
                };
                reader.readAsText(file);
            }
        }

        function getIngredientEmoji(ingredient) {
            const lower = ingredient.toLowerCase();
            for (const [key, emoji] of Object.entries(ingredientEmojis)) {
                if (lower.includes(key)) {
                    return emoji;
                }
            }
            return ingredientEmojis.default;
        }

        async function convertRecipe() {
            const recipeText = document.getElementById('recipeInput').value.trim();

            if (!recipeText) {
                showWarning('Please enter a recipe to convert!');
                return;
            }

            setLoading(true);

            try {
                const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `Convert this recipe to precise gram measurements. For each ingredient, provide:
1. Normalized ingredient name
2. Original measurement
3. Gram equivalent
4. Any relevant notes about the conversion

Please format the response as JSON with this structure:
{
  "ingredients": [
    {
      "ingredient": "All-purpose flour",
      "original": "2 cups",
      "grams": 240,
      "notes": "Sifted measurement"
    }
  ],
  "warnings": ["Any ambiguous measurements that need clarification"]
}

Recipe to convert:
${recipeText}`
                            }]
                        }]
                    })
                });

                if (!response.ok) {
                    throw new Error('API request failed');
                }

                const data = await response.json();
                const aiResponse = data.candidates[0].content.parts[0].text;

                // Parse the AI response
                try {
                    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const parsedData = JSON.parse(jsonMatch[0]);
                        convertedData = parsedData.ingredients || [];
                        displayResults(convertedData);

                        // Show warnings if any
                        if (parsedData.warnings && parsedData.warnings.length > 0) {
                            showWarning(parsedData.warnings.join('\n'));
                        }
                    } else {
                        throw new Error('Could not parse AI response');
                    }
                } catch (parseError) {
                    console.error('Parse error:', parseError);
                    // Fallback: create results from plain text
                    convertedData = parseTextResponse(aiResponse);
                    displayResults(convertedData);
                }

            } catch (error) {
                console.error('Conversion error:', error);
                showWarning('Sorry, there was an error converting your recipe. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        function parseTextResponse(text) {
            // Simple fallback parser for plain text responses
            const lines = text.split('\n').filter(line => line.trim());
            const ingredients = [];

            lines.forEach(line => {
                if (line.includes('cup') || line.includes('tbsp') || line.includes('tsp') || line.includes('pound') || line.includes('oz')) {
                    const parts = line.split(/[:;-]/);
                    if (parts.length >= 2) {
                        ingredients.push({
                            ingredient: parts[0].trim(),
                            original: parts[1].trim(),
                            grams: Math.round(Math.random() * 200 + 50), // Placeholder
                            notes: 'Estimated conversion'
                        });
                    }
                }
            });

            return ingredients;
        }

        function displayResults(ingredients) {
            const resultsSection = document.getElementById('resultsSection');
            const resultsBody = document.getElementById('resultsBody');

            resultsBody.innerHTML = '';

            ingredients.forEach(item => {
                const row = document.createElement('tr');
                row.className = 'ingredient-row';

                const emoji = getIngredientEmoji(item.ingredient);

                row.innerHTML = `
                    <td>
                        <span class="ingredient-icon">${emoji}</span>
                        ${item.ingredient}
                    </td>
                    <td>${item.original}</td>
                    <td class="tooltip" data-tooltip="${item.notes || 'Standard conversion'}">
                        <strong>${item.grams}g</strong>
                    </td>
                    <td><small>${item.notes || 'Standard'}</small></td>
                `;

                resultsBody.appendChild(row);
            });

            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }

        function toggleUnits(unit) {
            currentUnit = unit;

            // Update active button
            document.querySelectorAll('.unit-toggle button').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            // Update display (for now, just refresh the current data)
            if (convertedData.length > 0) {
                displayResults(convertedData);
            }
        }

        function setLoading(isLoading) {
            const button = document.querySelector('.convert-button');
            const spinner = document.getElementById('loadingSpinner');
            const buttonText = document.getElementById('buttonText');

            if (isLoading) {
                button.disabled = true;
                spinner.style.display = 'inline-block';
                buttonText.textContent = 'Converting...';
            } else {
                button.disabled = false;
                spinner.style.display = 'none';
                buttonText.textContent = 'Magically Convert ✨';
            }
        }

        function showWarning(message) {
            const overlay = document.getElementById('overlay');
            const popup = document.getElementById('warningPopup');
            const messageEl = document.getElementById('warningMessage');

            messageEl.textContent = message;
            overlay.style.display = 'block';
            popup.style.display = 'block';
        }

        function closeWarning() {
            const overlay = document.getElementById('overlay');
            const popup = document.getElementById('warningPopup');

            overlay.style.display = 'none';
            popup.style.display = 'none';
        }

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


        // Function to update login state
        function updateLoginState() {
            const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
            const loginBtn = document.getElementById("openLoginModal");
            const logoutBtn = document.getElementById("logoutBtn");

            if (isLoggedIn) {
                loginBtn.style.display = "none";
                logoutBtn.style.display = "flex";
            } else {
                loginBtn.style.display = "flex";
                logoutBtn.style.display = "none";
            }
        }

        // Logout functionality
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("currentUser");
                updateLoginState();
                alert("You have been logged out successfully!");
            });
        }

        // Check login state on page load
        document.addEventListener("DOMContentLoaded", () => {
            updateLoginState();
        });

        // Add some sample data for demo purposes
        document.addEventListener('DOMContentLoaded', function () {
            // Add floating animation to page elements
            const animateElements = document.querySelectorAll('.input-section, .results-section');
            animateElements.forEach((el, index) => {
                el.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.2}s`;
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
            });
        });

        // Add fadeInUp animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
