function InvestmentForm({ formData, handleChange, handleSubmit, editingId }) {
  return (
    <div className="investment-form-card">
      <h2>{editingId ? "Update Investment" : "Add Investment"}</h2>

      <form className="investment-form" onSubmit={handleSubmit}>
        <select
          name="investmentType"
          value={formData.investmentType}
          onChange={handleChange}
          required
        >
          <option value="Savings">Savings</option>
          <option value="FD">Fixed Deposit</option>
          <option value="Mutual Fund">Mutual Fund</option>
          <option value="Stocks">Stocks</option>
          <option value="Gold">Gold</option>
          <option value="Crypto">Crypto</option>
          <option value="PPF">PPF</option>
          <option value="Others">Others</option>
        </select>

        <input
          type="text"
          name="investmentName"
          placeholder="Investment Name"
          value={formData.investmentName}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="amountInvested"
          placeholder="Amount Invested"
          value={formData.amountInvested}
          onChange={handleChange}
          min="0"
          required
        />

        <input
          type="number"
          name="currentValue"
          placeholder="Current Value"
          value={formData.currentValue}
          onChange={handleChange}
          min="0"
          required
        />

        <input
          type="date"
          name="investmentDate"
          value={formData.investmentDate}
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="Notes (Optional)"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
        />

        <button type="submit">
          {editingId ? "Update Investment" : "Add Investment"}
        </button>
      </form>
    </div>
  );
}

export default InvestmentForm;
