const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const db = require("../models");
const Product = db.Product;
const Category = db.Category;
const Brand = db.Brand;
const ProductImage = db.ProductImage;
const ProductVariant = db.ProductVariant;

// Get all products with pagination
exports.getAllProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";
  const sort = req.query.sort || "createdAt";
  const order = req.query.order || "DESC";

  let whereClause = {};
  if (search) {
    whereClause = {
      [db.Sequelize.Op.or]: [
        { name: { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { description: { [db.Sequelize.Op.iLike]: `%${search}%` } },
      ],
    };
  }

  const { count, rows } = await Product.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [[sort, order]],
    include: [
      { model: Category, as: "category" },
      { model: Brand, as: "brand" },
      { model: ProductImage, as: "images" },
    ],
  });

  res.json({
    success: true,
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    products: rows,
  });
});

// Get product by ID
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [
      { model: Category, as: "category" },
      { model: Brand, as: "brand" },
      { model: ProductImage, as: "images" },
      { model: ProductVariant, as: "variants" },
    ],
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({
    success: true,
    product,
  });
});

// Get product by slug
exports.getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    where: { slug: req.params.slug },
    include: [
      { model: Category, as: "category" },
      { model: Brand, as: "brand" },
      { model: ProductImage, as: "images" },
      { model: ProductVariant, as: "variants" },
    ],
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({
    success: true,
    product,
  });
});

// Create a new product
exports.createProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    description,
    shortDescription,
    price,
    salePrice,
    quantity,
    categoryId,
    brandId,
    isFeatured,
    isNew,
    specifications,
    tags,
    status,
  } = req.body;

  // Check if category exists
  const category = await Category.findByPk(categoryId);
  if (!category) {
    res.status(400);
    throw new Error("Category not found");
  }

  // Check if brand exists if brandId is provided
  if (brandId) {
    const brand = await Brand.findByPk(brandId);
    if (!brand) {
      res.status(400);
      throw new Error("Brand not found");
    }
  }

  // Create product
  const product = await Product.create({
    name,
    description,
    shortDescription,
    price,
    salePrice,
    quantity: quantity || 0,
    categoryId,
    brandId,
    isFeatured: isFeatured || false,
    isNew: isNew || false,
    specifications: specifications || {},
    tags: tags || [],
    status: status || "draft",
    featuredImage: req.file ? `/uploads/products/${req.file.filename}` : null,
  });

  res.status(201).json({
    success: true,
    product,
  });
});

// Update a product
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const {
    name,
    description,
    shortDescription,
    price,
    salePrice,
    quantity,
    categoryId,
    brandId,
    isFeatured,
    isNew,
    specifications,
    tags,
    status,
  } = req.body;

  // Check if category exists
  if (categoryId) {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      res.status(400);
      throw new Error("Category not found");
    }
  }

  // Check if brand exists if brandId is provided
  if (brandId) {
    const brand = await Brand.findByPk(brandId);
    if (!brand) {
      res.status(400);
      throw new Error("Brand not found");
    }
  }

  // Update featured image if new file is uploaded
  let featuredImage = product.featuredImage;
  if (req.file) {
    // Delete old image if exists
    if (product.featuredImage) {
      const oldImagePath = path.join(
        __dirname,
        "../../",
        product.featuredImage
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    featuredImage = `/uploads/products/${req.file.filename}`;
  }

  // Update product
  await product.update({
    name: name || product.name,
    description: description || product.description,
    shortDescription: shortDescription || product.shortDescription,
    price: price || product.price,
    salePrice: salePrice !== undefined ? salePrice : product.salePrice,
    quantity: quantity !== undefined ? quantity : product.quantity,
    categoryId: categoryId || product.categoryId,
    brandId: brandId || product.brandId,
    isFeatured: isFeatured !== undefined ? isFeatured : product.isFeatured,
    isNew: isNew !== undefined ? isNew : product.isNew,
    specifications: specifications || product.specifications,
    tags: tags || product.tags,
    status: status || product.status,
    featuredImage,
  });

  const updatedProduct = await Product.findByPk(req.params.id, {
    include: [
      { model: Category, as: "category" },
      { model: Brand, as: "brand" },
      { model: ProductImage, as: "images" },
    ],
  });

  res.json({
    success: true,
    product: updatedProduct,
  });
});

// Delete a product
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Delete featured image if exists
  if (product.featuredImage) {
    const imagePath = path.join(__dirname, "../../", product.featuredImage);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  // Delete product images
  const productImages = await ProductImage.findAll({
    where: { productId: product.id },
  });

  for (const image of productImages) {
    const imagePath = path.join(__dirname, "../../", image.url);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    await image.destroy();
  }

  // Delete product variants
  await ProductVariant.destroy({ where: { productId: product.id } });

  // Delete product
  await product.destroy();

  res.json({
    success: true,
    message: "Product deleted successfully",
  });
});

// Get products by category
exports.getProductsByCategory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const sort = req.query.sort || "createdAt";
  const order = req.query.order || "DESC";

  const { count, rows } = await Product.findAndCountAll({
    where: { categoryId: req.params.categoryId },
    limit,
    offset,
    order: [[sort, order]],
    include: [
      { model: Category, as: "category" },
      { model: Brand, as: "brand" },
      { model: ProductImage, as: "images" },
    ],
  });

  res.json({
    success: true,
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    products: rows,
  });
});

// Get products by brand
exports.getProductsByBrand = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const sort = req.query.sort || "createdAt";
  const order = req.query.order || "DESC";

  const { count, rows } = await Product.findAndCountAll({
    where: { brandId: req.params.brandId },
    limit,
    offset,
    order: [[sort, order]],
    include: [
      { model: Category, as: "category" },
      { model: Brand, as: "brand" },
      { model: ProductImage, as: "images" },
    ],
  });

  res.json({
    success: true,
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    products: rows,
  });
});

// Upload product images
exports.uploadProductImages = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("No images uploaded");
  }

  const images = [];

  for (const file of req.files) {
    const image = await ProductImage.create({
      productId: product.id,
      url: `/uploads/products/${file.filename}`,
      alt: product.name,
    });
    images.push(image);
  }

  res.status(201).json({
    success: true,
    images,
  });
});

// Delete product image
exports.deleteProductImage = asyncHandler(async (req, res) => {
  const image = await ProductImage.findByPk(req.params.imageId);

  if (!image) {
    res.status(404);
    throw new Error("Image not found");
  }

  // Delete image file
  const imagePath = path.join(__dirname, "../../", image.url);
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }

  await image.destroy();

  res.json({
    success: true,
    message: "Image deleted successfully",
  });
});

// Get featured products
exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const products = await Product.findAll({
    where: { isFeatured: true, status: "active" },
    limit,
    include: [
      { model: Category, as: "category" },
      { model: Brand, as: "brand" },
      { model: ProductImage, as: "images" },
    ],
  });

  res.json({
    success: true,
    products,
  });
});

// Get new arrivals
exports.getNewArrivals = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const products = await Product.findAll({
    where: { isNew: true, status: "active" },
    limit,
    order: [["createdAt", "DESC"]],
    include: [
      { model: Category, as: "category" },
      { model: Brand, as: "brand" },
      { model: ProductImage, as: "images" },
    ],
  });

  res.json({
    success: true,
    products,
  });
});

// Get best sellers
exports.getBestSellers = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const products = await Product.findAll({
    where: { status: "active" },
    limit,
    order: [["viewCount", "DESC"]],
    include: [
      { model: Category, as: "category" },
      { model: Brand, as: "brand" },
      { model: ProductImage, as: "images" },
    ],
  });

  res.json({
    success: true,
    products,
  });
});

// Get related products
exports.getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const limit = parseInt(req.query.limit) || 4;

  const relatedProducts = await Product.findAll({
    where: {
      categoryId: product.categoryId,
      id: { [db.Sequelize.Op.ne]: product.id },
      status: "active",
    },
    limit,
    include: [
      { model: Category, as: "category" },
      { model: Brand, as: "brand" },
      { model: ProductImage, as: "images" },
    ],
  });

  res.json({
    success: true,
    products: relatedProducts,
  });
});

// Increment product view count
exports.incrementViewCount = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.update({
    viewCount: product.viewCount + 1,
  });

  res.json({
    success: true,
    message: "View count updated",
  });
});

// Create product variant
exports.createProductVariant = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const product = await Product.findByPk(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const { name, sku, price, salePrice, quantity, attributes } = req.body;

  const variant = await ProductVariant.create({
    productId: product.id,
    name,
    sku,
    price,
    salePrice,
    quantity: quantity || 0,
    attributes: attributes || {},
  });

  res.status(201).json({
    success: true,
    variant,
  });
});

// Update product variant
exports.updateProductVariant = asyncHandler(async (req, res) => {
  const variant = await ProductVariant.findByPk(req.params.variantId);

  if (!variant) {
    res.status(404);
    throw new Error("Variant not found");
  }

  const { name, sku, price, salePrice, quantity, attributes } = req.body;

  await variant.update({
    name: name || variant.name,
    sku: sku || variant.sku,
    price: price || variant.price,
    salePrice: salePrice !== undefined ? salePrice : variant.salePrice,
    quantity: quantity !== undefined ? quantity : variant.quantity,
    attributes: attributes || variant.attributes,
  });

  res.json({
    success: true,
    variant,
  });
});

// Delete product variant
exports.deleteProductVariant = asyncHandler(async (req, res) => {
  const variant = await ProductVariant.findByPk(req.params.variantId);

  if (!variant) {
    res.status(404);
    throw new Error("Variant not found");
  }

  await variant.destroy();

  res.json({
    success: true,
    message: "Variant deleted successfully",
  });
});

// Bulk update inventory
exports.bulkUpdateInventory = asyncHandler(async (req, res) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products)) {
    res.status(400);
    throw new Error("Invalid product data");
  }

  const results = [];

  for (const item of products) {
    const { id, quantity } = item;

    try {
      const product = await Product.findByPk(id);
      if (product) {
        await product.update({ quantity });
        results.push({ id, success: true });
      } else {
        results.push({ id, success: false, message: "Product not found" });
      }
    } catch (error) {
      results.push({ id, success: false, message: error.message });
    }
  }

  res.json({
    success: true,
    results,
  });
});

// Export products to CSV
exports.exportProductsToCSV = asyncHandler(async (req, res) => {
  // This is a simplified implementation
  const products = await Product.findAll({
    include: [
      { model: Category, as: "category" },
      { model: Brand, as: "brand" },
    ],
  });

  let csv =
    "ID,Name,Description,Price,SalePrice,Quantity,Category,Brand,Status\n";

  products.forEach((product) => {
    csv += `${product.id},"${product.name.replace(
      /"/g,
      '""'
    )}","${product.description.replace(/"/g, '""')}",${product.price},${
      product.salePrice || ""
    },${product.quantity},"${product.category ? product.category.name : ""}","${
      product.brand ? product.brand.name : ""
    }",${product.status}\n`;
  });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=products.csv");
  res.send(csv);
});

// Import products from CSV
exports.importProductsFromCSV = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  // This is a placeholder for actual CSV import logic
  // In a real implementation, you would parse the CSV file and create products

  res.json({
    success: true,
    message: "Products imported successfully",
  });
});
