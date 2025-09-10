// Cargar productos desde Flask API
async function loadProducts() {
    try {
        const products = await apiRequest(API_CONFIG.endpoints.products);
        displayProducts(products);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        showMessage('Error al cargar productos: ' + error.message, 'error');
    }
}

// Mostrar productos en la página
function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    
    if (!products || products.length === 0) {
        productsGrid.innerHTML = '<p>No hay productos disponibles</p>';
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image_url || 'https://via.placeholder.com/280x200?text=Sin+Imagen'}" 
                 alt="${product.name}" 
                 class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description || 'Sin descripción'}</p>
                <div class="product-price">$${formatPrice(product.price)}</div>
                <p class="product-stock">Stock: ${product.stock}</p>
            </div>
        </div>
    `).join('');
}

// Formatear precio
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Cargar productos cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});