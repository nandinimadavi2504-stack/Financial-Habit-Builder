function AssetForm({ formData, handleChange, handleSubmit, editingId }) {
  return (
    <div className="asset-form-card">
      <h2>{editingId ? "Update Asset" : "Add Asset"}</h2>

      <form className="asset-form" onSubmit={handleSubmit}>
        <select
          name="assetType"
          value={formData.assetType}
          onChange={handleChange}
          required
        >
          <option value="Cash">Cash</option>
          <option value="Bank Account">Bank Account</option>
          <option value="Property">Property</option>
          <option value="Vehicle">Vehicle</option>
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
          <option value="Jewellery">Jewellery</option>
          <option value="Electronics">Electronics</option>
          <option value="Land">Land</option>
          <option value="Others">Others</option>
        </select>

        <input
          type="text"
          name="assetName"
          placeholder="Asset Name"
          value={formData.assetName}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="purchaseValue"
          placeholder="Purchase Value"
          value={formData.purchaseValue}
          onChange={handleChange}
          min="0"
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
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
        />

        <button type="submit">
          {editingId ? "Update Asset" : "Add Asset"}
        </button>
      </form>
    </div>
  );
}

export default AssetForm;
