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

// ---------------------------------------------------------------------
// Fonction pour gérer la soumission du formulaire
// ---------------------------------------------------------------------

form.addEventListener('submit', async (event) => {
    // Empêcher l'envoi traditionnel du formulaire et le rechargement de la page
    event.preventDefault();

    // 1. Récupération des données du formulaire
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        // 2. Requête vers l'API
        const response = await fetch(apiUrlLogin, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Le corps de la requête doit contenir l'e-mail et le mot de passe
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        // 3. Traitement de la réponse
        
        // Si l'identifiant ou le mot de passe est invalide (status 401 ou 404)
        if (!response.ok) {
            // L'API renvoie un message d'erreur (ex: "Unauthorized")
            throw new Error("Erreur dans l’identifiant ou le mot de passe.");
        }

        // Si la connexion réussit (status 200 OK)
        const data = await response.json();
        
        // 4. Stockage du token et de l'ID utilisateur (si nécessaire)
        // Le token est la clé qui prouve que l'utilisateur est connecté et autorisé
        localStorage.setItem('token', data.token);
        // localStorage.setItem('userId', data.userId); // Peut être utile plus tard

        // 5. Redirection vers la page d'accueil (index.html)
        window.location.href = "index.html"; 

    } catch (error) {
        // 6. Affichage de l'erreur
        console.error("Échec de la connexion :", error.message);
        displayError(error.message); 
    }
});


// ---------------------------------------------------------------------
// Fonction utilitaire pour afficher les erreurs
// ---------------------------------------------------------------------

function displayError(message) {
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("error-message");
    errorMessage.textContent = message;
    errorMessage.style.color = "red";
    errorMessage.style.textAlign = "center";
    errorMessage.style.marginTop = "10px";

    // Insérer le message juste avant le lien "Mot de passe oublié"
    const forgotPasswordLink = document.querySelector(".forgot-password");
    if (forgotPasswordLink) {
        loginSection.insertBefore(errorMessage, forgotPasswordLink);
    } else {
        form.appendChild(errorMessage);
    }
}