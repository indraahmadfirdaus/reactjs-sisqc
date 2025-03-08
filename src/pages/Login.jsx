import { useState, useEffect } from "react";
import { Form, Input, Button, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";

const { Title, Text } = Typography;

const LoginPage = () => {
  const { loginUser, loading } = useUserStore();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Cek ukuran layar untuk responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = async (values) => {
    const { email, password } = values;
    const res = await loginUser(email, password);

    if (res.success) {
      navigate(res.role === "OFFICER" ? "/officer/report" : "/manager/analytics");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center", background: "#fff" }}>
      <div style={{ 
        display: "flex", 
        width: "90%", 
        maxWidth: 900, 
        background: "white", 
        borderRadius: "12px", 
        boxShadow: "0px 4px 20px rgba(0,0,0,0.1)", 
        overflow: "hidden"
      }}>
        {/* Bagian Kiri: Form Login */}
        <div style={{ flex: 1, padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <img 
          src="https://cdn.triloker.com/d:300/company/logo/20210921/9649d776c2a8dd32c3efd760d7e07fc0ac8ee0e31632215077.jpg" 
          alt="Logo" 
          style={{ display: "block", margin: "0 auto", width: "150px" }}
        />
          <Title level={2} style={{ textAlign: "center", marginBottom: "0.5rem", marginTop: "-30px" }}>Dashboard Monitoring Quality Control</Title>
          <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: "1.5rem" }}>
            Masuk ke akun Anda
          </Text>

          <Form form={form} layout="vertical" onFinish={handleLogin}>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Masukkan email yang valid!" }]}>
              <Input placeholder="Masukkan Email anda" />
            </Form.Item>
            <Form.Item name="password" label="Kata Sandi" rules={[{ required: true, message: "Password wajib diisi!" }]}>
              <Input.Password placeholder="Masukkan kata sandi anda" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block style={{fontWeight: 'bold' }}>Login</Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Text>Belum memiliki akun? </Text>
            <Link to="/register">Daftar di sini</Link>
          </div>
        </div>

        {/* Bagian Kanan: Ilustrasi */}
        {!isMobile && (
          <div style={{ flex: 1, display: "flex", background: "#F3E1E6", overflow: "hidden" }}>
            <img 
              src="https://ntc.co.id/wp-content/uploads/2024/08/login.png" 
              alt="Illustration" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
