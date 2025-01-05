import { Container } from "react-bootstrap";
import AnalyticsCard from "../components/AnalyticsCard";
import quotationsCountPic from "../../../assets/analytics/quotationsCount.png";
import totalSpentPic from "../../../assets/analytics/totalSpent.png";
import projectedProfitPic from "../../../assets/analytics/clock.png";
import issuesReportedPic from "../../../assets/analytics/sadFace.png";
import { useAuth } from "../../Providers";
import { useEffect, useState } from "react";
import adminDetailsApi from "../../../api/adminAPIs/adminDetails";
import LoadingScreen from "../../Common/LoadingScreen";

const Dashboard = () => {
  const { user, userData, setUser, setUserData } = useAuth();
  const [loading, setLoading] = useState(!userData);
  const [error, setError] = useState(null);

  const fetchAdminData = async () => {
    const userId = { userId: parseInt(user.userId) };
    try {
      const response = await adminDetailsApi.getAdminDetails(userId);
      if (response?.token === "failed") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userData");
        setUser(null);
        setUserData(null);
        window.location.href = "/login";
        return;
      }
      if (response.body?.success) {
        const newUserData = {
          ...user,
          ...response.body.adminDashboard,
        };
        setUserData(newUserData);
        console.log(newUserData);
      } else {
        setError("Failed to fetch admin data.");
      }
    } catch (err) {
      setError(`Failed to fetch admin data. ${err}`);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await fetchAdminData();
      setLoading(false);
    };

    initializeData();
  }, []);

  if (loading) return <LoadingScreen />;
  return (
    <Container>
      <h3 className="fw-bold">Dashboard</h3>
      <div className="d-flex gap-5 px-0 py-3 pb-4">
        <AnalyticsCard
          img={quotationsCountPic}
          bgColor="#B9D9DD"
          imgBgColor="#2C8C99"
          label="Quotations Count"
          data={userData.insights.analyticsResult.Quotations}
        />
        <AnalyticsCard
          img={totalSpentPic}
          bgColor="#FFF4DE"
          imgBgColor="#FF947A"
          label="Total Spent"
          data="3K"
        />
        <AnalyticsCard
          img={projectedProfitPic}
          bgColor="#F3E8FF"
          imgBgColor="#BF83FF"
          label="Projected Profit"
          data="3K"
        />
        <AnalyticsCard
          img={issuesReportedPic}
          bgColor="#FFE2E5"
          imgBgColor="#FA5A7D"
          label="Issues Reported"
          data="0"
        />
      </div>
    </Container>
  );
};

export default Dashboard;
