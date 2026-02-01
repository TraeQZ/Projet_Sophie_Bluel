/**
 * Gestion de la modale : suppression et ajout de travaux
 */

// Charge les miniatures dans la galerie modale
async function loadModalGallery() {
    const modalGallery = document.querySelector(".modal-gallery-grid");
    if (!modalGallery) return;

    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();

        modalGallery.innerHTML = "";

        works.forEach(work => {
            const figure = document.createElement("figure");
            figure.className = "modal-figure";
            
            figure.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}">
                <span class="delete-icon" data-id="${work.id}">
                    <i class="fa-solid fa-trash-can"></i>
                </span>
            `;

            modalGallery.appendChild(figure);

            // Clic sur l'icône poubelle => suppression
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

// Supprime un projet via l'API
async function deleteWork(id) {
    const token = localStorage.getItem("token");
    const reponse = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {"Authorization": `Bearer ${token}`}
    });
    if (reponse .ok){
        document.querySelector('[data-id="${id}"]')?.remove();
    }
}


/* ===== AJOUT DE TRAVAUX ===== */

// Navigation entre les deux vues de la modale
const btnGoToAdd = document.getElementById("btn-go-to-add");
const modalGalleryView = document.getElementById("modal-view-gallery");
const modalAddView = document.getElementById("modal-view-add");
const btnBack = document.getElementById("modal-back");

if (btnGoToAdd) {
    btnGoToAdd.addEventListener("click", () => {
        modalGalleryView.style.display = "none";
        modalAddView.style.display = "block";
        btnBack.style.visibility = "visible";
        loadCategories();
    });
}

if (btnBack) {
    btnBack.addEventListener("click", () => {
        modalGalleryView.style.display = "block";
        modalAddView.style.display = "none";
        btnBack.style.visibility = "hidden";
    });
}

// Récupère les catégories depuis l'API pour le menu déroulant
async function loadCategories() {
    const select = document.querySelector("#work-category");
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    
    select.innerHTML = '<option value=""></option>';
    
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

// Prévisualisation de l'image sélectionnée
const inputImg = document.querySelector("#file-upload");
const previewContainer = document.querySelector("#preview-container");
const uploadContent = document.querySelector("#upload-design-content");
const uploadArea = document.querySelector(".upload-area");

inputImg.addEventListener("change", () => {
    const file = inputImg.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewContainer.innerHTML = '';

            const img = document.createElement("img");
            img.src = e.target.result;
            img.classList.add("preview-img");
            previewContainer.appendChild(img);
            
            // Affiche l'aperçu, masque le contenu d'upload
            previewContainer.style.display = 'flex';
            if (uploadContent) uploadContent.style.display = "none";
            uploadArea.classList.add("has-preview");
        };
        reader.readAsDataURL(file);
    }
});


// Envoie un nouveau projet à l'API
async function addNewWork(e) {
    e.preventDefault();
    
    const title = document.querySelector("#work-title").value;
    const category = document.querySelector("#work-category").value;
    const image = document.querySelector("#file-upload").files[0];
    const token = localStorage.getItem("token");

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
                // Pas de Content-Type ici, FormData le gère automatiquement
            },
            body: formData
        });

        if (response.ok) {
            const newWork = await response.json();
            loadModalGallery();
            if (typeof fetchWorks === 'function') fetchWorks();
            
           
            btnBack.click();
        } else {
            alert("Erreur lors de l'envoi.");
        }
    } catch (error) {
        console.error("Erreur POST :", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#form-add-work");
    if (form) form.addEventListener("submit", addNewWork);
});

// Vérifie que tous les champs sont remplis pour activer le bouton
const formAddWork = document.querySelector("#modal-view-add form");
const submitBtn = document.getElementById("btn-submit-work");

function checkForm() {
    const title = document.querySelector("#work-title").value || "";
    const category = document.querySelector("#work-category").value || "";
    const image = document.querySelector("#file-upload").files[0] || null;

    if (title && category && image) {
        submitBtn.style.backgroundColor = "#1D6154";
        submitBtn.disabled = false;
    } else {
        submitBtn.style.backgroundColor = "#A7A7A7";
        submitBtn.disabled = true;
    }
}

document.querySelector("#work-title").addEventListener("input", checkForm);
document.querySelector("#work-category").addEventListener("change", checkForm);
document.querySelector("#file-upload").addEventListener("change", checkForm);
