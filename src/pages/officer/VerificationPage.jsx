import { Button, Result } from "antd";

const VerificationPage = () => (
    <Result
        status="403"
        title="Akun Belum Diverifikasi"
        subTitle="Silakan menunggu verifikasi dari manager."
        extra={<Button type="primary" href="/officer/report">Refresh Halaman</Button>}
    />
);

export default VerificationPage;