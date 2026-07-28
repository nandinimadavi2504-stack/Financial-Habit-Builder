import { useEffect, useState } from "react";
import {
  createGoal,
  getGoals,
  updateSavings,
  deleteGoal,
} from "../services/goalService";

import GoalForm from "../components/GoalForm";
import GoalTable from "../components/GoalTable";
import GoalSummaryCards from "../components/GoalSummaryCards";

import "../styles/Goal.css";

function Goal() {
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    savedAmount: "",
    deadline: "",
    note: "",
  });

  const [goalList, setGoalList] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);

  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [updateValues, setUpdateValues] = useState({});

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    const filtered = goalList.filter((goal) =>
      goal.title.toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredGoals(filtered);
  }, [search, goalList]);

  const loadGoals = async () => {
    try {
      setLoading(true);

      const response = await getGoals();

      setGoalList(response.goals || []);
    } catch (error) {
      console.error(error);
      alert("Unable to load goals.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      targetAmount: "",
      savedAmount: "",
      deadline: "",
      note: "",
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await createGoal(formData);

      resetForm();
      loadGoals();

      alert("Goal created successfully.");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to create goal.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSavings = async (goalId) => {
    try {
      const amount = Number(updateValues[goalId]);

      if (Number.isNaN(amount)) {
        alert("Please enter a valid amount.");
        return;
      }

      await updateSavings(goalId, amount);

      setUpdateValues((prev) => ({
        ...prev,
        [goalId]: "",
      }));

      loadGoals();
    } catch (error) {
      console.error(error);
      alert("Unable to update savings.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this goal?")) return;

    try {
      await deleteGoal(id);
      loadGoals();
    } catch (error) {
      console.error(error);
      alert("Unable to delete goal.");
    }
  };

  if (loading) {
    return (
      <div className="goal-page">
        <h2>Loading goals...</h2>
      </div>
    );
  }

  return (
    <div className="goal-page">
      <h1>Savings Goal Tracker</h1>

      <GoalSummaryCards goalList={goalList} />

      <GoalForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        saving={saving}
      />

      <GoalTable
        goalList={filteredGoals}
        search={search}
        setSearch={setSearch}
        updateValues={updateValues}
        setUpdateValues={setUpdateValues}
        handleUpdateSavings={handleUpdateSavings}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default Goal;
