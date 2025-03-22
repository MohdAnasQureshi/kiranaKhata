import React, { useState } from "react";
import Spinner from "../../ui/Spinner";
import styled from "styled-components";
import ScrollBar from "../../ui/ScrollBar";
import CustomerStats from "./CustomerStats";
import {
  calculateMonthsAndDays,
  capitalizeFirstLetter,
  formatCurrency,
  getTimeDifference,
} from "../../utils/helpers";
import { useCustomers } from "./useCustomers";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";

const CustomerDetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  background-color: white;
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-grey-400);

  &:active {
    background-color: var(--color-brand-200);
  }
`;

const Name = styled.p`
  display: flex;
  flex-direction: column;
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
  & :first-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    font-weight: 500;
  }
`;

const OutstandingDebt = styled.p`
  font-size: 1.8rem;
  font-family: "Sono";
  font-weight: 600;
  color: var(--color-red-500);
  margin-left: auto;
  margin-right: 10px;
`;

const AllCustomers = () => {
  const navigate = useNavigate();
  const { customers, isLoading } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");

  const [searchParams] = useSearchParams();
  const filteredValue =
    searchParams.get("status") || localStorage.getItem("appliedFilter");
  let filteredCustomers;

  if (filteredValue === "all") filteredCustomers = customers?.data;

  if (filteredValue === "debtors")
    filteredCustomers = customers?.data?.filter(
      (customer) => customer.totalOutstandingDebt > 0
    );

  if (filteredValue === "depositors")
    filteredCustomers = customers?.data?.filter(
      (customer) => customer.totalOutstandingDebt < 0
    );

  if (filteredValue === "settled")
    filteredCustomers = customers?.data?.filter(
      (customer) => customer.totalOutstandingDebt === 0
    );

  const searchedCustomers = filteredCustomers?.filter((customer) =>
    customer?.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // SORT BY
  let sortedCustomers;
  const sortBy =
    searchParams.get("sortBy") || localStorage.getItem("appliedSort");
  if (sortBy === "recent")
    sortedCustomers = searchedCustomers?.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  if (sortBy === "highest-debt")
    sortedCustomers = searchedCustomers?.sort(
      (a, b) => b.totalOutstandingDebt - a.totalOutstandingDebt
    );
  if (sortBy === "oldest")
    sortedCustomers = searchedCustomers?.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  if (sortBy === "least-debt")
    sortedCustomers = searchedCustomers?.sort(
      (a, b) => a.totalOutstandingDebt - b.totalOutstandingDebt
    );

  if (sortBy === "name-asc")
    sortedCustomers = searchedCustomers?.sort((a, b) =>
      a.customerName.localeCompare(b.customerName)
    );

  if (sortBy === "name-desc")
    sortedCustomers = searchedCustomers?.sort((a, b) =>
      b.customerName.localeCompare(a.customerName)
    );

  const handleRowClick = (customerId, { customerName, customerContact }) => {
    // Navigate to the transaction page, passing customer ID and name
    navigate(`/addTransaction/${customerId}`, {
      state: { customerName, customerContact },
    });
  };

  if (isLoading) return <Spinner />;

  if (customers?.data.length === 0 || !customers)
    return (
      <div>
        <p>No Customers Found !!</p>{" "}
        <p>Click Add Customer to add new customer</p>{" "}
      </div>
    );

  return (
    <>
      <CustomerStats
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleRowClick={handleRowClick}
        filteredValue={filteredValue}
        sortedCustomers={sortedCustomers}
        customers={customers}
      />
      <ScrollBar
        backgroundColor="transparent"
        showButtons={false}
        height="calc(100dvh - 340px)"
      >
        {sortedCustomers?.length === 0 ? (
          <div>No Customer found!</div>
        ) : (
          sortedCustomers?.map((customer) => {
            const { years, months, days } = calculateMonthsAndDays(
              customer.updatedAt
            );
            const { hours, minutes, seconds } = getTimeDifference(
              customer.updatedAt
            );

            return (
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
                <Name>
                  {capitalizeFirstLetter(customer.customerName)}{" "}
                  <span>
                    {days
                      ? `${years > 1 ? `${years} years` : years == 1 ? `${years} year` : ``} ${months == 0 ? `` : months == 1 ? `${months} month` : `${months} months`} ${days == 0 ? `` : days == 1 ? `${days} day` : `${days} days`} ago `
                      : `${hours == 0 ? `` : `${hours} hr`} ${minutes == 0 ? `` : `${minutes} min`} ${seconds} sec ago`}
                  </span>
                </Name>

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
                <FaAngleRight />
              </CustomerDetailRow>
            );
          })
        )}
      </ScrollBar>
    </>
  );
};

export default AllCustomers;
