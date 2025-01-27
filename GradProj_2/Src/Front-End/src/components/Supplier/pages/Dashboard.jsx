import "bootstrap/dist/css/bootstrap.min.css";
import pic from "../../../assets/user.png";

import ManagementSection from "../components/ManagmentSection.jsx";
import { FaUserCircle, FaStore } from "react-icons/fa";
import { Col, Container, Form, Row } from "react-bootstrap";
import AppColors from "../../Theme/AppColors.jsx";
import { useEffect, useState } from "react";
import PieChart from "../../Models/PieChart.jsx";
import supplierApi from "../../../api/supplierAPIs/supplier.js";
import { useAuth } from "../../Providers";
import LoadingScreen from "../../Common/LoadingScreen.jsx";
import CustomButton from "../../Common/CustomButton.jsx";
import BarChart from "../../Models/BarChart.jsx";
import AnalyticsCard from "../../Common/AnalyticsCard.jsx";

import quotationsCountPic from "../../../assets/analytics/quotationsCount.png";
import totalSpentPic from "../../../assets/analytics/totalSpent.png";
import projectedProfitPic from "../../../assets/analytics/clock.png";
import issuesReportedPic from "../../../assets/analytics/sadFace.png";
import complianceRatePic from "../../../assets/analytics/tag.png";

import { formatDateForInput } from "../../Utils/formatters.js";

const Dashboard = () => {
  const { user, userData, setUser, setUserData } = useAuth();
  const [loading, setLoading] = useState(!userData);
  const [error, setError] = useState(null);
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

  const fetchSupplierData = async () => {
    const userId = parseInt(user.userId);
    try {
      const response = await supplierApi.getSupplierAllDetails(userId);
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
          ...response.body.supplierDashboard,
        };
        setUserData(newUserData);
        console.log(newUserData);
      } else {
        setError("Failed to fetch supplier data.");
      }
    } catch (err) {
      setError(`Failed to fetch supplier data. ${err}`);
    }
  };

  const fetchChartData = () => {
    const selectedTimeKey = analyticsMapping[analyticsTime];
    if (!userData) return;

    const insights = userData?.insights?.analyticsResult || {};
    console.log("insights: ", insights);
    switch (selectedCard) {
      case "1": // Quotations Count (Bar Chart)
        const quotations = insights?.quotations?.[selectedTimeKey] || {};
        console.log(quotations);
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
        setChartType("table1");
        break;

      case "3": // totalCustomers (Table)
        const totalCustomers = insights?.totalCustomers || 0;
        setChartData([{ type: "Total Customers", value: totalCustomers }]);
        setChartTitle(`Total Customers- ${totalCustomers}`);
        setChartType("table2");
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

      case "5": // Establishment_rate (Pie Chart)
        const establishmentRate = insights?.review || 0;
        setChartData([
          {
            type: "Positive Reviews",
            value: establishmentRate.positivePercentage,
            color: "#4CAF50", // Green
          },
          {
            type: "Negative Reviews",
            value: establishmentRate.negativePercentage,
            color: "#F44336", // Red
          },
        ]);

        setChartTitle("Establishment Rate");
        setChartType("pie2");
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
      await fetchSupplierData();
      setLoading(false);
    };

    initializeData();
  }, []); // Run only once on component mount

  useEffect(() => {
    if (userData) {
      fetchChartData(); // Call fetchChartData only when userData is available
    }
  }, [userData, selectedCard, analyticsTime]); // Trigger when userData, selectedCard, or analyticsTime changes

  if (loading) return <LoadingScreen />;

  return (
    <>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div
          style={{ height: "100%", flexDirection: "column" }}
          className="container text-dark"
        >
          <div className="d-flex justify-content-between align-items-center gap-3 mt-5">
            <div className="w-100">
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
                width="140px"
                height="112px"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          <Container className="mt-4 px-0 d-flex flex-column gap-3">
            {userData.progressBarUser.percentage !== 100 && (
              <ManagementSection
                icon={<FaUserCircle color={AppColors.primaryColor} />}
                title="Manage Profile"
                description="Complete your profile information"
                buttonText="Manage"
                progress={userData.progressBarUser.percentage}
              />
            )}
            {userData.progressBarEstablishment.percentage !== 100 && (
              <ManagementSection
                icon={<FaStore color={AppColors.primaryColor} />}
                title="Manage Establishment"
                description="Edit / Update information"
                buttonText="Manage"
                progress={userData.progressBarEstablishment.percentage}
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
                img={totalSpentPic}
                bgColor="#FFF4DE"
                imgBgColor="#FDB913"
                label="Profile Visits"
                data={userData.insights.analyticsResult.profileViews}
              />
              <AnalyticsCard
                img={quotationsCountPic}
                bgColor="#B9D9DD"
                imgBgColor="#2C8C99"
                label="Quotations Count"
                data={userData.insights.analyticsResult.totalQuotations}
                value="1"
                isActive={selectedCard === "1"}
                onClick={handleSelectedCard}
              />
              <AnalyticsCard
                img={totalSpentPic}
                bgColor="#FFE4DD"
                imgBgColor="#FF947A"
                label="Total Revenue"
                data={userData.insights.analyticsResult.totalRevenue}
                value="2"
                isActive={selectedCard === "2"}
                onClick={handleSelectedCard}
              />
              <AnalyticsCard
                img={projectedProfitPic}
                bgColor="#F3E8FF"
                imgBgColor="#BF83FF"
                label="Total Customers"
                data={userData.insights.analyticsResult.totalCustomers}
                value="3"
                isActive={selectedCard === "3"}
                onClick={handleSelectedCard}
              />
              <AnalyticsCard
                img={issuesReportedPic}
                bgColor="#FFE2E5"
                imgBgColor="#FA5A7D"
                label="Issues Reported"
                data={userData.insights.analyticsResult.issuesReportedObj.total}
                value="4"
                isActive={selectedCard === "4"}
                onClick={handleSelectedCard}
              />
              <AnalyticsCard
                img={complianceRatePic}
                bgColor="#C8C8C8"
                imgBgColor="#252525"
                label="Establishment Rate"
                data={userData.insights.analyticsResult.overallRating}
                value="5"
                isActive={selectedCard === "5"}
                onClick={handleSelectedCard}
              />
              <AnalyticsCard
                img={complianceRatePic}
                bgColor="#DCFCE7"
                imgBgColor="#3CD856"
                label="Compliance rate"
                data={userData.insights.analyticsResult.complianceIndicator.toFixed(
                  2
                )}
              />
            </div>
            <div>
              <h6 className="fw-bold">{chartTitle}</h6>
              {chartType === "bar" && (
                <BarChart data={chartData} title={chartTitle} />
              )}
              {chartType === "table1" && (
                <div
                  className="py-3 px-5"
                  style={{
                    width: "100%",
                    height: "100%",
                    padding: "10px 15px",
                    boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
                    borderRadius: "10px",
                  }}
                >
                  <Row
                    className="text-muted mb-3 py-3 fw-bold"
                    style={{ borderBottom: "1px solid gray" }}
                  >
                    <Col>#</Col>
                    <Col>Company Name</Col>
                    <Col>Date</Col>
                    <Col>Amount</Col>
                    <Col>%</Col>
                  </Row>
                  {userData.insights.analyticsResult.purchaseList.purchaseItem.map(
                    (purchase, index) => {
                      return (
                        <Row
                          className="py-2 fw-bold"
                          style={{
                            borderBottom:
                              index !=
                              userData.insights.analyticsResult.purchaseList
                                .purchaseItem.length -
                                1
                                ? "1px solid gray"
                                : "",
                            marginBottom: "10px",
                          }}
                        >
                          <Col>{purchase.id}</Col>
                          <Col>{purchase.name}</Col>
                          <Col>{formatDateForInput(purchase.date)}</Col>
                          <Col>{purchase.total}</Col>
                          <Col>{purchase.share}</Col>
                        </Row>
                      );
                    }
                  )}
                </div>
              )}
              {chartType === "table2" && (
                <div
                  className="py-3 px-5"
                  style={{
                    width: "100%",
                    height: "100%",
                    padding: "10px 15px",
                    boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
                    borderRadius: "10px",
                  }}
                >
                  <Row
                    className="text-muted mb-3 py-3 fw-bold"
                    style={{ borderBottom: "1px solid gray" }}
                  >
                    <Col>Company Name</Col>
                    <Col>Phone</Col>
                    <Col>Quotations</Col>
                    <Col>Total Spend</Col>
                    <Col>%</Col>
                  </Row>
                  {userData.insights.analyticsResult.customerList.customerItem.map(
                    (customer, index) => {
                      return (
                        <Row
                          className="py-2 fw-bold"
                          style={{
                            borderBottom:
                              index !=
                              userData.insights.analyticsResult.customerList
                                .customerItem.length -
                                1
                                ? "1px solid gray"
                                : "",
                            marginBottom: "10px",
                          }}
                        >
                          <Col>{customer.establishmentName}</Col>
                          <Col>{customer.establishmentContactNumber}</Col>
                          <Col>{customer.numberOfQuotations}</Col>
                          <Col>{customer.amount}</Col>
                          <Col>{customer.share}</Col>
                        </Row>
                      );
                    }
                  )}
                </div>
              )}
              {chartType === "pie" && (
                <PieChart data={chartData} title={chartTitle} />
              )}
              {chartType === "pie2" && (
                <PieChart data={chartData} title={chartTitle} />
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default Dashboard;
