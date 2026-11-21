const PAYMENT_CONFIG = {
    YE: {
        label: "اليمن",
        code: "YE",
        currency: "YER / USD",
        groups: [
            {
                title: "المحافظ اليمنية",
                methods: [
                    {
                        id: "ye_jeeb",
                        name: "جيب (Jeeb)",
                        type: "wallet",
                        targetLabel: "رقم محفظة جيب",
                        targetValue: "770000001",
                        holder: "باسم: متجر SY Market",
                        note: "قم بالتحويل ثم أدخل المبلغ ومعرف العملية الظاهر في إيصال محفظة جيب."
                    },
                    {
                        id: "ye_onecash",
                        name: "ون كاش (OneCash)",
                        type: "wallet",
                        targetLabel: "رقم محفظة ون كاش",
                        targetValue: "770000002",
                        holder: "باسم: متجر SY Market",
                        note: "تأكد من مطابقة المبلغ ورقم المرجع ليتم الإيداع تلقائياً."
                    },
                    {
                        id: "ye_floosak",
                        name: "فلوسك (Floosak)",
                        type: "wallet",
                        targetLabel: "رقم محفظة فلوسك",
                        targetValue: "770000003",
                        holder: "باسم: متجر SY Market",
                        note: "أدخل رقم العملية المكون من الأرقام الظاهرة في رسالة التأكيد."
                    },
                    {
                        id: "ye_jawali",
                        name: "جوالي (Jawali)",
                        type: "wallet",
                        targetLabel: "رقم محفظة جوالي",
                        targetValue: "770000004",
                        holder: "باسم: متجر SY Market",
                        note: "بعد إتمام التحويل عبر جوالي، أدخل المبلغ ورقم العملية أدناه."
                    }
                ]
            },
            {
                title: "الحسابات البنكية",
                methods: [
                    {
                        id: "ye_kuraimi",
                        name: "مصرف الكريمي",
                        type: "bank",
                        targetLabel: "رقم حساب الكريمي (مميز)",
                        targetValue: "3012345678",
                        holder: "باسم: متجر SY Market",
                        note: "يمكنك الإيداع عبر تطبيق الكريمي جوال ثم إدخال المبلغ ورقم السند/العملية."
                    },
                    {
                        id: "ye_qutaibi",
                        name: "مصرف القطيبي",
                        type: "bank",
                        targetLabel: "رقم حساب مصرف القطيبي",
                        targetValue: "4098765432",
                        holder: "باسم: متجر SY Market",
                        note: "أدخل المبلغ ورقم المرجع البنكي الظاهر بعد التحويل."
                    }
                ]
            }
        ]
    },

    SA: {
        label: "السعودية",
        code: "SA",
        currency: "SAR",
        groups: [
            {
                title: "البنوك السعودية",
                methods: [
                    {
                        id: "sa_rajhi",
                        name: "مصرف الراجحي",
                        type: "bank",
                        targetLabel: "رقم الحساب / الآيبان (الراجحي)",
                        targetValue: "SA00 8000 0000 6080 1012 3456",
                        holder: "باسم: متجر SY Market",
                        note: "حوّل المبلغ المطلوب ثم أدخل قيمة التحويل والرقم المرجعي للعملية."
                    },
                    {
                        id: "sa_alinma",
                        name: "بنك الإنماء",
                        type: "bank",
                        targetLabel: "رقم الحساب / الآيبان (الإنماء)",
                        targetValue: "SA00 0500 0068 2012 3456 7890",
                        holder: "باسم: متجر SY Market",
                        note: "أدخل المبلغ والرقم المرجعي للحوالة ليتم التحقق والإيداع مباشرة."
                    }
                ]
            },
            {
                title: "كروت الشحن",
                methods: [
                    {
                        id: "sa_sawa",
                        name: "كروت سوا (STC)",
                        type: "card",
                        targetLabel: "طريقة الشحن بكرت سوا",
                        targetValue: "أدخل فئة الكرت ورقم الشحن في الحقلين أدناه",
                        holder: "شحن مباشر بكروت سوا السعودية",
                        txLabel: "معرف العملية / رقم كرت سوا",
                        note: "أدخل قيمة الكرت في حقل المبلغ، ورقم بطاقة سوا في حقل معرف العملية."
                    },
                    {
                        id: "sa_mobily",
                        name: "كروت موبايلي",
                        type: "card",
                        targetLabel: "طريقة الشحن بكرت موبايلي",
                        targetValue: "أدخل فئة الكرت ورقم الشحن في الحقلين أدناه",
                        holder: "شحن مباشر بكروت موبايلي",
                        txLabel: "معرف العملية / رقم كرت موبايلي",
                        note: "أدخل قيمة الكرت في حقل المبلغ، ورقم بطاقة موبايلي في حقل معرف العملية."
                    }
                ]
            }
        ]
    },

    IQ: {
        label: "العراق",
        code: "IQ",
        currency: "IQD",
        groups: [
            {
                title: "كروت الشحن",
                methods: [
                    {
                        id: "iq_asiacell",
                        name: "كروت آسيا سيل",
                        type: "card",
                        targetLabel: "طريقة الشحن بكرت آسيا سيل",
                        targetValue: "أدخل فئة الكرت ورقم الكرت في الحقلين أدناه",
                        holder: "شحن فوري عبر كروت Asiacell",
                        txLabel: "معرف العملية / رقم كرت آسيا سيل",
                        note: "تأكد من إدخال فئة الكرت الصحيحة (5,000 / 10,000 / 25,000) ورقم الكرت بدقة."
                    }
                ]
            }
        ]
    },

    INTL: {
        label: "باقي الدول",
        code: "INTL",
        currency: "USDT",
        groups: [
            {
                title: "الدفع الدولي",
                methods: [
                    {
                        id: "intl_binance",
                        name: "بايننس (Binance Pay)",
                        type: "crypto",
                        targetLabel: "Binance Pay ID",
                        targetValue: "548291034",
                        holder: "SY-Market Official (USDT)",
                        txLabel: "معرف العملية (Binance Order ID)",
                        note: "حوّل عبر Binance Pay (بدون رسوم) ثم أدخل المبلغ بالـ USDT و Order ID للإيداع الفوري."
                    }
                ]
            }
        ]
    }
};

// Local demo ledger for testing instant matching (replace with backend API verification in production)
const DEMO_PENDING_LEDGER = [
    { methodId: "ye_jeeb", amount: 50, txId: "JB-901245" },
    { methodId: "ye_kuraimi", amount: 100, txId: "KR-778899" },
    { methodId: "sa_rajhi", amount: 200, txId: "RJ-445566" },
    { methodId: "iq_asiacell", amount: 10000, txId: "ASIA-112233" },
    { methodId: "intl_binance", amount: 25, txId: "BN-665544" }
];

export function initDepositSystem() {
    const countryGrid = document.getElementById("depositCountryGrid");
    const methodsContainer = document.getElementById("depositMethodsContainer");
    const actionArea = document.getElementById("depositActionArea");
    const form = document.getElementById("depositVerifyForm");
    const feedback = document.getElementById("depositFeedback");
    const balanceEl = document.getElementById("userWalletBalance");
    const copyBtn = document.getElementById("copyDepositTargetBtn");

    if (!countryGrid || !methodsContainer || !form) return;

    let selectedCountryKey = "YE";
    let selectedMethod = null;

    const getBalance = () => parseFloat(localStorage.getItem("sy_wallet_balance") || "0");
    const setBalance = (val) => {
        localStorage.setItem("sy_wallet_balance", val.toFixed(2));
        if (balanceEl) balanceEl.textContent = `${val.toFixed(2)} $`;
    };
    const getUsedTxIds = () => new Set(JSON.parse(localStorage.getItem("sy_used_tx_ids") || "[]"));
    const saveUsedTxId = (txId) => {
        const used = getUsedTxIds();
        used.add(txId);
        localStorage.setItem("sy_used_tx_ids", JSON.stringify([...used]));
    };

    setBalance(getBalance());

    function renderCountries() {
        countryGrid.innerHTML = Object.entries(PAYMENT_CONFIG)
            .map(
                ([key, country]) => `
        <button type="button"
          class="sy-select-pill ${key === selectedCountryKey ? "is-active" : ""}"
          data-country="${key}">
          <span class="fw-semibold">${country.label}</span>
          <span class="sy-pill-meta">${country.currency}</span>
        </button>`
            )
            .join("");

        countryGrid.querySelectorAll("[data-country]").forEach((btn) => {
            btn.addEventListener("click", () => {
                selectedCountryKey = btn.dataset.country;
                selectedMethod = null;
                actionArea.classList.add("d-none");
                hideFeedback();
                renderCountries();
                renderMethods();
            });
        });
    }

    function renderMethods() {
        const country = PAYMENT_CONFIG[selectedCountryKey];
        methodsContainer.innerHTML = country.groups
            .map(
                (group) => `
        <div class="mb-3">
          <div class="sy-group-title">${group.title}</div>
          <div class="sy-method-grid">
            ${group.methods
                        .map(
                            (m) => `
                <button type="button"
                  class="sy-method-card ${selectedMethod?.id === m.id ? "is-active" : ""}"
                  data-method="${m.id}">
                  <span class="fw-semibold">${m.name}</span>
                  <span class="sy-method-type">${m.type === "wallet" ? "محفظة" :
                                    m.type === "bank" ? "بنك" :
                                        m.type === "card" ? "كرت شحن" : "دولي"
                                }</span>
                </button>`
                        )
                        .join("")}
          </div>
        </div>`
            )
            .join("");

        methodsContainer.querySelectorAll("[data-method]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const allMethods = country.groups.flatMap((g) => g.methods);
                selectedMethod = allMethods.find((m) => m.id === btn.dataset.method);
                renderMethods();
                renderMethodDetails();
            });
        });
    }

    function renderMethodDetails() {
        if (!selectedMethod) return;
        const country = PAYMENT_CONFIG[selectedCountryKey];

        document.getElementById("selectedMethodBadge").textContent = `${country.label} • ${selectedMethod.name}`;
        document.getElementById("depositTargetLabel").textContent = selectedMethod.targetLabel;
        document.getElementById("depositTargetValue").textContent = selectedMethod.targetValue;
        document.getElementById("depositAccountHolder").textContent = selectedMethod.holder;
        document.getElementById("depositMethodNote").textContent = selectedMethod.note;
        document.getElementById("depositCurrencyHint").textContent = `(${country.currency})`;
        document.getElementById("depositTxIdLabel").textContent =
            selectedMethod.txLabel || "معرف العملية (رقم الحوالة / المرجع)";

        copyBtn.classList.toggle("d-none", selectedMethod.type === "card");
        actionArea.classList.remove("d-none");
        hideFeedback();
    }

    copyBtn?.addEventListener("click", async () => {
        if (!selectedMethod) return;
        await navigator.clipboard.writeText(selectedMethod.targetValue);
        const original = copyBtn.textContent;
        copyBtn.textContent = "تم النسخ ✓";
        setTimeout(() => (copyBtn.textContent = original), 1600);
    });

    function showFeedback(type, message) {
        feedback.className = `alert alert-${type} mt-3 small mb-0`;
        feedback.textContent = message;
    }

    function hideFeedback() {
        feedback.className = "alert mt-3 d-none small mb-0";
        feedback.textContent = "";
    }

    // Replace this function body with a real fetch('/api/deposits/verify', ...) call
    async function verifyTransaction({ methodId, amount, txId }) {
        await new Promise((r) => setTimeout(r, 450));

        if (getUsedTxIds().has(txId)) {
            return { matched: false, message: "معرف العملية هذا تم استخدامه مسبقاً." };
        }

        const match = DEMO_PENDING_LEDGER.find(
            (item) =>
                item.methodId === methodId &&
                Number(item.amount) === Number(amount) &&
                item.txId.toLowerCase() === txId.toLowerCase()
        );

        if (!match) {
            return {
                matched: false,
                message: "لم يتم العثور على عملية مطابقة للمبلغ ومعرف العملية. تأكد من البيانات وحاول مجدداً."
            };
        }

        return { matched: true, creditedAmount: Number(amount) };
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        hideFeedback();

        const amount = parseFloat(document.getElementById("depositAmount").value);
        const txId = document.getElementById("depositTxId").value.trim();
        const submitBtn = document.getElementById("depositSubmitBtn");

        if (!selectedMethod) {
            return showFeedback("warning", "يرجى اختيار طريقة الدفع أولاً.");
        }
        if (!amount || amount <= 0 || !txId) {
            return showFeedback("warning", "يرجى إدخال المبلغ ومعرف العملية بشكل صحيح.");
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "جاري التحقق...";

        const result = await verifyTransaction({
            methodId: selectedMethod.id,
            amount,
            txId
        });

        submitBtn.disabled = false;
        submitBtn.textContent = "تأكيد وشحن الرصيد";

        if (result.matched) {
            saveUsedTxId(txId);
            const updated = getBalance() + result.creditedAmount;
            setBalance(updated);
            form.reset();
            showFeedback("success", `تمت المطابقة بنجاح! تم إيداع ${result.creditedAmount} في رصيدك فوراً.`);
        } else {
            showFeedback("danger", result.message);
        }
    });

    renderCountries();
    renderMethods();
}