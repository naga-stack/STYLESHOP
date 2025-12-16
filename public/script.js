// =======================================================
// Global Variables and Initial Setup
// =======================================================

// Initialize cart count (يمكن تحديثه من الـ localStorage)
let cartCount = 3; 

// =======================================================
// Authentication Simulation Module (auth)
// =======================================================
const auth = {
    currentUser: null,
    isDropdownOpen: false,
    
    /** Initializes the auth module */
    init() {
        this.checkAuthState();
        this.setupDropdownClose();
    },
    
    /** Checks for stored user session in localStorage or sessionStorage */
    checkAuthState() {
        // 1. Check localStorage (Remember Me)
        const storedUser = localStorage.getItem('styleshop_user');
        
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
        } else {
            // 2. Check sessionStorage
            const sessionUser = sessionStorage.getItem('styleshop_user');
            if (sessionUser) {
                this.currentUser = JSON.parse(sessionUser);
            }
        }
        
        // Update UI based on auth state
        this.updateUI();
    },
    
    /** Updates the navigation actions based on currentUser status */
    updateUI() {
        const navActions = document.querySelector('.nav-actions');
        
        if (this.currentUser && this.currentUser.isLoggedIn) {
            navActions.innerHTML = this.createUserDropdown();
            this.setupDropdownEvents();
        } else {
            navActions.innerHTML = this.createLoginButton();
        }
        
        // ضمان تحديث عدد سلة التسوق
        const cartElement = document.querySelector('.cart-count');
        if (cartElement) {
             cartElement.textContent = cartCount;
        }
    },
    
    /** Generates HTML for the Login button and Cart icon */
    createLoginButton() {
        return `
            <a href="cart.html" class="cart-icon" aria-label="Shopping Cart">
                <i class="fas fa-shopping-bag"></i>
                <span class="cart-count">${cartCount}</span>
            </a>
            <a href="login.html" class="login-btn">
                <i class="fas fa-user"></i>
                <span>LOG IN</span>
            </a>
        `;
    },
    
    /** Generates HTML for the User Dropdown menu and Cart icon */
    createUserDropdown() {
        const user = this.currentUser;
        const displayName = user.displayName || 'User';
        const firstLetter = displayName.charAt(0).toUpperCase();
        
        return `
            <a href="cart.html" class="cart-icon" aria-label="Shopping Cart">
                <i class="fas fa-shopping-bag"></i>
                <span class="cart-count">${cartCount}</span>
            </a>
            <div class="user-menu">
                <button class="user-btn" id="userMenuBtn">
                    <div class="user-avatar">
                        ${firstLetter}
                    </div>
                    <span class="username">${displayName}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-menu" id="userDropdown">
                    <div class="dropdown-header">
                        <div class="dropdown-avatar">${firstLetter}</div>
                        <div class="dropdown-user-info">
                            <div class="dropdown-username">${displayName}</div>
                            <div class="dropdown-email">${user.email || 'No email'}</div>
                        </div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <a href="profile.html" class="dropdown-item">
                        <i class="fas fa-user"></i>
                        <span>My Profile</span>
                    </a>
                    <a href="orders.html" class="dropdown-item">
                        <i class="fas fa-box-open"></i>
                        <span>My Orders</span>
                    </a>
                    <a href="wishlist.html" class="dropdown-item">
                        <i class="fas fa-heart"></i>
                        <span>Wishlist</span>
                    </a>
                    <a href="settings.html" class="dropdown-item">
                        <i class="fas fa-cog"></i>
                        <span>Settings</span>
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </a>
                </div>
            </div>
        `;
    },
    
    /** Sets up event listeners for the user dropdown and logout button */
    setupDropdownEvents() {
        const userBtn = document.getElementById('userMenuBtn');
        const dropdown = document.getElementById('userDropdown');
        const logoutBtn = document.querySelector('.logout-btn');
        
        if (userBtn && dropdown) {
            // Toggle dropdown
            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.isDropdownOpen = !this.isDropdownOpen;
                dropdown.style.display = this.isDropdownOpen ? 'block' : 'none';
                userBtn.querySelector('.fa-chevron-down').style.transform = 
                    this.isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)';
            });
            
            // Logout functionality
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
        }
    },
    
    /** Sets up global listener to close dropdown when clicking outside */
    setupDropdownClose() {
        document.addEventListener('click', (e) => {
            const userMenu = document.querySelector('.user-menu');
            if (this.isDropdownOpen && userMenu && !userMenu.contains(e.target)) {
                this.isDropdownOpen = false;
                const dropdown = document.getElementById('userDropdown');
                if (dropdown) {
                    dropdown.style.display = 'none';
                }
                const chevron = document.querySelector('.user-btn .fa-chevron-down');
                if (chevron) {
                    chevron.style.transform = 'rotate(0)';
                }
            }
        });
    },
    
    /** Logs out the user and clears storage */
    logout() {
        localStorage.removeItem('styleshop_user');
        sessionStorage.removeItem('styleshop_user');
        this.currentUser = null;
        
        alert('Logged out successfully!');
        window.location.reload();
    },

    // A dummy login function for testing (يمكن استخدامها في الـ Console)
    login(name, email) {
        this.currentUser = { 
            isLoggedIn: true, 
            displayName: name || 'Test User', 
            email: email || 'test@example.com' 
        };
        localStorage.setItem('styleshop_user', JSON.stringify(this.currentUser));
        this.updateUI();
        alert(`Welcome back, ${this.currentUser.displayName}!`);
    }
};


// =======================================================
// Navbar and Mobile Menu Logic
// =======================================================

function setupNavbarLogic() {
    // 1. Mobile Menu Toggle Logic
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    // هذه هي الدالة المسؤولة عن تشغيل قائمة الموبايل
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu on resize to desktop size
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });
    }

    // 2. Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 5px 25px rgba(0, 0, 0, 0.08)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
            }
        }
    });

     // Trigger initial scroll check
    window.dispatchEvent(new Event('scroll'));
}


// =======================================================
// UI Interaction Logic (Hovers, Animations, Preloading)
// =======================================================

/** Handles adding item to cart and updating UI */
function addToCart(e) {
    e.preventDefault(); // منع انتقال زر "Shop Now" الافتراضي
    cartCount++;
    
    // تحديث كل عنصر يحمل فئة cart-count (في الـ navActions وقائمة الموبايل لو وجدت)
    document.querySelectorAll('.cart-count').forEach(cartElement => {
        cartElement.textContent = cartCount;
        
        // Reset and trigger bounce animation
        cartElement.style.animation = 'none';
        setTimeout(() => {
            cartElement.style.animation = 'bounce 0.5s';
        }, 10);
    });
}

/** Sets up hover effects (mostly managed by CSS, JS adds little here) */
function setupCardHovers() {
    // Product card hover effects (التأثيرات الديناميكية هنا أصبحت بالكامل في CSS)
    
    // Category card hover effects (التأثيرات الديناميكية هنا أصبحت بالكامل في CSS)
    
    // يمكن هنا إضافة أي منطق معقد للتفاعل غير ممكن بالـ CSS وحده
}


/** Preloads background images for smoother display and applies fade-in */
function preloadImages() {
    const imageUrls = [
        'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        // أضف أي صور أخرى تحتاج تحميل مسبق
    ];
    
    let loadedCount = 0;
    const totalImages = imageUrls.length;
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.onload = img.onerror = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                // تنفيذ تأثير الظهور بعد تحميل جميع صور الخلفية
                document.querySelectorAll('.category-card').forEach(card => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 300);
                });
            }
        };
        img.src = url;
    });
}

/** Adds CSS for the cart bounce animation dynamically */
function addBounceAnimationCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
        }
    `;
    document.head.appendChild(style);
}


// =======================================================
// Initialization on Document Ready
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize CSS for animation
    addBounceAnimationCSS();

    // 2. Initialize authentication system and update UI
    auth.init();
    
    // 3. Setup Navbar (Scroll and Mobile Menu) - يجب أن تكون هذه الخطوة بعد auth.init
    // لأن الـ auth.updateUI قد يعيد بناء الـ navActions لكنه لا يؤثر على الـ navMenu/menuToggle
    setupNavbarLogic();
    
    // 4. Setup interaction effects
    setupCardHovers();

    // 5. Setup Add to Cart functionality for relevant buttons
    const addToCartBtns = document.querySelectorAll('.btn-primary');
    addToCartBtns.forEach(btn => {
        // يمكنك تعديل هذا الشرط ليتناسب مع نصوص الأزرار الفعلية
        if (btn.textContent.trim().includes('SHOP NOW') || btn.textContent.trim().includes('Add to Cart')) {
            btn.addEventListener('click', addToCart);
        }
    });
    
    // 6. Preload images with a slight delay
    setTimeout(() => {
        preloadImages();
    }, 500);
});