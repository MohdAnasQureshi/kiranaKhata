import React from "react";
import styled from "styled-components";
import Stats from "./Stats";
import { useCustomers } from "../customers/useCustomers";
import Spinner from "../../ui/Spinner";
import DebtChart from "./DebtChart";
import DebtPieChart from "./DebtPieChart";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { customers, isLoading } = useCustomers();
  if (isLoading) return <Spinner />;
  return (
    <>
      <StyledDashboardLayout>
        <Stats customers={customers} />
        <DebtChart customers={customers} />
        <DebtPieChart />
      </StyledDashboardLayout>
    </>
  );
}

export default DashboardLayout;
