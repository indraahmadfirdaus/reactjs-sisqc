import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Select, message, Input, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { approvalQcReport, getQCReportsAll } from "../../api/qcReportApi";
import dayjs from "dayjs";

import 'dayjs/locale/id';

// Set the locale to Indonesian
dayjs.locale('id');

const { Option } = Select;

const LaporanQC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getQCReportsAll();
      setData(response);
    } catch (error) {
      message.error("Gagal mengambil data laporan QC");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const handleSubmitApproval = async (id) => {
    if (!approvalStatus) {
      message.warning("Pilih status terlebih dahulu");
      return;
    }

    const res = await approvalQcReport(id, {
      approval_status: approvalStatus,
      approval_notes: rejectionReason
    })

    if (res.success) {
      message.success(`Laporan ${selectedReport.title} telah ${approvalStatus.toLowerCase()}`);
      await fetchData();
    } else {
      message.error(res.message || 'Gagal melakukan approval')
    }
    setModalVisible(false);
    setApprovalStatus(null);

  };

  const getStatusTag = (status) => {
    switch (status) {
      case "SUBMITTED":
        return <Tag color="gold">SUBMITTED</Tag>;
      case "APPROVED":
        return <Tag color="green">APPROVED</Tag>;
      case "REJECTED":
        return <Tag color="red">REJECTED</Tag>;
      default:
        return <Tag>UNKNOWN</Tag>;
    }
  };

  const columns = [
    {
      title: "No",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Judul Laporan",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Tanggal Laporan",
      dataIndex: "report_date",
      key: "report_date",
      render: (date) => {
        return dayjs(date).format('DD MMMM YYYY')
      }
    },
    {
      title: "Pelapor",
      dataIndex: ["reporter_id", "name"],
      key: "reporter",
    },
    {
      title: "Total Disetujui",
      dataIndex: "approved_count",
      key: "approved_count",
    },
    {
      title: "Total Ditolak",
      dataIndex: "rejected_count",
      key: "rejected_count",
    },
    {
      title: "Status Approval",
      dataIndex: "approval_status",
      key: "approval_status",
      render: getStatusTag
    },
    {
      title: "Aksi",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => navigate(`/manager/reports/${record._id}`)}>Detail</Button>
          {
            record.approval_status === 'SUBMITTED' ? (<Button type="primary" onClick={() => handleApproval(record)} style={{ marginLeft: 8 }}>
              Approve / Reject
            </Button>) : null
          }

        </>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="_id" />

      {/* Modal Approval */}
      <Modal
        title="Approval Laporan QC"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => handleSubmitApproval(selectedReport._id)}
        loading={loading}
      >
        {/* {JSON.stringify(selectedReport._id)} */}
        <p>Pilih status approval untuk laporan ini:</p>
        <Select style={{ width: "100%" }} onChange={(value) => setApprovalStatus(value)}>
          <Option value="APPROVED">Disetujui</Option>
          <Option value="REJECTED">Ditolak</Option>
        </Select>

        {approvalStatus === "REJECTED" && (
          <div style={{ marginTop: 16 }}>
            <p>Alasan Penolakan:</p>
            <Input.TextArea
              rows={4}
              placeholder="Masukkan alasan penolakan"
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default LaporanQC;