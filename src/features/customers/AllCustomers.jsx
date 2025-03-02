import React, { useRef, useState } from "react";
import Spinner from "../../ui/Spinner";
import PageNotFound from "../../pages/PageNotFound";
import styled from "styled-components";
import ScrollBar from "../../ui/ScrollBar";
import {
  calculateMonthsAndDays,
  capitalizeFirstLetter,
  formatCurrency,
  getTimeDifference,
} from "../../utils/helpers";
import { useCustomers } from "./useCustomers";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import Input from "../../ui/Input";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transition:
    opacity 0.6s ease,
    transform 0.6s ease,
    max-height 0.6s ease,
    margin 0.6s ease;
  opacity: ${(props) => (props.$hide ? 0 : 1)};
  transform: ${(props) =>
    props.$hide ? "translateY(-10px)" : "translateY(0)"};
  max-height: ${(props) =>
    props.$hide ? "0px" : "200px"}; /* Smooth collapse */
  overflow: hidden;
`;

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

const TotalCustomers = styled.div`
  padding: 0.2rem;
`;

const CustomerStats = styled.div`
  display: flex;
  align-items: center;
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-grey-100);
  border-bottom: 1px solid var(--color-grey-200);
  box-shadow: 0 3px 8px var(--color-grey-100);
  flex-direction: row;
  background-color: var(--color-silver-100);
  font-size: 1.5rem;
  font-weight: 600;
  justify-content: space-around;
  gap: 1rem;
  padding: 1rem;
  margin: 1rem;
  margin-bottom: 0.2rem;
`;

const SearchInput = styled(Input)`
  border-radius: 50px;
  padding: 8px 40px 8px 10px;
  border: 1px solid;
  width: 100%;
`;

const SearchWrapper = styled.div`
  position: relative;
  padding: 0 15px 0 15px;
  width: 100%;
  transition: 0.5s ease;
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  color: gray;
  font-size: 20px;
`;

const CloseButton = styled(IoClose)`
  position: absolute;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  color: gray;
  font-size: 26px;
  transition: 0.4s ease;
  &:active {
    color: red;
  }
`;

const AllCustomers = () => {
  const navigate = useNavigate();
  const { customers, isLoading } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);
  const [searchParams] = useSearchParams();
  const filteredValue = searchParams.get("status") || "all";

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
  const sortBy = searchParams.get("sortBy") || "recent";
  if (sortBy === "recent")
    sortedCustomers = searchedCustomers?.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  if (sortBy === "highest-debt")
    sortedCustomers = searchedCustomers?.sort(
      (a, b) => b.totalOutstandingDebt - a.totalOutstandingDebt
    );
  if (sortBy === "oldest")
    sortedCustomers = searchedCustomers.sort(
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

  // Find the customer with the highest debt
  const customerWithHighestDebt = customers?.data?.reduce((max, customer) => {
    return customer?.totalOutstandingDebt > max?.totalOutstandingDebt
      ? customer
      : max;
  }, customers.data[0]);

  const filteredCustomersWithDebt = customers?.data?.filter(
    (customer) => customer.totalOutstandingDebt > 0
  );

  const oldestCustomerWithUnpaidDebt = filteredCustomersWithDebt?.reduce(
    (oldest, customer) => {
      return new Date(customer?.updatedAt) < new Date(oldest?.updatedAt)
        ? customer
        : oldest;
    },
    filteredCustomersWithDebt[0]
  );

  const { months, days, years } = calculateMonthsAndDays(
    oldestCustomerWithUnpaidDebt?.updatedAt
  );

  function handleClose() {
    setSearchTerm("");
    setTimeout(() => searchInputRef.current?.blur(), 0); // Ensure blur happens
  }

  if (isLoading) return <Spinner />;

  if (customers?.data.length === 0 || !customers) return <PageNotFound />;

  return (
    <>
      <StatsContainer $hide={searchTerm.length > 0}>
        <TotalCustomers>
          {`Total ${filteredValue === "debtors" ? "debtors" : filteredValue === "depositors" ? "depositors" : filteredValue === "settled" ? "settled customers" : "customers"} : `}{" "}
          {sortedCustomers.length}
        </TotalCustomers>
        <CustomerStats>
          <p
            onClick={() =>
              handleRowClick(customerWithHighestDebt._id, {
                customerName: customerWithHighestDebt.customerName,
                customerContact: customerWithHighestDebt.customerContact,
              })
            }
          >
            Highest Debtor :{" "}
            {capitalizeFirstLetter(customerWithHighestDebt.customerName)} (
            {formatCurrency(customerWithHighestDebt.totalOutstandingDebt)})
            <FaAngleRight
              style={{
                color: "var(--color-brand-500)",
                paddingTop: "3px",
                fontSize: "16px",
              }}
            />
          </p>
          <p
            onClick={() =>
              handleRowClick(oldestCustomerWithUnpaidDebt._id, {
                customerName: oldestCustomerWithUnpaidDebt.customerName,
                customerContact: oldestCustomerWithUnpaidDebt.customerContact,
              })
            }
          >
            Oldest debtor :{" "}
            {capitalizeFirstLetter(oldestCustomerWithUnpaidDebt.customerName)},
            not paid since{" "}
            {years > 0
              ? `${years} years ${months} months ${days} days`
              : months > 0
                ? `${months} months ${days} days`
                : days === 0
                  ? "today"
                  : `${days} ${days === 1 ? `day` : `days`}`}{" "}
            <FaAngleRight
              style={{
                color: "var(--color-brand-500)",
                paddingTop: "3px",
                fontSize: "16px",
              }}
            />
          </p>
        </CustomerStats>
      </StatsContainer>
      <SearchWrapper>
        <SearchInput
          ref={searchInputRef}
          id="search"
          type="text"
          placeholder={`Search ${filteredValue === "debtors" ? "debtors..." : filteredValue === "depositors" ? "depositors..." : filteredValue === "settled" ? "settled customers..." : "customers..."}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label htmlFor="search">
          {searchTerm.length === 0 ? (
            <SearchIcon />
          ) : (
            <CloseButton onClick={handleClose} />
          )}
        </label>
      </SearchWrapper>
      <ScrollBar
        backgroundColor="transparent"
        showButtons={false}
        height="55dvh"
      >
        {sortedCustomers.length === 0 ? (
          <div>No Customer found!</div>
        ) : (
          sortedCustomers.map((customer) => {
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
