function GoalForm({ formData, handleChange, handleSubmit, saving }) {
  return (
    <div className="goal-card">
      <h2>Create New Goal</h2>

      <form onSubmit={handleSubmit} className="goal-form">
        <input
          type="text"
          name="title"
          placeholder="Goal Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="targetAmount"
          placeholder="Target Amount"
          value={formData.targetAmount}
          onChange={handleChange}
          min="1"
          required
        />

        <input
          type="number"
          name="savedAmount"
          placeholder="Saved Amount"
          value={formData.savedAmount}
          onChange={handleChange}
          min="0"
        />

        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
        />

        <textarea
          name="note"
          placeholder="Description (Optional)"
          value={formData.note}
          onChange={handleChange}
          rows={4}
        />

        <button type="submit" disabled={saving}>
          {saving ? "Creating..." : "Create Goal"}
        </button>
      </form>
    </div>
  );
}

export default GoalForm;
