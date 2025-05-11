import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  UserOutlined,
  FileOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Users" value={42} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Content Items"
              value={128}
              prefix={<FileOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Active Sessions"
              value={18}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Recent Activity">
            <p>No recent activity to display.</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
