function GoalSummaryCards({ goalList }) {
  const totalGoals = goalList.length;

  const activeGoals = goalList.filter(
    (goal) => goal.status === "Active",
  ).length;

  const completedGoals = goalList.filter(
    (goal) => goal.status === "Completed",
  ).length;

  const totalTarget = goalList.reduce(
    (sum, goal) => sum + Number(goal.targetAmount || 0),
    0,
  );

  const totalSaved = goalList.reduce(
    (sum, goal) => sum + Number(goal.savedAmount || 0),
    0,
  );

  const overallProgress =
    totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0;

  return (
    <div className="goal-summary">
      <div className="summary-card">
        <h3>Total Goals</h3>
        <p>{totalGoals}</p>
      </div>

      <div className="summary-card">
        <h3>Active Goals</h3>
        <p>{activeGoals}</p>
      </div>

      <div className="summary-card">
        <h3>Completed Goals</h3>
        <p>{completedGoals}</p>
      </div>

      <div className="summary-card">
        <h3>Total Target</h3>
        <p>₹{totalTarget.toLocaleString()}</p>
      </div>

      <div className="summary-card">
        <h3>Total Saved</h3>
        <p>₹{totalSaved.toLocaleString()}</p>
      </div>

      <div className="summary-card">
        <h3>Overall Progress</h3>
        <p>{overallProgress}%</p>
      </div>
    </div>
  );
}

export default GoalSummaryCards;
