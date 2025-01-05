import React, { useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ArrowLeftCircle } from "react-bootstrap-icons"; // For the back icon
import AppColors from "../../Theme/AppColors";
import SubCategoryButton from "../components/SubCategoryButton";
import CustomButton from "../../Common/CustomButton";
import CustomInput from "../../Common/CustomInput";

const categoryData = {
  id: 5111,
  name: "Food & Beverages",
  categories: {
    1: "eggs",
    2: "bread",
  },
};

const ViewCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(
    Object.values(categoryData.categories)
  );
  const [newCategory, setNewCategory] = useState("");

  const handleGoBack = () => navigate(-1);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories((prev) => [...prev, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (index) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Container className="px-0 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">
          #{categoryData.id} - {categoryData.name}
        </h3>

        <div className="d-flex align-items-center justify-content-end gap-4 w-50">
          <ArrowLeftCircle
            size={40}
            color="white"
            style={{
              backgroundColor: "#262626",
              borderRadius: "100%",
              cursor: "pointer",
            }}
            onClick={handleGoBack}
          />
          <CustomButton
            className="w-25"
            label="Save"
            style={{
              backgroundColor: AppColors.primaryColor,
            }}
          />
        </div>
      </div>

      <div
        className="p-3 mb-4"
        style={{
          border: `1px solid ${AppColors.dividerLine}`,
          borderRadius: "5px",
          height: "150px",
          overflowY: "auto", // Allow scrolling if there are many categories
        }}
      >
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <SubCategoryButton
              key={index}
              label={category}
              onDelete={() => handleDeleteCategory(index)}
            />
          ))
        ) : (
          <p className="text-muted">No categories available</p>
        )}
      </div>

      <div className="d-flex align-items-center gap-3">
        <CustomInput
          className="w-75"
          cocontrolId="newCategory"
          placeholder="Input Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />

        <CustomButton
          label="Add"
          className="w-25"
          onClick={handleAddCategory}
          style={{
            backgroundColor: AppColors.primaryColor,
          }}
        />
      </div>
    </Container>
  );
};

export default ViewCategory;
