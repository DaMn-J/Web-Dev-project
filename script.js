
const products = [
  { id: 1,  name: "Cheesy Burger",   desc: "Juicy chicken patty with melted cheddar", price: 11.99, category: "Fast Food",  emoji: "🍔" },
  { id: 2,  name: "Spicy Chicken Wrap", desc: "Grilled chicken, spicy mayo, lettuce", price: 7.99, category: "Fast Food", emoji: "🌯" },
  { id: 3,  name: "Classic French Fries", desc: "Crispy golden fries with dip", price: 3.21, category: "Fast Food", emoji: "🍟" },
  { id: 4,  name: "Pepperoni Pizza", desc: "Cheese and pepperoni on thin crust", price: 9.5, category: "Fast Food", emoji: "🍕" },
  { id: 5,  name: "Chocolate Cake",  desc: "Soft cake with rich chocolate", price: 4.75, category: "Desserts", emoji: "🍰" },
  { id: 6,  name: "Vanilla Ice Cream", desc: "Two scoops with wafer", price: 3.5, category: "Desserts", emoji: "🍨" },
  { id: 7,  name: "Donut Box",       desc: "Box of 3 glazed donuts", price: 5.25, category: "Desserts", emoji: "🍩" },
  { id: 8,  name: "Cold Coffee",     desc: "Iced coffee with cream", price: 3.99, category: "Beverages", emoji: "🥤" },
  { id: 9,  name: "Orange Juice",    desc: "Freshly squeezed orange juice", price: 2.99, category: "Beverages", emoji: "🍊" },
  { id: 10, name: "Pancakes",        desc: "Stack of pancakes with maple syrup", price: 6.5, category: "Breakfast", emoji: "🥞" },
  { id: 11, name: "Egg Sandwich",    desc: "Toasted bread with egg and cheese", price: 4.5, category: "Breakfast", emoji: "🥪" },
  { id: 12, name: "Fruit Salad",     desc: "Seasonal fresh fruits bowl", price: 5.0, category: "Healthy", emoji: "🥗" }
];


let cart = [];                 
let selectedCategory = "All";
const SERVICE_RATE = 0.05;     


const productList = document.getElementById("productList");
const searchBox = document.getElementById("searchBox");
const noResult = document.getElementById("noResult");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const categoryButtons = document.querySelectorAll(".cat-btn");


function showProducts() {
  const searchText = searchBox.value.toLowerCase().trim();
  productList.innerHTML = "";
  let found = 0;

  products.forEach(function (item) {
    const categoryOk = selectedCategory === "All" || item.category === selectedCategory;
    const searchOk = item.name.toLowerCase().includes(searchText);

    if (categoryOk && searchOk) {
      found++;
      productList.innerHTML +=
        '<div class="card">' +
          '<div class="card-img">' + item.emoji + '</div>' +
          '<div class="card-body">' +
            '<h3>' + item.name + '</h3>' +
            '<p>' + item.desc + '</p>' +
            '<span class="price">$' + item.price.toFixed(2) + '</span>' +
          '</div>' +
          '<button class="add-btn" onclick="addToCart(' + item.id + ')">+</button>' +
        '</div>';
    }
  });

  noResult.style.display = found === 0 ? "block" : "none";
}


function addToCart(id) {
  const existing = cart.find(function (c) { return c.id === id; });
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: id, qty: 1 });
  }
  showCart();
}

function changeQty(id, change) {
  const item = cart.find(function (c) { return c.id === id; });
  item.qty += change;
  if (item.qty <= 0) {
    removeItem(id);
  } else {
    showCart();
  }
}

function removeItem(id) {
  cart = cart.filter(function (c) { return c.id !== id; });
  showCart();
}

function showCart() {
  cartItems.innerHTML = "";
  let subtotal = 0;
  let totalQty = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
  }

  cart.forEach(function (c) {
    const product = products.find(function (p) { return p.id === c.id; });
    const lineTotal = product.price * c.qty;
    subtotal += lineTotal;
    totalQty += c.qty;

    cartItems.innerHTML +=
      '<div class="cart-item">' +
        '<div class="item-img">' + product.emoji + '</div>' +
        '<div class="item-info"><strong>' + product.name + '</strong><br>' +
          '<small>$' + product.price.toFixed(2) + ' each</small></div>' +
        '<div class="qty">' +
          '<button onclick="changeQty(' + c.id + ', -1)">-</button>' +
          '<span>' + c.qty + '</span>' +
          '<button onclick="changeQty(' + c.id + ', 1)">+</button>' +
        '</div>' +
        '<div class="item-total">$' + lineTotal.toFixed(2) + '</div>' +
        '<button class="del-btn" onclick="removeItem(' + c.id + ')">🗑️</button>' +
      '</div>';
  });

  const service = subtotal * SERVICE_RATE;
  document.getElementById("subtotal").textContent = "$" + subtotal.toFixed(2);
  document.getElementById("service").textContent = "$" + service.toFixed(2);
  document.getElementById("total").textContent = "$" + (subtotal + service).toFixed(2);
  cartCount.textContent = totalQty;
}


searchBox.addEventListener("input", showProducts);

categoryButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    categoryButtons.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    selectedCategory = btn.dataset.cat;
    showProducts();
  });
});

document.getElementById("openCart").addEventListener("click", function () {
  cartPanel.classList.add("open");
});

document.getElementById("closeCart").addEventListener("click", function () {
  cartPanel.classList.remove("open");
});

document.getElementById("checkoutBtn").addEventListener("click", function () {
  if (cart.length === 0) {
    alert("Your cart is empty. Please add some items first.");
    return;
  }
  alert("Thank you for your order! Your total is " + document.getElementById("total").textContent);
  cart = [];
  showCart();
  cartPanel.classList.remove("open");
});


showProducts();
showCart();
