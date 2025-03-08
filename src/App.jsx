import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import './index.css'
import OfficerLayout from "./pages/officer/Layout";
import SubmitLaporan from "./pages/officer/SubmitLaporan";
import ListLaporan from "./pages/officer/ListLaporan";
import ManajemenAkun from "./pages/officer/ManajemenAkun";
import DetailLaporan from "./pages/officer/DetailLaporan";
import UpdateLaporan from "./pages/officer/UpdateLaporan";
import UpdateProfile from "./pages/officer/UpdateProfile";
import NotFoundPage from "./pages/NotFoundPage";
import VerificationPage from "./pages/officer/VerificationPage";
import RejectedPage from "./pages/officer/RejectedPage";
import ManagerLayout from "./pages/manager/Layout";
import Analitik from "./pages/manager/Analitik";
import LaporanQC from "./pages/manager/LaporanQC";
import MasterBarang from "./pages/manager/MasterBarang";
import Karyawan from "./pages/manager/Karyawan";
import DetailLaporanManager from "./pages/manager/DetailLaporan";
import ForbiddenPage from "./pages/ForbiddenPage";
import ProtectedRoute from "./pages/officer/ProtectedRoute";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/officer" element={<ProtectedRoute> <OfficerLayout /></ProtectedRoute> }>
          <Route path="submit" element={<SubmitLaporan />} />
          <Route path="account" element={<ManajemenAkun />} />
          <Route path="account/update" element={<UpdateProfile />} />
          <Route path="report" element={<ListLaporan />} />
          <Route path="report/:id" element={<DetailLaporan />} />
          <Route path="report/update/:id" element={<UpdateLaporan />} />
        </Route>

        <Route path="/manager" element={<ManagerLayout />}>
          <Route path="analytics" element={<Analitik />} />
          <Route path="reports" element={<LaporanQC />} />
          <Route path="reports/:id" element={<DetailLaporanManager />} />
          <Route path="goods" element={<MasterBarang />} />
          <Route path="employees" element={<Karyawan />} />
        </Route>;

        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/rejected" element={<RejectedPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />


        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;