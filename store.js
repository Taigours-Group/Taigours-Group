function fetchProductData() {
  fetch('./json files/store.json') // Ensure this path is correct
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      products = data.products;
      createProductCards(products);
      displayGamingProducts(); // Display gaming products after fetching data
      displayFashionProducts(); // Display fashion products after fetching data
      displayArtCraftProducts(); // Display Art & Craft products after fetching data
      displayAccessoriesProducts(); // Display Accessories products after fetching data
      displayDecorationProducts(); // Display Decoration products after fetching data
    })
    .catch(error => console.error('Error fetching product data:', error));
}

// Shopping cart
let cart = [];

// Function to create product cards
function createProductCards(productsToShow = products, container = document.getElementById('products-container')) {
  if (!container) return;

  // Clear container first
  container.innerHTML = '';

  productsToShow.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image" style="background-image: url('${product.image}')">
        <div class="product-category">${product.category}</div>
      </div>
      <div class="product-details">
        <h3 class="product-title">${product.title}</h3>
        <div class="product-price">NRP. ${product.price.toFixed(2)}</div>
        <div class="product-rating">
          <div class="stars">
            ${generateStars(product.rating)}
          </div>
          <div class="count">(${product.reviews})</div>
        </div>
        <div class="product-colors">
          ${product.colours.map(color => `<span class="color-option color-display" style="background-color: ${color};" data-color="${color}"></span>`).join('')}
        </div>
        <button class="add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
        <button class="details-btn" data-id="${product.id}"><i class="fa-regular fa-clipboard"></i> Details</button>
        <button class="share-btn" data-id="${product.id}" data-title="${product.title}" data-image="${product.image}" data-price="${product.price}"><i class="fa-solid fa-share-nodes"></i> Share</button>
      </div>
    `;
    container.appendChild(card);
  });

  // Add event listeners for color selection
  document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', function() {
      const colorOptions = this.parentElement.querySelectorAll('.color-option');
      colorOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
    });
  });

  // Add event listeners for details button
  document.querySelectorAll('.details-btn').forEach(button => {
    button.addEventListener('click', function() {
      const productId = parseInt(this.getAttribute('data-id'));
      window.location.href = `product-detail.html?id=${productId}`;
    });
  });

  // Add event listeners for share button
  document.querySelectorAll('.share-btn').forEach(button => {
    button.addEventListener('click', function() {
      const title = this.getAttribute('data-title');
      const image = this.getAttribute('data-image');
      const price = this.getAttribute('data-price');
      const url = `${window.location.origin}/Taigours-Group/product-detail.html?id=${this.getAttribute('data-id')}`;

      const shareText = `Check out this product: ${title} for NRP. ${price}`;
      const thumbnailHtml = `
        <div>
          <img src="${image}" alt="${title}" style="width: 100px; height: auto; display: block; margin-bottom: 10px;">
          <strong>${title}</strong><br>
          <small>Price: NRP. ${price}</small>
        </div>
      `;

      if (navigator.share) {
        navigator.share({
          title: title,
          text: shareText,
          url: url,
        }).catch(error => console.error('Error sharing:', error));
      } else {
        navigator.clipboard.writeText(`${thumbnailHtml}\n${url}`).then(() => {
          alert("Product link copied to clipboard!");
        }).catch(error => {
          alert("Error copying link: " + error);
        });
      }
    });
  });
}

// Function to generate star ratings
function generateStars(rating) {
  let stars = '';
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }

  if (halfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }

  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }

  return stars;
}

// Function to filter products
function filterProducts() {
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');

  if (!categoryFilter || !sortFilter) return;

  // Apply category filter
  let filteredProducts = [...products];
  if (categoryFilter.value !== 'All') {
    filteredProducts = filteredProducts.filter(product => product.category === categoryFilter.value);
  }

  // Apply sorting
  switch (sortFilter.value) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      filteredProducts.sort((a, b) => b.id - a.id);
      break;
    default: // featured - no specific sort
      break;
  }

  createProductCards(filteredProducts);
}

// Function to filter products by section
function filterBySection(section) {
  const filteredProducts = products.filter(product => product.section === section);
  createProductCards(filteredProducts);
}

// Function to initialize section filters
function initSectionFilters() {
  const gamingBtn = document.getElementById('gamingSection');
  const fashionBtn = document.getElementById('fashionSection');
  const decorationBtn = document.getElementById('decorationSection');
  const appliancesBtn = document.getElementById('appliancesSection');

  if (gamingBtn) {
    gamingBtn.addEventListener('click', () => filterBySection('Gaming'));
  }
  if (fashionBtn) {
    fashionBtn.addEventListener('click', () => filterBySection('Fashion'));
  }
  if (decorationBtn) {
    decorationBtn.addEventListener('click', () => filterBySection('Decoration'));
  }
  if (appliancesBtn) {
    appliancesBtn.addEventListener('click', () => filterBySection('Appliances'));
  }
}

// Function to initialize filters
function initFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');

  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterProducts);
  }

  if (sortFilter) {
    sortFilter.addEventListener('change', filterProducts);
  }
}

// Function to handle adding products to cart
function initAddToCart() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
      const productId = parseInt(e.target.getAttribute('data-id'));
      const product = products.find(p => p.id === productId);
      const selectedColorElement = e.target.parentElement.querySelector('.color-option.selected');
      const selectedColor = selectedColorElement ? selectedColorElement.getAttribute('data-color') : null;

      if (product) {
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === productId && item.color === selectedColor);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({
            ...product,
            quantity: 1,
            color: selectedColor,
            colours: product.colours // Add available colors to cart item
          });
        }

        updateCartDisplay();

        // Show confirmation
        e.target.textContent = 'Added!';
        setTimeout(() => {
          e.target.textContent = 'Add to Cart';
        }, 2000);
      }
    }
  });
}

// Function to update cart display
function updateCartDisplay() {
  const cartCount = document.querySelector('.cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total-amount');

  if (!cartCount || !cartItems || !cartTotal) return;

  // Update count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update items display
  if (totalItems === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Your cart is empty</p>
      </div>
    `;
  } else {
    cartItems.innerHTML = '';
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-color">
            ${item.color ? `Color: <span class="color-display" style="background-color: ${item.color}; display: inline-block; width: 20px; height: 20px; border-radius: 5px; margin-left: 5px;"></span>` : ''}
            ${item.colours ? `
              <select class="color-select" data-id="${item.id}">
                ${item.colours.map(color => `<option value="${color}" ${color === item.color ? 'selected' : ''}>${color}</option>`).join('')}
              </select>` : ''}
          </div>
          <div class="cart-item-price">NRP${item.price.toFixed(2)}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn decrease" data-id="${item.id}" d>-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn increase" data-id="${item.id}" >+</button>
          </div><br>
          <button class="cart-item-remove" data-id="${item.id}">
            <i class="fas fa-trash-alt"></i> Remove
          </button>
      `;
      cartItems.appendChild(cartItem);
    });
  }

  // Update total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = `NRP${total.toFixed(2)}`;

  // Add event listeners for color selection in cart
  document.querySelectorAll('.color-select').forEach(select => {
    select.addEventListener('change', function() {
      const productId = parseInt(this.getAttribute('data-id'));
      const newColor = this.value;
      const item = cart.find(item => item.id === productId);
      if (item) {
        item.color = newColor;
        updateCartDisplay();
      }
    });
  });
}

// Function to handle cart functionality
function initCartFunctionality() {
  const cartToggle = document.getElementById('cartToggle');
  const cartSidebar = document.getElementById('cart-sidebar');
  const closeCart = document.getElementById('closeCart');

  if (cartToggle && cartSidebar && closeCart) {
    // Toggle cart
    cartToggle.addEventListener('click', function(e) {
      e.preventDefault();
      cartSidebar.classList.add('open');
      // Prevent background scrolling when cart is open
      document.body.style.overflow = 'hidden';
    });

    // Close cart
    closeCart.addEventListener('click', function() {
      cartSidebar.classList.remove('open');
      // Restore scrolling when cart is closed
      document.body.style.overflow = '';
    });

    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
      if (cartSidebar.classList.contains('open') && 
          !cartSidebar.contains(e.target) && 
          e.target !== cartToggle &&
          !cartToggle.contains(e.target)) {
        cartSidebar.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Quantity controls and remove buttons
  document.addEventListener('click', function(e) {
    // Decrease quantity
    if (e.target.classList.contains('decrease')) {
      const productId = parseInt(e.target.getAttribute('data-id'));
      const color = e.target.closest('.cart-item').querySelector('.color-select')?.value || null;
      const item = cart.find(item => item.id === productId && item.color === color);

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item && item.quantity === 1) {
        // Remove if quantity becomes 0
        cart = cart.filter(item => item.id !== productId || item.color !== color);
      }

      updateCartDisplay();
    }

    // Increase quantity
    if (e.target.classList.contains('increase')) {
      const productId = parseInt(e.target.getAttribute('data-id'));
      const color = e.target.closest('.cart-item').querySelector('.color-select')?.value || null;
      const item = cart.find(item => item.id === productId && item.color === color);

      if (item) {
        item.quantity += 1;
      }

      updateCartDisplay();
    }

    // Remove item
    if (e.target.closest('.cart-item-remove')) {
      const button = e.target.closest('.cart-item-remove');
      const productId = parseInt(button.getAttribute('data-id'));
      const color = button.closest('.cart-item').querySelector('.color-select')?.value || null;

      // Remove the item from the cart
      cart = cart.filter(item => item.id !== productId || item.color !== color);
      updateCartDisplay();
    }
  });

  // Checkout button
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      if (cart.length === 0) {
        alert('Your cart is empty. Add some products before checkout.');
        return;
      }

      // Prepare product details for WhatsApp message
      const productDetails = cart.map(item => `${item.title} (Quantity: ${item.quantity}, Color: ${item.color})`).join(', ');
      const whatsappLink = `https://wa.me/9746838422?text=${encodeURIComponent(productDetails)}`;

      // Redirect to WhatsApp
      window.open(whatsappLink, '_blank');
    });
  }
}

// Connect "Send Message" button in the store contact form
  const storeContactForm = document.getElementById('storeContactForm');
  if (storeContactForm) {
    storeContactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Collect form data
      const formData = {
        name: this.querySelector('input[placeholder="Your Name"]').value,
        email: this.querySelector('input[placeholder="Your Email"]').value,
        inquiryType: this.querySelector('select').value,
        orderNumber: this.querySelector('input[placeholder="Order Number (if applicable)"]').value,
        message: this.querySelector('textarea[placeholder="Your Message"]').value
      };

      // Format the message for WhatsApp
      const whatsappMessage = `Name: ${formData.name}\nEmail: ${formData.email}\nInquiry Type: ${formData.inquiryType}\nOrder Number: ${formData.orderNumber}\nMessage: ${formData.message}`;
      const whatsappNumber = '1234567890'; // Replace with the WhatsApp number
      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

      // Redirect to WhatsApp
      window.open(whatsappLink, '_blank');

      // Reset form
      this.reset();
  });
}

// Function to display gaming products
function displayGamingProducts() {
  const gamingSection = document.getElementById('gaming-products-container');
  if (!gamingSection) return;

  const gamingProducts = products.filter(product => product.category.toLowerCase() === 'gaming');
  createProductCards(gamingProducts, gamingSection);
}

// Function to display fashion products
function displayFashionProducts() {
  const fashionSection = document.getElementById('fashion-products-container');
  if (!fashionSection) return;

  const fashionProducts = products.filter(product => product.category.toLowerCase() === 'fashion');
  createProductCards(fashionProducts, fashionSection);
}

// Function to display Art & Craft products
function displayArtCraftProducts() {
  const artCraftSection = document.getElementById('art-craft-products-container');
  if (!artCraftSection) return;

  const artCraftProducts = products.filter(product => product.category.toLowerCase() === 'art & craft');
  createProductCards(artCraftProducts, artCraftSection);
}

// Function to display Accessories products
function displayAccessoriesProducts() {
  const accessoriesSection = document.getElementById('accessories-products-container');
  if (!accessoriesSection) return;

  const accessoriesProducts = products.filter(product => product.category.toLowerCase() === 'accessories');
  createProductCards(accessoriesProducts, accessoriesSection);
}

// Function to display Decoration products
function displayDecorationProducts() {
  const decorationSection = document.getElementById('decoration-products-container');
  if (!decorationSection) return;

  const decorationProducts = products.filter(product => product.category.toLowerCase() === 'decoration');
  createProductCards(decorationProducts, decorationSection);
}


// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  fetchProductData();
  initFilters();
  initAddToCart();
  initCartFunctionality();
  initStoreContactForm();
  initSectionFilters(); // Initialize section filters
  displayGamingProducts(); // Display gaming products
  displayFashionProducts(); // Display fashion products
  displayArtCraftProducts(); // Display Art & Craft products
  displayAccessoriesProducts(); // Display Accessories products
  displayDecorationProducts(); // Display Decoration products

  // Dark mode toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      const icon = this.querySelector('i');
      if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    });
  }});
