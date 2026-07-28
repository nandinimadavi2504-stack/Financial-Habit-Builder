import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/profileService";
import "../styles/Profile.css";

function Profile() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    occupation: "",
    monthlyIncome: 0,
    savingTarget: 0,
    investmentType: "Savings",
    address: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();

      const profile = data.profile;

      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        occupation: profile.occupation || "",
        monthlyIncome: profile.monthlyIncome || 0,
        savingTarget: profile.savingTarget || 0,
        investmentType: profile.investmentType || "Savings",
        address: profile.address || "",
      });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await updateProfile(formData);

      alert(response.message);
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Error updating profile");
    }
  };

  if (loading) {
    return <h2 className="loading">Loading Profile...</h2>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>👤 Financial Profile</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="occupation"
            placeholder="Occupation"
            value={formData.occupation}
            onChange={handleChange}
          />

          <input
            type="number"
            name="monthlyIncome"
            placeholder="Monthly Income"
            value={formData.monthlyIncome}
            onChange={handleChange}
          />

          <input
            type="number"
            name="savingTarget"
            placeholder="Monthly Saving Target"
            value={formData.savingTarget}
            onChange={handleChange}
          />

          <select
            name="investmentType"
            value={formData.investmentType}
            onChange={handleChange}
          >
            <option value="Savings">Savings</option>
            <option value="FD">Fixed Deposit</option>
            <option value="Mutual Funds">Mutual Funds</option>
            <option value="Stocks">Stocks</option>
            <option value="Gold">Gold</option>
            <option value="Crypto">Crypto</option>
          </select>

          <textarea
            name="address"
            rows="4"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <button type="submit">💾 Save Profile</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
