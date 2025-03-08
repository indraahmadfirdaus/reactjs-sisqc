import React, { useEffect, useState } from "react";
import { Card, Col, message, Row, Spin } from "antd";
import api from "../../api/axiosInstance";
import { LineChartComponent, PieChartComponent, BarChartComponent } from "../components/Chart";

const Analitik = () => {
  const [loading, setLoading] = useState(true);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [officerPerformance, setOfficerPerformance] = useState([]);
  const [approvalRatio, setApprovalRatio] = useState([]);
  const [topRejectedItems, setTopRejectedItems] = useState([]);
  const [topApprovedItems, setTopApprovedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [monthly, officers, ratio, rejected, approved] = await Promise.all([
          api.get("/analytics/monthly-stats"),
          api.get("/analytics/officer-performance"),
          api.get("/analytics/approval-ratio"),
          api.get("/analytics/top-rejected-items"),
          api.get("/analytics/top-approved-items"),
        ]);

        setMonthlyStats(monthly.data.data);
        setOfficerPerformance(officers.data.data);
        setApprovalRatio(ratio.data.data);
        setTopRejectedItems(rejected.data.data);
        setTopApprovedItems(approved.data.data);
      } catch (error) {
        message.error("Gagal mengambil data analitik");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Spin spinning={loading}>
      <div style={{ padding: "24px" }}>
        {/* Statistik Laporan Bulanan & Rasio Persetujuan */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="Statistik Laporan Bulanan">
              <LineChartComponent data={monthlyStats} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Rasio Persetujuan Laporan">
              <PieChartComponent data={approvalRatio} />
            </Card>
          </Col>
        </Row>

        {/* Performa Petugas */}
        <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
          <Col span={24}>
            <Card title="Performa Petugas">
              <BarChartComponent data={officerPerformance} dataKey="totalReports" xDataKey={"reporterName"} color="#8884d8" />
            </Card>
          </Col>
        </Row>

        {/* Barang Paling Banyak Disetujui & Ditolak */}
        <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
          <Col xs={24} md={12}>
            <Card title="Barang Paling Banyak Ditolak">
              <BarChartComponent data={topRejectedItems} dataKey="totalRejected" xDataKey={"goodsName"} color="#FF4D4F" />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Barang Paling Banyak Disetujui">
              <BarChartComponent data={topApprovedItems} dataKey="totalApproved" xDataKey={"goodsName"} color="#52C41A" />
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default Analitik;