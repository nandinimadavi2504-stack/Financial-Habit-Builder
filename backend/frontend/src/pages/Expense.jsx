import { useEffect, useState } from "react";
import {
  addExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
} from "../services/expenseService";
import "../styles/Expense.css";

function Expense() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");

  const [expenseList, setExpenseList] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await getAllExpenses();
      setExpenseList(data.expenses);
    } catch (error) {
      console.log(error);
      alert("Failed to load expenses.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("");
    setNote("");
    setDate("");

    setEditMode(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        await updateExpense(editId, {
          title,
          amount,
          category,
          note,
          date,
        });

        alert("Expense Updated Successfully");
      } else {
        await addExpense({
          title,
          amount,
          category,
          note,
          date,
        });

        alert("Expense Added Successfully");
      }

      resetForm();
      fetchExpenses();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Unable to save expense.");
    }
  };

  const handleEdit = (expense) => {
    setEditMode(true);
    setEditId(expense._id);

    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
    setNote(expense.note || "");

    if (expense.date) {
      setDate(new Date(expense.date).toISOString().split("T")[0]);
    } else {
      setDate("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await deleteExpense(id);

      alert("Expense Deleted Successfully");

      fetchExpenses();
    } catch (error) {
      console.log(error);
      alert("Unable to delete expense.");
    }
  };

  return (
    <div className="expense-page">
      <h1>💸 Expense Management</h1>

      <div className="expense-card">
        <h2>{editMode ? "Edit Expense" : "Add New Expense"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Expense Title"
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
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
            {editMode ? "✏️ Update Expense" : "➕ Add Expense"}
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
                marginLeft: "10px",
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="expense-list">
        <h2>Expense History</h2>

        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {expenseList.length === 0 ? (
              <tr>
                <td colSpan="5">No Expenses Added Yet.</td>
              </tr>
            ) : (
              expenseList.map((expense) => (
                <tr key={expense._id}>
                  <td>{expense.title}</td>
                  <td>₹ {expense.amount}</td>
                  <td>{expense.category}</td>
                  <td>
                    {expense.date
                      ? new Date(expense.date).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    <button
                      onClick={() => handleEdit(expense)}
                      style={{
                        background: "#2563eb",
                        color: "#fff",
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
                      className="delete-btn"
                      onClick={() => handleDelete(expense._id)}
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

export default Expense;
