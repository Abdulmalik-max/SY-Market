export const DEFAULT_PAY_ACCOUNTS = {
    jaib: '774060647',
    onecash: '774060647',
    floosak: '774060647',
    jawali: '774060647',
    kuraimi: '3001234567',
    qutaibi: '202145890',
    rajhi: 'SA4480000452000012345678',
    alinma: 'SA03050000682000098765432',
    binance: '284910385',
    binanceUsdt: 'TXv8m4Kp9zW2e7Qb1Y3u5Rt6N8mJkLpQxZ'
};

export const COUNTRIES = [
    { id: 'ye', name: 'اليمن', code: 'YE' },
    { id: 'sa', name: 'السعودية', code: 'SA' },
    { id: 'iq', name: 'العراق', code: 'IQ' },
    { id: 'global', name: 'باقي الدول', code: 'INTL' }
];

export function loadPayAccounts() {
    try {
        const saved = localStorage.getItem('mdarahim-payment-accounts');
        if (saved) return { ...DEFAULT_PAY_ACCOUNTS, ...JSON.parse(saved) };
    } catch (_) { }
    return { ...DEFAULT_PAY_ACCOUNTS };
}

export function savePayAccounts(accounts) {
    try {
        localStorage.setItem('mdarahim-payment-accounts', JSON.stringify(accounts));
    } catch (_) { }
}

export const PAYMENT_METHODS = {
    // --- اليمن: المحافظ ---
    jaib: {
        id: 'jaib', country: 'ye', group: 'المحافظ اليمنية',
        name: 'محفظة جيب', shortName: 'جيب',
        accountLabel: 'رقم محفظة جيب',
        getAccount: (acc) => acc.jaib,
        holder: 'متجر الشحن السعودي اليمني',
        currency: 'YER', currencyLabel: 'ر.ي',
        quickAmounts: [10000, 25000, 50000, 100000],
        txLabel: 'معرّف العملية (رقم الحوالة)',
        txPlaceholder: 'مثال: 8923410',
        instructions: 'حوّل المبلغ إلى رقم محفظة جيب أعلاه ثم أدخل المبلغ ومعرّف العملية للمطابقة الفورية.'
    },
    onecash: {
        id: 'onecash', country: 'ye', group: 'المحافظ اليمنية',
        name: 'ون كاش', shortName: 'ون كاش',
        accountLabel: 'رقم محفظة ون كاش (رمز التاجر 84920)',
        getAccount: (acc) => acc.onecash,
        holder: 'متجر الشحن السعودي اليمني',
        currency: 'YER', currencyLabel: 'ر.ي',
        quickAmounts: [10000, 25000, 50000, 100000],
        txLabel: 'معرّف العملية',
        txPlaceholder: 'أدخل الرقم المرجعي من إشعار ون كاش',
        instructions: 'قم بالتحويل عبر ون كاش إلى الرقم أعلاه، ثم أدخل المبلغ ومعرّف العملية.'
    },
    floosak: {
        id: 'floosak', country: 'ye', group: 'المحافظ اليمنية',
        name: 'فلوسك', shortName: 'فلوسك',
        accountLabel: 'رقم حساب فلوسك',
        getAccount: (acc) => acc.floosak,
        holder: 'متجر الشحن السعودي اليمني',
        currency: 'YER', currencyLabel: 'ر.ي',
        quickAmounts: [10000, 25000, 50000, 100000],
        txLabel: 'معرّف العملية',
        txPlaceholder: 'أدخل رقم السند أو معرّف التحويل',
        instructions: 'حوّل عبر تطبيق فلوسك إلى الرقم الموضح ثم أكّد العملية في الحقلين أدناه.'
    },
    jawali: {
        id: 'jawali', country: 'ye', group: 'المحافظ اليمنية',
        name: 'جوالي', shortName: 'جوالي',
        accountLabel: 'رقم محفظة جوالي',
        getAccount: (acc) => acc.jawali,
        holder: 'متجر الشحن السعودي اليمني',
        currency: 'YER', currencyLabel: 'ر.ي',
        quickAmounts: [10000, 25000, 50000, 100000],
        txLabel: 'معرّف العملية',
        txPlaceholder: 'أدخل رقم العملية من رسالة جوالي',
        instructions: 'أرسل المبلغ عبر محفظة جوالي ثم أدخل المبلغ ورقم العملية للإيداع المباشر.'
    },

    // --- اليمن: الحسابات البنكية ---
    kuraimi: {
        id: 'kuraimi', country: 'ye', group: 'الحسابات البنكية',
        name: 'مصرف الكريمي', shortName: 'الكريمي',
        accountLabel: 'رقم الحساب (الكريمي إيداع مميز)',
        getAccount: (acc) => acc.kuraimi,
        holder: 'متجر الشحن للخدمات الرقمية',
        currency: 'YER', currencyLabel: 'ر.ي',
        quickAmounts: [15000, 30000, 75000, 150000],
        txLabel: 'معرّف العملية / رقم السند',
        txPlaceholder: 'أدخل رقم إشعار الإيداع في الكريمي',
        instructions: 'أودع المبلغ عبر كريمي جوال أو أحد الفروع ثم أدخل المبلغ ورقم الإشعار.'
    },
    qutaibi: {
        id: 'qutaibi', country: 'ye', group: 'الحسابات البنكية',
        name: 'مصرف القطيبي', shortName: 'القطيبي',
        accountLabel: 'رقم الحساب (مصرف القطيبي)',
        getAccount: (acc) => acc.qutaibi,
        holder: 'متجر الشحن والخدمات الإلكترونية',
        currency: 'YER', currencyLabel: 'ر.ي',
        quickAmounts: [15000, 30000, 75000, 150000],
        txLabel: 'معرّف العملية / رقم السند',
        txPlaceholder: 'أدخل رقم إشعار حوالة القطيبي',
        instructions: 'حوّل عبر تطبيق القطيبي لحظات إلى الحساب أعلاه ثم أدخل بيانات العملية.'
    },

    // --- السعودية: البنوك والكروت ---
    rajhi: {
        id: 'rajhi', country: 'sa', group: 'الحسابات البنكية',
        name: 'مصرف الراجحي', shortName: 'الراجحي',
        accountLabel: 'رقم الآيبان (IBAN) - الراجحي',
        getAccount: (acc) => acc.rajhi,
        secondaryInfo: 'رقم الحساب: 452000012345678',
        holder: 'مؤسسة متجر الشحن الرقمي',
        currency: 'SAR', currencyLabel: 'ر.س',
        quickAmounts: [50, 100, 200, 500],
        txLabel: 'معرّف العملية (الرقم المرجعي)',
        txPlaceholder: 'أدخل الرقم المرجعي للتحويل (Ref ID)',
        instructions: 'حوّل المبلغ إلى حساب الراجحي أعلاه ثم أدخل المبلغ والرقم المرجعي.'
    },
    alinma: {
        id: 'alinma', country: 'sa', group: 'الحسابات البنكية',
        name: 'بنك الإنماء', shortName: 'الإنماء',
        accountLabel: 'رقم الآيبان (IBAN) - الإنماء',
        getAccount: (acc) => acc.alinma,
        secondaryInfo: 'رقم الحساب: 682000098765432',
        holder: 'مؤسسة متجر الشحن الرقمي',
        currency: 'SAR', currencyLabel: 'ر.س',
        quickAmounts: [50, 100, 200, 500],
        txLabel: 'معرّف العملية (الرقم المرجعي)',
        txPlaceholder: 'أدخل الرقم المرجعي للتحويل',
        instructions: 'حوّل المبلغ إلى حساب الإنماء أعلاه ثم أدخل المبلغ والرقم المرجعي.'
    },
    sawa: {
        id: 'sawa', country: 'sa', group: 'كروت الشحن',
        name: 'كروت سوا', shortName: 'سوا',
        accountLabel: 'آلية الشحن',
        getAccount: () => 'إيداع مباشر عبر رقم بطاقة سوا (PIN)',
        isInstructionOnly: true,
        holder: 'مطابقة كروت STC سوا',
        currency: 'SAR', currencyLabel: 'ر.س',
        quickAmounts: [20, 50, 100, 200],
        txLabel: 'معرّف العملية (رقم كرت سوا)',
        txPlaceholder: 'أدخل رقم البطاقة المكوّن من 14 أو 16 رقم',
        instructions: 'أدخل فئة الكرت في خانة المبلغ، ورقم البطاقة السري في خانة معرّف العملية.'
    },
    mobily: {
        id: 'mobily', country: 'sa', group: 'كروت الشحن',
        name: 'كروت موبايلي', shortName: 'موبايلي',
        accountLabel: 'آلية الشحن',
        getAccount: () => 'إيداع مباشر عبر رقم بطاقة موبايلي',
        isInstructionOnly: true,
        holder: 'مطابقة كروت موبايلي',
        currency: 'SAR', currencyLabel: 'ر.س',
        quickAmounts: [20, 50, 100, 200],
        txLabel: 'معرّف العملية (رقم كرت موبايلي)',
        txPlaceholder: 'أدخل رقم البطاقة المكوّن من 15 رقم',
        instructions: 'أدخل فئة الكرت في خانة المبلغ، ورقم البطاقة في خانة معرّف العملية.'
    },

    // --- العراق ---
    asiacell: {
        id: 'asiacell', country: 'iq', group: 'كروت الشحن',
        name: 'كروت آسيا سيل', shortName: 'آسيا سيل',
        accountLabel: 'آلية الشحن',
        getAccount: () => 'إيداع فوري عبر كروت تعبئة آسيا سيل',
        isInstructionOnly: true,
        holder: 'مطابقة كروت آسيا سيل (IQD)',
        currency: 'IQD', currencyLabel: 'د.ع',
        quickAmounts: [5000, 10000, 25000, 50000],
        txLabel: 'معرّف العملية (رقم كرت آسيا سيل)',
        txPlaceholder: 'أدخل رقم الكرت المكوّن من 14 رقم',
        instructions: 'أدخل قيمة الكرت بالدينار العراقي ورقم التعبئة ليتم تحويله وإيداعه فوراً.'
    },

    // --- باقي الدول ---
    binance: {
        id: 'binance', country: 'global', group: 'الدفع الدولي',
        name: 'بايننس (Binance Pay)', shortName: 'Binance',
        accountLabel: 'Binance Pay ID',
        getAccount: (acc) => acc.binance,
        getSecondary: (acc) => `USDT (TRC-20): ${acc.binanceUsdt}`,
        holder: 'SY_Market_Official',
        currency: 'USD', currencyLabel: 'USDT',
        quickAmounts: [10, 25, 50, 100],
        txLabel: 'معرّف العملية (Order ID / TxID)',
        txPlaceholder: 'أدخل Binance Pay Order ID أو TxID',
        instructions: 'حوّل عبر Binance Pay أو شبكة TRC-20 ثم أدخل المبلغ ومعرّف العملية للمطابقة.'
    }
};

export function getMethodsByCountry(countryId) {
    return Object.values(PAYMENT_METHODS).filter((m) => m.country === countryId);
}

export function toSarAmount(amount, currency, rates) {
    const val = Number(amount) || 0;
    if (val <= 0) return 0;
    if (currency === 'SAR') return val;
    if (currency === 'YER') return val / (rates.YER || 140);
    if (currency === 'USD') return val / (rates.USD || 0.2667);
    if (currency === 'IQD') return val / 350;
    return val;
}

export function fromSarToMethodCurrency(sarAmount, currency, rates) {
    const val = Number(sarAmount) || 0;
    if (currency === 'SAR') return `${val.toFixed(2)} ر.س`;
    if (currency === 'YER') return `${Math.round(val * (rates.YER || 140)).toLocaleString('en-US')} ر.ي`;
    if (currency === 'USD') return `${(val * (rates.USD || 0.2667)).toFixed(2)} USDT`;
    if (currency === 'IQD') return `${Math.round(val * 350).toLocaleString('en-US')} د.ع`;
    return `${val.toFixed(2)} ر.س`;
}