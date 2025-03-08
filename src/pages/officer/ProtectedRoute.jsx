import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { message, Spin } from "antd";
import useUserStore from "../../store/useUserStore";

const ProtectedRoute = ({ children }) => {
  const { user, loading, fetchUserProfile } = useUserStore();
  const [isFetching, setIsFetching] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        await fetchUserProfile();
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        message.error("Gagal memuat data pengguna");
      } finally {
        setIsFetching(false);
      }
    };

    checkUser();
  }, [fetchUserProfile]);

  if (loading || isFetching) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    message.error("Silakan login terlebih dahulu");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle redirection based on user role & status
  if (user.registration_status === "PENDING") return <Navigate to="/verification" replace />;
  if (user.registration_status === "REJECTED") return <Navigate to="/rejected" replace />;

  return children;
};

export default ProtectedRoute;
