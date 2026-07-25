import React from "react";
import "./DashboardCards.css";

function DashboardCards({
  totalIncome,
  totalExpense,
  currentBalance,
  totalInvestments,
}) {
  const cards = [
    {
      title: "Total Income",
      value: `₹${totalIncome.toLocaleString()}`,
      className: "income-card",
    },
    {
      title: "Total Expense",
      value: `₹${totalExpense.toLocaleString()}`,
      className: "expense-card",
    },
    {
      title: "Current Balance",
      value: `₹${currentBalance.toLocaleString()}`,
      className: "balance-card",
    },
    {
      title: "Total Investments",
      value: `₹${totalInvestments.toLocaleString()}`,
      className: "investment-card",
    },
  ];

  return (
    <div className="dashboard-cards">
      {cards.map((card) => (
        <div key={card.title} className={`dashboard-card ${card.className}`}>
          <h4>{card.title}</h4>
          <h2>{card.value}</h2>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;
