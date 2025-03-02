import React from "react";
import Row from "../ui/Row";
import Heading from "../ui/Heading";
import AllCustomers from "../features/customers/AllCustomers";
import CustomerListFilterSort from "../features/customers/CustomerListFilterSort";

const Customers = () => {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">All Customers</Heading>
        <CustomerListFilterSort />
      </Row>
      <Row>
        <AllCustomers />
      </Row>
    </>
  );
};

export default Customers;
