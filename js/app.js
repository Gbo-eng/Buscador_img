let currentPage = 1;
const perPage = 10;

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
        showAlert('Por favor, introduce un término de búsqueda.');
        return;
    }
    console.error('Va:' );
    
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
        console.error('Va:' );
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
    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.urls.small;
        imgElement.alt = image.alt_description || 'Imagen sin descripción';
        
        const author = image.user.username;
        const views = image.views;

        const figure = document.createElement('figure');
        figure.classList.add('imagen-container'); // Agregar clase para estilos

        const autorVistaDiv = document.createElement('div');
        autorVistaDiv.classList.add('AutorVista');
        autorVistaDiv.textContent = `Autor: ${author}, Vistas: ${views}`;
        
        // const figure = document.createElement('figure');
        figure.appendChild(imgElement);
        figure.appendChild(autorVistaDiv);
        
        resultado.appendChild(figure);
    });
    
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
