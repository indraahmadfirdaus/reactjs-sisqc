import { Button, Result } from "antd";

const NotFoundPage = () => (
    <Result
        status="404"
        title="404"
        subTitle="Halaman yang Anda cari tidak ditemukan."
        extra={<Button type="primary" href="/officer/report">Kembali ke Dashboard</Button>}
    />
);

export default NotFoundPage;
