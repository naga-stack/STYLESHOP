// register.js

// =======================
// 1. Firebase Imports (تم تعديل هذا الجزء)
// =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js"; // **NEW: Firestore Imports**
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-analytics.js";

// Your web app's Firebase configuration (يجب تحديث هذا بمعلوماتك الحقيقية)
const firebaseConfig = {
  apiKey: "AIzaSyDZaJqweCcEcqCglRHu1UrkrmuQAXEe8Lo", // <== ضع مفتاحك هنا
  authDomain: "my-shop-82459.firebaseapp.com",
  projectId: "my-shop-82459",
  storageBucket: "my-shop-82459.firebasestorage.app",
  messagingSenderId: "744913484296",
  appId: "1:744913484296:web:b2c4614d773518b4112fbd",
  measurementId: "G-5EPCPXRVG2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // إذا كنت تستخدم التحليلات
const auth = getAuth(app);           // خدمة المصادقة
const db = getFirestore(app);        // خدمة قاعدة البيانات (Firestore)

console.log("Firebase initialized!");

// =======================
// 2. Toggle Password Visibility (بدون تغيير)
// =======================
document.getElementById('togglePassword')?.addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

document.getElementById('toggleConfirmPassword')?.addEventListener('click', function() {
    const passwordInput = document.getElementById('confirmPassword');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// =======================
// 3. Toast function (بدون تغيير)
// =======================
function showToast(message, duration = 3000) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

// =======================
// 4. Terms and Privacy links (بدون تغيير)
// =======================
document.getElementById('termsLink')?.addEventListener('click', function(e) {
    e.preventDefault();
    showToast('Terms of Service page would open here', 3000);
});

document.getElementById('privacyLink')?.addEventListener('click', function(e) {
    e.preventDefault();
    showToast('Privacy Policy page would open here', 3000);
});

// =======================
// 5. Handle form submission (تم تعديل هذا الجزء للربط بـ Firestore)
// =======================
document.getElementById('registerForm')?.addEventListener('submit', async function(e) { // **Added 'async' here**
    e.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    // =======================
    // Validation (بدون تغيير)
    // =======================
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showToast('Please fill in all required fields', 3000);
        return;
    }
    // ... بقية شروط التحقق (Email, Password Length, Match, Terms)
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match!', 3000);
        return;
    }
    
    if (!terms) {
        showToast('You must agree to the terms and conditions', 3000);
        return;
    }
    
    // =======================
    // Show loading
    // =======================
    const registerBtn = this.querySelector('.register-btn');
    registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    registerBtn.disabled = true;

    // =======================
    // Firebase Registration & Firestore Save
    // =======================
    try {
        // 1. المرحلة الأولى: إنشاء المستخدم في Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const fullName = `${firstName} ${lastName}`;

        // تحديث الاسم المعروض في Firebase Auth
        await updateProfile(user, { displayName: fullName });

        // 2. المرحلة الثانية: حفظ البيانات الإضافية في Firestore
        await setDoc(doc(db, "users", user.uid), {
            fullName: fullName,
            email: email,
            phone: phone, 
            createdAt: new Date(),
        });

        // إذا نجحت المرحلتان:
        console.log('User registered and data saved to Firestore successfully. UID:', user.uid);
        showToast('🎉 Account created successfully!', 3000);

        // توجيه المستخدم
        setTimeout(() => {
            window.location.href = 'login.html' ;
        }, 1000);

    } catch (error) {
        // معالجة الأخطاء
        console.error(error);
        let errorMessage = error.message;
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'هذا البريد الإلكتروني مستخدم بالفعل.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'كلمة المرور ضعيفة جدًا (يجب أن تكون 6 أحرف على الأقل).';
        } else {
            errorMessage = `فشل التسجيل: ${error.message}`;
        }
        
        showToast(errorMessage, 4000);
        registerBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account'; 
        registerBtn.disabled = false;
    }
});

// =======================
// 6. Phone Input Handling (بدون تغيير)
// =======================
const phoneInput = document.getElementById('phone');

phoneInput?.addEventListener('keydown', function(e) {
    if ((this.selectionStart <= 2) && 
        (e.key === "Backspace" || e.key === "Delete")) {
        e.preventDefault();
    }
});

phoneInput?.addEventListener('input', function() {
    if (!this.value.startsWith("+2")) {
        this.value = "+2" + this.value.slice(2);
    }

    const numbers = this.value.slice(2).replace(/[^0-9]/g, "");
    this.value = "+2" + numbers;
});