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

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();

      setFormData({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        occupation: data.occupation || "",
        monthlyIncome: data.monthlyIncome || 0,
        savingTarget: data.savingTarget || 0,
        investmentType: data.investmentType || "Savings",
        address: data.address || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfile(formData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Error updating profile");
    }
  };

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
            placeholder="Address"
            rows="4"
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
