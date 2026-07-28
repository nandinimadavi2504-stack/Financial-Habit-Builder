function AssetSummaryCards({ assets }) {
  const totalPurchase = assets.reduce(
    (sum, asset) => sum + Number(asset.purchaseValue || 0),
    0,
  );

  const totalCurrent = assets.reduce(
    (sum, asset) => sum + Number(asset.currentValue || 0),
    0,
  );

  const totalProfit = totalCurrent - totalPurchase;

  return (
    <div className="asset-summary">
      <div className="summary-card">
        <h3>Total Purchase Value</h3>
        <p>₹{totalPurchase.toLocaleString()}</p>
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

export default AssetSummaryCards;
