const productos = [
  { id: 0cab487d-d665-4b28-863d-f4245b09a346,tipo_articulo:pasaje2, descripcion: jtrdiocf8oydl, fecha: null },
  { id:256e659b-98c2-40b5-bdb8-694c9f1b23b6 ,tipo_articulo:pasaje, descripcion:ininiubpibpib, fecha: null },
  { id: f1631feb-816d-4cdb-bd8a-1dca64e29576 ,tipo_articulo:nuse, descripcion:brfbrfb, fecha: null },
  { id: fdaa9667-99c7-4889-b1e8-656901cdb48d ,tipo_articulo: lacaca es marron, descripcion:kgdo76xcpycxluyxlcx , fecha: null },
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
