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

    formularioPedido.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const email = document.getElementById('email').value.trim();
        
        // Validar campos
        if (!nombre || !apellido || !telefono || !email) {
            document.getElementById('mensaje-formulario').textContent = "Por favor, completa todos los campos.";
            return;
        }
    
        // Verificar que hay productos en listaProductos
        if (listaProductos.children.length === 0) {
            document.getElementById('mensaje-formulario').textContent = "El carrito está vacío. Agrega productos antes de enviar.";
            return;
        }
    
        // Extraer los productos del carrito
        const productosCarrito = Array.from(listaProductos.children)
            .filter(item => item.tagName === 'LI')
            .map(item => {
                const textoCompleto = item.innerText.trim();
    
                // Dividir el texto en líneas y eliminar líneas vacías
                const lines = textoCompleto.split('\n').map(line => line.trim()).filter(line => line);
    
                // Inicializar variables para datos
                let producto = 'Producto desconocido';
                let talle = 'No especificado';
                let cantidad = 'No especificado';
                let precio = 'No especificado';
    
                // Recorrer las líneas para extraer datos
                lines.forEach(line => {
                    if (line.startsWith('Talle:')) {
                        talle = line.replace('Talle: ', '');
                    } else if (line.startsWith('Cantidad:')) {
                        cantidad = line.replace('Cantidad: ', '');
                    } else if (line.startsWith('Precio:')) {
                        precio = line.replace('Precio: $', '');
                    } else {
                        producto = line;
                    }
                });
    
                // Formatear el producto
                return `${producto} - Talle: ${talle} - Cantidad: ${cantidad} - Precio: $${precio}`;
            });
    
        // Calcular el total
        const totalTexto = costoTotal.textContent.replace('Total: $', '').trim();
        const nuevoTotal = parseFloat(totalTexto);
    
        if (isNaN(nuevoTotal)) {
            document.getElementById('mensaje-formulario').textContent = "Error al calcular el total. Por favor, intenta de nuevo.";
            return;
        }
    
        // Preparar el contenido del email
        const contenidoEmail = {
            to_name: "Adrian",
            from_name: `${nombre} ${apellido}`,
            message: `
                Nueva compra realizada por ${nombre} ${apellido}:
    
                Teléfono: ${telefono}
                Email: ${email}
    
                Productos:
                ${productosCarrito.join('\n \n')}
    
                Total: $${nuevoTotal.toFixed(2)}
            `.trim()
        };
    
        // Enviar el email usando EmailJS
        emailjs.send('service_z20cmq6', 'template_v4j0raz', contenidoEmail)
            .then(response => {
                Swal.fire({
                    title: "¡Felicidades!",
                    text: "Sigue las instrucciones",
                    icon: "success"
                });
                vaciarCarrito();
                abrirForm.style.display = "none";
            })
            .catch(error => {
                console.error('Error al enviar el pedido:', error);
                document.getElementById('mensaje-formulario').textContent = "Error al enviar el pedido. Por favor, intenta de nuevo.";
            });
    });
    

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

