// login.js - النسخة المعدلة مع Forgot Password متكامل

// ===================================
// 1. Firebase Imports & Initialization
// ===================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

console.log("✅ Firebase initialized successfully");

// ===================================
// 2. Toast Notification System
// ===================================
function showToast(message, type = 'info', duration = 3000) {
    // إزالة أي toast موجودة
    const existingToasts = document.querySelectorAll('.firebase-toast');
    existingToasts.forEach(toast => {
        toast.remove();
    });
    
    // إنشاء toast جديدة
    const toast = document.createElement('div');
    toast.className = `firebase-toast toast-${type}`;
    
    // تحديد الألوان والرموز حسب النوع
    let icon, bgColor, textColor, borderColor;
    
    switch(type) {
        case 'success':
            icon = 'check-circle';
            bgColor = '#10B981';
            textColor = '#FFFFFF';
            borderColor = '#059669';
            break;
        case 'error':
            icon = 'exclamation-circle';
            bgColor = '#EF4444';
            textColor = '#FFFFFF';
            borderColor = '#DC2626';
            break;
        case 'warning':
            icon = 'exclamation-triangle';
            bgColor = '#F59E0B';
            textColor = '#FFFFFF';
            borderColor = '#D97706';
            break;
        case 'info':
        default:
            icon = 'info-circle';
            bgColor = '#3B82F6';
            textColor = '#FFFFFF';
            borderColor = '#2563EB';
            break;
    }
    
    // محتوى الـ Toast
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // إضافة الأنيميشن إذا لم تكن موجودة
    if (!document.querySelector('#toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // تنسيق الـ Toast
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: ${textColor};
        border-left: 4px solid ${borderColor};
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 999999;
        animation: slideInRight 0.4s ease;
    `;
    
    document.body.appendChild(toast);
    
    // زر الإغلاق
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.style.cssText = `
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        margin-left: auto;
        opacity: 0.7;
        transition: opacity 0.2s;
        font-size: 14px;
    `;
    
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    });
    
    // إغلاق تلقائي بعد المدة
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ===================================
// 3. Toggle Password Visibility
// ===================================
function initTogglePassword() {
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            if (!passwordInput) return;
            
            const icon = this.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }
}

// ===================================
// 4. Email/Password Login
// ===================================
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email')?.value.trim();
        const password = document.getElementById('password')?.value;
        const remember = document.getElementById('remember')?.checked;
        const loginBtn = this.querySelector('.login-btn');
        
        // التحقق من البيانات
        if (!email || !password) {
            showToast('❗ الرجاء ملء جميع الحقول المطلوبة', 'warning');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('📧 الرجاء إدخال بريد إلكتروني صالح', 'warning');
            return;
        }
        
        // عرض حالة التحميل
        const originalBtnText = loginBtn?.innerHTML || 'تسجيل الدخول';
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تسجيل الدخول...';
            loginBtn.disabled = true;
        }
        
        try {
            // تسجيل الدخول باستخدام Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // إعداد بيانات المستخدم
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email.split('@')[0],
                photoURL: user.photoURL || null,
                isLoggedIn: true,
                loginTime: new Date().toISOString(),
                provider: 'email',
                lastLogin: new Date().toLocaleString('ar-EG')
            };
            
            // حفظ في التخزين
            if (remember) {
                localStorage.setItem('styleshop_user', JSON.stringify(userData));
                localStorage.setItem('styleshop_remember', 'true');
            } else {
                sessionStorage.setItem('styleshop_user', JSON.stringify(userData));
            }
            
            // عرض رسالة النجاح
            const userName = user.displayName || user.email.split('@')[0];
            showToast(`✅ مرحباً ${userName}! تم تسجيل الدخول بنجاح`, 'success', 2000);
            
            // الانتقال إلى الصفحة الرئيسية
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        } catch (error) {
            console.error('Login Error:', error);
            
            // رسائل الخطأ بالعربية
            let errorMessage = '❌ فشل تسجيل الدخول. الرجاء التحقق من بياناتك';
            switch(error.code) {
                case 'auth/invalid-credential':
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                    errorMessage = '❌ البريد الإلكتروني أو كلمة المرور غير صحيحة';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = '⚠️ تمت محاولات كثيرة. الرجاء الانتظار قليلاً';
                    break;
                case 'auth/user-disabled':
                    errorMessage = '🚫 هذا الحساب معطل';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = '📡 خطأ في الشبكة. الرجاء التحقق من اتصال الإنترنت';
                    break;
                case 'auth/invalid-email':
                    errorMessage = '📧 بريد إلكتروني غير صالح';
                    break;
            }
            
            showToast(errorMessage, 'error', 4000);
            
            // استعادة حالة الزر
            if (loginBtn) {
                loginBtn.innerHTML = originalBtnText;
                loginBtn.disabled = false;
            }
        }
    });
}

// ===================================
// 5. Google Sign-In Function
// ===================================
async function handleGoogleSignIn() {
    const googleBtn = document.querySelector('.google-btn');
    const originalBtnText = googleBtn?.innerHTML || 'التسجيل بـ Google';
    
    try {
        // عرض حالة التحميل
        if (googleBtn) {
            googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الاتصال...';
            googleBtn.disabled = true;
        }
        
        // التسجيل باستخدام Google
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // بيانات المستخدم
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            isLoggedIn: true,
            loginTime: new Date().toISOString(),
            provider: 'google',
            lastLogin: new Date().toLocaleString('ar-EG')
        };
        
        // حفظ في localStorage
        localStorage.setItem('styleshop_user', JSON.stringify(userData));
        
        // عرض رسالة النجاح
        showToast(`✅ مرحباً ${user.displayName}! تم تسجيل الدخول بـ Google`, 'success', 2500);
        
        // الانتقال إلى الصفحة الرئيسية
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2500);
        
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        
        // رسائل الخطأ بالعربية
        let errorMessage = '❌ فشل التسجيل باستخدام Google';
        switch(error.code) {
            case 'auth/popup-closed-by-user':
                errorMessage = '⚠️ تم إغلاق نافذة التسجيل';
                break;
            case 'auth/popup-blocked':
                errorMessage = '🚫 تم حظر النافذة المنبثقة. الرجاء السماح للنوافذ المنبثقة';
                break;
            case 'auth/unauthorized-domain':
                errorMessage = '🌐 هذا النطاق غير مصرح به';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = '⚙️ التسجيل بـ Google غير مفعل';
                break;
            case 'auth/network-request-failed':
                errorMessage = '📡 خطأ في الشبكة';
                break;
        }
        
        showToast(errorMessage, 'error', 4000);
        
        // استعادة حالة الزر
        if (googleBtn) {
            googleBtn.innerHTML = originalBtnText;
            googleBtn.disabled = false;
        }
    }
}

// ===================================
// 6. Social Login Buttons
// ===================================
function initSocialButtons() {
    // زر Google
    const googleBtn = document.querySelector('.google-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleGoogleSignIn();
        });
    }
    
    // زر Facebook
    const facebookBtn = document.querySelector('.facebook-btn');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('📱 تسجيل الدخول عبر Facebook سيكون متاحاً قريباً', 'info', 3000);
        });
    }
}

// ===================================
// 7. Forgot Password - بسيط وآمن
// ===================================
function initForgotPassword() {
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // الحصول على البريد الإلكتروني من حقل الإدخال
            const emailInput = document.getElementById('email');
            const email = emailInput?.value.trim();
            
            // إذا كان هناك بريد، نمرره إلى صفحة forgot-password.html
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                window.location.href = `forgot-password.html?email=${encodeURIComponent(email)}`;
            } else {
                // إذا لم يكن هناك بريد صالح، ننتقل إلى الصفحة بدون بريد
                window.location.href = 'forgot-password.html';
            }
        });
    }
}

// ===================================
// 8. Utility Functions
// ===================================
export function checkAuthStatus() {
    try {
        const savedUser = localStorage.getItem('styleshop_user') || sessionStorage.getItem('styleshop_user');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            if (userData.isLoggedIn && userData.uid) {
                return userData;
            }
        }
    } catch (error) {
        console.error('Auth check error:', error);
    }
    return null;
}

export function logout() {
    showToast('⏳ جاري تسجيل الخروج...', 'info', 1000);
    
    setTimeout(() => {
        auth.signOut().then(() => {
            localStorage.removeItem('styleshop_user');
            sessionStorage.removeItem('styleshop_user');
            localStorage.removeItem('styleshop_remember');
            
            showToast('✅ تم تسجيل الخروج بنجاح', 'success', 2000);
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        }).catch(error => {
            console.error('Logout error:', error);
            showToast('❌ فشل تسجيل الخروج', 'error');
        });
    }, 1000);
}

// ===================================
// 9. Auto-fill email if remembered
// ===================================
function initAutoFill() {
    try {
        const savedUser = localStorage.getItem('styleshop_user');
        const rememberMe = localStorage.getItem('styleshop_remember') === 'true';
        
        if (savedUser && rememberMe) {
            const userData = JSON.parse(savedUser);
            const emailInput = document.getElementById('email');
            const rememberCheckbox = document.getElementById('remember');
            
            if (emailInput && userData.email && userData.provider === 'email') {
                emailInput.value = userData.email;
                if (rememberCheckbox) {
                    rememberCheckbox.checked = true;
                }
            }
        }
    } catch (error) {
        console.log('No saved session found');
    }
    
    // تفعيل Enter لتسجيل الدخول
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const loginForm = document.getElementById('loginForm');
                if (loginForm) {
                    loginForm.dispatchEvent(new Event('submit'));
                }
            }
        });
    }
}

// ===================================
// 10. Add CSS styles for better UI
// ===================================
function addLoginStyles() {
    if (!document.querySelector('#login-styles')) {
        const style = document.createElement('style');
        style.id = 'login-styles';
        style.textContent = `
            /* Spinner Animation */
            .fa-spin {
                animation: fa-spin 1s linear infinite;
            }
            
            @keyframes fa-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Button States */
            button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none !important;
            }
            
            /* Social Login Buttons */
            .social-login {
                display: flex;
                gap: 15px;
                margin: 25px 0;
                width: 100%;
            }
            
            .google-btn, .facebook-btn {
                flex: 1;
                padding: 14px;
                border: none;
                border-radius: 10px;
                font-size: 15px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                transition: all 0.3s ease;
                min-height: 50px;
                font-family: 'Poppins', sans-serif;
            }
            
            .google-btn {
                background: #FFFFFF;
                color: #5F6368;
                border: 2px solid #DADCE0;
                font-weight: 600;
            }
            
            .google-btn:hover:not(:disabled) {
                background: #F8F9FA;
                border-color: #C2C7D0;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            .facebook-btn {
                background: #1877F2;
                color: white;
                border: 2px solid #1877F2;
                font-weight: 600;
            }
            
            .facebook-btn:hover:not(:disabled) {
                background: #166FE5;
                border-color: #166FE5;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(24, 119, 242, 0.2);
            }
            
            /* Toast Icon */
            .toast-icon {
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
            }
            
            /* Responsive Design */
            @media (max-width: 480px) {
                .social-login {
                    flex-direction: column;
                }
                
                .google-btn, .facebook-btn {
                    width: 100%;
                }
                
                .firebase-toast {
                    min-width: 280px !important;
                    max-width: 320px !important;
                    right: 10px !important;
                    left: 10px !important;
                    margin: 0 auto;
                }
            }
            
            /* Loading State for Form */
            .form-loading {
                position: relative;
                pointer-events: none;
            }
            
            .form-loading::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255,255,255,0.8);
                z-index: 10;
            }
            
            /* Password Field Focus */
            .password-container:focus-within {
                border-color: #8b5cf6;
                box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
            }
        `;
        document.head.appendChild(style);
    }
}

// ===================================
// 11. Connection Status Check
// ===================================
function initConnectionStatus() {
    window.addEventListener('online', () => {
        showToast('📡 تم استعادة الاتصال بالإنترنت', 'success', 2000);
    });
    
    window.addEventListener('offline', () => {
        showToast('⚠️ فقدت الاتصال بالإنترنت', 'warning', 5000);
    });
}

// ===================================
// 12. Welcome Message on Login Page
// ===================================
function initWelcomeMessage() {
    const isFirstVisit = !localStorage.getItem('styleshop_visited');
    if (isFirstVisit && window.location.pathname.includes('login.html')) {
        setTimeout(() => {
            showToast('👋 مرحباً بك في StyleShop! سجل دخولك لاكتشاف أحدث المجموعات', 'info', 5000);
            localStorage.setItem('styleshop_visited', 'true');
        }, 1500);
    }
}

// ===================================
// 13. Initialize Everything
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ Login page loaded");
    
    // تهيئة جميع الوظائف
    initTogglePassword();
    initLoginForm();
    initSocialButtons();
    initForgotPassword(); // ✅ هنا الجزء المهم
    initAutoFill();
    addLoginStyles();
    initConnectionStatus();
    initWelcomeMessage();
    
    // منع الانتقال إذا كان المستخدم مسجلاً بالفعل
    const user = checkAuthStatus();
    if (user && window.location.pathname.includes('login.html')) {
        showToast('👋 مرحباً بعودتك! يتم توجيهك...', 'info', 1500);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
});

console.log("✅ Login module loaded successfully");