import React, { useEffect } from "react";
import { Card, Button, Tag, message, Table } from "antd";
import { useNavigate } from "react-router-dom";
import useQCReportStore from "../../store/useQCReportStore";
import useUserStore from "../../store/useUserStore";

const ListLaporan = () => {
  const { reports, fetchReports } = useQCReportStore();
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports(user._id);
  }, [fetchReports, user._id]);

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
      title: "Total Approved",
      dataIndex: "approved_count",
      key: "approved_count",
    },
    {
      title: "Total Rejected",
      dataIndex: "rejected_count",
      key: "rejected_count",
    },
    {
      title: "Status",
      dataIndex: "approval_status",
      key: "approval_status",
      render: getStatusTag,
    },
    {
      title: "Tanggal",
      dataIndex: "report_date",
      key: "report_date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Aksi",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <Button type="link" onClick={() => navigate(`/officer/report/${record._id}`)}>Detail</Button>
          {record.approval_status !== "APPROVED" && (
            <Button type="link" onClick={() => navigate(`/officer/report/update/${record._id}`)} style={{ color: "orange" }}>Update</Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "2rem", background: "#fff", borderRadius: "8px" }}>
      <h2 style={{ textAlign: "center" }}>List Laporan</h2>
      <Table columns={columns} dataSource={reports} rowKey="_id" scroll={{ x: 800 }} />
    </div>
  );
};

export default ListLaporan;