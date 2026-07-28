const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
} = require("../controllers/assetController");

router.use(authMiddleware);

router.route("/").get(getAssets).post(addAsset);

router.route("/:id").get(getAssetById).put(updateAsset).delete(deleteAsset);

module.exports = router;
