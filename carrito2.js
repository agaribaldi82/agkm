document.addEventListener('DOMContentLoaded', () => {
    const cantidad = document.getElementById("producto");
    const costo = document.querySelector(".costo");
    const producto = document.querySelector(".product");
    const talle = document.getElementById("talle");
    const agregar_producto = document.querySelector(".btn-agregar");
    const costo_total = document.querySelector(".costo-total");
    const lista_productos = document.querySelector(".lista-productos");

    let total = 0;

    const actualizarTotal = () => {
        if (total > 0) {
            costo_total.textContent = `Total: $${total.toFixed(2)}`;
            costo_total.style.display = "block";
        } else {
            costo_total.style.display = "none";
        }
    };

    agregar_producto.addEventListener("click", () => {
        const producto_seleccionado = producto.textContent;
        const cantidad_seleccionada = parseInt(cantidad.value);
        const costo_producto = parseFloat(costo.textContent.replace('$', ''));
        const talle_seleccionado = talle.value;

        const carrito = document.querySelector(".div-carrito").style.display = "block"

        if (!isNaN(cantidad_seleccionada) && !isNaN(costo_producto)) {
            const precio_total = costo_producto * cantidad_seleccionada;
            const producto_agregado = document.createElement("li");
            const btn_eliminar = document.createElement("button");
            btn_eliminar.innerHTML = "Eliminar Producto";
            btn_eliminar.style.backgroundColor = "red";
            producto_agregado.innerHTML = `${producto_seleccionado}<br>Talle: ${talle_seleccionado}<br>Cantidad: ${cantidad_seleccionada}<br>Precio: $${precio_total.toFixed(2)}`;
            lista_productos.appendChild(producto_agregado);
            producto_agregado.appendChild(btn_eliminar);
            document.getElementById("vacio").innerHTML = "";
            
            total += precio_total;
            actualizarTotal();
            
            btn_eliminar.addEventListener("click", () => {
                lista_productos.removeChild(producto_agregado);
                total -= precio_total;
                actualizarTotal();
                if (lista_productos.children.length === 0) {
                    document.getElementById("vacio").innerHTML = "No hay productos en el carrito";
                }
            });
        } else {
            alert("Por favor, ingrese una cantidad válida y un costo válido.");
        }
    });

    const comprar = document.querySelector(".btn-comprar");
    comprar.addEventListener("click", () => {
        if (total > 0) {
            Swal.fire({title: "Felicidades!"});
            while(lista_productos.firstChild) {
                lista_productos.removeChild(lista_productos.firstChild);
            }
            document.getElementById("vacio").innerHTML = "No hay productos en el carrito";
            total = 0;
            actualizarTotal();
        } else {
            alert("El carrito está vacío. Agregue productos antes de comprar.");
        }
    });
});

function cerrarCarrito() {
    document.querySelector(".div-carrito").style.display = "none"
}