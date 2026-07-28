function GoalProgressBar({ savedAmount, targetAmount }) {
  const saved = Number(savedAmount || 0);
  const target = Number(targetAmount || 0);

  const progress = target > 0 ? Math.min((saved / target) * 100, 100) : 0;

  return (
    <div className="goal-progress-container">
      <div className="goal-progress-bar">
        <div className="goal-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <p className="goal-progress-text">{progress.toFixed(1)}% Completed</p>
    </div>
  );
}

export default GoalProgressBar;
