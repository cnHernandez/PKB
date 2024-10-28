let cartCount = 0;
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};

// Inicializa el carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarCantidadCarrito();  // Actualiza el contador del carrito en el navbar
    mostrarProductos();
    actualizarCantidadesProductos();
});

const preciosPorProductoYTipo = {
    1: { SIMPLE: 7600.00, DOBLE: 9500.00, TRIPLE: 11300.00 },  // PKB
    2: { SIMPLE: 7600.00, DOBLE: 9500.00, TRIPLE: 11300.00 },  // RB
    3: { SIMPLE: 8000.00, DOBLE: 9800.00},  // SO
    4: { SIMPLE: 8500.00, DOBLE: 9800.00},  // LMM
    5: { SIMPLE: 8700.00, DOBLE: 10000.00},  // HB
    6: { SIMPLE: 8500.00, DOBLE: 9800.00 },  // LMM (otro)
    7: { SIMPLE: 8300.00, DOBLE: 9700.00 },  // BBQ
    8: { SIMPLE: 7800.00, DOBLE: 9500.00},  // MELT
    9: { SIMPLE: 8000.00,  DOBLE: 9800.00 }   // CO
};

function validarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (nombre === "") {
        alert("Por favor, ingresa tu nombre.");
        return false;
    }

    if (mensaje === "") {
        alert("Por favor, ingresa un mensaje.");
        return false;
    }

    return true; // Permite el envío si todos los campos están completos
}

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
        cantidad: 0,
        tipo: ''
    };
    const tipoSeleccionado = document.querySelector(`input[name="tipo-${productId}"]:checked`);
    
    // Verificar si se ha seleccionado un tipo
    if (!tipoSeleccionado) {
        alert("Por favor, selecciona un tipo de producto.");
        return;
    }

    const tipo = tipoSeleccionado.value; // Obtener el tipo seleccionado
    producto.tipo = tipo; // Asignar el tipo al producto

    // Asignar los valores del producto en función del productId
    switch (productId) {
        case 1: producto = { ...producto, nombre: 'PKB' ,imagen: 'Imagenes/PKB-modified.png' }; break;
        case 2: producto = { ...producto, nombre: 'RB',imagen: 'Imagenes/RB-modified.png' }; break;
        case 3: producto = { ...producto, nombre: 'SO',  imagen: 'Imagenes/SO-modified.png' }; break;
        case 4: producto = { ...producto, nombre: 'LMM' , imagen: 'Imagenes/LMM-modified.png' }; break;
        case 5: producto = { ...producto, nombre: 'HB', imagen: 'Imagenes/HB-modified.png' }; break;
        case 6: producto = { ...producto, nombre: 'LMM' , imagen: 'Imagenes/LMM-modified.png' }; break;
        case 7: producto = { ...producto, nombre: 'BBQ',imagen: 'Imagenes/BBQ-modified.png' }; break;
        case 8: producto = { ...producto, nombre: 'MELT', imagen: 'Imagenes/MELT-modified.png' }; break;
        case 9: producto = { ...producto, nombre: 'CO' , imagen: 'Imagenes/CO-modified.png' }; break;
    }

   // Definir el precio según el tipo seleccionado y el productId
    producto.precio = preciosPorProductoYTipo[productId][tipo]; // Establecer el precio según el tipo y producto

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
                         <p class="card-text">${producto.tipo}</p> <!-- Mostrar el tipo del producto -->
                        <p class="card-text">Cantidad: <span id="cantidad-${productId}">${producto.cantidad}</span></p>
                        <p class="card-text">Precio unitario: $${producto.precio.toFixed(2)}</p>
                        <p class="card-text">Total: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
                        <button class="btn btn-danger" onclick="eliminarProducto(${productId})">Eliminar</button><div class="d-flex justify-content-center">
                            <div class="form-check me-3">
                                <input class="form-check-input" type="radio" name="tipo-${productId}" id="simple-${productId}" value="SIMPLE" onclick="actualizarPrecioProducto(${productId})">
                                <label class="form-check-label" for="simple-${productId}">Simple</label>
                            </div>
                            <div class="form-check me-3">
                                <input class="form-check-input" type="radio" name="tipo-${productId}" id="doble-${productId}" value="DOBLE" onclick="actualizarPrecioProducto(${productId})">
                                <label class="form-check-label" for="doble-${productId}">Doble</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="tipo-${productId}" id="triple-${productId}" value="TRIPLE" onclick="actualizarPrecioProducto(${productId})">
                                <label class="form-check-label" for="triple-${productId}">Triple</label>
                            </div>
                        </div>
                    </div>
                </div>
                </div>                  
        `;
        cartContainer.innerHTML += productoCard;
    }
}

// Función para actualizar el precio del producto seleccionado
function actualizarPrecioProducto(productId) {
    console.log(`Actualizando precio para producto ${productId}`);
    const tipoSeleccionado = document.querySelector(`input[name="tipo-${productId}"]:checked`);  
    if (tipoSeleccionado && preciosPorProductoYTipo[productId] && preciosPorProductoYTipo[productId][tipoSeleccionado.value]) {
        const nuevoPrecio = preciosPorProductoYTipo[productId][tipoSeleccionado.value];
        actualizarPrecioTexto(nuevoPrecio, productId);  // Actualiza el texto del precio
    }
}

// Función para actualizar el precio en la interfaz
function actualizarPrecio(nuevoPrecio, productId) {
    const precioElement = document.querySelector(`#precio-${productId}`);
    if (precioElement) {
        precioElement.textContent = `Precio: $${nuevoPrecio.toFixed(2)}`;
    }
}

// Nueva función para actualizar el texto en el elemento <p>
function actualizarPrecioTexto(nuevoPrecio, productId) {
    const precioTextElement = document.querySelector(`#precio-text-${productId}`);
    if (precioTextElement) {
        precioTextElement.textContent = `Precio: $${nuevoPrecio.toFixed(2)}`;
    }
}

// Función para inicializar los eventos de los radio buttons
function initRadioButtons(productId) {
    const tipoRadios = document.querySelectorAll(`input[name="tipo-${productId}"]`);
    tipoRadios.forEach(radio => {
        radio.addEventListener('change', () => actualizarPrecioProducto(productId));
    });
}

// Llama a esta función después de que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i <= 9; i++) {  // Cambia el número según la cantidad de productos
        initRadioButtons(i);
    }
});

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