document.addEventListener('DOMContentLoaded', () => {
    const cantidadInputs = document.querySelectorAll(".producto");
    const costoSpans = document.querySelectorAll(".costo");
    const productSpans = document.querySelectorAll(".product");
    const talleSelects = document.querySelectorAll(".talle");
    const agregarBotones = document.querySelectorAll(".btn-agregar");
    const costoTotal = document.querySelector(".costo-total");
    const listaProductos = document.querySelector(".lista-productos");
    const elementNumeroCarro = document.getElementById("numero-carrito");

    let total = 0;
    let numeroCarro = 0;

    const actualizarTotal = () => {
        if (total > 0) {
            costoTotal.textContent = `Total: $${total.toFixed(2)}`;
            costoTotal.style.display = "block";
        } else {
            costoTotal.style.display = "none";
        }
    };

    const actualizarNumeroCarro = () => {
        elementNumeroCarro.textContent = numeroCarro;
    };

    agregarBotones.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const cantidadSeleccionada = parseInt(cantidadInputs[index].value);
            const costoProducto = parseFloat(costoSpans[index].textContent.replace('$', ''));
            const productoSeleccionado = productSpans[index].textContent;
            const talleSeleccionado = talleSelects[index].value;

            if (!isNaN(cantidadSeleccionada) && !isNaN(costoProducto)) {
                const precioTotal = costoProducto * cantidadSeleccionada;
                const productoAgregado = document.createElement("li");
                const btnEliminar = document.createElement("img");

                btnEliminar.width = 50;
                btnEliminar.height = 50;
                btnEliminar.src = "/imagenes_logo/basura.png";
                btnEliminar.style.cursor = "pointer";

                productoAgregado.innerHTML = `${productoSeleccionado}<br>Talle: ${talleSeleccionado}<br>Cantidad: ${cantidadSeleccionada}<br>Precio: $${precioTotal.toFixed(2)}`;
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

    const comprar = document.querySelector(".btn-comprar");
    comprar.addEventListener("click", () => {
        if (total > 0) {
            Swal.fire({
                title: "¡Felicidades!",
                text: "Tu compra ha sido realizada con éxito.",
                icon: "success"
            });

            while (listaProductos.firstChild) {
                listaProductos.removeChild(listaProductos.firstChild);
            }
            document.getElementById("vacio").innerHTML = "No hay productos en el carrito";
            total = 0;
            numeroCarro = 0;
            actualizarTotal();
            actualizarNumeroCarro();
        } else {
            alert("El carrito está vacío. Agregue productos antes de comprar.");
        }
    });
});

function cerrarCarrito() {
    document.querySelector(".div-carrito").style.display = "none";
}

function abrirCarro() {
    document.querySelector(".div-carrito").style.display = "block";
}
