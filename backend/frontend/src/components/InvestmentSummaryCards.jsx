function InvestmentSummaryCards({ investments }) {
  const totalInvested = investments.reduce(
    (sum, item) => sum + Number(item.amountInvested || 0),
    0,
  );

  const totalCurrent = investments.reduce(
    (sum, item) => sum + Number(item.currentValue || 0),
    0,
  );

  const totalProfit = totalCurrent - totalInvested;

  return (
    <div className="investment-summary">
      <div className="summary-card">
        <h3>Total Invested</h3>
        <p>₹{totalInvested.toLocaleString()}</p>
      </div>

      <div className="summary-card">
        <h3>Current Value</h3>
        <p>₹{totalCurrent.toLocaleString()}</p>
      </div>

      <div className="summary-card">
        <h3>Profit / Loss</h3>
        <p className={totalProfit >= 0 ? "profit-text" : "loss-text"}>
          ₹{totalProfit.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default InvestmentSummaryCards;
