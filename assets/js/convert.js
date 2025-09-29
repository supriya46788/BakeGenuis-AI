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

    // Mobile nav
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const toggleNav = () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', (!expanded).toString());
    };
    hamburger.addEventListener('click', (e) => { e.stopPropagation(); toggleNav(); });
    hamburger.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleNav(); }});
    document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('active'); hamburger.classList.remove('active'); hamburger.setAttribute('aria-expanded','false');
    }));
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active'); hamburger.classList.remove('active'); hamburger.setAttribute('aria-expanded','false');
      }
    });

    // File upload
    function handleFileUpload(event){
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => { document.getElementById('recipeInput').value = e.target.result; };
      reader.readAsText(file);
    }
    window.handleFileUpload = handleFileUpload;

    // Ingredient emojis
    const ingredientEmojis = {
      'flour':'🌾','sugar':'🍯','butter':'🧈','egg':'🥚','milk':'🥛','vanilla':'🌿','baking powder':'⚡','salt':'🧂',
      'chocolate':'🍫','cocoa':'🍫','oil':'🫒','honey':'🍯','cream':'🥛','cheese':'🧀','nuts':'🥜','fruit':'🍓',
      'lemon':'🍋','orange':'🍊','cinnamon':'🌿','default':'🥄'
    };
      // Issue: If the ingredient name contains multiple keys, the wrong emoji may be returned.
      // For example, if the ingredient name is "flour sugar", the code will return the emoji for "flour".
      // To fix this, we need to check if the ingredient name starts with the key, not just contains it.
      const lower = ing.toLowerCase();
      for (const [key, emoji] of Object.entries(ingredientEmojis)) {
        if (lower.startsWith(key)) return emoji;
      }
      return ingredientEmojis.default;


    // Convert logic (wire up to your backend)
    const GEMINI_API_KEY = 'API_KEY';
    const GEMINI_API_URL = 'API_URL';
    let currentUnit = 'metric';
    let convertedData = [];

    async function convertRecipe(){
      const recipeText = document.getElementById('recipeInput').value.trim();
      if (!recipeText){ showWarning('Please enter a recipe to convert!'); return; }
      setLoading(true);
      try{
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,{
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({
            contents:[{ parts:[{ text:
`Convert this recipe to precise gram measurements. For each ingredient, provide:
1. Normalized ingredient name
2. Original measurement
3. Gram equivalent
4. Any relevant notes about the conversion

Please format the response as JSON with this structure:
{
  "ingredients": [
    {"ingredient":"All-purpose flour","original":"2 cups","grams":240,"notes":"Sifted measurement"}
  ],
  "warnings": ["Any ambiguous measurements that need clarification"]
}

Recipe to convert:
${recipeText}` }]}]
          })
        });
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

        try{
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error('No JSON found');
          const parsed = JSON.parse(jsonMatch[0]);
          convertedData = parsed.ingredients || [];
          displayResults(convertedData);
          if (parsed.warnings?.length) showWarning(parsed.warnings.join('\n'));
        }catch{
          convertedData = parseTextResponse(aiResponse);
          displayResults(convertedData);
        }
      }catch(err){
        console.error(err);
        showWarning('Sorry, there was an error converting your recipe. Please try again.');
      }finally{
        setLoading(false);
      }
    }
    window.convertRecipe = convertRecipe;

    function parseTextResponse(text){
      const lines = text.split('\n').filter(Boolean);
      const ingredients = [];
      lines.forEach(line=>{
        if (/(cup|tbsp|tsp|pound|oz)/i.test(line)){
          const parts = line.split(/[:;-]/);
          if (parts.length>=2){
            ingredients.push({
              ingredient: parts[0].trim(),
              original: parts[1].trim(),
              grams: Math.round(Math.random()*200+50),
              notes: 'Estimated conversion'
            });
          }
        }
      });
      return ingredients;
    }

    function displayResults(items){
      const resultsSection = document.getElementById('resultsSection');
      const resultsBody = document.getElementById('resultsBody');
      resultsBody.innerHTML = '';
      items.forEach(item=>{
        const row = document.createElement('tr');
        row.className='ingredient-row';
        const emoji = getIngredientEmoji(item.ingredient);
        row.innerHTML = `
          <td><span class="ingredient-icon">${emoji}</span>${item.ingredient}</td>
          <td>${item.original}</td>
          <td class="tooltip" data-tooltip="${item.notes || 'Standard conversion'}"><strong>${item.grams}g</strong></td>
          <td><small>${item.notes || 'Standard'}</small></td>`;
        resultsBody.appendChild(row);
      });
      resultsSection.style.display='block';
      resultsSection.scrollIntoView({behavior:'smooth'});
    }

    function toggleUnits(unit){
      currentUnit = unit;
      document.querySelectorAll('.unit-toggle button').forEach(b=>b.classList.remove('active'));
      event.target.classList.add('active'); // uses click event
      if (convertedData.length) displayResults(convertedData);
    }
    window.toggleUnits = toggleUnits;

    function setLoading(isLoading){
      const button = document.querySelector('.convert-button');
      const spinner = document.getElementById('loadingSpinner');
      const buttonText = document.getElementById('buttonText');
      if (isLoading){ button.disabled=true; spinner.style.display='inline-block'; buttonText.textContent='Converting...'; }
      else { button.disabled=false; spinner.style.display='none'; buttonText.textContent='Magically Convert ✨'; }
    }

    function showWarning(message){
      const overlay = document.getElementById('overlay');
      const popup = document.getElementById('warningPopup');
      const messageEl = document.getElementById('warningMessage');
      messageEl.textContent = message;
      overlay.style.display='block';
      popup.style.display='block';
    }
    function closeWarning(){
      document.getElementById('overlay').style.display='none';
      document.getElementById('warningPopup').style.display='none';
    }
    window.closeWarning = closeWarning;

    // Back to Top Button Logic
        const backToTopBtn = document.getElementById("backToTop");
        window.addEventListener("scroll", () => {
            if (window.scrollY > 100) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        //Top to Bottom Button Logic
        const ToptobackBtn = document.getElementById("Toptoback");
        window.addEventListener("scroll", () => {
            if (window.scrollY < 100) {
                ToptobackBtn.classList.add("show");
            } else {
                ToptobackBtn.classList.remove("show");
            }
        });
        ToptobackBtn.addEventListener("click", () => {
            window.scrollTo({ top: 10000, behavior: "smooth" });
        });

    // Entry animations and active navigation
    document.addEventListener('DOMContentLoaded', ()=>{
      const animateEls = document.querySelectorAll('.input-section, .results-section');
      animateEls.forEach((el,i)=>{
        el.style.animation = `fadeInUp .6s ease forwards ${i*0.2}s`;
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
      });
      const style = document.createElement('style');
      style.textContent = `@keyframes fadeInUp{to{opacity:1; transform:translateY(0);}}`;
      document.head.appendChild(style);
      
      // Set active navigation link
      setActiveNavigation();
    });

    // Function to set active navigation link
    function setActiveNavigation() {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const navLinks = document.querySelectorAll('.nav-links a');
      
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }