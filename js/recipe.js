const generateBtn = document.getElementById("generate-btn");
const ingredientsInput = document.getElementById("ingredients");
const recipeOutput = document.getElementById("recipe-output");
const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your OpenAI API key

generateBtn.addEventListener("click", async () => {
  const ingredients = ingredientsInput.value;
  if (ingredients.trim() === "") {
    alert("Please enter some ingredients!");
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";
  recipeOutput.innerHTML = "<p>Generating your delicious recipe...</p>";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that generates baking recipes based on a list of ingredients. The output should be in HTML format.",
          },
          {
            role: "user",
            content: `Generate a baking recipe using the following ingredients: ${ingredients}. Provide a creative name for the recipe, a list of ingredients (including the ones provided), and step-by-step instructions. Format the response as a simple HTML structure with headings, paragraphs, and lists.`,
          },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      recipeOutput.innerHTML = data.choices[0].message.content;
    } else {
      recipeOutput.innerHTML =
        "<p>Sorry, I couldn't generate a recipe with those ingredients. Please try again.</p>";
    }
  } catch (error) {
    console.error("Error generating recipe:", error);
    recipeOutput.innerHTML = `<p>There was an error generating your recipe. Please check the console for details and make sure your API key is correct.</p>`;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate Recipe";
  }
});

fetch("footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer-placeholder").innerHTML = data;
  });
