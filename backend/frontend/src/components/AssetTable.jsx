function AssetTable({ assets, handleEdit, handleDelete }) {
  if (assets.length === 0) {
    return (
      <div className="no-data">
        <h3>No Assets Found</h3>
        <p>Add your first asset to start tracking your wealth.</p>
      </div>
    );
  }

  return (
    <table className="asset-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Purchase Value</th>
          <th>Current Value</th>
          <th>Profit/Loss</th>
          <th>Date</th>
          <th>Notes</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {assets.map((asset) => {
          const profit =
            Number(asset.currentValue) - Number(asset.purchaseValue);

          return (
            <tr key={asset._id}>
              <td>{asset.assetName}</td>
              <td>{asset.assetType}</td>

              <td>₹{Number(asset.purchaseValue).toLocaleString()}</td>

              <td>₹{Number(asset.currentValue).toLocaleString()}</td>

              <td className={profit >= 0 ? "profit-text" : "loss-text"}>
                ₹{profit.toLocaleString()}
              </td>

              <td>
                {asset.purchaseDate
                  ? new Date(asset.purchaseDate).toLocaleDateString()
                  : "-"}
              </td>

              <td>{asset.notes || "-"}</td>

              <td>
                <div className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(asset)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(asset._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default AssetTable;
