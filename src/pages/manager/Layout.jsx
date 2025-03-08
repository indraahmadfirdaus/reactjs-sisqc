import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Typography, Button } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import useUserStore from "../../store/useUserStore";
import AccountSettingsModal from "./AccountSettingsModal";

const { Sider, Content, Header } = Layout;
const { Title, Text } = Typography;

const ManagerLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useUserStore()
  const [openModal, setOpenModal] = useState(false)

  const handleLogout = () => {
    logout();
    message.success("Berhasil logout");
    navigate("/login");
  };

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      handleLogout()
    } else if (key === "profile") {
      setOpenModal(true)
    }
  };

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<UserOutlined />}>Pengaturan Akun</Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="xxl"
        collapsedWidth="80"
        style={{
          background: "#fff",
          padding: "16px 0",
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", paddingBottom: "1rem" }}>
          <img
            src="https://cdn.triloker.com/d:300/company/logo/20210921/9649d776c2a8dd32c3efd760d7e07fc0ac8ee0e31632215077.jpg"
            alt="Logo"
            style={{ width: collapsed ? "50px" : "80%", maxWidth: "120px", transition: "width 0.3s" }}
          />
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onClick={({ key }) => navigate(`/manager${key}`)}
          items={[
            { key: "/analytics", icon: <DashboardOutlined />, label: "Analitik" },
            { key: "/reports", icon: <FileTextOutlined />, label: "Laporan QC" },
            { key: "/goods", icon: <DatabaseOutlined />, label: "Master Barang" },
            { key: "/employees", icon: <TeamOutlined />, label: "Karyawan" },
          ]}
        />
      </Sider>

      {/* Main Content */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 24px",
            background: "#fff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} />
            <Title level={3} style={{ margin: 0 }}>QC Dashboard</Title>
          </div>
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>

              <div style={{ display: 'flex', flexDirection: 'column', textAlign: "right" }}>
                <Text strong style={{ fontSize: "1.1rem" }}>{user.name}</Text>
                <Text type="secondary" style={{ fontSize: "0.9rem" }}>{user.email}</Text>
              </div>
              <Avatar size="large" src={user?.photo_url} icon={<UserOutlined />} />
            </div>
          </Dropdown>
        </Header>
        <AccountSettingsModal
          visible={openModal}
          onClose={() => setOpenModal(false)}
        />

        {/* Content */}
        <Content
          style={{
            padding: "24px 24px",
            background: "#fff",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManagerLayout;