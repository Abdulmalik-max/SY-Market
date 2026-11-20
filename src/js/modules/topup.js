import { PAYMENT_CONFIG } from '../../data/payment-methods.js';
import { verifyAndCreditDeposit } from '../api/depositApi.js';

export function initTopupModule(rootSelector = '#topup-app') {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    const state = {
        countryCode: 'YE',
        selectedMethod: null,
        balance: Number(localStorage.getItem('sy_wallet_balance') || 0),
    };

    const els = {
        balanceDisplay: root.querySelector('[data-wallet-balance]'),
        countryTabs: root.querySelector('[data-country-tabs]'),
        methodsContainer: root.querySelector('[data-methods-container]'),
        detailsPanel: root.querySelector('[data-deposit-panel]'),
        accountLabel: root.querySelector('[data-account-label]'),
        accountValue: root.querySelector('[data-account-value]'),
        accountHolder: root.querySelector('[data-account-holder]'),
        copyBtn: root.querySelector('[data-copy-btn]'),
        form: root.querySelector('[data-deposit-form]'),
        amountInput: root.querySelector('#deposit-amount'),
        currencyBadge: root.querySelector('[data-currency-badge]'),
        txLabel: root.querySelector('[data-tx-label]'),
        txInput: root.querySelector('#deposit-txid'),
        submitBtn: root.querySelector('[data-submit-btn]'),
        feedback: root.querySelector('[data-feedback]'),
    };

    function updateBalanceUI() {
        if (els.balanceDisplay) {
            els.balanceDisplay.textContent = state.balance.toLocaleString('en-US');
        }
    }

    function renderCountries() {
        els.countryTabs.innerHTML = Object.values(PAYMENT_CONFIG)
            .map(
                (c) => `
        <button
          type="button"
          class="tp-country-btn ${c.code === state.countryCode ? 'is-active' : ''}"
          data-country="${c.code}"
        >
          ${c.name}
        </button>`
            )
            .join('');
    }

    function renderMethods() {
        const country = PAYMENT_CONFIG[state.countryCode];
        els.methodsContainer.innerHTML = country.groups
            .map(
                (group) => `
        <div class="tp-method-group">
          <div class="tp-group-title">${group.title}</div>
          <div class="tp-method-grid">
            ${group.methods
                        .map(
                            (m) => `
              <button
                type="button"
                class="tp-method-card ${state.selectedMethod?.id === m.id ? 'is-selected' : ''}"
                data-method-id="${m.id}"
              >
                <span class="tp-method-name">${m.name}</span>
                <span class="tp-method-check" aria-hidden="true"></span>
              </button>`
                        )
                        .join('')}
          </div>
        </div>`
            )
            .join('');
    }

    function renderDepositPanel() {
        const country = PAYMENT_CONFIG[state.countryCode];
        const method = state.selectedMethod;

        if (!method) {
            els.detailsPanel.hidden = true;
            return;
        }

        els.detailsPanel.hidden = false;
        els.accountLabel.textContent = method.accountLabel;
        els.accountValue.textContent = method.accountValue;
        els.accountHolder.textContent = method.accountHolder ? `باسم: ${method.accountHolder}` : '';
        els.accountHolder.hidden = !method.accountHolder;
        els.copyBtn.hidden = Boolean(method.isInstructionOnly);

        els.currencyBadge.textContent = country.currency;
        els.amountInput.min = method.minAmount;
        els.amountInput.placeholder = `الحد الأدنى ${method.minAmount}`;
        els.txLabel.textContent = method.txLabel;
        els.txInput.placeholder = method.txPlaceholder;
        els.feedback.hidden = true;
    }

    function findMethodById(methodId) {
        const country = PAYMENT_CONFIG[state.countryCode];
        for (const group of country.groups) {
            const found = group.methods.find((m) => m.id === methodId);
            if (found) return found;
        }
        return null;
    }

    els.countryTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-country]');
        if (!btn) return;
        state.countryCode = btn.dataset.country;
        state.selectedMethod = PAYMENT_CONFIG[state.countryCode].groups[0].methods[0];
        renderCountries();
        renderMethods();
        renderDepositPanel();
    });

    els.methodsContainer.addEventListener('click', (e) => {
        const card = e.target.closest('[data-method-id]');
        if (!card) return;
        state.selectedMethod = findMethodById(card.dataset.methodId);
        renderMethods();
        renderDepositPanel();
    });

    els.copyBtn.addEventListener('click', async () => {
        if (!state.selectedMethod) return;
        await navigator.clipboard.writeText(state.selectedMethod.accountValue);
        const original = els.copyBtn.textContent;
        els.copyBtn.textContent = 'تم النسخ';
        els.copyBtn.classList.add('is-copied');
        setTimeout(() => {
            els.copyBtn.textContent = original;
            els.copyBtn.classList.remove('is-copied');
        }, 1600);
    });

    els.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!state.selectedMethod) return;

        const amount = Number(els.amountInput.value);
        const txId = els.txInput.value.trim();

        if (!amount || amount < state.selectedMethod.minAmount || !txId) {
            showFeedback('يرجى إدخال المبلغ ومعرف العملية بشكل صحيح.', 'error');
            return;
        }

        els.submitBtn.disabled = true;
        els.submitBtn.textContent = 'جاري التحقق من العملية...';

        const result = await verifyAndCreditDeposit({
            countryCode: state.countryCode,
            methodId: state.selectedMethod.id,
            amount,
            txId,
        });

        els.submitBtn.disabled = false;
        els.submitBtn.textContent = 'تأكيد وإيداع الرصيد';

        if (result.ok) {
            state.balance += result.creditedAmount;
            localStorage.setItem('sy_wallet_balance', String(state.balance));
            updateBalanceUI();
            els.form.reset();
            showFeedback(result.message, 'success');
        } else {
            showFeedback(result.message, 'error');
        }
    });

    function showFeedback(message, type) {
        els.feedback.textContent = message;
        els.feedback.className = `tp-feedback is-${type}`;
        els.feedback.hidden = false;
    }

    // Initial render
    state.selectedMethod = PAYMENT_CONFIG[state.countryCode].groups[0].methods[0];
    updateBalanceUI();
    renderCountries();
    renderMethods();
    renderDepositPanel();
}