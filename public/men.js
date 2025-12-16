// Men's Collection Page JavaScript

// Product Data
const products = {
    1: {
        id: 1,
        name: "Premium Hoodie",
        category: "hoodies",
        price: 79.99,
        description: "Premium quality hoodie made from soft cotton blend. Features a modern fit with comfortable feel and durable construction. Perfect for casual wear or light outdoor activities.",
        features: [
            "100% Premium Cotton Blend",
            "Modern Slim Fit",
            "Kangaroo Pocket",
            "Adjustable Drawstrings",
            "Machine Washable"
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Navy", "Gray", "Olive"],
        rating: 4.5,
        reviews: 128,
        images: [
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    },
    2: {
        id: 2,
        name: "Urban Sneakers",
        category: "sneakers",
        price: 129.99,
        description: "Stylish urban sneakers with premium comfort technology. Features memory foam insoles and durable rubber soles for all-day comfort.",
        features: [
            "Memory Foam Insoles",
            "Breathable Mesh Upper",
            "Non-Slip Rubber Sole",
            "Lightweight Design",
            "Urban Style"
        ],
        sizes: ["8", "9", "10", "11", "12"],
        colors: ["White", "Black", "Gray"],
        rating: 5.0,
        reviews: 256,
        images: [
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    },
    3: {
        id: 3,
        name: "Designer Pants",
        category: "pants",
        price: 89.99,
        oldPrice: 119.99,
        description: "Slim fit designer pants made from premium fabric. Perfect for both casual and semi-formal occasions.",
        features: [
            "Premium Cotton Fabric",
            "Slim Fit Design",
            "Stretch Comfort",
            "Modern Cut",
            "Easy Care"
        ],
        sizes: ["30", "32", "34", "36", "38"],
        colors: ["Navy", "Black", "Charcoal", "Khaki"],
        rating: 4.5,
        reviews: 192,
        images: [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    },
    4: {
        id: 4,
        name: "Classic Hoodie",
        category: "hoodies",
        price: 69.99,
        description: "Classic hoodie design with modern comfort features. Perfect for everyday wear.",
        features: [
            "Classic Design",
            "Soft Fabric",
            "Relaxed Fit",
            "Durable Construction",
            "Multiple Colors"
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Gray", "Navy", "Red"],
        rating: 5.0,
        reviews: 315,
        images: [
            "https://images.unsplash.com/photo-1527719327859-c6ce80353573?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1527719327859-c6ce80353573?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    },
    5: {
        id: 5,
        name: "Running Shoes",
        category: "sneakers",
        price: 149.99,
        description: "High-performance running shoes with advanced cushioning technology.",
        features: [
            "Advanced Cushioning",
            "Breathable Upper",
            "Lightweight Design",
            "Shock Absorption",
            "Performance Sole"
        ],
        sizes: ["8", "9", "10", "11", "12"],
        colors: ["Blue", "Black", "Gray"],
        rating: 4.5,
        reviews: 187,
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    },
    6: {
        id: 6,
        name: "Cargo Pants",
        category: "pants",
        price: 99.99,
        description: "Utility style cargo pants with multiple pockets and durable fabric.",
        features: [
            "Multiple Pockets",
            "Durable Fabric",
            "Comfortable Fit",
            "Utility Style",
            "Versatile Wear"
        ],
        sizes: ["30", "32", "34", "36"],
        colors: ["Olive", "Black", "Brown"],
        rating: 4.5,
        reviews: 94,
        images: [
            "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    initializeFilters();
    
    // Sort functionality
    initializeSorting();
    
    // Quick view functionality
    initializeQuickView();
    
    // Add to cart functionality
    initializeAddToCart();
    
    // Load more functionality
    initializeLoadMore();
});

// Filter products by category
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            
            // Filter products
            productItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Sort products
function initializeSorting() {
    const sortSelect = document.querySelector('.sort-select');
    
    sortSelect.addEventListener('change', function() {
        const value = this.value;
        const productsGrid = document.querySelector('.products-grid');
        const productItems = Array.from(document.querySelectorAll('.product-item'));
        
        let sortedItems;
        
        switch(value) {
            case 'newest':
                // Sort by badge (NEW first)
                sortedItems = productItems.sort((a, b) => {
                    const aHasBadge = a.querySelector('.product-badge');
                    const bHasBadge = b.querySelector('.product-badge');
                    return (bHasBadge ? 1 : 0) - (aHasBadge ? 1 : 0);
                });
                break;
                
            case 'price-low':
                // Sort by price low to high
                sortedItems = productItems.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
                    const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
                    return priceA - priceB;
                });
                break;
                
            case 'price-high':
                // Sort by price high to low
                sortedItems = productItems.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
                    const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
                    return priceB - priceA;
                });
                break;
                
            default: // popular
                // Sort by rating
                sortedItems = productItems.sort((a, b) => {
                    const ratingA = parseInt(a.querySelector('.rating-count').textContent.replace(/[()]/g, ''));
                    const ratingB = parseInt(b.querySelector('.rating-count').textContent.replace(/[()]/g, ''));
                    return ratingB - ratingA;
                });
        }
        
        // Reorder grid
        sortedItems.forEach(item => {
            productsGrid.appendChild(item);
        });
    });
}

// Quick view modal
function initializeQuickView() {
    const modal = document.getElementById('quickViewModal');
    const closeBtn = document.querySelector('.close-modal');
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    
    // Open modal
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.product;
            openQuickView(productId);
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

function openQuickView(productId) {
    const modal = document.getElementById('quickViewModal');
    const modalBody = document.getElementById('modalBody');
    const product = products[productId];
    
    if (!product) return;
    
    // Generate stars HTML
    const stars = generateStars(product.rating);
    
    // Generate modal content
    modalBody.innerHTML = `
        <div class="product-modal">
            <div class="modal-images">
                <div class="main-image">
                    <img src="${product.images[0]}" alt="${product.name}" id="mainImage">
                </div>
                <div class="thumbnail-images">
                    ${product.images.map((img, index) => `
                        <img src="${img}" alt="${product.name} ${index + 1}" 
                             class="thumbnail ${index === 0 ? 'active' : ''}" 
                             onclick="changeMainImage('${img}', this)">
                    `).join('')}
                </div>
            </div>
            
            <div class="modal-details">
                <h2 class="modal-product-name">${product.name}</h2>
                
                <div class="modal-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                
                <div class="modal-rating">
                    ${stars}
                    <span class="review-count">(${product.reviews} reviews)</span>
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
                    
                    <button class="wishlist-btn">
                        <i class="fas fa-heart"></i>
                        Add to Wishlist
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Initialize modal functionality
    initializeModalFunctionality(productId);
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function getColorHex(color) {
    const colorMap = {
        'Black': '#000000',
        'White': '#ffffff',
        'Gray': '#808080',
        'Navy': '#000080',
        'Blue': '#0000ff',
        'Red': '#ff0000',
        'Green': '#008000',
        'Olive': '#808000',
        'Khaki': '#f0e68c',
        'Brown': '#8b4513',
        'Charcoal': '#36454f'
    };
    return colorMap[color] || '#8b5cf6';
}

// Initialize modal functionality
function initializeModalFunctionality(productId) {
    const product = products[productId];
    
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
        
        addToCart(productId, quantity, selectedSize, selectedColor);
        closeQuickView();
    });
    
    // Wishlist button
    const wishlistBtn = document.querySelector('.wishlist-btn');
    wishlistBtn.addEventListener('click', function() {
        alert(`${product.name} added to wishlist!`);
        this.innerHTML = '<i class="fas fa-check"></i> Added to Wishlist';
        this.style.background = '#10b981';
        
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-heart"></i> Add to Wishlist';
            this.style.background = '';
        }, 2000);
    });
}

function updateModalPrice(price) {
    const addToCartBtn = document.querySelector('.modal-add-to-cart');
    addToCartBtn.innerHTML = `<i class="fas fa-shopping-bag"></i> Add to Cart - $${price.toFixed(2)}`;
}

function changeMainImage(src, element) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    mainImage.src = src;
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    element.classList.add('active');
}

// Add to cart functionality
function initializeAddToCart() {
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.product;
            addToCart(productId, 1);
            
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

function addToCart(productId, quantity = 1, size = null, color = null) {
    const product = products[productId];
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
            category: product.category
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
    
    // Update cart count in all pages
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

// Load more functionality
function initializeLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more products
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                // In a real app, this would fetch more products from an API
                alert('More products would be loaded here from an API');
                this.innerHTML = '<i class="fas fa-sync-alt"></i> Load More Products';
                this.disabled = false;
            }, 1500);
        });
    }
}

// Initialize cart count on page load
updateCartCount();
// إضافة في ملف men.js
document.addEventListener('DOMContentLoaded', function() {
    // إنشاء جسيمات عائمة
    const header = document.querySelector('.page-header');
    
    if (header) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // خصائص عشوائية
            const size = Math.random() * 20 + 5;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            particle.style.animation = `float ${duration}s ease-in-out infinite`;
            particle.style.opacity = Math.random() * 0.3 + 0.1;
            header.appendChild(particle);
        }
    }
}); 