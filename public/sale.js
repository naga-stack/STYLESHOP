// Sale Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown timers
    initializeCountdowns();
    
    // Initialize real-time stats
    initializeRealTimeStats();
    
    // Initialize flash deals timer
    initializeFlashDealTimer();
    
    // Initialize coupon code
    initializeCouponCode();
    
    // Initialize deal newsletter
    initializeDealNewsletter();
    
    // Initialize product interactions
    initializeProductInteractions();
    
    // Initialize quick view modal
    initializeQuickView();
    
    // Initialize mobile navigation
    initializeMobileNavigation();
    
    // Update cart and wishlist counts
    updateCartCount();
    updateWishlistCount();
});

// Countdown Timers
function initializeCountdowns() {
    // Main sale countdown (5 days from now)
    const saleEndDate = new Date();
    saleEndDate.setDate(saleEndDate.getDate() + 5);
    
    // Flash deal countdown (2 hours from now)
    const flashEndDate = new Date();
    flashEndDate.setHours(flashEndDate.getHours() + 2);
    
    // Coupon countdown (24 hours from now)
    const couponEndDate = new Date();
    couponEndDate.setHours(couponEndDate.getHours() + 24);
    
    // Update all countdowns every second
    setInterval(() => {
        updateCountdown('days', 'hours', 'minutes', 'seconds', saleEndDate);
        updateFlashTimer(flashEndDate);
        updateCouponTimer(couponEndDate);
    }, 1000);
    
    // Initial update
    updateCountdown('days', 'hours', 'minutes', 'seconds', saleEndDate);
    updateFlashTimer(flashEndDate);
    updateCouponTimer(couponEndDate);
}

function updateCountdown(daysId, hoursId, minutesId, secondsId, endDate) {
    const now = new Date().getTime();
    const distance = endDate - now;
    
    if (distance < 0) {
        document.getElementById(daysId).textContent = '00';
        document.getElementById(hoursId).textContent = '00';
        document.getElementById(minutesId).textContent = '00';
        document.getElementById(secondsId).textContent = '00';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById(daysId).textContent = days.toString().padStart(2, '0');
    document.getElementById(hoursId).textContent = hours.toString().padStart(2, '0');
    document.getElementById(minutesId).textContent = minutes.toString().padStart(2, '0');
    document.getElementById(secondsId).textContent = seconds.toString().padStart(2, '0');
}

function updateFlashTimer(endDate) {
    const now = new Date().getTime();
    const distance = endDate - now;
    
    if (distance < 0) {
        document.getElementById('flashTimer').textContent = '00:00:00';
        return;
    }
    
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('flashTimer').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateCouponTimer(endDate) {
    const now = new Date().getTime();
    const distance = endDate - now;
    
    if (distance < 0) {
        document.getElementById('couponTimer').textContent = '00:00:00';
        return;
    }
    
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('couponTimer').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Real-time Statistics
function initializeRealTimeStats() {
    const shoppersElement = document.getElementById('liveShoppers');
    const itemsSoldElement = document.getElementById('itemsSold');
    
    if (shoppersElement && itemsSoldElement) {
        // Simulate live shoppers (in real app, this would come from server)
        let shoppers = 142;
        let itemsSold = 89;
        
        setInterval(() => {
            // Random changes to simulate real-time activity
            const shopperChange = Math.random() > 0.5 ? 1 : -1;
            const saleChange = Math.random() > 0.3 ? 1 : 0;
            
            shoppers = Math.max(100, shoppers + shopperChange);
            itemsSold += saleChange;
            
            shoppersElement.textContent = shoppers;
            itemsSoldElement.textContent = itemsSold;
            
            // Add visual feedback
            if (shopperChange > 0) {
                animateStatChange(shoppersElement);
            }
            if (saleChange > 0) {
                animateStatChange(itemsSoldElement);
            }
        }, 3000); // Update every 3 seconds
    }
}

function animateStatChange(element) {
    element.style.transform = 'scale(1.2)';
    element.style.color = '#ffd700';
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.color = '';
    }, 300);
}

// Flash Deal Timer with Progress Animation
function initializeFlashDealTimer() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const currentWidth = parseFloat(bar.style.width);
        const targetWidth = Math.min(100, currentWidth + Math.random() * 5);
        
        // Animate progress bar growth
        setInterval(() => {
            if (parseFloat(bar.style.width) < targetWidth) {
                bar.style.width = (parseFloat(bar.style.width) + 0.1) + '%';
                
                // Update progress text
                const progressText = bar.parentElement.nextElementSibling;
                if (progressText && progressText.classList.contains('progress-text')) {
                    const newPercentage = Math.min(100, Math.round(parseFloat(bar.style.width)));
                    progressText.textContent = `${newPercentage}% Sold`;
                }
            }
        }, 5000); // Update every 5 seconds
    });
}

// Coupon Code Functionality
function initializeCouponCode() {
    const copyBtn = document.getElementById('copyCouponBtn');
    const couponNotification = document.getElementById('couponNotification');
    const couponCode = 'MEGA15';
    
    if (copyBtn) {
        copyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Copy to clipboard
            navigator.clipboard.writeText(couponCode).then(() => {
                // Show notification
                couponNotification.classList.add('show');
                
                // Update button text
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                this.style.background = '#10b981';
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.background = '';
                }, 2000);
                
                // Hide notification after 3 seconds
                setTimeout(() => {
                    couponNotification.classList.remove('show');
                }, 3000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy coupon code. Please copy manually: ' + couponCode);
            });
        });
    }
}

// Deal Newsletter
function initializeDealNewsletter() {
    const newsletterForm = document.getElementById('dealNewsletterForm');
    
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
                
                // Save to localStorage
                let saleSubscribers = JSON.parse(localStorage.getItem('styleshop_sale_subscribers')) || [];
                if (!saleSubscribers.includes(email)) {
                    saleSubscribers.push(email);
                    localStorage.setItem('styleshop_sale_subscribers', JSON.stringify(saleSubscribers));
                }
                
                // Show success message
                showDealSubscriptionSuccess();
                
                // Reset form
                emailInput.value = '';
                
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

function showDealSubscriptionSuccess() {
    const successMsg = document.createElement('div');
    successMsg.className = 'deal-subscription-success';
    successMsg.innerHTML = `
        <i class="fas fa-bell"></i>
        <span>You'll now receive exclusive sale alerts!</span>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .deal-subscription-success {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #dc2626, #ef4444);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideUp 0.3s ease, slideDown 0.3s ease 2.7s forwards;
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
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        successMsg.remove();
        style.remove();
    }, 3000);
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Product Interactions
function initializeProductInteractions() {
    // Deal buttons
    const dealButtons = document.querySelectorAll('.deal-btn');
    dealButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.product;
            grabFlashDeal(productId);
        });
    });
    
    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.product;
            addToCart(productId);
        });
    });
    
    // Wishlist buttons
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.product;
            toggleWishlist(productId, this);
        });
    });
    
    // Quick view buttons
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = this.dataset.product;
            openQuickView(productId);
        });
    });
}

function grabFlashDeal(productId) {
    // Simulate grabbing a flash deal
    const dealBtn = document.querySelector(`.deal-btn[data-product="${productId}"]`);
    const originalText = dealBtn.innerHTML;
    
    dealBtn.innerHTML = '<i class="fas fa-check"></i> Deal Grabbed!';
    dealBtn.style.background = '#10b981';
    dealBtn.disabled = true;
    
    // Show notification
    showFlashDealNotification(productId);
    
    // In a real app, this would add to cart
    setTimeout(() => {
        dealBtn.innerHTML = originalText;
        dealBtn.style.background = '';
        dealBtn.disabled = false;
    }, 2000);
}

function showFlashDealNotification(productId) {
    const notification = document.createElement('div');
    notification.className = 'flash-deal-notification';
    notification.innerHTML = `
        <i class="fas fa-bolt"></i>
        <span>Flash deal added to cart!</span>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .flash-deal-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(45deg, #f59e0b, #d97706);
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
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

function addToCart(productId) {
    // Get product data (in real app, this would come from database)
    const product = getProductData(productId);
    if (!product) return;
    
    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem('styleshop_cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.salePrice || product.price,
            quantity: 1,
            image: product.image,
            category: product.category
        });
    }
    
    // Save to localStorage
    localStorage.setItem('styleshop_cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showCartNotification(`${product.name} added to cart!`);
    
    // Button feedback
    const addToCartBtn = document.querySelector(`.add-to-cart-btn[data-product="${productId}"]`);
    if (addToCartBtn) {
        const originalText = addToCartBtn.innerHTML;
        addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added!';
        addToCartBtn.style.background = '#10b981';
        
        setTimeout(() => {
            addToCartBtn.innerHTML = originalText;
            addToCartBtn.style.background = '';
        }, 2000);
    }
}

function getProductData(productId) {
    // Mock product data (in real app, this would come from an API)
    const products = {
        '1': { name: 'Designer Pants', price: 119.99, salePrice: 49.99, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'men' },
        '2': { name: 'Evening Dress', price: 149.99, salePrice: 74.99, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'women' },
        '3': { name: 'Urban Sneakers', price: 129.99, salePrice: 51.99, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'shoes' },
        '4': { name: 'Premium Hoodie', price: 79.99, salePrice: 47.99, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'men' },
        '5': { name: 'Cargo Pants', price: 99.99, salePrice: 69.99, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'men' },
        '6': { name: 'Classic Hoodie', price: 69.99, salePrice: 45.49, image: 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'men' },
        '7': { name: 'Winter Jacket', price: 199.99, salePrice: 89.99, image: 'https://images.unsplash.com/photo-1591955506264-3f5a6834570a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'men' },
        '8': { name: 'Silk Blouse', price: 79.99, salePrice: 43.99, image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'women' },
        '9': { name: 'Summer Dress', price: 89.99, salePrice: 53.99, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'women' },
        '10': { name: 'Casual T-shirt', price: 39.99, salePrice: 15.99, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'women' },
        '11': { name: 'Designer Coat', price: 199.99, salePrice: 99.99, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'women' }
    };
    
    return products[productId];
}

function toggleWishlist(productId, button) {
    // Get product data
    const product = getProductData(productId);
    if (!product) return;
    
    // Get current wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('styleshop_wishlist')) || [];
    
    // Check if product is in wishlist
    const isInWishlist = wishlist.some(item => item.id === productId);
    
    if (isInWishlist) {
        // Remove from wishlist
        wishlist = wishlist.filter(item => item.id !== productId);
        button.classList.remove('active');
        button.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
        // Add to wishlist
        wishlist.push({
            id: productId,
            name: product.name,
            price: product.salePrice || product.price,
            image: product.image,
            category: product.category
        });
        button.classList.add('active');
        button.innerHTML = '<i class="fas fa-heart"></i>';
    }
    
    // Save to localStorage
    localStorage.setItem('styleshop_wishlist', JSON.stringify(wishlist));
    
    // Update wishlist count
    updateWishlistCount();
    
    // Show notification
    showWishlistNotification(product.name, !isInWishlist);
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('styleshop_wishlist')) || [];
    const count = wishlist.length;
    
    // Update desktop wishlist count
    const desktopCount = document.querySelector('.wishlist-count');
    if (desktopCount) {
        desktopCount.textContent = count;
    }
    
    // Update mobile wishlist count
    const mobileCount = document.querySelector('.wishlist-count-mobile');
    if (mobileCount) {
        mobileCount.textContent = count;
    }
}

function showWishlistNotification(productName, added) {
    const notification = document.createElement('div');
    notification.className = 'wishlist-notification';
    notification.innerHTML = `
        <i class="fas fa-heart"></i>
        <span>${productName} ${added ? 'added to' : 'removed from'} wishlist!</span>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .wishlist-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(45deg, #ec4899, #d946ef);
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
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('styleshop_cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update desktop cart count
    const desktopCount = document.querySelector('.cart-count');
    if (desktopCount) {
        desktopCount.textContent = totalItems;
    }
    
    // Update mobile cart count
    const mobileCount = document.querySelector('.cart-count-mobile');
    if (mobileCount) {
        mobileCount.textContent = totalItems;
    }
}

function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .cart-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(45deg, #dc2626, #ef4444);
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
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

// Quick View Modal (similar to other pages)
function initializeQuickView() {
    const modal = document.getElementById('quickViewModal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeQuickView);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeQuickView();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeQuickView();
            }
        });
    }
}

function openQuickView(productId) {
    const product = getProductData(productId);
    if (!product) return;
    
    const modal = document.getElementById('quickViewModal');
    const modalBody = document.getElementById('modalBody');
    
    const discount = Math.round(((product.price - product.salePrice) / product.price) * 100);
    
    modalBody.innerHTML = `
        <div class="product-modal">
            <div class="modal-images">
                <div class="main-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
            </div>
            
            <div class="modal-details">
                <div class="sale-badge">-${discount}%</div>
                <h2 class="modal-product-name">${product.name}</h2>
                
                <div class="modal-pricing">
                    <span class="current-price">$${product.salePrice.toFixed(2)}</span>
                    <span class="original-price">$${product.price.toFixed(2)}</span>
                    <span class="savings">Save $${(product.price - product.salePrice).toFixed(2)}</span>
                </div>
                
                <div class="modal-stock">
                    <i class="fas fa-bolt"></i>
                    <span>Limited stock available</span>
                </div>
                
                <div class="modal-actions">
                    <div class="quantity-selector">
                        <button class="qty-btn minus">-</button>
                        <input type="number" class="qty-input" value="1" min="1" max="10">
                        <button class="qty-btn plus">+</button>
                    </div>
                    
                    <button class="modal-add-to-cart" data-product="${productId}">
                        <i class="fas fa-shopping-bag"></i>
                        Add to Cart - $${product.salePrice.toFixed(2)}
                    </button>
                    
                    <button class="modal-wishlist" data-product="${productId}">
                        <i class="fas fa-heart"></i>
                        Add to Wishlist
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Initialize modal functionality
    initializeModalFunctionality(productId, product);
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function initializeModalFunctionality(productId, product) {
    // Quantity selector
    const minusBtn = document.querySelector('.minus');
    const plusBtn = document.querySelector('.plus');
    const qtyInput = document.querySelector('.qty-input');
    
    if (minusBtn && plusBtn && qtyInput) {
        minusBtn.addEventListener('click', () => {
            let value = parseInt(qtyInput.value);
            if (value > 1) {
                qtyInput.value = value - 1;
                updateModalPrice(product.salePrice * (value - 1));
            }
        });
        
        plusBtn.addEventListener('click', () => {
            let value = parseInt(qtyInput.value);
            if (value < 10) {
                qtyInput.value = value + 1;
                updateModalPrice(product.salePrice * (value + 1));
            }
        });
        
        qtyInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (value < 1) this.value = 1;
            if (value > 10) this.value = 10;
            updateModalPrice(product.salePrice * parseInt(this.value));
        });
    }
    
    // Add to cart from modal
    const modalAddToCart = document.querySelector('.modal-add-to-cart');
    if (modalAddToCart) {
        modalAddToCart.addEventListener('click', function() {
            const quantity = parseInt(qtyInput.value);
            
            // Add to cart
            let cart = JSON.parse(localStorage.getItem('styleshop_cart')) || [];
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: productId,
                    name: product.name,
                    price: product.salePrice,
                    quantity: quantity,
                    image: product.image,
                    category: product.category
                });
            }
            
            localStorage.setItem('styleshop_cart', JSON.stringify(cart));
            
            // Update cart count
            updateCartCount();
            
            // Show notification
            showCartNotification(`${product.name} added to cart!`);
            
            // Close modal
            closeQuickView();
        });
    }
    
    // Wishlist from modal
    const modalWishlist = document.querySelector('.modal-wishlist');
    if (modalWishlist) {
        modalWishlist.addEventListener('click', function() {
            toggleWishlist(productId, this);
        });
    }
}

function updateModalPrice(price) {
    const addToCartBtn = document.querySelector('.modal-add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.innerHTML = `<i class="fas fa-shopping-bag"></i> Add to Cart - $${price.toFixed(2)}`;
    }
}

// Mobile Navigation (reuse from other pages)
function initializeMobileNavigation() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    
    if (hamburgerMenu && mobileMenuOverlay && closeMobileMenu) {
        hamburgerMenu.addEventListener('click', function() {
            this.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        function closeMenu() {
            hamburgerMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        closeMobileMenu.addEventListener('click', closeMenu);
        
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === mobileMenuOverlay) {
                closeMenu();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });
    }
}

// Initialize counts on page load
updateCartCount();
updateWishlistCount();
