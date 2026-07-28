import { useEffect, useMemo, useState } from "react";
import {
  getHabits,
  createHabit,
  updateHabit,
  completeHabit,
  resetHabit,
  deleteHabit,
} from "../services/habitService";

import HabitForm from "../components/HabitForm";
import HabitSummaryCards from "../components/HabitSummaryCards";
import HabitTable from "../components/HabitTable";
import HabitChart from "../components/HabitChart";

import "../styles/Habit.css";

function Habit() {
  const [habits, setHabits] = useState([]);
  const [filteredHabits, setFilteredHabits] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState("All");

  const [editingHabit, setEditingHabit] = useState(null);

  // ===============================
  // Load Habits
  // ===============================
  const loadHabits = async () => {
    try {
      setLoading(true);

      const data = await getHabits();

      const list = data.habits || [];

      setHabits(list);
      setFilteredHabits(list);

      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load habits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  // ===============================
  // Search + Filter
  // ===============================
  useEffect(() => {
    let temp = [...habits];

    if (search.trim()) {
      temp = temp.filter((habit) =>
        habit.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (frequencyFilter !== "All") {
      temp = temp.filter((habit) => habit.frequency === frequencyFilter);
    }

    setFilteredHabits(temp);
  }, [search, frequencyFilter, habits]);

  // ===============================
  // Summary
  // ===============================
  const summary = useMemo(() => {
    const total = habits.length;

    const completed = habits.filter((habit) => habit.completed).length;

    const pending = total - completed;

    const longestStreak =
      habits.length > 0 ? Math.max(...habits.map((h) => h.streak || 0)) : 0;

    return {
      total,
      completed,
      pending,
      longestStreak,
    };
  }, [habits]);

  // ===============================
  // Add / Update Habit
  // ===============================
  const handleSubmit = async (habitData) => {
    try {
      if (editingHabit) {
        await updateHabit(editingHabit._id, habitData);
        alert("Habit updated successfully.");
      } else {
        await createHabit(habitData);
        alert("Habit created successfully.");
      }

      setEditingHabit(null);
      loadHabits();
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Unable to save habit.");
    }
  };

  // ===============================
  // Edit Habit
  // ===============================
  const handleEdit = (habit) => {
    setEditingHabit(habit);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===============================
  // Complete Habit
  // ===============================
  const handleComplete = async (id) => {
    try {
      await completeHabit(id);
      loadHabits();
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Unable to complete habit.");
    }
  };

  // ===============================
  // Reset Habit
  // ===============================
  const handleReset = async (id) => {
    try {
      await resetHabit(id);
      loadHabits();
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Unable to reset habit.");
    }
  };

  // ===============================
  // Delete Habit
  // ===============================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this habit?",
    );

    if (!confirmDelete) return;

    try {
      await deleteHabit(id);
      loadHabits();
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Unable to delete habit.");
    }
  };

  // ===============================
  // Loading State
  // ===============================
  if (loading) {
    return (
      <div className="habit-page">
        <div className="loading">
          <h2>Loading habits...</h2>
        </div>
      </div>
    );
  }

  // ===============================
  // Error State
  // ===============================
  if (error) {
    return (
      <div className="habit-page">
        <div className="error-box">
          <h2>{error}</h2>

          <button className="primary-btn" onClick={loadHabits}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div className="habit-page">
      <div className="habit-header">
        <h1>Financial Habit Tracker</h1>

        <p>
          Build strong financial habits and improve your consistency every day.
        </p>
      </div>

      <HabitSummaryCards
        total={summary.total}
        completed={summary.completed}
        pending={summary.pending}
        longestStreak={summary.longestStreak}
      />

      <HabitForm
        onSubmit={handleSubmit}
        editingHabit={editingHabit}
        cancelEdit={() => setEditingHabit(null)}
      />

      <HabitChart habits={filteredHabits} />

      <div className="habit-toolbar">
        <input
          type="text"
          placeholder="Search habits..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={frequencyFilter}
          onChange={(e) => setFrequencyFilter(e.target.value)}
        >
          <option value="All">All Frequencies</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>

      {filteredHabits.length === 0 ? (
        <div className="empty-state">
          <h2>No Habits Found</h2>

          <p>Start building better financial habits today.</p>
        </div>
      ) : (
        <HabitTable
          habits={filteredHabits}
          onEdit={handleEdit}
          onComplete={handleComplete}
          onReset={handleReset}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default Habit;
