const Profile = require("../models/Profile");

// =========================
// Get User Profile
// =========================
exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({
      user: req.user.id,
    });

    if (!profile) {
      profile = await Profile.create({
        user: req.user.id,
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// =========================
// Create / Update Profile
// =========================
exports.updateProfile = async (req, res) => {
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

    profile.fullName = fullName;
    profile.email = email;
    profile.phone = phone;
    profile.occupation = occupation;
    profile.monthlyIncome = monthlyIncome;
    profile.savingTarget = savingTarget;
    profile.investmentType = investmentType;
    profile.address = address;

    await profile.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
