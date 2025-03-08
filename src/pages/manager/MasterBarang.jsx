import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Upload, message, Image } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { getGoodsAll } from "../../api/goodsApi";
import api from "../../api/axiosInstance";

const MasterBarang = () => {
  const [goods, setGoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchGoods();
  }, []);

  const fetchGoods = async () => {
    setLoading(true);
    try {
      const response = await getGoodsAll()
      setGoods(response);
    } catch (error) {
      message.error("Gagal mengambil data barang");
    }
    setLoading(false);
  };

  const handleAddGoods = async (values) => {
    const formData = new FormData();
    formData.append("sku_code", values.sku_code);
    formData.append("name", values.name);
    formData.append("description", values.description);
    if (values.photo) {
      formData.append("photo", values.photo.file);
    }

    try {
      setLoading(true);
      await api.post("/goods", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Barang berhasil ditambahkan");
      setIsModalOpen(false);
      form.resetFields();
      fetchGoods();
    } catch (error) {
      message.error("Gagal menambahkan barang");
    } finally {
      setLoading(false)
    }
  };

  const columns = [
    {
      title: "No",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "SKU",
      dataIndex: "sku_code",
      key: "sku_code",
    },
    {
      title: "Nama Barang",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Deskripsi",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Foto",
      dataIndex: "photo_url", 
      key: "photo_url",
      render: (text) =>
        text ? (
          <Image
            src={text}
            alt="foto"
            width={50}
            height={50}
            style={{ objectFit: 'cover' }}
            preview={{
              maskClassName: 'customize-mask',
              mask: <div>Preview</div>
            }}
          />
        ) : "-",
    },
  ];

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
        Master Barang
      </Button>
      <Table columns={columns} dataSource={goods} rowKey="_id" loading={loading} style={{ marginTop: 20 }} />
      
      <Modal
        title="Tambah Master Barang"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        loading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleAddGoods}>
          <Form.Item name="sku_code" label="SKU Code" rules={[{ required: true, message: "Harap isi SKU" }]}>
            <Input placeholder="Masukkan SKU" />
          </Form.Item>
          <Form.Item name="name" label="Nama Barang" rules={[{ required: true, message: "Harap isi Nama Barang" }]}>
            <Input placeholder="Masukkan Nama Barang" />
          </Form.Item>
          <Form.Item name="description" label="Deskripsi">
            <Input.TextArea placeholder="Masukkan Deskripsi" />
          </Form.Item>
          <Form.Item name="photo" label="Foto">
            <Upload beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>Upload Foto</Button>
            </Upload>
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Simpan
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default MasterBarang;