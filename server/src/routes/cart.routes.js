const express = require("express");
const { check } = require("express-validator");
const cartController = require("../controllers/cart.controller");
const { protect } = require("../middlewares/auth.middleware");
const optionalAuthMiddleware = require("../middlewares/optionalAuth.middleware");

const router = express.Router();

// Public routes (no authentication required, but will use session ID)
router.use(optionalAuthMiddleware);

// Get cart (by session or user ID)
router.get("/", cartController.getCart);

// Add item to cart
router.post(
  "/items",
  [
    check("productId", "Product ID is required").notEmpty(),
    check("quantity", "Quantity must be a positive number").isInt({ min: 1 }),
  ],
  cartController.addItemToCart
);

// Update cart item
router.put(
  "/items/:itemId",
  [check("quantity", "Quantity must be a positive number").isInt({ min: 1 })],
  cartController.updateCartItem
);

// Remove item from cart
router.delete("/items/:itemId", cartController.removeItemFromCart);

// Clear cart
router.delete("/", cartController.clearCart);

// Apply coupon to cart
router.post(
  "/apply-coupon",
  [check("couponCode", "Coupon code is required").notEmpty()],
  cartController.applyCoupon
);

// Remove coupon from cart
router.delete("/remove-coupon", cartController.removeCoupon);

// Get shipping methods
router.get("/shipping-methods", cartController.getShippingMethods);

// Set shipping method
router.post(
  "/shipping-method",
  [check("shippingMethod", "Shipping method is required").notEmpty()],
  cartController.setShippingMethod
);

// Protected routes (requires authentication)
router.use(protect);

// Convert guest cart to user cart (after login)
router.post("/convert", cartController.convertGuestCartToUserCart);

// Save cart for later
router.put("/save", cartController.saveCartForLater);

// Submit cart for checkout
router.post(
  "/checkout",
  [
    check("shippingAddress", "Shipping address is required").notEmpty(),
    check("billingAddress", "Billing address is required").notEmpty(),
    check("paymentMethod", "Payment method is required").notEmpty(),
  ],
  cartController.checkout
);

module.exports = router;
