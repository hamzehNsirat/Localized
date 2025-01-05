import "bootstrap/dist/css/bootstrap.min.css";
import pic from "../../../assets/user.png";

import ManagementSection from "../components/ManagmentSection.jsx";
import { FaUserCircle, FaStore, FaQuestionCircle } from "react-icons/fa";
import { Container, Form } from "react-bootstrap";
import AppColors from "../../Theme/AppColors.jsx";
import { useEffect, useState } from "react";
import { useAuth } from "../../Providers/authProvider.jsx";
import LoadingScreen from "../../Common/LoadingScreen.jsx";
import retailerApi from "../../../api/retailerAPIs/retailer.js";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../Common/CustomButton.jsx";
import AnalyticsCard from "../../Common/AnalyticsCard.jsx";

import quotationsCountPic from "../../../assets/analytics/quotationsCount.png";
import totalSpentPic from "../../../assets/analytics/totalSpent.png";
import projectedProfitPic from "../../../assets/analytics/clock.png";
import issuesReportedPic from "../../../assets/analytics/sadFace.png";
import complianceRatePic from "../../../assets/analytics/tag.png";
import BarChart from "../../Models/BarChart.jsx";
import PieChart from "../../Models/PieChart.jsx";

/* 
  to fetch basic data: { userType:,userId:,} returns { retId and other things }
  getProfileBarProgress: { userId: } returns number
  getEstBarProgress: { userId: } returns number
  getInsights: postponed,
  getNotifications: {retId}
  */

const Dashboard = () => {
  const { user, userData, setUserData, setUser } = useAuth();
  const [loading, setLoading] = useState(!userData); // when its null it will be loading to fetch the data
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [chartTitle, setChartTitle] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [selectedCard, setSelectedCard] = useState("1");
  const [analyticsTime, setAnalyticsTime] = useState("All Time");

  const analyticsMapping = {
    "All Time": "allTime",
    "Last Year": "oneYear",
    "Last 9 Months": "nineMonths",
    "Last 6 Months": "sixMonths",
    "Last 3 Months": "threeMonths",
  };

  const handleSelectedCard = (idx) => {
    setSelectedCard(idx);
  };

  const fetchRetailerData = async () => {
    const userId = parseInt(user.userId);
    try {
      const response = await retailerApi.getRetailerAllDetails(userId);
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
          ...response.body.retailerDashboard,
        };
        setUserData(newUserData);
        console.log(newUserData);
      } else {
        setError("Failed to fetch retailer data.");
      }
    } catch (err) {
      setError(`Failed to fetch retailer data. ${err}`);
    }
  };

  const fetchChartData = () => {
    const selectedTimeKey = analyticsMapping[analyticsTime];
    if (!userData) return;

    const insights = userData?.Insights?.analyticsResult || {};
    console.log("insights: ", insights);
    switch (selectedCard) {
      case "1": // Quotations Count (Bar Chart)
        const quotations = insights?.quotations?.[selectedTimeKey] || {};
        setChartData([
          { type: "Requested", value: parseInt(quotations.requested) || 0 },
          { type: "Confirmed", value: parseInt(quotations.confirmed) || 0 },
          { type: "Completed", value: parseInt(quotations.completed) || 0 },
        ]);
        setChartTitle(`Quotations Count - ${analyticsTime}`);
        setChartType("bar");
        break;

      case "2": // Total Spend (Bar Chart)
        const totalSpent = insights?.totalSpent || 0;
        setChartData([{ type: "Total Spent", value: totalSpent }]);
        setChartTitle(`Total Spend - ${analyticsTime}`);
        setChartType("bar");
        break;

      case "3": // Projected Profit (Bar Chart)
        const projectedProfit =
          insights?.expectedProfit?.[selectedTimeKey] || 0;
        setChartData([{ type: "Projected Profit", value: projectedProfit }]);
        setChartTitle(`Projected Profit - ${analyticsTime}`);
        setChartType("bar");
        break;

      case "4": // Issues Reported (Pie Chart)
        const issues = insights?.issuesReportedObj || {};
        setChartData([
          { type: "Unresolved", value: parseInt(issues.unresolved) || 0 },
          {
            type: "Resolved (No Penalty)",
            value: parseInt(issues.resolvedWithNoPenalty) || 0,
          },
          {
            type: "Resolved (Penalty)",
            value: parseInt(issues.penaltyResulted) || 0,
          },
        ]);
        setChartTitle(`Issues Reported - ${analyticsTime}`);
        setChartType("pie");
        break;

      case "5": // Compliance Rate (Pie Chart)
        const complianceIndicator = insights?.complianceIndicator || 0;
        setChartData([{ type: "Compliance Rate", value: complianceIndicator }]);
        setChartTitle(`Compliance Rate - ${analyticsTime}`);
        setChartType("pie");
        break;

      default:
        setChartData([]);
        setChartTitle("");
        setChartType("bar");
        break;
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await fetchRetailerData();
      fetchChartData();
      setLoading(false);
    };

    initializeData();
  }, [selectedCard, analyticsTime]);

  if (loading) return <LoadingScreen />;
  return (
    <>
      <div
        style={{ height: "100%", flexDirection: "column" }}
        className="container text-dark"
      >
        {error ? (
          <div>{error}</div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center gap-3 mt-5">
              <div>
                <h2 className="fw-bold">
                  Welcome, {userData.userDetails.firstName}!
                </h2>
                <h5>Complete your profile information</h5>
              </div>
              <div
                className="d-flex align-items-center"
                style={{ width: "max-content" }}
              >
                <img
                  src={userData.establishmentDetails.establishmentLogo || pic}
                  alt="Logo"
                  width="140px" // Adjust the size as needed
                  height="112px" // Ensures square shape for perfect circle
                  style={{
                    objectFit: "cover", // Ensures image maintains aspect ratio
                  }}
                />
              </div>
            </div>
            <Container className="mt-4 px-0 d-flex flex-column gap-3">
              {userData.progressBarUser.percentage != 100 && (
                <ManagementSection
                  icon={<FaUserCircle color={AppColors.primaryColor} />}
                  title="Manage Profile"
                  description="Complete your profile information"
                  buttonText="Manage"
                  progress={userData.progressBarUser.percentage}
                />
              )}
              {userData.progressBarEstablishment.percentage != 100 && (
                <ManagementSection
                  icon={<FaStore color={AppColors.primaryColor} />}
                  title="Manage Establishment"
                  description="Edit / Update information"
                  buttonText="Manage"
                  progress={userData.progressBarEstablishment.percentage} // example progress bar value
                />
              )}
            </Container>
            <h2 className="fw-bold">Insights</h2>
            <section
              className="mb-5 mt-2 p-4"
              style={{
                boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
                borderRadius: "7px",
              }}
            >
              <div className="d-flex justify-content-between">
                <div className="d-flex flex-column">
                  <h6 className="mb-0 fw-bold">Overview</h6>
                  <p className="text-muted">An overview Summery</p>
                </div>
                <div className="d-flex gap-3" style={{ width: "30%" }}>
                  <Form.Group controlId="userStatus" className="mb-3 w-100">
                    <Form.Select
                      value={analyticsTime}
                      onChange={(e) => setAnalyticsTime(e.target.value)}
                      style={{
                        height: "2.5rem",
                        borderRadius: "3px",
                        boxShadow: "none",
                        outline: "none",
                      }}
                    >
                      <option value="All Time">All Time</option>
                      <option value="Last 3 Months">Last 3 Months</option>
                      <option value="Last 6 Months">Last 6 Months</option>
                      <option value="Last 9 Months">Last 9 Months</option>
                      <option value="Last Year">Last Year</option>
                    </Form.Select>
                  </Form.Group>
                  <CustomButton label="Export" className="w-100" />
                </div>
              </div>
              <div className="d-flex gap-4 px-0 py-3 pb-4">
                <AnalyticsCard
                  img={quotationsCountPic}
                  bgColor="#B9D9DD"
                  imgBgColor="#2C8C99"
                  label="Quotations Count"
                  data="100"
                  value="1"
                  isActive={selectedCard === "1"}
                  onClick={handleSelectedCard}
                />
                <AnalyticsCard
                  img={totalSpentPic}
                  bgColor="#FFF4DE"
                  imgBgColor="#FF947A"
                  label="Total Spent"
                  data="3K"
                  value="2"
                  isActive={selectedCard === "2"}
                  onClick={handleSelectedCard}
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
                  value="4"
                  isActive={selectedCard === "4"}
                  onClick={handleSelectedCard}
                />
                <AnalyticsCard
                  img={complianceRatePic}
                  bgColor="#DCFCE7"
                  imgBgColor="#3CD856"
                  label="Compliance rate"
                  data="1"
                />
              </div>
              <div>
                <h6 className="fw-bold">{chartTitle}</h6>
                {chartType === "bar" && (
                  <BarChart data={chartData} title={chartTitle} />
                )}
                {chartType === "pie" && (
                  <PieChart data={chartData} title={chartTitle} />
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
