// =====================================================================
// login.js : GESTION DE LA CONNEXION UTILISATEUR
// =====================================================================

// URL de l'API pour la connexion
const apiUrlLogin = 'http://localhost:5678/api/users/login'; 

// Sélection des éléments du DOM
const form = document.querySelector("#login form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginSection = document.getElementById("login"); // Pour insérer le message d'erreur
const errorElement = document.getElementById("error-message");
const token = localStorage.getItem('token');

// =====================================================================
// PARTIE A : GESTION DU FORMULAIRE (Uniquement sur login.html)
// =====================================================================
if (form) { // On vérifie si on est bien sur la page avec le formulaire
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(apiUrlLogin, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) throw new Error("Identifiants incorrects");

            const data = await response.json();
            localStorage.setItem('token', data.token);
            window.location.href = "index.html"; 
        } catch (error) {
            const errorElement = document.getElementById("error-message");
            if (errorElement) errorElement.textContent = error.message;
        }
    });
}

// =====================================================================
// PARTIE B : MODE ÉDITION (Uniquement sur index.html si connecté)
// =====================================================================
document.addEventListener("DOMContentLoaded", () => {
    // Si pas de token, on ne fait rien
    if (!token) return;

    console.log("Mode édition activé !");

    // 1. Afficher la barre noire
    const adminBar = document.getElementById("admin-bar");
    if (adminBar) adminBar.style.display = "flex";

    // 2. Cacher les filtres
    const filters = document.querySelector(".filters");
    if (filters) filters.style.display = "none";

    // 3. Modifier le lien Login -> Logout
    const authLink = document.getElementById("auth-link");
    if (authLink) {
        authLink.textContent = "logout";
        authLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            window.location.reload();
        });
        
    }
    // 4. Ajouter le lien "modifier" à côté de "Mes Projets"
    const portfolioTitle = document.querySelector("#portfolio h2");

if (portfolioTitle) {
    const editLink = document.createElement("a");
    editLink.href = "#";
    editLink.id = "open-modal";
    editLink.className = "edit-link";
    editLink.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';
        portfolioTitle.appendChild(editLink); //utilisation du appenchild: le bouton devient un enfant du h2, et ils partageront la même ligne et le même centrage
}
});
