// profile.js - الإصدار المعدل مع إضافة عدد الطلبات الفعلي وListener

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZaJqweCcEcqCglRHu1UrkrmuQAXEe8Lo",
    authDomain: "my-shop-82459.firebaseapp.com",
    projectId: "my-shop-82459",
    storageBucket: "my-shop-82459.firebasestorage.app",
    messagingSenderId: "744913484296",
    appId: "1:744913484296:web:b2c4614d773518b4112fbd",
    measurementId: "G-5EPCPXRVG2"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;
let ordersListener = null; // لتخزين الـ listener

// Check authentication state
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        updateUserProfile(user);
        loadUserData();
        setupNavbarForLoggedInUser(user);
        setupOrdersListener(); // إعداد الـ listener للطلبات
        
        // تحقق من حالة الإيميل
        if (!user.emailVerified) {
            addEmailVerificationWarning(user);
        }
    } else {
        // إيقاف الـ listener عند تسجيل الخروج
        if (ordersListener) {
            ordersListener();
            ordersListener = null;
        }
        window.location.href = 'login.html';
    }
});

// إعداد listener للطلبات للتحديث الفوري
function setupOrdersListener() {
    if (!currentUser) return;
    
    // إيقاف أي listener سابق
    if (ordersListener) {
        ordersListener();
    }
    
    // استمع للتغييرات في مجموعة الطلبات الخاصة بالمستخدم
    ordersListener = db.collection('orders')
        .where('userId', '==', currentUser.uid)
        .onSnapshot((snapshot) => {
            // عند أي تغيير، قم بتحديث عدد الطلبات
            const ordersCount = snapshot.size;
            updateOrdersCount(ordersCount);
        }, (error) => {
            console.error("Orders listener error:", error);
            // في حالة الخطأ، حاول إعادة التحميل بعد 5 ثواني
            setTimeout(() => {
                if (currentUser) setupOrdersListener();
            }, 5000);
        });
}

// Add email verification warning
function addEmailVerificationWarning(user) {
    const profileHeader = document.querySelector('.profile-header');
    if (!profileHeader) return;
    
    const existingWarning = document.querySelector('.verification-warning');
    if (existingWarning) existingWarning.remove();
    
    const warningDiv = document.createElement('div');
    warningDiv.className = 'verification-warning';
    warningDiv.innerHTML = `
        <div class="warning-content">
            <i class="fas fa-exclamation-triangle"></i>
            <div class="warning-text">
                <strong>Email not verified!</strong>
                <p>Please verify your email to access all features.</p>
            </div>
            <button class="btn-small" id="resendVerificationBtn">
                <i class="fas fa-paper-plane"></i> Resend Email
            </button>
        </div>
    `;
    
    profileHeader.appendChild(warningDiv);
    
    // Add event listener to resend button
    document.getElementById('resendVerificationBtn').addEventListener('click', async () => {
        try {
            const actionCodeSettings = {
                url: window.location.origin,
                handleCodeInApp: false
            };
            
            await user.sendEmailVerification(actionCodeSettings);
            showNotification('✅ Verification email sent! Check your inbox.', 'success');
            
        } catch (error) {
            console.error("Verification error:", error);
            
            // إذا فشل مع continueUrl، جرب بدونه
            if (error.code === 'auth/unauthorized-continue-uri') {
                try {
                    await user.sendEmailVerification(); // بدون إعدادات
                    showNotification('✅ Verification email sent!', 'success');
                } catch (simpleError) {
                    showNotification('❌ Error: ' + simpleError.message, 'error');
                }
            } else {
                showNotification('❌ Error: ' + error.message, 'error');
            }
        }
    });
}

// Update profile information
function updateUserProfile(user) {
    const name = user.displayName || user.email.split('@')[0];
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    
    // Update avatar
    const avatar = document.getElementById('profileAvatar');
    if (avatar) avatar.textContent = initials;
    
    // Update name fields
    const nameFields = ['profileName', 'userFullName'];
    nameFields.forEach(field => {
        const element = document.getElementById(field);
        if (element) element.textContent = name;
    });
    
    // Update email fields
    const emailFields = ['profileEmail', 'userEmail'];
    emailFields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.textContent = user.email;
            
            // Add verification badge if email is verified
            if (user.emailVerified) {
                const badge = document.createElement('span');
                badge.className = 'verified-badge';
                badge.innerHTML = '<i class="fas fa-check-circle"></i> Verified';
                element.appendChild(badge);
            }
        }
    });
    
    // Update member since date
    const memberSinceElement = document.getElementById('memberSince');
    if (memberSinceElement && user.metadata.creationTime) {
        const memberSince = new Date(user.metadata.creationTime);
        memberSinceElement.textContent = memberSince.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
}

// Count user orders function
async function countUserOrders() {
    if (!currentUser) return 0;
    
    try {
        const ordersQuery = await db.collection('orders')
            .where('userId', '==', currentUser.uid)
            .get();
        
        return ordersQuery.size; // إرجاع عدد الطلبات
    } catch (error) {
        console.error("Error counting orders:", error);
        return 0;
    }
}

// Function to update orders count in the UI with animation
function updateOrdersCount(count) {
    const ordersCountElement = document.querySelector('.stat-item:nth-child(1) .stat-number');
    if (ordersCountElement) {
        ordersCountElement.textContent = count;
        
        // إضافة تأثير عند التحديث
        ordersCountElement.classList.add('updated');
        setTimeout(() => {
            ordersCountElement.classList.remove('updated');
        }, 500);
    }
}

// دالة لعد العناصر في المفضلة
async function countWishlistItems() {
    if (!currentUser) return 0;
    
    try {
        const wishlistDoc = await db.collection('wishlists').doc(currentUser.uid).get();
        if (wishlistDoc.exists) {
            const wishlistData = wishlistDoc.data();
            return wishlistData.items?.length || 0;
        }
        return 0;
    } catch (error) {
        console.error("Error counting wishlist:", error);
        return 0;
    }
}

// دالة لعد التقييمات
async function countUserReviews() {
    if (!currentUser) return 0;
    
    try {
        const reviewsQuery = await db.collection('reviews')
            .where('userId', '==', currentUser.uid)
            .get();
        
        return reviewsQuery.size;
    } catch (error) {
        console.error("Error counting reviews:", error);
        return 0;
    }
}

// تحديث جميع الإحصائيات
async function updateAllStats() {
    if (!currentUser) return;
    
    try {
        // عدد الطلبات
        const ordersCount = await countUserOrders();
        updateStat('orders', ordersCount);
        
        // عدد المنتجات المفضلة (Wishlist)
        const wishlistCount = await countWishlistItems();
        updateStat('wishlist', wishlistCount);
        
        // عدد التقييمات (Reviews)
        const reviewsCount = await countUserReviews();
        updateStat('reviews', reviewsCount);
        
    } catch (error) {
        console.error("Error updating stats:", error);
    }
}

// دالة عامة لتحديث أي إحصائية
function updateStat(statType, count) {
    const statIndex = getStatIndex(statType);
    const statElement = document.querySelector(`.stat-item:nth-child(${statIndex}) .stat-number`);
    if (statElement) {
        statElement.textContent = count;
        
        // تأثير عند التحديث
        statElement.classList.add('updated');
        setTimeout(() => {
            statElement.classList.remove('updated');
        }, 500);
    }
}

// للحصول على الفهرس الصحيح
function getStatIndex(statType) {
    switch(statType) {
        case 'orders': return 1;
        case 'wishlist': return 2;
        case 'reviews': return 3;
        default: return 1;
    }
}

// Load additional user data from Firestore
async function loadUserData() {
    if (!currentUser) return;
    
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            // Update phone number
            if (userData.phone) {
                const phoneElement = document.getElementById('userPhone');
                if (phoneElement) phoneElement.textContent = userData.phone;
            }
            
            // Update shipping address
            if (userData.address) {
                const addressElement = document.getElementById('shippingAddress');
                if (addressElement) {
                    addressElement.innerHTML = 
                        `<p><strong>${userData.address.name || ''}</strong></p>
                         <p>${userData.address.street || ''}</p>
                         <p>${userData.address.city || ''}, ${userData.address.state || ''} ${userData.address.zip || ''}</p>
                         <p>${userData.address.country || ''}</p>`;
                }
            }
        }
        
        // ✅ تحديث جميع الإحصائيات
        await updateAllStats();
        
        // ✅ تحميل الطلبات الحديثة
        loadRecentOrders();
        
    } catch (error) {
        console.error("Error loading user data:", error);
    }
}

// Load recent orders from Firestore
async function loadRecentOrders() {
    if (!currentUser) return;
    
    const ordersContainer = document.getElementById('recentOrders');
    const ordersList = document.getElementById('ordersList');
    const loadingElement = document.querySelector('.loading-orders');
    const noOrdersElement = document.querySelector('.no-orders');
    
    if (!ordersContainer || !ordersList) return;
    
    try {
        // Query orders for current user, sorted by date (newest first)
        const ordersQuery = await db.collection('orders')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .limit(5) // فقط آخر 5 طلبات
            .get();
        
        // Hide loading
        if (loadingElement) loadingElement.style.display = 'none';
        
        if (ordersQuery.empty) {
            // Show no orders message
            if (noOrdersElement) noOrdersElement.style.display = 'block';
            return;
        }
        
        // Show orders list
        ordersList.style.display = 'flex';
        
        // Clear existing orders
        ordersList.innerHTML = '';
        
        // Process each order
        ordersQuery.forEach((doc) => {
            const order = doc.data();
            const orderId = doc.id;
            
            // Format date
            const orderDate = order.createdAt?.toDate() || new Date();
            const formattedDate = orderDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            // Calculate total
            const total = order.items?.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0) || 0;
            
            // Get product images (first 3 products)
            const productImages = order.items?.slice(0, 3).map(item => item.image).filter(Boolean) || [];
            
            // Create order card
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            orderCard.dataset.orderId = orderId;
            
            // Determine status class
            let statusClass = 'status-pending';
            let statusText = order.status || 'Pending';
            
            switch((order.status || '').toLowerCase()) {
                case 'processing':
                    statusClass = 'status-processing';
                    break;
                case 'shipped':
                    statusClass = 'status-shipped';
                    break;
                case 'delivered':
                    statusClass = 'status-delivered';
                    break;
                case 'cancelled':
                    statusClass = 'status-cancelled';
                    break;
                default:
                    statusClass = 'status-pending';
            }
            
            orderCard.innerHTML = `
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${orderId.substring(0, 8)}</div>
                        <div class="order-date">${formattedDate}</div>
                    </div>
                    <div class="order-status ${statusClass}">
                        <i class="fas fa-circle"></i>
                        ${statusText}
                    </div>
                </div>
                
                <div class="order-products">
                    <div class="product-images">
                        ${productImages.map(img => 
                            `<img src="${img}" alt="Product" class="product-img" 
                                  onerror="this.src='https://via.placeholder.com/40?text=Product'">`
                        ).join('')}
                    </div>
                    <div class="product-count">
                        ${order.items?.length || 0} item${order.items?.length !== 1 ? 's' : ''}
                    </div>
                </div>
                
                <div class="order-footer">
                    <div class="order-total">$${total.toFixed(2)}</div>
                    <button class="view-order-btn" onclick="viewOrderDetails('${orderId}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            `;
            
            ordersList.appendChild(orderCard);
        });
        
        // Add "View All Orders" button if there are orders
        if (!ordersQuery.empty) {
            const viewAllContainer = document.createElement('div');
            viewAllContainer.className = 'view-all-orders';
            viewAllContainer.innerHTML = `
                <a href="orders.html" class="btn btn-outline">
                    <i class="fas fa-list"></i> View All Orders
                </a>
            `;
            ordersList.appendChild(viewAllContainer);
        }
        
    } catch (error) {
        console.error("Error loading orders:", error);
        
        // Show error message
        if (loadingElement) loadingElement.style.display = 'none';
        
        ordersList.innerHTML = `
            <div class="no-orders" style="display: block;">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Error loading orders</h4>
                <p>Please try again later</p>
                <button onclick="loadRecentOrders()" class="btn btn-primary">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }
}

// دالة لعرض تفاصيل الطلب
function viewOrderDetails(orderId) {
    window.location.href = `order-details.html?id=${orderId}`;
}

// Setup navbar for logged in user
function setupNavbarForLoggedInUser(user) {
    const name = user.displayName || user.email.split('@')[0];
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    
    const userAuthSection = document.getElementById('userAuthSection');
    if (!userAuthSection) return;
    
    userAuthSection.innerHTML = `
        <div class="user-menu">
            <button class="user-btn" id="userDropdownBtn">
                <div class="user-avatar">${initials}</div>
                <span class="username">${name}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="dropdown-menu" id="userDropdown">
                <div class="dropdown-header">
                    <div class="dropdown-avatar">${initials}</div>
                    <div class="dropdown-user-info">
                        <div class="dropdown-username">${name}</div>
                        <div class="dropdown-email">${user.email}</div>
                    </div>
                </div>
                <a href="profile.html" class="dropdown-item">
                    <i class="fas fa-user"></i> My Profile
                </a>
                <a href="orders.html" class="dropdown-item">
                    <i class="fas fa-shopping-bag"></i> My Orders
                </a>
                <a href="wishlist.html" class="dropdown-item">
                    <i class="fas fa-heart"></i> Wishlist
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item logout-btn" id="navLogoutBtn">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        </div>
    `;
    
    // Setup dropdown toggle
    const dropdownBtn = document.getElementById('userDropdownBtn');
    const dropdown = document.getElementById('userDropdown');
    const navLogoutBtn = document.getElementById('navLogoutBtn');
    
    if (dropdownBtn && dropdown) {
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    if (navLogoutBtn) {
        navLogoutBtn.addEventListener('click', handleLogout);
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (dropdown && dropdownBtn && 
            !dropdown.contains(e.target) && 
            !dropdownBtn.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

// Handle logout
async function handleLogout() {
    try {
        // إيقاف الـ listener قبل تسجيل الخروج
        if (ordersListener) {
            ordersListener();
            ordersListener = null;
        }
        
        await auth.signOut();
        localStorage.removeItem('styleshop_user');
        sessionStorage.removeItem('styleshop_user');
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Logout error:", error);
        showNotification('Error logging out: ' + error.message, 'error');
    }
}

// Edit profile functionality
document.addEventListener('DOMContentLoaded', () => {
    // Setup mobile menu
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Setup modal functionality if elements exist
    setupModal();
    
    // Setup change password button
    setupChangePassword();
    
    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

function setupModal() {
    const editModal = document.getElementById('editModal');
    const closeModal = document.getElementById('closeModal');
    const cancelEdit = document.getElementById('cancelEdit');
    const editForm = document.getElementById('editForm');
    
    if (!editModal || !closeModal || !cancelEdit || !editForm) return;
    
    // Edit buttons
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editPersonalInfo = document.getElementById('editPersonalInfo');
    const editAddressBtn = document.getElementById('editAddressBtn');
    
    // Modal input fields
    const editName = document.getElementById('editName');
    const editPhone = document.getElementById('editPhone');
    const editAddress = document.getElementById('editAddress');
    
    // Open modal for profile editing
    function openEditModal(type = 'profile') {
        const modalTitle = document.getElementById('modalTitle');
        if (!modalTitle) return;
        
        if (type === 'profile') {
            modalTitle.textContent = 'Edit Profile';
            if (editName) editName.value = currentUser?.displayName || '';
            if (editPhone) {
                const phoneValue = document.getElementById('userPhone')?.textContent;
                editPhone.value = phoneValue || '';
            }
            if (editAddress) editAddress.value = '';
        } else if (type === 'address') {
            modalTitle.textContent = 'Edit Address';
            if (editName) editName.value = '';
            if (editPhone) editPhone.value = '';
            if (editAddress) editAddress.value = '';
        }
        
        editModal.classList.add('active');
    }
    
    // Close modal
    function closeEditModal() {
        editModal.classList.remove('active');
        if (editForm) editForm.reset();
    }
    
    // Event listeners for edit buttons
    editProfileBtn?.addEventListener('click', () => openEditModal('profile'));
    editPersonalInfo?.addEventListener('click', () => openEditModal('profile'));
    editAddressBtn?.addEventListener('click', () => openEditModal('address'));
    
    // Event listeners for modal
    closeModal.addEventListener('click', closeEditModal);
    cancelEdit.addEventListener('click', closeEditModal);
    
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
    
    // Form submission
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!currentUser) return;
        
        try {
            // Update user profile in Firebase
            if (editName && editName.value.trim()) {
                await currentUser.updateProfile({
                    displayName: editName.value.trim()
                });
            }
            
            // Update user data in Firestore
            const userData = {};
            
            if (editPhone && editPhone.value.trim()) {
                userData.phone = editPhone.value.trim();
            }
            
            if (editAddress && editAddress.value.trim()) {
                userData.address = {
                    street: editAddress.value.trim(),
                    updatedAt: new Date().toISOString()
                };
            }
            
            if (Object.keys(userData).length > 0) {
                await db.collection('users').doc(currentUser.uid).set(userData, { merge: true });
            }
            
            // Update UI
            updateUserProfile(currentUser);
            loadUserData();
            
            showNotification('Profile updated successfully!', 'success');
            closeEditModal();
            
        } catch (error) {
            console.error("Error updating profile:", error);
            showNotification('Error updating profile: ' + error.message, 'error');
        }
    });
}

function setupChangePassword() {
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (!changePasswordBtn) return;
    
    changePasswordBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (!currentUser || !currentUser.email) {
            showNotification('You must be logged in to reset password', 'error');
            return;
        }
        
        try {
            // Show loading state
            changePasswordBtn.classList.add('loading');
            changePasswordBtn.disabled = true;
            const originalText = changePasswordBtn.innerHTML;
            changePasswordBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Send password reset email
            await auth.sendPasswordResetEmail(currentUser.email);
            
            showNotification('✅ Password reset email sent! Check your inbox.', 'success');
            
            // Show detailed instructions
            setTimeout(() => {
                alert(`📧 Password Reset Instructions:\n\n` +
                      `Email sent to: ${currentUser.email}\n\n` +
                      `Please check:\n` +
                      `1. Your email inbox\n` +
                      `2. Spam/Junk folder\n` +
                      `3. Promotions tab (if using Gmail)\n\n` +
                      `Click the reset link in the email to continue.`);
            }, 500);
            
        } catch (error) {
            console.error("Password reset error:", error);
            
            let errorMessage = 'Error sending reset email. ';
            switch(error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No user found with this email.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many attempts. Try again later.';
                    break;
                default:
                    errorMessage += error.message;
            }
            
            showNotification(errorMessage, 'error');
            
        } finally {
            // Reset button state
            changePasswordBtn.classList.remove('loading');
            changePasswordBtn.disabled = false;
            changePasswordBtn.innerHTML = '<i class="fas fa-key"></i> Change Password';
        }
    });
}

// Notification function
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) existingNotification.remove();
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `cart-notification ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Add CSS for new elements
function addProfileStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .verification-warning {
            background: linear-gradient(45deg, #fef3c7, #fde68a);
            border: 1px solid #f59e0b;
            border-radius: 12px;
            padding: 1rem;
            margin-top: 1rem;
            animation: fadeIn 0.5s ease;
        }
        
        .warning-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .warning-content i {
            color: #d97706;
            font-size: 1.2rem;
        }
        
        .warning-text {
            flex: 1;
        }
        
        .warning-text strong {
            color: #92400e;
            display: block;
        }
        
        .warning-text p {
            color: #92400e;
            font-size: 0.9rem;
            margin: 0.25rem 0 0;
        }
        
        .btn-small {
            padding: 0.5rem 1rem;
            background: #d97706;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-small:hover {
            background: #b45309;
            transform: translateY(-2px);
        }
        
        .verified-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 500;
            margin-left: 0.5rem;
        }
        
        .cart-notification.fade-out {
            opacity: 0;
            transform: translateX(100%);
            transition: opacity 0.3s, transform 0.3s;
        }
        
        /* ✅ Recent Orders Styles */
        .orders-container {
            margin-top: 1rem;
        }
        
        .loading-orders {
            text-align: center;
            padding: 2rem;
            color: var(--text-secondary);
        }
        
        .loading-orders i {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        
        .no-orders {
            text-align: center;
            padding: 3rem 1rem;
            color: var(--text-secondary);
        }
        
        .no-orders i {
            font-size: 3rem;
            color: var(--gray-light);
            margin-bottom: 1rem;
        }
        
        .no-orders h4 {
            color: var(--text-color);
            margin-bottom: 0.5rem;
        }
        
        .no-orders p {
            margin-bottom: 1.5rem;
        }
        
        .orders-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .order-card {
            background: white;
            border-radius: 12px;
            padding: 1.25rem;
            border: 1px solid var(--border-color);
            transition: var(--transition);
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        
        .order-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow);
        }
        
        .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .order-id {
            font-weight: 600;
            color: var(--primary-color);
            font-size: 0.9rem;
        }
        
        .order-date {
            color: var(--text-secondary);
            font-size: 0.85rem;
        }
        
        .order-status {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .status-pending {
            background: rgba(245, 158, 11, 0.1);
            color: #d97706;
        }
        
        .status-processing {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
        }
        
        .status-shipped {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
        }
        
        .status-delivered {
            background: rgba(16, 185, 129, 0.2);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        .status-cancelled {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }
        
        .order-products {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
            gap: 0.5rem;
        }
        
        .product-images {
            display: flex;
            align-items: center;
        }
        
        .product-img {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            object-fit: cover;
            border: 2px solid white;
            margin-left: -10px;
        }
        
        .product-img:first-child {
            margin-left: 0;
        }
        
        .product-count {
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-left: 0.5rem;
        }
        
        .order-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .order-total {
            font-weight: 600;
            color: var(--text-color);
            font-size: 1.1rem;
        }
        
        .view-order-btn {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .view-order-btn:hover {
            background: var(--primary-dark);
        }
        
        .view-all-orders {
            text-align: center;
            margin-top: 1.5rem;
        }
        
        /* Animations for stats counter */
        .stat-number.updated {
            animation: countUp 0.5s ease;
        }
        
        @keyframes countUp {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.2);
                color: #8b5cf6;
            }
            100% {
                transform: scale(1);
            }
        }
        
        @keyframes fadeIn {
            from { 
                opacity: 0; 
                transform: translateY(-10px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
        
        @media (max-width: 768px) {
            .order-card {
                padding: 1rem;
            }
            
            .order-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }
            
            .order-footer {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.75rem;
            }
            
            .view-order-btn {
                width: 100%;
                justify-content: center;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add styles when page loads
addProfileStyles();