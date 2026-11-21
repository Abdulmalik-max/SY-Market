/* =========================================================
   Shared Compact Header, Mobile Drawer & Footer
   Supports both pages/*.html and pages/accounts/*.html
   ========================================================= */
(function () {
  "use strict";

  const path = window.location.pathname.toLowerCase();
  const inAccounts = path.includes("/accounts/");
  const root = inAccounts ? "../../" : "../";
  const pages = inAccounts ? "../" : "";
  const accounts = inAccounts ? "" : "accounts/";

  const page = (path.split("/").pop() || "").toLowerCase();
  const isActive = (file) => (page === file ? "active" : "");

  const headerMount = document.getElementById("siteHeader");
  if (headerMount) {
    headerMount.outerHTML = `
      <div id="mobileNavBackdrop" class="mobile-nav-backdrop"></div>
      <aside id="mobileNavDrawer" class="mobile-nav-drawer" aria-label="القائمة الجانبية">
        <div class="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom border-secondary border-opacity-25">
          <a href="${root}index.html" class="header-brand">
            <div class="brand-logo-media">
              <img src="${root}public/images/logo-dark.png" alt="رصيد RASEED" class="brand-logo-img logo-for-dark" onerror="this.parentElement.classList.add('use-svg')" />
              <img src="${root}public/images/logo-light.png" alt="رصيد RASEED" class="brand-logo-img logo-for-light" onerror="this.parentElement.classList.add('use-svg')" />
              <div class="brand-svg-fallback">
                <div class="brand-wordmark">
                  <span class="brand-wordmark-ar">رصيد</span>
                  <span class="brand-wordmark-en">RASEED</span>
                </div>
              </div>
            </div>
          </a>
          <button id="btnCloseMobileMenu" type="button" class="modal-close" aria-label="إغلاق القائمة">✕</button>
        </div>

        <div class="d-flex flex-column gap-1 mb-3">
          <div class="drawer-group-label">التنقل</div>
          <a href="${root}index.html" class="mobile-nav-link">المتجر الرئيسي</a>
          <a href="${accounts}dashboard.html" class="mobile-nav-link ${isActive("dashboard.html")}">لوحة التحكم وحسابي</a>
          <a href="${pages}wallet.html" class="mobile-nav-link ${isActive("wallet.html")}">كشف حساب المحفظة</a>
          <a href="${pages}merchant.html" class="mobile-nav-link ${isActive("merchant.html")}">بوابة التجار والموزعين</a>
          <a href="${pages}track-order.html" class="mobile-nav-link ${isActive("track-order.html")}">تتبع الطلب</a>

          <div class="drawer-group-label">المعلومات والسياسات</div>
          <a href="${pages}about.html" class="mobile-nav-link ${isActive("about.html")}">عن المتجر</a>
          <a href="${pages}faq.html" class="mobile-nav-link ${isActive("faq.html")}">الأسئلة الشائعة</a>
          <a href="${pages}terms.html" class="mobile-nav-link ${isActive("terms.html")}">الشروط والضمان</a>
          <a href="${pages}privacy.html" class="mobile-nav-link ${isActive("privacy.html")}">سياسة الخصوصية</a>
          <a href="${pages}contact.html" class="mobile-nav-link ${isActive("contact.html")}">الدعم الفني</a>
        </div>

        <div class="mt-auto pt-3 border-top border-secondary border-opacity-25 d-flex flex-column gap-2">
          <a href="${accounts}login.html" class="btn btn-ghost w-100">تسجيل الدخول</a>
          <a href="${accounts}signup.html" class="btn btn-brand w-100">إنشاء حساب جديد</a>
        </div>
      </aside>

      <header class="app-header sticky-top">
        <div class="container-xxl">
          <div class="header-main-bar">
            <a href="${root}index.html" class="header-brand" title="رصيد | RASEED — الرئيسية">
              <div class="brand-logo-media">
                <img src="${root}public/images/logo-dark.png" alt="رصيد RASEED" class="brand-logo-img logo-for-dark" onerror="this.parentElement.classList.add('use-svg')" />
                <img src="${root}public/images/logo-light.png" alt="رصيد RASEED" class="brand-logo-img logo-for-light" onerror="this.parentElement.classList.add('use-svg')" />
                <div class="brand-svg-fallback">
                  <div class="brand-wordmark">
                    <span class="brand-wordmark-ar">رصيد</span>
                    <span class="brand-wordmark-en">RASEED</span>
                  </div>
                </div>
              </div>
            </a>

            <nav class="header-nav" aria-label="التنقل الرئيسي">
              <a href="${root}index.html" class="header-nav-link">المتجر</a>
              <a href="${accounts}dashboard.html" class="header-nav-link ${isActive("dashboard.html")}">حسابي</a>
              <a href="${pages}wallet.html" class="header-nav-link ${isActive("wallet.html")}">المحفظة</a>
              <a href="${pages}merchant.html" class="header-nav-link ${isActive("merchant.html")}">بوابة التجار</a>
              <a href="${pages}track-order.html" class="header-nav-link ${isActive("track-order.html")}">تتبع الطلب</a>
              <a href="${pages}contact.html" class="header-nav-link ${isActive("contact.html")}">الدعم</a>
            </nav>

            <div class="header-actions">
              <a href="${root}index.html" class="icon-btn d-none d-md-inline-flex">العودة للمتجر</a>
              <button type="button" class="theme-toggle" aria-label="تبديل المظهر"></button>
              <a href="${accounts}login.html" class="icon-btn auth-login-btn d-none d-sm-inline-flex">دخول</a>
              <a href="${accounts}signup.html" class="btn btn-brand auth-signup-btn d-none d-md-inline-flex">حساب جديد</a>
              <button id="btnOpenMobileMenu" type="button" class="btn-mobile-menu" aria-label="فتح القائمة">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  const footerMount = document.getElementById("siteFooter");
  if (footerMount) {
    footerMount.outerHTML = `
      <footer class="app-footer">
        <div class="container-xxl">
          <div class="footer-grid">
            <div class="footer-brand-col">
              <a href="${root}index.html" class="header-brand">
                <div class="brand-logo-media">
                  <img src="${root}public/images/logo-dark.png" alt="رصيد RASEED" class="brand-logo-img logo-for-dark" onerror="this.parentElement.classList.add('use-svg')" />
                  <img src="${root}public/images/logo-light.png" alt="رصيد RASEED" class="brand-logo-img logo-for-light" onerror="this.parentElement.classList.add('use-svg')" />
                  <div class="brand-svg-fallback">
                    <div class="brand-wordmark">
                      <span class="brand-wordmark-ar">رصيد</span>
                      <span class="brand-wordmark-en">RASEED</span>
                    </div>
                  </div>
                </div>
              </a>
              <p class="footer-desc">
                منصة شحن فوري للألعاب والبطاقات الرقمية والاشتراكات لليمن والسعودية والعراق ودول الخليج.
              </p>
            </div>

            <div>
              <h4 class="footer-title">المتجر</h4>
              <ul class="footer-list">
                <li><a href="${root}index.html#sec-games">الألعاب</a></li>
                <li><a href="${root}index.html#sec-cards">البطاقات الرقمية</a></li>
                <li><a href="${root}index.html#sec-services">الاشتراكات والخدمات</a></li>
                <li><a href="${pages}wallet.html">كشف المحفظة</a></li>
                <li><a href="${pages}track-order.html">تتبع الطلب</a></li>
              </ul>
            </div>

            <div>
              <h4 class="footer-title">المساعدة</h4>
              <ul class="footer-list">
                <li><a href="${pages}about.html">عن المتجر</a></li>
                <li><a href="${pages}faq.html">الأسئلة الشائعة</a></li>
                <li><a href="${pages}terms.html">الشروط والضمان</a></li>
                <li><a href="${pages}privacy.html">سياسة الخصوصية</a></li>
                <li><a href="${pages}contact.html">تواصل معنا</a></li>
              </ul>
            </div>

            <div>
              <h4 class="footer-title">وسائل الدفع</h4>
              <div class="footer-payments">
                <img src="${root}public/images/payments/Jaib%20Wallet.png" alt="جيب" title="محفظة جيب" loading="lazy" />
                <img src="${root}public/images/payments/OneCash%20Wallet.png" alt="ون كاش" title="ون كاش" loading="lazy" />
                <img src="${root}public/images/payments/Floosak%20Wallet.png" alt="فلوسك" title="فلوسك" loading="lazy" />
                <img src="${root}public/images/payments/Jawali%20Wallet.png" alt="جوالي" title="جوالي" loading="lazy" />
                <img src="${root}public/images/payments/Kuraimi%20Bank.png" alt="الكريمي" title="مصرف الكريمي" loading="lazy" />
                <img src="${root}public/images/payments/Qutaibi%20Bank.png" alt="القطيبي" title="مصرف القطيبي" loading="lazy" />
                <img src="${root}public/images/payments/Alrajhi%20Bank.png" alt="الراجحي" title="مصرف الراجحي" loading="lazy" />
                <img src="${root}public/images/payments/Alinma%20Bank.png" alt="الإنماء" title="بنك الإنماء" loading="lazy" />
                <img src="${root}public/images/payments/STC%20SAWA.png" alt="سوا" title="سوا STC" loading="lazy" />
                <img src="${root}public/images/payments/Mobily%20Cards.png" alt="موبايلي" title="موبايلي" loading="lazy" />
                <img src="${root}public/images/payments/Asiacell.png" alt="آسيا سيل" title="آسيا سيل" loading="lazy" />
                <img src="${root}public/images/payments/Binance.png" alt="Binance" title="Binance Pay" loading="lazy" />
              </div>
            </div>
          </div>

          <div class="footer-bottom">
            <span>© 2026 رصيد (RASEED). جميع الحقوق محفوظة.</span>
            <button type="button" id="btnBackToTop" class="btn-back-top" aria-label="العودة للأعلى">
              <span>الأعلى</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    `;
  }

  /* Theme Toggle */
  const THEME_KEY = "mdarahim-theme";
  const SUN_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const MOON_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-bs-theme", theme);
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.innerHTML = theme === "dark" ? SUN_ICON : MOON_ICON;
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0b0f15" : "#eff2f6");
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
  }

  let initialTheme = "dark";
  try { initialTheme = localStorage.getItem(THEME_KEY) || "dark"; } catch (_) {}
  applyTheme(initialTheme);

  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") || "dark";
      applyTheme(cur === "dark" ? "light" : "dark");
    });
  });

  /* Mobile Drawer */
  const drawer = document.getElementById("mobileNavDrawer");
  const backdrop = document.getElementById("mobileNavBackdrop");

  function toggleDrawer(open) {
    if (!drawer || !backdrop) return;
    const isOpen = open !== undefined ? open : !drawer.classList.contains("open");
    drawer.classList.toggle("open", isOpen);
    backdrop.classList.toggle("open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  document.getElementById("btnOpenMobileMenu")?.addEventListener("click", () => toggleDrawer(true));
  document.getElementById("btnCloseMobileMenu")?.addEventListener("click", () => toggleDrawer(false));
  backdrop?.addEventListener("click", () => toggleDrawer(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggleDrawer(false);
  });

  /* Back to Top */
  document.getElementById("btnBackToTop")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();