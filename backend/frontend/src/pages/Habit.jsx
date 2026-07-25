import { useEffect, useState } from "react";
import {
  getHabits,
  createHabit,
  completeHabit,
  resetHabit,
  deleteHabit,
} from "../services/habitService";
import "../styles/Habit.css";

function Habit() {
  const [habits, setHabits] = useState([]);

  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("Daily");

  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("");

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const data = await getHabits();
      setHabits(data.habits);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createHabit({
        title,
        frequency,
        reminderEnabled,
        reminderTime,
      });

      setTitle("");
      setFrequency("Daily");
      setReminderEnabled(false);
      setReminderTime("");

      loadHabits();

      alert("Habit created successfully!");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Unable to create habit.");
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeHabit(id);
      loadHabits();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = async (id) => {
    try {
      await resetHabit(id);
      loadHabits();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this habit?")) return;

    try {
      await deleteHabit(id);
      loadHabits();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="habit-page">
      <h1>Financial Habit Tracker</h1>

      <div className="habit-card">
        <h2>Add New Habit</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Habit Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>

          <div
            style={{
              marginTop: "15px",
              marginBottom: "10px",
            }}
          >
            <label>
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
              />
              Enable Reminder
            </label>
          </div>

          {reminderEnabled && (
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          )}

          <button type="submit">Add Habit</button>
        </form>
      </div>

      <div className="habit-list">
        {habits.length === 0 ? (
          <p>No habits added yet.</p>
        ) : (
          habits.map((habit) => {
            const progress = Math.min(habit.streak * 10, 100);

            return (
              <div className="habit-item" key={habit._id}>
                <h3>{habit.title}</h3>

                <p>
                  <strong>Frequency:</strong> {habit.frequency}
                </p>

                {habit.reminderEnabled && (
                  <p>
                    <strong>Reminder:</strong> {habit.reminderTime}
                  </p>
                )}

                <p>
                  <strong>Status:</strong>{" "}
                  {habit.completed ? "Completed" : "Pending"}
                </p>

                <p>
                  <strong>Streak:</strong> {habit.streak} day(s)
                </p>

                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{
                      width: `${progress}%`,
                    }}
                  ></div>
                </div>

                {habit.streak >= 7 && (
                  <div className="habit-badge">Great Consistency!</div>
                )}

                <button
                  className="complete-btn"
                  onClick={() => handleComplete(habit._id)}
                >
                  Complete
                </button>

                <button
                  className="reset-btn"
                  onClick={() => handleReset(habit._id)}
                >
                  Reset
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(habit._id)}
                >
                  Delete
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Habit;
