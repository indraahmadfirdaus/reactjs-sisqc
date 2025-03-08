import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Avatar, message, Spin } from "antd";
import useUserStore from "../../store/useUserStore";

const ManajemenAkun = () => {
  const { user, fetchUserProfile, logout, loading } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  const handleLogout = () => {
    logout();
    message.success("Berhasil logout");
    navigate("/login");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>User data tidak ditemukan.</p>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "auto" }}>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Avatar size={64} src={user.photo_url} />
          <div>
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>NIK: {user.id_number || "-"}</p>
            <p>Status Akun: {user.registration_status}</p>
          </div>
        </div>
        <Button type="primary" block onClick={() => navigate("/officer/account/update")} style={{ marginTop: "10px" }}>
          Update Profile
        </Button>
        <Button danger block onClick={handleLogout} style={{ marginTop: "10px" }}>
          Logout
        </Button>
      </Card>
    </div>
  );
};

export default ManajemenAkun;
