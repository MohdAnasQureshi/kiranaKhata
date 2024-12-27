import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getCustomers } from "../../services/apiCustomers";
import Spinner from "../../ui/Spinner";
import PageNotFound from "../../pages/PageNotFound";
import styled from "styled-components";
import { capitalizeFirstLetter, formatCurrency } from "../../utils/helpers";

const CustomerDetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1rem;
  background-color: white;
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-grey-100);
  border-bottom: 1px solid var(--color-grey-300);
  box-shadow: 0 3px 8px var(--color-grey-200);

  &:active,
  :hover {
    background-color: var(--color-brand-200);
  }
`;
const Name = styled.span`
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const OutstandingDebt = styled.span`
  font-size: 1.8rem;
  font-family: "Sono";
  font-weight: 600;
  color: var(--color-red-500);
`;

const TotalCustomers = styled.div`
  margin: auto;
  padding: 1rem;
`;

const CustomerRow = () => {
  const {
    isLoading,
    data: customers,
    error,
  } = useQuery({
    queryKey: ["customer"],
    queryFn: getCustomers,
  });

  console.log(customers, error);

  if (isLoading) return <Spinner />;

  if (!customers) return <PageNotFound />;

  return (
    <>
      <TotalCustomers>Total Customers : {customers.data.length}</TotalCustomers>
      {customers.data.map((customer) => (
        <CustomerDetailRow role="row" key={customer._id}>
          <Name>{capitalizeFirstLetter(customer.customerName)}</Name>
          <OutstandingDebt
            style={
              customer.totalOutstandingDebt < 0
                ? { color: "var(--color-green-700)" }
                : {}
            }
          >
            {formatCurrency(customer.totalOutstandingDebt)}
          </OutstandingDebt>
        </CustomerDetailRow>
      ))}
    </>
  );
};

export default CustomerRow;
