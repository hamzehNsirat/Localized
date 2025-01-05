import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AppColors from "../../Theme/AppColors.jsx";
import industryType from "../../Models/IndustryTypes.jsx";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import supplierApi from "../../../api/supplierAPIs/supplier.js";

const Sidebar = ({
  filters,
  setFilters,
  mainCategories = [],
  industryTypes = [],
  setIndustryTypes,
  handleIndustryToggle,
  categories = [],
  setCategories,
  handleCategoryToggle,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedIndustries, setExpandedIndustries] = useState({}); // Track expanded states for each industry type
  const [categoriesMap, setCategoriesMap] = useState({}); // Map of industryType -> categories

  // Handle scrolling behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollOffset = Math.min(window.scrollY, 77);
      setIsScrolled(scrollOffset);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories for all main categories on initial load
  useEffect(() => {
    const fetchAllCategories = async () => {
      const newCategoriesMap = {};
      try {
        for (const industryTypeId of mainCategories) {
          const response = await supplierApi.getCategories(
            industryTypeId,
            5,
            1
          );
          if (
            response.body.success &&
            response.body.categoryList?.categoryItem
          ) {
            const categories = response.body.categoryList.categoryItem.map(
              (cat) => ({
                id: parseInt(cat.id),
                name: cat.name,
              })
            );
            newCategoriesMap[industryTypeId] = categories;
          }
        }
        setCategoriesMap(newCategoriesMap);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    if (mainCategories.length > 0) {
      fetchAllCategories();
    }
  }, [mainCategories]);

  // Toggle expanded view for industry categories
  const toggleExpandedIndustry = (industryTypeId) => {
    setExpandedIndustries((prev) => ({
      ...prev,
      [industryTypeId]: !prev[industryTypeId],
    }));
  };

  // Handle category toggle
  const handleCategorySelection = (categoryId) => {
    // Toggle subcategory
    handleCategoryToggle(categoryId);
  };

  // Reset all filters
  const resetFilters = () => {
    // Reset favorites and clear all filters
    setFilters({ favorites: false });
    setIndustryTypes([]); // Clear all selected industry types
    setCategories([]); // Clear all selected categories
    setExpandedIndustries({}); // Collapse all expanded industries
  };

  // Styles
  const sidebarStyles = {
    backgroundColor: "#F2F4F3",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    position: "fixed",
    top: `${100 - isScrolled}px`,
    height: `calc(100% - ${100 - isScrolled}px)`,
    width: "250px",
    transition: "top 0.3s ease, height 0.3s ease",
    overflow: "hidden",
  };

  const scrollableContentStyles = {
    height: "100%",
    overflowY: "auto",
    paddingRight: "10px",
  };

  const filterItemStyles = {
    display: "flex",
    alignItems: "center",
    padding: "0 10px",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  };

  const dividerStyles = {
    margin: "3px 0",
    borderTop: `1px solid ${AppColors.primaryColor}`,
  };

  return (
    <div style={sidebarStyles}>
      <div style={scrollableContentStyles}>
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="fw-bold">Filters</h4>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>

        {/* Favorites Filter */}
        <div
          style={filterItemStyles}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#e6e6e6")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
          onClick={() =>
            setFilters((prevFilters) => ({
              ...prevFilters,
              favorites: !prevFilters.favorites,
            }))
          }
        >
          <input
            type="checkbox"
            checked={filters.favorites || false}
            onChange={() =>
              setFilters((prevFilters) => ({
                ...prevFilters,
                favorites: !prevFilters.favorites,
              }))
            }
            className="filter-input"
          />
          <label className="filter-label m-2">Favorites</label>
        </div>

        <div style={dividerStyles}></div>

        {/* Industry Type Filters */}
        {mainCategories.map((industryTypeId) => (
          <div key={industryTypeId}>
            {/* Industry Type */}
            <div
              className="filter-item"
              style={filterItemStyles}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#e6e6e6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <input
                type="checkbox"
                checked={industryTypes.includes(industryTypeId)}
                onChange={() => handleIndustryToggle(industryTypeId)}
                className="filter-input"
                style={{ pointerEvents: "none" }}
              />
              <label
                className="filter-label m-2"
                onClick={() => handleIndustryToggle(industryTypeId)}
              >
                {industryType[industryTypeId]}
              </label>
              {expandedIndustries[industryTypeId] ? (
                <FaChevronUp
                  style={{ marginLeft: "auto", cursor: "pointer" }}
                  onClick={() => toggleExpandedIndustry(industryTypeId)}
                />
              ) : (
                <FaChevronDown
                  style={{ marginLeft: "auto", cursor: "pointer" }}
                  onClick={() => toggleExpandedIndustry(industryTypeId)}
                />
              )}
            </div>

            {/* Categories (if expanded) */}
            {expandedIndustries[industryTypeId] &&
              categoriesMap[industryTypeId] && (
                <div style={{ marginLeft: "20px" }}>
                  {categoriesMap[industryTypeId].map((category) => (
                    <div
                      key={category.id}
                      className="filter-item"
                      style={filterItemStyles}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e6e6e6")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={() => handleCategorySelection(category.id)}
                    >
                      <input
                        type="checkbox"
                        checked={categories.includes(category.id)}
                        onChange={() =>
                          handleCategorySelection(industryTypeId, category.id)
                        }
                        className="filter-input"
                        style={{ pointerEvents: "none" }}
                      />
                      <label className="filter-label m-2">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
