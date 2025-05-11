const { sequelize } = require("../config/db");
const models = require("../models");

async function createTestMenu() {
  try {
    // Find an admin user to set as menu creator
    const adminUser = await models.User.findOne({
      where: {
        email: "admin@example.com", // Change this to an existing user email
      },
    });

    if (!adminUser) {
      console.error("No admin user found. Please create a user first.");
      process.exit(1);
    }

    // Sample header menu
    const headerMenu = {
      name: "Main Navigation",
      location: "header",
      active: true,
      order: 1,
      createdById: adminUser.id,
      items: [
        {
          id: 1,
          label: "Home",
          url: "/",
          order: 1,
          type: "link",
        },
        {
          id: 2,
          label: "News",
          url: "/news",
          order: 2,
          type: "link",
        },
        {
          id: 3,
          label: "Categories",
          url: "#",
          order: 3,
          type: "dropdown",
          children: [],
        },
        {
          id: 4,
          label: "About Us",
          url: "/about",
          order: 4,
          type: "link",
        },
        {
          id: 5,
          label: "Contact",
          url: "/contact",
          order: 5,
          type: "link",
        },
      ],
    };

    // Get all categories to add them to the dropdown
    const categories = await models.Category.findAll({
      attributes: ["id", "name", "slug"],
    });

    // Add categories to the dropdown menu item
    headerMenu.items[2].children = categories.map((category, index) => ({
      id: 100 + index,
      label: category.name,
      url: `/category/${category.slug}`,
      order: index + 1,
      type: "link",
    }));

    // Sample footer menu
    const footerMenu = {
      name: "Footer Links",
      location: "footer",
      active: true,
      order: 1,
      createdById: adminUser.id,
      items: [
        {
          id: 1,
          label: "Privacy Policy",
          url: "/privacy",
          order: 1,
          type: "link",
        },
        {
          id: 2,
          label: "Terms of Service",
          url: "/terms",
          order: 2,
          type: "link",
        },
        {
          id: 3,
          label: "Advertise",
          url: "/advertise",
          order: 3,
          type: "link",
        },
      ],
    };

    // Create the menus
    const createdHeaderMenu = await models.Menu.create(headerMenu);
    const createdFooterMenu = await models.Menu.create(footerMenu);

    console.log("Test menus created successfully:");
    console.log("Header menu ID:", createdHeaderMenu.id);
    console.log("Footer menu ID:", createdFooterMenu.id);
  } catch (error) {
    console.error("Error creating test menus:", error);
  } finally {
    await sequelize.close();
  }
}

createTestMenu();
