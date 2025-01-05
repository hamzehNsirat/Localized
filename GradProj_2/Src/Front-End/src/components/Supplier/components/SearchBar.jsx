import React from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import MarketplaceStyles from "../styles/MarketplaceStyles";

const SearchBar = ({ searchTerm, setSearchTerm, handleSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Call the search function on Enter key press
    }
  };
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <InputGroup className="w-75">
        <FormControl
          placeholder="Search"
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ borderRadius: "3px", boxShadow: "none" }}
        />
        <InputGroup.Text
          style={{
            borderTopRightRadius: "3px",
            borderBottomRightRadius: "3px",
          }}
        >
          <FaSearch
            style={{ ...MarketplaceStyles.iconStyle }}
            onClick={handleSearch}
          />
        </InputGroup.Text>
      </InputGroup>
      <Button
        onClick={handleSearch}
        style={{
          backgroundColor: "#2C8C99",
          border: "none",
          boxShadow: "-4px 3px 1px rgba(0, 0, 0, 1)",
          fontSize: "14px",
          width: "15%",
        }}
        className="mx-4 rounded-pill px-4 py-2"
      >
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
