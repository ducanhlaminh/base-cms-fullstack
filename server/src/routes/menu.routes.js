const express = require("express");
const { check } = require("express-validator");
const menuController = require("../controllers/menu.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

// Public routes
router.get("/", menuController.getAllMenus);
router.get("/:id", menuController.getMenuById);
router.get("/location/:location", menuController.getMenuByLocation);

// Protected routes - only admin and editor can manage menus
router.post(
  "/",
  [
    protect,
    authorize("admin", "editor"),
    [
      check("name", "Menu name is required").notEmpty(),
      check("location", "Menu location is required").notEmpty(),
      check("items", "Items must be an array").isArray(),
    ],
  ],
  menuController.createMenu
);

router.put(
  "/:id",
  [
    protect,
    authorize("admin", "editor"),
    [
      check("name", "Menu name is required").optional().notEmpty(),
      check("location", "Menu location is required").optional().notEmpty(),
      check("items", "Items must be an array").optional().isArray(),
    ],
  ],
  menuController.updateMenu
);

router.delete(
  "/:id",
  [protect, authorize("admin", "editor")],
  menuController.deleteMenu
);

module.exports = router;
