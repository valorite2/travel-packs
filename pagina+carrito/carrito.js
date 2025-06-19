// Configuración de Supabase
const supabaseUrl = 'https://cywsonaxzsfixwtdazgm.supabase.co';
const supabaseKey = 'TU_CLAVE_PUBLICA'; // reemplaza por tu anon/public key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Referencias DOM
const productsDiv = document.getElementById("products");
const cartItemsDiv = document.getElementById("cart-items");
const totalSpan = document.getElementById("total");

let productos = [];
const carrito = [];

// Obtener productos desde la tabla 'suba'
async function cargarProductos() {
  const { data, error } = await supabase.from("suba").select("*");
  if (error) {
    console.error("Error al cargar productos:", error);
    return;
  }
  productos = data;
  renderProductos();
}

// Mostrar productos
function renderProductos() {
  productsDiv.innerHTML = "";
  productos.forEach(prod => {
    const prodDiv = document.createElement("div");
    prodDiv.className = "product-card";
    prodDiv.innerHTML = `
      <h3>${prod.tipo_articulo}</h3>
      <p>${prod.descripcion}</p>
      <button onclick="agregarAlCarrito('${prod.id}')">Agregar al carrito</button>
    `;
    productsDiv.appendChild(prodDiv);
  });
}

// Agregar al carrito (local + changuito_articulo en Supabase)
async function agregarAlCarrito(id) {
  const prod = productos.find(p => p.id === id);
  if (!prod) return;

  const existente = carrito.find(item => item.id === id);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...prod, cantidad: 1 });
  }

  // Insertar en changuito_articulo (si no existe ya)
  await supabase.from("changuito_articulo").insert({
    producto_id: id,
    cantidad: 1
  });

  renderCarrito();
}

// Eliminar del carrito (local + Supabase)
async function eliminarDelCarrito(id) {
  const index = carrito.findIndex(item => item.id === id);
  if (index !== -1) {
    carrito.splice(index, 1);
    await supabase.from("changuito_articulo").delete().eq("producto_id", id);
  }
  renderCarrito();
}

// Mostrar carrito
function renderCarrito() {
  cartItemsDiv.innerHTML = "";
  let total = 0;
  carrito.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      ${item.tipo_articulo} - ${item.descripcion} x ${item.cantidad}
      <button onclick="eliminarDelCarrito('${item.id}')">Eliminar</button>
    `;
    cartItemsDiv.appendChild(itemDiv);
  });
  totalSpan.textContent = total.toFixed(2);
}

// Iniciar
cargarProductos();
