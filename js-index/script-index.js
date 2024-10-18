let cartCount = 0;
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};

// Inicializa el carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarCantidadCarrito();  // Actualiza el contador del carrito en el navbar
    mostrarProductos();
    actualizarCantidadesProductos();
});

// Función para modificar la cantidad de un producto en el carrito
// Función para modificar la cantidad de un producto en el carrito
function modificarCantidad(productId, action) {
    // Recuperar la cantidad actual del producto o establecerla en 0
    let cantidad = cartItems[productId]?.cantidad || 0;
    
    // Definir los detalles del producto según su ID
    let producto = {
        id: productId,
        nombre: '',
        precio: 0,
        imagen: '',
        cantidad: 0
    };

    // Asignar los valores del producto en función del productId
    switch (productId) {
        case 1: producto = { ...producto, nombre: 'PKB', precio: 10.00, imagen: 'Imagenes/PKB-modified.png' }; break;
        case 2: producto = { ...producto, nombre: 'RB', precio: 20.00, imagen: 'Imagenes/RB-modified.png' }; break;
        case 3: producto = { ...producto, nombre: 'SO', precio: 20.00, imagen: 'Imagenes/SO-modified.png' }; break;
        case 4: producto = { ...producto, nombre: 'LMM', precio: 20.00, imagen: 'Imagenes/LMM-modified.png' }; break;
        case 5: producto = { ...producto, nombre: 'HB', precio: 20.00, imagen: 'Imagenes/HB-modified.png' }; break;
        case 6: producto = { ...producto, nombre: 'LMM', precio: 20.00, imagen: 'Imagenes/LMM-modified.png' }; break;
        case 7: producto = { ...producto, nombre: 'BBQ', precio: 20.00, imagen: 'Imagenes/BBQ-modified.png' }; break;
        case 8: producto = { ...producto, nombre: 'MELT', precio: 20.00, imagen: 'Imagenes/MELT-modified.png' }; break;
        case 9: producto = { ...producto, nombre: 'CO', precio: 20.00, imagen: 'Imagenes/CO-modified.png' }; break;
    }

    // Modificar la cantidad según la acción (agregar o quitar)
    if (action === 'add') {
        cantidad++;
    } else if (action === 'remove' && cantidad > 0) {
        cantidad--;
    }

    // Si la cantidad es mayor a 0, guardamos el producto en el carrito
    if (cantidad > 0) {
        producto.cantidad = cantidad;
        cartItems[productId] = producto;
    } else {
        // Si la cantidad es 0 o menor, eliminamos el producto del carrito
        delete cartItems[productId];
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Actualizar el span de la cantidad del producto en la página
    const cantidadElement = document.getElementById(`cantidad-${productId}`);
    if (cantidadElement) {
        cantidadElement.textContent = cantidad;
    }

    // Actualizar el contador del carrito en el navbar
    actualizarCantidadCarrito();

    // Refrescar la lista de productos en el carrito (opcional)
    mostrarProductos();
}

// Función para actualizar el contador del carrito en el navbar
// Función para actualizar el contador total del carrito en el navbar
function actualizarCantidadCarrito() {
    let totalCantidad = 0;

    // Sumar la cantidad total de todos los productos en el carrito
    for (const productId in cartItems) {
        totalCantidad += cartItems[productId].cantidad;
    }

    // Actualizar el valor en el ícono del carrito en el navbar
    document.getElementById('cart-count').textContent = totalCantidad;
}

// Función para mostrar los productos del carrito en la página
function mostrarProductos() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';

    for (const productId in cartItems) {
        const producto = cartItems[productId];
        const productoCard = `
            <div class="col-md-4">
                <div class="card mb-4">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">Cantidad: <span id="cantidad-${productId}">${producto.cantidad}</span></p>
                        <p class="card-text">Precio unitario: $${producto.precio.toFixed(2)}</p>
                        <p class="card-text">Total: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
                        <button class="btn btn-danger" onclick="eliminarProducto(${productId})">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        cartContainer.innerHTML += productoCard;
    }
}

// Función para eliminar un producto del carrito
function eliminarProducto(productId) {
    delete cartItems[productId];
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    mostrarProductos();
    actualizarCantidadCarrito();  // Actualiza el contador en el navbar
}

// Función para actualizar las cantidades en la página al cargar
function actualizarCantidadesProductos() {
    for (const productId in cartItems) {
        const cantidadElement = document.getElementById(`cantidad-${productId}`);
        if (cantidadElement) {
            cantidadElement.textContent = cartItems[productId].cantidad;
        }
    }
}



// Restaurar el carrito desde localStorage al cargar la página
window.onload = function() {
    cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
    
    // Actualizar las cantidades de cada producto en sus respectivos spans
    for (const productId in cartItems) {
        const cantidadElement = document.getElementById(`cantidad-${productId}`);
        if (cantidadElement) {
            cantidadElement.textContent = cartItems[productId].cantidad;
        }
    }
      // Actualizar el número total de productos en el carrito (navbar)
      actualizarCantidadCarrito();

      // Mostrar los productos en el carrito si es necesario
      mostrarProductos();
  };