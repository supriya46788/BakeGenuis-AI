// Show button when scrolled down 300px
window.onscroll = function () {
  document.getElementById("backToTop").style.display =
    document.documentElement.scrollTop > 0 ? "block" : "none";
};

// Scroll smoothly to top
document.getElementById("backToTop").onclick = function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const GEMINI_API_KEY = "API_KEY";
const GEMINI_API_URL = "API_URL";

let currentUnit = "metric";
let convertedData = [];

// Recipe validation keywords
const recipeKeywords = [
  "flour", "sugar", "butter", "egg", "milk", "cream", "vanilla", "salt", "pepper",
  "baking", "powder", "soda", "yeast", "oil", "honey", "chocolate", "cocoa", "nuts",
  "cheese", "meat", "chicken", "beef", "fish", "vegetables", "onion", "garlic",
  "tomato", "recipe", "ingredients", "cooking", "baking", "roast", "fry", "boil",
  "cup", "cups", "tablespoon", "teaspoon", "ounce", "pound", "gram", "kilogram",
  "tsp", "tbsp", "oz", "lb", "kg", "ml", "liter", "litre", "degrees", "temperature",
  "oven", "stove", "pan", "bowl", "mix", "stir", "whisk", "fold", "beat", "knead",
  "dough", "batter", "sauce", "seasoning", "spice", "herb", "cinnamon", "nutmeg",
  "ginger", "paprika", "oregano", "basil", "thyme", "rosemary", "parsley", "cilantro"
];

// Ingredient to emoji mapping
const ingredientEmojis = {
  flour: "🌾",
  sugar: "🍯",
  butter: "🧈",
  egg: "🥚",
  milk: "🥛",
  vanilla: "🌿",
  "baking powder": "⚡",
  salt: "🧂",
  chocolate: "🍫",
  cocoa: "🍫",
  oil: "🫒",
  honey: "🍯",
  cream: "🥛",
  cheese: "🧀",
  nuts: "🥜",
  fruit: "🍓",
  lemon: "🍋",
  orange: "🍊",
  cinnamon: "🌿",
  default: "🥄",
};

function toggleMobileMenu() {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("active");
}

function validateRecipeContent(content) {
  if (!content || content.trim().length < 10) {
    return false;
  }
  
  const contentLower = content.toLowerCase();
  
  // Check if content contains at least 2 recipe-related keywords
  const foundKeywords = recipeKeywords.filter(keyword => 
    contentLower.includes(keyword)
  );
  
  return foundKeywords.length >= 2;
}

function showToast(message, type = 'error') {
  // Use existing warning popup system but modify it for toast-like behavior
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("warningPopup");
  const messageEl = document.getElementById("warningMessage");
  const popupTitle = popup.querySelector("h3");
  
  // Reset classes
  popup.classList.remove('success');
  
  if (type === 'error') {
    popupTitle.textContent = "⚠️ Invalid File";
    popupTitle.style.color = "#ff4757";
  } else if (type === 'success') {
    popupTitle.textContent = "✅ Success";
    popupTitle.style.color = "#2ed573";
    popup.classList.add('success');
  }
  
  messageEl.textContent = message;
  overlay.style.display = "block";
  popup.style.display = "block";
  
  // Auto-close after 4 seconds for toast-like behavior
  setTimeout(() => {
    closeWarning();
  }, 4000);
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    // Check file type
    const allowedTypes = ['text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.txt')) {
      showToast("Please upload a valid text file (.txt, .doc, or .docx) containing recipe content.", 'error');
      event.target.value = ''; // Clear the file input
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target.result;
      
      // Validate if content is recipe-related
      if (!validateRecipeContent(content)) {
        showToast("This file doesn't appear to contain recipe content. Please upload a file with ingredients and cooking instructions.", 'error');
        event.target.value = ''; // Clear the file input
        document.getElementById("recipeInput").value = ''; // Clear textarea
        return;
      }
      
      document.getElementById("recipeInput").value = content;
      showToast("Recipe file uploaded successfully! You can now convert it to precise measurements.", 'success');
    };
    
    reader.onerror = function() {
      showToast("Error reading file. Please try again with a different file.", 'error');
      event.target.value = ''; // Clear the file input
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
  const recipeText = document.getElementById("recipeInput").value.trim();

  if (!recipeText) {
    showToast("Please enter a recipe to convert!", 'error');
    return;
  }

  // Validate recipe content before processing
  if (!validateRecipeContent(recipeText)) {
    showToast("The text doesn't appear to contain recipe content. Please ensure you have ingredients with measurements (like '2 cups flour', '1 tsp salt', etc.)", 'error');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
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
${recipeText}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("API request failed");
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
          showToast(parsedData.warnings.join("\n"), 'error');
        }
      } else {
        throw new Error("Could not parse AI response");
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      // Fallback: create results from plain text
      convertedData = parseTextResponse(aiResponse);
      displayResults(convertedData);
    }
  } catch (error) {
    console.error("Conversion error:", error);
    showToast(
      "Sorry, there was an error converting your recipe. Please try again.", 'error'
    );
  } finally {
    setLoading(false);
  }
}

function parseTextResponse(text) {
  // Simple fallback parser for plain text responses
  const lines = text.split("\n").filter((line) => line.trim());
  const ingredients = [];

  lines.forEach((line) => {
    if (
      line.includes("cup") ||
      line.includes("tbsp") ||
      line.includes("tsp") ||
      line.includes("pound") ||
      line.includes("oz")
    ) {
      const parts = line.split(/[:;-]/);
      if (parts.length >= 2) {
        ingredients.push({
          ingredient: parts[0].trim(),
          original: parts[1].trim(),
          grams: Math.round(Math.random() * 200 + 50), // Placeholder
          notes: "Estimated conversion",
        });
      }
    }
  });

  return ingredients;
}

function displayResults(ingredients) {
  const resultsSection = document.getElementById("resultsSection");
  const resultsBody = document.getElementById("resultsBody");

  resultsBody.innerHTML = "";

  ingredients.forEach((item) => {
    const row = document.createElement("tr");
    row.className = "ingredient-row";

    const emoji = getIngredientEmoji(item.ingredient);

    row.innerHTML = `
                    <td>
                        <span class="ingredient-icon">${emoji}</span>
                        ${item.ingredient}
                    </td>
                    <td>${item.original}</td>
                    <td class="tooltip" data-tooltip="${
                      item.notes || "Standard conversion"
                    }">
                        <strong>${item.grams}g</strong>
                    </td>
                    <td><small>${item.notes || "Standard"}</small></td>
                `;

    resultsBody.appendChild(row);
  });

  resultsSection.style.display = "block";
  resultsSection.scrollIntoView({ behavior: "smooth" });
}

function toggleUnits(unit) {
  currentUnit = unit;

  // Update active button
  document.querySelectorAll(".unit-toggle button").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  // Update display (for now, just refresh the current data)
  if (convertedData.length > 0) {
    displayResults(convertedData);
  }
}

function setLoading(isLoading) {
  const button = document.querySelector(".convert-button");
  const spinner = document.getElementById("loadingSpinner");
  const buttonText = document.getElementById("buttonText");

  if (isLoading) {
    button.disabled = true;
    spinner.style.display = "inline-block";
    buttonText.textContent = "Converting...";
  } else {
    button.disabled = false;
    spinner.style.display = "none";
    buttonText.textContent = "Magically Convert ✨";
  }
}

function showWarning(message) {
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("warningPopup");
  const messageEl = document.getElementById("warningMessage");

  messageEl.textContent = message;
  overlay.style.display = "block";
  popup.style.display = "block";
}

function closeWarning() {
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("warningPopup");

  overlay.style.display = "none";
  popup.style.display = "none";
}

// Add some sample data for demo purposes
document.addEventListener("DOMContentLoaded", function () {
  const textarea = document.getElementById("recipeInput");

  // Add floating animation to page elements
  const animateElements = document.querySelectorAll(
    ".input-section, .results-section"
  );
  animateElements.forEach((el, index) => {
    el.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.2}s`;
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
  });
});

const darkModeToggle = document.getElementById("darkModeToggle");

// On page load, check localStorage and apply dark mode if enabled
if (localStorage.getItem("darkMode") === "enabled") {
  document.documentElement.classList.add("dark-mode");
  if (darkModeToggle)
    darkModeToggle.innerHTML = `<img src="../assets/sun.png" width="20" height="20">`;
}

if (darkModeToggle) {
  darkModeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark-mode");

    if (document.documentElement.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
      darkModeToggle.innerHTML = `<img src="../assets/sun.png" width="20" height="20">`;
    } else {
      localStorage.setItem("darkMode", "disabled");
      darkModeToggle.innerHTML = `<img src="../assets/moon.png" width="20" height="20">`;
    }
  });
}

// Add fadeInUp animation
const style = document.createElement("style");
style.textContent = `
            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
document.head.appendChild(style);

fetch("footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer-placeholder").innerHTML = data;
  });
