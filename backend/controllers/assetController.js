const mongoose = require("mongoose");
const Asset = require("../models/Asset");

// ======================================
// Add Asset
// ======================================
const addAsset = async (req, res) => {
  try {
    const {
      assetType,
      assetName,
      purchaseValue,
      currentValue,
      purchaseDate,
      notes,
    } = req.body;

    if (!assetType || !assetName || currentValue == null) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const asset = await Asset.create({
      user: req.user._id,
      assetType,
      assetName,
      purchaseValue,
      currentValue,
      purchaseDate,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Asset added successfully.",
      asset,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Get All Assets
// ======================================
const getAssets = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", assetType } = req.query;

    const query = {
      user: req.user._id,
    };

    if (search) {
      query.assetName = {
        $regex: search,
        $options: "i",
      };
    }

    if (assetType) {
      query.assetType = assetType;
    }

    const total = await Asset.countDocuments(query);

    const assets = await Asset.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      assets,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Get Asset By ID
// ======================================
const getAssetById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Asset ID.",
      });
    }

    const asset = await Asset.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found.",
      });
    }

    res.json({
      success: true,
      asset,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Update Asset
// ======================================
const updateAsset = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Asset ID.",
      });
    }

    const asset = await Asset.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found.",
      });
    }

    res.json({
      success: true,
      message: "Asset updated successfully.",
      asset,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Delete Asset
// ======================================
const deleteAsset = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Asset ID.",
      });
    }

    const asset = await Asset.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found.",
      });
    }

    res.json({
      success: true,
      message: "Asset deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  addAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
};
