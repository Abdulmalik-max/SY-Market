const API_BASE = '/api';
const USE_MOCK_VERIFICATION = true; // Set to false when backend is connected

// Mock ledger simulating incoming bank/wallet webhook records
const MOCK_VERIFIED_RECORDS = [
    { methodId: 'ye_jeeb', amount: 5000, txId: 'JB100200' },
    { methodId: 'ye_kuraimi', amount: 10000, txId: 'KR556677' },
    { methodId: 'sa_rajhi', amount: 100, txId: 'RJ998877' },
    { methodId: 'iq_asiacell', amount: 10000, txId: '12345678901234' },
    { methodId: 'intl_binance', amount: 25, txId: 'BN2026001' },
];

export async function verifyAndCreditDeposit({ countryCode, methodId, amount, txId }) {
    if (!USE_MOCK_VERIFICATION) {
        const res = await fetch(`${API_BASE}/wallet/deposits/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ countryCode, methodId, amount, txId }),
        });
        return await res.json();
    }

    // Simulated network latency
    await new Promise((r) => setTimeout(r, 700));

    const usedKey = 'sy_market_used_txids';
    const usedTxIds = JSON.parse(localStorage.getItem(usedKey) || '[]');
    const normalizedTx = txId.trim().toUpperCase();

    if (usedTxIds.includes(normalizedTx)) {
        return { ok: false, message: 'معرف العملية مستخدم مسبقاً.' };
    }

    const match = MOCK_VERIFIED_RECORDS.find(
        (rec) =>
            rec.methodId === methodId &&
            Number(rec.amount) === Number(amount) &&
            rec.txId.toUpperCase() === normalizedTx
    );

    if (!match) {
        return {
            ok: false,
            message: 'لم يتم العثور على عملية مطابقة. تأكد من المبلغ ومعرف العملية ثم أعد المحاولة.',
        };
    }

    usedTxIds.push(normalizedTx);
    localStorage.setItem(usedKey, JSON.stringify(usedTxIds));

    return {
        ok: true,
        creditedAmount: Number(amount),
        txId: normalizedTx,
        message: 'تمت المطابقة وإيداع المبلغ في محفظتك بنجاح.',
    };
}