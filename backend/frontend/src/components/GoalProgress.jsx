import React from "react";

function GoalProgress({ goals = [] }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        marginTop: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Savings Goals</h2>

      {goals.length === 0 ? (
        <p>No savings goals available.</p>
      ) : (
        goals.map((goal) => {
          const saved = Number(goal.savedAmount || 0);
          const target = Number(goal.targetAmount || goal.target || 0);

          const progress =
            target > 0 ? Math.min((saved / target) * 100, 100) : 0;

          return (
            <div
              key={goal._id}
              style={{
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <strong>{goal.goalName || goal.name}</strong>

                <span>
                  ₹{saved.toLocaleString()} / ₹{target.toLocaleString()}
                </span>
              </div>

              <div
                style={{
                  width: "100%",
                  background: "#e5e7eb",
                  height: "12px",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "12px",
                    background: "#16a34a",
                    borderRadius: "8px",
                    transition: "0.4s",
                  }}
                />
              </div>

              <p
                style={{
                  marginTop: "6px",
                  color: "#555",
                }}
              >
                {progress.toFixed(1)}% Completed
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}

export default GoalProgress;
