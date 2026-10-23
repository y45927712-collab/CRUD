// ربط عناصر واجهة تسجيل الدخول الملونة الخاصة بك
const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('authEmail');
const passwordInput = document.getElementById('authPassword');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authTitle = document.getElementById('authTitle');
const authSwitchLink = document.getElementById('authSwitchLink');
const authSwitchText = document.getElementById('authSwitchText');

let authMood = 'login'; 
let currentUser = null;

// فحص الأمان التلقائي: إذا كان المستخدم مسجل دخوله سابقاً وفتح الموقع، ينتقل لصفحة المنتجات فوراً
if (localStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'crud.html';
}

// جلب الحسابات المسجلة من الـ LocalStorage أو إنشاء كائن فارغ جديد
let accounts = localStorage.getItem('accounts') ? JSON.parse(localStorage.getItem('accounts')) : {};

// التحويل الذكي داخل واجهتك بين Login و Register عند الضغط على الرابط
if(authSwitchLink) {
    authSwitchLink.onclick = function(e) {
        e.preventDefault();
        if(authMood === 'login') {
            authMood = 'register';
            authTitle.innerHTML = 'Register';
            authSubmitBtn.innerHTML = 'Sign Up';
            authSwitchText.innerHTML = 'Already have an account? <a href="#" id="authSwitchLink" class="register-link">Login</a>';
        } else {
            authMood = 'login';
            authTitle.innerHTML = 'Login';
            authSubmitBtn.innerHTML = 'Login';
            authSwitchText.innerHTML = 'Don\'t have an account? <a href="#" id="authSwitchLink" class="register-link">Register</a>';
        }
        setTimeout(attachSwitchEvent, 50);
    }
}

function attachSwitchEvent() {
    let link = document.getElementById('authSwitchLink');
    if(link) link.onclick = authSwitchLink.onclick;
}

// معالجة إرسال البيانات من واجهتك الأنيقة عند الضغط على زر Submit
if(authForm) {
    authForm.onsubmit = function(e) {
        e.preventDefault(); // منع الصفحة من التحديث وضياع البيانات

        let emailVal = emailInput.value.trim();
        let passVal = passwordInput.value.trim();

        // تم إصلاح الخطأ الإملائي هنا من authVal إلى emailVal
        if(emailVal === '' || passVal === '') {
            alert('Please fill all fields!');
            return;
        }

        if(authMood === 'register') {
            if(accounts[emailVal]) {
                alert('This email is already registered!');
            } else {
                accounts[emailVal] = passVal;
                localStorage.setItem('accounts', JSON.stringify(accounts));
                alert('Account created successfully! You can login now.');
                authMood = 'register'; 
                authSwitchLink.click(); 
            }
        } else {
            // فحص بيانات تسجيل الدخول للـ Login
            if(accounts[emailVal] && accounts[emailVal] === passVal) {
                // استخراج الجزء الأول من الإيميل بشكل سليم كاسم مستخدم
                currentUser = emailVal.split('@')[0]; 
                
                // حفظ حالة الدخول واسم المستخدم في المتصفح بنجاح
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('loggedInUser', currentUser);
                
                // التوجيه الفوري إلى صفحة المنتجات الأصيلة
                window.location.href = 'crud.html';
            } else {
                alert('Invalid Email or Password!');
            }
        }
    }
}
