import React from "react";
import Row from "../ui/Row";
import Heading from "../ui/Heading";
import CustomerRow from "../features/customers/CustomerRow";

const Customers = () => {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h2">All Customers</Heading>
        <p>Filter / Sort</p>
      </Row>
      <Row>
        <CustomerRow />
      </Row>
    </>
  );
};

export default Customers;
