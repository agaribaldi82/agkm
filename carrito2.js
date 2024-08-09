document.addEventListener('DOMContentLoaded', () => {
    const cantidadInputs = document.querySelectorAll(".producto");
    const costoSpans = document.querySelectorAll(".costo");
    const productSpans = document.querySelectorAll(".product");
    const talleSelects = document.querySelectorAll(".talle");
    const agregarBotones = document.querySelectorAll(".btn-agregar");
    const costoTotal = document.querySelector(".costo-total");
    const listaProductos = document.querySelector(".lista-productos");
    const elementNumeroCarro = document.getElementById("numero-carrito");
    const indumentariaImagenes = document.querySelectorAll(".indumentaria_imagen");
    const carritoImagen = document.querySelector(".carrito-img");
    const divCarrito = document.querySelector(".div-carrito");
    const vaciarCarro = document.querySelector(".vaciar");
    const abrirForm = document.querySelector(".formulario-carro");
    const cerrarForm = document.getElementById("cerrar-form");
    const formularioPedido = document.getElementById('formulario-pedido');
    
    let total = 0;
    let numeroCarro = 0;

    

    const actualizarNumeroCarro = () => {
        elementNumeroCarro.textContent = numeroCarro;
    };

    carritoImagen.addEventListener("click", () => {
        divCarrito.style.display = "block";
    });

    window.cerrarCarrito = () => {
        divCarrito.style.display = "none";
    };

    agregarBotones.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const cantidadSeleccionada = parseInt(cantidadInputs[index].value);
            const costoProducto = parseFloat(costoSpans[index].textContent.replace('$', ''));
            const productoSeleccionado = productSpans[index].textContent;
            const talleSeleccionado = talleSelects[index].value;
            const imagenProducto = indumentariaImagenes[index].src;

            if (!isNaN(cantidadSeleccionada) && !isNaN(costoProducto)) {
                const precioTotal = costoProducto * cantidadSeleccionada;
                const productoAgregado = document.createElement("li");
                const btnEliminar = document.createElement("img");
                const imagenMiniatura = document.createElement("img");

                imagenMiniatura.src = imagenProducto;
                imagenMiniatura.alt = productoSeleccionado;
                imagenMiniatura.classList.add("cart-item-image");
                btnEliminar.width = 50;
                btnEliminar.height = 50;
                btnEliminar.src = "/imagenes_logo/basura.png";
                btnEliminar.style.cursor = "pointer";

                productoAgregado.appendChild(imagenMiniatura);
                productoAgregado.innerHTML += `${productoSeleccionado}<br>Talle: ${talleSeleccionado}<br>Cantidad: ${cantidadSeleccionada}<br>Precio: $${precioTotal.toFixed(2)}`;
                listaProductos.appendChild(productoAgregado);
                productoAgregado.appendChild(btnEliminar);
                document.getElementById("vacio").innerHTML = "";

                total += precioTotal;
                numeroCarro += cantidadSeleccionada;
                actualizarTotal();
                actualizarNumeroCarro();

                btnEliminar.addEventListener("click", () => {
                    listaProductos.removeChild(productoAgregado);
                    total -= precioTotal;
                    numeroCarro -= cantidadSeleccionada;
                    actualizarTotal();
                    actualizarNumeroCarro();
                    if (listaProductos.children.length === 0) {
                        document.getElementById("vacio").innerHTML = "No hay productos en el carrito";
                    }
                });
            } else {
                alert("Por favor, ingrese una cantidad válida y un costo válido.");
            }
        });
    });

    function vaciarCarrito() {
        while (listaProductos.firstChild) {
            listaProductos.removeChild(listaProductos.firstChild);
        }
        total = 0;
        numeroCarro = 0;
        actualizarTotal();
        actualizarNumeroCarro();
        document.getElementById("vacio").innerHTML = "No hay productos en el carrito";
    }

    cerrarForm.addEventListener("click", () => {
        abrirForm.style.display = "none";
    });

    vaciarCarro.addEventListener("click", vaciarCarrito);

    formularioPedido.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;

        // Obtener los productos del carrito
        const productosCarrito = Array.from(listaProductos.children).map(item => {
            const nombreProducto = item.querySelector('.product')?.textContent || item.textContent.split('\n')[0] || 'Producto sin nombre';
            const cantidad = item.textContent.match(/Cantidad: (\d+)/) ? item.textContent.match(/Cantidad: (\d+)/)[1] : 'N/A';
            const precio = item.textContent.match(/Precio: \$(\d+(\.\d{1,2})?)/) ? item.textContent.match(/Precio: \$(\d+(\.\d{1,2})?)/)[1] : 'N/A';
            return `${nombreProducto} - Cantidad: ${cantidad} - Precio: $${precio}`;
        }).join('\n');

        console.log('Productos en carrito:', productosCarrito); // Depuración

        const nuevoTotal = total.toFixed(2);

        console.log('Nuevo total:', nuevoTotal); // Depuración

        // ... (resto del código sin cambios)

        // Preparar el contenido del email
        const contenidoEmail = {
            to_name: "Adrian", // Cambia esto según sea necesario
            from_name: `${nombre} ${apellido}`,
            message: `
Nuevo pedido de: ${nombre} ${apellido}
Teléfono: ${telefono}
Email: ${email}

Productos:
${productosCarrito}

Total: $${nuevoTotal}
            `.trim()
        };

        console.log('Contenido del email:', contenidoEmail); // Depuración

        // Enviar el email usando EmailJS
        emailjs.send('service_z20cmq6', 'template_v4j0raz', contenidoEmail)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                Swal.fire({
                    title: "¡Felicidades!",
                    text: "Sigue las instrucciones",
                    icon: "success"
                });
                vaciarCarrito();  // Vaciar el carrito después de enviar el pedido
                abrirForm.style.display = "none";
            }, function(error) {
                console.log('FAILED...', error);
                document.getElementById('mensaje-formulario').textContent = "Error al enviar el pedido. Por favor, intenta de nuevo.";
            });
    });

    const actualizarTotal = () => {
        if (total > 0) {
            costoTotal.innerHTML = `<b>Total: $${total.toFixed(2)}</b>`;
            costoTotal.style.display = "block";
        } else {
            costoTotal.style.display = "none";
        }
    };

    const comprar = document.querySelector(".btn-comprar");
    comprar.addEventListener("click", () => {
        if (total > 0) {
            abrirForm.style.display = "block";

            while (listaProductos.firstChild) {
                listaProductos.removeChild(listaProductos.firstChild);
            }
            document.getElementById("vacio").innerHTML = "No hay productos en el carrito";
            total = 0;
            numeroCarro = 0;
            actualizarTotal();
            actualizarNumeroCarro();
            cerrarCarrito();
        } else {
            alert("El carrito está vacío. Agregue productos antes de comprar.");
        }
    });
});

