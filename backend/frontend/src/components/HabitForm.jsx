import { useEffect, useState } from "react";

function HabitForm({ onSubmit, editingHabit, cancelEdit }) {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("");

  // ===============================
  // Load Data When Editing
  // ===============================
  useEffect(() => {
    if (editingHabit) {
      setTitle(editingHabit.title || "");
      setFrequency(editingHabit.frequency || "Daily");
      setReminderEnabled(editingHabit.reminderEnabled || false);
      setReminderTime(editingHabit.reminderTime || "");
    } else {
      resetForm();
    }
  }, [editingHabit]);

  // ===============================
  // Reset Form
  // ===============================
  const resetForm = () => {
    setTitle("");
    setFrequency("Daily");
    setReminderEnabled(false);
    setReminderTime("");
  };

  // ===============================
  // Submit
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a habit title.");
      return;
    }

    await onSubmit({
      title: title.trim(),
      frequency,
      reminderEnabled,
      reminderTime,
    });

    if (!editingHabit) {
      resetForm();
    }
  };

  return (
    <div className="habit-form-card">
      <h2>{editingHabit ? "Edit Habit" : "Add New Habit"}</h2>

      <form className="habit-form" onSubmit={handleSubmit}>
        {/* Habit Title */}

        <div className="form-group">
          <label>Habit Title</label>

          <input
            type="text"
            placeholder="Example: Save ₹100 every day"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Frequency */}

        <div className="form-group">
          <label>Frequency</label>

          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="Daily">Daily</option>

            <option value="Weekly">Weekly</option>

            <option value="Monthly">Monthly</option>
          </select>
        </div>

        {/* Reminder */}

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
            />
            Enable Reminder
          </label>
        </div>

        {/* Reminder Time */}

        {reminderEnabled && (
          <div className="form-group">
            <label>Reminder Time</label>

            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>
        )}

        {/* Buttons */}

        <div className="form-buttons">
          <button type="submit" className="save-btn">
            {editingHabit ? "Update Habit" : "Add Habit"}
          </button>

          {editingHabit && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                cancelEdit();
                resetForm();
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default HabitForm;
