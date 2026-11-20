import {
    COUNTRIES,
    PAYMENT_METHODS,
    getMethodsByCountry,
    toSarAmount
} from '../data/payments.js';

const USED_TXN_KEY = 'mdarahim-used-txns';

function getUsedTxns() {
    try {
        return JSON.parse(localStorage.getItem(USED_TXN_KEY) || '[]');
    } catch (_) {
        return [];
    }
}

function markTxnUsed(txId) {
    const list = getUsedTxns();
    list.push(txId.toLowerCase());
    try {
        localStorage.setItem(USED_TXN_KEY, JSON.stringify(list));
    } catch (_) { }
}

/**
 * نقطة التحقق من الإيداع.
 * عند ربط الـ Backend، استبدل هذا الجزء بـ fetch('/api/wallet/deposits/verify', ...)
 */
async function verifyDepositRequest({ methodId, amount, txId }) {
    await new Promise((r) => setTimeout(r, 650));

    const normalized = txId.trim().toLowerCase();
    if (getUsedTxns().includes(normalized)) {
        return { ok: false, message: 'معرّف العملية هذا مستخدم مسبقاً. يرجى التأكد من الرقم.' };
    }

    // تحقق مبدئي من صحة التنسيق قبل ربط الـ Webhook البنكي
    if (normalized.length < 5) {
        return { ok: false, message: 'معرّف العملية قصير جداً. يرجى إدخال الرقم المرجعي الكامل.' };
    }

    markTxnUsed(normalized);
    return { ok: true, txId: txId.trim(), amount: Number(amount) };
}

export function createDepositController({ getAccounts, getRates, onDepositSuccess, toast }) {
    let activeCountry = 'ye';
    let activeMethodId = 'jaib';

    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    const els = {
        countryTabs: $('#depositCountryTabs'),
        methodsGrid: $('#depositMethodsGrid'),
        badge: $('#depMethodIconBadge'),
        title: $('#depMethodTitle'),
        accLabel: $('#depAccountLabel'),
        accValue: $('#depAccountNumber'),
        accSecondary: $('#depAccountSecondary'),
        accHolder: $('#depAccountHolder'),
        instructions: $('#depInstructions'),
        copyBtn: $('#btnCopyDepAccount'),
        copyBtnText: $('#depCopyBtnText'),
        currTag: $('#depositCurrencyTag'),
        amountInput: $('#depositAmountInput'),
        sarEquiv: $('#depositSarEquivDisplay'),
        quickAmounts: $('#depositQuickAmounts'),
        txLabel: $('#depositTxLabel'),
        txInput: $('#depositTxnIdInput'),
        statusBox: $('#depositMatchStatus'),
        submitBtn: $('#btnSubmitDeposit'),
        submitText: $('#btnSubmitDepositText'),
        flowView: $('#depositFlowContainer'),
        successView: $('#depositSuccessView'),
        sucAmount: $('#sucDepositAmount'),
        sucMethod: $('#sucDepositMethod'),
        sucTxn: $('#sucDepositTxn'),
        sucBalance: $('#sucDepositNewBalance'),
        againBtn: $('#btnDepositAgain')
    };

    function showStatus(msg, type = 'error') {
        if (!els.statusBox) return;
        els.statusBox.className = `dep-alert is-${type} mb-3`;
        els.statusBox.textContent = msg;
        els.statusBox.classList.remove('d-none');
    }

    function hideStatus() {
        els.statusBox?.classList.add('d-none');
    }

    function updateEquiv() {
        const method = PAYMENT_METHODS[activeMethodId];
        if (!method || !els.sarEquiv) return;
        const val = Number(els.amountInput?.value) || 0;
        const sar = toSarAmount(val, method.currency, getRates());
        els.sarEquiv.textContent = `${sar.toFixed(2)} ر.س`;
    }

    function renderCountries() {
        if (!els.countryTabs) return;
        els.countryTabs.innerHTML = COUNTRIES.map(
            (c) => `
        <button type="button" class="country-tab ${c.id === activeCountry ? 'active' : ''}" data-country="${c.id}">
          <span class="tab-code">${c.code}</span>
          <span class="tab-title">${c.name}</span>
        </button>`
        ).join('');
    }

    function renderMethods() {
        if (!els.methodsGrid) return;
        const methods = getMethodsByCountry(activeCountry);
        let lastGroup = '';
        let html = '';

        methods.forEach((m) => {
            if (m.group !== lastGroup) {
                lastGroup = m.group;
                html += `<div class="deposit-category-heading"><span>${lastGroup}</span></div>`;
            }
            html += `
        <button type="button" class="deposit-method-btn ${m.id === activeMethodId ? 'active' : ''}" data-dep-method="${m.id}">
          <span class="dm-title">${m.name}</span>
          <span class="dm-radio" aria-hidden="true"></span>
        </button>`;
        });

        els.methodsGrid.innerHTML = html;

        if (!methods.some((m) => m.id === activeMethodId)) {
            selectMethod(methods[0].id);
        } else {
            selectMethod(activeMethodId);
        }
    }

    function selectMethod(methodId) {
        const method = PAYMENT_METHODS[methodId];
        if (!method) return;
        activeMethodId = methodId;
        const accounts = getAccounts();

        $$('[data-dep-method]', els.methodsGrid).forEach((b) => {
            b.classList.toggle('active', b.dataset.depMethod === methodId);
        });

        if (els.badge) els.badge.textContent = method.shortName;
        if (els.title) els.title.textContent = method.name;
        if (els.accLabel) els.accLabel.textContent = method.accountLabel;
        if (els.accValue) els.accValue.textContent = method.getAccount(accounts);

        const secText = method.getSecondary ? method.getSecondary(accounts) : method.secondaryInfo;
        if (els.accSecondary) {
            els.accSecondary.textContent = secText || '';
            els.accSecondary.classList.toggle('d-none', !secText);
        }

        if (els.accHolder) {
            els.accHolder.innerHTML = `اسم المستلم: <strong class="dep-strong">${method.holder}</strong>`;
        }
        if (els.instructions) els.instructions.textContent = method.instructions;
        if (els.copyBtn) els.copyBtn.classList.toggle('d-none', Boolean(method.isInstructionOnly));

        if (els.currTag) els.currTag.textContent = method.currencyLabel;
        if (els.txLabel) els.txLabel.textContent = method.txLabel;
        if (els.txInput) els.txInput.placeholder = method.txPlaceholder;

        if (els.quickAmounts) {
            els.quickAmounts.innerHTML = method.quickAmounts
                .map((a) => `<button type="button" class="quick-amt-btn" data-amt="${a}">${a.toLocaleString('en-US')}</button>`)
                .join('');
        }

        hideStatus();
        updateEquiv();
    }

    function bindEvents() {
        els.countryTabs?.addEventListener('click', (e) => {
            const tab = e.target.closest('[data-country]');
            if (!tab) return;
            activeCountry = tab.dataset.country;
            renderCountries();
            renderMethods();
        });

        els.methodsGrid?.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-dep-method]');
            if (!btn) return;
            selectMethod(btn.dataset.depMethod);
        });

        els.quickAmounts?.addEventListener('click', (e) => {
            const qb = e.target.closest('[data-amt]');
            if (!qb || !els.amountInput) return;
            els.amountInput.value = qb.dataset.amt;
            updateEquiv();
        });

        els.amountInput?.addEventListener('input', updateEquiv);

        els.copyBtn?.addEventListener('click', async () => {
            const method = PAYMENT_METHODS[activeMethodId];
            if (!method) return;
            const val = method.getAccount(getAccounts());
            try {
                await navigator.clipboard.writeText(val);
                if (els.copyBtnText) {
                    els.copyBtnText.textContent = 'تم النسخ';
                    setTimeout(() => { els.copyBtnText.textContent = 'نسخ الحساب'; }, 1600);
                }
                toast('تم نسخ رقم الحساب بنجاح');
            } catch (_) {
                toast(`انسخ الرقم يدوياً: ${val}`);
            }
        });

        els.submitBtn?.addEventListener('click', async () => {
            const method = PAYMENT_METHODS[activeMethodId];
            if (!method) return;

            const amount = Number(els.amountInput?.value);
            const txId = (els.txInput?.value || '').trim();

            if (!amount || amount <= 0) {
                showStatus('يرجى إدخال المبلغ المودع بشكل صحيح.', 'error');
                els.amountInput?.focus();
                return;
            }

            if (!txId || txId.length < 4) {
                showStatus('يرجى إدخال معرّف العملية أو رقم الكرت بدقة.', 'error');
                els.txInput?.focus();
                return;
            }

            els.submitBtn.disabled = true;
            if (els.submitText) els.submitText.textContent = 'جاري التحقق من العملية...';
            showStatus('جاري مطابقة المبلغ ومعرّف العملية مع سجل الإيداعات...', 'info');

            const res = await verifyDepositRequest({ methodId: method.id, amount, txId });

            els.submitBtn.disabled = false;
            if (els.submitText) els.submitText.textContent = 'تحقق وإيداع الرصيد فوراً';

            if (!res.ok) {
                showStatus(res.message, 'error');
                return;
            }

            hideStatus();
            const sarEquiv = toSarAmount(amount, method.currency, getRates());
            const newBalanceFormatted = onDepositSuccess({
                sarEquiv,
                rawAmount: amount,
                method,
                txId: res.txId
            });

            if (els.sucAmount) {
                els.sucAmount.textContent = `+${sarEquiv.toFixed(2)} ر.س (${amount.toLocaleString('en-US')} ${method.currencyLabel})`;
            }
            if (els.sucMethod) els.sucMethod.textContent = method.name;
            if (els.sucTxn) els.sucTxn.textContent = res.txId;
            if (els.sucBalance) els.sucBalance.textContent = newBalanceFormatted;

            els.flowView?.classList.add('d-none');
            els.successView?.classList.remove('d-none');

            if (els.amountInput) els.amountInput.value = '';
            if (els.txInput) els.txInput.value = '';
            updateEquiv();
        });

        els.againBtn?.addEventListener('click', () => {
            els.successView?.classList.add('d-none');
            els.flowView?.classList.remove('d-none');
        });
    }

    renderCountries();
    renderMethods();
    bindEvents();

    return {
        refresh: () => selectMethod(activeMethodId)
    };
}