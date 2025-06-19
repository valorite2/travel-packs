const productos = [
  { id: 1, nombre: "Camisa", precio: 25.99 },
  { id: 2, nombre: "Pantalón", precio: 45.50 },
  { id: 3, nombre: "Zapatos", precio: 79.99 }
];

const carrito = [];

const productsDiv = document.getElementById("products");
const cartItemsDiv = document.getElementById("cart-items");
const totalSpan = document.getElementById("total");

function renderProductos() {
  productos.forEach(prod => {
    const prodDiv = document.createElement("div");
    prodDiv.className = "product-card";
    prodDiv.innerHTML = `
      <h3>${prod.nombre}</h3>
      <p>Precio: $${prod.precio.toFixed(2)}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
    `;
    productsDiv.appendChild(prodDiv);
  });
}

function agregarAlCarrito(id) {
  const prod = productos.find(p => p.id === id);
  const itemEnCarrito = carrito.find(item => item.id === id);
  if (itemEnCarrito) {
    itemEnCarrito.cantidad++;
  } else {
    carrito.push({ ...prod, cantidad: 1 });
  }
  renderCarrito();
}

function eliminarDelCarrito(id) {
  const index = carrito.findIndex(item => item.id === id);
  if (index !== -1) {
    carrito.splice(index, 1);
  }
  renderCarrito();
}

function renderCarrito() {
  cartItemsDiv.innerHTML = "";
  let total = 0;
  carrito.forEach(item => {
    total += item.precio * item.cantidad;
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      ${item.nombre} - $${item.precio.toFixed(2)} x ${item.cantidad}
      <button onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
    `;
    cartItemsDiv.appendChild(itemDiv);
  });
  totalSpan.textContent = total.toFixed(2);
}

renderProductos();