import GoalProgressBar from "./GoalProgressBar";

function GoalTable({
  goalList,
  search,
  setSearch,
  updateValues,
  setUpdateValues,
  handleUpdateSavings,
  handleDelete,
}) {
  return (
    <div className="goal-list">
      <h2>My Goals</h2>

      <input
        type="text"
        placeholder="Search goals..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {goalList.length === 0 ? (
        <p>No Goals Found.</p>
      ) : (
        goalList.map((goal) => {
          const completed = goal.status === "Completed";

          return (
            <div className="goal-item" key={goal._id}>
              <div className="goal-header">
                <h3>{goal.title}</h3>

                {completed && <span className="goal-badge">Goal Achieved</span>}
              </div>

              <p>
                <strong>Target:</strong> ₹
                {Number(goal.targetAmount).toLocaleString()}
              </p>

              <p>
                <strong>Saved:</strong> ₹
                {Number(goal.savedAmount).toLocaleString()}
              </p>

              <p>
                <strong>Deadline:</strong>{" "}
                {goal.deadline
                  ? new Date(goal.deadline).toLocaleDateString()
                  : "-"}
              </p>

              <GoalProgressBar
                savedAmount={goal.savedAmount}
                targetAmount={goal.targetAmount}
              />

              <div className="goal-actions">
                <input
                  type="number"
                  placeholder="Update savings"
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
                  onClick={() => handleUpdateSavings(goal._id)}
                >
                  Update
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(goal._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default GoalTable;
