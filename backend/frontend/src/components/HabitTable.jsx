function HabitTable({ habits, onEdit, onComplete, onReset, onDelete }) {
  return (
    <div className="habit-table-container">
      <table className="habit-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Frequency</th>
            <th>Status</th>
            <th>Streak</th>
            <th>Reminder</th>
            <th>Progress</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {habits.map((habit) => {
            const progress = Math.min((habit.streak / 30) * 100, 100);

            return (
              <tr key={habit._id}>
                <td>{habit.title}</td>

                <td>{habit.frequency}</td>

                <td>
                  <span
                    className={
                      habit.completed ? "status completed" : "status pending"
                    }
                  >
                    {habit.completed ? "Completed" : "Pending"}
                  </span>
                </td>

                <td>
                  {habit.streak}

                  {habit.streak >= 7 && <span className="badge">🔥</span>}
                </td>

                <td>{habit.reminderEnabled ? habit.reminderTime : "--"}</td>

                <td>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{
                        width: `${progress}%`,
                      }}
                    ></div>
                  </div>
                </td>

                <td className="actions">
                  <button className="edit-btn" onClick={() => onEdit(habit)}>
                    Edit
                  </button>

                  <button
                    className="complete-btn"
                    onClick={() => onComplete(habit._id)}
                  >
                    Complete
                  </button>

                  <button
                    className="reset-btn"
                    onClick={() => onReset(habit._id)}
                  >
                    Reset
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => onDelete(habit._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default HabitTable;
