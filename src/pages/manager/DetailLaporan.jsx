import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Image, Button, message, Breadcrumb, Modal, Input } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import useQCReportStore from "../../store/useQCReportStore";
import { approvalQcReport } from "../../api/qcReportApi";

const DetailLaporan = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentReport, fetchReportById, loading } = useQCReportStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [approvalStatus, setApprovalStatus] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        fetchReportById(id);
    }, [id, fetchReportById]);

    if (loading) return <p>Loading...</p>;
    if (!currentReport) return <p>Tidak ada data laporan.</p>;

    const getStatusTag = (status) => {
        const color = status === "APPROVED" ? "green" : status === "REJECTED" ? "red" : "gold";
        return <Tag color={color}>{status}</Tag>;
    };

    const handleSubmitApproval = async () => {
        if (!approvalStatus) {
            message.warning("Pilih status terlebih dahulu");
            return;
        }

        const res = await approvalQcReport(id, {
            approval_status: approvalStatus,
            approval_notes: rejectReason,
        });

        if (res.success) {
            message.success(`Laporan berhasil ${approvalStatus.toLowerCase()}`);
            fetchReportById(id);
        } else {
            message.error(res.message || "Gagal melakukan approval");
        }
        setIsModalOpen(false);
        setApprovalStatus(null);
    };

    const columns = [
        {
            title: "Nama Barang",
            dataIndex: ["goods_id", "name"],
            key: "name",
        },
        {
            title: "Jumlah Disetujui",
            dataIndex: "approved_count",
            key: "approved_count",
        },
        {
            title: "Jumlah Ditolak",
            dataIndex: "rejected_count",
            key: "rejected_count",
        }
    ];

    return (
        <div style={{ background: "#fff" }}>
            <Breadcrumb separator=">">
                <Breadcrumb.Item><Link to="/manager/reports">List Laporan</Link></Breadcrumb.Item>
                <Breadcrumb.Item>Detail Laporan</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ marginTop: 20, marginBottom: 20, display: "flex" }}>
                <h2>Detail Laporan</h2>
                {currentReport.approval_status === 'SUBMITTED' ? (
                    <>
                        <Button style={{ marginLeft: "auto" }} type="primary" onClick={() => { setApprovalStatus("APPROVED"); setIsModalOpen(true); }}>Approve</Button>
                        <Button type="primary" danger style={{ marginLeft: 10 }} onClick={() => { setApprovalStatus("REJECTED"); setIsModalOpen(true); }}>Reject</Button>
                    </>
                ) : null}
            </div>
            <Card title={currentReport.title} extra={getStatusTag(currentReport.approval_status)}>
                <p><strong>Deskripsi:</strong> {currentReport.description}</p>
                <p><strong>Catatan QC:</strong> {currentReport.report_notes}</p>
                <p><strong>Total Disetujui:</strong> {currentReport.approved_count}</p>
                <p><strong>Total Ditolak:</strong> {currentReport.rejected_count}</p>
                <p><strong>Tanggal:</strong> {new Date(currentReport.report_date).toLocaleDateString()}</p>
                {currentReport.approval_status === 'REJECTED' ? (
                    <p><strong>Alasan Penolakan:</strong> {currentReport.approval_notes}</p>
                ) : null}
            </Card>
            <h3>Daftar Barang</h3>
            <Table columns={columns} dataSource={currentReport.qcReportItems} rowKey="_id" />
            <h3>Foto Laporan</h3>
            <div>
                {currentReport.photo_urls.map((url, index) => (
                    <Image key={index} width={100} src={url} style={{ marginRight: 10 }} />
                ))}
            </div>
            <Modal
                title={approvalStatus === "APPROVED" ? "Konfirmasi Approve" : "Konfirmasi Reject"}
                open={isModalOpen}
                onOk={handleSubmitApproval}
                onCancel={() => setIsModalOpen(false)}
            >
                {approvalStatus === "REJECTED" && (
                    <Input.TextArea
                        rows={3}
                        placeholder="Masukkan alasan penolakan"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                )}
                <p>Apakah Anda yakin ingin {approvalStatus === "APPROVED" ? "menyetujui" : "menolak"} laporan ini?</p>
            </Modal>
        </div>
    );
};

export default DetailLaporan;
