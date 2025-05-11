import React from "react";
import { Layout } from "antd";

const { Footer: AntFooter } = Layout;

const Footer = () => {
  return (
    <AntFooter style={{ textAlign: "center" }}>
      Base CMS ©{new Date().getFullYear()} Created with React & Ant Design
    </AntFooter>
  );
};

export default Footer;
