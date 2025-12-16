// Shopping Cart Page JavaScript

    // ===================================================================
    // 1. Firebase Imports & Initialization
    // ===================================================================
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
    import { getAuth } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
    import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";

    // مفاتيح تكوين مشروعك
    const firebaseConfig = {
        apiKey: "AIzaSyDZaJqweCcEcqCglRHu1UrkrmuQAXEe8Lo",
        authDomain: "my-shop-82459.firebaseapp.com",
        projectId: "my-shop-82459",
        storageBucket: "my-shop-82459.firebasestorage.app",
        messagingSenderId: "744913484296",
        appId: "1:744913484296:web:b2c4614d773518b4112fbd",
        measurementId: "G-5EPCPXRVG2"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app); 
    const db = getFirestore(app);
    console.log("Cart Firebase Initialized!");
    // ===================================================================

    // Cart Data
    let cart = [];

    // ===================================================================
    // 🛠️ دالة الحصول على المستخدم الحالي
    // ===================================================================
    /**
     * تحصل على بيانات المستخدم من localStorage/sessionStorage
     * @returns {object|null}
     */
    function getCurrentUserData() {
        const localUser = localStorage.getItem('styleshop_user');
        const sessionUser = sessionStorage.getItem('styleshop_user');
        
        // الأولوية لـ localStorage
        if (localUser) return JSON.parse(localUser);
        if (sessionUser) return JSON.parse(sessionUser);
        
        return null;
    }
    // ===================================================================

    // ===================================================================
    // 🛠️ دالة التحقق من حالة تسجيل الدخول (النسخة النهائية)
    // ===================================================================
    function checkLoginStatus() {
        return getCurrentUserData() !== null;
    }
    // ===================================================================

    // ===================================================================
    // 🛠️ دالة تسجيل الخروج (للتأكد من نظافة الذاكرة)
    // ===================================================================
    function logoutUser() {
        localStorage.removeItem('styleshop_user');
        sessionStorage.removeItem('styleshop_user'); 
        localStorage.removeItem('user_auth_token');
        
        alert('You have been logged out successfully. Page will reload.');
        window.location.reload(); 
    }
    // ===================================================================

    // ===================================================================
    // 🛠️ دالة حفظ بيانات الطلب قبل التوجيه إلى صفحة الدفع
    // ===================================================================
    function saveOrderDataToSession() {
        // حساب القيم المالية
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= 100 ? 0 : 9.99;
        const tax = subtotal * 0.08;
        
        // حساب الخصم إذا كان مطبقاً
        let discount = 0;
        const discountRow = document.querySelector('.discount-amount');
        if (discountRow) {
            const discountText = discountRow.textContent;
            discount = Math.abs(parseFloat(discountText.replace('-$', ''))) || 0;
        }
        
        const total = subtotal + shipping + tax - discount;
        
        // إعداد بيانات الطلب
        const orderData = {
            cart: cart,
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            discount: discount,
            total: total,
            couponCode: getAppliedCouponCode(),
            timestamp: new Date().getTime()
        };
        
        // حفظ في sessionStorage للمرحلة الانتقالية
        sessionStorage.setItem('pending_order', JSON.stringify(orderData));
        
        return orderData;
    }
    // ===================================================================

    // ===================================================================
    // 🛠️ دالة الحصول على الكوبون المطبق
    // ===================================================================
    function getAppliedCouponCode() {
        const discountRow = document.querySelector('.discount-row');
        if (discountRow) {
            const spanText = discountRow.querySelector('span').textContent;
            const match = spanText.match(/\((.*?)\)/);
            return match ? match[1] : null;
        }
        return null;
    }
    // ===================================================================

    // Initialize page
    document.addEventListener('DOMContentLoaded', function() {
        // Load cart from localStorage
        loadCart();
        // Initialize event listeners
        initializeEventListeners();
        // Render cart items
        renderCartItems();
        // Update cart count in navigation
        updateCartCount();
    });

    // Load cart from localStorage
    function loadCart() {
        const savedCart = localStorage.getItem('styleshop_cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('styleshop_cart', JSON.stringify(cart));
    }

    // Initialize event listeners
    function initializeEventListeners() {
        // Clear cart button
        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', clearCart);
        }
        
        // Apply coupon button
        const applyCouponBtn = document.getElementById('applyCouponBtn');
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', applyCoupon);
        }
        
        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', proceedToCheckout);
        }
    }

    // Render cart items
    function renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const itemCountElement = document.getElementById('itemCount');
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <a href="men.html" class="btn-primary">
                        <i class="fas fa-shopping-bag"></i>
                        Start Shopping
                    </a>
                </div>
            `;
            itemCountElement.textContent = '0';
            updateOrderSummary();
            return;
        }
        
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        itemCountElement.textContent = totalItems;
        
        let cartHTML = '';
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            
            cartHTML += `
                <div class="cart-item" data-index="${index}">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    
                    <div class="item-details">
                        <h3 class="item-name">${item.name}</h3>
                        <div class="item-info">
                            ${item.size ? `Size: ${item.size}` : ''}
                            ${item.color ? ` | Color: ${item.color}` : ''}
                            ${item.category ? ` | ${item.category}` : ''}
                        </div>
                        <div class="item-price">$${item.price.toFixed(2)} each</div>
                    </div>
                    
                    <div class="item-actions">
                        <div class="quantity-selector">
                            <button class="qty-btn minus" onclick="updateQuantity(${index}, -1)">-</button>
                            <input type="number" class="qty-input" value="${item.quantity}" min="1" max="10" 
                                    onchange="updateQuantityInput(${index}, this.value)">
                            <button class="qty-btn plus" onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                        
                        <button class="remove-item-btn" onclick="removeItem(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    
                    <div class="item-total">
                        <div class="total-price">$${itemTotal.toFixed(2)}</div>
                    </div>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = cartHTML;
        updateOrderSummary();
    }

    // Update quantity with buttons
    function updateQuantity(index, change) {
        if (index < 0 || index >= cart.length) return;
        
        cart[index].quantity += change;
        
        if (cart[index].quantity < 1) {
            cart[index].quantity = 1;
        }
        
        if (cart[index].quantity > 10) {
            cart[index].quantity = 10;
        }
        
        saveCart();
        renderCartItems();
        updateCartCount();
    }

    // Update quantity with input
    function updateQuantityInput(index, value) {
        if (index < 0 || index >= cart.length) return;
        
        const quantity = parseInt(value);
        if (isNaN(quantity) || quantity < 1) {
            cart[index].quantity = 1;
        } else if (quantity > 10) {
            cart[index].quantity = 10;
        } else {
            cart[index].quantity = quantity;
        }
        
        saveCart();
        renderCartItems();
        updateCartCount();
    }

    // Remove item from cart
    function removeItem(index) {
        if (index < 0 || index >= cart.length) return;
        
        if (confirm(`Remove "${cart[index].name}" from cart?`)) {
            cart.splice(index, 1);
            saveCart();
            renderCartItems();
            updateCartCount();
            
            showNotification('Item removed from cart');
        }
    }

    // Clear entire cart
    function clearCart() {
        if (cart.length === 0) {
            alert('Your cart is already empty!');
            return;
        }
        
        if (confirm('Are you sure you want to clear your entire cart?')) {
            cart = [];
            saveCart();
            renderCartItems();
            updateCartCount();
            
            showNotification('Cart cleared successfully');
        }
    }

    // Update order summary
    function updateOrderSummary() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= 100 ? 0 : 9.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;
        
        const subtotalElement = document.querySelector('.subtotal-amount');
        const shippingElement = document.querySelector('.shipping-amount');
        const taxElement = document.querySelector('.tax-amount');
        const totalElement = document.querySelector('.total-amount');
        
        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    }

    // Apply coupon
    function applyCoupon() {
        const couponCode = document.getElementById('couponCode').value.trim();
        const couponInput = document.getElementById('couponCode');
        const applyBtn = document.getElementById('applyCouponBtn');
        
        if (!couponCode) {
            alert('Please enter a coupon code');
            return;
        }
        
        const validCoupons = {
            'STYLE10': 0.10, 
            'WELCOME15': 0.15, 
            'SALE20': 0.20,
            'MEGA15': 0.15
        };
        
        if (validCoupons[couponCode.toUpperCase()]) {
            const discount = validCoupons[couponCode.toUpperCase()];
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const discountAmount = subtotal * discount;
            
            couponInput.disabled = true;
            applyBtn.disabled = true;
            applyBtn.textContent = 'Applied!';
            applyBtn.style.background = '#10b981';
            
            addDiscountToSummary(discountAmount, couponCode.toUpperCase());
            
            showNotification(`Coupon applied! ${discount * 100}% discount added`);
        } else {
            alert('Invalid coupon code. Please try again.');
            couponInput.value = '';
            couponInput.focus();
        }
    }

    // Add discount to order summary
    function addDiscountToSummary(amount, code) {
        const summaryDetails = document.querySelector('.summary-details');
        const existingDiscount = document.querySelector('.discount-row');
        if (existingDiscount) {
            existingDiscount.remove();
        }
        
        const discountRow = document.createElement('div');
        discountRow.className = 'summary-row discount-row';
        discountRow.innerHTML = `
            <span>Discount (${code})</span>
            <span class="discount-amount">-$${amount.toFixed(2)}</span>
        `;
        
        const totalRow = document.querySelector('.summary-row.total');
        summaryDetails.insertBefore(discountRow, totalRow);
        
        updateTotalWithDiscount(amount);
    }

    // Update total with discount
    function updateTotalWithDiscount(discountAmount) {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= 100 ? 0 : 9.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax - discountAmount;
        
        const totalElement = document.querySelector('.total-amount');
        if (totalElement) {
            totalElement.textContent = `$${total.toFixed(2)}`;
        }
    }

    // Proceed to checkout
    function proceedToCheckout() {
        // 1. التحقق من وجود عناصر في العربة
        if (cart.length === 0) {
            alert('Your cart is empty. Add some items before checkout.');
            return;
        }
        
        // 2. التحقق من تسجيل الدخول
        const currentUserData = getCurrentUserData();
        if (!currentUserData) {
            alert('Please log in or register to proceed to checkout.');
            window.location.href = 'login.html'; 
            return; 
        }
        
        // 3. حفظ بيانات الطلب مؤقتاً
        saveOrderDataToSession();
        
        // 4. توجيه المستخدم إلى صفحة معلومات الدفع والتوصيل
        window.location.href = 'checkout.html';
    }

    // Calculate total
    function calculateTotal() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= 100 ? 0 : 9.99;
        const tax = subtotal * 0.08;
        
        let discount = 0;
        const discountRow = document.querySelector('.discount-amount');
        if (discountRow) {
            const discountText = discountRow.textContent;
            discount = Math.abs(parseFloat(discountText.replace('-$', ''))) || 0;
        }
        
        return subtotal + shipping + tax - discount;
    }

    // Update cart count in navigation
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCounts = document.querySelectorAll('.cart-count');
        cartCounts.forEach(element => {
            element.textContent = totalItems;
        });
    }

    // Show notification
    function showNotification(message) {
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
                bottom: 20px;
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
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 3000);
    }

    // Initialize cart count on page load
    updateCartCount();