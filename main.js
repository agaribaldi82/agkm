

document.addEventListener("DOMContentLoaded", function() {
    const menu_btn = document.getElementById("menu_hamburguesa");
    const menu_list = document.getElementById("lista_menu");

    menu_btn.addEventListener("click", function() {
        toggle(menu_list, "active");
    });

    function toggle(element, className = "active") {
        element.classList.toggle(className);
    }
});

function abrir(){
    document.getElementById("lista_menu").style.display="block"
    document.getElementById("menu_hamburguesa").style.display="none"
}

function cerrar(){
    document.getElementById("lista_menu").style.display="none";
    document.getElementById("menu_hamburguesa").style.display="flex"
}

function login(){
    document.getElementById("formu").style.display="flex"
}

function cerrar_form(){
    document.getElementById("formu").style.display="none"
}

let volver = document.getElementById("volver")
volver.addEventListener("click", ()=>{
    window.location.href = "index.html"
})

// Función para cerrar el menú de navegación
function cerrarNav() {
    const nav = document.getElementById('nav');
    if (nav) {
      nav.style.display = 'none';
    }
  }
  
  // Función para verificar el tamaño de la pantalla y agregar event listeners
  function inicializarNavResponsive() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const menuItems = document.querySelectorAll('#lista_menu li a');
  
    function handleMenuClick(event) {
      if (mediaQuery.matches) {
        cerrarNav();
      }
    }
  
    menuItems.forEach(item => {
      item.addEventListener('click', handleMenuClick);
    });
  }
  
  // Inicializar cuando el DOM esté completamente cargado
  document.addEventListener('DOMContentLoaded', inicializarNavResponsive);
  
