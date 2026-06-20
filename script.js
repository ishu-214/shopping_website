
const CART_KEY = "shopping_cart";

   
const products = [
  { id: 1, name: "Wireless Headphones", category: "electronics", price: 1999, emoji: "🎧" },
  { id: 2, name: "Smart Watch",         category: "electronics", price: 2999, emoji: "⌚" },
  { id: 3, name: "Bluetooth Speaker",   category: "electronics", price: 1499, emoji: "🔊" },
  { id: 4, name: "Men's T-Shirt",       category: "fashion",     price: 499,  emoji: "👕" },
  { id: 5, name: "Running Shoes",       category: "fashion",     price: 2499, emoji: "👟" },
  { id: 6, name: "Leather Wallet",      category: "fashion",     price: 799,  emoji: "👛" },
  { id: 7, name: "Table Lamp",          category: "home",        price: 899,  emoji: "💡" },
  { id: 8, name: "Coffee Mug Set",      category: "home",        price: 599,  emoji: "☕" },
  { id: 9, name: "Cotton Bedsheet",     category: "home",        price: 1299, emoji: "🛏️" },
  { id: 10, name: "Mystery Novel",      category: "books",       price: 349,  emoji: "📘" },
  { id: 11, name: "Cookbook",           category: "books",       price: 599,  emoji: "📕" },
  { id: 12, name: "Notebook Set",       category: "books",       price: 199,  emoji: "📒" },
];


const productGrid     = document.getElementById("productGrid");
const noResults       = document.getElementById("noResults");
const searchBox       = document.getElementById("searchBox");
const categoryButtons = document.getElementById("categoryButtons");

const cartToggle  = document.getElementById("cartToggle");
const cartPanel   = document.getElementById("cartPanel");
const closeCart   = document.getElementById("closeCart");
const overlay     = document.getElementById("overlay");
const cartItemsEl = document.getElementById("cartItems");
const cartEmptyMsg = document.getElementById("cartEmptyMsg");
const cartCount   = document.getElementById("cartCount");
const cartTotal   = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// ----- App state -----
let activeCategory = "all";   
let searchTerm = "";          
let cart = [];                


function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}


function getFilteredProducts() {
  return products.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });
}


function renderProducts() {
  const filtered = getFilteredProducts();

  productGrid.innerHTML = "";

  // Show/hide the "No products found" message.
  noResults.classList.toggle("hidden", filtered.length !== 0);

  filtered.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">${product.emoji}</div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-category">${product.category}</div>
        <div class="product-price">${formatPrice(product.price)}</div>
        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    `;

    productGrid.appendChild(card);
  });
}


categoryButtons.addEventListener("click", function (event) {
  const button = event.target.closest(".cat-btn");
  if (!button) return;

  // Remove "active" class from all buttons, then add it to the clicked one.
  document
    .querySelectorAll(".cat-btn")
    .forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");

  activeCategory = button.getAttribute("data-category");
  renderProducts();
});


searchBox.addEventListener("input", function () {
  searchTerm = searchBox.value.trim();
  renderProducts();
});


productGrid.addEventListener("click", function (event) {
  const button = event.target.closest(".add-to-cart-btn");
  if (!button) return;

  const productId = Number(button.getAttribute("data-id"));
  addToCart(productId);
});


function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      quantity: 1,
    });
  }

  saveCart();
  renderCart();
  openCart(); // automatically show the cart so the user sees what was added
}


  
function renderCart() {
  cartItemsEl.innerHTML = "";

  cartEmptyMsg.classList.toggle("hidden", cart.length !== 0);

  let total = 0;
  let totalItems = 0;

  cart.forEach((item) => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;
    totalItems += item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price)} x ${item.quantity} = ${formatPrice(lineTotal)}</div>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" data-id="${item.id}" data-action="decrease">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" data-id="${item.id}" data-action="increase">+</button>
      </div>
      <button class="remove-btn" data-id="${item.id}" data-action="remove">Remove</button>
    `;

    cartItemsEl.appendChild(row);
  });

  cartTotal.textContent = formatPrice(total);
  cartCount.textContent = totalItems;
}


cartItemsEl.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  const id = Number(button.getAttribute("data-id"));
  const action = button.getAttribute("data-action");
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  if (action === "increase") {
    item.quantity += 1;
  }

  if (action === "decrease") {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart = cart.filter((i) => i.id !== id); // remove if quantity drops to 0
    }
  }

  if (action === "remove") {
    cart = cart.filter((i) => i.id !== id);
  }

  saveCart();
  renderCart();
});


function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.remove("hidden");
}

function closeCartPanel() {
  cartPanel.classList.remove("open");
  overlay.classList.add("hidden");
}

cartToggle.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartPanel);
overlay.addEventListener("click", closeCartPanel); // clicking the dark backdrop also closes it


checkoutBtn.addEventListener("click", function () {
  if (cart.length === 0) {
    alert("Your cart is empty. Add some products first!");
    return;
  }

  alert("Thank you for your order! Total paid: " + cartTotal.textContent);

  cart = [];
  saveCart();
  renderCart();
  closeCartPanel();
});


function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem(CART_KEY);
  cart = saved ? JSON.parse(saved) : [];
}


loadCart();
renderProducts();
renderCart();
