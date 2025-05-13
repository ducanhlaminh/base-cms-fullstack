const express = require("express");
const { check } = require("express-validator");
const productController = require("../controllers/product.controller");
const { protect } = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

const router = express.Router();

// Get all products with pagination
router.get("/", productController.getAllProducts);

// Get featured products
router.get("/featured", productController.getFeaturedProducts);

// Get new arrivals
router.get("/new-arrivals", productController.getNewArrivals);

// Get best sellers
router.get("/best-sellers", productController.getBestSellers);

// Get product by ID
router.get("/:id", productController.getProductById);

// Get product by slug
router.get("/slug/:slug", productController.getProductBySlug);

// Get products by category
router.get("/category/:categoryId", productController.getProductsByCategory);

// Get products by brand
router.get("/brand/:brandId", productController.getProductsByBrand);

// Get related products
router.get("/:id/related", productController.getRelatedProducts);

// Increment product view count
router.post("/:id/view", productController.incrementViewCount);

// Protected routes (requires authentication)
router.use(protect);

// Create a new product (admin only)
router.post(
  "/",
  roleMiddleware(["admin", "product_manager"]),
  uploadMiddleware.single("featuredImage"),
  [
    check("name", "Product name is required").notEmpty(),
    check("description", "Description is required").notEmpty(),
    check("price", "Price is required").isNumeric(),
    check("categoryId", "Category ID is required").notEmpty(),
    check("quantity", "Quantity must be a number").optional().isNumeric(),
  ],
  productController.createProduct
);

// Update a product (admin only)
router.put(
  "/:id",
  roleMiddleware(["admin", "product_manager"]),
  uploadMiddleware.single("featuredImage"),
  productController.updateProduct
);

// Delete a product (admin only)
router.delete(
  "/:id",
  roleMiddleware(["admin", "product_manager"]),
  productController.deleteProduct
);

// Upload product images
router.post(
  "/:id/images",
  roleMiddleware(["admin", "product_manager"]),
  uploadMiddleware.array("images", 10),
  productController.uploadProductImages
);

// Delete product image
router.delete(
  "/images/:imageId",
  roleMiddleware(["admin", "product_manager"]),
  productController.deleteProductImage
);

// Create product variant
router.post(
  "/:id/variants",
  roleMiddleware(["admin", "product_manager"]),
  [
    check("name", "Variant name is required").notEmpty(),
    check("sku", "SKU is required").notEmpty(),
    check("price", "Price is required").isNumeric(),
    check("quantity", "Quantity must be a number").optional().isNumeric(),
  ],
  productController.createProductVariant
);

// Update product variant
router.put(
  "/variants/:variantId",
  roleMiddleware(["admin", "product_manager"]),
  productController.updateProductVariant
);

// Delete product variant
router.delete(
  "/variants/:variantId",
  roleMiddleware(["admin", "product_manager"]),
  productController.deleteProductVariant
);

// Bulk update product inventory
router.post(
  "/bulk-update-inventory",
  roleMiddleware(["admin", "product_manager", "inventory_manager"]),
  productController.bulkUpdateInventory
);

// Export products to CSV
router.get(
  "/export/csv",
  roleMiddleware(["admin", "product_manager"]),
  productController.exportProductsToCSV
);

// Import products from CSV
router.post(
  "/import/csv",
  roleMiddleware(["admin", "product_manager"]),
  uploadMiddleware.single("file"),
  productController.importProductsFromCSV
);

module.exports = router;
