const express = require("express");
const { check } = require("express-validator");
const bannerController = require("../controllers/banner.controller");
const { protect } = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

// Setup multer storage for banner uploads
const bannerUpload = uploadMiddleware.single("image");

const router = express.Router();

// Public routes
// Get all banners
router.get("/", bannerController.getAllBanners);

// Get banner by ID
router.get("/:id", bannerController.getBannerById);

// Get banners by position
router.get("/position/:position", bannerController.getBannersByPosition);

// Get banners by type
router.get("/type/:type", bannerController.getBannersByType);

// Protected routes (requires authentication)
router.use(protect);

// Create a new banner (admin only)
router.post(
  "/",
  roleMiddleware(["admin"]),
  bannerUpload,
  [check("title", "Banner title is required").notEmpty()],
  bannerController.createBanner
);

// Update a banner (admin only)
router.put(
  "/:id",
  roleMiddleware(["admin"]),
  bannerUpload,
  bannerController.updateBanner
);

// Delete a banner (admin only)
router.delete("/:id", roleMiddleware(["admin"]), bannerController.deleteBanner);

// Update banner status (admin only)
router.patch(
  "/:id/status",
  roleMiddleware(["admin"]),
  [check("isActive", "isActive field is required").isBoolean()],
  bannerController.updateBannerStatus
);

// Update banner sort order (admin only)
router.post(
  "/sort-order",
  roleMiddleware(["admin"]),
  bannerController.updateBannerSortOrder
);

module.exports = router;
