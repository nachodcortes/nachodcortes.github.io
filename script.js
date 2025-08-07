document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector(".productos-container");
  const tablaBody = document.querySelector("#carrito-body");
  const totalSpan = document.querySelector("#total");
  const vaciarBtn = document.querySelector("#vaciar-carrito");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Mostrar productos
  fetch("productos.json")
    .then(res => res.json())
    .then(productos => {
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

      // Botones agregar
      document.querySelectorAll(".btn-agregar").forEach(boton => {
        boton.addEventListener("click", e => {
          const id = parseInt(e.target.getAttribute("data-id"));
          agregarAlCarrito(id);
        });
      });

      // Mostrar carrito si existe
      if (tablaBody) {
        mostrarCarrito(productos);
      }
    })
    .catch(err => console.error("Error al cargar productos:", err));

  function agregarAlCarrito(id) {
    const index = carrito.findIndex(p => p.id === id);
    if (index >= 0) {
      carrito[index].cantidad += 1;
    } else {
      carrito.push({ id, cantidad: 1 });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("Producto agregado al carrito");
  }

  function mostrarCarrito(productos) {
    tablaBody.innerHTML = "";

    if (carrito.length === 0) {
      tablaBody.innerHTML = `<tr><td colspan="5">Tu carrito está vacío</td></tr>`;
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
        <td>${item.cantidad}</td>
        <td>$${subtotal.toFixed(2)}</td>
        <td><button data-id="${item.id}" class="btn-eliminar">Eliminar</button></td>
      `;
      tablaBody.appendChild(fila);
    });

    totalSpan.textContent = total.toFixed(2);

    // Eventos de eliminar
    document.querySelectorAll(".btn-eliminar").forEach(boton => {
      boton.addEventListener("click", e => {
        const id = parseInt(e.target.getAttribute("data-id"));
        eliminarProducto(id);
      });
    });
  }

  function eliminarProducto(id) {
    carrito = carrito.filter(p => p.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    location.reload();
  }

  // Vaciar carrito
  if (vaciarBtn) {
    vaciarBtn.addEventListener("click", () => {
      carrito = [];
      localStorage.setItem("carrito", JSON.stringify(carrito));
      location.reload();
    });
  }

  // Validación de formulario de contacto
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
