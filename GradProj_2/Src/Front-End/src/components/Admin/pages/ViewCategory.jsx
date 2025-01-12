import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import AppColors from "../../Theme/AppColors";
import SubCategoryButton from "../components/SubCategoryButton";
import backIcon from "../../../assets/adminIcons/back.png";
import LoadingScreen from "../../Common/LoadingScreen";
import categoriesApi from "../../../api/adminAPIs/categories";

const ViewCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const { catId, catName } = location.state;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const payload = {
          industryType: parseInt(catId),
        };

        const response = await categoriesApi.getCategories(payload);
        if (response?.body?.success) {
          setCategories(response.body.categoryList.categoryItem);
        } else {
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleGoBack = () => navigate(-1);

  if (loading) return <LoadingScreen />;

  return (
    <Container className="px-0 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">
          #{catId} - {catName}
        </h3>

        <div className="d-flex align-items-center justify-content-end gap-4 w-50">
          <img
            src={backIcon}
            alt="Back"
            style={{ cursor: "pointer", width: "40px" }}
            onClick={handleGoBack}
          ></img>
        </div>
      </div>

      <div
        className="p-3 mb-4"
        style={{
          border: `1px solid ${AppColors.dividerLine}`,
          borderRadius: "5px",
          height: "max-content",
          overflowY: "auto", // Allow scrolling if there are many categories
        }}
      >
        {categories.length > 0 ? (
          Object.values(categories).map((category, index) => (
            <SubCategoryButton key={index} label={category.name} />
          ))
        ) : (
          <p className="text-muted">No categories available</p>
        )}
      </div>
    </Container>
  );
};

export default ViewCategory;
