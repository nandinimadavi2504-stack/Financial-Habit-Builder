const Profile = require("../models/Profile");

// ======================================
// Get User Profile
// ======================================
const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({
      user: req.user.id,
    });

    // Create empty profile if not found
    if (!profile) {
      profile = await Profile.create({
        user: req.user.id,
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Create / Update Profile
// ======================================
const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      occupation,
      monthlyIncome,
      savingTarget,
      investmentType,
      address,
    } = req.body;

    let profile = await Profile.findOne({
      user: req.user.id,
    });

    if (!profile) {
      profile = new Profile({
        user: req.user.id,
      });
    }

    profile.fullName = fullName || "";
    profile.email = email || "";
    profile.phone = phone || "";
    profile.occupation = occupation || "";
    profile.monthlyIncome = Number(monthlyIncome || 0);
    profile.savingTarget = Number(savingTarget || 0);
    profile.investmentType = investmentType || "";
    profile.address = address || "";

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
