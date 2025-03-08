import React from 'react';
import { Button, message, Result } from 'antd';
import useUserStore from '../../store/useUserStore';
import { useNavigate } from 'react-router-dom';

const RejectedPage = () => {
  const { logout } = useUserStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout();
    message.success("Berhasil logout");
    navigate("/login");
  };

  return <Result
    status="500"
    title="Akun Rejected"
    subTitle="Silahkan hubungi Manager untuk verifikasi manual."
    extra={
      <Button type="primary" danger key="console" onClick={handleLogout}>
        Logout
      </Button>
    }
  />
}

export default RejectedPage;