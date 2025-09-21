import Heading from "../ui/Heading";
import Row from "../ui/Row";
import React from "react";
import ScrollBar from "../ui/ScrollBar";
import DashboardLayout from "../features/dashboard/DashboardLayout";
function Dashboard() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Dashboard</Heading>
        <p>TEST</p>
      </Row>
      <Row>
        <ScrollBar
          backgroundColor="transparent"
          showButtons={false}
          height="50vh"
        >
          <DashboardLayout />
        </ScrollBar>
      </Row>
    </>
  );
}

export default Dashboard;
