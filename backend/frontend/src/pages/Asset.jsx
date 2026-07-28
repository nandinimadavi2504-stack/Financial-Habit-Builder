import { useEffect, useState } from "react";

import {
  getAssets,
  addAsset,
  updateAsset,
  deleteAsset,
} from "../services/assetService";

import AssetForm from "../components/AssetForm";
import AssetSummaryCards from "../components/AssetSummaryCards";
import AssetTable from "../components/AssetTable";
import AssetChart from "../components/AssetChart";

import "../styles/Asset.css";

function Asset() {
  const [assets, setAssets] = useState([]);

  const [formData, setFormData] = useState({
    assetType: "Cash",
    assetName: "",
    purchaseValue: "",
    currentValue: "",
    purchaseDate: "",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);

      const response = await getAssets();

      setAssets(response.assets || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      assetType: "Cash",
      assetName: "",
      purchaseValue: "",
      currentValue: "",
      purchaseDate: "",
      notes: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateAsset(editingId, formData);
      } else {
        await addAsset(formData);
      }

      resetForm();
      loadAssets();
    } catch (error) {
      console.error(error);
      alert("Unable to save asset.");
    }
  };

  const handleEdit = (asset) => {
    setEditingId(asset._id);

    setFormData({
      assetType: asset.assetType,
      assetName: asset.assetName,
      purchaseValue: asset.purchaseValue,
      currentValue: asset.currentValue,
      purchaseDate: asset.purchaseDate?.substring(0, 10) || "",
      notes: asset.notes || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this asset?")) return;

    try {
      await deleteAsset(id);
      loadAssets();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <h2>Loading Assets...</h2>;
  }

  return (
    <div className="asset-container">
      <h1>Asset Management</h1>

      <AssetSummaryCards assets={assets} />

      <AssetChart assets={assets} />

      <AssetForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        editingId={editingId}
      />

      <AssetTable
        assets={assets}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default Asset;
