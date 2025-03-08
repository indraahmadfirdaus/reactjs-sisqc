import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Upload, message, Breadcrumb, Avatar } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import useUserStore from "../../store/useUserStore";
import axios from "axios";
import { updateUserProfile } from "../../api/userApi";

const UpdateProfile = () => {
    const [form] = Form.useForm();
    const { user, fetchUserProfile, } = useUserStore();
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user.name,
                email: user.email,
                id_number: user.id_number,
            });
        }
    }, [user, form]);

    const handleUpdate = async (values) => {
        setLoading(true);
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if(value) {
                formData.append(key, value);
            }
        });
        if (photo) {
            formData.append("photo", photo);
        }

        try {
            await updateUserProfile(formData);
            message.success("Profil berhasil diperbarui!");
            fetchUserProfile();
            navigate("/officer/account");
        } catch (error) {
            message.error("Gagal memperbarui profil");
        }
        setLoading(false);
    };

    // Generate URL untuk preview jika ada file yang dipilih
    const previewUrl = photo ? URL.createObjectURL(photo) : user?.photo_url;

    return (
        <div style={{ padding: "2rem", maxWidth: "500px", margin: "auto", background: '#fff' }}>
            <Breadcrumb
                separator=">"
                items={[
                    { title: <Link to="/officer/account">Manajemen Akun</Link> },
                    { title: 'Update Profile' },
                ]}
                style={{ marginBottom: '1rem' }}
            />
            <h2>Update Profile</h2>
            <Form form={form} layout="vertical" onFinish={handleUpdate}>
                {/* Avatar dengan icon Kamera */}
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

                <Form.Item name="name" label="Nama Lengkap" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                    <Input disabled />
                </Form.Item>
                <Form.Item name="id_number" label="Nomor Induk Karyawan">
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Password Baru">
                    <Input.Password placeholder="Kosongkan jika tidak ingin mengubah password" />
                </Form.Item>
                
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>Update</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateProfile;
