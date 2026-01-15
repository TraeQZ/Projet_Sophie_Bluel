//Configuration et Sélection d'Éléments
const apiUrlWorks = 'http://localhost:5678/api/works';
const apiUrlCategories = 'http://localhost:5678/api/categories';
const galleryContainer = document.querySelector(".gallery"); 
const filtersContainer = document.querySelector(".filters");
// Variable pour stocker TOUS les travaux
let allWorks = [];
//la fonction pour construire l'element HTML
function createWorkElement(work) {
    //Création des noeuds isolés
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;
//Définir les enfants pour créér l'hiérarchie html (les enfants de fgure)
    figure.appendChild(img);
    figure.appendChild(figcaption);
    return figure;
}


function displayWorks(categoryId) {
galleryContainer.innerHTML = "";
    // Déterminer la liste à afficher selon l ID:
    // Si c'est 0 : C'est le bouton 'Tous', 
    // donc je prends la liste complète (allWorks).
   //Sinon : Je passe la liste au filter pour ne garder que les projets dont la catégorie correspond exactement au numéro demandé."

    const worksToDisplay = (categoryId === 0) 
        ? allWorks // Si ID est 0 (Tous), on prend toutes les données.
        : allWorks.filter(work => work.categoryId === categoryId); // Sinon, on filtre.
    
    //  Afficher les travaux filtrés
    //Pour chaque projet trouvé dans ma liste triée :

    //Je fabrique son 'element' HTML (le titre et l'image) grâce à l'autre fonction (createWorkElement).

    if (worksToDisplay.length > 0) {
        worksToDisplay.forEach(work => {
            const workElement = createWorkElement(work); 
            galleryContainer.appendChild(workElement);
        });
    } else {
        galleryContainer.innerHTML = `<p style="text-align: center;">Aucun travail trouvé dans cette catégorie.</p>`;
    }
}
//-----------------------------------------------------------------------------------

// Logique de Création des Boutons de Filtre

function createFilterButton(name, categoryId) {
    const button = document.createElement("button");
    button.classList.add("filter-button");
    button.textContent = name;
    button.dataset.categoryId = categoryId;

    // Gestion du clic sur le bouton
    button.addEventListener('click', () => {
        // Gérer l'état "actif" (pour le style)
        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active-filter'));
        button.classList.add('active-filter'); 

        // Lancer l'affichage filtré !
        displayWorks(categoryId); 
    });
    
    return button;
}


// ---------------------------------------------------------------------
// 5. Fonction Principale d'Initialisation (Lancement du programme)
// ---------------------------------------------------------------------
//Cette fonction va prendre du temps, ne bloque pas le reste du site pendant qu'elle travaille. Async prevent freeze
async function initializePortfolio() {
    try {
        //  TÉLÉCHARGEMENT : des travaux
        const worksResponse = await fetch(apiUrlWorks);
        if (!worksResponse.ok) {
            throw new Error(`Erreur HTTP travaux!`);
        }
        allWorks = await worksResponse.json(); // <-- Stockage des données
        
        // TÉLÉCHARGEMENT : des catégories
        const categoriesResponse = await fetch(apiUrlCategories);
        if (!categoriesResponse.ok) {//SI la réponse du serveur n'est PAS positive
            throw new Error(`Erreur HTTP catégories!`);
        }
        const categories = await categoriesResponse.json();
        
        // AFFICHAGE INITIAL
        displayWorks(0); // Afficher tout au démarrage

        //CRÉATION DES FILTRES
        filtersContainer.innerHTML = '';
        
        //Bouton "Tous"
        const allButton = createFilterButton("Tous", 0);
        filtersContainer.appendChild(allButton);
        allButton.classList.add('active-filter'); // Actif par défaut

        //Boutons des catégories
        categories.forEach(category => {
            const button = createFilterButton(category.name, category.id);
            filtersContainer.appendChild(button);
        });

    } catch (error) {
        console.error("Échec critique de l'initialisation du portfolio :", error);
        galleryContainer.innerHTML = `<p style="text-align: center; color: red;">Échec du chargement. Vérifiez que le serveur backend est lancé.</p>`;
    }
}
initializePortfolio();
