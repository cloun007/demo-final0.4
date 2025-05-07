// Menu and ordering system for the customer panel

// Sample menu data until backend integration is complete
const menuData = {
    starters: [
        { id: 's1', name: 'Garlic Bread', price: 4.99, image: 'https://images.unsplash.com/photo-1619535860434-ba0aa598f49b?w=500', category: 'starters' },
        { id: 's2', name: 'Bruschetta', price: 6.99, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=500', category: 'starters' },
        { id: 's3', name: 'Mozzarella Sticks', price: 5.99, image: 'https://images.unsplash.com/photo-1548340748-6d98de4a31b0?w=500', category: 'starters' },
        { id: 's4', name: 'Caesar Salad', price: 7.99, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500', category: 'starters' }
    ],
    mainCourse: [
        { id: 'm1', name: 'Margherita Pizza', price: 12.99, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500', category: 'mainCourse' },
        { id: 'm2', name: 'Beef Tenderloin', price: 24.99, image: 'https://images.unsplash.com/photo-1546241072-48010ad2862c?w=500', category: 'mainCourse' },
        { id: 'm3', name: 'Chicken Alfredo', price: 15.99, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500', category: 'mainCourse' },
        { id: 'm4', name: 'Vegetable Curry', price: 13.99, image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d1c?w=500', category: 'mainCourse' },
        { id: 'm5', name: 'Beef Burger', price: 11.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', category: 'mainCourse' },
        { id: 'm6', name: 'Grilled Salmon', price: 18.99, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500', category: 'mainCourse' }
    ],
    desserts: [
        { id: 'd1', name: 'Tiramisu', price: 6.99, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500', category: 'desserts' },
        { id: 'd2', name: 'Chocolate Cake', price: 5.99, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500', category: 'desserts' },
        { id: 'd3', name: 'Cheesecake', price: 6.99, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500', category: 'desserts' },
        { id: 'd4', name: 'Ice Cream', price: 4.99, image: 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=500', category: 'desserts' }
    ],
    drinks: [
        { id: 'dr1', name: 'Soda', price: 2.99, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500', category: 'drinks' },
        { id: 'dr2', name: 'Iced Tea', price: 2.99, image: 'https://images.unsplash.com/photo-1556679343-c1c4b8b4a28b?w=500', category: 'drinks' },
        { id: 'dr3', name: 'Coffee', price: 3.99, image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=500', category: 'drinks' },
        { id: 'dr4', name: 'Fresh Juice', price: 4.99, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500', category: 'drinks' }
    ]
};

// DOM elements
const menuContainer = document.getElementById('menu-items');
const cartContainer = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const searchInput = document.getElementById('search-input');
const categoryTabs = document.querySelectorAll('.tab-btn');
const tableSelect = document.getElementById('table-select');
const placeOrderBtn = document.getElementById('place-order-btn');
const customerNameInput = document.getElementById('customer-name');
const customerPhoneInput = document.getElementById('customer-phone');
const mobileCartToggle = document.getElementById('mobile-cart-toggle');
const cartSection = document.querySelector('.cart-section');
const cartOverlay = document.getElementById('cart-overlay');
const cartClose = document.getElementById('cart-close');
const cartItemCount = document.querySelector('.cart-item-count');

// API URL - update this with your backend URL
const API_URL = 'http://localhost:5000/api';

// Shopping cart
let cart = [];

// Initialize the application
function init() {
    // Check for table parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const tableParam = urlParams.get('table');
    
    // Set the selected table if parameter exists
    if (tableParam && tableSelect.querySelector(`option[value="${tableParam}"]`)) {
        tableSelect.value = tableParam;
    }
    
    // Fetch menu items from backend API
    fetchMenuItems();
    
    // Event listeners
    searchInput.addEventListener('input', handleSearch);
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            // Display items of the selected category
            const category = tab.getAttribute('data-category');
            displayMenuItems(category);
        });
    });
    
    // Add event listeners for customer information fields
    customerNameInput.addEventListener('input', validateOrderForm);
    customerPhoneInput.addEventListener('input', validateOrderForm);
    
    // Mobile cart toggle functionality
    mobileCartToggle.addEventListener('click', openMobileCart);
    cartClose.addEventListener('click', closeMobileCart);
    cartOverlay.addEventListener('click', closeMobileCart);
    
    placeOrderBtn.addEventListener('click', placeOrder);
}

// Fetch menu items from backend
function fetchMenuItems() {
    // Show loading state
    menuContainer.innerHTML = `
        <div style="text-align: center; grid-column: 1/-1; padding: 2rem;">
            <i class="fas fa-spinner fa-pulse" style="font-size: 2rem; color: #4CAF50;"></i>
            <p style="margin-top: 1rem; color: #777;">Loading menu items...</p>
        </div>
    `;
    
    fetch(`${API_URL}/menu`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to fetch menu items');
          }
          return response.json();
      })
      .then(data => {
          if (data.data) {
              // Replace local menu data with data from API
              menuData.starters = data.data.starters || [];
              menuData.mainCourse = data.data.mainCourse || [];
              menuData.desserts = data.data.desserts || [];
              menuData.drinks = data.data.drinks || [];
              
              // Add id field if not present
              Object.keys(menuData).forEach(category => {
                  menuData[category].forEach((item, index) => {
                      if (!item.id) {
                          item.id = `${category.charAt(0)}${index + 1}`;
                      }
                  });
              });
              
              // Display all menu items
              displayMenuItems('all');
          } else {
              throw new Error('Invalid data format');
          }
      })
      .catch(error => {
          console.error('Error fetching menu:', error);
          // Fallback to local data
          displayMenuItems('all');
          
          // Show error message
          const errorToast = document.createElement('div');
          errorToast.className = 'error-toast';
          errorToast.innerHTML = `
              <i class="fas fa-exclamation-circle"></i>
              <p>Failed to load menu from server. Using local data.</p>
              <button class="close-toast"><i class="fas fa-times"></i></button>
          `;
          document.body.appendChild(errorToast);
          
          // Remove toast after 5 seconds
          setTimeout(() => {
              errorToast.classList.add('hide');
              setTimeout(() => errorToast.remove(), 500);
          }, 5000);
          
          // Close toast on click
          errorToast.querySelector('.close-toast').addEventListener('click', () => {
              errorToast.classList.add('hide');
              setTimeout(() => errorToast.remove(), 500);
          });
      });
}

// Open mobile cart
function openMobileCart() {
    cartSection.classList.add('show');
    cartOverlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close mobile cart
function closeMobileCart() {
    cartSection.classList.remove('show');
    cartOverlay.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
}

// Display menu items based on category
function displayMenuItems(category) {
    menuContainer.innerHTML = '';
    
    let itemsToDisplay = [];
    
    if (category === 'all') {
        // Combine all categories
        Object.values(menuData).forEach(items => {
            itemsToDisplay = [...itemsToDisplay, ...items];
        });
    } else {
        // Display specific category
        itemsToDisplay = menuData[category] || [];
    }
    
    // Check if any items match the search term
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        itemsToDisplay = itemsToDisplay.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        );
    }
    
    // Create and append menu items
    itemsToDisplay.forEach(item => {
        const menuItem = createMenuItemElement(item);
        menuContainer.appendChild(menuItem);
    });
    
    // Show message if no items found
    if (itemsToDisplay.length === 0) {
        menuContainer.innerHTML = `
            <div style="text-align: center; grid-column: 1/-1; padding: 2rem;">
                <i class="fas fa-search" style="font-size: 2rem; color: #ddd;"></i>
                <p style="margin-top: 1rem; color: #777;">No menu items found</p>
            </div>
        `;
    }
}

// Create a menu item element
function createMenuItemElement(item) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="menu-item-content">
            <h3>${item.name}</h3>
            <div class="price">$${item.price.toFixed(2)}</div>
            ${item.description ? `<p class="description">${item.description}</p>` : ''}
        </div>
    `;
    
    // Add click event to add item to cart
    menuItem.addEventListener('click', () => {
        addToCart(item);
    });
    
    return menuItem;
}

// Handle search functionality
function handleSearch() {
    // Get the active category
    const activeTab = document.querySelector('.tab-btn.active');
    const category = activeTab.getAttribute('data-category');
    
    // Update menu items based on the current category and search term
    displayMenuItems(category);
}

// Add item to cart
function addToCart(item) {
    // Check if item already exists in cart
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        // Increase quantity if item already in cart
        existingItem.quantity += 1;
    } else {
        // Add new item to cart
        cart.push({ ...item, quantity: 1 });
    }
    
    // Update cart UI
    updateCart();
}

// Update cart UI
function updateCart() {
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartItemCount.textContent = '0';
        placeOrderBtn.disabled = true;
    } else {
        // Create cart items
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Add event listeners to quantity buttons
            cartItem.querySelector('.minus').addEventListener('click', () => {
                updateQuantity(item.id, 'decrease');
            });
            
            cartItem.querySelector('.plus').addEventListener('click', () => {
                updateQuantity(item.id, 'increase');
            });
            
            cartItem.querySelector('.remove-btn').addEventListener('click', () => {
                removeFromCart(item.id);
            });
            
            cartContainer.appendChild(cartItem);
        });
        
        // Update cart item count
        cartItemCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Enable place order button if form is valid
        validateOrderForm();
    }
    
    // Update summary
    updateSummary();
}

// Update item quantity in cart
function updateQuantity(id, action) {
    const item = cart.find(item => item.id === id);
    
    if (item) {
        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease') {
            item.quantity -= 1;
            
            // Remove item if quantity is 0
            if (item.quantity <= 0) {
                removeFromCart(id);
                return;
            }
        }
        
        // Update cart UI
        updateCart();
    }
}

// Remove item from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Update order summary
function updateSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Validate order form
function validateOrderForm() {
    const tableNumber = tableSelect.value;
    const customerName = customerNameInput.value.trim();
    const customerPhone = customerPhoneInput.value.trim();
    
    // Enable the button if all required fields are filled and cart is not empty
    if (tableNumber && customerName && customerPhone && cart.length > 0) {
        placeOrderBtn.disabled = false;
    } else {
        placeOrderBtn.disabled = true;
    }
    
    // Visual validation feedback for inputs
    if (customerName) {
        customerNameInput.classList.remove('invalid');
    } else {
        customerNameInput.classList.add('invalid');
    }
    
    if (customerPhone) {
        customerPhoneInput.classList.remove('invalid');
    } else {
        customerPhoneInput.classList.add('invalid');
    }
}

// Place order
function placeOrder() {
    const tableNumber = tableSelect.value;
    const customerName = customerNameInput.value.trim();
    const customerPhone = customerPhoneInput.value.trim();
    
    // Create order object
    const order = {
        tableNumber: parseInt(tableNumber),
        customerName,
        customerPhone,
        items: cart.map(item => ({
            menuItem: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        subtotal: parseFloat(subtotalElement.textContent.replace('$', '')),
        tax: parseFloat(taxElement.textContent.replace('$', '')),
        total: parseFloat(totalElement.textContent.replace('$', ''))
    };
    
    // Show loading state
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Send order to backend API
    fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to place order');
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        const successToast = document.createElement('div');
        successToast.className = 'success-toast';
        successToast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div>
                <p>Order placed successfully!</p>
                <p>Order Number: ${data.orderId || 'N/A'}</p>
            </div>
            <button class="close-toast"><i class="fas fa-times"></i></button>
        `;
        document.body.appendChild(successToast);
        
        // Clear cart and reset form
        cart = [];
        updateCart();
        customerNameInput.value = '';
        customerPhoneInput.value = '';
        
        // Reset button
        placeOrderBtn.innerHTML = 'Place Order';
        
        // Remove toast after 5 seconds
        setTimeout(() => {
            successToast.classList.add('hide');
            setTimeout(() => successToast.remove(), 500);
        }, 5000);
        
        // Close toast on click
        successToast.querySelector('.close-toast').addEventListener('click', () => {
            successToast.classList.add('hide');
            setTimeout(() => successToast.remove(), 500);
        });
    })
    .catch(error => {
        console.error('Error placing order:', error);
        
        // Show error message
        const errorToast = document.createElement('div');
        errorToast.className = 'error-toast';
        errorToast.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>Failed to place order. Please try again.</p>
            <button class="close-toast"><i class="fas fa-times"></i></button>
        `;
        document.body.appendChild(errorToast);
        
        // Reset button
        placeOrderBtn.innerHTML = 'Place Order';
        placeOrderBtn.disabled = false;
        
        // Remove toast after 5 seconds
        setTimeout(() => {
            errorToast.classList.add('hide');
            setTimeout(() => errorToast.remove(), 500);
        }, 5000);
        
        // Close toast on click
        errorToast.querySelector('.close-toast').addEventListener('click', () => {
            errorToast.classList.add('hide');
            setTimeout(() => errorToast.remove(), 500);
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init); 