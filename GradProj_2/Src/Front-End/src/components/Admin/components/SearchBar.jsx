import React from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import MarketplaceStyles from "../styles/MarketplaceStyles";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  width = "w-50",
}) => (
  <div className={`d-flex justify-content-between align-items-center ${width}`}>
    <InputGroup className="w-100">
      <FormControl
        placeholder="Search by Id, Name..."
        aria-label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ borderRadius: "3px", boxShadow: "none", height: "2.5rem" }}
      />
      <InputGroup.Text
        style={{
          borderTopRightRadius: "3px",
          borderBottomRightRadius: "3px",
          height: "2.5rem",
        }}
      >
        <FaSearch
          style={{ ...MarketplaceStyles.iconStyle }}
          onClick={handleSearch}
        />
      </InputGroup.Text>
    </InputGroup>
  </div>
);

export default SearchBar;
