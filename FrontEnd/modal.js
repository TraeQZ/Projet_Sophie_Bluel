// Fonction pour ouvrir la modale
const openModal = function (e) {
    e.preventDefault();
    // On récupère l'élément ici pour être sûr qu'il existe
    const modal = document.getElementById('modal-container');
    
    if (modal) {
        modal.style.display = "flex";
        modal.removeAttribute('aria-hidden');

        // On appelle la fonction de suppression pour charger les photos
        if (typeof loadModalGallery === 'function') {
            loadModalGallery();
        }
    }
};

// ÉCOUTEUR GLOBAL (Délégation d'événement)
document.addEventListener('click', (e) => {
    // On vérifie si on a cliqué sur le lien "modifier" ou sur l'icône à l'intérieur
    if (e.target.id === 'open-modal' || e.target.closest('#open-modal')) {
        openModal(e);
    }
});

// Fonction pour fermer la modale
const closeModal = function () {
    const modal = document.getElementById('modal-container');
    if (modal) {
        modal.style.display = "none";
        modal.setAttribute('aria-hidden', 'true');
    }
};

// Écouteur pour fermer la modale (clic sur la croix ou à l'extérieur)
document.addEventListener('click', (e) => {
    if (e.target.id === 'modal-close' || e.target.closest('#modal-close') || e.target.id === 'modal-container') {
        closeModal();
    }
});