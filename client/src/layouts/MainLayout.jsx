import React from "react";
import { Layout } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../store/actions/uiActions";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const { Content } = Layout;

const MainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useSelector((state) => state.ui);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={sidebarCollapsed} />
      <Layout>
        <Header collapsed={sidebarCollapsed} toggle={handleToggleSidebar} />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
          }}
        >
          {children}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
