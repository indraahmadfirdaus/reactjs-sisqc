import React, { useEffect } from "react";
import { Card, Table, Tag, Image, Button, message, Breadcrumb } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import useQCReportStore from "../../store/useQCReportStore";

const DetailLaporan = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentReport, fetchReportById, loading } = useQCReportStore();

    useEffect(() => {
        fetchReportById(id);
    }, [id, fetchReportById]);

    if (loading) return <p>Loading...</p>;
    // if (error) return <p style={{ color: "red" }}>Gagal mengambil data laporan: {error}</p>;
    if (!currentReport) return <p>Tidak ada data laporan.</p>;

    const getStatusTag = (status) => {
        const color = status === "APPROVED" ? "green" : status === "REJECTED" ? "red" : "yellow";
        return <Tag color={color}>{status}</Tag>;
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
        <div style={{ padding: "2rem", background: "#fff", borderRadius: "8px" }}>
            <Breadcrumb
                separator=">"
                items={[
                    { title: <Link to="/officer/report">List Laporan</Link> },
                    { title: "Detail Laporan" },
                ]}
                style={{ marginBottom: '1rem' }}
            />
            <h2>Detail Laporan</h2>
            <Card title={currentReport.title} extra={getStatusTag(currentReport.approval_status)}>
                <p><strong>Deskripsi:</strong> {currentReport.description}</p>
                <p><strong>Catatan QC:</strong> {currentReport.report_notes}</p>
                <p><strong>Total Disetujui:</strong> {currentReport.approved_count}</p>
                <p><strong>Total Ditolak:</strong> {currentReport.rejected_count}</p>
                <p><strong>Tanggal:</strong> {new Date(currentReport.report_date).toLocaleDateString()}</p>
                {
                    currentReport.approval_status === "REJECTED" && (
                        <>
                            <p><strong>Alasan Ditolak:</strong> {currentReport.approval_notes}</p>
                        </>
                    )
                }
            </Card>

            <h3>Daftar Barang</h3>
            <Table columns={columns} dataSource={currentReport.qcReportItems} rowKey="_id" />

            <h3>Foto Laporan</h3>
            <div>
                {currentReport.photo_urls.map((url, index) => (
                    <Image key={index} width={100} src={url} style={{ marginRight: 10 }} />
                ))}
            </div>

            {currentReport.approval_status !== "APPROVED" && (
                <Button type="primary" onClick={() => navigate(`/officer/report/update/${currentReport._id}`)} style={{ marginTop: 20 }}>
                    Update Laporan
                </Button>
            )}
        </div>
    );
};

export default DetailLaporan;
