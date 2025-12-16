// reset-password.js - صفحة إعادة تعيين كلمة المرور

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { 
    getAuth, 
    sendPasswordResetEmail,
    confirmPasswordReset,
    verifyPasswordResetCode
} from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ===================================
// Toast Notification System
// ===================================
function showToast(message, type = 'info', duration = 3000) {
    const existingToasts = document.querySelectorAll('.firebase-toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `firebase-toast toast-${type}`;
    
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
        default:
            icon = 'info-circle';
            bgColor = '#3B82F6';
            textColor = '#FFFFFF';
            borderColor = '#2563EB';
    }
    
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
    
    document.body.appendChild(toast);
    
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
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ===================================
// Check URL for Reset Code (for reset page)
// ===================================
function getResetCodeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('oobCode') || urlParams.get('code');
}

// ===================================
// Main Reset Password Functionality
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ Reset password page loaded");
    
    const resetForm = document.getElementById('resetForm');
    const emailInput = document.getElementById('email');
    const resetBtn = document.getElementById('resetBtn');
    const resetError = document.getElementById('resetError');
    const resetSuccess = document.getElementById('resetSuccess');
    
    // Auto-fill email from URL if exists
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromURL = urlParams.get('email');
    if (emailFromURL && emailInput) {
        emailInput.value = decodeURIComponent(emailFromURL);
    }
    
    // Handle form submission
    if (resetForm) {
        resetForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = emailInput?.value.trim();
            
            // Validation
            if (!email) {
                showError(resetError, '❗ الرجاء إدخال بريد إلكتروني');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError(resetError, '📧 الرجاء إدخال بريد إلكتروني صالح');
                return;
            }
            
            // Show loading state
            const originalBtnText = resetBtn?.innerHTML || 'إرسال الرابط';
            if (resetBtn) {
                resetBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
                resetBtn.disabled = true;
            }
            
            // Clear previous messages
            if (resetError) resetError.style.display = 'none';
            if (resetSuccess) resetSuccess.style.display = 'none';
            
            try {
                // Send password reset email
                await sendPasswordResetEmail(auth, email);
                
                // Show success message
                showSuccess(resetSuccess, `✅ تم إرسال رابط إعادة التعيين إلى ${email}`);
                
                // Update button to show success
                if (resetBtn) {
                    resetBtn.innerHTML = '<i class="fas fa-check"></i> تم الإرسال بنجاح';
                    resetBtn.style.background = 'linear-gradient(45deg, #10b981, #059669)';
                    
                    // Reset button after 5 seconds
                    setTimeout(() => {
                        resetBtn.innerHTML = 'إرسال رابط آخر';
                        resetBtn.style.background = '';
                        resetBtn.disabled = false;
                    }, 5000);
                }
                
                // Store email for future reference
                localStorage.setItem('styleshop_reset_email', email);
                
                // Show toast notification
                showToast(`تم إرسال رابط إعادة التعيين إلى ${email}`, 'success', 5000);
                
                // Auto-redirect to login page after 8 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 8000);
                
            } catch (error) {
                console.error('Password Reset Error:', error);
                
                // Handle different error cases
                let errorMessage = '❌ فشل إرسال رابط إعادة التعيين';
                switch(error.code) {
                    case 'auth/user-not-found':
                        errorMessage = '👤 لا يوجد حساب مرتبط بهذا البريد الإلكتروني';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = '📧 بريد إلكتروني غير صالح';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = '⚠️ طلبات كثيرة. الرجاء الانتظار قليلاً';
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = '📡 خطأ في الشبكة. الرجاء التحقق من اتصال الإنترنت';
                        break;
                    case 'auth/missing-android-pkg-name':
                    case 'auth/missing-ios-bundle-id':
                        errorMessage = '📱 يحتاج التطبيق إلى تهيئة إضافية';
                        break;
                }
                
                // Show error message
                showError(resetError, errorMessage);
                
                // Reset button
                if (resetBtn) {
                    resetBtn.innerHTML = originalBtnText;
                    resetBtn.disabled = false;
                }
                
                // Show toast error
                showToast(errorMessage, 'error', 4000);
            }
        });
    }
    
    // Helper functions for showing messages
    function showError(element, message) {
        if (element) {
            element.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>${message}</span>
                </div>
            `;
            element.style.display = 'block';
            element.style.color = '#ef4444';
            element.style.backgroundColor = '#fee2e2';
            element.style.padding = '12px';
            element.style.borderRadius = '8px';
            element.style.marginBottom = '1rem';
            element.style.border = '1px solid #fca5a5';
        }
    }
    
    function showSuccess(element, message) {
        if (element) {
            element.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-check-circle"></i>
                    <span>${message}</span>
                </div>
                <div style="margin-top: 10px; font-size: 0.85rem; color: #047857;">
                    <p>✅ تم إرسال رابط إعادة التعيين</p>
                    <p>📧 تحقق من بريدك الإلكتروني (ومجلد البريد العشوائي)</p>
                    <p>⏳ ستتم إعادة توجيهك إلى صفحة تسجيل الدخول خلال 8 ثوانٍ</p>
                </div>
            `;
            element.style.display = 'block';
            element.style.color = '#047857';
            element.style.backgroundColor = '#d1fae5';
            element.style.padding = '12px';
            element.style.borderRadius = '8px';
            element.style.marginBottom = '1rem';
            element.style.border = '1px solid #a7f3d0';
        }
    }
    
    // Enter key to submit form
    if (emailInput) {
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && resetForm) {
                resetForm.dispatchEvent(new Event('submit'));
            }
        });
    }
    
    // Check if there's a reset code in the URL (for the actual reset page)
    const resetCode = getResetCodeFromURL();
    if (resetCode && !window.location.pathname.includes('forgot-password.html')) {
        // We're on the actual reset page
        handlePasswordReset(resetCode);
    }
});

// ===================================
// Handle Actual Password Reset Page
// ===================================
async function handlePasswordReset(resetCode) {
    try {
        // Verify the reset code is valid
        const email = await verifyPasswordResetCode(auth, resetCode);
        
        // Show the password reset form
        showPasswordResetForm(email, resetCode);
        
    } catch (error) {
        console.error('Reset Code Error:', error);
        showToast('❌ رابط إعادة التعيين غير صالح أو منتهي الصلاحية', 'error', 5000);
        
        // Redirect to forgot password page
        setTimeout(() => {
            window.location.href = 'forgot-password.html';
        }, 3000);
    }
}

// ===================================
// Show Password Reset Form (if needed)
// ===================================
function showPasswordResetForm(email, resetCode) {
    // You can create a separate reset page or show a modal
    // This is for if you want to handle it on the same page
    
    const container = document.querySelector('.reset-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="reset-icon">
            <i class="fas fa-lock"></i>
        </div>
        
        <h1 class="reset-title">أنشئ كلمة مرور جديدة</h1>
        <p class="reset-subtitle">
            أدخل كلمة مرور جديدة لحسابك: ${email}
        </p>
        
        <form id="newPasswordForm">
            <div class="form-group">
                <label for="newPassword" class="form-label">كلمة المرور الجديدة</label>
                <div class="password-container">
                    <input 
                        type="password" 
                        id="newPassword" 
                        class="form-input" 
                        placeholder="كلمة المرور الجديدة"
                        required
                        minlength="6"
                        autocomplete="new-password"
                    >
                    <button type="button" class="toggle-password" id="toggleNewPassword">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                <small style="color: #64748b; font-size: 0.85rem; display: block; margin-top: 0.25rem;">
                    يجب أن تكون كلمة المرور 6 أحرف على الأقل
                </small>
            </div>
            
            <div class="form-group">
                <label for="confirmPassword" class="form-label">تأكيد كلمة المرور</label>
                <div class="password-container">
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        class="form-input" 
                        placeholder="تأكيد كلمة المرور"
                        required
                        autocomplete="new-password"
                    >
                    <button type="button" class="toggle-password" id="toggleConfirmPassword">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            
            <div id="passwordError" class="error-message" style="display: none; margin-bottom: 1rem;"></div>
            
            <button type="submit" class="reset-btn" id="updatePasswordBtn">
                تحديث كلمة المرور
            </button>
        </form>
        
        <a href="login.html" class="back-to-login">
            <i class="fas fa-arrow-right"></i>
            العودة إلى تسجيل الدخول
        </a>
    `;
    
    // Add event listeners for the new form
    setTimeout(() => {
        setupNewPasswordForm(email, resetCode);
    }, 100);
}

// ===================================
// Setup New Password Form
// ===================================
function setupNewPasswordForm(email, resetCode) {
    const newPasswordForm = document.getElementById('newPasswordForm');
    const toggleNewPassword = document.getElementById('toggleNewPassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    
    // Toggle password visibility
    if (toggleNewPassword) {
        toggleNewPassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('newPassword');
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
    
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('confirmPassword');
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
    
    // Handle form submission
    if (newPasswordForm) {
        newPasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const newPassword = document.getElementById('newPassword')?.value;
            const confirmPassword = document.getElementById('confirmPassword')?.value;
            const updateBtn = document.getElementById('updatePasswordBtn');
            const passwordError = document.getElementById('passwordError');
            
            // Validation
            if (!newPassword || !confirmPassword) {
                showPasswordError('❗ الرجاء ملء جميع الحقول');
                return;
            }
            
            if (newPassword.length < 6) {
                showPasswordError('❌ يجب أن تكون كلمة المرور 6 أحرف على الأقل');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showPasswordError('❌ كلمات المرور غير متطابقة');
                return;
            }
            
            // Show loading
            const originalBtnText = updateBtn?.innerHTML || 'تحديث كلمة المرور';
            if (updateBtn) {
                updateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحديث...';
                updateBtn.disabled = true;
            }
            
            try {
                // Confirm password reset
                await confirmPasswordReset(auth, resetCode, newPassword);
                
                // Show success
                showToast('✅ تم تحديث كلمة المرور بنجاح', 'success', 3000);
                
                if (updateBtn) {
                    updateBtn.innerHTML = '<i class="fas fa-check"></i> تم التحديث بنجاح';
                    updateBtn.style.background = 'linear-gradient(45deg, #10b981, #059669)';
                }
                
                // Clear stored reset email
                localStorage.removeItem('styleshop_reset_email');
                
                // Auto-redirect to login page
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
                
            } catch (error) {
                console.error('Password Update Error:', error);
                
                let errorMessage = '❌ فشل تحديث كلمة المرور';
                switch(error.code) {
                    case 'auth/expired-action-code':
                        errorMessage = '⏳ رابط إعادة التعيين منتهي الصلاحية';
                        break;
                    case 'auth/invalid-action-code':
                        errorMessage = '❌ رابط إعادة التعيين غير صالح';
                        break;
                    case 'auth/user-disabled':
                        errorMessage = '🚫 هذا الحساب معطل';
                        break;
                    case 'auth/user-not-found':
                        errorMessage = '👤 المستخدم غير موجود';
                        break;
                    case 'auth/weak-password':
                        errorMessage = '🔒 كلمة المرور ضعيفة جداً';
                        break;
                }
                
                showPasswordError(errorMessage);
                
                if (updateBtn) {
                    updateBtn.innerHTML = originalBtnText;
                    updateBtn.disabled = false;
                }
                
                showToast(errorMessage, 'error', 4000);
            }
        });
    }
    
    function showPasswordError(message) {
        const passwordError = document.getElementById('passwordError');
        if (passwordError) {
            passwordError.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; color: #ef4444;">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>${message}</span>
                </div>
            `;
            passwordError.style.display = 'block';
        }
    }
}

console.log("✅ Reset password module loaded");