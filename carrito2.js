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
    const vaciarCarro = document.querySelector(".vaciar")
    const abrirForm = document.querySelector(".formulario-carro")

    const formularioPedido = document.getElementById('formulario-pedido');
    formularioPedido.addEventListener('submit', enviarPedido);

    function enviarPedido(e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;

        // Obtener los productos del carrito
        const productosCarrito = Array.from(listaProductos.children).map(item => item.textContent);
        const nuevoTotal = total.toFixed(2)
        // Preparar el contenido del email
        const contenidoEmail = {
            to_email: "tu_email@ejemplo.com",
            from_name: `${nombre} ${apellido}`,
            message: `
                Nuevo pedido de: ${nombre} ${apellido}
                Teléfono: ${telefono}
                Email: ${email}

                Productos:
                ${productosCarrito.join('\n')}

                Total: $${total.toFixed(2)}
            `
        };

        // Enviar el email usando EmailJS
        emailjs.send('service_z20cmq6', 'template_v4j0raz', contenidoEmail)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                document.getElementById('mensaje-formulario').textContent = "¡Pedido enviado con éxito!";
                vaciarCarrito();  // Vaciar el carrito después de enviar el pedido
            }, function(error) {
                console.log('FAILED...', error);
                document.getElementById('mensaje-formulario').textContent = "Error al enviar el pedido. Por favor, intenta de nuevo.";
            });
    }

    let total = 0;
    let numeroCarro = 0;

    const actualizarTotal = () => {
        if (total > 0) {
            costoTotal.innerHTML = `<b>Total: $${total.toFixed(2)}</b>`;
            costoTotal.style.display = "block";
        } else {
            costoTotal.style.display = "none";
        }
    };

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
    
    vaciarCarro.addEventListener("click", vaciarCarrito);
    const comprar = document.querySelector(".btn-comprar");
    comprar.addEventListener("click", () => {
        if (total > 0) {
            Swal.fire({
                title: "¡Felicidades!",
                text: "Tu compra ha sido realizada con éxito.",
                icon: "success"
            });
            
            abrirForm.style.display = "block"

            while (listaProductos.firstChild) {
                listaProductos.removeChild(listaProductos.firstChild);
            }
            document.getElementById("vacio").innerHTML = "No hay productos en el carrito";
            total = 0;
            numeroCarro = 0;
            actualizarTotal();
            actualizarNumeroCarro();
            cerrarCarrito()
        } else {
            alert("El carrito está vacío. Agregue productos antes de comprar.");
        }
    });
});


