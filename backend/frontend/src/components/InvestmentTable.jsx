function InvestmentTable({ investments, handleEdit, handleDelete }) {
  if (investments.length === 0) {
    return (
      <div className="no-data">
        <h3>No Investments Found</h3>
        <p>Add your first investment to start tracking your portfolio.</p>
      </div>
    );
  }

  return (
    <table className="investment-table">
      <thead>
        <tr>
          <th>Investment</th>
          <th>Type</th>
          <th>Invested</th>
          <th>Current Value</th>
          <th>Profit / Loss</th>
          <th>ROI</th>
          <th>Date</th>
          <th>Notes</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {investments.map((investment) => {
          const invested = Number(investment.amountInvested || 0);
          const current = Number(investment.currentValue || 0);

          const profit = current - invested;

          const roi =
            invested > 0 ? ((profit / invested) * 100).toFixed(2) : "0.00";

          return (
            <tr key={investment._id}>
              <td>{investment.investmentName}</td>

              <td>{investment.investmentType}</td>

              <td>₹{invested.toLocaleString()}</td>

              <td>₹{current.toLocaleString()}</td>

              <td className={profit >= 0 ? "profit-text" : "loss-text"}>
                ₹{profit.toLocaleString()}
              </td>

              <td className={roi >= 0 ? "roi-positive" : "roi-negative"}>
                {roi}%
              </td>

              <td>
                {investment.investmentDate
                  ? new Date(investment.investmentDate).toLocaleDateString()
                  : "-"}
              </td>

              <td>{investment.notes || "-"}</td>

              <td>
                <div className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(investment)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(investment._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default InvestmentTable;
