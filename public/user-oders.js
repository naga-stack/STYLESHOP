// User Orders Page JavaScript
// This file handles orders display for regular users

// ===================================================================
// 1. متغيرات عامة
// ===================================================================
let userOrders = [];
let currentPage = 1;
const ordersPerPage = 10;

// ===================================================================
// 2. دوال المساعدة
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

function updateCartCount() {
    const savedCart = localStorage.getItem('styleshop_cart');
    if (savedCart) {
        const cart = JSON.parse(savedCart);
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        document.querySelectorAll('.cart-count').forEach(element => {
            element.textContent = totalItems;
        });
    }
}

// ===================================================================
// 3. جلب الطلبات من Firebase
// ===================================================================
async function fetchUserOrders() {
    try {
        const currentUser = getCurrentUserData();
        
        if (!currentUser) {
            throw new Error('User not logged in');
        }
        
        console.log('Fetching orders for user:', currentUser.email);
        
        // عرض حالة التحميل
        showLoadingState();
        
        // الحل البديل: نجيب كل الطلبات ونفلترها يدوياً
        // لأن الـ Index في Firebase مطلوب للـ query المعقد
        
        const db = window.firestoreDB;
        const { collection, query, orderBy, getDocs } = window.firestoreFuncs;
        
        // جلب كل الطلبات من Firebase
        const ordersRef = collection(db, 'orders');
        const allOrdersQuery = query(ordersRef, orderBy('createdAt', 'desc'));
        
        const querySnapshot = await getDocs(allOrdersQuery);
        
        userOrders = [];
        querySnapshot.forEach((doc) => {
            const orderData = doc.data();
            const orderUserId = orderData.userId || orderData.userEmail;
            const currentUserId = currentUser.uid || currentUser.email;
            
            // تصفية الطلبات الخاصة بالمستخدم الحالي فقط
            if (orderUserId === currentUserId) {
                userOrders.push({
                    id: doc.id,
                    ...orderData,
                    createdAt: orderData.createdAt?.toDate() || new Date()
                });
            }
        });
        
        console.log(`Found ${userOrders.length} orders for current user`);
        
        if (userOrders.length === 0) {
            // جرب طريقة ثانية للبحث
            const allOrders = [];
            querySnapshot.forEach((doc) => {
                const orderData = doc.data();
                allOrders.push({
                    id: doc.id,
                    ...orderData,
                    createdAt: orderData.createdAt?.toDate() || new Date()
                });
            });
            
            console.log(`Total orders in database: ${allOrders.length}`);
            console.log('All orders:', allOrders);
            
            // عرض رسالة للمستخدم
            showInfoMessage('No orders found for your account. Make sure you are logged in with the correct account.');
        }
        
        // تحديث الإحصائيات
        updateOrderStats();
        
        // عرض الطلبات
        renderOrdersTable();
        
        // إخفاء حالة التحميل
        hideLoadingState();
        
    } catch (error) {
        console.error('Error fetching orders:', error);
        
        if (error.message.includes('index')) {
            // استخدام بيانات تجريبية أثناء انتظار الـ Index
            console.log('Using mock data while waiting for Firebase index...');
            useMockOrdersData();
            showInfoMessage('Note: Using demo data. Real orders will appear once Firebase index is ready.');
        } else {
            showErrorState(error.message);
        }
    }
}

// ===================================================================
// 4. بيانات تجريبية للاختبار
// ===================================================================
function useMockOrdersData() {
    const currentUser = getCurrentUserData();
    
    const mockOrders = [
        {
            id: 'order1',
            orderNumber: 'STYLE2024-001',
            userId: currentUser?.uid || currentUser?.email || 'demo-user',
            status: 'delivered',
            createdAt: new Date('2024-01-15'),
            items: [
                { 
                    name: 'Premium Hoodie', 
                    price: 79.99, 
                    quantity: 1, 
                    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    size: 'M',
                    color: 'Black'
                },
                { 
                    name: 'Urban Sneakers', 
                    price: 129.99, 
                    quantity: 1, 
                    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    size: '42',
                    color: 'White'
                }
            ],
            subtotal: 209.98,
            shipping: 9.99,
            tax: 16.80,
            discount: 0,
            total: 236.77,
            shippingMethod: 'Standard Shipping',
            paymentMethod: 'Credit Card',
            shippingAddress: {
                firstName: currentUser?.displayName?.split(' ')[0] || 'John',
                lastName: currentUser?.displayName?.split(' ')[1] || 'Doe',
                address: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'USA',
                phone: '123-456-7890'
            }
        },
        {
            id: 'order2',
            orderNumber: 'STYLE2024-002',
            userId: currentUser?.uid || currentUser?.email || 'demo-user',
            status: 'shipped',
            createdAt: new Date('2024-01-10'),
            items: [
                { 
                    name: 'Designer Pants', 
                    price: 89.99, 
                    quantity: 2, 
                    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    size: '32',
                    color: 'Blue'
                }
            ],
            subtotal: 179.98,
            shipping: 0,
            tax: 14.40,
            discount: 18.00,
            total: 176.38,
            shippingMethod: 'Express Shipping',
            paymentMethod: 'PayPal',
            shippingAddress: {
                firstName: currentUser?.displayName?.split(' ')[0] || 'John',
                lastName: currentUser?.displayName?.split(' ')[1] || 'Doe',
                address: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'USA',
                phone: '123-456-7890'
            }
        },
        {
            id: 'order3',
            orderNumber: 'STYLE2024-003',
            userId: currentUser?.uid || currentUser?.email || 'demo-user',
            status: 'processing',
            createdAt: new Date('2024-01-05'),
            items: [
                { 
                    name: 'Summer T-Shirt', 
                    price: 29.99, 
                    quantity: 1, 
                    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    size: 'L',
                    color: 'Red'
                },
                { 
                    name: 'Casual Shorts', 
                    price: 49.99, 
                    quantity: 1, 
                    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    size: 'M',
                    color: 'Gray'
                }
            ],
            subtotal: 79.98,
            shipping: 9.99,
            tax: 6.40,
            discount: 8.00,
            total: 88.37,
            shippingMethod: 'Standard Shipping',
            paymentMethod: 'Credit Card',
            shippingAddress: {
                firstName: currentUser?.displayName?.split(' ')[0] || 'John',
                lastName: currentUser?.displayName?.split(' ')[1] || 'Doe',
                address: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'USA',
                phone: '123-456-7890'
            }
        }
    ];
    
    userOrders = mockOrders;
    
    // تحديث الإحصائيات
    updateOrderStats();
    
    // عرض الطلبات
    renderOrdersTable();
    
    // إخفاء حالة التحميل
    hideLoadingState();
}

// ===================================================================
// 5. تحديث إحصائيات الطلبات
// ===================================================================
function updateOrderStats() {
    const statusCounts = {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
    };
    
    userOrders.forEach(order => {
        const status = order.status?.toLowerCase() || 'pending';
        if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
        }
    });
    
    // تحديث العدادات
    document.getElementById('totalOrders').textContent = userOrders.length;
    document.getElementById('pendingOrders').textContent = statusCounts.pending;
    document.getElementById('shippedOrders').textContent = statusCounts.shipped;
    document.getElementById('deliveredOrders').textContent = statusCounts.delivered;
}

// ===================================================================
// 6. عرض جدول الطلبات
// ===================================================================
function renderOrdersTable() {
    const tableBody = document.getElementById('ordersTableBody');
    
    if (!userOrders || userOrders.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>No Orders Yet</h3>
                    <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
                    <a href="men.html" class="btn-primary">
                        <i class="fas fa-shopping-bag"></i>
                        Start Shopping
                    </a>
                </td>
            </tr>
        `;
        return;
    }
    
    // تطبيق الفلاتر
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const sortFilter = document.getElementById('sortFilter')?.value || 'newest';
    
    let filteredOrders = userOrders.filter(order => {
        // فلترة حسب البحث
        const searchMatch = !searchTerm || 
            (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm)) ||
            (order.id && order.id.toLowerCase().includes(searchTerm));
        
        // فلترة حسب الحالة
        const statusMatch = statusFilter === 'all' || order.status?.toLowerCase() === statusFilter;
        
        return searchMatch && statusMatch;
    });
    
    // تطبيق الترتيب
    filteredOrders = sortOrders(filteredOrders, sortFilter);
    
    // تطبيق الـ Pagination
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const ordersToShow = filteredOrders.slice(startIndex, endIndex);
    
    // إنشاء صفوف الجدول
    tableBody.innerHTML = ordersToShow.map(order => {
        const orderDate = formatDate(order.createdAt);
        const totalAmount = order.total?.toFixed(2) || '0.00';
        const status = order.status?.toLowerCase() || 'pending';
        
        // إنشاء قائمة العناصر المختصرة
        const itemsList = order.items?.map(item => 
            `${item.name} (${item.quantity || 1}x)`
        ).join(', ') || 'No items';
        
        const shortenedItems = itemsList.length > 50 ? 
            itemsList.substring(0, 50) + '...' : itemsList;
        
        // ألوان الحالات
        const statusColors = {
            'pending': 'status-pending',
            'processing': 'status-processing',
            'shipped': 'status-shipped',
            'delivered': 'status-delivered',
            'cancelled': 'status-cancelled'
        };
        
        const statusLabels = {
            'pending': 'Pending',
            'processing': 'Processing',
            'shipped': 'Shipped',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        };
        
        return `
            <tr>
                <td>
                    <strong style="color: #8b5cf6;">${order.orderNumber || `#${order.id.substring(0, 8)}`}</strong>
                </td>
                <td>${orderDate}</td>
                <td>
                    <div class="item-list">
                        <span class="item-name" title="${itemsList}">${shortenedItems}</span>
                        <small style="color: #94a3b8;">${order.items?.length || 0} items</small>
                    </div>
                </td>
                <td class="order-amount">
                    $${totalAmount}
                </td>
                <td>
                    <span class="order-status ${statusColors[status]}">
                        ${statusLabels[status]}
                    </span>
                </td>
                <td>
                    <div class="order-actions">
                        <button class="action-btn view-btn" onclick="viewOrderDetails('${order.id}')" title="View Details">
                            <i class="fas fa-eye"></i> Details
                        </button>
                        ${status === 'shipped' ? `
                            <button class="action-btn track-btn" onclick="trackOrder('${order.id}')" title="Track Order">
                                <i class="fas fa-truck"></i> Track
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // عرض الـ Pagination
    renderPagination(filteredOrders.length);
}

// ===================================================================
// 7. ترتيب الطلبات
// ===================================================================
function sortOrders(orders, sortType) {
    const sortedOrders = [...orders];
    
    switch(sortType) {
        case 'newest':
            return sortedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case 'oldest':
            return sortedOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case 'total_high':
            return sortedOrders.sort((a, b) => (b.total || 0) - (a.total || 0));
        case 'total_low':
            return sortedOrders.sort((a, b) => (a.total || 0) - (b.total || 0));
        default:
            return sortedOrders;
    }
}

// ===================================================================
// 8. تنسيق التاريخ
// ===================================================================
function formatDate(date) {
    if (!date) return 'Unknown date';
    
    try {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return date.toString();
    }
}

// ===================================================================
// 9. عرض تفاصيل الطلب في المودال
// ===================================================================
function viewOrderDetails(orderId) {
    const order = userOrders.find(o => o.id === orderId);
    if (!order) {
        alert('Order not found!');
        return;
    }
    
    // تعبئة بيانات المودال
    document.getElementById('modalOrderNumber').textContent = order.orderNumber || `#${order.id.substring(0, 8)}`;
    document.getElementById('modalOrderDate').textContent = formatDate(order.createdAt);
    document.getElementById('modalPaymentMethod').textContent = order.paymentMethod || 'Credit Card';
    document.getElementById('modalShippingMethod').textContent = order.shippingMethod || 'Standard Shipping';
    
    // تحديث حالة الطلب
    const statusElement = document.getElementById('modalStatus');
    const status = order.status?.toLowerCase() || 'pending';
    statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    statusElement.className = `order-status-badge ${status}`;
    
    // تعبئة العنوان
    const shippingAddress = order.shippingAddress || {};
    document.getElementById('modalShippingAddress').innerHTML = `
        <strong>${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}</strong><br>
        ${shippingAddress.address || ''}<br>
        ${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.zipCode || ''}<br>
        ${shippingAddress.country || ''}<br>
        📞 ${shippingAddress.phone || 'N/A'}
    `;
    
    // تعبئة العناصر
    const orderItemsContainer = document.getElementById('modalOrderItems');
    orderItemsContainer.innerHTML = order.items?.map(item => `
        <div class="order-item-detail">
            <div class="item-image-medium">
                <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${item.name}">
            </div>
            <div class="item-details-medium">
                <div class="item-name-medium">${item.name}</div>
                <div class="item-info-medium">
                    ${item.size ? `Size: ${item.size}` : ''}
                    ${item.color ? ` | Color: ${item.color}` : ''}
                </div>
                <div class="item-quantity-medium">Quantity: ${item.quantity || 1}</div>
            </div>
            <div class="item-price-medium">
                $${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
            </div>
        </div>
    `).join('') || '<p>No items found</p>';
    
    // تعبئة الملخص
    document.getElementById('modalSubtotal').textContent = `$${order.subtotal?.toFixed(2) || '0.00'}`;
    document.getElementById('modalShipping').textContent = order.shipping === 0 ? 'FREE' : `$${order.shipping?.toFixed(2) || '0.00'}`;
    document.getElementById('modalTax').textContent = `$${order.tax?.toFixed(2) || '0.00'}`;
    document.getElementById('modalDiscount').textContent = order.discount ? `-$${order.discount.toFixed(2)}` : '$0.00';
    document.getElementById('modalTotal').textContent = `$${order.total?.toFixed(2) || '0.00'}`;
    
    // عرض المودال
    const modal = document.getElementById('orderDetailsModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// ===================================================================
// 10. تتبع الطلب
// ===================================================================
function trackOrder(orderId) {
    const order = userOrders.find(o => o.id === orderId);
    if (order) {
        alert(`Tracking for order #${order.orderNumber || order.id.substring(0, 8)}:\n\n` +
              `Status: ${order.status}\n` +
              `Shipping Method: ${order.shippingMethod}\n` +
              `Estimated Delivery: 5-7 business days\n\n` +
              `You will receive tracking updates via email.`);
    }
}

// ===================================================================
// 11. إعداد الـ Pagination
// ===================================================================
function renderPagination(totalFilteredOrders) {
    const paginationDiv = document.getElementById('pagination');
    const totalPages = Math.ceil(totalFilteredOrders / ordersPerPage);
    
    if (totalPages <= 1) {
        paginationDiv.innerHTML = `<div style="color: #666; text-align: center;">Showing ${Math.min(totalFilteredOrders, ordersPerPage)} of ${totalFilteredOrders} orders</div>`;
        return;
    }
    
    let paginationHTML = '<div style="display: flex; align-items: center; gap: 12px; justify-content: center;">';
    
    // زر السابق
    paginationHTML += `
        <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} 
            onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i> Previous
        </button>
    `;
    
    // أرقام الصفحات
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `
                <button class="page-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += `<span style="padding: 0 5px;">...</span>`;
        }
    }
    
    // زر التالي
    paginationHTML += `
        <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} 
            onclick="changePage(${currentPage + 1})">
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationHTML += '</div>';
    paginationDiv.innerHTML = paginationHTML;
}

// ===================================================================
// 12. تغيير الصفحة
// ===================================================================
function changePage(page) {
    currentPage = page;
    renderOrdersTable();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================================================
// 13. حالات التحميل والخطأ
// ===================================================================
function showLoadingState() {
    const tableBody = document.getElementById('ordersTableBody');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="loading">
                    <div class="loading-spinner"></div>
                    Loading your orders...
                </td>
            </tr>
        `;
    }
}

function hideLoadingState() {
    // يتم إخفاؤه تلقائياً عند عرض الطلبات
}

function showErrorState(message) {
    const tableBody = document.getElementById('ordersTableBody');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state error">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Error Loading Orders</h3>
                    <p>${message}</p>
                    <button class="btn-primary" onclick="fetchUserOrders()">
                        <i class="fas fa-redo"></i>
                        Try Again
                    </button>
                </td>
            </tr>
        `;
    }
}

function showInfoMessage(message) {
    const tableBody = document.getElementById('ordersTableBody');
    if (tableBody && tableBody.children.length > 0) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'info-message';
        infoDiv.innerHTML = `
            <div style="background: #e3f2fd; color: #1976d2; padding: 12px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #1976d2;">
                <i class="fas fa-info-circle"></i> ${message}
            </div>
        `;
        tableBody.parentNode.insertBefore(infoDiv, tableBody);
    }
}

// ===================================================================
// 14. إعداد الفلاتر والبحث
// ===================================================================
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentPage = 1;
            renderOrdersTable();
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentPage = 1;
            renderOrdersTable();
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            currentPage = 1;
            renderOrdersTable();
        });
    }
}

// ===================================================================
// 15. إعداد المودال
// ===================================================================
function setupModal() {
    const modalClose = document.getElementById('modalClose');
    const modal = document.getElementById('orderDetailsModal');
    
    if (modalClose && modal) {
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    const printBtn = document.getElementById('printOrderBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
    
    const contactBtn = document.getElementById('contactSupportBtn');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            window.location.href = 'contact.html';
        });
    }
}

// ===================================================================
// 16. التحقق من حالة المستخدم
// ===================================================================
function checkPreconditions() {
    // التحقق من تسجيل الدخول
    if (!checkLoginStatus()) {
        alert('Please log in to view your orders.');
        window.location.href = 'login.html?redirect=orders.html';
        return false;
    }
    
    return true;
}

// ===================================================================
// 17. التهيئة الرئيسية
// ===================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('User Orders page loaded');
    
    // التحقق من تسجيل الدخول
    if (!checkPreconditions()) return;
    
    // تحديث عدد العربة
    updateCartCount();
    
    // إعداد الفلاتر
    setupFilters();
    
    // إعداد المودال
    setupModal();
    
    // تحميل الطلبات
    fetchUserOrders();
    
    console.log('User Orders page initialized successfully');
});

// ===================================================================
// 18. جعل الدوال متاحة عالمياً
// ===================================================================
window.viewOrderDetails = viewOrderDetails;
window.trackOrder = trackOrder;
window.changePage = changePage;
window.fetchUserOrders = fetchUserOrders;