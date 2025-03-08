import { useState } from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/userApi";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const res = await register(values.name, values.email, values.password, values.id_number);
      message.success("Registrasi berhasil, silakan login.");
      navigate("/login");
    } catch (error) {
      message.error(error.response?.data?.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#fff", padding: "1rem" }}>
      <div style={{ maxWidth: 500, width: "100%", padding: "3rem", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <img 
          src="https://cdn.triloker.com/d:300/company/logo/20210921/9649d776c2a8dd32c3efd760d7e07fc0ac8ee0e31632215077.jpg" 
          alt="Logo" 
          style={{ display: "block", margin: "0 auto", width: "150px", marginBottom: "1rem" }}
        />
        <Title level={2} style={{ textAlign: "center", color: "#333", marginTop: '-50px' }}>Daftar Akun</Title>
        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item name="name" label="Nama Lengkap" rules={[{ required: true, message: "Nama wajib diisi" }]}> 
            <Input placeholder="Masukkan nama lengkap" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Masukkan email yang valid" }]}> 
            <Input placeholder="Masukkan email" />
          </Form.Item>
          <Form.Item name="password" label="Kata Sandi" rules={[{ required: true, min: 6, message: "Minimal 6 karakter" }]}> 
            <Input.Password placeholder="Masukkan kata sandi" />
          </Form.Item>
          <Form.Item name="id_number" label="Nomor Induk Karyawan" rules={[{ required: true, message: "ID Number wajib diisi" }]}> 
            <Input placeholder="Masukkan nomor induk karyawan" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block style={{ fontWeight: "bold" }}>Daftar</Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: "center" }}>
          <Text>Sudah memiliki akun? </Text>
          <Link to="/login">Login di sini</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;