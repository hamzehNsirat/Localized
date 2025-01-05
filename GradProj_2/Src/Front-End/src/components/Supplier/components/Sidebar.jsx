import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MarketplaceStyles from "../styles/MarketplaceStyles.jsx";
import AppColors from "../../Theme/AppColors.jsx";

const Sidebar = ({ filters, setFilters, categories }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Dynamically calculate the top offset
      const scrollOffset = Math.min(window.scrollY, 77); // Max scroll offset is 100px
      setIsScrolled(scrollOffset);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleFilterChange = (category) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: !prevFilters[category],
    }));
  };

  const sidebarStyles = {
    backgroundColor: "#F2F4F3",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    position: "fixed",
    top: `${100 - isScrolled}px`, // Dynamically adjust based on scroll
    height: `calc(100% - ${100 - isScrolled}px)`, // Adjust height accordingly
    width: "250px",
    transition: "top 0.3s ease, height 0.3s ease",
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
      <h4 className="fw-bold">Filters</h4>
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
          checked={filters.favorites}
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

      {categories.map((category) => (
        <div
          key={category.name}
          className="filter-item"
          style={filterItemStyles}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#e6e6e6")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
          onClick={() => handleFilterChange(category.name)}
        >
          <input
            type="checkbox"
            checked={filters[category.name]}
            onChange={() => handleFilterChange(category.name)}
            className="filter-input"
          />
          <label className="filter-label m-2">{category.name}</label>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
