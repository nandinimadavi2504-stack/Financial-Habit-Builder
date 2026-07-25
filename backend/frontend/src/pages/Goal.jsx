import { useEffect, useState } from "react";
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from "../services/goalService";
import "../styles/Goal.css";

function Goal() {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  const [goalList, setGoalList] = useState([]);
  const [updateValues, setUpdateValues] = useState({});

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await getGoals();
      setGoalList(data.goals);
    } catch (error) {
      console.log(error);
      alert("Failed to load goals.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setTargetAmount("");
    setSavedAmount("");
    setDeadline("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createGoal({
        title,
        targetAmount,
        savedAmount,
        deadline,
      });

      alert("Goal Created Successfully");

      resetForm();
      fetchGoals();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Unable to create goal.");
    }
  };

  const handleUpdate = async (goal) => {
    const newAmount = Number(updateValues[goal._id]);

    if (isNaN(newAmount)) {
      alert("Enter a valid amount.");
      return;
    }

    try {
      await updateGoal(goal._id, newAmount);

      alert("Savings Updated Successfully");

      setUpdateValues({
        ...updateValues,
        [goal._id]: "",
      });

      fetchGoals();
    } catch (error) {
      console.log(error);
      alert("Unable to update savings.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this goal?")) return;

    try {
      await deleteGoal(id);

      alert("Goal Deleted Successfully");

      fetchGoals();
    } catch (error) {
      console.log(error);
      alert("Unable to delete goal.");
    }
  };

  return (
    <div className="goal-page">
      <h1>🎯 Savings Goal Tracker</h1>

      <div className="goal-card">
        <h2>Create New Goal</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Goal Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Target Amount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Saved Amount"
            value={savedAmount}
            onChange={(e) => setSavedAmount(e.target.value)}
          />

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button type="submit">🎯 Create Goal</button>
        </form>
      </div>

      <div className="goal-list">
        <h2>My Goals</h2>

        {goalList.length === 0 ? (
          <p>No Goals Added Yet.</p>
        ) : (
          goalList.map((goal) => {
            const progress = Math.min(
              ((goal.savedAmount / goal.targetAmount) * 100).toFixed(1),
              100,
            );

            const completed = goal.savedAmount >= goal.targetAmount;

            return (
              <div className="goal-item" key={goal._id}>
                <h3>{goal.title}</h3>

                {completed && (
                  <span className="goal-badge">🏆 Goal Achieved</span>
                )}

                <p>
                  <strong>Target:</strong> ₹{goal.targetAmount}
                </p>

                <p>
                  <strong>Saved:</strong> ₹{goal.savedAmount}
                </p>

                <p>
                  <strong>Deadline:</strong>{" "}
                  {goal.deadline
                    ? new Date(goal.deadline).toLocaleDateString()
                    : "-"}
                </p>

                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{
                      width: `${progress}%`,
                    }}
                  ></div>
                </div>

                <p>{progress}% Completed</p>

                <input
                  type="number"
                  placeholder="Enter new saved amount"
                  value={updateValues[goal._id] || ""}
                  onChange={(e) =>
                    setUpdateValues({
                      ...updateValues,
                      [goal._id]: e.target.value,
                    })
                  }
                />

                <button
                  className="update-btn"
                  onClick={() => handleUpdate(goal)}
                >
                  💰 Update Savings
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(goal._id)}
                >
                  🗑 Delete
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Goal;
