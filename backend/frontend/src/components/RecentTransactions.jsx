import React from "react";

function RecentTransactions({ incomes = [], expenses = [] }) {
  const transactions = [
    ...incomes.map((item) => ({
      ...item,
      type: "Income",
    })),
    ...expenses.map((item) => ({
      ...item,
      type: "Expense",
    })),
  ];

  transactions.sort(
    (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date),
  );

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "30px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Recent Transactions</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={headerStyle}>Type</th>
            <th style={headerStyle}>Title</th>
            <th style={headerStyle}>Category</th>
            <th style={headerStyle}>Amount</th>
            <th style={headerStyle}>Date</th>
          </tr>
        </thead>

        <tbody>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((item) => (
              <tr key={item._id}>
                <td style={cellStyle}>{item.type}</td>

                <td style={cellStyle}>{item.title || item.source || "-"}</td>

                <td style={cellStyle}>{item.category || "-"}</td>

                <td
                  style={{
                    ...cellStyle,
                    color: item.type === "Income" ? "#16a34a" : "#dc2626",
                    fontWeight: "600",
                  }}
                >
                  ₹{Number(item.amount).toLocaleString()}
                </td>

                <td style={cellStyle}>
                  {new Date(item.createdAt || item.date).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                style={{
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const headerStyle = {
  padding: "12px",
  background: "#f3f4f6",
  textAlign: "left",
};

const cellStyle = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
};

export default RecentTransactions;
