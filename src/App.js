import { useState } from "react";

const formatCurrency = (val) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val || 0);

const InputField = ({ label, value, onChange, prefix = "$", suffix = "", hint = "" }) => {
  const [raw, setRaw] = useState(value === 0 ? "" : String(value));
  const [focused, setFocused] = useState(false);

  // Keep raw in sync when value changes externally (e.g. frequency toggle)
  useState(() => { if (!focused) setRaw(value === 0 ? "" : String(value)); });

  const handleChange = (e) => {
    const str = e.target.value;
    // Allow only digits and one decimal point
    if (str === "" || /^\d*\.?\d*$/.test(str)) {
      setRaw(str);
      onChange(str === "" ? 0 : parseFloat(str) || 0);
    }
  };

  const handleFocus = () => {
    setFocused(true);
    // Show plain number on focus, strip any formatting
    setRaw(value === 0 ? "" : String(value));
  };

  const handleBlur = () => {
    setFocused(false);
    // On blur: if empty leave empty display, if has value format nicely
    if (raw === "" || parseFloat(raw) === 0) {
      setRaw("");
      onChange(0);
    } else {
      const num = parseFloat(raw);
      // Format with commas, no decimals for whole numbers
      setRaw(Number.isInteger(num) ? num.toLocaleString("en-US") : num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      onChange(num);
    }
  };

  const displayValue = focused ? raw : (value === 0 ? "" : (Number.isInteger(value) ? value.toLocaleString("en-US") : value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })));

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8a7e6e", marginBottom: "0.35rem", fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", background: "#faf8f5", border: "1.5px solid #e8e0d4", borderRadius: "10px", overflow: "hidden" }}>
        {prefix && <span style={{ padding: "0 0.6rem 0 0.85rem", color: "#b0a898", fontWeight: 600, fontFamily: "'DM Mono', monospace", fontSize: "0.9rem" }}>{prefix}</span>}
        <input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="—"
          style={{ flex: 1, border: "none", background: "transparent", padding: "0.65rem 0.5rem", fontSize: "0.95rem", fontFamily: "'DM Mono', monospace", fontWeight: 500, color: "#2d2416", outline: "none", width: "100%" }}
        />
        {suffix && <span style={{ padding: "0 0.85rem", color: "#b0a898", fontWeight: 500, fontSize: "0.85rem" }}>{suffix}</span>}
      </div>
      {hint && <p style={{ fontSize: "0.7rem", color: "#b0a898", marginTop: "0.25rem", fontFamily: "'DM Sans', sans-serif" }}>{hint}</p>}
    </div>
  );
};

const Section = ({ title, icon, children, accent }) => (
  <div style={{ background: "#fff", borderRadius: "16px", border: "1.5px solid #ede6da", marginBottom: "1.25rem", overflow: "hidden", boxShadow: "0 2px 12px rgba(45,36,22,0.05)" }}>
    <div style={{ padding: "0.9rem 1.25rem", borderBottom: "1px solid #ede6da", display: "flex", alignItems: "center", gap: "0.6rem", background: accent || "#fdf9f4" }}>
      <span style={{ fontSize: "1.1rem" }}>{icon}</span>
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 700, color: "#2d2416", letterSpacing: "0.01em" }}>{title}</span>
    </div>
    <div style={{ padding: "1.25rem" }}>{children}</div>
  </div>
);

const BudgetBar = ({ label, amount, total, color }) => {
  const pct = total > 0 ? Math.min((amount / total) * 100, 100) : 0;
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
        <span style={{ fontSize: "0.78rem", fontFamily: "'DM Sans', sans-serif", color: "#5c4e3a", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: "0.78rem", fontFamily: "'DM Mono', monospace", fontWeight: 600, color: "#2d2416" }}>{formatCurrency(amount)}</span>
      </div>
      <div style={{ height: "6px", background: "#f0ebe2", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "99px", transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
};

const SavingsGauge = ({ label, monthly, target, months, color, icon }) => {
  const pct = target > 0 ? Math.min((monthly * months / target) * 100, 100) : 0;
  const monthsToGoal = monthly > 0 ? Math.ceil(target / monthly) : null;
  return (
    <div style={{ background: "#faf8f5", borderRadius: "12px", padding: "1rem", border: "1.5px solid #e8e0d4", marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span>{icon}</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2d2416", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
          </div>
          <div style={{ fontSize: "0.68rem", color: "#8a7e6e", marginTop: "0.2rem" }}>
            {monthsToGoal ? `${monthsToGoal} months to goal` : "Set a monthly amount"}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", fontWeight: 700, color }}>{formatCurrency(monthly)}<span style={{ fontSize: "0.65rem", color: "#b0a898" }}>/mo</span></div>
          <div style={{ fontSize: "0.65rem", color: "#8a7e6e" }}>Goal: {formatCurrency(target)}</div>
        </div>
      </div>
      <div style={{ height: "8px", background: "#ede6da", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "99px", transition: "width 0.5s ease" }} />
      </div>
      <div style={{ fontSize: "0.65rem", color: "#b0a898", marginTop: "0.3rem", textAlign: "right" }}>{pct.toFixed(0)}% funded at current rate</div>
    </div>
  );
};

// Reverse calculator: based on take-home pay, what's the max home price?
// Uses a comfortable buffer (10% of take-home kept as cushion) rather than gross income ratios,
// since the user's income is already after-tax take-home.
function calcMaxHomePrice(monthlyTakeHome, allOtherExpenses, totalSavings, interestRate, loanTerm, propertyTax, homeInsurance, hoa, maintenance, downPayment) {
  const cushion = monthlyTakeHome * 0.10; // keep 10% as breathing room
  const budgetForHousing = Math.max(0, monthlyTakeHome - allOtherExpenses - totalSavings - cushion);
  const fixedHomeCosts = propertyTax + homeInsurance + hoa + maintenance;
  const maxMortgagePayment = Math.max(0, budgetForHousing - fixedHomeCosts);
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;
  let maxLoan = 0;
  if (monthlyRate > 0 && maxMortgagePayment > 0) {
    maxLoan = maxMortgagePayment * (Math.pow(1 + monthlyRate, numPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numPayments));
  } else if (maxMortgagePayment > 0) {
    maxLoan = maxMortgagePayment * numPayments;
  }
  return { maxPrice: Math.max(0, maxLoan + downPayment), maxMortgagePayment, budgetForHousing, cushion };
}

export default function HomeAffordability() {
  // Income & loan
  const [paycheckAmount, setPaycheckAmount] = useState(0);
  const [paycheckFrequency, setPaycheckFrequency] = useState("biweekly"); // weekly | biweekly | semimonthly | monthly
  const income = paycheckFrequency === "weekly" ? paycheckAmount * 52
    : paycheckFrequency === "biweekly" ? paycheckAmount * 26
    : paycheckFrequency === "semimonthly" ? paycheckAmount * 24
    : paycheckAmount * 12;
  const [homePrice, setHomePrice] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [loanTerm, setLoanTerm] = useState(30);
  // Home costs
  const [propertyTax, setPropertyTax] = useState(0);
  const [homeInsurance, setHomeInsurance] = useState(0);
  const [hoa, setHoa] = useState(0);
  const [maintenance, setMaintenance] = useState(0);
  // Transport
  const [carPayment, setCarPayment] = useState(0);
  const [carInsurance, setCarInsurance] = useState(0);
  const [gas, setGas] = useState(0);
  // Bills
  const [phone, setPhone] = useState(0);
  const [electric, setElectric] = useState(0);
  const [gasUtil, setGasUtil] = useState(0);
  const [water, setWater] = useState(0);
  const [internet, setInternet] = useState(0);
  const [cable, setCable] = useState(0);
  const [subscriptions, setSubscriptions] = useState(0);
  // Living
  const [groceries, setGroceries] = useState(0);
  const [diningOut, setDiningOut] = useState(0);
  const [otherExpenses, setOtherExpenses] = useState(0);
  // Debt
  const [studentLoans, setStudentLoans] = useState(0);
  const [creditCards, setCreditCards] = useState(0);
  const [otherDebt, setOtherDebt] = useState(0);
  // Savings goals
  const [emergencyFundGoal, setEmergencyFundGoal] = useState(0);
  const [emergencyFundMonthly, setEmergencyFundMonthly] = useState(0);
  const [retirementMonthly, setRetirementMonthly] = useState(0);
  const [retirementGoal, setRetirementGoal] = useState(0);
  const [savingsGoalLabel, setSavingsGoalLabel] = useState("Vacation / Other");
  const [savingsGoalTarget, setSavingsGoalTarget] = useState(0);
  const [savingsGoalMonthly, setSavingsGoalMonthly] = useState(0);

  const [activeTab, setActiveTab] = useState("inputs");
  const [activeInputSection, setActiveInputSection] = useState("home");

  // Calculations
  const monthlyIncome = paycheckFrequency === "weekly" ? paycheckAmount * 52 / 12
    : paycheckFrequency === "biweekly" ? paycheckAmount * 26 / 12
    : paycheckFrequency === "semimonthly" ? paycheckAmount * 24 / 12
    : paycheckAmount;
  const monthlyGross = monthlyIncome;
  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;
  const mortgage =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) / (Math.pow(1 + monthlyRate, numPayments) - 1)
      : loanAmount / numPayments;

  const totalDebtPayments = studentLoans + creditCards + otherDebt;
  const totalHousingCost = mortgage + propertyTax + homeInsurance + hoa + maintenance;
  const totalTransport = carPayment + carInsurance + gas;
  const totalBills = phone + electric + gasUtil + water + internet + cable + subscriptions;
  const totalLiving = groceries + diningOut + otherExpenses;
  const totalSavings = emergencyFundMonthly + retirementMonthly + savingsGoalMonthly;
  const totalOtherExpenses = totalTransport + totalBills + totalLiving + totalDebtPayments;
  const totalMonthlyExpenses = totalHousingCost + totalOtherExpenses + totalSavings;
  const remaining = monthlyGross - totalMonthlyExpenses;

  const housingRatio = monthlyGross > 0 ? (totalHousingCost / monthlyGross) * 100 : 0;
  const totalDebtRatio = monthlyGross > 0 ? ((totalHousingCost + totalDebtPayments + totalTransport) / monthlyGross) * 100 : 0;
  const downPaymentPct = homePrice > 0 ? ((downPayment / homePrice) * 100).toFixed(1) : 0;

  // Reverse calc
  const reverseCalc = calcMaxHomePrice(
    monthlyGross,
    totalTransport + totalBills + totalLiving + totalDebtPayments,
    totalSavings,
    interestRate, loanTerm, propertyTax, homeInsurance, hoa, maintenance, downPayment
  );
  const getRating = () => {
    // Use remaining budget as the primary signal — it's the most honest indicator.
    // DTI ratios shown as context, not as pass/fail gates.
    // Lenders today approve up to 43–50% DTI; 28/36 are conservative starting points only.
    if (remaining < 0) return { label: "Spending exceeds take-home", color: "#c0392b", bg: "#fdecea", icon: "!", sub: "Your expenses exceed your take-home pay. Something needs to adjust." };
    if (remaining < 300) return { label: "Very tight — little cushion", color: "#c0392b", bg: "#fdecea", icon: "!", sub: "Less than $300/mo left over. One unexpected bill could cause real stress." };
    if (remaining < 800) return { label: "Workable — but watch closely", color: "#c8862a", bg: "#fdf3e3", icon: "~", sub: "You can make it work, but build that emergency fund before closing." };
    if (remaining < 1500) return { label: "Comfortable — solid footing", color: "#3d9e6e", bg: "#edf7f2", icon: "✓", sub: "Good monthly cushion. You have room to handle surprises and still save." };
    return { label: "Plenty of room — well positioned", color: "#2d6e4e", bg: "#e0f2ea", icon: "✓✓", sub: "Strong cushion every month. You're in great shape for homeownership." };
  };
  const rating = getRating();

  const inputSections = [
    { id: "home", label: "Home", icon: "🏡" },
    { id: "expenses", label: "Expenses", icon: "💳" },
    { id: "debt", label: "Debt", icon: "📋" },
    { id: "savings", label: "Savings", icon: "🏦" },
  ];

  const [activeResultTab, setActiveResultTab] = useState("overview");

  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #fdf8f0 0%, #f5ede0 100%)", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── DISCLAIMER MODAL ── */}
      {!disclaimerAccepted && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.25rem" }}>
          <div style={{ background: "#fff", borderRadius: "20px", maxWidth: "420px", width: "100%", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ background: "#2d2416", padding: "1.25rem 1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>⚖️</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#f5ede0", fontSize: "1.15rem", margin: 0 }}>Important Disclaimer</h2>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <p style={{ fontSize: "0.82rem", color: "#2d2416", lineHeight: 1.7, margin: "0 0 1rem", fontWeight: 600 }}>
                This app is for educational and informational purposes only.
              </p>
              <p style={{ fontSize: "0.78rem", color: "#5c4e3a", lineHeight: 1.7, margin: "0 0 0.85rem" }}>
                The calculations, estimates, and results provided by this app do <strong>not</strong> constitute financial, legal, mortgage, or investment advice. All figures are estimates based solely on the information you enter and standard mathematical formulas.
              </p>
              <p style={{ fontSize: "0.78rem", color: "#5c4e3a", lineHeight: 1.7, margin: "0 0 0.85rem" }}>
                Actual mortgage qualification, interest rates, loan terms, property taxes, insurance costs, and affordability will vary based on your credit history, lender requirements, local regulations, and other factors not accounted for in this app.
              </p>
              <p style={{ fontSize: "0.78rem", color: "#5c4e3a", lineHeight: 1.7, margin: "0 0 1.25rem" }}>
                <strong>Always consult a licensed financial advisor, mortgage professional, or real estate attorney before making any home purchasing decision.</strong> The developer of this app assumes no liability for financial decisions made based on its output.
              </p>
              <div style={{ background: "#fdf9f4", borderRadius: "10px", padding: "0.75rem", border: "1px solid #e8e0d4", marginBottom: "1.25rem" }}>
                <p style={{ fontSize: "0.7rem", color: "#8a7e6e", margin: 0, lineHeight: 1.6, textAlign: "center" }}>
                  By tapping <strong>"I Understand &amp; Continue"</strong> you acknowledge that you have read this disclaimer and agree that this app does not provide professional financial advice.
                </p>
              </div>
              <button onClick={() => setDisclaimerAccepted(true)}
                style={{ width: "100%", padding: "0.95rem", background: "#2d2416", color: "#f5ede0", border: "none", borderRadius: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", letterSpacing: "0.03em", marginBottom: "0.6rem" }}>
                I Understand &amp; Continue
              </button>
              <p style={{ fontSize: "0.65rem", color: "#b0a898", textAlign: "center", margin: 0, lineHeight: 1.5 }}>
                This disclaimer is displayed each session for your protection.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div style={{ background: "#2d2416", padding: "1.75rem 1.5rem 1.25rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.2em", color: "#8a7e6e", textTransform: "uppercase", marginBottom: "0.4rem" }}>New Home Owner Tool</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#f5ede0", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>Can I Afford This Home?</h1>
        <p style={{ color: "#8a7e6e", fontSize: "0.8rem", marginTop: "0.4rem" }}>Your complete financial picture — before you sign</p>
      </div>

      {/* Sticky summary bar */}
      <div style={{ background: "#2d2416", borderTop: "1px solid #3d3022", padding: "0.75rem 1rem", display: "flex", justifyContent: "space-around", position: "sticky", top: 0, zIndex: 10 }}>
        {[
          { label: "Take-Home / mo", val: formatCurrency(monthlyGross) },
          { label: "Total Out", val: formatCurrency(totalMonthlyExpenses), warn: totalMonthlyExpenses > monthlyGross },
          { label: "Left Over", val: formatCurrency(remaining), warn: remaining < 0 },
        ].map((item) => (
          <div key={item.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.58rem", color: "#8a7e6e", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.15rem" }}>{item.label}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.95rem", fontWeight: 700, color: item.warn ? "#e07b6a" : "#f5ede0" }}>{item.val}</div>
          </div>
        ))}
      </div>

      {/* Main tab bar */}
      <div style={{ display: "flex", background: "#fff", borderBottom: "1.5px solid #ede6da" }}>
        {[["inputs", "📝 My Numbers"], ["results", "📊 Results"]].map(([t, label]) => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ flex: 1, padding: "0.85rem", border: "none", background: "transparent", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", color: activeTab === t ? "#2d2416" : "#b0a898", borderBottom: activeTab === t ? "2.5px solid #c8862a" : "2.5px solid transparent", transition: "all 0.2s" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "1.25rem 1rem 3rem" }}>

        {/* ── INPUTS ── */}
        {activeTab === "inputs" && (
          <>
            {/* Sub-nav */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", overflowX: "auto", paddingBottom: "2px" }}>
              {inputSections.map((s) => (
                <button key={s.id} onClick={() => setActiveInputSection(s.id)}
                  style={{ flexShrink: 0, padding: "0.45rem 0.9rem", borderRadius: "99px", border: "1.5px solid", borderColor: activeInputSection === s.id ? "#2d2416" : "#e8e0d4", background: activeInputSection === s.id ? "#2d2416" : "#fff", color: activeInputSection === s.id ? "#f5ede0" : "#8a7e6e", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>

            {activeInputSection === "home" && (
              <>
                <Section title="Your Income" icon="💰" accent="#fdf3e3">
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8a7e6e", marginBottom: "0.35rem", fontFamily: "'DM Sans', sans-serif" }}>
                      Pay Frequency
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                      {[["weekly","Weekly"],["biweekly","Bi-Weekly"],["semimonthly","Semi-Monthly"],["monthly","Monthly"]].map(([val, lbl]) => (
                        <button key={val} onClick={() => setPaycheckFrequency(val)}
                          style={{ padding: "0.55rem", borderRadius: "8px", border: "1.5px solid", borderColor: paycheckFrequency === val ? "#2d2416" : "#e8e0d4", background: paycheckFrequency === val ? "#2d2416" : "#faf8f5", color: paycheckFrequency === val ? "#f5ede0" : "#8a7e6e", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                  <InputField label="Take-Home Pay Per Check (after taxes)" value={paycheckAmount} onChange={setPaycheckAmount} hint="Enter your actual net paycheck amount" />
                  <div style={{ background: "#fdf9f4", borderRadius: "10px", padding: "0.75rem 0.85rem", border: "1px solid #e8e0d4" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "#8a7e6e" }}>
                        {paycheckFrequency === "weekly" ? "52 checks" : paycheckFrequency === "biweekly" ? "26 checks" : paycheckFrequency === "semimonthly" ? "24 checks" : "12 checks"} × {formatCurrency(paycheckAmount)} ÷ 12
                      </span>
                      <span style={{ fontSize: "0.65rem", color: "#b0a898", fontStyle: "italic" }}>true monthly</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2d2416" }}>Monthly Take-Home</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: "1rem", color: "#3d9e6e" }}>{formatCurrency(monthlyGross)}</span>
                    </div>
                  </div>
                </Section>

                <Section title="Home Purchase" icon="🏡" accent="#edf7f2">
                  <InputField label="Home Purchase Price" value={homePrice} onChange={setHomePrice} />
                  <InputField label="Down Payment" value={downPayment} onChange={setDownPayment} hint={`${downPaymentPct}% down · Loan: ${formatCurrency(loanAmount)}`} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <InputField label="Interest Rate" value={interestRate} onChange={setInterestRate} prefix="" suffix="%" />
                    <InputField label="Loan Term" value={loanTerm} onChange={setLoanTerm} prefix="" suffix="yrs" />
                  </div>
                  <div style={{ padding: "0.6rem 0.85rem", background: "#edf7f2", borderRadius: "8px", display: "flex", justifyContent: "space-between", border: "1px solid #c3e8d4" }}>
                    <span style={{ fontSize: "0.78rem", color: "#3d9e6e", fontWeight: 600 }}>Monthly Mortgage (P&I)</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: "0.88rem", color: "#3d9e6e" }}>{formatCurrency(mortgage)}</span>
                  </div>
                </Section>

                <Section title="Home Ownership Costs" icon="🏠">
                  <InputField label="Property Tax (monthly)" value={propertyTax} onChange={setPropertyTax} />
                  <InputField label="Homeowners Insurance" value={homeInsurance} onChange={setHomeInsurance} />
                  <InputField label="HOA Fees" value={hoa} onChange={setHoa} hint="Enter 0 if none" />
                  <InputField label="Maintenance Reserve" value={maintenance} onChange={setMaintenance} hint="~1% of home value/year recommended" />
                </Section>

                <button onClick={() => setActiveInputSection("expenses")}
                  style={{ width: "100%", padding: "0.9rem", background: "#f5f0e8", color: "#2d2416", border: "1.5px solid #c8b89a", borderRadius: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", letterSpacing: "0.04em", marginTop: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  Go to Expenses →
                </button>
              </>
            )}

            {activeInputSection === "expenses" && (
              <>
                <Section title="Monthly Transportation Costs" icon="🚗">
                  <InputField label="Car Payment(s)" value={carPayment} onChange={setCarPayment} />
                  <InputField label="Car Insurance" value={carInsurance} onChange={setCarInsurance} />
                  <InputField label="Gas / Fuel" value={gas} onChange={setGas} />
                </Section>

                <Section title="Monthly Bills" icon="📱">
                  <InputField label="Phone Bill" value={phone} onChange={setPhone} />
                  <InputField label="Electric Bill" value={electric} onChange={setElectric} />
                  <InputField label="Gas Bill" value={gasUtil} onChange={setGasUtil} />
                  <InputField label="Water Bill" value={water} onChange={setWater} />
                  <InputField label="Internet" value={internet} onChange={setInternet} />
                  <InputField label="Cable / TV" value={cable} onChange={setCable} hint="Enter 0 if none" />
                  <InputField label="Streaming & Subscriptions" value={subscriptions} onChange={setSubscriptions} />
                  <div style={{ padding: "0.5rem 0.85rem", background: "#fdf9f4", borderRadius: "8px", display: "flex", justifyContent: "space-between", border: "1px solid #e8e0d4" }}>
                    <span style={{ fontSize: "0.78rem", color: "#8a7e6e", fontWeight: 600 }}>Total Monthly Bills</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: "0.88rem", color: "#2d2416" }}>{formatCurrency(totalBills)}</span>
                  </div>
                </Section>

                <Section title="Living Expenses" icon="🛒">
                  <InputField label="Groceries" value={groceries} onChange={setGroceries} />
                  <InputField label="Dining Out / Takeout" value={diningOut} onChange={setDiningOut} />
                  <InputField label="Other (clothing, medical, etc.)" value={otherExpenses} onChange={setOtherExpenses} />
                </Section>

                <button onClick={() => setActiveInputSection("debt")}
                  style={{ width: "100%", padding: "0.9rem", background: "#f5f0e8", color: "#2d2416", border: "1.5px solid #c8b89a", borderRadius: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", letterSpacing: "0.04em", marginTop: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  Go to Debt →
                </button>
              </>
            )}

            {activeInputSection === "debt" && (
              <>
                <Section title="Other Debt Payments" icon="📋" accent="#fdecea">
                  <p style={{ fontSize: "0.75rem", color: "#8a7e6e", marginTop: 0, marginBottom: "1rem", lineHeight: 1.5 }}>
                    These count toward your debt-to-income ratio and directly affect what lenders will approve.
                  </p>
                  <InputField label="Student Loan Payment(s)" value={studentLoans} onChange={setStudentLoans} hint="Monthly minimum payment" />
                  <InputField label="Credit Card Minimums" value={creditCards} onChange={setCreditCards} hint="Enter your minimum monthly payment (not your balance). If you pay in full each month, enter your typical monthly spend." />
                  <InputField label="Other Debt (personal loans, etc.)" value={otherDebt} onChange={setOtherDebt} />
                  <div style={{ padding: "0.6rem 0.85rem", background: "#fdecea", borderRadius: "8px", display: "flex", justifyContent: "space-between", border: "1px solid #f5c6c0" }}>
                    <span style={{ fontSize: "0.78rem", color: "#c0392b", fontWeight: 600 }}>Total Monthly Debt</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: "0.88rem", color: "#c0392b" }}>{formatCurrency(totalDebtPayments)}</span>
                  </div>
                </Section>

                <button onClick={() => setActiveInputSection("savings")}
                  style={{ width: "100%", padding: "0.9rem", background: "#f5f0e8", color: "#2d2416", border: "1.5px solid #c8b89a", borderRadius: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", letterSpacing: "0.04em", marginTop: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  Go to Savings →
                </button>
              </>
            )}

            {activeInputSection === "savings" && (
              <>
                <Section title="Savings Goals" icon="🏦" accent="#edf7f2">
                  <p style={{ fontSize: "0.75rem", color: "#8a7e6e", marginTop: 0, marginBottom: "1rem", lineHeight: 1.5 }}>
                    Saving intentionally each month is how wealth is built. These are included in your budget calculations.
                  </p>

                  <div style={{ background: "#fdf9f4", borderRadius: "10px", padding: "0.85rem", marginBottom: "1rem", border: "1px solid #e8e0d4" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2d2416", marginBottom: "0.6rem" }}>🆘 Emergency Fund</div>
                    <InputField label="Monthly Contribution" value={emergencyFundMonthly} onChange={setEmergencyFundMonthly} />
                    <InputField label="Total Goal (3–6 months of expenses)" value={emergencyFundGoal} onChange={setEmergencyFundGoal}
                      hint={`Recommended: ${formatCurrency(totalMonthlyExpenses * 4)} (4 months)`} />
                  </div>

                  <div style={{ background: "#fdf9f4", borderRadius: "10px", padding: "0.85rem", marginBottom: "1rem", border: "1px solid #e8e0d4" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2d2416", marginBottom: "0.25rem" }}>📈 Additional Retirement Savings</div>
                    <div style={{ fontSize: "0.68rem", color: "#8a7e6e", marginBottom: "0.75rem", lineHeight: 1.5 }}>
                      Only enter this if you save for retirement <strong>outside</strong> your paycheck — e.g. a Roth IRA or extra contributions not already deducted. If your 401k comes out of your paycheck automatically, leave this at zero to avoid double counting.
                    </div>
                    <InputField label="Monthly Contribution" value={retirementMonthly} onChange={setRetirementMonthly} hint={`15% target: ${formatCurrency(monthlyGross * 0.15)}/mo`} />
                    <InputField label="Annual Goal" value={retirementGoal} onChange={setRetirementGoal} hint={`15% target: ${formatCurrency(income * 0.15 / 12)}/mo`} />
                  </div>

                  <div style={{ background: "#fdf9f4", borderRadius: "10px", padding: "0.85rem", border: "1px solid #e8e0d4" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2d2416", marginBottom: "0.6rem" }}>✨ Other Savings Goal</div>
                    <div style={{ marginBottom: "0.75rem" }}>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8a7e6e", marginBottom: "0.35rem" }}>Goal Name</label>
                      <input value={savingsGoalLabel} onChange={(e) => setSavingsGoalLabel(e.target.value)}
                        style={{ width: "100%", background: "#faf8f5", border: "1.5px solid #e8e0d4", borderRadius: "10px", padding: "0.65rem 0.85rem", fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif", color: "#2d2416", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <InputField label="Monthly Contribution" value={savingsGoalMonthly} onChange={setSavingsGoalMonthly} />
                    <InputField label="Total Goal Amount" value={savingsGoalTarget} onChange={setSavingsGoalTarget} />
                  </div>
                </Section>

                <button onClick={() => { setActiveTab("results"); setActiveResultTab("overview"); }}
                  style={{ width: "100%", padding: "1rem", background: "#2d2416", color: "#f5ede0", border: "none", borderRadius: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", letterSpacing: "0.04em", marginTop: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  See My Results →
                </button>
              </>
            )}
          </>
        )}

        {/* ── RESULTS ── */}
        {activeTab === "results" && (
          <>
            {/* Result sub-tabs */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", overflowX: "auto", paddingBottom: "2px" }}>
              {[["overview", "📊 Overview"], ["reverse", "🔍 What Can I Afford?"], ["savings", "🏦 Savings Plan"]].map(([t, label]) => (
                <button key={t} onClick={() => setActiveResultTab(t)}
                  style={{ flexShrink: 0, padding: "0.45rem 0.9rem", borderRadius: "99px", border: "1.5px solid", borderColor: activeResultTab === t ? "#2d2416" : "#e8e0d4", background: activeResultTab === t ? "#2d2416" : "#fff", color: activeResultTab === t ? "#f5ede0" : "#8a7e6e", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}>
                  {label}
                </button>
              ))}
            </div>

            {/* ── OVERVIEW ── */}
            {activeResultTab === "overview" && (
              <>
                {/* Verdict */}
                <div style={{ background: rating.bg, border: `2px solid ${rating.color}30`, borderRadius: "16px", padding: "1.5rem", textAlign: "center", marginBottom: "1.25rem" }}>
                  <div style={{ width: "48px", height: "48px", background: rating.color, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem", fontSize: "1.1rem", color: "#fff", fontWeight: 800 }}>{rating.icon}</div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: rating.color, margin: "0 0 0.35rem" }}>{rating.label}</h2>
                  <p style={{ fontSize: "0.78rem", color: "#5c4e3a", margin: "0 0 0.5rem" }}>{rating.sub}</p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(0,0,0,0.06)", borderRadius: "99px", padding: "0.3rem 0.75rem" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", fontWeight: 700, color: rating.color }}>{formatCurrency(remaining)}/mo</span>
                    <span style={{ fontSize: "0.7rem", color: "#8a7e6e" }}>left over</span>
                  </div>
                </div>

                {/* Ratios */}
                <Section title="Your Ratios — for context" icon="📐" accent="#fdf9f4">
                  <p style={{ fontSize: "0.72rem", color: "#8a7e6e", margin: "0 0 0.85rem", lineHeight: 1.5 }}>
                    Lenders traditionally cite 28% housing and 36% total DTI as starting points, but many approve loans up to 43–50% DTI. What matters most is that <em>you</em> feel comfortable with what's left over each month.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                    {[
                      { label: "Housing Ratio", val: housingRatio, conservative: 28, flexible: 36, desc: "of take-home on housing" },
                      { label: "Total DTI", val: totalDebtRatio, conservative: 36, flexible: 50, desc: "of take-home on all debt" },
                    ].map((r) => {
                      const color = r.val <= r.conservative ? "#3d9e6e" : r.val <= r.flexible ? "#c8862a" : "#c0392b";
                      const pct = Math.min(r.val / (r.flexible * 1.2) * 100, 100);
                      return (
                        <div key={r.label} style={{ background: "#fdf9f4", borderRadius: "10px", padding: "0.85rem", border: "1.5px solid #e8e0d4" }}>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.6rem", fontWeight: 700, color, textAlign: "center" }}>{r.val.toFixed(1)}%</div>
                          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#5c4e3a", textAlign: "center", margin: "0.2rem 0" }}>{r.label}</div>
                          <div style={{ height: "5px", background: "#ede6da", borderRadius: "99px", overflow: "hidden", margin: "0.4rem 0" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "99px", transition: "width 0.5s ease" }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: "0.58rem", color: "#b0a898" }}>Conservative: {r.conservative}%</span>
                            <span style={{ fontSize: "0.58rem", color: "#b0a898" }}>Flexible: {r.flexible}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem" }}>
                    {[
                      { label: "Take-Home / mo", val: formatCurrency(monthlyGross) },
                      { label: "Total Expenses", val: formatCurrency(totalMonthlyExpenses) },
                      { label: "Left Over", val: formatCurrency(remaining), highlight: remaining < 0 },
                    ].map((s) => (
                      <div key={s.label} style={{ background: s.highlight ? "#fdecea" : "#f5f0e8", borderRadius: "8px", padding: "0.6rem 0.4rem", textAlign: "center" }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", fontWeight: 700, color: s.highlight ? "#c0392b" : "#2d2416" }}>{s.val}</div>
                        <div style={{ fontSize: "0.6rem", color: "#8a7e6e", marginTop: "0.15rem" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Budget bars */}
                <Section title="Monthly Budget Breakdown" icon="📊">
                  <BudgetBar label="Mortgage (P&I)" amount={mortgage} total={monthlyGross} color="#4a7fa5" />
                  <BudgetBar label="Property Tax" amount={propertyTax} total={monthlyGross} color="#5a9e7a" />
                  <BudgetBar label="Insurance & HOA" amount={homeInsurance + hoa} total={monthlyGross} color="#8abf9a" />
                  <BudgetBar label="Maintenance" amount={maintenance} total={monthlyGross} color="#b3d4bf" />
                  <BudgetBar label="Transportation" amount={totalTransport} total={monthlyGross} color="#c8862a" />
                  <BudgetBar label="Bills & Utilities" amount={totalBills} total={monthlyGross} color="#d4a44a" />
                  <BudgetBar label="Food & Living" amount={totalLiving} total={monthlyGross} color="#d4b86a" />
                  {totalDebtPayments > 0 && <BudgetBar label="Debt Payments" amount={totalDebtPayments} total={monthlyGross} color="#c0392b" />}
                  {totalSavings > 0 && <BudgetBar label="Savings" amount={totalSavings} total={monthlyGross} color="#3d9e6e" />}
                </Section>

                {/* Housing itemized */}
                <Section title="Full Housing Cost" icon="🏡" accent="#edf7f2">
                  {[
                    ["Mortgage (P&I)", mortgage],
                    ["Property Tax", propertyTax],
                    ["Homeowners Insurance", homeInsurance],
                    ["HOA Fees", hoa],
                    ["Maintenance Reserve", maintenance],
                  ].map(([label, val]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.45rem 0", borderBottom: "1px solid #f0ebe2" }}>
                      <span style={{ fontSize: "0.82rem", color: "#5c4e3a" }}>{label}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", fontWeight: 600, color: "#2d2416" }}>{formatCurrency(val)}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0 0", marginTop: "0.25rem" }}>
                    <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#2d2416" }}>Total Housing / mo</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.95rem", fontWeight: 700, color: "#3d9e6e" }}>{formatCurrency(totalHousingCost)}</span>
                  </div>
                </Section>

                {/* Tips */}
                <div style={{ background: "#2d2416", borderRadius: "14px", padding: "1.25rem" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", color: "#f5ede0", fontWeight: 700, fontSize: "0.95rem", margin: "0 0 0.75rem" }}>💡 Things to know</p>
                  {[
                    downPaymentPct < 20
                      ? `⚠️ ${downPaymentPct}% down — you'll likely pay PMI (~0.5–1% of the loan/year) until you reach 20% equity.`
                      : `✓ ${downPaymentPct}% down payment — no PMI required.`,
                    remaining >= 1500
                      ? `✓ ${formatCurrency(remaining)}/mo left over is a strong cushion. You're well positioned for unexpected repairs and expenses.`
                      : remaining >= 800
                      ? `${formatCurrency(remaining)}/mo left over is workable. Keep building your emergency fund — aim for 3–6 months of expenses.`
                      : remaining >= 300
                      ? `⚠️ Only ${formatCurrency(remaining)}/mo remaining. Consider whether any expenses can be reduced before closing.`
                      : `⚠️ Very little left over — review your budget carefully before committing.`,
                    housingRatio > 36
                      ? `Your housing ratio is ${housingRatio.toFixed(0)}% — high by traditional standards, but what matters is whether you're comfortable with what's left over.`
                      : `Your housing ratio is ${housingRatio.toFixed(0)}% — well within a reasonable range.`,
                    totalDebtPayments > 0
                      ? `You have ${formatCurrency(totalDebtPayments)}/mo in other debt. Lenders will factor this into their approval decision.`
                      : `✓ No other debt payments — a strong position when applying for a mortgage.`,
                  ].map((tip, i) => (
                    <p key={i} style={{ fontSize: "0.78rem", color: "#c8b89a", margin: "0.4rem 0", lineHeight: 1.5 }}>{tip}</p>
                  ))}
                </div>
              </>
            )}

            {/* ── REVERSE CALCULATOR ── */}
            {activeResultTab === "reverse" && (
              <>
                {(() => {
                  const otherFixed = totalTransport + totalBills + totalLiving + totalDebtPayments + totalSavings;

                  // Conservative: keep 20% cushion
                  const consBudget20 = Math.max(0, monthlyGross - otherFixed - monthlyGross * 0.20);
                  const consFixed = propertyTax + homeInsurance + hoa + maintenance;
                  const consMortgage20 = Math.max(0, consBudget20 - consFixed);
                  const mr0 = interestRate / 100 / 12;
                  const np0 = loanTerm * 12;
                  const consLoan20 = mr0 > 0 && consMortgage20 > 0 ? consMortgage20 * (Math.pow(1+mr0,np0)-1)/(mr0*Math.pow(1+mr0,np0)) : consMortgage20 * np0;
                  const consPrice20 = Math.max(0, consLoan20 + downPayment);
                  // Comfortable: 10% cushion (default)
                  const comfortableCalc = reverseCalc;
                  // Stretch: 5% cushion
                  const stretchBudget = Math.max(0, monthlyGross - otherFixed - monthlyGross * 0.05);
                  const stretchFixed = propertyTax + homeInsurance + hoa + maintenance;
                  const stretchMortgage = Math.max(0, stretchBudget - stretchFixed);
                  const mr = interestRate / 100 / 12;
                  const np = loanTerm * 12;
                  const stretchLoan = mr > 0 && stretchMortgage > 0 ? stretchMortgage * (Math.pow(1+mr,np)-1)/(mr*Math.pow(1+mr,np)) : stretchMortgage * np;
                  const stretchPrice = Math.max(0, stretchLoan + downPayment);

                  const tiers = [
                    { label: "Conservative", sublabel: "20% cushion kept", price: consPrice20, mortgage: consMortgage20, leftover: monthlyGross - otherFixed - consBudget20, color: "#3d9e6e", bg: "#edf7f2", border: "#c3e8d4", icon: "🟢" },
                    { label: "Comfortable", sublabel: "10% cushion kept", price: comfortableCalc.maxPrice, mortgage: comfortableCalc.maxMortgagePayment, leftover: monthlyGross - otherFixed - comfortableCalc.budgetForHousing, color: "#4a7fa5", bg: "#eef4fa", border: "#b8d4ea", icon: "🔵" },
                    { label: "Stretch", sublabel: "5% cushion kept", price: stretchPrice, mortgage: stretchMortgage, leftover: monthlyGross * 0.05, color: "#c8862a", bg: "#fdf3e3", border: "#f0d4a8", icon: "🟡" },
                  ];

                  return (
                    <>
                      <div style={{ background: "#2d2416", borderRadius: "14px", padding: "1rem 1.25rem", marginBottom: "1.25rem", textAlign: "center" }}>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.14em", color: "#8a7e6e", textTransform: "uppercase", margin: "0 0 0.3rem" }}>Based on your take-home & expenses</p>
                        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "#f5ede0", fontWeight: 700, margin: 0 }}>Here's what you can afford at three comfort levels</p>
                      </div>

                      {tiers.map((tier) => (
                        <div key={tier.label} style={{ background: tier.bg, border: `1.5px solid ${tier.border}`, borderRadius: "14px", padding: "1.1rem 1.25rem", marginBottom: "0.85rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <span style={{ fontSize: "0.85rem" }}>{tier.icon}</span>
                                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 700, color: tier.color }}>{tier.label}</span>
                              </div>
                              <div style={{ fontSize: "0.68rem", color: "#8a7e6e", marginTop: "0.15rem" }}>{tier.sublabel}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.35rem", fontWeight: 700, color: tier.color, lineHeight: 1 }}>{formatCurrency(tier.price)}</div>
                              <div style={{ fontSize: "0.65rem", color: "#8a7e6e", marginTop: "0.2rem" }}>max home price</div>
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                            {[
                              ["Max Mortgage Pmt", formatCurrency(tier.mortgage) + "/mo"],
                              ["Left Over / mo", formatCurrency(Math.max(0, tier.leftover))],
                            ].map(([lbl, val]) => (
                              <div key={lbl} style={{ background: "rgba(255,255,255,0.6)", borderRadius: "8px", padding: "0.5rem 0.65rem" }}>
                                <div style={{ fontSize: "0.62rem", color: "#8a7e6e", textTransform: "uppercase", letterSpacing: "0.06em" }}>{lbl}</div>
                                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", fontWeight: 700, color: "#2d2416", marginTop: "0.15rem" }}>{val}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      <Section title="How This Is Calculated" icon="🔍" accent="#fdf9f4">
                        {[
                          ["Monthly Take-Home", formatCurrency(monthlyGross)],
                          ["All Other Expenses", formatCurrency(totalTransport + totalBills + totalLiving + totalDebtPayments)],
                          ["Savings Goals", formatCurrency(totalSavings)],
                          ["Remaining before housing", formatCurrency(monthlyGross - otherFixed)],
                          ["Less: Tax, Insurance, HOA, Maint.", formatCurrency(propertyTax + homeInsurance + hoa + maintenance)],
                        ].map(([label, val], i) => (
                          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.45rem 0", borderBottom: i < 4 ? "1px solid #f0ebe2" : "none" }}>
                            <span style={{ fontSize: "0.78rem", color: "#5c4e3a" }}>{label}</span>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", fontWeight: 600, color: "#2d2416" }}>{val}</span>
                          </div>
                        ))}
                      </Section>

                      <Section title="Your Current Home vs. These Ranges" icon="📏">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid #f0ebe2" }}>
                          <span style={{ fontSize: "0.82rem", color: "#5c4e3a", fontWeight: 600 }}>Your home price</span>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.9rem", fontWeight: 700, color: "#2d2416" }}>{formatCurrency(homePrice)}</span>
                        </div>
                        {tiers.map((tier) => {
                          const diff = tier.price - homePrice;
                          const over = diff < 0;
                          return (
                            <div key={tier.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid #f0ebe2" }}>
                              <span style={{ fontSize: "0.78rem", color: "#5c4e3a" }}>{tier.label} max</span>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: tier.color, fontWeight: 600 }}>{formatCurrency(tier.price)}</span>
                                <span style={{ fontSize: "0.7rem", fontFamily: "'DM Mono', monospace", color: over ? "#c0392b" : "#3d9e6e", fontWeight: 700 }}>{over ? `▲${formatCurrency(Math.abs(diff))} over` : `▼${formatCurrency(diff)} under`}</span>
                              </div>
                            </div>
                          );
                        })}
                      </Section>

                      <div style={{ background: "#2d2416", borderRadius: "14px", padding: "1.25rem" }}>
                        <p style={{ fontFamily: "'Playfair Display', serif", color: "#f5ede0", fontWeight: 700, fontSize: "0.9rem", margin: "0 0 0.65rem" }}>💡 Ways to increase your buying power</p>
                        {[
                          "Save a larger down payment to reduce your loan amount",
                          "Pay off existing debts to free up monthly cash flow",
                          "Shop for a lower interest rate — even 0.5% makes a meaningful difference",
                          "Consider a 30-year term vs. 15-year to lower monthly payments",
                          "Look for homes with no HOA or lower property tax areas",
                        ].map((tip, i) => (
                          <p key={i} style={{ fontSize: "0.75rem", color: "#c8b89a", margin: "0.35rem 0", lineHeight: 1.5 }}>• {tip}</p>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </>
            )}

            {/* ── SAVINGS PLAN ── */}
            {activeResultTab === "savings" && (
              <>
                <div style={{ background: "#edf7f2", borderRadius: "14px", padding: "1.1rem", marginBottom: "1.25rem", border: "1.5px solid #c3e8d4", display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.62rem", color: "#5a9e7a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.2rem" }}>Saving Monthly</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.1rem", fontWeight: 700, color: "#2d6e4e" }}>{formatCurrency(totalSavings)}</div>
                  </div>
                  <div style={{ width: "1px", background: "#c3e8d4" }} />
                  <div>
                    <div style={{ fontSize: "0.62rem", color: "#5a9e7a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.2rem" }}>Savings Rate</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.1rem", fontWeight: 700, color: monthlyGross > 0 && totalSavings / monthlyGross >= 0.15 ? "#2d6e4e" : "#c8862a" }}>
                      {monthlyGross > 0 ? ((totalSavings / monthlyGross) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                  <div style={{ width: "1px", background: "#c3e8d4" }} />
                  <div>
                    <div style={{ fontSize: "0.62rem", color: "#5a9e7a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.2rem" }}>Left After Saving</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.1rem", fontWeight: 700, color: remaining < 0 ? "#c0392b" : "#2d6e4e" }}>{formatCurrency(remaining)}</div>
                  </div>
                </div>

                {totalSavings === 0 ? (
                  <div style={{ background: "#fff", borderRadius: "14px", padding: "2rem", textAlign: "center", border: "1.5px solid #ede6da", marginBottom: "1.25rem" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏦</div>
                    <p style={{ fontFamily: "'Playfair Display', serif", color: "#2d2416", fontSize: "1rem", fontWeight: 700, margin: "0 0 0.5rem" }}>No savings goals set yet</p>
                    <p style={{ fontSize: "0.78rem", color: "#8a7e6e", margin: 0 }}>Go to My Numbers → Savings to add your goals and track progress here.</p>
                  </div>
                ) : (
                  <>
                    {emergencyFundMonthly > 0 && (
                      <SavingsGauge label="Emergency Fund" monthly={emergencyFundMonthly} target={emergencyFundGoal || totalMonthlyExpenses * 4} months={12} color="#4a7fa5" icon="🆘" />
                    )}
                    {retirementMonthly > 0 && (
                      <SavingsGauge label="Retirement" monthly={retirementMonthly} target={retirementGoal || monthlyGross * 0.15 * 12} months={12} color="#3d9e6e" icon="📈" />
                    )}
                    {savingsGoalMonthly > 0 && (
                      <SavingsGauge label={savingsGoalLabel} monthly={savingsGoalMonthly} target={savingsGoalTarget || savingsGoalMonthly * 12} months={12} color="#c8862a" icon="✨" />
                    )}
                  </>
                )}

                <Section title="Savings Benchmarks" icon="🎯" accent="#fdf9f4">
                  {[
                    { label: "Emergency Fund (4 months)", target: totalMonthlyExpenses * 4, current: emergencyFundMonthly, icon: "🆘" },
                    { label: "Additional Retirement Savings", target: monthlyGross * 0.15, current: retirementMonthly, unit: "/mo", icon: "📈" },
                    { label: "Home Maintenance (1%/yr)", target: homePrice * 0.01 / 12, current: maintenance, unit: "/mo", icon: "🔧" },
                  ].map((b) => {
                    const onTrack = b.current >= b.target;
                    return (
                      <div key={b.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px solid #f0ebe2" }}>
                        <div>
                          <div style={{ fontSize: "0.78rem", color: "#2d2416", fontWeight: 500 }}>{b.icon} {b.label}</div>
                          <div style={{ fontSize: "0.65rem", color: "#8a7e6e", marginTop: "0.1rem" }}>Target: {formatCurrency(b.target)}{b.unit || ""}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", fontWeight: 700, color: onTrack ? "#3d9e6e" : "#c8862a" }}>{formatCurrency(b.current)}{b.unit || ""}</span>
                          <span style={{ fontSize: "0.8rem" }}>{onTrack ? "✓" : "·"}</span>
                        </div>
                      </div>
                    );
                  })}
                </Section>

                <div style={{ background: "#2d2416", borderRadius: "14px", padding: "1.25rem" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", color: "#f5ede0", fontWeight: 700, fontSize: "0.9rem", margin: "0 0 0.65rem" }}>💡 Savings Priorities for New Homeowners</p>
                  {[
                    "1st: Build a 3–6 month emergency fund — home repairs can be expensive and unexpected",
                    "2nd: Contribute enough to get any employer 401k match — it's free money",
                    "3rd: Pay down high-interest debt (credit cards) aggressively",
                    "4th: Max out retirement accounts (IRA, 401k) — aim for 15% of income",
                    "5th: Save for specific goals (vacation, car, home projects)",
                  ].map((tip, i) => (
                    <p key={i} style={{ fontSize: "0.75rem", color: "#c8b89a", margin: "0.35rem 0", lineHeight: 1.5 }}>{tip}</p>
                  ))}
                </div>
              </>
            )}

            <button onClick={() => setActiveTab("inputs")}
              style={{ width: "100%", padding: "0.85rem", background: "transparent", color: "#2d2416", border: "1.5px solid #c8b89a", borderRadius: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", marginTop: "1.25rem" }}>
              ← Adjust My Numbers
            </button>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "1.5rem 1rem 2.5rem", borderTop: "1px solid #ede6da", marginTop: "0.5rem" }}>
        <button onClick={() => setDisclaimerAccepted(false)}
          style={{ background: "none", border: "none", fontSize: "0.68rem", color: "#b0a898", cursor: "pointer", textDecoration: "underline", fontFamily: "'DM Sans', sans-serif" }}>
          View Disclaimer
        </button>
        <p style={{ fontSize: "0.65rem", color: "#c8b89a", margin: "0.4rem 0 0", fontFamily: "'DM Mono', monospace" }}>
          For informational purposes only · Not financial advice · © 2026 House Bread
        </p>
      </div>

      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
    </div>
  );
}
