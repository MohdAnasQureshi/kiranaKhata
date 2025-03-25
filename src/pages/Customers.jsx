import React from "react";
import Row from "../ui/Row";
import Heading from "../ui/Heading";
import AllCustomers from "../features/customers/AllCustomers";
import CustomerListFilterSort from "../features/customers/CustomerListFilterSort";

const Customers = () => {
  return (
    <>
      <Row
        type="horizontal"
        style={{
          justifyContent: "space-between",
          backgroundColor: "var(--color-indigo-100)",
          padding: "0.2rem 1rem 0.2rem 1rem",
        }}
      >
        <Heading as="h2">All Customers</Heading>
        <CustomerListFilterSort />
      </Row>
      <Row
        style={{
          gap: "0",
        }}
      >
        <AllCustomers />
      </Row>
    </>
  );
};

export default Customers;
