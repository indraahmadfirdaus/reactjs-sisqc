import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Upload, message, Avatar } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import useUserStore from "../../store/useUserStore";
import { updateUserProfile } from "../../api/userApi";

const AccountSettingsModal = ({ visible, onClose }) => {
  const { user, fetchUserProfile } = useUserStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    id_number: "",
  });

  // Saat modal dibuka, update state lokal dengan data user
  useEffect(() => {
    if (visible && user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        id_number: user.id_number || "",
      });
    }
  }, [visible, user]);

  const handleUpdate = async () => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      await updateUserProfile(formData);
      message.success("Profil berhasil diperbarui!");
      await fetchUserProfile();
      onClose();
    } catch (error) {
      message.error("Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  const previewUrl = photo ? URL.createObjectURL(photo) : user?.photo_url;

  return (
    <Modal
      title="Pengaturan Akun"
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form layout="vertical" onFinish={handleUpdate}>
        {/* Avatar */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem", position: "relative" }}>
          <Avatar size={100} src={previewUrl} />
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              setPhoto(file);
              return false;
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                background: "rgba(0,0,0,0.5)",
                borderRadius: "50%",
                padding: "5px",
                cursor: "pointer",
              }}
            >
              <CameraOutlined style={{ color: "white", fontSize: "18px" }} />
            </div>
          </Upload>
        </div>

        {/* Form Inputs */}
        <Form.Item label="Nama Lengkap" rules={[{ required: true }]}>
          <Input value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
        </Form.Item>
        <Form.Item label="Email">
          <Input value={userData.email} disabled />
        </Form.Item>
        <Form.Item label="Nomor Induk Karyawan">
          <Input value={userData.id_number} onChange={(e) => setUserData({ ...userData, id_number: e.target.value })} />
        </Form.Item>
        <Form.Item label="Password Baru">
          <Input.Password placeholder="Kosongkan jika tidak ingin mengubah password" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AccountSettingsModal;
