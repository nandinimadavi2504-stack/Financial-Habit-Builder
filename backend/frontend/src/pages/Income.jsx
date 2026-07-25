import { useEffect, useState } from "react";
import {
  addIncome,
  getAllIncome,
  updateIncome,
  deleteIncome,
} from "../services/incomeService";
import "../styles/Income.css";

function Income() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");

  const [incomeList, setIncomeList] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    try {
      const data = await getAllIncome();
      setIncomeList(data.income);
    } catch (error) {
      console.log(error);
      alert("Failed to load income.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setSource("");
    setNote("");
    setDate("");

    setEditMode(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        await updateIncome(editId, {
          title,
          amount,
          source,
          note,
          date,
        });

        alert("Income Updated Successfully");
      } else {
        await addIncome({
          title,
          amount,
          source,
          note,
          date,
        });

        alert("Income Added Successfully");
      }

      resetForm();
      fetchIncome();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Unable to save income.");
    }
  };

  const handleEdit = (income) => {
    setEditMode(true);
    setEditId(income._id);

    setTitle(income.title);
    setAmount(income.amount);
    setSource(income.source);
    setNote(income.note || "");

    if (income.date) {
      setDate(new Date(income.date).toISOString().split("T")[0]);
    } else {
      setDate("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this income?")) return;

    try {
      await deleteIncome(id);

      alert("Income Deleted Successfully");

      fetchIncome();
    } catch (error) {
      console.log(error);
      alert("Unable to delete income.");
    }
  };

  return (
    <div className="income-page">
      <h1>💰 Income Management</h1>

      <div className="income-card">
        <h2>{editMode ? "Edit Income" : "Add New Income"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Income Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button type="submit">
            {editMode ? "✏️ Update Income" : "➕ Add Income"}
          </button>

          {editMode && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                background: "#6b7280",
                color: "#fff",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="income-list">
        <h2>Income History</h2>

        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Source</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {incomeList.length === 0 ? (
              <tr>
                <td colSpan="5">No Income Added Yet.</td>
              </tr>
            ) : (
              incomeList.map((income) => (
                <tr key={income._id}>
                  <td>{income.title}</td>
                  <td>₹ {income.amount}</td>
                  <td>{income.source}</td>
                  <td>
                    {income.date
                      ? new Date(income.date).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    <button
                      onClick={() => handleEdit(income)}
                      style={{
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        marginRight: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(income._id)}
                      style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Income;
