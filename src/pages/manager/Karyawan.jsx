import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Avatar, Tag, message } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { getAllUsers } from "../../api/userApi";
import api from "../../api/axiosInstance";

const Karyawan = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ visible: false, action: "", employee: null });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers()
      setEmployees(response);
    } catch (error) {
      message.error("Gagal memuat data karyawan");
    }
    setLoading(false);
  };

  const handleApproveReject = async (employeeId, status) => {
    try {
      setLoading(true)
      await api.put(`/users/approval/${employeeId}`, { status: status });
      message.success(`Karyawan ${status.toLowerCase()}!`);
      fetchEmployees();
    } catch (error) {
      message.error("Gagal memperbarui status karyawan");
    } finally {
      setLoading(false)
    }
    setConfirmModal({ visible: false, action: "", employee: null });
  };

  const columns = [
    {
      title: "No",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Foto",
      dataIndex: "photo_url",
      key: "photo_url",
      render: (text) => <Avatar src={text} size={50} />,
    },
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status Registrasi",
      dataIndex: "registration_status",
      key: "registration_status",
      render: (status) => (
        <Tag color={status === "APPROVED" ? "green" : status === "PENDING" ? "yellow" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      render: (_, record) => (
        <>
          {record.registration_status === "PENDING" && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() =>
                  setConfirmModal({ visible: true, action: "APPROVED", employee: record })
                }
              >
                Approve
              </Button>
              <Button
                type="primary"
                danger
                icon={<CloseCircleOutlined />}
                style={{ marginLeft: 8 }}
                onClick={() =>
                  setConfirmModal({ visible: true, action: "REJECTED", employee: record })
                }
              >
                Reject
              </Button>
            </>

          )}

        </>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={employees} rowKey="_id" loading={loading} />

      {/* Modal Konfirmasi */}
      <Modal
        title={`Konfirmasi ${confirmModal.action}`}
        visible={confirmModal.visible}
        onOk={() => handleApproveReject(confirmModal.employee._id, confirmModal.action)}
        onCancel={() => setConfirmModal({ visible: false, action: "", employee: null })}
      >
        <p>
          Apakah Anda yakin ingin {confirmModal.action.toLowerCase()} akun "{confirmModal.employee?.name}"?
        </p>
      </Modal>
    </div>
  );
};

export default Karyawan;
