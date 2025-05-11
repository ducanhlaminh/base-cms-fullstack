import React from "react";
import { Layout, Button, Avatar, Dropdown, Space } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const { Header: AntHeader } = Layout;

const Header = ({ collapsed, toggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const items = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
      onClick: () => navigate("/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      style={{
        padding: 0,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggle}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />

      <div style={{ marginRight: 20 }}>
        <Dropdown menu={{ items }} placement="bottomRight">
          <Space>
            <span style={{ marginRight: 8 }}>{user?.name || "User"}</span>
            <Avatar icon={<UserOutlined />} />
          </Space>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;
