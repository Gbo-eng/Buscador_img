let currentPage = 1;
const perPage = 10;
let alertShown = false;

window.onload = () => {
    const form = document.getElementById('formulario');
    form.addEventListener('submit', handleSubmit);
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    nextPageBtn.addEventListener('click', () => handlePageChange(1));
    prevPageBtn.addEventListener('click', () => handlePageChange(-1));
};

async function handleSubmit(event) {
    event.preventDefault();
    currentPage = 1;
    await searchAndDisplayImages();
}

async function searchAndDisplayImages() {
    const termino = document.getElementById('termino').value.trim();
    if (!termino) {
        if (!alertShown) {
            showAlert('Por favor, introduce un término de búsqueda.');
            alertShown = true;
        }
        return;
    }
    alertShown = false;
    
    const startIndex = (currentPage - 1) * perPage;
    const images = await searchImages(termino, startIndex, perPage);
    displayImages(images);
}

async function searchImages(termino, startIndex, perPage) {
    const accessKey = '7y-Jo9zPZ6JN8lSubmNDA5pfvAlm5SZtfxql3v_Nsb4'; // ¡Recuerda reemplazar esto con tu clave de acceso!
    const apiUrl = `https://api.unsplash.com/search/photos?query=${termino}&per_page=${perPage}&page=${currentPage}&client_id=${accessKey}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.results;

    } catch (error) {
        console.error('Error al buscar imágenes:', error);
        showAlert('Se produjo un error al buscar imágenes. Por favor, inténtalo de nuevo más tarde.');
        return [];
    }
}

function displayImages(images) {
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = '';

    const row = document.createElement('div');
    row.classList.add('row', 'row-cols-1', 'row-cols-md-3', 'g-3');

    images.forEach(image => {
        const col = document.createElement('div');
        col.classList.add('col');

        const card = document.createElement('div');
        card.classList.add('card', 'shadow-sm');

        const imgElement = document.createElement('img');
        imgElement.src = image.urls.small;
        imgElement.alt = image.alt_description || 'Imagen sin descripción';
        imgElement.classList.add('card-img-top');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = `Autor: ${image.user.username}, Likes: ${image.likes}`;

        cardBody.appendChild(cardText);

        card.appendChild(imgElement);
        card.appendChild(cardBody);

        col.appendChild(card);
        row.appendChild(col);
    });
    resultado.appendChild(row);
    updatePagination();
}

function updatePagination() {
    const currentPageSpan = document.getElementById('current-page');
    currentPageSpan.textContent = `Página ${currentPage}`;
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    prevPageBtn.disabled = currentPage === 1;
}

function handlePageChange(change) {
    currentPage += change;
    searchAndDisplayImages();
}

function showAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger mt-3';
    alertDiv.textContent = message;

    const buscadorDiv = document.querySelector('.buscador');
    buscadorDiv.insertBefore(alertDiv, document.getElementById('formulario'));
    setTimeout(() => {
        alertDiv.remove();
        alertShown=false;
    }, 3000);
}