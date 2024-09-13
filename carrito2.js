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
                const lines = textoCompleto.split('\n').map(line => line.trim()).filter(line => line);

                const producto = lines[0]; // La primera línea es el nombre del producto
                const talle = lines.find(line => line.startsWith('Talle:'))?.replace('Talle: ', '');
                const cantidad = lines.find(line => line.startsWith('Cantidad:'))?.replace('Cantidad: ', '');
                const precio = lines.find(line => line.startsWith('Precio:'))?.replace('Precio: $', '');

                // Formatear el producto solo con las líneas que tienen valor
                let productoFormateado = producto;
                if (talle) productoFormateado += `\nTalle: ${talle}\n\n`;
                if (cantidad) productoFormateado += `\nCantidad: ${cantidad}\n\n`;
                if (precio) productoFormateado += `\nPrecio: $${precio}`;

                return productoFormateado;
            });
            const productosFormateados = productosCarrito.join('\n\n');

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
        Nombre: ${nombre} ${apellido}:
        Teléfono: ${telefono}
        Email: ${email}
        
        Productos:
        ${productosFormateados}
        
        Total: $${nuevoTotal.toFixed(2)}
            `.trim()
        };
        const datosParaDB = {
            nombre,
            apellido,
            telefono,
            email,
            productos: JSON.stringify(productosCarrito),
            total: nuevoTotal
        };

        try {
            // Enviar email usando EmailJS
            const emailResponse = await emailjs.send('service_z20cmq6', 'template_v4j0raz', contenidoEmail);
            console.log('Email enviado con éxito:', emailResponse);
        
            // Guardar en la base de datos
            const dbResponse = await fetch('/back.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosParaDB)
            });
        
            if (!dbResponse.ok) {
                const errorText = await dbResponse.text();
                throw new Error(`HTTP error! status: ${dbResponse.status}, message: ${errorText}`);
            }
        
            const dbResult = await dbResponse.json();
            console.log('Datos guardados en la base de datos:', dbResult);
        
            Swal.fire({
                title: `Gracias por tu compra ${nombre}!`,
                text: "Tu pedido ha sido registrado y se ha enviado un email de confirmación.",
                icon: "success"
            });
            vaciarCarrito();
            abrirForm.style.display = "none";
        } catch (error) {
            console.error('Error al procesar el pedido:', error);
            let errorMessage = "Hubo un problema al procesar tu pedido. ";
            if (error.message.includes('404')) {
                errorMessage += "No se pudo encontrar el script para guardar los datos. Por favor, contacta al administrador del sitio.";
            } else {
                errorMessage += "Por favor, intenta de nuevo más tarde.";
            }
            Swal.fire({
                title: "Error",
                text: errorMessage,
                icon: "error"
            });
        }
 

        // Enviar el email usando EmailJS
        emailjs.send('service_z20cmq6', 'template_v4j0raz', contenidoEmail)
            .then(response => {
                Swal.fire({
                    title: `Gracias por tu compra ${nombre}!`,
                    text: "Acabo de enviarte un email para que finalices tu compra.",
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

