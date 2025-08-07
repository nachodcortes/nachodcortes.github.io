document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector(".productos-container");
  const tablaBody = document.querySelector("#carrito-items");
  const totalSpan = document.querySelector("#carrito-total");
  const vaciarBtn = document.querySelector("#vaciar-carrito");
  const comprarBtn = document.querySelector("#comprar");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Cargar productos y renderizar cards
  fetch("productos.json")
    .then(res => res.json())
    .then(productos => {
      renderizarCards(productos);
      renderizarCarrito(productos);

      if (contenedor) {
        document.querySelectorAll(".btn-agregar").forEach(boton => {
          boton.addEventListener("click", e => {
            const id = parseInt(e.target.getAttribute("data-id"));
            agregarAlCarrito(id);
            renderizarCarrito(productos);
          });
        });
      }

      // Botón vaciar
      if (vaciarBtn) {
        vaciarBtn.addEventListener("click", () => {
          carrito = [];
          localStorage.setItem("carrito", JSON.stringify(carrito));
          renderizarCarrito(productos);
        });
      }

      // Botón comprar
      if (comprarBtn) {
        comprarBtn.addEventListener("click", () => {
          if (carrito.length === 0) {
            alert("Tu carrito está vacío.");
          } else {
            alert("¡Gracias por tu compra!");
            carrito = [];
            localStorage.setItem("carrito", JSON.stringify(carrito));
            renderizarCarrito(productos);
          }
        });
      }
    });

  // Crear las tarjetas de productos
  function renderizarCards(productos) {
    productos.forEach(producto => {
      const card = document.createElement("div");
      card.classList.add("producto-card");

      card.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p class="precio">Precio: $${producto.precio}</p>
        <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
      `;

      contenedor.appendChild(card);
    });
  }

  // Agregar producto al carrito
  function agregarAlCarrito(id) {
    const index = carrito.findIndex(p => p.id === id);
    if (index >= 0) {
      carrito[index].cantidad += 1;
    } else {
      carrito.push({ id, cantidad: 1 });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  // Renderizar el carrito
  function renderizarCarrito(productos) {
    if (!tablaBody) return;

    tablaBody.innerHTML = "";

    if (carrito.length === 0) {
      tablaBody.innerHTML = `<tr><td colspan="6">Tu carrito está vacío</td></tr>`;
      totalSpan.textContent = "0.00";
      return;
    }

    let total = 0;

    carrito.forEach(item => {
      const producto = productos.find(p => p.id === item.id);
      const subtotal = producto.precio * item.cantidad;
      total += subtotal;

      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td><img src="${producto.imagen}" alt="${producto.nombre}"></td>
        <td>${producto.nombre}</td>
        <td>$${producto.precio}</td>
        <td><input type="number" min="1" value="${item.cantidad}" data-id="${item.id}" class="input-cantidad"></td>
        <td>$${subtotal.toFixed(2)}</td>
        <td><button data-id="${item.id}" class="btn-eliminar">Eliminar</button></td>
      `;
      tablaBody.appendChild(fila);
    });

    totalSpan.textContent = total.toFixed(2);

    // Eventos eliminar
    document.querySelectorAll(".btn-eliminar").forEach(boton => {
      boton.addEventListener("click", e => {
        const id = parseInt(e.target.getAttribute("data-id"));
        carrito = carrito.filter(p => p.id !== id);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderizarCarrito(productos);
      });
    });

    // Eventos input cantidad
    document.querySelectorAll(".input-cantidad").forEach(input => {
      input.addEventListener("change", e => {
        const id = parseInt(e.target.getAttribute("data-id"));
        const nuevaCantidad = parseInt(e.target.value);
        if (nuevaCantidad <= 0) return;
        const index = carrito.findIndex(p => p.id === id);
        carrito[index].cantidad = nuevaCantidad;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderizarCarrito(productos);
      });
    });
  }

  // Validación formulario de contacto
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", e => {
      const email = form.querySelector("#email").value;
      const name = form.querySelector("#name").value;
      const mensaje = form.querySelector("#message").value;

      if (!email.includes("@") || name.trim() === "" || mensaje.trim() === "") {
        e.preventDefault();
        alert("Por favor completá todos los campos correctamente.");
      }
    });
  }
});

