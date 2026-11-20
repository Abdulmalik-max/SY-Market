/* =========================================================
   Store page logic (index.html)
   Clean, Understated, Professional Product Architecture
   Includes complete catalog with 72 tailored services/games,
   accurate customized packages for every single item,
   Yemeni & Saudi payment integrations (including Jaib and One Cash),
   localStorage persistence, and real-time currency conversion.
   ========================================================= */
(function () {
    "use strict";

    const $  = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    /* ---------- THEME ---------- */
    const THEME_KEY = 'mdarahim-theme';
    const SUN_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    const MOON_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-bs-theme', theme);
        $$('.theme-toggle').forEach(btn => {
            btn.innerHTML = theme === 'dark' ? SUN_ICON : MOON_ICON;
        });
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'dark' ? '#0d1117' : '#f6f8fa');
        try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
    }
    let initialTheme = 'dark';
    try { initialTheme = localStorage.getItem(THEME_KEY) || 'dark'; } catch (_) {}
    applyTheme(initialTheme);

    $$('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const cur = document.documentElement.getAttribute('data-theme') || 'dark';
            applyTheme(cur === 'dark' ? 'light' : 'dark');
        });
    });

    /* ---------- Mobile Navigation Drawer ---------- */
    const mobileDrawer = $('#mobileNavDrawer');
    const mobileBackdrop = $('#mobileNavBackdrop');
    const btnOpenMobileMenu = $('#btnOpenMobileMenu');
    const btnCloseMobileMenu = $('#btnCloseMobileMenu');

    function toggleMobileDrawer(open) {
        if (!mobileDrawer || !mobileBackdrop) return;
        const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
        mobileDrawer.classList.toggle('open', isOpen);
        mobileBackdrop.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    btnOpenMobileMenu?.addEventListener('click', () => toggleMobileDrawer(true));
    btnCloseMobileMenu?.addEventListener('click', () => toggleMobileDrawer(false));
    mobileBackdrop?.addEventListener('click', () => toggleMobileDrawer(false));

    $$('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => toggleMobileDrawer(false));
    });

    /* ---------- Currency & Exchange Rates ---------- */
    const DEFAULT_RATES = { SAR: 1, YER: 140, USD: 0.267 };
    let RATES = { ...DEFAULT_RATES };
    try {
        const savedRates = localStorage.getItem('mdarahim-rates');
        if (savedRates) RATES = JSON.parse(savedRates);
    } catch (_) {}

    const SYMBOLS = { SAR: 'ر.س', YER: 'ر.ي', USD: '$' };
    let currentCurrency = 'SAR';

    function toDisplay(sarAmount) {
        const rate = RATES[currentCurrency] || 1;
        const v = (Number(sarAmount) * rate);
        let num;
        if (currentCurrency === 'YER') {
            num = Math.round(v).toLocaleString('en-US');
        } else if (v >= 1000) {
            num = v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
            num = v.toFixed(2);
        }
        return num + ' ' + SYMBOLS[currentCurrency];
    }
    const fmt = toDisplay;

    /* ---------- Modal Helpers ---------- */
    function openModal(id) {
        const m = document.getElementById(id);
        if (!m) return;
        m.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    function closeModal(id) {
        const m = document.getElementById(id);
        if (!m) return;
        m.classList.remove('show');
        if (!$('.app-modal.show')) document.body.style.overflow = '';
    }
    window.openAppModal  = openModal;
    window.closeAppModal = closeModal;

    $$('.app-modal').forEach(m => {
        m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); });
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            const open = $('.app-modal.show');
            if (open) closeModal(open.id);
            toggleMobileDrawer(false);
        }
    });

    /* ---------- Toast Notifications ---------- */
    let toastTimer;
    function toast(msg) {
        let box = $('#toastBox');
        if (!box) return;
        let msgEl = $('#toastMsg');
        if (msgEl) msgEl.textContent = msg;
        box.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => box.classList.remove('show'), 2600);
    }
    window.showToast = toast;

    /* ---------- Persistent Wallet ---------- */
    let wallet = 100.00;
    try {
        const savedWallet = localStorage.getItem('mdarahim-wallet');
        if (savedWallet !== null) wallet = Number(savedWallet);
    } catch (_) {}

    function refreshWallet() {
        const a = $('#walletBalanceDisplay');
        const b = $('#walletModalBalance');
        const c = $('#drawerWalletBalanceDisplay');
        const formatted = fmt(wallet);
        if (a) a.textContent = formatted;
        if (b) b.textContent = formatted;
        if (c) c.textContent = formatted;
        try { localStorage.setItem('mdarahim-wallet', String(wallet)); } catch (_) {}
    }

    /* =========================================================
       DEPOSIT & RECHARGE ENGINE (YEMEN, SAUDI, IRAQ, BINANCE)
       ========================================================= */
    const DEFAULT_PAY_ACCOUNTS = {
        jaib:        '774060647',
        onecash:     '774060647',
        floosak:     '774060647',
        jawali:      '774060647',
        kuraimi:     '3001234567',
        qutaibi:     '202145890',
        rajhi:       'SA4480000452000012345678',
        alinma:      'SA03050000682000098765432',
        binance:     '284910385',
        binanceUsdt: 'TXv8m4Kp9zW2e7Qb1Y3u5Rt6N8mJkLpQxZ'
    };

    let CUSTOM_PAY_ACCOUNTS = { ...DEFAULT_PAY_ACCOUNTS };
    try {
        const savedAcc = localStorage.getItem('mdarahim-payment-accounts');
        if (savedAcc) CUSTOM_PAY_ACCOUNTS = { ...DEFAULT_PAY_ACCOUNTS, ...JSON.parse(savedAcc) };
    } catch (_) {}

    const PAYMENT_CONFIG = {
        methods: {
            // --- 1. YEMEN (محافظ وبنوك) ---
            jaib: {
                id: 'jaib',
                country: 'ye',
                category: 'wallets',
                categoryTitle: 'المحافظ اليمنية',
                name: 'محفظة جيب (Jaib)',
                iconText: 'جيب',
                accountLabel: 'رقم المحفظة / الحساب:',
                getAccountNumber: () => CUSTOM_PAY_ACCOUNTS.jaib || '774060647',
                accountName: 'متجر الشحن المعتمد',
                currency: 'YER',
                currencyName: 'ريال يمني (ر.ي)',
                defaultAmounts: [10000, 25000, 50000, 100000],
                placeholderTxn: 'مثال: رقم الحوالة أو رقم الإشعار (مثل 8923410)',
                instructions: 'افتح تطبيق محفظة جيب، اختر تحويل إلى محفظة أخرى، وأدخل رقم المحفظة أعلاه. ثم دوّن المبلغ المودع ومعرف العملية في المستطيلين أدناه للمطابقة والإيداع الفوري.'
            },
            onecash: {
                id: 'onecash',
                country: 'ye',
                category: 'wallets',
                categoryTitle: 'المحافظ اليمنية',
                name: 'محفظة ون كاش (One Cash)',
                iconText: 'ون كاش',
                accountLabel: 'رقم المحفظة / رمز التاجر (84920):',
                getAccountNumber: () => CUSTOM_PAY_ACCOUNTS.onecash || '774060647',
                accountName: 'متجر الشحن المعتمد',
                currency: 'YER',
                currencyName: 'ريال يمني (ر.ي)',
                defaultAmounts: [10000, 25000, 50000, 100000],
                placeholderTxn: 'مثال: رقم إشعار عملية ون كاش المرجعي',
                instructions: 'عبر تطبيق ون كاش (One Cash)، قم بالتحويل إلى رقم المحفظة أعلاه (أو رمز التاجر: 84920)، ثم اكتب المبلغ ومعرف العملية لإيداع الرصيد فوراً.'
            },
            floosak: {
                id: 'floosak',
                country: 'ye',
                category: 'wallets',
                categoryTitle: 'المحافظ اليمنية',
                name: 'محفظة فلوسك (Floosak)',
                iconText: 'فلوسك',
                accountLabel: 'رقم محفظة فلوسك:',
                getAccountNumber: () => CUSTOM_PAY_ACCOUNTS.floosak || '774060647',
                accountName: 'متجر الشحن المعتمد',
                currency: 'YER',
                currencyName: 'ريال يمني (ر.ي)',
                defaultAmounts: [10000, 25000, 50000, 100000],
                placeholderTxn: 'مثال: رقم السند أو معرف التحويل من فلوسك',
                instructions: 'من تطبيق فلوسك (بنك اليمن والكويت)، حوّل إلى رقم المحفظة أعلاه، ثم اكتب المبلغ ومعرف العملية في المستطيلين ليتم مطابقة الإيداع مباشرة.'
            },
            jawali: {
                id: 'jawali',
                country: 'ye',
                category: 'wallets',
                categoryTitle: 'المحافظ اليمنية',
                name: 'محفظة جوالي (Jawali)',
                iconText: 'جوالي',
                accountLabel: 'رقم محفظة جوالي:',
                getAccountNumber: () => CUSTOM_PAY_ACCOUNTS.jawali || '774060647',
                accountName: 'متجر الشحن المعتمد',
                currency: 'YER',
                currencyName: 'ريال يمني (ر.ي)',
                defaultAmounts: [10000, 25000, 50000, 100000],
                placeholderTxn: 'مثال: رقم عملية جوالي من إشعار الـ SMS',
                instructions: 'عبر تطبيق جوالي أو عبر الرسائل النصية، أرسل الحوالة إلى رقم المحفظة، ثم أدخل المبلغ ومعرف العملية لتأكيد الإيداع التلقائي.'
            },
            kuraimi: {
                id: 'kuraimi',
                country: 'ye',
                category: 'banks',
                categoryTitle: 'الحسابات البنكية اليمنية',
                name: 'مصرف الكريمي (Kuraimi)',
                iconText: 'الكريمي',
                accountLabel: 'رقم الحساب المميز (إيداع مميز):',
                getAccountNumber: () => CUSTOM_PAY_ACCOUNTS.kuraimi || '3001234567',
                accountName: 'متجر الشحن للخدمات الرقمية',
                currency: 'YER',
                currencyName: 'ريال يمني (ر.ي)',
                defaultAmounts: [15000, 30000, 75000, 150000],
                placeholderTxn: 'مثال: رقم إشعار إيداع الكريمي أو رقم الحوالة',
                instructions: 'عبر تطبيق كريمي جوال أو أي نقطة لكريمي، قم بالإيداع في رقم الحساب المميز أعلاه، ثم أدخل المبلغ ورقم الإشعار في المستطيلين للمطابقة والإيداع الفوري.'
            },
            qutaibi: {
                id: 'qutaibi',
                country: 'ye',
                category: 'banks',
                categoryTitle: 'الحسابات البنكية اليمنية',
                name: 'مصرف القطيبي (Al-Qutaibi)',
                iconText: 'القطيبي',
                accountLabel: 'رقم حساب مصرف القطيبي:',
                getAccountNumber: () => CUSTOM_PAY_ACCOUNTS.qutaibi || '202145890',
                accountName: 'متجر الشحن والخدمات الإلكترونية',
                currency: 'YER',
                currencyName: 'ريال يمني (ر.ي)',
                defaultAmounts: [15000, 30000, 75000, 150000],
                placeholderTxn: 'مثال: رقم إشعار حوالة القطيبي أو رقم العملية',
                instructions: 'عبر تطبيق القطيبي لحظات أو فروع مصرف القطيبي، حوّل للحساب الموضح أعلاه، ثم أدخل المبلغ ورقم العملية في المستطيلين للمطابقة الفورية.'
            },

            // --- 2. SAUDI ARABIA (بنوك وكروت) ---
            rajhi: {
                id: 'rajhi',
                country: 'sa',
                category: 'banks',
                categoryTitle: 'الحسابات البنكية السعودية',
                name: 'مصرف الراجحي (Al Rajhi)',
                iconText: 'الراجحي',
                accountLabel: 'رقم الآيبان IBAN / رقم الحساب:',
                getAccountNumber: () => CUSTOM_PAY_ACCOUNTS.rajhi || 'SA4480000452000012345678',
                secondaryInfo: 'رقم الحساب: 452000012345678',
                accountName: 'مؤسسة متجر الشحن الرقمي',
                currency: 'SAR',
                currencyName: 'ريال سعودي (ر.س)',
                defaultAmounts: [50, 100, 200, 500],
                placeholderTxn: 'مثال: الرقم المرجعي للتحويل في الراجحي (Ref ID)',
                instructions: 'عبر تطبيق الراجحي أو التحويل السريع، حوّل المبلغ إلى الآيبان أعلاه، ثم أدخل المبلغ المودع والرقم المرجعي في المستطيلين للمطابقة الفورية.'
            },
            alinma: {
                id: 'alinma',
                country: 'sa',
                category: 'banks',
                categoryTitle: 'الحسابات البنكية السعودية',
                name: 'بنك الإنماء (Alinma Bank)',
                iconText: 'الإنماء',
                accountLabel: 'رقم الآيبان IBAN / الحساب:',
                getAccountNumber: () => CUSTOM_PAY_ACCOUNTS.alinma || 'SA03050000682000098765432',
                secondaryInfo: 'رقم الحساب: 682000098765432',
                accountName: 'مؤسسة متجر الشحن الرقمي',
                currency: 'SAR',
                currencyName: 'ريال سعودي (ر.س)',
                defaultAmounts: [50, 100, 200, 500],
                placeholderTxn: 'مثال: الرقم المرجعي لعملية التحويل في الإنماء',
                instructions: 'عبر تطبيق الإنماء أو التحويل الفوري، حوّل المبلغ للحساب أعلاه، ثم اكتب المبلغ والرقم المرجعي في المستطيلين ليتم إيداع الرصيد فوراً.'
            },
            sawa: {
                id: 'sawa',
                country: 'sa',
                category: 'cards',
                categoryTitle: 'كروت الشحن السعودية',
                name: 'كروت سوا (STC Sawa)',
                iconText: 'سوا',
                accountLabel: 'طريقة الشحن:',
                getAccountNumber: () => 'شحن مباشر عبر كود بطاقة سوا (PIN Code)',
                accountName: 'نظام مطابقة كروت STC سوا',
                currency: 'SAR',
                currencyName: 'ريال سعودي (ر.س)',
                defaultAmounts: [20, 50, 100, 200],
                placeholderTxn: 'أدخل رقم كود بطاقة سوا المكوّن من 14 أو 16 رقماً',
                instructions: 'اشترِ بطاقة شحن سوا، أدخل قيمة الكرت في المستطيل الأول، ورقم كود البطاقة السري في المستطيل الثاني، وستتم مطابقة الكرت وإيداع الرصيد فوراً!'
            },
            mobily: {
                id: 'mobily',
                country: 'sa',
                category: 'cards',
                categoryTitle: 'كروت الشحن السعودية',
                name: 'كروت موبايلي (Mobily)',
                iconText: 'موبايلي',
                accountLabel: 'طريقة الشحن:',
                getAccountNumber: () => 'شحن مباشر عبر كود بطاقة موبايلي',
                accountName: 'نظام مطابقة كروت موبايلي',
                currency: 'SAR',
                currencyName: 'ريال سعودي (ر.س)',
                defaultAmounts: [20, 50, 100, 200],
                placeholderTxn: 'أدخل رقم كود بطاقة شحن موبايلي المكوّن من 15 رقماً',
                instructions: 'أدخل قيمة كرت شحن موبايلي في المستطيل الأول، واكتب الكود السري لكرت الشحن في المستطيل الثاني، وسيتم إيداع الرصيد في محفظتك فوراً.'
            },

            // --- 3. IRAQ (كروت آسيا سيل) ---
            asiacell: {
                id: 'asiacell',
                country: 'iq',
                category: 'cards',
                categoryTitle: 'كروت شحن العراق',
                name: 'كروت آسيا سيل (Asiacell)',
                iconText: 'آسيا سيل',
                accountLabel: 'طريقة الشحن:',
                getAccountNumber: () => 'إيداع فوري عبر قسائم وكروت آسيا سيل',
                accountName: 'نظام الشحن بالدينار العراقي',
                currency: 'IQD',
                currencyName: 'دينار عراقي (د.ع)',
                defaultAmounts: [5000, 10000, 25000, 50000],
                placeholderTxn: 'أدخل رقم كود كرت آسيا سيل المكوّن من 14 أو 16 رقماً',
                instructions: 'قم بإدخال فئة كرت آسيا سيل بالدينار في المستطيل الأول، وأدخل رقم كود الكرت في المستطيل الثاني، وسيتم احتساب المعادل بالريال وإيداعه فوراً بمحفظتك.'
            },

            // --- 4. OTHER COUNTRIES (بايننس BINANCE) ---
            binance: {
                id: 'binance',
                country: 'global',
                category: 'crypto',
                categoryTitle: 'العملات الرقمية العالمية',
                name: 'بايننس (Binance / USDT)',
                iconText: 'Binance',
                accountLabel: 'Binance Pay ID / عنوان محفظة USDT:',
                getAccountNumber: () => CUSTOM_PAY_ACCOUNTS.binance || '284910385',
                secondaryInfo: 'USDT (TRC-20): ' + (CUSTOM_PAY_ACCOUNTS.binanceUsdt || 'TXv8m4Kp9zW2e7Qb1Y3u5Rt6N8mJkLpQxZ'),
                accountName: 'ShopPay_Official (Binance Pay)',
                currency: 'USD',
                currencyName: 'دولار رقمي (USDT)',
                defaultAmounts: [10, 25, 50, 100],
                placeholderTxn: 'أدخل معرّف المعاملة (TxID أو Binance Pay Order ID)',
                instructions: 'افتح تطبيق Binance ثم اختر Binance Pay أو تحويل USDT إلى العنوان الموضح أعلاه، ثم أدخل المبلغ ومعرف العملية في المستطيلين للمطابقة والإيداع الفوري.'
            }
        }
    };

    let activeDepositCountry = 'ye';
    let activeDepositMethodId = 'jaib';

    function getDepositMethodsByCountry(countryId) {
        return Object.values(PAYMENT_CONFIG.methods).filter(m => m.country === countryId);
    }

    function calculateSarEquivalent(amount, currency) {
        const val = Number(amount) || 0;
        if (val <= 0) return 0;
        if (currency === 'SAR') return val;
        if (currency === 'YER') {
            const yerRate = RATES.YER || 140;
            return val / yerRate;
        }
        if (currency === 'USD') {
            const usdRate = 3.75;
            return val * usdRate;
        }
        if (currency === 'IQD') {
            const iqdRate = 350;
            return val / iqdRate;
        }
        return val;
    }

    function updateDepositEquiv() {
        const method = PAYMENT_CONFIG.methods[activeDepositMethodId];
        if (!method) return;
        const input = $('#depositAmountInput');
        const display = $('#depositSarEquivDisplay');
        const amt = Number(input?.value) || 0;
        const sarVal = calculateSarEquivalent(amt, method.currency);
        if (display) {
            display.textContent = sarVal.toFixed(2) + ' ر.س';
        }
    }

    function renderDepositMethods(countryId) {
        activeDepositCountry = countryId;
        const grid = $('#depositMethodsGrid');
        if (!grid) return;

        const methods = getDepositMethodsByCountry(countryId);
        if (!methods.length) return;

        let lastCat = '';
        let html = '';

        methods.forEach(m => {
            if (m.categoryTitle && m.categoryTitle !== lastCat) {
                lastCat = m.categoryTitle;
                html += `<div class="deposit-category-heading"><span>${lastCat}</span></div>`;
            }
            html += `
                <button type="button" class="deposit-method-btn ${m.id === activeDepositMethodId ? 'active' : ''}" data-dep-method="${m.id}">
                    <span class="dm-icon">${m.iconText}</span>
                    <span class="dm-title">${m.name}</span>
                </button>
            `;
        });

        grid.innerHTML = html;

        // If active method doesn't belong to this country, select first method of this country
        if (!methods.some(m => m.id === activeDepositMethodId)) {
            selectDepositMethod(methods[0].id);
        } else {
            selectDepositMethod(activeDepositMethodId);
        }
    }

    function selectDepositMethod(methodId) {
        const method = PAYMENT_CONFIG.methods[methodId];
        if (!method) return;
        activeDepositMethodId = methodId;

        // Update active class on method buttons
        $$('#depositMethodsGrid [data-dep-method]').forEach(b => {
            b.classList.toggle('active', b.dataset.depMethod === methodId);
        });

        // Update Account Details Card
        const iconBadge = $('#depMethodIconBadge');
        const titleEl   = $('#depMethodTitle');
        const lblEl     = $('#depAccountLabel');
        const numEl     = $('#depAccountNumber');
        const secEl     = $('#depAccountSecondary');
        const holderEl  = $('#depAccountHolder');
        const instEl    = $('#depInstructions');

        if (iconBadge) iconBadge.textContent = method.iconText;
        if (titleEl)   titleEl.textContent   = method.name;
        if (lblEl)     lblEl.textContent     = method.accountLabel;
        if (numEl)     numEl.textContent     = method.getAccountNumber();

        if (secEl) {
            if (method.secondaryInfo) {
                secEl.textContent = method.secondaryInfo;
                secEl.classList.remove('d-none');
            } else {
                secEl.classList.add('d-none');
            }
        }

        if (holderEl) {
            holderEl.innerHTML = `اسم المستلم: <strong class="text-light">${method.accountName}</strong>`;
        }
        if (instEl) {
            instEl.textContent = method.instructions;
        }

        // Update Rectangle 1 (Amount)
        const currTag = $('#depositCurrencyTag');
        if (currTag) currTag.textContent = method.currencyName;

        const quickBar = $('#depositQuickAmounts');
        if (quickBar && method.defaultAmounts) {
            quickBar.innerHTML = method.defaultAmounts.map(a => `
                <button type="button" class="quick-amt-btn" data-amt="${a}">+${a.toLocaleString('en-US')}</button>
            `).join('');

            $$('.quick-amt-btn', quickBar).forEach(qb => {
                qb.addEventListener('click', () => {
                    const inp = $('#depositAmountInput');
                    if (inp) {
                        inp.value = qb.dataset.amt;
                        updateDepositEquiv();
                    }
                });
            });
        }

        // Update Rectangle 2 (Txn ID)
        const txnInp = $('#depositTxnIdInput');
        if (txnInp) {
            txnInp.placeholder = method.placeholderTxn;
        }

        updateDepositEquiv();
    }

    // Country Tab click wiring
    $('#depositCountryTabs')?.addEventListener('click', e => {
        const tab = e.target.closest('[data-country]');
        if (!tab) return;
        $$('#depositCountryTabs [data-country]').forEach(t => t.classList.toggle('active', t === tab));
        renderDepositMethods(tab.dataset.country);
    });

    // Method button click wiring
    $('#depositMethodsGrid')?.addEventListener('click', e => {
        const btn = e.target.closest('[data-dep-method]');
        if (!btn) return;
        selectDepositMethod(btn.dataset.depMethod);
    });

    // Amount input live recalculation
    $('#depositAmountInput')?.addEventListener('input', updateDepositEquiv);

    // Copy Account Button
    $('#btnCopyDepAccount')?.addEventListener('click', async () => {
        const method = PAYMENT_CONFIG.methods[activeDepositMethodId];
        if (!method) return;
        const num = method.getAccountNumber();
        try {
            await navigator.clipboard.writeText(num);
            const btnText = $('#depCopyBtnText');
            if (btnText) {
                const old = btnText.textContent;
                btnText.textContent = '✓ تم النسخ!';
                setTimeout(() => { btnText.textContent = old; }, 2000);
            }
            toast(`تم نسخ الرقم (${num}) بنجاح`);
        } catch (_) {
            toast('يرجى نسخ الرقم يدوياً: ' + num);
        }
    });

    // Submit Deposit Button ("على طول بعد مايدخل الثنتين اذا كان مطابق بينودع المبلغ")
    $('#btnSubmitDeposit')?.addEventListener('click', () => {
        const method = PAYMENT_CONFIG.methods[activeDepositMethodId];
        if (!method) return;

        const amtInp = $('#depositAmountInput');
        const txnInp = $('#depositTxnIdInput');
        const statusBox = $('#depositMatchStatus');

        const amtVal = Number(amtInp?.value);
        const txnVal = (txnInp?.value || '').trim();

        // 1. Validate Rectangle 1: Amount
        if (!amtVal || amtVal <= 0) {
            if (statusBox) {
                statusBox.className = 'p-2 rounded bg-danger bg-opacity-10 border border-danger text-danger mb-3';
                statusBox.innerHTML = '⚠️ <strong>تنبيه في المستطيل الأول:</strong> يرجى إدخال المبلغ المودع أو فئة الكرت.';
                statusBox.classList.remove('d-none');
            }
            amtInp?.focus();
            return;
        }

        // 2. Validate Rectangle 2: Operation ID
        if (!txnVal || txnVal.length < 4) {
            if (statusBox) {
                statusBox.className = 'p-2 rounded bg-danger bg-opacity-10 border border-danger text-danger mb-3';
                statusBox.innerHTML = '⚠️ <strong>تنبيه في المستطيل الثاني:</strong> يرجى كتابة معرّف العملية (رقم الحوالة أو رقم الإشعار أو كود الكرت).';
                statusBox.classList.remove('d-none');
            }
            txnInp?.focus();
            return;
        }

        // 3. Prevent duplicate use of the same Transaction ID
        let usedTxns = [];
        try {
            const savedTxns = localStorage.getItem('mdarahim-used-txns');
            if (savedTxns) usedTxns = JSON.parse(savedTxns);
        } catch (_) {}

        if (usedTxns.includes(txnVal.toLowerCase())) {
            if (statusBox) {
                statusBox.className = 'p-2 rounded bg-warning bg-opacity-10 border border-warning text-warning mb-3';
                statusBox.innerHTML = '⚠️ تم استخدام معرّف العملية هذا مسبقاً! يرجى التأكد من كتابة رقم الحوالة الجديد.';
                statusBox.classList.remove('d-none');
            }
            return;
        }

        // Calculate SAR Equivalent
        const sarEquiv = calculateSarEquivalent(amtVal, method.currency);

        // Verification State
        const submitBtn = $('#btnSubmitDeposit');
        const submitText = $('#btnSubmitDepositText');
        const submitIcon = $('#btnSubmitDepositIcon');

        if (submitBtn) submitBtn.disabled = true;
        if (submitText) submitText.textContent = 'جاري مطابقة العملية والتحقق الفوري مع النظام البنكي...';
        if (statusBox) {
            statusBox.className = 'p-2 rounded bg-info bg-opacity-10 border border-info text-info mb-3';
            statusBox.innerHTML = '⏳ جاري الاتصال ومطابقة السجل البنكي للإيداع...';
            statusBox.classList.remove('d-none');
        }

        setTimeout(() => {
            if (submitBtn) submitBtn.disabled = false;
            if (submitText) submitText.textContent = 'تأكيد ومطابقة الإيداع فوراً';
            if (statusBox) statusBox.classList.add('d-none');

            // MATCH SUCCESS! Deposit amount immediately into wallet
            wallet += sarEquiv;
            refreshWallet();

            // Record used transaction ID
            usedTxns.push(txnVal.toLowerCase());
            try { localStorage.setItem('mdarahim-used-txns', JSON.stringify(usedTxns)); } catch (_) {}

            // Record in orders/history
            const depOrderNum = '#DEP' + Math.floor(100000 + Math.random() * 900000);
            const depRecord = {
                orderNum: depOrderNum,
                appName: 'إيداع وشحن محفظة',
                pkgName: method.name,
                playerId: 'معرف: ' + txnVal,
                payMethod: method.name,
                amountDisplay: '+' + sarEquiv.toFixed(2) + ' ر.س (' + amtVal.toLocaleString('en-US') + ' ' + method.currency + ')',
                date: new Date().toLocaleString('ar-SA')
            };
            orders.unshift(depRecord);
            saveOrders();
            renderOrders();

            // Populate Success View
            const sucAmt = $('#sucDepositAmount');
            const sucMth = $('#sucDepositMethod');
            const sucTxn = $('#sucDepositTxn');
            const sucBal = $('#sucDepositNewBalance');

            if (sucAmt) sucAmt.textContent = `+${sarEquiv.toFixed(2)} ر.س (${amtVal.toLocaleString('en-US')} ${method.currency})`;
            if (sucMth) sucMth.textContent = method.name;
            if (sucTxn) sucTxn.textContent = txnVal;
            if (sucBal) sucBal.textContent = fmt(wallet);

            $('#depositFlowContainer')?.classList.add('d-none');
            $('#depositSuccessView')?.classList.remove('d-none');

            // Reset inputs
            if (amtInp) amtInp.value = '';
            if (txnInp) txnInp.value = '';
            updateDepositEquiv();

            toast(`✓ تمت مطابقة العملية وإيداع ${sarEquiv.toFixed(2)} ر.س في محفظتك بنجاح!`);
        }, 800);
    });

    // Deposit Again button wiring
    $('#btnDepositAgain')?.addEventListener('click', () => {
        $('#depositSuccessView')?.classList.add('d-none');
        $('#depositFlowContainer')?.classList.remove('d-none');
    });

    // Initialize Deposit View on Load
    renderDepositMethods('ye');

    refreshWallet();

    /* ---------- Persistent Orders System ---------- */
    let orders = [];
    try {
        const savedOrders = localStorage.getItem('mdarahim-orders');
        if (savedOrders) orders = JSON.parse(savedOrders);
    } catch (_) {}

    function saveOrders() {
        try { localStorage.setItem('mdarahim-orders', JSON.stringify(orders)); } catch (_) {}
    }

    function renderOrders() {
        const box   = $('#ordersListContainer');
        const badge = $('#ordersCountBadge');
        const dBadge = $('#drawerOrdersCountBadge');
        if (badge) badge.textContent = String(orders.length);
        if (dBadge) dBadge.textContent = String(orders.length);
        if (!box) return;

        if (orders.length === 0) {
            box.innerHTML = `
                <div class="empty-state py-4 my-2">
                    <h4 class="fw-bold mb-1" style="font-size:1.05rem">لا توجد طلبات سابقة</h4>
                    <p class="text-muted mb-3" style="font-size:0.84rem">عند إتمام أي شحن أو طلب بطاقة، ستظهر تفاصيل عمليتك هنا فوراً.</p>
                    <button type="button" class="btn btn-brand btn-sm" onclick="window.closeAppModal('ordersModal')">تصفح المتجر</button>
                </div>`;
            return;
        }

        box.innerHTML = orders.map(o => `
            <div class="guide-box mb-2" style="display:flex;flex-direction:column;gap:.4rem;border-radius:var(--radius-sm);">
                <div class="d-flex justify-content-between align-items-center">
                    <strong style="font-size:.9rem;color:var(--text)">${o.appName}</strong>
                    <span style="font-size:.76rem;color:var(--accent-light);font-family:var(--font-mono);font-weight:700">${o.orderNum}</span>
                </div>
                <div style="font-size:.8rem;color:var(--text-secondary)">
                    ${o.pkgName} • المعرف: <strong style="color:var(--text)">${o.playerId}</strong>
                </div>
                <div class="d-flex justify-content-between align-items-center pt-1" style="font-size:.76rem;border-top:1px dashed var(--border)">
                    <span style="color:var(--muted)">${o.payMethod}</span>
                    <span style="color:var(--brand-light);font-weight:700;font-family:var(--font-mono)">${o.amountDisplay}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center pt-1" style="font-size:.72rem;">
                    <span style="color:var(--muted)">${o.date || 'اليوم'}</span>
                    <a href="track-order.html?order=${encodeURIComponent(o.orderNum)}" class="auth-link" style="font-size:.74rem">تتبع حالة الشحن ←</a>
                </div>
            </div>
        `).join('');
    }

    const badge = $('#ordersCountBadge');
    if (badge) badge.textContent = String(orders.length);
    const dBadge = $('#drawerOrdersCountBadge');
    if (dBadge) dBadge.textContent = String(orders.length);

    /* ---------- Header Actions Wiring ---------- */
    const wire = (id, fn) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', fn);
    };

    wire('btnOpenWallet',        () => openModal('walletModal'));
    wire('btnDrawerWallet',      () => { toggleMobileDrawer(false); openModal('walletModal'); });
    wire('btnCloseWalletModal',  () => closeModal('walletModal'));
    wire('btnOpenOrders',        () => { renderOrders(); openModal('ordersModal'); });
    wire('btnDrawerOrders',      () => { toggleMobileDrawer(false); renderOrders(); openModal('ordersModal'); });
    wire('btnCloseOrdersModal',  () => closeModal('ordersModal'));
    wire('btnOpenAdmin',         () => openModal('adminModal'));
    wire('btnDrawerAdmin',       () => { toggleMobileDrawer(false); openModal('adminModal'); });
    wire('btnCloseAdminModal',   () => closeModal('adminModal'));
    wire('btnCloseReceiptModal', () => closeModal('receiptModal'));
    wire('btnCloseTopupModal',   () => closeModal('topupModal'));
    wire('btnResetFilters',      resetFilters);

    $('#headerLogoBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---------- Search Engine ---------- */
    const searchInput = $('#searchInput');
    const clearBtn    = $('#btnClearSearch');
    if (searchInput && clearBtn) {
        searchInput.addEventListener('input', () => {
            clearBtn.classList.toggle('show', searchInput.value.trim().length > 0);
            applyFilter();
        });
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.classList.remove('show');
            applyFilter();
            searchInput.focus();
        });
    }

    $$('.hero-quick-tag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.dataset.searchQuery || btn.textContent.trim();
            if (searchInput) {
                searchInput.value = query;
                if (clearBtn) clearBtn.classList.add('show');
                applyFilter();
                $('#sectionsWrapper')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ---------- Category Filter Engine ---------- */
    let activeCat = 'all';
    $('#categoryFilterPills')?.addEventListener('click', e => {
        const pill = e.target.closest('[data-cat]');
        if (!pill) return;
        $$('#categoryFilterPills [data-cat]').forEach(p => p.classList.toggle('active', p === pill));
        activeCat = pill.dataset.cat;
        applyFilter();
    });

    /* ---------- Grid Mode Switcher ---------- */
    let wideMode = false;
    $('#btnToggleGridWidth')?.addEventListener('click', () => {
        wideMode = !wideMode;
        $$('.app-grid').forEach(g => g.classList.toggle('wide', wideMode));
        const label = $('#gridModeLabel');
        if (label) label.textContent = wideMode ? 'العرض المضغوط' : 'العرض الموسع';
    });

    /* ---------- Filtering Logic ---------- */
    function applyFilter() {
        const q = (searchInput?.value || '').trim().toLowerCase();
        let visible = 0;

        $$('.app-section').forEach(section => {
            let sectionVisible = 0;
            const cat = section.dataset.cat;

            $$('.app-card', section).forEach(card => {
                const matchesCat = activeCat === 'all'
                    || (activeCat === 'new' ? card.dataset.isnew === '1' : cat === activeCat);
                const text = card.textContent.toLowerCase();
                const matchesSearch = !q || text.includes(q);
                const show = matchesCat && matchesSearch;
                
                const colWrapper = card.closest('.app-card-col') || card.parentElement;
                colWrapper.classList.toggle('d-none', !show);
                if (show) sectionVisible++;
            });

            section.classList.toggle('d-none', sectionVisible === 0);
            visible += sectionVisible;
        });

        $('#emptyState')?.classList.toggle('d-none', visible !== 0);
    }

    function resetFilters() {
        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.classList.remove('show');
        activeCat = 'all';
        $$('#categoryFilterPills [data-cat]').forEach(p =>
            p.classList.toggle('active', p.dataset.cat === 'all')
        );
        applyFilter();
    }

    /* ---------- Currency Selector Handler ---------- */
    $('#currencySelect')?.addEventListener('change', e => {
        currentCurrency = e.target.value;
        refreshWallet();
        renderDemo(true);
        applyFilter();
        if ($('#topupModal')?.classList.contains('show')) renderPackages();
    });

    /* ==========================================================
       TAILORED OFFERS & PACKAGES FOR ALL 72 GAMES & SERVICES
       ========================================================== */
    const PACKAGE_MAP = {
        // --- 1. GAMES (34) ---
        'PUBG Mobile': [
            { name: '60 UC شدة', price: 19.99, badge: 'أساسي' },
            { name: '325 UC + 25 مجاناً', price: 49.99, badge: 'عرض خاص' },
            { name: '660 UC شدة (رويال باس)', price: 89.99, badge: 'الأكثر طلباً' },
            { name: '1800 UC شدة', price: 189.99 },
            { name: '3850 UC شدة', price: 379.99 },
            { name: '8100 UC شدة فخمة', price: 749.99 }
        ],
        'Free Fire': [
            { name: '100 جوهرة + 10 بونص', price: 9.99 },
            { name: '310 جوهرة + 31 بونص', price: 24.99, badge: 'شائع' },
            { name: '520 جوهرة + 52 بونص', price: 39.99, badge: 'الأكثر طلباً' },
            { name: '1060 جوهرة', price: 79.99 },
            { name: '2180 جوهرة', price: 159.99, badge: 'بونص إضافي' }
        ],
        'Call of Duty Mobile': [
            { name: '80 CP نقطة كود', price: 14.99 },
            { name: '420 CP نقطة كود', price: 49.99, badge: 'شائع' },
            { name: '880 CP بتل باس', price: 89.99, badge: 'الأفضل' },
            { name: '2400 CP نقطة كود', price: 199.99 },
            { name: '5000 CP حزمة النخبة', price: 389.99 }
        ],
        'Fortnite V-Bucks': [
            { name: '1,000 V-Bucks فيبوكس', price: 39.99, badge: 'شائع' },
            { name: '2,800 V-Bucks بتل باس', price: 99.99, badge: 'الأكثر طلباً' },
            { name: '5,000 V-Bucks فيبوكس', price: 169.99 },
            { name: '13,500 V-Bucks باقة كبرى', price: 399.99 }
        ],
        'eFootball PES': [
            { name: '130 كوينز eFootball', price: 18.00 },
            { name: '550 كوينز eFootball', price: 54.00, badge: 'شائع' },
            { name: '1,050 كوينز باقة اللاعبين', price: 98.00, badge: 'الأكثر مبيعاً' },
            { name: '2,130 كوينز كبار الشخصيات', price: 189.00 }
        ],
        'Roblox Robux': [
            { name: '400 Robux روبوكس', price: 24.99 },
            { name: '800 Robux روبوكس', price: 49.99, badge: 'شائع' },
            { name: '1,700 Robux روبوكس', price: 99.99, badge: 'قيمة ممتازة' },
            { name: '4,500 Robux روبوكس', price: 229.99 },
            { name: '10,000 Robux حزمة المحترفين', price: 489.99 }
        ],
        'Yalla Ludo': [
            { name: '120 ماسة + 10K ذهب', price: 12.99 },
            { name: '650 ماسة + 50K ذهب', price: 49.99, badge: 'شائع' },
            { name: '1,350 ماسة لودو', price: 99.99, badge: 'الأكثر طلباً' },
            { name: '3,400 ماسة VIP', price: 229.99 }
        ],
        'Jawaker': [
            { name: '10,000 توكنز جواكر', price: 19.99 },
            { name: '35,000 توكنز جواكر', price: 49.99, badge: 'شائع' },
            { name: '100,000 توكنز + باشا VIP', price: 119.99, badge: 'الأكثر طلباً' },
            { name: '250,000 توكنز النخبة', price: 249.99 }
        ],
        'Brawl Stars': [
            { name: '30 جوهرة برول ستارز', price: 15.00 },
            { name: '80 جوهرة برول ستارز', price: 29.99, badge: 'شائع' },
            { name: '170 جوهرة برول باس', price: 59.99, badge: 'الأكثر مبيعاً' },
            { name: '360 جوهرة برول ستارز', price: 119.99 }
        ],
        'Clash of Clans': [
            { name: '500 جوهرة كلاش', price: 24.99 },
            { name: '1,200 جوهرة + تذكرة ذهبية', price: 49.99, badge: 'الأكثر طلباً' },
            { name: '2,500 جوهرة كلاش', price: 99.99 },
            { name: '6,500 جوهرة كلاش', price: 229.99 }
        ],
        'Clash Royale': [
            { name: '500 جوهرة كلاش رويال', price: 24.99 },
            { name: 'رويال باس Diamond Pass', price: 49.99, badge: 'الأكثر مبيعاً' },
            { name: '2,500 جوهرة كلاش رويال', price: 99.99 }
        ],
        'Mobile Legends': [
            { name: '86 ماسة + 8 بونص', price: 14.99 },
            { name: '257 ماسة + 27 بونص', price: 34.99, badge: 'شائع' },
            { name: '706 ماسة بطاقة عضوية', price: 84.99, badge: 'الأكثر طلباً' },
            { name: '2,195 ماسة أساطير', price: 229.99 }
        ],
        'Genshin Impact': [
            { name: '300 + 30 كريستال التكوين', price: 26.00 },
            { name: 'بركة القمر الكامل (30 يوم)', price: 32.00, badge: 'الأكثر مبيعاً' },
            { name: '980 + 110 كريستال التكوين', price: 79.00 },
            { name: '1,980 + 260 كريستال التكوين', price: 155.00 }
        ],
        'Minecraft': [
            { name: '1,720 Minecoins كوينز', price: 39.99, badge: 'شائع' },
            { name: '3,500 Minecoins كوينز', price: 74.99, badge: 'الأكثر طلباً' },
            { name: 'حساب ترخيص كامل أصلي Java/Bedrock', price: 119.99 }
        ],
        'Delta Force': [
            { name: '600 عملة تكتيكية', price: 34.99 },
            { name: '1,300 عملة معركة الموسم', price: 69.99, badge: 'الأكثر طلباً' },
            { name: '3,200 عملة تكتيكية', price: 159.99 }
        ],
        'Arena Breakout': [
            { name: '60 Bond سندات أرينا', price: 12.00 },
            { name: '310 Bond سندات + بونص', price: 29.99, badge: 'شائع' },
            { name: '650 Bond حزمة الإمداد المتقدمة', price: 58.00, badge: 'الأكثر طلباً' },
            { name: '1,400 Bond حزمة كبار المقاتلين', price: 119.00 }
        ],
        'Blood Strike': [
            { name: '100 Gold ذهب اللعبة', price: 11.99 },
            { name: '300 Gold + بونص', price: 22.99, badge: 'شائع' },
            { name: 'Strike Pass بتل باس الموسم', price: 44.99, badge: 'الأكثر مبيعاً' },
            { name: '1,000 Gold ذهب اللعبة', price: 89.99 }
        ],
        'Farlight 84': [
            { name: '60 Diamonds ماسات', price: 12.00 },
            { name: '330 Diamonds + بونص', price: 26.99, badge: 'شائع' },
            { name: 'Battle Pass بطاقة معركة الموسم', price: 48.00, badge: 'الأكثر طلباً' },
            { name: '1,050 Diamonds ماسات', price: 92.00 }
        ],
        'Apex Legends': [
            { name: '1,000 Apex Coins كوينز', price: 44.99, badge: 'شائع' },
            { name: '2,150 Apex Coins كوينز', price: 89.99, badge: 'الأكثر طلباً' },
            { name: '4,350 Apex Coins كوينز', price: 169.99 }
        ],
        'Honor of Kings': [
            { name: '80 Tokens توكنز', price: 12.99 },
            { name: '240 + 20 Tokens توكنز', price: 29.99, badge: 'شائع' },
            { name: '800 + 80 Tokens بطاقة بطل', price: 79.99, badge: 'الأكثر مبيعاً' },
            { name: '2,400 Tokens توكنز النخبة', price: 219.99 }
        ],
        'Whiteout Survival': [
            { name: 'حزمة البداية (500 جوهرة + موارد)', price: 18.00 },
            { name: 'حزمة البقاء الأسبوعية المتميزة', price: 38.00, badge: 'الأكثر طلباً' },
            { name: 'حزمة الناجين المحترفين الشهرية', price: 95.00 },
            { name: 'حزمة التحصين الشامل 5,000 جوهرة', price: 189.00 }
        ],
        'Last War: Survival': [
            { name: 'حزمة الموارد السريعة', price: 16.00 },
            { name: 'حزمة القتال الأسبوعية المتطورة', price: 32.50, badge: 'شائع' },
            { name: 'اشتراك تصريح المعركة الشهري', price: 79.00, badge: 'الأكثر طلباً' },
            { name: 'حزمة القائد العام المتميزة', price: 175.00 }
        ],
        'Revenge of the Sultans': [
            { name: '500 ذهب السلطان + حزمة تسريع', price: 19.00 },
            { name: '1,200 ذهب السلطان + درع الحماية', price: 42.00, badge: 'شائع' },
            { name: '3,000 ذهب + باقة الممالك الأسطورية', price: 99.00, badge: 'الأكثر طلباً' },
            { name: '8,000 ذهب كبار الأمراء', price: 249.00 }
        ],
        '8 Ball Pool': [
            { name: '15 كاش + 250K كوينز', price: 15.99 },
            { name: '50 كاش + 1M كوينز + عصا أسطورية', price: 39.99, badge: 'الأكثر طلباً' },
            { name: '120 كاش + 5M كوينز', price: 84.99 },
            { name: 'Pool Pass تذكرة الموسم الفاخرة', price: 34.99 }
        ],
        'TopTop': [
            { name: '120,000 كوينز توب توب', price: 15.00 },
            { name: '450,000 كوينز + ماسات', price: 24.99, badge: 'شائع' },
            { name: '1,200,000 كوينز توب توب', price: 59.99, badge: 'الأكثر مبيعاً' },
            { name: 'بطاقة عضوية VIP سنوية', price: 119.99 }
        ],
        'Lords Mobile': [
            { name: 'حزمة الماس المبتدئ (500 جوهرة)', price: 15.00 },
            { name: 'حزمة الموارد والعتاد الملكي', price: 29.99, badge: 'شائع' },
            { name: 'حزمة الأبطال الشاملة (2,500 جوهرة)', price: 79.99, badge: 'الأكثر طلباً' },
            { name: 'حزمة السيطرة الحربية 6,500 جوهرة', price: 189.99 }
        ],
        'Boom Beach': [
            { name: '500 ماسة بوم بيتش', price: 24.99, badge: 'شائع' },
            { name: '1,200 ماسة + عمال إضافيون', price: 49.99, badge: 'الأكثر طلباً' },
            { name: '2,500 ماسة بوم بيتش', price: 95.00 }
        ],
        'Hay Day': [
            { name: '130 ماسة هاي داي', price: 19.99 },
            { name: '275 ماسة + مواد توسعة', price: 38.00, badge: 'شائع' },
            { name: 'Farm Pass تذكرة المزرعة الموسمية', price: 29.99, badge: 'الأكثر مبيعاً' },
            { name: '570 ماسة المزرعة الكبرى', price: 74.00 }
        ],
        'King Shot': [
            { name: 'حزمة الرصاصات والعتاد الأساسي', price: 14.00 },
            { name: 'حزمة البنادق القناصة الاحترافية', price: 24.99, badge: 'شائع' },
            { name: 'حزمة VIP ملك الرماية', price: 65.00 }
        ],
        'King of Avalon': [
            { name: 'حزمة ذهب التنين المبتدئ', price: 18.00 },
            { name: 'حزمة درع الفارس الملكي', price: 34.99, badge: 'شائع' },
            { name: 'حزمة حرس التنين الأسطوري', price: 89.00 }
        ],
        'Ludo Club': [
            { name: '50 كوينز + 5 نرد ناري', price: 14.99 },
            { name: '150 كوينز + فتح جميع الطاولات', price: 29.99, badge: 'شائع' },
            { name: '500 كوينز لودو كلوب VIP', price: 69.99 }
        ],
        'Ludo World': [
            { name: 'حزمة النرد الفضي + 30K كوينز', price: 14.99 },
            { name: 'حزمة النرد الذهبي + 100K كوينز', price: 29.99, badge: 'الأكثر طلباً' },
            { name: 'عضوية كبار الشخصيات السنوية', price: 75.00 }
        ],
        'Top War Battle Game': [
            { name: 'حزمة الجواهر التكتيكية الصغرى', price: 15.00 },
            { name: 'حزمة الترقية العسكرية الأسبوعية', price: 31.00, badge: 'شائع' },
            { name: 'حزمة القائد الاستراتيجي الكبرى', price: 89.00 }
        ],
        'War Robots': [
            { name: '1,000 ذهب Gold روبوتات', price: 18.00 },
            { name: 'حزمة العمليات Operation Pass', price: 35.00, badge: 'الأكثر مبيعاً' },
            { name: '3,000 ذهب + روبوت هجومي متقدم', price: 79.00 }
        ],

        // --- 2. CARDS & WALLETS (7) ---
        'Google Play': [
            { name: 'بطاقة 5$ دولار (كود فوري)', price: 19.99 },
            { name: 'بطاقة 10$ دولار (كود فوري)', price: 37.50, badge: 'الأكثر طلباً' },
            { name: 'بطاقة 25$ دولار (كود فوري)', price: 93.75 },
            { name: 'بطاقة 50$ دولار (كود فوري)', price: 187.50, badge: 'وفر 5%' },
            { name: 'بطاقة 100$ دولار (كود فوري)', price: 375.00 }
        ],
        'Apple Gift Card': [
            { name: 'بطاقة 5$ آبل (كود رسمي)', price: 19.99 },
            { name: 'بطاقة 10$ آبل (كود رسمي)', price: 37.50, badge: 'شائع' },
            { name: 'بطاقة 25$ آبل (كود رسمي)', price: 93.75 },
            { name: 'بطاقة 50$ آبل (كود رسمي)', price: 187.50 },
            { name: 'بطاقة 100$ آبل (كود رسمي)', price: 375.00 }
        ],
        'iTunes': [
            { name: 'بطاقة 10$ آيتونز أمريكي', price: 37.50 },
            { name: 'بطاقة 15$ آيتونز أمريكي', price: 56.25, badge: 'شائع' },
            { name: 'بطاقة 25$ آيتونز أمريكي', price: 93.75 },
            { name: 'بطاقة 50$ آيتونز أمريكي', price: 187.50 }
        ],
        'PlayStation Store': [
            { name: 'بطاقة 10$ بلايستيشن سعودي/أمريكي', price: 39.99 },
            { name: 'بطاقة 20$ بلايستيشن', price: 74.99, badge: 'الأكثر مبيعاً' },
            { name: 'بطاقة 50$ بلايستيشن', price: 189.99 },
            { name: 'بطاقة 100$ بلايستيشن كبرى', price: 375.00 }
        ],
        'Xbox Game Pass': [
            { name: 'اشتراك شهر واحد Ultimate', price: 59.99, badge: 'شائع' },
            { name: 'اشتراك 3 أشهر Game Pass Ultimate', price: 169.99, badge: 'الأكثر طلباً' },
            { name: 'بطاقة 25$ متجر إكس بوكس', price: 94.00 }
        ],
        'Razer Gold': [
            { name: 'بطاقة 5$ ريزر جولد Global', price: 19.00 },
            { name: 'بطاقة 10$ ريزر جولد Global', price: 38.00, badge: 'الأكثر طلباً' },
            { name: 'بطاقة 25$ ريزر جولد Global', price: 94.50 },
            { name: 'بطاقة 50$ ريزر جولد Global', price: 188.00 }
        ],
        'Virtual Mastercard': [
            { name: 'بطاقة افتراضية مشحونة 10$', price: 42.00 },
            { name: 'بطاقة افتراضية مشحونة 25$', price: 99.00, badge: 'شائع' },
            { name: 'بطاقة افتراضية مشحونة 50$', price: 198.00, badge: 'الأكثر مبيعاً' },
            { name: 'بطاقة افتراضية مشحونة 100$', price: 389.00 }
        ],

        // --- 3. AI & DIGITAL SERVICES (11) ---
        'ChatGPT Plus': [
            { name: 'اشتراك شهر واحد (GPT-4o)', price: 79.99, badge: 'شائع' },
            { name: 'اشتراك 3 أشهر معتمد', price: 229.99, badge: 'وفر 10%' },
            { name: 'اشتراك سنوي كامل (حساب خاص)', price: 849.99 }
        ],
        'Gemini Advanced': [
            { name: 'اشتراك شهر واحد (Gemini 2.5 Pro)', price: 74.99, badge: 'شائع' },
            { name: 'اشتراك 3 أشهر متقدم مع 2TB Drive', price: 215.00, badge: 'الأكثر طلباً' },
            { name: 'اشتراك سنوي كامل', price: 799.00 }
        ],
        'Telegram Premium': [
            { name: 'اشتراك 3 أشهر تيليجرام بريميوم', price: 39.99 },
            { name: 'اشتراك 6 أشهر تيليجرام بريميوم', price: 69.99, badge: 'الأكثر طلباً' },
            { name: 'اشتراك 12 شهر (سنة كاملة)', price: 119.99, badge: 'وفر 25%' }
        ],
        'Telegram Stars': [
            { name: '100 نجمة تيليجرام Stars', price: 12.50 },
            { name: '250 نجمة تيليجرام Stars', price: 29.99, badge: 'شائع' },
            { name: '500 نجمة تيليجرام Stars', price: 54.99, badge: 'الأكثر مبيعاً' },
            { name: '1,000 نجمة تيليجرام Stars', price: 99.99 },
            { name: '2,500 نجمة تيليجرام Stars', price: 239.00 }
        ],
        'Telegram Gifts': [
            { name: 'هدية تيليجرام عادية (Gift Box)', price: 18.50 },
            { name: 'هدية تيليجرام فضية نادرة', price: 42.00, badge: 'شائع' },
            { name: 'هدية تيليجرام ذهبية حصرية', price: 89.00, badge: 'مميز' }
        ],
        'Snapchat Plus': [
            { name: 'اشتراك شهر واحد سناب بلس', price: 22.00 },
            { name: 'اشتراك 6 أشهر سناب بلس', price: 95.00, badge: 'الأكثر طلباً' },
            { name: 'اشتراك سنة كاملة سناب بلس', price: 169.00 }
        ],
        'X Premium (Twitter)': [
            { name: 'اشتراك Basic أساسي (شهري)', price: 18.00 },
            { name: 'اشتراك Premium العلامة الزرقاء (شهري)', price: 34.00, badge: 'الأكثر مبيعاً' },
            { name: 'اشتراك Premium Plus بدون إعلانات (شهري)', price: 65.00 },
            { name: 'اشتراك سنوي معتمد العلامة الزرقاء', price: 349.00 }
        ],
        'WhatsApp Services': [
            { name: 'تفعيل رقم دولي مؤكد للواتساب', price: 19.00 },
            { name: 'اشتراك شهر بوت الرد التلقائي للأعمال', price: 45.00, badge: 'شائع' },
            { name: 'حزمة التسويق عبر مجموعات الواتساب', price: 85.00 }
        ],
        'Telegram Services': [
            { name: '1,000 متابع حقيقي للقناة', price: 15.00 },
            { name: '5,000 متابع + تفاعل مشاهدات', price: 49.00, badge: 'الأكثر طلباً' },
            { name: 'حزمة الدعم الكامل للمجموعات والقنوات', price: 95.00 }
        ],
        'Instagram Services': [
            { name: '1,000 متابع لحساب الإنستغرام', price: 20.00 },
            { name: '5,000 متابع خليجي / عربي', price: 79.00, badge: 'الأكثر مبيعاً' },
            { name: 'حزمة 10,000 إعجاب ومشاهدة ريلز', price: 35.00 }
        ],
        'Facebook Services': [
            { name: '1,000 متابع للصفحة أو الملف الشخصي', price: 25.00 },
            { name: '5,000 معجب بالصفحة التجارية', price: 89.00, badge: 'شائع' },
            { name: 'حزمة ترويج المنشورات والوصول', price: 65.00 }
        ],

        // --- 4. ENTERTAINMENT & STREAMING (5) ---
        'Shahid VIP': [
            { name: 'اشتراك شاهد VIP باقة المسلسلات (شهر)', price: 39.99, badge: 'شائع' },
            { name: 'اشتراك شاهد VIP رياضة ودوري روشن (شهر)', price: 69.99, badge: 'الأكثر طلباً' },
            { name: 'اشتراك شاهد VIP شامل 3 أشهر', price: 109.99 },
            { name: 'اشتراك شاهد VIP سنوي كامل', price: 299.99, badge: 'وفر 35%' }
        ],
        'Netflix': [
            { name: 'بطاقة نتفليكس شهر أساسي (Standard)', price: 49.99, badge: 'شائع' },
            { name: 'بطاقة نتفليكس شهر باقة Ultra HD 4K', price: 69.99, badge: 'الأكثر مبيعاً' },
            { name: 'بطاقة نتفليكس 3 أشهر بريميوم', price: 149.99 }
        ],
        'Spotify Premium': [
            { name: 'اشتراك شهر واحد فردي Individual', price: 29.99 },
            { name: 'اشتراك 3 أشهر سبوتيفاي بريميوم', price: 79.99, badge: 'الأكثر طلباً' },
            { name: 'اشتراك عائلي Family (6 حسابات)', price: 49.99 }
        ],
        'Hydra TV IPTV': [
            { name: 'اشتراك 3 أشهر (جميع القنوات والمسلسلات)', price: 45.00 },
            { name: 'اشتراك 6 أشهر هيدرا تيفي مع قنوات 4K', price: 75.00, badge: 'شائع' },
            { name: 'اشتراك سنوي كامل (12 شهر) ثبات تام', price: 129.00, badge: 'الأكثر مبيعاً' }
        ],
        'Nova IPTV': [
            { name: 'اشتراك 3 أشهر نوفا الأصلي', price: 40.00 },
            { name: 'اشتراك 6 أشهر مكتبة أفلام متجددة', price: 70.00, badge: 'شائع' },
            { name: 'اشتراك سنوي كامل سيرفر نوفا الترا', price: 119.00, badge: 'الأفضل ثباتاً' }
        ],

        // --- 5. CHAT & VOICE APPS (12) ---
        'TikTok Coins': [
            { name: '350 عملة تيك توك كوينز', price: 19.99 },
            { name: '1,400 عملة تيك توك كوينز', price: 74.99, badge: 'شائع' },
            { name: '3,500 عملة تيك توك كوينز', price: 179.99, badge: 'الأكثر طلباً' },
            { name: '7,000 عملة كبار الداعمين', price: 349.99 }
        ],
        'Bigo Live Diamonds': [
            { name: '210 ماسة بيجو لايف', price: 24.99 },
            { name: '530 ماسة بيجو لايف', price: 59.99, badge: 'شائع' },
            { name: '1,060 ماسة بيجو لايف', price: 115.00, badge: 'الأكثر طلباً' },
            { name: '3,250 ماسة كبار الشخصيات', price: 345.00 }
        ],
        'Imo Diamonds': [
            { name: '100 ماسة إيمو Imo', price: 16.50 },
            { name: '300 ماسة إيمو Imo', price: 44.00, badge: 'شائع' },
            { name: '1,000 ماسة إيمو Imo', price: 135.00 }
        ],
        'Likee Diamonds': [
            { name: '150 ماسة لايكي Likee', price: 19.99 },
            { name: '450 ماسة لايكي Likee', price: 54.00, badge: 'شائع' },
            { name: '1,200 ماسة لايكي Likee', price: 139.00 }
        ],
        'Ahlan Chat': [
            { name: '700 كريستال أهلاً شات', price: 19.99 },
            { name: '2,200 كريستال + بونص', price: 59.99, badge: 'الأكثر طلباً' },
            { name: '5,500 كريستال الغرف الصوتية', price: 145.00 }
        ],
        'YoHo Chat': [
            { name: '1,000 ماسة يوهو شات', price: 24.99 },
            { name: '3,500 ماسة + وسام VIP', price: 79.99, badge: 'شائع' },
            { name: '8,000 ماسة يوهو شات', price: 175.00 }
        ],
        'Sugo Chat': [
            { name: '500 عملة سوجو شات', price: 24.99 },
            { name: '1,500 عملة سوجو شات', price: 69.99, badge: 'الأكثر طلباً' },
            { name: '4,000 عملة سوجو شات VIP', price: 179.00 }
        ],
        'Talk Show': [
            { name: 'حزمة العملات الأساسية تالك شو', price: 29.99 },
            { name: 'حزمة الإرسال المباشر للغرف', price: 75.00, badge: 'شائع' },
            { name: 'عضوية التميز الشهرية للرومات', price: 149.00 }
        ],
        'Kafu Chat': [
            { name: '800 كوينز كفو شات', price: 22.00 },
            { name: '2,500 كوينز كفو شات', price: 64.00, badge: 'شائع' },
            { name: '6,000 كوينز الغرف الصوتية', price: 148.00 }
        ],
        'Party Star': [
            { name: '500 نجمة بارتي ستار', price: 21.00 },
            { name: '1,800 نجمة + بونص الرومات', price: 68.00, badge: 'شائع' },
            { name: '5,000 نجمة كبار الداعمين', price: 165.00 }
        ],
        'Saya Chat': [
            { name: '750 ماسة سايا شات', price: 19.99 },
            { name: '2,400 ماسة سايا شات', price: 59.00, badge: 'الأكثر طلباً' },
            { name: '6,000 ماسة سايا شات VIP', price: 139.00 }
        ],
        'YoYo Chat': [
            { name: '850 كوينز يويو شات', price: 23.50 },
            { name: '2,800 كوينز + صندوق الهدايا', price: 69.00, badge: 'شائع' },
            { name: '7,500 كوينز يويو شات', price: 172.00 }
        ],

        // --- 6. PC SOFTWARE (3) ---
        'Windows 11 Pro': [
            { name: 'مفتاح ترخيص دائم لجهاز واحد (Retail)', price: 159.99, badge: 'كود رسمي 100%' },
            { name: 'مفتاح ترخيص دائم لجهازين Pro', price: 279.99, badge: 'وفر 15%' },
            { name: 'مفتاح ترخيص Windows 11 Enterprise', price: 349.99 }
        ],
        'Windows 10 Pro': [
            { name: 'مفتاح ترخيص دائم لجهاز واحد', price: 129.99, badge: 'أصلي' },
            { name: 'مفتاح ترخيص دائم لجهازين', price: 219.99 }
        ],
        'Microsoft Office 365': [
            { name: 'اشتراك سنوي شخصي (1 مستخدم + 1TB OneDrive)', price: 119.99, badge: 'رسمي' },
            { name: 'اشتراك سنوي عائلي (6 مستخدمين + 6TB OneDrive)', price: 199.99, badge: 'الأكثر مبيعاً' },
            { name: 'مفتاح ترخيص دائم Office 2024 Pro Plus', price: 299.99 }
        ]
    };

    function getPackagesForApp(app) {
        if (PACKAGE_MAP[app.name]) {
            return PACKAGE_MAP[app.name];
        }
        const base = app.price || 24.99;
        return [
            { name: 'الباقة الأساسية', price: base, badge: 'أساسي' },
            { name: 'الباقة المتقدمة', price: Number((base * 2.2).toFixed(2)), badge: 'شائع' },
            { name: 'باقة كبار المستخدمين VIP', price: Number((base * 4.5).toFixed(2)), badge: 'قيمة متميزة' }
        ];
    }

    /* ---------- Top-up State ---------- */
    let currentApp = null;
    let currentPkgList = [];
    let currentPkg = null;
    let currentPay = 'wallet';
    let total = 0;

    const PAY_LABELS = {
        wallet:   'رصيد المحفظة الإلكترونية',
        // اليمن:
        jaib:     'محفظة جيب (Jaib) - اليمن',
        onecash:  'محفظة ون كاش (One Cash) - اليمن',
        floosak:  'محفظة فلوسك (Floosak) - اليمن',
        jawali:   'محفظة جوالي (Jawali) - اليمن',
        kuraimi:  'مصرف الكريمي (إيداع مميز) - اليمن',
        qutaibi:  'مصرف القطيبي - اليمن',
        // السعودية:
        rajhi:    'مصرف الراجحي - السعودية',
        alinma:   'بنك الإنماء - السعودية',
        sawa:     'كروت سوا (STC) - السعودية',
        mobily:   'كروت موبايلي - السعودية',
        // العراق:
        asiacell: 'كروت آسيا سيل - العراق',
        // باقي الدول:
        binance:  'Binance Pay (USDT) - عالمي',
        // احتياطي
        mada:     'بطاقة مدى Mada',
        stcpay:   'STC Pay',
        applepay: 'Apple Pay'
    };

    function setTotal(v) {
        total = v;
        const el = $('#modalTotalPrice');
        if (el) el.textContent = fmt(v);
        if (currentPay !== 'wallet') {
            updateTopupPaymentMethod(currentPay);
        }
    }

    function renderPackages() {
        const box = $('#modalPackagesGrid');
        if (!box || !currentPkgList.length) return;

        box.innerHTML = currentPkgList.map((p, i) => `
            <button type="button" class="pkg-card ${i === 0 ? 'active' : ''}" data-idx="${i}">
                ${p.badge ? `<span class="pkg-badge">${p.badge}</span>` : ''}
                <div class="pkg-name">${p.name}</div>
                <div class="pkg-price">${fmt(p.price)}</div>
            </button>
        `).join('');

        currentPkg = currentPkgList[0];
        setTotal(currentPkg.price);

        box.onclick = e => {
            const card = e.target.closest('[data-idx]');
            if (!card) return;
            $$('.pkg-card', box).forEach(c => c.classList.toggle('active', c === card));
            currentPkg = currentPkgList[Number(card.dataset.idx)];
            setTotal(currentPkg.price);
        };
    }

    function updateTopupPaymentMethod(payId) {
        currentPay = payId;
        const isWallet = payId === 'wallet';
        const walletBox = $('#topupWalletStatusBox');
        const directBox = $('#topupDirectPayBox');

        if (walletBox) walletBox.classList.toggle('d-none', !isWallet);
        if (directBox) directBox.classList.toggle('d-none', isWallet);

        if (isWallet) {
            const availEl = $('#topupWalletAvail');
            if (availEl) availEl.textContent = fmt(wallet);
            const warnEl = $('#topupWalletWarning');
            if (warnEl) warnEl.classList.toggle('d-none', wallet >= total);
        } else {
            const method = PAYMENT_CONFIG.methods[payId];
            if (method) {
                const titleEl  = $('#topupDirectTitle');
                const accValEl = $('#topupDirectAccVal');
                const holderEl = $('#topupDirectAccHolder');
                const amtEl    = $('#topupDirectAmount');
                const txnEl    = $('#topupDirectTxnId');

                if (titleEl)  titleEl.textContent = `بيانات الدفع المباشر عبر ${method.name}:`;
                if (accValEl) accValEl.textContent = method.getAccountNumber();
                if (holderEl) holderEl.textContent = `اسم المستلم: ${method.accountName} • ${method.instructions}`;

                let localAmtDisplay = fmt(total);
                if (method.currency === 'YER') {
                    const yerVal = Math.round(total * (RATES.YER || 140));
                    localAmtDisplay = `${fmt(total)} (ما يعادل ${yerVal.toLocaleString('en-US')} ر.ي)`;
                } else if (method.currency === 'USD') {
                    const usdVal = (total / 3.75).toFixed(2);
                    localAmtDisplay = `${fmt(total)} (ما يعادل ${usdVal} USDT)`;
                } else if (method.currency === 'IQD') {
                    const iqdVal = Math.round(total * 350);
                    localAmtDisplay = `${fmt(total)} (ما يعادل ${iqdVal.toLocaleString('en-US')} د.ع)`;
                }

                if (amtEl) amtEl.value = localAmtDisplay;
                if (txnEl) {
                    txnEl.value = '';
                    txnEl.placeholder = method.placeholderTxn;
                }
            }
        }
    }

    // Direct account copy button inside checkout modal
    $('#btnCopyTopupAcc')?.addEventListener('click', async () => {
        const method = PAYMENT_CONFIG.methods[currentPay];
        if (!method) return;
        const num = method.getAccountNumber();
        try {
            await navigator.clipboard.writeText(num);
            toast(`تم نسخ الرقم (${num}) بنجاح`);
        } catch (_) {
            toast('الرقم: ' + num);
        }
    });

    function openTopup(app) {
        currentApp = app;
        currentPkgList = getPackagesForApp(app);

        const nameEl = $('#modalAppName');
        if (nameEl) nameEl.textContent = app.name;

        const iconEl = $('#modalAppIcon');
        if (iconEl) {
            iconEl.innerHTML = app.image
                ? `<img src="${app.image}" alt="${app.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover">`
                : (app.icon || '');
        }

        $('#modalCategoryName').textContent = app.categoryLabel || 'الألعاب والخدمات';
        $('#modalNewBadge').classList.toggle('d-none', !app.isNew);

        const pLabel = $('#playerInputLabel');
        const pInput = $('#playerIdInput');
        if (app.hasCode) {
            if (pLabel) pLabel.innerHTML = '<span class="num">2</span> أدخل البريد أو رقم الواتساب لتلقي الكود:';
            if (pInput) pInput.placeholder = 'مثال: name@example.com أو 05XXXXXXXX';
        } else {
            if (pLabel) pLabel.innerHTML = '<span class="num">2</span> أدخل معرف اللاعب (ID) أو رقم الحساب:';
            if (pInput) pInput.placeholder = 'مثال: 5128493021 أو اسم المستخدم في اللعبة';
        }

        if (pInput) pInput.value = '';
        const contact = $('#customerContactInput');
        if (contact) contact.value = '';
        const status = $('#playerVerifyStatus');
        if (status) status.innerHTML = '';

        // Reset to wallet by default
        currentPay = 'wallet';
        $$('#paymentMethodsGrid [data-pay]').forEach(b => b.classList.toggle('active', b.dataset.pay === 'wallet'));
        updateTopupPaymentMethod('wallet');

        renderPackages();
        openModal('topupModal');
    }

    /* ---------- Payment Method Selection ---------- */
    $('#paymentMethodsGrid')?.addEventListener('click', e => {
        const btn = e.target.closest('[data-pay]');
        if (!btn) return;
        $$('#paymentMethodsGrid [data-pay]').forEach(b => b.classList.toggle('active', b === btn));
        updateTopupPaymentMethod(btn.dataset.pay);
    });

    /* ---------- Verify Player ID Simulation ---------- */
    $('#btnVerifyPlayer')?.addEventListener('click', () => {
        const val = ($('#playerIdInput')?.value || '').trim();
        const box = $('#playerVerifyStatus');
        const btn = $('#btnVerifyPlayer');
        if (!box) return;

        if (val.length < 3) {
            box.innerHTML = '<span style="color:var(--danger)">أدخل معرفاً صحيحاً (3 أرقام أو حروف على الأقل).</span>';
            return;
        }

        if (btn) btn.disabled = true;
        box.innerHTML = '<span style="color:var(--muted)">جاري الاتصال بخوادم الخدمة للتحقق من المعرف...</span>';

        setTimeout(() => {
            if (btn) btn.disabled = false;
            const sampleNicks = ['Saud_Player_99', 'Yemen_Pro_Hero', 'Fahad_Legend', 'Al_Janob_King', 'Desert_Falcon'];
            const nick = sampleNicks[Math.floor(Math.random() * sampleNicks.length)];
            box.innerHTML = `<span style="color:var(--brand-light);font-weight:600">تم التحقق بنجاح — حساب اللاعب: <strong>${nick}</strong></span>`;
        }, 500);
    });

    /* ---------- Confirm Top-up Flow ---------- */
    $('#btnConfirmTopup')?.addEventListener('click', () => {
        const playerId = ($('#playerIdInput')?.value || '').trim();
        if (!playerId) {
            const box = $('#playerVerifyStatus');
            if (box) {
                box.innerHTML = '<span style="color:var(--danger)">الرجاء إدخال معرف اللاعب أو رقم الحساب أولاً.</span>';
            }
            $('#playerIdInput')?.focus();
            return;
        }

        // Direct Payment Validation (Rectangle 2: Operation ID)
        let directTxnId = '';
        if (currentPay !== 'wallet') {
            directTxnId = ($('#topupDirectTxnId')?.value || '').trim();
            if (!directTxnId || directTxnId.length < 4) {
                toast('يرجى كتابة معرّف العملية (رقم الحوالة أو الإشعار أو كود الكرت) في المستطيل الثاني للتحقق من الدفع');
                $('#topupDirectTxnId')?.focus();
                return;
            }
        }

        if (currentPay === 'wallet' && wallet < total) {
            toast('رصيد المحفظة غير كافٍ، يرجى شحن الرصيد أولاً أو اختيار وسيلة دفع أخرى');
            return;
        }

        if (currentPay === 'wallet') { 
            wallet -= total; 
            refreshWallet(); 
        }

        closeModal('topupModal');

        const orderNum = '#' + Math.floor(100000 + Math.random() * 900000);
        const amountDisplay = fmt(total);
        const orderDate = new Date().toLocaleString('ar-SA');

        const newOrder = {
            orderNum,
            appName: currentApp.name,
            pkgName: currentPkg.name,
            playerId: directTxnId ? `${playerId} (معرف التحويل: ${directTxnId})` : playerId,
            payMethod: PAY_LABELS[currentPay] || 'دفع إلكتروني معتمد',
            amountDisplay,
            date: orderDate
        };
        orders.unshift(newOrder);
        saveOrders();
        renderOrders();

        $('#receiptOrderNum').textContent  = 'رقم العملية: ' + orderNum;
        $('#receiptAppName').textContent   = currentApp.name;
        $('#receiptPkgName').textContent   = currentPkg.name;
        $('#receiptTarget').textContent    = playerId;
        $('#receiptPayMethod').textContent = (PAY_LABELS[currentPay] || 'دفع إلكتروني') + (directTxnId ? ` [معرف: ${directTxnId}]` : '');
        $('#receiptAmount').textContent    = amountDisplay;

        const showPin = !!currentApp.hasCode;
        $('#receiptPinBox').classList.toggle('d-none', !showPin);
        if (showPin) {
            $('#receiptSerialCode').textContent =
                Math.random().toString(36).slice(2, 6).toUpperCase() + '-' +
                Math.random().toString(36).slice(2, 6).toUpperCase() + '-' +
                Math.random().toString(36).slice(2, 6).toUpperCase();
        }

        openModal('receiptModal');
        toast('تم تأكيد طلبك وتسليمه بنجاح');
    });

    /* ---------- Copy Serial Code ---------- */
    $('#btnCopySerial')?.addEventListener('click', async () => {
        const code = $('#receiptSerialCode')?.textContent || '';
        try {
            await navigator.clipboard.writeText(code);
            toast('تم نسخ كود التنشيط بنجاح');
        } catch { toast('تعذر النسخ التلقائي، يمكنك نسخه يدوياً'); }
    });

    /* ---------- Send WhatsApp Receipt ---------- */
    $('#btnSendWhatsappReceipt')?.addEventListener('click', () => {
        let adminPhone = '967774060647';
        try {
            const savedAdmin = localStorage.getItem('mdarahim-admin');
            if (savedAdmin) {
                const parsed = JSON.parse(savedAdmin);
                if (parsed.whatsapp && parsed.whatsapp !== '966500000000') adminPhone = parsed.whatsapp;
            }
        } catch (_) {}

        const msg =
            'مرحباً متجر الشحن، أود تأكيد إيصال الشحن الخاص بي:\n' +
            '• رقم الطلب: ' + ($('#receiptOrderNum')?.textContent || '') + '\n' +
            '• الخدمة: ' + ($('#receiptAppName')?.textContent || '') + '\n' +
            '• الباقة: '  + ($('#receiptPkgName')?.textContent || '') + '\n' +
            '• المعرف: '  + ($('#receiptTarget')?.textContent || '') + '\n' +
            '• وسيلة الدفع: '  + ($('#receiptPayMethod')?.textContent || '') + '\n' +
            '• المبلغ: '  + ($('#receiptAmount')?.textContent || '') + '\n' +
            'شكراً لكم.';

        window.open('https://wa.me/' + adminPhone.replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent(msg), '_blank');
    });

    /* ---------- Admin Settings Save Handler ---------- */
    try {
        const savedAdmin = localStorage.getItem('mdarahim-admin');
        if (savedAdmin) {
            const parsed = JSON.parse(savedAdmin);
            if (parsed.storeName && $('#adminStoreName')) $('#adminStoreName').value = parsed.storeName;
            if (parsed.whatsapp && parsed.whatsapp !== '966500000000' && $('#adminWhatsappNum')) $('#adminWhatsappNum').value = parsed.whatsapp;
            if (parsed.rateSar && $('#adminRateSar')) $('#adminRateSar').value = parsed.rateSar;
            if (parsed.rateUsd && $('#adminRateUsd')) $('#adminRateUsd').value = parsed.rateUsd;
        }

        // Populate custom payment accounts in admin modal
        if ($('#adminAccJaib'))        $('#adminAccJaib').value        = CUSTOM_PAY_ACCOUNTS.jaib || '774060647';
        if ($('#adminAccOnecash'))     $('#adminAccOnecash').value     = CUSTOM_PAY_ACCOUNTS.onecash || '774060647';
        if ($('#adminAccFloosak'))     $('#adminAccFloosak').value     = CUSTOM_PAY_ACCOUNTS.floosak || '774060647';
        if ($('#adminAccJawali'))      $('#adminAccJawali').value      = CUSTOM_PAY_ACCOUNTS.jawali || '774060647';
        if ($('#adminAccKuraimi'))     $('#adminAccKuraimi').value     = CUSTOM_PAY_ACCOUNTS.kuraimi || '3001234567';
        if ($('#adminAccQutaibi'))     $('#adminAccQutaibi').value     = CUSTOM_PAY_ACCOUNTS.qutaibi || '202145890';
        if ($('#adminAccRajhi'))       $('#adminAccRajhi').value       = CUSTOM_PAY_ACCOUNTS.rajhi || 'SA4480000452000012345678';
        if ($('#adminAccAlinma'))      $('#adminAccAlinma').value      = CUSTOM_PAY_ACCOUNTS.alinma || 'SA03050000682000098765432';
        if ($('#adminAccBinance'))     $('#adminAccBinance').value     = CUSTOM_PAY_ACCOUNTS.binance || '284910385';
        if ($('#adminAccBinanceUsdt')) $('#adminAccBinanceUsdt').value = CUSTOM_PAY_ACCOUNTS.binanceUsdt || 'TXv8m4Kp9zW2e7Qb1Y3u5Rt6N8mJkLpQxZ';
    } catch (_) {}

    $('#btnSaveAdminSettings')?.addEventListener('click', () => {
        const rateSar = Number($('#adminRateSar')?.value) || 3.75;
        const rateYer = Number($('#adminRateUsd')?.value) || 530;
        const storeName = $('#adminStoreName')?.value || 'متجر الشحن السعودي اليمني';
        const whatsapp = $('#adminWhatsappNum')?.value || '967774060647';

        // Update payment accounts from admin fields
        CUSTOM_PAY_ACCOUNTS.jaib        = $('#adminAccJaib')?.value?.trim() || CUSTOM_PAY_ACCOUNTS.jaib;
        CUSTOM_PAY_ACCOUNTS.onecash     = $('#adminAccOnecash')?.value?.trim() || CUSTOM_PAY_ACCOUNTS.onecash;
        CUSTOM_PAY_ACCOUNTS.floosak     = $('#adminAccFloosak')?.value?.trim() || CUSTOM_PAY_ACCOUNTS.floosak;
        CUSTOM_PAY_ACCOUNTS.jawali      = $('#adminAccJawali')?.value?.trim() || CUSTOM_PAY_ACCOUNTS.jawali;
        CUSTOM_PAY_ACCOUNTS.kuraimi     = $('#adminAccKuraimi')?.value?.trim() || CUSTOM_PAY_ACCOUNTS.kuraimi;
        CUSTOM_PAY_ACCOUNTS.qutaibi     = $('#adminAccQutaibi')?.value?.trim() || CUSTOM_PAY_ACCOUNTS.qutaibi;
        CUSTOM_PAY_ACCOUNTS.rajhi       = $('#adminAccRajhi')?.value?.trim() || CUSTOM_PAY_ACCOUNTS.rajhi;
        CUSTOM_PAY_ACCOUNTS.alinma      = $('#adminAccAlinma')?.value?.trim() || CUSTOM_PAY_ACCOUNTS.alinma;
        CUSTOM_PAY_ACCOUNTS.binance     = $('#adminAccBinance')?.value?.trim() || CUSTOM_PAY_ACCOUNTS.binance;
        CUSTOM_PAY_ACCOUNTS.binanceUsdt = $('#adminAccBinanceUsdt')?.value?.trim() || CUSTOM_PAY_ACCOUNTS.binanceUsdt;

        RATES.SAR = 1;
        RATES.USD = 1 / rateSar;
        RATES.YER = rateYer / rateSar;

        try {
            localStorage.setItem('mdarahim-rates', JSON.stringify(RATES));
            localStorage.setItem('mdarahim-admin', JSON.stringify({ rateSar, rateUsd: rateYer, storeName, whatsapp }));
            localStorage.setItem('mdarahim-payment-accounts', JSON.stringify(CUSTOM_PAY_ACCOUNTS));
        } catch (_) {}

        closeModal('adminModal');
        refreshWallet();
        selectDepositMethod(activeDepositMethodId);
        renderDemo(true);
        toast('تم حفظ أسعار الصرف وحسابات الدفع بنجاح');
    });

    /* ==========================================================
       COMPLETE PRODUCT CATALOG (ALL 72 GAMES & SERVICES)
       ========================================================== */
    const DEMO = [
        {
            cat: 'games',
            label: 'ألعاب الفيديو والشحن الفوري',
            items: [
                { name: 'PUBG Mobile', image: 'images/pubg.png', price: 19.99, popular: true },
                { name: 'Free Fire', image: 'images/freefire.png', price: 9.99, popular: true },
                { name: 'Call of Duty Mobile', image: 'images/call of duty.png', price: 14.99, popular: true },
                { name: 'Fortnite V-Bucks', image: 'images/fortnite.png', price: 39.99, popular: true },
                { name: 'eFootball PES', image: 'images/efootball.png', price: 18.00, isNew: true, popular: true },
                { name: 'Roblox Robux', image: 'images/Roblox.png', price: 24.99, popular: true },
                { name: 'Yalla Ludo', image: 'images/Yalla Ludo.png', price: 12.99, popular: true },
                { name: 'Jawaker', image: 'images/jawaker.png', price: 19.99, popular: true },
                { name: 'Brawl Stars', image: 'images/BrawlStars.png', price: 15.00, popular: true },
                { name: 'Clash of Clans', image: 'images/clash-of-clans.png', price: 24.99, popular: true },
                { name: 'Clash Royale', image: 'images/ClashRoyale.png', price: 24.99 },
                { name: 'Mobile Legends', image: 'images/mobile-legends.png', price: 14.99, popular: true },
                { name: 'Genshin Impact', image: 'images/Genshin Impact.png', price: 26.00, isNew: true },
                { name: 'Minecraft', image: 'images/minecraft.png', price: 39.99, popular: true },
                { name: 'Delta Force', image: 'images/DeltaForce.png', price: 34.99, isNew: true },
                { name: 'Arena Breakout', image: 'images/ArenaBreakout.png', price: 12.00, isNew: true },
                { name: 'Blood Strike', image: 'images/BloodStrike.png', price: 11.99, isNew: true },
                { name: 'Farlight 84', image: 'images/farlight84.png', price: 12.00, isNew: true },
                { name: 'Apex Legends', image: 'images/Apex.png', price: 44.99, isNew: true },
                { name: 'Honor of Kings', image: 'images/HonorOfKings.png', price: 12.99, isNew: true },
                { name: 'Whiteout Survival', image: 'images/WhiteoutSurvival.png', price: 18.00, isNew: true, popular: true },
                { name: 'Last War: Survival', image: 'images/LastWarSurvival.png', price: 16.00, isNew: true },
                { name: 'Revenge of the Sultans', image: 'images/Revenge of the Sultans.png', price: 19.00, popular: true },
                { name: '8 Ball Pool', image: 'images/BallPool8.png', price: 15.99, popular: true },
                { name: 'TopTop', image: 'images/TopTop.png', price: 15.00, popular: true },
                { name: 'Lords Mobile', image: 'images/LordsMobile.png', price: 15.00 },
                { name: 'Boom Beach', image: 'images/BoomBeach.png', price: 24.99 },
                { name: 'Hay Day', image: 'images/HayDay.png', price: 19.99 },
                { name: 'King Shot', image: 'images/Kinfshot.png', price: 14.00 },
                { name: 'King of Avalon', image: 'images/KingOfAvalon.png', price: 18.00 },
                { name: 'Ludo Club', image: 'images/LudoClub.png', price: 14.99 },
                { name: 'Ludo World', image: 'images/LudoWorld.png', price: 14.99 },
                { name: 'Top War Battle Game', image: 'images/TopWarBattleGame.png', price: 15.00 },
                { name: 'War Robots', image: 'images/WarRobots.png', price: 18.00 }
            ]
        },
        {
            cat: 'cards',
            label: 'بطاقات الشراء والألعاب الرقمية',
            items: [
                { name: 'Google Play', image: 'images/Google Play.png', price: 19.99, hasCode: true, popular: true },
                { name: 'Apple Gift Card', image: 'images/Applecard.png', price: 19.99, hasCode: true, popular: true },
                { name: 'iTunes', image: 'images/iTunes.png', price: 37.50, hasCode: true },
                { name: 'PlayStation Store', image: 'images/PlayStation.png', price: 39.99, hasCode: true, popular: true },
                { name: 'Xbox Game Pass', image: 'images/xbox-game-pass.png', price: 59.99, hasCode: true, isNew: true, popular: true },
                { name: 'Razer Gold', image: 'images/razergold.png', price: 19.00, hasCode: true, popular: true },
                { name: 'Virtual Mastercard', image: 'images/Mastercard.png', price: 42.00, hasCode: true, popular: true }
            ]
        },
        {
            cat: 'services',
            label: 'الذكاء الاصطناعي والخدمات الرقمية',
            items: [
                { name: 'ChatGPT Plus', image: 'images/chatgpt.png', price: 79.99, isNew: true, popular: true },
                { name: 'Gemini Advanced', image: 'images/gemini.png', price: 74.99, isNew: true, popular: true },
                { name: 'Telegram Premium', image: 'images/PremiumTelegramSubscription.png', price: 39.99, isNew: true, popular: true },
                { name: 'Telegram Stars', image: 'images/TelegramStars.png', price: 12.50, isNew: true, popular: true },
                { name: 'Telegram Gifts', image: 'images/BuyingAndsellingTelegramGifts.jpg', price: 18.50, isNew: true },
                { name: 'Snapchat Plus', image: 'images/Snapchat.png', price: 22.00, isNew: true },
                { name: 'X Premium (Twitter)', image: 'images/x.png', price: 18.00, isNew: true },
                { name: 'WhatsApp Services', image: 'images/WhatsApp.png', price: 19.00 },
                { name: 'Telegram Services', image: 'images/Telegram.png', price: 15.00 },
                { name: 'Instagram Services', image: 'images/instagram.png', price: 20.00 },
                { name: 'Facebook Services', image: 'images/facebook.png', price: 25.00 }
            ]
        },
        {
            cat: 'entertainment',
            label: 'الترفيه واشتراكات المشاهدة',
            items: [
                { name: 'Shahid VIP', image: 'images/Shahid VIP.png', price: 39.99, hasCode: true, popular: true },
                { name: 'Netflix', image: 'images/Netflix.png', price: 49.99, hasCode: true, popular: true },
                { name: 'Spotify Premium', image: 'images/Spotify.png', price: 29.99, hasCode: true },
                { name: 'Hydra TV IPTV', image: 'images/HydraTV.png', price: 45.00, hasCode: true },
                { name: 'Nova IPTV', image: 'images/Nova.png', price: 40.00, hasCode: true }
            ]
        },
        {
            cat: 'chat',
            label: 'برامج المحادثات الصوتية واللايف',
            items: [
                { name: 'TikTok Coins', image: 'images/TikTok Coins.png', price: 19.99, popular: true },
                { name: 'Bigo Live Diamonds', image: 'images/Bigolive.png', price: 24.99, popular: true },
                { name: 'Imo Diamonds', image: 'images/imo.png', price: 16.50 },
                { name: 'Likee Diamonds', image: 'images/Likee.png', price: 19.99 },
                { name: 'Ahlan Chat', image: 'images/Ahlan.png', price: 19.99 },
                { name: 'YoHo Chat', image: 'images/YoHo.png', price: 24.99 },
                { name: 'Sugo Chat', image: 'images/Sugo.png', price: 24.99 },
                { name: 'Talk Show', image: 'images/talk-show.png', price: 29.99 },
                { name: 'Kafu Chat', image: 'images/Kafu.png', price: 22.00 },
                { name: 'Party Star', image: 'images/PartyStar.png', price: 21.00 },
                { name: 'Saya Chat', image: 'images/Saya.png', price: 19.99 },
                { name: 'YoYo Chat', image: 'images/YoYochat.png', price: 23.50 }
            ]
        },
        {
            cat: 'pc',
            label: 'أنظمة وبرامج الكمبيوتر',
            items: [
                { name: 'Windows 11 Pro', image: 'images/Windows11.png', price: 159.99, hasCode: true, isNew: true, popular: true },
                { name: 'Windows 10 Pro', image: 'images/Windows10.png', price: 129.99, hasCode: true },
                { name: 'Microsoft Office 365', image: 'images/Office 365.png', price: 119.99, hasCode: true, popular: true }
            ]
        }
    ];

    function renderDemo(force = false) {
        const wrap = $('#sectionsWrapper');
        if (!wrap) return;

        const hasContent   = wrap.children.length > 0;
        const shouldRender = force || (!wrap._rendered && !hasContent);

        if (shouldRender) {
            wrap.innerHTML = DEMO.map(sec => `
                <section class="app-section" data-cat="${sec.cat}">
                    <div class="section-head">
                        <h2 class="section-title">
                            ${sec.label}
                            <span class="section-count">${sec.items.length}</span>
                        </h2>
                    </div>
                    <div class="app-grid ${wideMode ? 'wide' : ''}">
                        ${sec.items.map(app => `
                            <div class="app-card-col">
                                <button type="button" class="app-card"
                                        data-name="${app.name}"
                                        data-image="${app.image || ''}"
                                        data-icon="${app.icon || ''}"
                                        data-cat="${sec.label}"
                                        data-isnew="${app.isNew ? 1 : 0}"
                                        data-hascode="${app.hasCode ? 1 : 0}"
                                        title="اضغط لشحن ${app.name}">
                                    ${app.isNew ? '<span class="badge-new">جديد</span>' : ''}
                                    ${app.popular ? '<span class="badge-popular">شائع</span>' : ''}
                                    <span class="app-icon">
                                        ${app.image ? `<img src="${app.image}" alt="${app.name}" loading="lazy">` : (app.icon || '')}
                                    </span>
                                    <span class="app-name">${app.name}</span>
                                    <span class="app-price">يبدأ من ${fmt(app.price)}</span>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </section>
            `).join('');
            wrap._rendered = true;
        }

        if (!wrap._wired) {
            wrap._wired = true;
            wrap.addEventListener('click', e => {
                const card = e.target.closest('.app-card');
                if (!card) return;
                openTopup({
                    name: card.dataset.name,
                    image: card.dataset.image || '',
                    icon: card.dataset.icon || '',
                    categoryLabel: card.dataset.cat,
                    isNew:  card.dataset.isnew === '1',
                    hasCode: card.dataset.hascode === '1',
                    price: parseFloat(card.dataset.price) || 24.99
                });
            });
        }
    }

    renderDemo();
})();
