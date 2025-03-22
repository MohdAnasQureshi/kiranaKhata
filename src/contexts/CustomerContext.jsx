import React, { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

const CustomerContext = createContext();

export const useCustomer = () => useContext(CustomerContext);

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
