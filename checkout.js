// Checkout Page JavaScript

// ===================================================================
// 1. Firebase Imports & Initialization
// ===================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDZaJqweCcEcqCglRHu1UrkrmuQAXEe8Lo",
    authDomain: "my-shop-82459.firebaseapp.com",
    projectId: "my-shop-82459",
    storageBucket: "my-shop-82459.firebasestorage.app",
    messagingBucket: "my-shop-82459.appspot.com",
    messagingSenderId: "744913484296",
    appId: "1:744913484296:web:b2c4614d773518b4112fbd",
    measurementId: "G-5EPCPXRVG2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
console.log("Checkout Firebase Initialized!");

// ===================================================================
// 2. المتغيرات العامة
// ===================================================================
let orderData = null;
let currentUser = null;
let cart = [];

// ===================================================================
// 3. دوال الحالة والمستخدم
// ===================================================================
function getCurrentUserData() {
    const localUser = localStorage.getItem('styleshop_user');
    const sessionUser = sessionStorage.getItem('styleshop_user');
    
    if (localUser) return JSON.parse(localUser);
    if (sessionUser) return JSON.parse(sessionUser);
    
    return null;
}

function checkLoginStatus() {
    return getCurrentUserData() !== null;
}

// ===================================================================
// 4. تحميل بيانات الطلب من sessionStorage
// ===================================================================
function loadOrderData() {
    const savedOrder = sessionStorage.getItem('pending_order');
    if (savedOrder) {
        orderData = JSON.parse(savedOrder);
        cart = orderData.cart || [];
        return true;
    }
    return false;
}

// ===================================================================
// 5. تحديث سلة المشتريات في الشريط العلوي
// ===================================================================
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(element => {
        element.textContent = totalItems;
    });
}

// ===================================================================
// 6. عرض العناصر في ملخص الطلب
// ===================================================================
function renderOrderItems() {
    const orderItemsPreview = document.getElementById('orderItemsPreview');
    
    if (!cart || cart.length === 0) {
        orderItemsPreview.innerHTML = `
            <div class="empty-order">
                <i class="fas fa-shopping-cart"></i>
                <p>No items in cart</p>
            </div>
        `;
        return;
    }
    
    let itemsHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        
        itemsHTML += `
            <div class="order-item-preview">
                <div class="order-item-image">
                    <img src="${item.image || 'https://via.placeholder.com/60x60'}" alt="${item.name}">
                </div>
                <div class="order-item-details">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-info">
                        ${item.size ? `Size: ${item.size}` : ''}
                        ${item.color ? ` | Color: ${item.color}` : ''}
                    </div>
                    <div class="order-item-quantity">Qty: ${item.quantity}</div>
                </div>
                <div class="order-item-price">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });
    
    orderItemsPreview.innerHTML = itemsHTML;
}

// ===================================================================
// 7. تحديث ملخص الطلب
// ===================================================================
function updateOrderSummary() {
    if (!orderData) return;
    
    const subtotalElement = document.querySelector('.subtotal-amount');
    const shippingElement = document.querySelector('.shipping-amount');
    const taxElement = document.querySelector('.tax-amount');
    const totalElement = document.querySelector('.total-amount');
    const discountRow = document.querySelector('.discount-row');
    
    if (subtotalElement) subtotalElement.textContent = `$${orderData.subtotal.toFixed(2)}`;
    if (shippingElement) {
        shippingElement.textContent = orderData.shipping === 0 ? 'FREE' : `$${orderData.shipping.toFixed(2)}`;
    }
    if (taxElement) taxElement.textContent = `$${orderData.tax.toFixed(2)}`;
    
    if (orderData.discount > 0) {
        if (discountRow) {
            discountRow.style.display = 'flex';
            const discountAmount = discountRow.querySelector('.discount-amount');
            if (discountAmount) {
                discountAmount.textContent = `-$${orderData.discount.toFixed(2)}`;
            }
        }
    } else if (discountRow) {
        discountRow.style.display = 'none';
    }
    
    if (totalElement) totalElement.textContent = `$${orderData.total.toFixed(2)}`;
    
    // تحديث إجمالي الطلب في المودال
    const orderTotalElement = document.querySelector('.order-total');
    if (orderTotalElement) {
        orderTotalElement.textContent = `$${orderData.total.toFixed(2)}`;
    }
}

// ===================================================================
// 8. تحديث رسوم الشحن عند تغيير طريقة الشحن
// ===================================================================
function updateShippingCost(shippingMethod) {
    if (!orderData) return;
    
    switch(shippingMethod) {
        case 'standard':
            orderData.shipping = 9.99;
            break;
        case 'express':
            orderData.shipping = 19.99;
            break;
        case 'overnight':
            orderData.shipping = 29.99;
            break;
        default:
            orderData.shipping = 9.99;
    }
    
    orderData.total = orderData.subtotal + orderData.shipping + orderData.tax - (orderData.discount || 0);
    
    const shippingElement = document.querySelector('.shipping-amount');
    const totalElement = document.querySelector('.total-amount');
    
    if (shippingElement) {
        shippingElement.textContent = `$${orderData.shipping.toFixed(2)}`;
    }
    
    if (totalElement) {
        totalElement.textContent = `$${orderData.total.toFixed(2)}`;
    }
}

// ===================================================================
// 9. جمع بيانات النموذج
// ===================================================================
function collectFormData() {
    const formData = {
        shipping: {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            address: document.getElementById('address').value.trim(),
            city: document.getElementById('city').value.trim(),
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value.trim(),
            country: document.getElementById('country').value,
            phone: document.getElementById('phone').value.trim()
        },
        shippingMethod: document.querySelector('input[name="shipping"]:checked')?.id || 'standard',
        paymentMethod: document.querySelector('.payment-tab.active')?.dataset.tab || 'card',
        paymentDetails: {}
    };
    
    if (formData.paymentMethod === 'card') {
        formData.paymentDetails = {
            cardNumber: document.getElementById('cardNumber').value.trim(),
            expiry: document.getElementById('expiry').value.trim(),
            cvv: document.getElementById('cvv').value.trim(),
            cardName: document.getElementById('cardName').value.trim()
        };
    }
    
    return formData;
}

// ===================================================================
// 10. التحقق من صحة النموذج
// ===================================================================
function validateForm(formData) {
    // التحقق من بيانات الشحن
    const shipping = formData.shipping;
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode', 'phone'];
    
    for (const field of requiredFields) {
        if (!shipping[field]) {
            alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
            return false;
        }
    }
    
    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shipping.email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    // إذا كانت طريقة الدفع بطاقة ائتمان
    if (formData.paymentMethod === 'card') {
        const cardDetails = formData.paymentDetails;
        
        // التحقق من رقم البطاقة (16 رقم)
        const cardNumber = cardDetails.cardNumber.replace(/\s/g, '');
        if (!/^\d{16}$/.test(cardNumber)) {
            alert('Please enter a valid 16-digit card number');
            return false;
        }
        
        // التحقق من تاريخ الانتهاء
        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!expiryRegex.test(cardDetails.expiry)) {
            alert('Please enter a valid expiry date (MM/YY)');
            return false;
        }
        
        // التحقق من CVV
        if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
            alert('Please enter a valid CVV (3 or 4 digits)');
            return false;
        }
        
        if (!cardDetails.cardName.trim()) {
            alert('Please enter the name on card');
            return false;
        }
    }
    
    // التحقق من الموافقة على الشروط
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms.checked) {
        alert('Please agree to the Terms & Conditions');
        return false;
    }
    
    return true;
}

// ===================================================================
// 11. حفظ الطلب في Firebase
// ===================================================================
async function saveOrderToFirebase(orderData, formData) {
    try {
        const userData = getCurrentUserData();
        
        const orderDoc = {
            userId: userData?.uid || 'guest',
            userEmail: userData?.email || formData.shipping.email,
            userName: `${formData.shipping.firstName} ${formData.shipping.lastName}`,
            items: orderData.cart,
            shippingAddress: formData.shipping,
            shippingMethod: formData.shippingMethod,
            paymentMethod: formData.paymentMethod,
            subtotal: orderData.subtotal,
            shipping: orderData.shipping,
            tax: orderData.tax,
            discount: orderData.discount || 0,
            total: orderData.total,
            couponCode: orderData.couponCode || null,
            orderNumber: generateOrderNumber(),
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        
        const ordersRef = collection(db, 'orders');
        const docRef = await addDoc(ordersRef, orderDoc);
        
        console.log('Order saved successfully with ID:', docRef.id);
        return { success: true, orderId: docRef.id, orderNumber: orderDoc.orderNumber };
        
    } catch (error) {
        console.error('Error saving order to Firebase:', error);
        return { success: false, error: error.message };
    }
}

// ===================================================================
// 12. توليد رقم طلب فريد
// ===================================================================
function generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `STYLE${timestamp}${random}`.substring(0, 15);
}

// ===================================================================
// 13. عرض نافذة النجاح
// ===================================================================
function showSuccessModal(orderNumber, orderTotal) {
    const modal = document.getElementById('successModal');
    const orderNumberElement = modal.querySelector('.order-number');
    const orderTotalElement = modal.querySelector('.order-total');
    const deliveryDateElement = modal.querySelector('.delivery-date');
    
    // تحديث البيانات في المودال
    orderNumberElement.textContent = `#${orderNumber}`;
    orderTotalElement.textContent = `$${orderTotal.toFixed(2)}`;
    
    // حساب تاريخ التوصيل المتوقع
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7); // إضافة 7 أيام
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    deliveryDateElement.textContent = deliveryDate.toLocaleDateString('en-US', options);
    
    // عرض المودال
    modal.style.display = 'flex';
}

// ===================================================================
// 14. مسح العربة بعد الطلب الناجح
// ===================================================================
function clearCartAfterOrder() {
    localStorage.removeItem('styleshop_cart');
    sessionStorage.removeItem('pending_order');
    cart = [];
    orderData = null;
    updateCartCount();
}

// ===================================================================
// 15. تهيئة المستمعين للأحداث
// ===================================================================
function initializeEventListeners() {
    // زر تقديم الطلب
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // جمع بيانات النموذج
            const formData = collectFormData();
            
            // التحقق من صحة البيانات
            if (!validateForm(formData)) return;
            
            // تعطيل الزر أثناء المعالجة
            placeOrderBtn.disabled = true;
            placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            try {
                // حفظ الطلب في Firebase
                const result = await saveOrderToFirebase(orderData, formData);
                
                if (result.success) {
                    // عرض نافذة النجاح
                    showSuccessModal(result.orderNumber, orderData.total);
                    
                    // مسح العربة
                    clearCartAfterOrder();
                } else {
                    alert(`Error placing order: ${result.error}`);
                    placeOrderBtn.disabled = false;
                    placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Place Order';
                }
                
            } catch (error) {
                console.error('Error in order processing:', error);
                alert('An error occurred while processing your order. Please try again.');
                placeOrderBtn.disabled = false;
                placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Place Order';
            }
        });
    }
    
    // أزرار طريقة الشحن
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    shippingOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            updateShippingCost(e.target.id);
        });
    });
    
    // أزرار طريقة الدفع
    const paymentTabs = document.querySelectorAll('.payment-tab');
    paymentTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // إزالة النشاط من جميع الأزرار
            paymentTabs.forEach(t => t.classList.remove('active'));
            // إخفاء جميع محتويات الدفع
            document.querySelectorAll('.payment-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // تفعيل الزر المحدد
            tab.classList.add('active');
            // عرض المحتوى المناسب
            const tabId = tab.dataset.tab;
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
    
    // أزرار المودال
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => {
            window.location.href = 'men.html';
        });
    }
    
    const viewOrderBtn = document.getElementById('viewOrderBtn');
    if (viewOrderBtn) {
        viewOrderBtn.addEventListener('click', () => {
            // يمكنك هنا توجيه المستخدم إلى صفحة تفاصيل الطلب
            alert('Order details page will be implemented soon!');
        });
    }
    
    // إغلاق المودال عند النقر خارجها
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// ===================================================================
// 16. التحقق من حالة المستخدم والعربة
// ===================================================================
function checkPreconditions() {
    // التحقق من تسجيل الدخول
    if (!checkLoginStatus()) {
        alert('Please log in to proceed with checkout.');
        window.location.href = 'login.html?redirect=checkout';
        return false;
    }
    
    // التحقق من وجود طلب في sessionStorage
    if (!loadOrderData()) {
        alert('No order data found. Please add items to your cart first.');
        window.location.href = 'cart.html';
        return false;
    }
    
    // التحقق من وجود عناصر في العربة
    if (!cart || cart.length === 0) {
        alert('Your cart is empty. Please add items to your cart first.');
        window.location.href = 'cart.html';
        return false;
    }
    
    return true;
}

// ===================================================================
// 17. تهيئة الصفحة عند التحميل
// ===================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout page loaded');
    
    // التحقق من الشروط المسبقة
    if (!checkPreconditions()) return;
    
    // تهيئة بيانات المستخدم
    currentUser = getCurrentUserData();
    
    // تعبئة نموذج البريد الإلكتروني إذا كان المستخدم مسجلاً
    if (currentUser && currentUser.email) {
        const emailInput = document.getElementById('email');
        if (emailInput && !emailInput.value) {
            emailInput.value = currentUser.email;
        }
    }
    
    // عرض العناصر وتحديث الملخص
    renderOrderItems();
    updateOrderSummary();
    updateCartCount();
    
    // تهيئة المستمعين للأحداث
    initializeEventListeners();
    
    console.log('Checkout initialized successfully');
});

// ===================================================================
// 18. تصدير الدوال للاستخدام الخارجي
// ===================================================================
export {
    loadOrderData,
    updateOrderSummary,
    validateForm,
    saveOrderToFirebase
};