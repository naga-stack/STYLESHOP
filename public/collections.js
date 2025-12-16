// Collections Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Swiper
    initializeSwiper();
    
    // Initialize Quick View
    initializeQuickView();
    
    // Newsletter Form
    initializeNewsletter();
    
    // Add to cart from collections
    initializeAddToCart();
    
    // Animate elements on scroll
    initializeAnimations();
    
    // Update cart count
    updateCartCount();
});


// Initialize Swiper Carousel
function initializeSwiper() {
    const swiper = new Swiper('.arrivals-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
            1280: {
                slidesPerView: 4,
            },
        },
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });
}

// Quick View Modal
function initializeQuickView() {
    const modal = document.getElementById('quickViewModal');
    const closeBtn = document.querySelector('.close-modal');
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    
    // Sample product data (you can expand this)
    const products = {
        1: {
            name: "Urban Jacket",
            price: 129.99,
            description: "Water-resistant urban style jacket with premium finish.",
            images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
            features: ["Water-resistant", "Premium fabric", "Urban design", "Comfortable fit"],
            sizes: ["S", "M", "L", "XL"],
            colors: ["Black", "Navy", "Gray"]
        },
        2: {
            name: "Designer Dress",
            price: 199.99,
            description: "Elegant evening wear dress perfect for special occasions.",
            images: ["https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
            features: ["100% Silk", "Elegant design", "Comfortable fit", "Hand wash only"],
            sizes: ["XS", "S", "M", "L"],
            colors: ["Red", "Black", "Navy"]
        }
    };
    
    // Open modal
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.product;
            openQuickView(productId, products[productId]);
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', closeQuickView);
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeQuickView();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeQuickView();
        }
    });
}

function openQuickView(productId, product) {
    if (!product) return;
    
    const modal = document.getElementById('quickViewModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="product-modal">
            <div class="modal-images">
                <div class="main-image">
                    <img src="${product.images[0]}" alt="${product.name}">
                </div>
            </div>
            
            <div class="modal-details">
                <h2 class="modal-product-name">${product.name}</h2>
                
                <div class="modal-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                </div>
                
                <p class="modal-description">${product.description}</p>
                
                <div class="modal-features">
                    <h3>Features:</h3>
                    <ul>
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="modal-options">
                    <div class="size-options">
                        <h3>Size:</h3>
                        <div class="size-buttons">
                            ${product.sizes.map(size => `
                                <button class="size-btn" data-size="${size}">${size}</button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="color-options">
                        <h3>Color:</h3>
                        <div class="color-buttons">
                            ${product.colors.map(color => `
                                <button class="color-btn" data-color="${color}" style="background-color: ${getColorHex(color)}">
                                    <span class="color-name">${color}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <div class="quantity-selector">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="1" min="1" max="10">
                        <button class="qty-btn plus">+</button>
                    </div>
                    
                    <button class="modal-add-to-cart" data-product="${productId}">
                        <i class="fas fa-shopping-bag"></i>
                        Add to Cart - $${product.price.toFixed(2)}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Initialize modal functionality
    initializeModalFunctionality(productId, product);
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function getColorHex(color) {
    const colorMap = {
        'Black': '#000000',
        'White': '#ffffff',
        'Gray': '#808080',
        'Navy': '#000080',
        'Red': '#ff0000',
        'Blue': '#0000ff'
    };
    return colorMap[color] || '#8b5cf6';
}

function initializeModalFunctionality(productId, product) {
    // Size selection
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            sizeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Color selection
    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            colorBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Quantity selector
    const minusBtn = document.querySelector('.minus');
    const plusBtn = document.querySelector('.plus');
    const qtyInput = document.querySelector('.qty-input');
    
    minusBtn.addEventListener('click', () => {
        let value = parseInt(qtyInput.value);
        if (value > 1) {
            qtyInput.value = value - 1;
            updateModalPrice(product.price * (value - 1));
        }
    });
    
    plusBtn.addEventListener('click', () => {
        let value = parseInt(qtyInput.value);
        if (value < 10) {
            qtyInput.value = value + 1;
            updateModalPrice(product.price * (value + 1));
        }
    });
    
    qtyInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (value < 1) this.value = 1;
        if (value > 10) this.value = 10;
        updateModalPrice(product.price * parseInt(this.value));
    });
    
    // Add to cart from modal
    const modalAddToCart = document.querySelector('.modal-add-to-cart');
    modalAddToCart.addEventListener('click', function() {
        const quantity = parseInt(qtyInput.value);
        const selectedSize = document.querySelector('.size-btn.active')?.dataset.size;
        const selectedColor = document.querySelector('.color-btn.active')?.dataset.color;
        
        if (!selectedSize || !selectedColor) {
            alert('Please select size and color');
            return;
        }
        
        addToCart(productId, quantity, selectedSize, selectedColor, product);
        closeQuickView();
    });
}

function updateModalPrice(price) {
    const addToCartBtn = document.querySelector('.modal-add-to-cart');
    addToCartBtn.innerHTML = `<i class="fas fa-shopping-bag"></i> Add to Cart - $${price.toFixed(2)}`;
}

// Add to cart functionality
function initializeAddToCart() {
    const addToCartBtns = document.querySelectorAll('.modal-add-to-cart');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.product;
            // Button feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.style.background = '#10b981';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = '';
            }, 2000);
        });
    });
}

function addToCart(productId, quantity = 1, size = null, color = null, product = null) {
    if (!product) return;
    
    // Get current cart from localStorage or initialize
    let cart = JSON.parse(localStorage.getItem('styleshop_cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => 
        item.id === productId && 
        item.size === size && 
        item.color === color
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: quantity,
            size: size,
            color: color,
            image: product.images[0],
            category: 'new-arrival'
        });
    }
    
    // Save to localStorage
    localStorage.setItem('styleshop_cart', JSON.stringify(cart));
    
    // Update cart count in UI
    updateCartCount();
    
    // Show notification
    showCartNotification(`${product.name} added to cart!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('styleshop_cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart count in navigation
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(element => {
        element.textContent = totalItems;
    });
}

function showCartNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .cart-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(45deg, #8b5cf6, #10b981);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s forwards;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

// Newsletter Form
function initializeNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('.email-input');
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                // Simulate subscription
                const submitBtn = this.querySelector('.subscribe-btn');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                submitBtn.style.background = '#10b981';
                submitBtn.disabled = true;
                
                // Save to localStorage (or send to server in real app)
                let subscribers = JSON.parse(localStorage.getItem('styleshop_subscribers')) || [];
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('styleshop_subscribers', JSON.stringify(subscribers));
                }
                
                // Reset form
                emailInput.value = '';
                
                // Show success message
                showNewsletterSuccess();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                alert('Please enter a valid email address');
            }
        });
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNewsletterSuccess() {
    // Create success message
    const successMsg = document.createElement('div');
    successMsg.className = 'newsletter-success';
    successMsg.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Thank you for subscribing! Check your email for exclusive offers.</span>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .newsletter-success {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #10b981, #059669);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideUp 0.3s ease, slideDown 0.3s ease 2.7s forwards;
            max-width: 90%;
            text-align: center;
        }
        
        @keyframes slideUp {
            from {
                transform: translateX(-50%) translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideDown {
            to {
                transform: translateX(-50%) translateY(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(successMsg);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successMsg.remove();
        style.remove();
    }, 3000);
}

// Scroll Animations
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.collection-card, .category-card, .seasonal-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Initialize cart count on page load
updateCartCount();
// Collections Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Swiper
    initializeSwiper();
    
    // Initialize Quick View
    initializeQuickView();
    
    // Newsletter Form
    initializeNewsletter();
    
    // Add to cart from collections
    initializeAddToCart();
    
    // Animate elements on scroll
    initializeAnimations();
    
    // Update cart count
    updateCartCount();
});

// Initialize Swiper Carousel
function initializeSwiper() {
    const swiper = new Swiper('.arrivals-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
            1280: {
                slidesPerView: 4,
            },
        },
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });
}

// Quick View Modal
function initializeQuickView() {
    const modal = document.getElementById('quickViewModal');
    const closeBtn = document.querySelector('.close-modal');
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    
    // Sample product data (you can expand this)
    const products = {
        1: {
            name: "Urban Jacket",
            price: 129.99,
            description: "Water-resistant urban style jacket with premium finish.",
            images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
            features: ["Water-resistant", "Premium fabric", "Urban design", "Comfortable fit"],
            sizes: ["S", "M", "L", "XL"],
            colors: ["Black", "Navy", "Gray"]
        },
        2: {
            name: "Designer Dress",
            price: 199.99,
            description: "Elegant evening wear dress perfect for special occasions.",
            images: ["https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
            features: ["100% Silk", "Elegant design", "Comfortable fit", "Hand wash only"],
            sizes: ["XS", "S", "M", "L"],
            colors: ["Red", "Black", "Navy"]
        }
    };
    
    // Open modal
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.product;
            openQuickView(productId, products[productId]);
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', closeQuickView);
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeQuickView();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeQuickView();
        }
    });
}

function openQuickView(productId, product) {
    if (!product) return;
    
    const modal = document.getElementById('quickViewModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="product-modal">
            <div class="modal-images">
                <div class="main-image">
                    <img src="${product.images[0]}" alt="${product.name}">
                </div>
            </div>
            
            <div class="modal-details">
                <h2 class="modal-product-name">${product.name}</h2>
                
                <div class="modal-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                </div>
                
                <p class="modal-description">${product.description}</p>
                
                <div class="modal-features">
                    <h3>Features:</h3>
                    <ul>
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="modal-options">
                    <div class="size-options">
                        <h3>Size:</h3>
                        <div class="size-buttons">
                            ${product.sizes.map(size => `
                                <button class="size-btn" data-size="${size}">${size}</button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="color-options">
                        <h3>Color:</h3>
                        <div class="color-buttons">
                            ${product.colors.map(color => `
                                <button class="color-btn" data-color="${color}" style="background-color: ${getColorHex(color)}">
                                    <span class="color-name">${color}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <div class="quantity-selector">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="1" min="1" max="10">
                        <button class="qty-btn plus">+</button>
                    </div>
                    
                    <button class="modal-add-to-cart" data-product="${productId}">
                        <i class="fas fa-shopping-bag"></i>
                        Add to Cart - $${product.price.toFixed(2)}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Initialize modal functionality
    initializeModalFunctionality(productId, product);
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function getColorHex(color) {
    const colorMap = {
        'Black': '#000000',
        'White': '#ffffff',
        'Gray': '#808080',
        'Navy': '#000080',
        'Red': '#ff0000',
        'Blue': '#0000ff'
    };
    return colorMap[color] || '#8b5cf6';
}

function initializeModalFunctionality(productId, product) {
    // Size selection
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            sizeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Color selection
    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            colorBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Quantity selector
    const minusBtn = document.querySelector('.minus');
    const plusBtn = document.querySelector('.plus');
    const qtyInput = document.querySelector('.qty-input');
    
    minusBtn.addEventListener('click', () => {
        let value = parseInt(qtyInput.value);
        if (value > 1) {
            qtyInput.value = value - 1;
            updateModalPrice(product.price * (value - 1));
        }
    });
    
    plusBtn.addEventListener('click', () => {
        let value = parseInt(qtyInput.value);
        if (value < 10) {
            qtyInput.value = value + 1;
            updateModalPrice(product.price * (value + 1));
        }
    });
    
    qtyInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (value < 1) this.value = 1;
        if (value > 10) this.value = 10;
        updateModalPrice(product.price * parseInt(this.value));
    });
    
    // Add to cart from modal
    const modalAddToCart = document.querySelector('.modal-add-to-cart');
    modalAddToCart.addEventListener('click', function() {
        const quantity = parseInt(qtyInput.value);
        const selectedSize = document.querySelector('.size-btn.active')?.dataset.size;
        const selectedColor = document.querySelector('.color-btn.active')?.dataset.color;
        
        if (!selectedSize || !selectedColor) {
            alert('Please select size and color');
            return;
        }
        
        addToCart(productId, quantity, selectedSize, selectedColor, product);
        closeQuickView();
    });
}

function updateModalPrice(price) {
    const addToCartBtn = document.querySelector('.modal-add-to-cart');
    addToCartBtn.innerHTML = `<i class="fas fa-shopping-bag"></i> Add to Cart - $${price.toFixed(2)}`;
}

// Add to cart functionality
function initializeAddToCart() {
    const addToCartBtns = document.querySelectorAll('.modal-add-to-cart');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.product;
            // Button feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.style.background = '#10b981';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = '';
            }, 2000);
        });
    });
}

function addToCart(productId, quantity = 1, size = null, color = null, product = null) {
    if (!product) return;
    
    // Get current cart from localStorage or initialize
    let cart = JSON.parse(localStorage.getItem('styleshop_cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => 
        item.id === productId && 
        item.size === size && 
        item.color === color
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: quantity,
            size: size,
            color: color,
            image: product.images[0],
            category: 'new-arrival'
        });
    }
    
    // Save to localStorage
    localStorage.setItem('styleshop_cart', JSON.stringify(cart));
    
    // Update cart count in UI
    updateCartCount();
    
    // Show notification
    showCartNotification(`${product.name} added to cart!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('styleshop_cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart count in navigation
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(element => {
        element.textContent = totalItems;
    });
}

function showCartNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .cart-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(45deg, #8b5cf6, #10b981);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s forwards;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

// Newsletter Form
function initializeNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('.email-input');
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                // Simulate subscription
                const submitBtn = this.querySelector('.subscribe-btn');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                submitBtn.style.background = '#10b981';
                submitBtn.disabled = true;
                
                // Save to localStorage (or send to server in real app)
                let subscribers = JSON.parse(localStorage.getItem('styleshop_subscribers')) || [];
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('styleshop_subscribers', JSON.stringify(subscribers));
                }
                
                // Reset form
                emailInput.value = '';
                
                // Show success message
                showNewsletterSuccess();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                alert('Please enter a valid email address');
            }
        });
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNewsletterSuccess() {
    // Create success message
    const successMsg = document.createElement('div');
    successMsg.className = 'newsletter-success';
    successMsg.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Thank you for subscribing! Check your email for exclusive offers.</span>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .newsletter-success {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #10b981, #059669);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideUp 0.3s ease, slideDown 0.3s ease 2.7s forwards;
            max-width: 90%;
            text-align: center;
        }
        
        @keyframes slideUp {
            from {
                transform: translateX(-50%) translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideDown {
            to {
                transform: translateX(-50%) translateY(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(successMsg);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successMsg.remove();
        style.remove();
    }, 3000);
}

// Scroll Animations
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.collection-card, .category-card, .seasonal-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Initialize cart count on page load
updateCartCount();
