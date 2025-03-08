import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, Select, DatePicker, message, Image } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import useGoodsStore from "../../store/useGoodsStore";
import { createQCReport } from "../../api/qcReportApi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Option } = Select;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const SubmitLaporan = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    report_notes: "",
    report_date: dayjs().toISOString(), // Default ke hari ini dalam format ISO
    items: [{ goods_id: "", approved_count: 0, rejected_count: 0 }],
    photos: [],
  });

  const { goods, fetchGoods } = useGoodsStore();
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGoods();
  }, [fetchGoods]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleDateChange = (date) => {
    handleChange("report_date", date ? date.toISOString() : "");
  };

  const handleUploadChange = async ({ fileList }) => {
    setFileList(fileList);
    const base64Images = await Promise.all(fileList.map((file) => getBase64(file.originFileObj)));
    setFormData((prev) => ({
      ...prev,
      photos: base64Images,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createQCReport(formData);
      message.success("Laporan berhasil dikirim!");
      setFormData({
        title: "",
        description: "",
        report_notes: "",
        report_date: dayjs().toISOString(),
        items: [{ goods_id: "", approved_count: 0, rejected_count: 0 }],
        photos: [],
      });
      setFileList([]);
      navigate("/officer/report");
    } catch (error) {
      message.error("Gagal mengirim laporan.");
      console.error("Error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { goods_id: "", approved_count: 0, rejected_count: 0 }],
    }));
  };

  return (
    <div style={{ padding: "2rem", background: "#fff", borderRadius: "8px" }}>
      <h2 style={{ textAlign: "center" }}>Submit Laporan</h2>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Judul Laporan" required>
          <Input value={formData.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="Masukkan judul laporan" />
        </Form.Item>
        <Form.Item label="Deskripsi">
          <Input.TextArea value={formData.description} onChange={(e) => handleChange("description", e.target.value)} rows={4} placeholder="Masukkan deskripsi laporan" />
        </Form.Item>
        <Form.Item label="Catatan QC">
          <Input.TextArea value={formData.report_notes} onChange={(e) => handleChange("report_notes", e.target.value)} rows={2} placeholder="Tambahkan catatan" />
        </Form.Item>
        <Form.Item label="Tanggal Laporan" required>
          <DatePicker onChange={handleDateChange} value={dayjs(formData.report_date)} style={{ width: "100%" }} />
        </Form.Item>
        {formData.items.map((item, index) => (
          <div key={index} style={{ marginBottom: "1rem", border: "1px solid #ddd", padding: "1rem", borderRadius: "4px", position: "relative" }}>
            <Form.Item label={`Item Laporan ${index + 1}`} required>
              <Select value={item.goods_id} onChange={(value) => handleItemChange(index, "goods_id", value)} placeholder="Pilih item">
                {goods.map((good) => (
                  <Option key={good._id} value={good._id}>{good.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Jumlah Disetujui" required>
              <Input type="number" value={item.approved_count} onChange={(e) => handleItemChange(index, "approved_count", Number(e.target.value))} placeholder="Masukkan jumlah" />
            </Form.Item>
            <Form.Item label="Jumlah Ditolak" required>
              <Input type="number" value={item.rejected_count} onChange={(e) => handleItemChange(index, "rejected_count", Number(e.target.value))} placeholder="Masukkan jumlah" />
            </Form.Item>
            {index !== 0 && (
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeItem(index)}
                style={{ position: "absolute", top: 0, right: 0 }}
              />
            )}
          </div>
        ))}
        <Button onClick={addItem} block variant="dashed">+ Tambah Item Laporan</Button>
        <Form.Item label="Upload Foto">
          <Upload listType="picture-card" fileList={fileList} onChange={handleUploadChange} beforeUpload={() => false}>
            {fileList.length < 5 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tambahkan Foto</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>Kirim Laporan</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SubmitLaporan;
