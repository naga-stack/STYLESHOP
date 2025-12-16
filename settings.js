// settings.js - Settings Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ Settings page loaded");
    
    // تحميل بيانات المستخدم
    loadUserData();
    
    // تهيئة التنقل بين الأقسام
    initNavigation();
    
    // تهيئة جميع التبديلات
    initToggles();
    
    // تهيئة اختيار اللغة
    initLanguageSelector();
    
    // تهيئة الألوان
    initThemeColors();
    
    // تهيئة إدارة الحساب
    initAccountManagement();
    
    // تهيئة أزرار التغيير
    initChangeButtons();
});

// ===================================
// 1. تحميل بيانات المستخدم
// ===================================
function loadUserData() {
    try {
        const userData = JSON.parse(localStorage.getItem('styleshop_user') || sessionStorage.getItem('styleshop_user'));
        const accountProfile = document.getElementById('accountProfile');
        
        if (accountProfile && userData) {
            const displayName = userData.displayName || 'User';
            const email = userData.email || 'Not provided';
            const provider = userData.provider || 'email';
            
            accountProfile.innerHTML = `
                <h3 class="card-title">
                    <i class="fas fa-user-circle"></i>
                    Account Information
                </h3>
                <p class="card-description">
                    View your account details and connection status
                </p>
                
                <div style="display: flex; align-items: center; gap: 1.5rem; margin-top: 1.5rem;">
                    <div class="profile-avatar">
                        ${userData.photoURL ? 
                            `<img src="${userData.photoURL}" alt="${displayName}">` : 
                            `<span>${displayName.charAt(0).toUpperCase()}</span>`
                        }
                    </div>
                    <div>
                        <h4 style="font-size: 1.5rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">
                            ${displayName}
                        </h4>
                        <p style="color: #64748b; margin-bottom: 0.5rem;">
                            <i class="fas fa-envelope"></i> ${email}
                        </p>
                        <span class="profile-badge">
                            <i class="fas fa-${provider === 'google' ? 'google' : 'envelope'}"></i>
                            Connected via ${provider === 'google' ? 'Google' : 'Email'}
                        </span>
                    </div>
                </div>
                
                <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0;">
                    <p style="color: #64748b; margin-bottom: 1rem;">
                        <i class="fas fa-calendar-alt"></i> 
                        Last login: ${userData.lastLogin ? new Date(userData.lastLogin).toLocaleDateString() : 'Recently'}
                    </p>
                </div>
            `;
        } else if (accountProfile) {
            accountProfile.innerHTML = `
                <h3 class="card-title">
                    <i class="fas fa-user-slash"></i>
                    No Account Found
                </h3>
                <p class="card-description">
                    Please sign in to view and manage your account settings
                </p>
                
                <div style="margin-top: 1.5rem;">
                    <a href="login.html" class="settings-btn settings-btn-primary">
                        <i class="fas fa-sign-in-alt"></i> Sign In
                    </a>
                </div>
            `;
        }
        
        // تحديث القائمة العلوية
        updateNavMenu(userData);
        
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// ===================================
// 2. تحديث القائمة العلوية
// ===================================
function updateNavMenu(userData) {
    const userMenu = document.getElementById('userMenu');
    if (!userMenu) return;
    
    if (userData && userData.isLoggedIn) {
        const displayName = userData.displayName || 'User';
        userMenu.innerHTML = `
            <div class="user-menu">
                <button class="user-btn" onclick="window.location.href='settings.html'">
                    <div class="user-avatar">
                        ${displayName.charAt(0).toUpperCase()}
                    </div>
                    <span class="username">${displayName.split(' ')[0]}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
        `;
    } else {
        userMenu.innerHTML = `
            <div id="authButtons">
                <a href="login.html" class="nav-link">
                    <i class="fas fa-sign-in-alt"></i> Login
                </a>
                <a href="login.html" class="login-btn">
                    <i class="fas fa-user-plus"></i> Sign Up
                </a>
            </div>
        `;
    }
}

// ===================================
// 3. التنقل بين الأقسام
// ===================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.settings-nav-link');
    const sections = document.querySelectorAll('.settings-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // إزالة النشاط من جميع الروابط
            navLinks.forEach(l => l.classList.remove('active'));
            
            // إضافة النشاط للرابط الحالي
            this.classList.add('active');
            
            // إخفاء جميع الأقسام
            sections.forEach(section => section.classList.remove('active'));
            
            // إظهار القسم المحدد
            const sectionId = this.getAttribute('data-section');
            const activeSection = document.getElementById(`${sectionId}-section`);
            if (activeSection) {
                activeSection.classList.add('active');
            }
        });
    });
}

// ===================================
// 4. إدارة التبديلات
// ===================================
function initToggles() {
    // تحميل الإعدادات المحفوظة
    loadSettings();
    
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            saveSetting('darkMode', this.checked);
            applyDarkMode(this.checked);
            showToast(this.checked ? 'Dark mode enabled' : 'Dark mode disabled', 'success');
        });
    }
    
    // جميع التبديلات الأخرى
    const toggleIds = [
        'showImagesToggle',
        'reduceAnimationsToggle',
        'orderStatusToggle',
        'shippingToggle',
        'salesToggle',
        'newArrivalsToggle',
        'newsletterToggle',
        'offersToggle',
        'searchableToggle',
        'analyticsToggle',
        'adCookiesToggle',
        'analyticsCookiesToggle'
    ];
    
    toggleIds.forEach(id => {
        const toggle = document.getElementById(id);
        if (toggle) {
            toggle.addEventListener('change', function() {
                saveSetting(id.replace('Toggle', ''), this.checked);
            });
        }
    });
}

// ===================================
// 5. اختيار اللغة
// ===================================
function initLanguageSelector() {
    const languageOptions = document.querySelectorAll('.language-option');
    
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            // إزالة النشاط من جميع الخيارات
            languageOptions.forEach(opt => opt.classList.remove('active'));
            
            // إضافة النشاط للخيار المحدد
            this.classList.add('active');
            
            // حفظ الإعداد
            const language = this.getAttribute('data-lang');
            saveSetting('language', language);
            
            // عرض إشعار
            const langName = this.querySelector('h4').textContent;
            showToast(`Language changed to ${langName}`, 'success');
        });
    });
}

// ===================================
// 6. اختيار الألوان
// ===================================
function initThemeColors() {
    const themeColors = document.querySelectorAll('.theme-color');
    
    themeColors.forEach(color => {
        color.addEventListener('click', function() {
            // إزالة النشاط من جميع الألوان
            themeColors.forEach(c => c.classList.remove('active'));
            
            // إضافة النشاط للون المحدد
            this.classList.add('active');
            
            // حفظ الإعداد
            const theme = this.getAttribute('data-theme');
            saveSetting('theme', theme);
            
            // تطبيق السمة
            applyTheme(theme);
            showToast(`Theme changed to ${theme}`, 'success');
        });
    });
}

// ===================================
// 7. إدارة الحساب
// ===================================
function initAccountManagement() {
    // تصدير البيانات
    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function() {
            const userData = JSON.parse(localStorage.getItem('styleshop_user') || '{}');
            const settings = JSON.parse(localStorage.getItem('styleshop_settings') || '{}');
            
            const allData = {
                user: userData,
                settings: settings,
                exportDate: new Date().toISOString()
            };
            
            // إنشاء ملف JSON
            const dataStr = JSON.stringify(allData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const dataUrl = URL.createObjectURL(dataBlob);
            
            // تحميل الملف
            const downloadLink = document.createElement('a');
            downloadLink.href = dataUrl;
            downloadLink.download = `styleshop-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            showToast('Data exported successfully', 'success');
        });
    }
    
    // حذف البيانات
    const deleteDataBtn = document.getElementById('deleteDataBtn');
    if (deleteDataBtn) {
        deleteDataBtn.addEventListener('click', function() {
            if (confirm('⚠️ Are you sure you want to delete all your data? This action cannot be undone.')) {
                localStorage.removeItem('styleshop_settings');
                showToast('All data deleted successfully', 'success');
                setTimeout(() => location.reload(), 1000);
            }
        });
    }
    
    // تعطيل الحساب
    const deactivateAccountBtn = document.getElementById('deactivateAccountBtn');
    if (deactivateAccountBtn) {
        deactivateAccountBtn.addEventListener('click', function() {
            if (confirm('⚠️ Are you sure you want to deactivate your account? You can reactivate it later.')) {
                // هنا يمكنك إضافة API call لتعطيل الحساب
                showToast('Account deactivated successfully', 'success');
                setTimeout(() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = 'index.html';
                }, 2000);
            }
        });
    }
    
    // حذف الحساب
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            if (confirm('🚨 ARE YOU SURE? This will permanently delete your account and all your data. This action cannot be undone!')) {
                showToast('Account deletion initiated', 'info');
                setTimeout(() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = 'index.html';
                }, 3000);
            }
        });
    }
}

// ===================================
// 8. أزرار التغيير
// ===================================
function initChangeButtons() {
    const changeCurrencyBtn = document.getElementById('changeCurrencyBtn');
    const changeUnitsBtn = document.getElementById('changeUnitsBtn');
    
    if (changeCurrencyBtn) {
        changeCurrencyBtn.addEventListener('click', function() {
            const newCurrency = prompt('Enter new currency code (e.g., USD, EUR, GBP):', 'USD');
            if (newCurrency && newCurrency.trim()) {
                saveSetting('currency', newCurrency.trim().toUpperCase());
                showToast(`Currency changed to ${newCurrency.trim().toUpperCase()}`, 'success');
            }
        });
    }
    
    if (changeUnitsBtn) {
        changeUnitsBtn.addEventListener('click', function() {
            const units = confirm('Switch to Imperial units (inches, pounds)?\n\nClick OK for Imperial\nClick Cancel for Metric');
            const unitType = units ? 'imperial' : 'metric';
            saveSetting('units', unitType);
            showToast(`Units changed to ${unitType}`, 'success');
        });
    }
}

// ===================================
// 9. حفظ الإعدادات
// ===================================
function saveSetting(key, value) {
    try {
        const settings = JSON.parse(localStorage.getItem('styleshop_settings') || '{}');
        settings[key] = value;
        localStorage.setItem('styleshop_settings', JSON.stringify(settings));
        console.log(`Setting saved: ${key} =`, value);
    } catch (error) {
        console.error('Error saving setting:', error);
    }
}

// ===================================
// 10. تحميل الإعدادات
// ===================================
function loadSettings() {
    try {
        const settings = JSON.parse(localStorage.getItem('styleshop_settings') || '{}');
        
        // Dark Mode
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle && settings.darkMode !== undefined) {
            darkModeToggle.checked = settings.darkMode;
            applyDarkMode(settings.darkMode);
        }
        
        // Theme
        const theme = settings.theme || 'purple';
        const themeColor = document.querySelector(`.theme-color[data-theme="${theme}"]`);
        if (themeColor) {
            themeColor.classList.add('active');
            applyTheme(theme);
        }
        
        // Language
        const language = settings.language || 'en';
        const languageOption = document.querySelector(`.language-option[data-lang="${language}"]`);
        if (languageOption) {
            languageOption.classList.add('active');
        }
        
        // جميع التبديلات الأخرى
        const toggleSettings = [
            'showImages', 'reduceAnimations', 'orderStatus', 'shipping',
            'sales', 'newArrivals', 'newsletter', 'offers', 'searchable',
            'analytics', 'adCookies', 'analyticsCookies'
        ];
        
        toggleSettings.forEach(setting => {
            const toggle = document.getElementById(`${setting}Toggle`);
            if (toggle && settings[setting] !== undefined) {
                toggle.checked = settings[setting];
            }
        });
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// ===================================
// 11. تطبيق الوضع الداكن
// ===================================
function applyDarkMode(enabled) {
    if (enabled) {
        document.body.classList.add('dark-mode');
        document.querySelector('nav').classList.add('dark-mode');
        document.querySelector('footer').classList.add('dark-mode');
        document.querySelector('.settings-grid').classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
        document.querySelector('nav').classList.remove('dark-mode');
        document.querySelector('footer').classList.remove('dark-mode');
        document.querySelector('.settings-grid').classList.remove('dark-mode');
    }
}

// ===================================
// 12. تطبيق السمة
// ===================================
function applyTheme(theme) {
    // إزالة جميع سمات الألوان
    document.body.classList.remove('theme-purple', 'theme-green', 'theme-blue', 'theme-orange', 'theme-red');
    
    // إضافة السمة الجديدة
    document.body.classList.add(`theme-${theme}`);
}

// ===================================
// 13. عرض الإشعارات
// ===================================
function showToast(message, type = 'info') {
    // إزالة أي إشعارات موجودة
    const existingToasts = document.querySelectorAll('.settings-toast');
    existingToasts.forEach(toast => toast.remove());
    
    // إنشاء إشعار جديد
    const toast = document.createElement('div');
    toast.className = `settings-toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // إزالة الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ===================================
// 14. Mobile Menu (نفس الكود الموجود في script.js)
// ===================================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // إغلاق القائمة عند النقر على رابط
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

console.log("✅ Settings module loaded successfully");