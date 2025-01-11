import React, { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";
// Create Context
const CustomerContext = createContext();

// Custom Hook for Accessing Context
export const useCustomer = () => useContext(CustomerContext);

// Provider Component
export const CustomerProvider = ({ children }) => {
  const [customerId, setCustomerId] = useState(null);

  return (
    <CustomerContext.Provider value={{ customerId, setCustomerId }}>
      {children}
    </CustomerContext.Provider>
  );
};

CustomerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

CustomerContext.propTypes = {
  children: PropTypes.node.isRequired,
};
