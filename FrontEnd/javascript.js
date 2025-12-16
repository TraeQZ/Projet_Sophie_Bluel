//Configuration et Sélection d'Éléments
const apiUrl = 'http://localhost:5678/api/works';
const galleryContainer = document.querySelector(".gallery"); 
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


function fetchAndDisplayWorks() {
    // Lancement de la requête (fetch retourne une Promesse)
    fetch(apiUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(works) {
            // Affichage des données (cette fonction reçoit le tableau 'works')
            
            // Parcourir les travaux et les ajouter au conteneur qu'on a déja créé/va etre injecter dans gallery
            works.forEach(work => {
                const workElement = createWorkElement(work);
                galleryContainer.appendChild(workElement);
            });
        })
        .catch(function(error) {
            //  Gestion des erreurs')
            galleryContainer.innerHTML = `<p>Échec du chargement.</p>`;
        });
}

fetchAndDisplayWorks();
