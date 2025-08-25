document.addEventListener('DOMContentLoaded', function() {
    const auth = new AuthSystem();
    const currentUser = auth.getCurrentUser();

    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const userInfoForm = document.getElementById('user-info-form');
    const savedRecipesContainer = document.getElementById('saved-recipes');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    nameInput.value = currentUser.name;
    emailInput.value = currentUser.email;

    userInfoForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newName = nameInput.value.trim();
        if (newName) {
            currentUser.name = newName;
            auth.setCurrentUser(currentUser);
            const users = auth.loadUsers();
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex].name = newName;
                localStorage.setItem('bakegenius_users', JSON.stringify(users));
            }
            alert('Profile updated successfully!');
        }
    });

    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');

    if (savedRecipes.length > 0) {
        savedRecipes.forEach(recipeId => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML = `<h4>Recipe ID: ${recipeId}</h4>`;
            savedRecipesContainer.appendChild(recipeCard);
        });
    } else {
        savedRecipesContainer.innerHTML = '<p>No saved recipes yet.</p>';
    }
});
