document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector(".productos-container");

  // fetch de productos
  fetch("productos.json")
    .then(res => res.json())
    .then(productos => {
      productos.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("producto-card");

        card.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <h3>${producto.nombre}</h3>
          <p>Precio: $${producto.precio}</p>
          <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
        `;

        contenedor.appendChild(card);
      });

      // agregar evento a los botones
      const botones = document.querySelectorAll(".btn-agregar");
      botones.forEach(boton => {
        boton.addEventListener("click", (e) => {
          const id = parseInt(e.target.getAttribute("data-id"));
          agregarAlCarrito(id);
        });
      });
    })
    .catch(err => {
      console.error("Error al cargar productos:", err);
    });

  // agregar al carrito usando localStorage
  function agregarAlCarrito(id) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("Producto agregado al carrito");
  }

  // validacion de formulario
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
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
