import "./HabitSummaryCards.css";

function HabitSummaryCards({ total, completed, pending, longestStreak }) {
  return (
    <div className="habit-summary">
      <div className="summary-card">
        <h3>Total Habits</h3>
        <h2>{total}</h2>
      </div>

      <div className="summary-card">
        <h3>Completed</h3>
        <h2>{completed}</h2>
      </div>

      <div className="summary-card">
        <h3>Pending</h3>
        <h2>{pending}</h2>
      </div>

      <div className="summary-card">
        <h3>Longest Streak</h3>
        <h2>{longestStreak}</h2>
      </div>
    </div>
  );
}

export default HabitSummaryCards;
