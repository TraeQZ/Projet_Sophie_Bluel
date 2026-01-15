/**
 * GESTION DE LA SUPPRESSION DES TRAVAUX (Vue 1 de la modale)
 */

// Fonction pour charger la galerie de miniatures dans la modale
async function loadModalGallery() {
    const modalGallery = document.querySelector(".modal-gallery-grid");
    if (!modalGallery) return;

    try {
        // 1. Récupération des travaux depuis l'API
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();

        // 2. Nettoyage de la galerie avant affichage
        modalGallery.innerHTML = "";

        // 3. Création des miniatures
        works.forEach(work => {
            const figure = document.createElement("figure");
            figure.className = "modal-figure";
            
            // Structure avec l'icône poubelle bien positionnée
            figure.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}">
                <span class="delete-icon" data-id="${work.id}">
                    <i class="fa-solid fa-trash-can"></i>
                </span>
            `;

            modalGallery.appendChild(figure);

            // 4. Écouteur d'événement sur l'icône de suppression
            const trashBtn = figure.querySelector(".delete-icon");
            trashBtn.addEventListener("click", (e) => {
                e.preventDefault();
                deleteWork(work.id);
            });
        });

    } catch (error) {
        console.error("Erreur lors du chargement de la galerie modale :", error);
    }
}

// Fonction pour supprimer un projet via l'API
async function deleteWork(id) {
    const token = localStorage.getItem("token");
    
    if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) return;

    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            console.log(`Projet ${id} supprimé avec succès`);
            
            // On recharge la galerie de la modale
            loadModalGallery();
            
            // On recharge la galerie de la page d'accueil (index.html)
            if (typeof fetchWorks === 'function') {
                fetchWorks();
            }
        } else {
            alert("Erreur lors de la suppression du projet.");
        }
    } catch (error) {
        console.error("Erreur DELETE :", error);
    }
}
//=======================================Ajout de travaux===================

//La Navigation entre les vues
// On utilise l'ID présent dans ton HTML
const btnGoToAdd = document.getElementById("btn-go-to-add");
const modalGalleryView = document.getElementById("modal-view-gallery");
const modalAddView = document.getElementById("modal-view-add");
const btnBack = document.getElementById("modal-back");

if (btnGoToAdd) {
    btnGoToAdd.addEventListener("click", () => {
        modalGalleryView.style.display = "none";
        modalAddView.style.display = "block"; // Ou "flex" selon ton CSS
        btnBack.style.visibility = "visible"; // On affiche la flèche retour
    });
}

// Pour revenir en arrière
if (btnBack) {
    btnBack.addEventListener("click", () => {
        modalGalleryView.style.display = "block";
        modalAddView.style.display = "none";
        btnBack.style.visibility = "hidden"; // On cache la flèche
    });
}

//Aperçu de l'image et Catégories dynamiques
//On déclare que la fonction est asynchrone
async function loadCategories() {
    const select = document.querySelector("#work-category");
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    
    // On vide avant d'ajouter (pour éviter les doublons au cas où)
    select.innerHTML = '<option value=""></option>'; 
    
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

//Prévisualisation de l'image :
const inputImg = document.querySelector("#file-upload"); // Ton input type="file"
const previewContainer = document.querySelector(".preview-container");

inputImg.addEventListener("change", () => {
    const file = inputImg.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.classList.add("preview-img");
            // Masquer l'icône et le bouton d'upload, afficher l'image
            document.querySelector(".upload-design").style.display = "none";
            previewContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

//L'envoi des données (POST avec FormData)

async function addNewWork(e) {
    e.preventDefault();
    
    const title = document.querySelector("#work-title").value;
    const category = document.querySelector("#work-category").value;
    const image = document.querySelector("#file-upload").files[0];
    const token = localStorage.getItem("token");

    // --- Vérification avant envoi ---
    if (!title || !category || !image) {
        alert("Veuillez remplir tous les champs et ajouter une image.");
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", image);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
                // Note : NE PAS mettre "Content-Type" ici, le navigateur le gère pour FormData
            },
            body: formData
        });

        if (response.ok) {
            const newWork = await response.json();
            // 1. Rafraîchir les galeries (Accueil + Modale)
            loadModalGallery();
            if (typeof fetchWorks === 'function') fetchWorks();
            
            // 2. Réinitialiser le formulaire et revenir à la vue galerie
            resetForm(); 
            btnBack.click(); 
        } else {
            alert("Erreur lors de l'envoi.");
        }
    } catch (error) {
        console.error("Erreur POST :", error);
    }
}