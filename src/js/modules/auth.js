/* =========================================================
   Auth forms logic (login.html, signup.html)
   Clean, Understated, Professional Product Architecture
   ========================================================= */
(function () {
    "use strict";

    /* ---------- THEME (shared logic) ---------- */
    const THEME_KEY = 'mdarahim-theme';
    const SUN_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    const MOON_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-bs-theme', theme);
        const btn = document.getElementById('btnThemeToggle');
        if (btn) btn.innerHTML = theme === 'dark' ? SUN_ICON : MOON_ICON;
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'dark' ? '#0d1117' : '#f6f8fa');
        try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
    }
    let initial = 'dark';
    try { initial = localStorage.getItem(THEME_KEY) || 'dark'; } catch (_) {}
    applyTheme(initial);

    document.getElementById('btnThemeToggle')?.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') || 'dark';
        applyTheme(cur === 'dark' ? 'light' : 'dark');
    });

    /* ---------- Password Visibility Toggle with Clean SVGs ---------- */
    const EYE_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
    const EYE_OFF_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>';

    function wirePasswordToggle(btnId, inputId) {
        const btn = document.getElementById(btnId);
        const input = document.getElementById(inputId);
        if (!btn || !input) return;

        btn.innerHTML = EYE_ICON;

        btn.addEventListener('click', () => {
            const isPass = input.type === 'password';
            input.type = isPass ? 'text' : 'password';
            btn.innerHTML = isPass ? EYE_OFF_ICON : EYE_ICON;
            btn.setAttribute('aria-label', isPass ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور');
        });
    }

    wirePasswordToggle('btnTogglePassword', 'passwordInput');
    wirePasswordToggle('btnTogglePasswordConfirm', 'passwordConfirmInput');

    /* ---------- Role Switcher on Signup ---------- */
    let selectedRole = 'user';
    const roleBtns = document.querySelectorAll('.role-btn');
    roleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            roleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedRole = btn.dataset.role || 'user';
        });
    });

    /* ---------- Toast Notifications ---------- */
    let toastTimer;
    function toast(msg) {
        const box = document.getElementById('toastBox');
        if (!box) return;
        const msgEl = document.getElementById('toastMsg');
        if (msgEl) msgEl.textContent = msg;
        box.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => box.classList.remove('show'), 2600);
    }

    /* ---------- Form validation & Submission ---------- */
    const form = document.querySelector("form.form");
    if (!form) return;

    const isSignup = !!document.getElementById("passwordConfirmInput");

    function setError(input, msg) {
        input.classList.add("is-invalid");
        let parent = input.closest('.mb-3') || input.closest('.col-12') || input.parentElement;
        let err = parent.querySelector(".field-error");
        if (!err) {
            err = document.createElement("div");
            err.className = "field-error";
            parent.appendChild(err);
        }
        err.textContent = msg;
    }

    function clearError(input) {
        input.classList.remove("is-invalid");
        let parent = input.closest('.mb-3') || input.closest('.col-12') || input.parentElement;
        const err = parent.querySelector(".field-error");
        if (err) err.textContent = "";
    }

    const validateEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const validatePhone = v => /^[0-9+\-\s]{7,15}$/.test(v);

    form.querySelectorAll(".form-control").forEach(input => {
        input.addEventListener("input", () => clearError(input));
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let ok = true;

        if (!isSignup) {
            const email = form.querySelector("#emailInput");
            const password = form.querySelector("#passwordInput");

            if (!email.value.trim()) {
                setError(email, "الرجاء إدخال البريد الإلكتروني أو رقم الهاتف."); ok = false;
            }
            if (!password.value) {
                setError(password, "الرجاء إدخال كلمة المرور."); ok = false;
            } else if (password.value.length < 6) {
                setError(password, "كلمة المرور يجب أن تكون 6 أحرف أو أرقام على الأقل."); ok = false;
            }

            if (ok) {
                const btn = document.getElementById('btnLoginSubmit');
                if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = 'جاري التحقق...';
                }
                toast('تم تسجيل الدخول بنجاح، جاري التحويل...');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 900);
            }
        }

        if (isSignup) {
            const first   = form.querySelector("#firstNameInput");
            const last    = form.querySelector("#lastNameInput");
            const email   = form.querySelector("#emailInput");
            const phone   = form.querySelector("#phoneNumberInput");
            const password = form.querySelector("#passwordInput");
            const confirm = form.querySelector("#passwordConfirmInput");
            const terms   = form.querySelector("#agreeTerms");

            if (!first.value.trim() || first.value.trim().length < 2) { 
                setError(first, "أدخل الاسم الأول (حرفان على الأقل)."); ok = false; 
            }
            if (!last.value.trim() || last.value.trim().length < 2) { 
                setError(last, "أدخل الاسم الأخير (حرفان على الأقل)."); ok = false; 
            }
            if (!email.value.trim() || !validateEmail(email.value.trim())) { 
                setError(email, "أدخل بريداً إلكترونياً صحيحاً."); ok = false; 
            }
            if (!phone.value.trim() || !validatePhone(phone.value.trim())) { 
                setError(phone, "أدخل رقم هاتف صحيحاً لتلقي الإشعارات."); ok = false; 
            }
            if (!password.value || password.value.length < 6) { 
                setError(password, "كلمة المرور يجب أن تكون 6 أحرف على الأقل."); ok = false; 
            }
            if (confirm.value !== password.value) { 
                setError(confirm, "كلمتا المرور غير متطابقتين."); ok = false; 
            }
            if (terms && !terms.checked) {
                toast('يرجى الموافقة على شروط الخدمة وسياسة الضمان للمتابعة');
                ok = false;
            }

            if (ok) {
                const btn = document.getElementById('btnSignupSubmit');
                if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = 'جاري إنشاء الحساب...';
                }
                toast('تم إنشاء الحساب بنجاح.');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1000);
            }
        }

        if (!ok) {
            form.querySelector(".is-invalid")?.focus();
        }
    });
})();
