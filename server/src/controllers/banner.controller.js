const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const db = require("../models");
const Banner = db.Banner;

// Get all banners
exports.getAllBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.findAll({
    order: [["sortOrder", "ASC"]],
  });

  res.json({
    success: true,
    banners,
  });
});

// Get banner by ID
exports.getBannerById = asyncHandler(async (req, res) => {
  const banner = await Banner.findByPk(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  res.json({
    success: true,
    banner,
  });
});

// Get banners by position
exports.getBannersByPosition = asyncHandler(async (req, res) => {
  const { position } = req.params;
  const { device } = req.query;

  let whereClause = {
    position,
    isActive: true,
  };

  // Add date filter for active banners
  const now = new Date();
  whereClause = {
    ...whereClause,
    [db.Sequelize.Op.and]: [
      {
        [db.Sequelize.Op.or]: [
          { startDate: null },
          { startDate: { [db.Sequelize.Op.lte]: now } },
        ],
      },
      {
        [db.Sequelize.Op.or]: [
          { endDate: null },
          { endDate: { [db.Sequelize.Op.gte]: now } },
        ],
      },
    ],
  };

  // Filter by device if specified
  if (device) {
    whereClause = {
      ...whereClause,
      [db.Sequelize.Op.or]: [{ device: "all" }, { device }],
    };
  }

  const banners = await Banner.findAll({
    where: whereClause,
    order: [["sortOrder", "ASC"]],
  });

  res.json({
    success: true,
    banners,
  });
});

// Get banners by type
exports.getBannersByType = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { device } = req.query;

  let whereClause = {
    type,
    isActive: true,
  };

  // Add date filter for active banners
  const now = new Date();
  whereClause = {
    ...whereClause,
    [db.Sequelize.Op.and]: [
      {
        [db.Sequelize.Op.or]: [
          { startDate: null },
          { startDate: { [db.Sequelize.Op.lte]: now } },
        ],
      },
      {
        [db.Sequelize.Op.or]: [
          { endDate: null },
          { endDate: { [db.Sequelize.Op.gte]: now } },
        ],
      },
    ],
  };

  // Filter by device if specified
  if (device) {
    whereClause = {
      ...whereClause,
      [db.Sequelize.Op.or]: [{ device: "all" }, { device }],
    };
  }

  const banners = await Banner.findAll({
    where: whereClause,
    order: [["sortOrder", "ASC"]],
  });

  res.json({
    success: true,
    banners,
  });
});

// Create a new banner
exports.createBanner = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Banner image is required");
  }

  const {
    title,
    linkUrl,
    position,
    sortOrder,
    startDate,
    endDate,
    isActive,
    description,
    buttonText,
    type,
    device,
    bgColor,
    textColor,
  } = req.body;

  // Create banner
  const banner = await Banner.create({
    title,
    imageUrl: `/uploads/banners/${req.file.filename}`,
    linkUrl,
    position: position || "home_top",
    sortOrder: sortOrder || 0,
    startDate: startDate || null,
    endDate: endDate || null,
    isActive: isActive !== undefined ? isActive : true,
    description,
    buttonText,
    type: type || "main_slider",
    device: device || "all",
    bgColor,
    textColor,
  });

  res.status(201).json({
    success: true,
    banner,
  });
});

// Update a banner
exports.updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByPk(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  const {
    title,
    linkUrl,
    position,
    sortOrder,
    startDate,
    endDate,
    isActive,
    description,
    buttonText,
    type,
    device,
    bgColor,
    textColor,
  } = req.body;

  // Update image if new file is uploaded
  let imageUrl = banner.imageUrl;
  if (req.file) {
    // Delete old image if exists
    if (banner.imageUrl) {
      const oldImagePath = path.join(__dirname, "../../", banner.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    imageUrl = `/uploads/banners/${req.file.filename}`;
  }

  // Update banner
  await banner.update({
    title: title || banner.title,
    imageUrl,
    linkUrl: linkUrl !== undefined ? linkUrl : banner.linkUrl,
    position: position || banner.position,
    sortOrder: sortOrder !== undefined ? sortOrder : banner.sortOrder,
    startDate: startDate !== undefined ? startDate : banner.startDate,
    endDate: endDate !== undefined ? endDate : banner.endDate,
    isActive: isActive !== undefined ? isActive : banner.isActive,
    description: description !== undefined ? description : banner.description,
    buttonText: buttonText !== undefined ? buttonText : banner.buttonText,
    type: type || banner.type,
    device: device || banner.device,
    bgColor: bgColor !== undefined ? bgColor : banner.bgColor,
    textColor: textColor !== undefined ? textColor : banner.textColor,
  });

  res.json({
    success: true,
    banner,
  });
});

// Delete a banner
exports.deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByPk(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  // Delete image if exists
  if (banner.imageUrl) {
    const imagePath = path.join(__dirname, "../../", banner.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  // Delete banner
  await banner.destroy();

  res.json({
    success: true,
    message: "Banner deleted successfully",
  });
});

// Update banner status
exports.updateBannerStatus = asyncHandler(async (req, res) => {
  const banner = await Banner.findByPk(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  const { isActive } = req.body;

  if (isActive === undefined) {
    res.status(400);
    throw new Error("isActive field is required");
  }

  await banner.update({
    isActive,
  });

  res.json({
    success: true,
    banner,
  });
});

// Update banner sort order
exports.updateBannerSortOrder = asyncHandler(async (req, res) => {
  const { banners } = req.body;

  if (!banners || !Array.isArray(banners)) {
    res.status(400);
    throw new Error("Invalid banner data");
  }

  const results = [];

  for (const item of banners) {
    const { id, sortOrder } = item;

    try {
      const banner = await Banner.findByPk(id);
      if (banner) {
        await banner.update({ sortOrder });
        results.push({ id, success: true });
      } else {
        results.push({ id, success: false, message: "Banner not found" });
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
