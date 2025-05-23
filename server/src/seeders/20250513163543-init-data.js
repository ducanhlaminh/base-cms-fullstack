"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create brands first
    const brandIds = {
      apple: uuidv4(),
      samsung: uuidv4(),
      xiaomi: uuidv4(),
    };

    await queryInterface.bulkInsert("brands", [
      {
        id: brandIds.apple,
        name: "Apple",
        slug: "apple",
        description: "Apple Inc. - Innovative technology products",
        logo: "/uploads/brands/apple.png",
        website: "https://www.apple.com",
        isFeatured: true,
        status: "active",
        metaTitle: "Apple Products",
        metaDescription: "Browse our collection of Apple products",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: brandIds.samsung,
        name: "Samsung",
        slug: "samsung",
        description: "Samsung Electronics - Leading global technology",
        logo: "/uploads/brands/samsung.png",
        website: "https://www.samsung.com",
        isFeatured: true,
        status: "active",
        metaTitle: "Samsung Products",
        metaDescription: "Discover Samsung's innovative product lineup",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: brandIds.xiaomi,
        name: "Xiaomi",
        slug: "xiaomi",
        description: "Xiaomi - Quality technology at affordable prices",
        logo: "/uploads/brands/xiaomi.png",
        website: "https://www.mi.com",
        isFeatured: true,
        status: "active",
        metaTitle: "Xiaomi Products",
        metaDescription:
          "Explore Xiaomi's wide range of affordable tech products",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Create categories
    const categoryIds = {
      phones: uuidv4(),
      smartphones: uuidv4(),
      featurePhones: uuidv4(),
      tablets: uuidv4(),
      accessories: uuidv4(),
      cases: uuidv4(),
      chargers: uuidv4(),
    };

    await queryInterface.bulkInsert("categories", [
      {
        id: categoryIds.phones,
        name: "Phones",
        slug: "phones",
        description: "All mobile phone devices",
        parentId: null,
        image: "/uploads/categories/phones.jpg",
        icon: "phone",
        sortOrder: 1,
        isFeatured: true,
        status: "active",
        metaTitle: "Mobile Phones",
        metaDescription:
          "Browse our selection of mobile phones from top brands",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: categoryIds.smartphones,
        name: "Smartphones",
        slug: "smartphones",
        description: "Advanced mobile phones with smart features",
        parentId: categoryIds.phones,
        image: "/uploads/categories/smartphones.jpg",
        icon: "smartphone",
        sortOrder: 1,
        isFeatured: true,
        status: "active",
        metaTitle: "Smartphones",
        metaDescription: "Explore our range of cutting-edge smartphones",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: categoryIds.featurePhones,
        name: "Feature Phones",
        slug: "feature-phones",
        description: "Basic mobile phones with essential features",
        parentId: categoryIds.phones,
        image: "/uploads/categories/feature-phones.jpg",
        icon: "phone-basic",
        sortOrder: 2,
        isFeatured: false,
        status: "active",
        metaTitle: "Feature Phones",
        metaDescription: "Reliable basic phones with long battery life",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: categoryIds.tablets,
        name: "Tablets",
        slug: "tablets",
        description: "Tablet devices from various brands",
        parentId: null,
        image: "/uploads/categories/tablets.jpg",
        icon: "tablet",
        sortOrder: 2,
        isFeatured: true,
        status: "active",
        metaTitle: "Tablets",
        metaDescription: "Find the perfect tablet for work and entertainment",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: categoryIds.accessories,
        name: "Accessories",
        slug: "accessories",
        description: "Device accessories and add-ons",
        parentId: null,
        image: "/uploads/categories/accessories.jpg",
        icon: "accessories",
        sortOrder: 3,
        isFeatured: true,
        status: "active",
        metaTitle: "Mobile Accessories",
        metaDescription: "Essential accessories for your devices",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: categoryIds.cases,
        name: "Cases & Covers",
        slug: "cases-covers",
        description: "Protective cases and covers for devices",
        parentId: categoryIds.accessories,
        image: "/uploads/categories/cases.jpg",
        icon: "phone-case",
        sortOrder: 1,
        isFeatured: false,
        status: "active",
        metaTitle: "Phone Cases & Covers",
        metaDescription: "Protect your device with stylish cases and covers",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: categoryIds.chargers,
        name: "Chargers & Cables",
        slug: "chargers-cables",
        description: "Charging solutions and cables for devices",
        parentId: categoryIds.accessories,
        image: "/uploads/categories/chargers.jpg",
        icon: "charger",
        sortOrder: 2,
        isFeatured: false,
        status: "active",
        metaTitle: "Chargers & Cables",
        metaDescription:
          "Power up your devices with our range of chargers and cables",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Create products
    const productIds = {
      iphone15Pro: uuidv4(),
      iphone15: uuidv4(),
      samsungS23: uuidv4(),
      xiaomiRedmi12: uuidv4(),
    };

    await queryInterface.bulkInsert("products", [
      {
        id: productIds.iphone15Pro,
        name: "iPhone 15 Pro",
        slug: "iphone-15-pro",
        description: `<p>The iPhone 15 Pro features Apple's groundbreaking A17 Pro chip, the first 3-nanometer chip in the industry, delivering unprecedented performance and efficiency.</p>
        <p>The pro-grade camera system includes a 48MP main camera that now enables stunning high-resolution photos with a new 24MP default setting, providing a perfect combination of detail and optimization.</p>
        <p>Crafted from aerospace-grade titanium, the iPhone 15 Pro is both strong and lightweight, while the new Action button is customizable to instantly access a variety of features.</p>`,
        shortDescription:
          "Apple's most advanced iPhone ever with a titanium design and A17 Pro chip",
        price: 999.99,
        salePrice: 949.99,
        costPrice: 750.0,
        sku: "AAPL-IP15P-BASE",
        quantity: 100,
        isAvailable: true,
        categoryId: categoryIds.smartphones,
        brandId: brandIds.apple,
        featuredImage: "/uploads/products/iphone-15-pro-main.jpg",
        isFeatured: true,
        isNew: true,
        averageRating: 4.8,
        reviewCount: 24,
        specifications: JSON.stringify({
          display: "6.1-inch Super Retina XDR display with ProMotion",
          processor: "A17 Pro chip",
          camera: "48MP main, 12MP ultra wide, 12MP telephoto",
          battery: "Up to 23 hours video playback",
          storage: "128GB, 256GB, 512GB, 1TB",
          os: "iOS 17",
          connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3",
          dimensions: "146.6 x 70.6 x 8.25 mm",
          weight: "187 grams",
        }),
        tags: ["iphone", "apple", "smartphone", "premium"],
        weight: 187,
        dimensions: JSON.stringify({
          length: 146.6,
          width: 70.6,
          height: 8.25,
        }),
        warranty: "1 year limited warranty",
        status: "active",
        metaTitle: "iPhone 15 Pro - Apple's Most Advanced iPhone",
        metaDescription:
          "Discover the iPhone 15 Pro with A17 Pro chip, titanium design, and pro-grade camera system",
        viewCount: 583,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: productIds.iphone15,
        name: "iPhone 15",
        slug: "iphone-15",
        description: `<p>The iPhone 15 features a stunning 6.1-inch Super Retina XDR display that's even brighter for enhanced outdoor visibility.</p>
        <p>Powered by the advanced A16 Bionic chip, it delivers exceptional performance for demanding apps and games while maintaining excellent energy efficiency.</p>
        <p>The new 48MP main camera captures stunning detail, and the device introduces Dynamic Island, an innovative way to interact with alerts and activities.</p>`,
        shortDescription:
          "Dynamic Island, 48MP camera, and A16 Bionic chip in a sleek design",
        price: 799.99,
        salePrice: 779.99,
        costPrice: 600.0,
        sku: "AAPL-IP15-BASE",
        quantity: 150,
        isAvailable: true,
        categoryId: categoryIds.smartphones,
        brandId: brandIds.apple,
        featuredImage: "/uploads/products/iphone-15-main.jpg",
        isFeatured: true,
        isNew: true,
        averageRating: 4.6,
        reviewCount: 18,
        specifications: JSON.stringify({
          display: "6.1-inch Super Retina XDR display",
          processor: "A16 Bionic chip",
          camera: "48MP main, 12MP ultra wide",
          battery: "Up to 20 hours video playback",
          storage: "128GB, 256GB, 512GB",
          os: "iOS 17",
          connectivity: "5G, Wi-Fi 6, Bluetooth 5.3",
          dimensions: "147.6 x 71.6 x 7.8 mm",
          weight: "171 grams",
        }),
        tags: ["iphone", "apple", "smartphone"],
        weight: 171,
        dimensions: JSON.stringify({ length: 147.6, width: 71.6, height: 7.8 }),
        warranty: "1 year limited warranty",
        status: "active",
        metaTitle: "iPhone 15 - Dynamic Island and 48MP Camera",
        metaDescription:
          "Meet the iPhone 15 with Dynamic Island, 48MP camera system, and A16 Bionic chip",
        viewCount: 425,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: productIds.samsungS23,
        name: "Samsung Galaxy S23 Ultra",
        slug: "samsung-galaxy-s23-ultra",
        description: `<p>The Galaxy S23 Ultra features an integrated S Pen, Samsung's most advanced camera system, and a powerful Snapdragon 8 Gen 2 processor.</p>
        <p>Capture stunning detail with the 200MP main camera that delivers extraordinary resolution, even in challenging lighting conditions.</p>
        <p>The stunning 6.8-inch Dynamic AMOLED 2X display offers vibrant colors and precise detail, while the 5,000mAh battery provides all-day power.</p>`,
        shortDescription:
          "Samsung's ultimate smartphone with 200MP camera and built-in S Pen",
        price: 1199.99,
        salePrice: 1099.99,
        costPrice: 850.0,
        sku: "SMSNG-S23U-BASE",
        quantity: 80,
        isAvailable: true,
        categoryId: categoryIds.smartphones,
        brandId: brandIds.samsung,
        featuredImage: "/uploads/products/samsung-s23-ultra-main.jpg",
        isFeatured: true,
        isNew: true,
        averageRating: 4.7,
        reviewCount: 32,
        specifications: JSON.stringify({
          display: "6.8-inch Dynamic AMOLED 2X",
          processor: "Snapdragon 8 Gen 2",
          camera: "200MP main, 12MP ultra wide, 10MP telephoto, 10MP telephoto",
          battery: "5,000mAh",
          storage: "256GB, 512GB, 1TB",
          os: "Android 13, One UI 5.1",
          connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3",
          dimensions: "163.4 x 78.1 x 8.9 mm",
          weight: "234 grams",
        }),
        tags: ["samsung", "android", "s-pen", "smartphone", "premium"],
        weight: 234,
        dimensions: JSON.stringify({ length: 163.4, width: 78.1, height: 8.9 }),
        warranty: "1 year limited warranty",
        status: "active",
        metaTitle: "Samsung Galaxy S23 Ultra - The Ultimate Galaxy",
        metaDescription:
          "Experience the Samsung Galaxy S23 Ultra with 200MP camera, S Pen, and Snapdragon 8 Gen 2",
        viewCount: 492,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: productIds.xiaomiRedmi12,
        name: "Xiaomi Redmi Note 12 Pro",
        slug: "xiaomi-redmi-note-12-pro",
        description: `<p>The Redmi Note 12 Pro delivers premium features at an incredible value, powered by MediaTek Dimensity 1080 processor.</p>
        <p>Capture stunning photos with the 50MP Sony IMX766 main camera with optical image stabilization, and enjoy smooth visuals on the 120Hz AMOLED display.</p>
        <p>The 5,000mAh battery with 67W turbo charging provides all-day power and quickly recharges when needed.</p>`,
        shortDescription:
          "Exceptional performance and camera quality at an affordable price",
        price: 299.99,
        salePrice: 269.99,
        costPrice: 190.0,
        sku: "XIAOMI-RN12P-BASE",
        quantity: 200,
        isAvailable: true,
        categoryId: categoryIds.smartphones,
        brandId: brandIds.xiaomi,
        featuredImage: "/uploads/products/xiaomi-redmi-note-12-pro-main.jpg",
        isFeatured: true,
        isNew: true,
        averageRating: 4.5,
        reviewCount: 45,
        specifications: JSON.stringify({
          display: "6.67-inch 120Hz AMOLED",
          processor: "MediaTek Dimensity 1080",
          camera: "50MP Sony IMX766 main, 8MP ultra wide, 2MP macro",
          battery: "5,000mAh with 67W fast charging",
          storage: "128GB, 256GB",
          os: "Android 12, MIUI 13",
          connectivity: "5G, Wi-Fi 6, Bluetooth 5.2",
          dimensions: "162.9 x 76.0 x 8.0 mm",
          weight: "187 grams",
        }),
        tags: ["xiaomi", "redmi", "android", "smartphone", "affordable"],
        weight: 187,
        dimensions: JSON.stringify({ length: 162.9, width: 76.0, height: 8.0 }),
        warranty: "1 year warranty",
        status: "active",
        metaTitle: "Xiaomi Redmi Note 12 Pro - Performance Meets Value",
        metaDescription:
          "Discover the Xiaomi Redmi Note 12 Pro with 120Hz AMOLED display and 50MP camera",
        viewCount: 378,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Create product variants
    await queryInterface.bulkInsert("product_variants", [
      // iPhone 15 Pro variants
      {
        id: uuidv4(),
        productId: productIds.iphone15Pro,
        name: "iPhone 15 Pro - 128GB Black Titanium",
        sku: "AAPL-IP15P-128-BLK",
        price: 999.99,
        salePrice: 949.99,
        quantity: 30,
        isAvailable: true,
        attributes: JSON.stringify({
          color: "Black Titanium",
          storage: "128GB",
        }),
        image: "/uploads/products/iphone-15-pro-black.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        productId: productIds.iphone15Pro,
        name: "iPhone 15 Pro - 256GB Black Titanium",
        sku: "AAPL-IP15P-256-BLK",
        price: 1099.99,
        salePrice: 1049.99,
        quantity: 25,
        isAvailable: true,
        attributes: JSON.stringify({
          color: "Black Titanium",
          storage: "256GB",
        }),
        image: "/uploads/products/iphone-15-pro-black.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        productId: productIds.iphone15Pro,
        name: "iPhone 15 Pro - 128GB Natural Titanium",
        sku: "AAPL-IP15P-128-NAT",
        price: 999.99,
        salePrice: 949.99,
        quantity: 20,
        isAvailable: true,
        attributes: JSON.stringify({
          color: "Natural Titanium",
          storage: "128GB",
        }),
        image: "/uploads/products/iphone-15-pro-natural.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Samsung S23 Ultra variants
      {
        id: uuidv4(),
        productId: productIds.samsungS23,
        name: "Samsung Galaxy S23 Ultra - 256GB Phantom Black",
        sku: "SMSNG-S23U-256-BLK",
        price: 1199.99,
        salePrice: 1099.99,
        quantity: 25,
        isAvailable: true,
        attributes: JSON.stringify({
          color: "Phantom Black",
          storage: "256GB",
        }),
        image: "/uploads/products/samsung-s23-ultra-black.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        productId: productIds.samsungS23,
        name: "Samsung Galaxy S23 Ultra - 512GB Phantom Black",
        sku: "SMSNG-S23U-512-BLK",
        price: 1379.99,
        salePrice: 1299.99,
        quantity: 15,
        isAvailable: true,
        attributes: JSON.stringify({
          color: "Phantom Black",
          storage: "512GB",
        }),
        image: "/uploads/products/samsung-s23-ultra-black.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        productId: productIds.samsungS23,
        name: "Samsung Galaxy S23 Ultra - 256GB Green",
        sku: "SMSNG-S23U-256-GRN",
        price: 1199.99,
        salePrice: 1099.99,
        quantity: 20,
        isAvailable: true,
        attributes: JSON.stringify({
          color: "Green",
          storage: "256GB",
        }),
        image: "/uploads/products/samsung-s23-ultra-green.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Xiaomi variants
      {
        id: uuidv4(),
        productId: productIds.xiaomiRedmi12,
        name: "Xiaomi Redmi Note 12 Pro - 128GB Polar White",
        sku: "XIAOMI-RN12P-128-WHT",
        price: 299.99,
        salePrice: 269.99,
        quantity: 50,
        isAvailable: true,
        attributes: JSON.stringify({
          color: "Polar White",
          storage: "128GB",
        }),
        image: "/uploads/products/xiaomi-redmi-note-12-pro-white.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        productId: productIds.xiaomiRedmi12,
        name: "Xiaomi Redmi Note 12 Pro - 256GB Polar White",
        sku: "XIAOMI-RN12P-256-WHT",
        price: 349.99,
        salePrice: 319.99,
        quantity: 40,
        isAvailable: true,
        attributes: JSON.stringify({
          color: "Polar White",
          storage: "256GB",
        }),
        image: "/uploads/products/xiaomi-redmi-note-12-pro-white.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        productId: productIds.xiaomiRedmi12,
        name: "Xiaomi Redmi Note 12 Pro - 128GB Midnight Black",
        sku: "XIAOMI-RN12P-128-BLK",
        price: 299.99,
        salePrice: 269.99,
        quantity: 45,
        isAvailable: true,
        attributes: JSON.stringify({
          color: "Midnight Black",
          storage: "128GB",
        }),
        image: "/uploads/products/xiaomi-redmi-note-12-pro-black.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Create product images
    await queryInterface.bulkInsert("product_images", [
      // iPhone 15 Pro images
      {
        id: uuidv4(),
        productId: productIds.iphone15Pro,
        url: "/uploads/products/iphone-15-pro-front.jpg",
        alt: "iPhone 15 Pro Front View",
        isThumbnail: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        productId: productIds.iphone15Pro,
        url: "/uploads/products/iphone-15-pro-back.jpg",
        alt: "iPhone 15 Pro Back View",
        isThumbnail: false,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        productId: productIds.iphone15Pro,
        url: "/uploads/products/iphone-15-pro-side.jpg",
        alt: "iPhone 15 Pro Side View",
        isThumbnail: false,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Samsung S23 Ultra images
      {
        id: uuidv4(),
        productId: productIds.samsungS23,
        url: "/uploads/products/samsung-s23-ultra-front.jpg",
        alt: "Samsung Galaxy S23 Ultra Front View",
        isThumbnail: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        productId: productIds.samsungS23,
        url: "/uploads/products/samsung-s23-ultra-back.jpg",
        alt: "Samsung Galaxy S23 Ultra Back View",
        isThumbnail: false,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        productId: productIds.samsungS23,
        url: "/uploads/products/samsung-s23-ultra-spen.jpg",
        alt: "Samsung Galaxy S23 Ultra with S Pen",
        isThumbnail: false,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Xiaomi Redmi Note 12 Pro images
      {
        id: uuidv4(),
        productId: productIds.xiaomiRedmi12,
        url: "/uploads/products/xiaomi-redmi-note-12-pro-front.jpg",
        alt: "Xiaomi Redmi Note 12 Pro Front View",
        isThumbnail: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        productId: productIds.xiaomiRedmi12,
        url: "/uploads/products/xiaomi-redmi-note-12-pro-back.jpg",
        alt: "Xiaomi Redmi Note 12 Pro Back View",
        isThumbnail: false,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Create banners
    await queryInterface.bulkInsert("banners", [
      {
        id: uuidv4(),
        title: "New iPhone 15 Pro",
        imageUrl: "/uploads/banners/iphone-15-pro-banner.jpg",
        linkUrl: "/products/iphone-15-pro",
        position: "home_top",
        sortOrder: 1,
        startDate: new Date("2023-09-22"),
        endDate: new Date("2023-12-31"),
        isActive: true,
        description:
          "Experience the all-new iPhone 15 Pro with titanium design and A17 Pro chip",
        buttonText: "Shop Now",
        type: "main_slider",
        device: "all",
        bgColor: "#000000",
        textColor: "#ffffff",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Samsung Galaxy Summer Sale",
        imageUrl: "/uploads/banners/samsung-summer-sale.jpg",
        linkUrl: "/brands/samsung",
        position: "home_middle",
        sortOrder: 2,
        startDate: new Date("2023-06-01"),
        endDate: new Date("2023-08-31"),
        isActive: true,
        description: "Up to 25% off on selected Samsung Galaxy devices",
        buttonText: "View Deals",
        type: "promotion",
        device: "all",
        bgColor: "#1428a0",
        textColor: "#ffffff",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Back to School Essentials",
        imageUrl: "/uploads/banners/back-to-school.jpg",
        linkUrl: "/category/tablets",
        position: "home_bottom",
        sortOrder: 3,
        startDate: new Date("2023-07-15"),
        endDate: new Date("2023-09-15"),
        isActive: true,
        description: "Find the perfect tech for the new school year",
        buttonText: "Shop Now",
        type: "category",
        device: "all",
        bgColor: "#f5f5f5",
        textColor: "#333333",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Xiaomi Flash Sale",
        imageUrl: "/uploads/banners/xiaomi-flash-sale.jpg",
        linkUrl: "/brands/xiaomi",
        position: "category_top",
        sortOrder: 1,
        startDate: new Date("2023-08-10"),
        endDate: new Date("2023-08-12"),
        isActive: true,
        description: "48-hour flash sale on all Xiaomi products",
        buttonText: "Shop Now",
        type: "flash_sale",
        device: "all",
        bgColor: "#ff6700",
        textColor: "#ffffff",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("banners", null, {});
    await queryInterface.bulkDelete("product_images", null, {});
    await queryInterface.bulkDelete("product_variants", null, {});
    await queryInterface.bulkDelete("products", null, {});
    await queryInterface.bulkDelete("categories", null, {});
    await queryInterface.bulkDelete("brands", null, {});
  },
};
