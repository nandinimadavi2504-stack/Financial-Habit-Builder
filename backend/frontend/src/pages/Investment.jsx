import React, { useEffect, useState } from "react";
import {
  getInvestments,
  addInvestment,
  updateInvestment,
  deleteInvestment,
} from "../services/investmentService";
import "../styles/Investment.css";

const Investment = () => {
  const [investments, setInvestments] = useState([]);

  const [formData, setFormData] = useState({
    investmentType: "Savings",
    amountInvested: "",
    currentValue: "",
    investmentDate: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await getInvestments();

      if (response.success) {
        setInvestments(response.investments || []);
      } else {
        setInvestments([]);
      }
    } catch (error) {
      console.error(error);
      setInvestments([]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      investmentType: "Savings",
      amountInvested: "",
      currentValue: "",
      investmentDate: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateInvestment(editingId, formData);
        alert("Investment Updated Successfully");
      } else {
        await addInvestment(formData);
        alert("Investment Added Successfully");
      }

      resetForm();
      fetchInvestments();
    } catch (err) {
      console.error(err);
      alert("Operation Failed");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      investmentType: item.investmentType,
      amountInvested: item.amountInvested,
      currentValue: item.currentValue,
      investmentDate: item.investmentDate
        ? item.investmentDate.substring(0, 10)
        : "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this investment?")) return;

    try {
      await deleteInvestment(id);
      fetchInvestments();
    } catch (err) {
      console.error(err);
    }
  };

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
    <div className="investment-container">
      <h1>📈 Wealth Growth Tracker</h1>

      <div className="investment-summary">
        <div className="summary-card">
          <h3>Total Invested</h3>
          <p>₹ {totalInvested}</p>
        </div>

        <div className="summary-card">
          <h3>Current Value</h3>
          <p>₹ {totalCurrent}</p>
        </div>

        <div className="summary-card">
          <h3>Profit / Loss</h3>
          <p className={totalProfit >= 0 ? "profit-text" : "loss-text"}>
            ₹ {totalProfit}
          </p>
        </div>
      </div>

      <form className="investment-form" onSubmit={handleSubmit}>
        <select
          name="investmentType"
          value={formData.investmentType}
          onChange={handleChange}
        >
          <option>Savings</option>
          <option>FD</option>
          <option>Mutual Fund</option>
          <option>Stocks</option>
          <option>Gold</option>
          <option>Crypto</option>
          <option>PPF</option>
          <option>Others</option>
        </select>

        <input
          type="number"
          name="amountInvested"
          placeholder="Amount Invested"
          value={formData.amountInvested}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="currentValue"
          placeholder="Current Value"
          value={formData.currentValue}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="investmentDate"
          value={formData.investmentDate}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Update Investment" : "Add Investment"}
        </button>
      </form>

      <table className="investment-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Invested</th>
            <th>Current</th>
            <th>Profit/Loss</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {investments.length === 0 ? (
            <tr>
              <td colSpan="6">No Investments Found</td>
            </tr>
          ) : (
            investments.map((item) => {
              const profit =
                Number(item.currentValue) - Number(item.amountInvested);

              return (
                <tr key={item._id}>
                  <td>{item.investmentType}</td>
                  <td>₹ {item.amountInvested}</td>
                  <td>₹ {item.currentValue}</td>

                  <td className={profit >= 0 ? "profit-text" : "loss-text"}>
                    ₹ {profit}
                  </td>

                  <td>
                    {item.investmentDate
                      ? item.investmentDate.substring(0, 10)
                      : ""}
                  </td>

                  <td>
                    <button
                      className="edit-btn"
                      type="button"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      type="button"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Investment;
