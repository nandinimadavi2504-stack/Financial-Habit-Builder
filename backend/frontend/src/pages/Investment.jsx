import { useEffect, useState } from "react";
import {
  getInvestments,
  addInvestment,
  updateInvestment,
  deleteInvestment,
} from "../services/investmentService";

import InvestmentForm from "../components/InvestmentForm";
import InvestmentTable from "../components/InvestmentTable";
import InvestmentSummaryCards from "../components/InvestmentSummaryCards";

import "../styles/Investment.css";

function Investment() {
  const [investments, setInvestments] = useState([]);

  const [formData, setFormData] = useState({
    investmentType: "Savings",
    investmentName: "",
    amountInvested: "",
    currentValue: "",
    investmentDate: "",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvestments();
  }, []);

  const loadInvestments = async () => {
    try {
      setLoading(true);

      const response = await getInvestments();

      setInvestments(response.investments || []);
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
      investmentType: "Savings",
      investmentName: "",
      amountInvested: "",
      currentValue: "",
      investmentDate: "",
      notes: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateInvestment(editingId, formData);
      } else {
        await addInvestment(formData);
      }

      resetForm();
      loadInvestments();
    } catch (error) {
      console.error(error);
      alert("Unable to save investment.");
    }
  };

  const handleEdit = (investment) => {
    setEditingId(investment._id);

    setFormData({
      investmentType: investment.investmentType,
      investmentName: investment.investmentName,
      amountInvested: investment.amountInvested,
      currentValue: investment.currentValue,
      investmentDate: investment.investmentDate?.substring(0, 10) || "",
      notes: investment.notes || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this investment?")) return;

    try {
      await deleteInvestment(id);
      loadInvestments();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <h2>Loading Investments...</h2>;
  }

  return (
    <div className="investment-container">
      <h1>Investment Portfolio</h1>

      <InvestmentSummaryCards investments={investments} />

      <InvestmentForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        editingId={editingId}
      />

      <InvestmentTable
        investments={investments}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default Investment;
