import { Layout, Menu } from 'antd';
import { FormOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const OfficerLayout = () => {
  const location = useLocation();

  const menuItems = [
    { key: "/officer/submit", label: "Submit Laporan", icon: <FormOutlined />, path: "/officer/submit", regex: /^\/officer\/submit/ },
    { key: "/officer/report", label: "List Laporan", icon: <UnorderedListOutlined />, path: "/officer/report", regex: /^\/officer\/report/ },
    { key: "/officer/account", label: "Manajemen Akun", icon: <UserOutlined />, path: "/officer/account", regex: /^\/officer\/account/ },
  ];

  const activeKey = menuItems.find(item => item.regex.test(location.pathname))?.key;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#fff", textAlign: "center", padding: 0 }}>
        <h1>QC Officer Dashboard</h1>
      </Header>
      <Menu 
        mode="horizontal" 
        selectedKeys={[activeKey]} 
        style={{ display: 'flex', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 1 }}
      >
        {menuItems.map(item => (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.path}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
      <Content style={{ padding: "1rem" }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: "center" }}>Officer Dashboard ©2025</Footer>
    </Layout>
  );
};

export default OfficerLayout;
