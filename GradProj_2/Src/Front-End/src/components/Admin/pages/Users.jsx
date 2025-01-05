import AppColors from "../../Theme/AppColors";
import userIcon from "../../../assets/user.png";
import { Row, Col, Card } from "react-bootstrap";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import StatusColors from "../../Theme/StatusColors";
import userStatus from "../../Models/UserStatus";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../Common/CustomButton";
import userManagementApi from "../../../api/adminAPIs/userManagement";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [users, setUsers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const payload = {
          pageSize: 10,
          pageIndex: currentPage,
        };
        const response = await userManagementApi.getUserList(payload);
        if (response?.body?.success) {
          setUsers(
            response.body.userList.user.reduce((acc, user) => {
              acc[user.userId] = {
                id: user.userId,
                image: user.userImage,
                name: user.username, // Fallback for empty descriptions
                statusId: user.userStatus,
              };
              return acc; // Always return the accumulator
            }, {})
          );
        } else {
          console.error("error fetching users ", response);
        }
      } catch (err) {
        console.error("error fetching users ", err);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handleSearch = () => {
    setFilteredProducts([]);
    // setCurrentPage(1); // Reset to the first page after searching
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center w-100">
        <h3 className="fw-bold w-75">Users</h3>
        <div className="d-flex gap-3 w-100">
          <CustomButton
            label="Add"
            className="px-5"
            onClick={() => {
              navigate(`/admin/users/addUser`);
            }}
            style={{
              backgroundColor: AppColors.primaryColor,
              boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)",
              outline: "none",
            }}
          />
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
            width="w-100"
          />
        </div>
      </div>
      <div className="px-0 py-4">
        {Object.keys(users).length !== 0 ? (
          Object.keys(users).map((key) => {
            const user = users[key];
            return (
              <Card
                key={user.id}
                className="mb-4 px-3 py-0"
                style={{
                  borderRadius: "10px",
                  border: "0",
                  backgroundColor: AppColors.backgroundColor,
                  boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Card.Body>
                  <Row className="d-flex align-items-center justify-content-between">
                    <Col
                      xs={6}
                      className="d-flex justify-content-between align-items-center gap-4"
                    >
                      <Col md={2}>
                        <Card.Title className="fw-bold mb-0">
                          #{user.id}
                        </Card.Title>
                      </Col>
                      <Col md={2}>
                        <img
                          src={user.image ?? userIcon}
                          alt="img"
                          style={{ width: "100%", objectFit: "contain" }}
                        ></img>
                      </Col>
                      <Col>
                        <p
                          className="fw-bold mb-0 w-100"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {user.name}
                        </p>
                      </Col>
                    </Col>
                    <Col
                      xs={4}
                      className="d-flex align-items-center justify-content-between gap-3"
                    >
                      <a
                        className="fw-bold mb-0 w-100"
                        style={{
                          fontSize: "0.8rem",
                          color: "black",
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                        onClick={() => {
                          const userId = user.id;
                          navigate(`/admin/users/user/${user.id}`, {
                            state: { userId },
                          });
                        }}
                      >
                        {"View"}
                      </a>
                      <div
                        className="fw-bold mb-0"
                        style={{
                          fontSize: "0.8rem",
                          width: "100%",
                          padding: "8px 10px",
                          backgroundColor:
                            StatusColors.userStatus[userStatus[user.statusId]],
                          color: "white",
                          borderRadius: "3px",
                          textAlign: "center",
                        }}
                      >
                        {userStatus[user.statusId]}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            );
          })
        ) : (
          <h3 className="d-flex align-content-center justify-content-center mt-5 text-muted">
            No users yet!
          </h3>
        )}
      </div>
    </>
  );
};

export default Users;
