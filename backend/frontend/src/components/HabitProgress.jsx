import React from "react";

function HabitProgress({ habits = [] }) {
  const totalHabits = habits.length;

  const completedHabits = habits.filter(
    (habit) => habit.completed === true,
  ).length;

  const progress = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

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
      <h2 style={{ marginBottom: "20px" }}>Habit Progress</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <span>Total Habits</span>
        <strong>{totalHabits}</strong>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <span>Completed Habits</span>
        <strong>{completedHabits}</strong>
      </div>

      <div
        style={{
          width: "100%",
          background: "#e5e7eb",
          height: "14px",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "14px",
            background: "#2563eb",
            borderRadius: "8px",
            transition: "0.4s",
          }}
        />
      </div>

      <p
        style={{
          marginTop: "10px",
          color: "#555",
        }}
      >
        {progress.toFixed(1)}% Completed
      </p>
    </div>
  );
}

export default HabitProgress;
