import React, { useState } from "react";
import PropTypes from "prop-types";

const SearchBar = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter customers based on search term
  const filteredCustomers = customers?.data?.filter((customer) =>
    customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search customers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul style={{ color: "red" }}>
        {filteredCustomers.map((customer) => (
          <li key={customer.id}>{customer.name}</li>
        ))}
      </ul>
    </div>
  );
};

SearchBar.propTypes = {
  customers: PropTypes.object.isRequired,
};

export default SearchBar;
