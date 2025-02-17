import React from "react";
import Spinner from "../../ui/Spinner";
import PageNotFound from "../../pages/PageNotFound";
import styled from "styled-components";
import {
  calculateMonthsAndDays,
  capitalizeFirstLetter,
  formatCurrency,
} from "../../utils/helpers";
import ScrollBar from "../../ui/ScrollBar";
import { useCustomers } from "./useCustomers";
import { useNavigate } from "react-router-dom";

const CustomerDetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1rem;
  background-color: white;
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-grey-100);
  border-bottom: 1px solid var(--color-grey-200);
  box-shadow: 0 3px 8px var(--color-grey-100);

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

const CustomerStats = styled(CustomerDetailRow)`
  flex-direction: row;
  background-color: var(--color-silver-100);
  /* color: var(--color-red-700); */
  font-size: 1.5rem;
  font-weight: 600;
  justify-content: space-around;
  gap: 1rem;
  padding: 1rem;
`;

const CustomerRow = () => {
  const navigate = useNavigate();
  const { customers, isLoading } = useCustomers();

  const handleRowClick = (customerId, { customerName, customerContact }) => {
    // Navigate to the transaction page, passing customer ID and name
    navigate(`/addTransaction/${customerId}`, {
      state: { customerName, customerContact },
    });
  };

  // Find the customer with the highest debt
  const customerWithHighestDebt = customers?.data?.reduce((max, customer) => {
    return customer?.totalOutstandingDebt > max?.totalOutstandingDebt
      ? customer
      : max;
  }, customers.data[0]);

  const filteredCustomers = customers?.data?.filter(
    (customer) => customer.totalOutstandingDebt > 0
  );

  const oldestCustomerWithUnpaidDebt = filteredCustomers?.reduce(
    (oldest, customer) => {
      return new Date(customer?.createdAt) < new Date(oldest?.createdAt)
        ? customer
        : oldest;
    },
    filteredCustomers[0]
  );

  // console.log(oldestCustomerWithUnpaidDebt);

  const { months, days, years } = calculateMonthsAndDays(
    oldestCustomerWithUnpaidDebt?.createdAt
  );

  if (isLoading) return <Spinner />;

  if (customers?.data.length === 0 || !customers) return <PageNotFound />;

  // console.log(customers.data);

  return (
    <>
      <TotalCustomers>Total Customers : {customers.data.length}</TotalCustomers>
      <CustomerStats>
        <p>
          Highest Debtor :{" "}
          {capitalizeFirstLetter(customerWithHighestDebt.customerName)} (
          {formatCurrency(customerWithHighestDebt.totalOutstandingDebt)})
        </p>
        <p>
          {" "}
          Oldest debtor :{" "}
          {capitalizeFirstLetter(oldestCustomerWithUnpaidDebt.customerName)},
          not paid since{" "}
          {years > 0
            ? `${years} years ${months} months ${days} days`
            : months > 0
              ? `${months} months ${days} days`
              : days === 0
                ? "today"
                : `${days} ${days === 1 ? `day` : `days`}`}
        </p>
      </CustomerStats>
      <ScrollBar
        backgroundColor="transparent"
        showButtons={false}
        height="56dvh"
      >
        {customers.data.map((customer) => (
          <CustomerDetailRow
            role="row"
            key={customer._id}
            onClick={() =>
              handleRowClick(customer._id, {
                customerName: customer.customerName,
                customerContact: customer.customerContact,
              })
            }
            style={{ cursor: "pointer" }}
          >
            <Name>{capitalizeFirstLetter(customer.customerName)}</Name>
            <OutstandingDebt
              style={
                customer.totalOutstandingDebt <= 0
                  ? { color: "var(--color-green-700)" }
                  : {}
              }
            >
              {customer.totalOutstandingDebt === 0
                ? "PAID"
                : formatCurrency(customer.totalOutstandingDebt)}
            </OutstandingDebt>
          </CustomerDetailRow>
        ))}
      </ScrollBar>
    </>
  );
};

export default CustomerRow;
