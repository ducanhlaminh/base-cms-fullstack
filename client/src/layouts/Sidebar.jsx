import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  FileOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";

const { Sider } = Layout;

// Get icon component by name
const getIconComponent = (iconName) => {
  const icons = {
    home: <HomeOutlined />,
    user: <UserOutlined />,
    setting: <SettingOutlined />,
    file: <FileOutlined />,
    dashboard: <DashboardOutlined />,
  };

  return icons[iconName] || <FileOutlined />;
};

// Default menu items
const defaultMenuItems = [
  {
    key: "/",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "/users",
    icon: <UserOutlined />,
    label: "Users",
  },
  {
    key: "/content",
    icon: <FileOutlined />,
    label: "Content",
  },
  {
    key: "/settings",
    icon: <SettingOutlined />,
    label: "Settings",
  },
];

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [menuItems, setMenuItems] = useState(defaultMenuItems);
  const { callApi, loading } = useApi("/menu");

  // Update selected keys when location changes
  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys([pathName]);
  }, [location.pathname]);

  // Fetch menu items from API
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await callApi();
        if (response && response.menu) {
          const formattedItems = response.menu.map((item) => ({
            key: item.path || item.key,
            icon: getIconComponent(item.icon),
            label: item.label,
            children: item.children
              ? item.children.map((child) => ({
                  key: child.path || child.key,
                  icon: getIconComponent(child.icon),
                  label: child.label,
                }))
              : undefined,
          }));
          setMenuItems(formattedItems);
        }
      } catch (error) {
        console.error("Failed to fetch menu:", error);
        // Keep default menu items on error
      }
    };

    fetchMenu();
  }, [callApi]);

  // Handle menu item click
  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      theme="dark"
    >
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: collapsed ? 16 : 20,
          fontWeight: "bold",
          overflow: "hidden",
        }}
      >
        {collapsed ? "CMS" : "Base CMS"}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default Sidebar;
