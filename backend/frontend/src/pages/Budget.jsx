import { useState } from "react";
import { createBudget, getBudgetStatus } from "../services/budgetService";
import "../styles/Budget.css";

function Budget() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [amount, setAmount] = useState("");

  const [budgetData, setBudgetData] = useState(null);

  const handleCreateBudget = async (e) => {
    e.preventDefault();

    try {
      await createBudget({
        month,
        year,
        amount,
      });

      alert("Budget Created Successfully!");

      setMonth("");
      setYear(new Date().getFullYear());
      setAmount("");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Unable to create budget.");
    }
  };

  const handleCheckBudget = async () => {
    if (!month) {
      alert("Please select a month.");
      return;
    }

    try {
      const data = await getBudgetStatus(month, year);
      setBudgetData(data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Budget not found.");
    }
  };

  return (
    <div className="budget-page">
      <h1>💰 Monthly Budget Manager</h1>

      <div className="budget-card">
        <h2>Create Budget</h2>

        <form onSubmit={handleCreateBudget}>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          >
            <option value="">Select Month</option>

            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>

          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Budget Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <button type="submit">💰 Create Budget</button>
        </form>

        <button className="check-btn" onClick={handleCheckBudget}>
          📊 Check Budget Status
        </button>
      </div>

      {budgetData && (
        <div className="budget-status">
          <h2>Budget Summary</h2>

          <p>
            <strong>Budget:</strong> ₹{budgetData.budget}
          </p>

          <p>
            <strong>Total Expense:</strong> ₹{budgetData.totalExpense}
          </p>

          <p>
            <strong>Remaining:</strong> ₹{budgetData.remaining}
          </p>

          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width: budgetData.percentage,
              }}
            ></div>
          </div>

          <p>{budgetData.percentage} Used</p>

          <h3>{budgetData.status}</h3>
        </div>
      )}
    </div>
  );
}

export default Budget;
