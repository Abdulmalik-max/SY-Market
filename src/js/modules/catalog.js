export const PACKAGE_MAP = {
    // ... انسخ محتوى PACKAGE_MAP بالكامل من ملفك القديم هنا
};

export const DEMO = [
    // ... انسخ محتوى DEMO (72 خدمة) بالكامل من ملفك القديم هنا
];

export function getPackagesForApp(app) {
    if (PACKAGE_MAP[app.name]) return PACKAGE_MAP[app.name];
    const base = app.price || 24.99;
    return [
        { name: 'الباقة الأساسية', price: base, badge: 'أساسي' },
        { name: 'الباقة المتقدمة', price: Number((base * 2.2).toFixed(2)), badge: 'شائع' },
        { name: 'باقة VIP', price: Number((base * 4.5).toFixed(2)), badge: 'قيمة متميزة' }
    ];
}