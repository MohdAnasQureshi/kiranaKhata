import React, { useRef } from "react";
import styled, { keyframes } from "styled-components";
import Input from "../../ui/Input";
import PropTypes from "prop-types";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import {
  calculateMonthsAndDays,
  capitalizeFirstLetter,
  formatCurrency,
} from "../../utils/helpers";
import { FaAngleRight } from "react-icons/fa";

// const StatsContainer = styled.div`
//   transition:
//     opacity 0.6s ease,
//     transform 0.6s ease,
//     max-height 0.6s ease,
//     margin 0.6s ease;
//   opacity: ${(props) => (props.$hide ? 0 : 1)};
//   transform: ${(props) =>
//     props.$hide ? "translateY(-10px)" : "translateY(0)"};
//   max-height: ${(props) =>
//     props.$hide ? "0px" : "200px"}; /* Smooth collapse */
//   overflow: hidden;
//   width: 100%;
// `;

// const marquee = keyframes`
//   0% { transform: translateX(100%);}
//   100% { transform: translateX(-100%);}
// `;

// const StyledCustomerStats = styled.div`
//   display: flex;
//   border-radius: var(--border-radius-lg);
//   border: 1px solid var(--color-grey-100);
//   border-bottom: 1px solid var(--color-grey-200);
//   box-shadow: 0 3px 8px var(--color-grey-100);
//   flex-direction: row;
//   background-color: var(--color-silver-100);
//   font-size: 1.4rem;
//   font-weight: 600;
//   gap: 0.5rem;
//   align-items: center;
//   padding: 0.5rem 1rem 0.5rem 1rem;
//   margin: 0 0.8rem 0 0.8rem;
//   cursor: pointer;
//   animation: ${marquee} 12s linear infinite;
// `;

const StatsContainer = styled.div`
  transition:
    opacity 0.6s ease,
    transform 0.6s ease,
    max-height 0.6s ease,
    margin 0.6s ease;
  opacity: ${(props) => (props.$hide ? 0 : 1)};
  transform: ${(props) =>
    props.$hide ? "translateY(-10px)" : "translateY(0)"};
  max-height: ${(props) => (props.$hide ? "0px" : "200px")};
  overflow: hidden;
  width: 100%;
`;

const marquee = keyframes`
  0% { 
    transform: translateX(0);
  }
  100% { 
    transform: translateX(-100%);
  }
`;

const MarqueeWrapper = styled.div`
  display: flex;
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-grey-100);
  border-bottom: 1px solid var(--color-grey-200);
  box-shadow: 0 3px 8px var(--color-grey-100);
  background-color: var(--color-grey-50);
  margin: 0 0.8rem 0 0.8rem;
  overflow: hidden;
  white-space: nowrap;
`;

const MarqueeContent = styled.div`
  display: flex;
  animation: ${marquee} 10s linear infinite;

  /* Ensure content spans full width for smooth loop */
  min-width: 100%;
`;

const StyledCustomerStats = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 1.4rem;
  font-weight: 600;
  gap: 2rem;
  align-items: center;
  padding: 0.5rem 1rem;
  white-space: nowrap;

  /* Duplicate content for seamless loop */
  &::after {
    content: attr(data-content);
    margin-left: 2rem;
  }
`;

const DebtItem = styled.p`
  cursor: pointer;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: var(--color-brand-600);
  }
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
  margin-top: 0.8rem;
  margin-bottom: 0.2rem;
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  color: gray;
  font-size: 20px;
  cursor: pointer;
`;

const CloseButton = styled(IoClose)`
  position: absolute;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  color: gray;
  font-size: 26px;
  transition: 0.4s ease;
  cursor: pointer;
  &:active {
    color: red;
  }
`;
const TotalCustomers = styled.div`
  padding: 0.2rem;
  padding-top: 0.6rem;
  font-size: 1.4rem;
  margin: auto;
  margin-bottom: 0.2rem;
`;

const CustomerStats = ({
  searchTerm,
  setSearchTerm,
  handleRowClick,
  filteredValue,
  sortedCustomers,
  customers,
}) => {
  const searchInputRef = useRef(null);

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

  return (
    <>
      {customerWithHighestDebt.totalOutstandingDebt > 0 ? (
        <StatsContainer $hide={searchTerm.length > 0}>
          <MarqueeWrapper>
            <MarqueeContent>
              <StyledCustomerStats
                data-content={`Highest Debt: ${capitalizeFirstLetter(customerWithHighestDebt.customerName)} (${formatCurrency(customerWithHighestDebt.totalOutstandingDebt)}) • Oldest debt: ${capitalizeFirstLetter(oldestCustomerWithUnpaidDebt?.customerName)}, not paid since ${
                  years > 0
                    ? `${years} years ${months > 0 ? `${months} ${months === 1 ? "month" : "months"}` : ""} ${days > 0 ? `${days} ${days === 1 ? "day" : "days"}` : ""}`
                    : months > 0
                      ? `${months} ${months === 1 ? "month" : "months"} ${days > 0 ? `${days} ${days === 1 ? "day" : "days"}` : ""}`
                      : days === 0
                        ? "today"
                        : `${days} ${days === 1 ? "day" : "days"}`
                }`}
              >
                <DebtItem
                  onClick={() =>
                    handleRowClick(customerWithHighestDebt._id, {
                      customerName: customerWithHighestDebt.customerName,
                      customerContact: customerWithHighestDebt.customerContact,
                    })
                  }
                >
                  💰 Highest Debtor :{" "}
                  {capitalizeFirstLetter(customerWithHighestDebt.customerName)}{" "}
                  (
                  {formatCurrency(customerWithHighestDebt.totalOutstandingDebt)}
                  )
                  <FaAngleRight
                    style={{
                      color: "var(--color-brand-500)",
                      fontSize: "16px",
                    }}
                  />
                </DebtItem>

                <span
                  style={{ margin: "0 1rem", color: "var(--color-grey-400)" }}
                >
                  •
                </span>

                <DebtItem
                  onClick={() =>
                    handleRowClick(oldestCustomerWithUnpaidDebt._id, {
                      customerName: oldestCustomerWithUnpaidDebt.customerName,
                      customerContact:
                        oldestCustomerWithUnpaidDebt.customerContact,
                    })
                  }
                >
                  ⚠️ Oldest debtor :{" "}
                  {capitalizeFirstLetter(
                    oldestCustomerWithUnpaidDebt?.customerName
                  )}
                  , overdue since{" "}
                  {years > 0
                    ? `${years} years ${months > 0 ? `${months} ${months === 1 ? "month" : "months"}` : ""} ${days > 0 ? `${days} ${days === 1 ? "day" : "days"}` : ""}`
                    : months > 0
                      ? `${months} ${months === 1 ? "month" : "months"} ${days > 0 ? `${days} ${days === 1 ? "day" : "days"}` : ""}`
                      : days === 0
                        ? "today"
                        : `${days} ${days === 1 ? "day" : "days"}`}
                  <FaAngleRight
                    style={{
                      color: "var(--color-brand-500)",
                      fontSize: "16px",
                    }}
                  />
                </DebtItem>

                {/* Duplicate content for seamless loop */}
                <span
                  style={{ margin: "0 1rem", color: "var(--color-grey-400)" }}
                >
                  •
                </span>

                <DebtItem
                  onClick={() =>
                    handleRowClick(customerWithHighestDebt._id, {
                      customerName: customerWithHighestDebt.customerName,
                      customerContact: customerWithHighestDebt.customerContact,
                    })
                  }
                >
                  Highest Debt:{" "}
                  {capitalizeFirstLetter(customerWithHighestDebt.customerName)}{" "}
                  (
                  {formatCurrency(customerWithHighestDebt.totalOutstandingDebt)}
                  )
                  <FaAngleRight
                    style={{
                      color: "var(--color-brand-500)",
                      fontSize: "16px",
                    }}
                  />
                </DebtItem>

                <span
                  style={{ margin: "0 1rem", color: "var(--color-grey-400)" }}
                >
                  •
                </span>

                <DebtItem
                  onClick={() =>
                    handleRowClick(oldestCustomerWithUnpaidDebt._id, {
                      customerName: oldestCustomerWithUnpaidDebt.customerName,
                      customerContact:
                        oldestCustomerWithUnpaidDebt.customerContact,
                    })
                  }
                >
                  Oldest debt:{" "}
                  {capitalizeFirstLetter(
                    oldestCustomerWithUnpaidDebt?.customerName
                  )}
                  , not paid since{" "}
                  {years > 0
                    ? `${years} years ${months > 0 ? `${months} ${months === 1 ? "month" : "months"}` : ""} ${days > 0 ? `${days} ${days === 1 ? "day" : "days"}` : ""}`
                    : months > 0
                      ? `${months} ${months === 1 ? "month" : "months"} ${days > 0 ? `${days} ${days === 1 ? "day" : "days"}` : ""}`
                      : days === 0
                        ? "today"
                        : `${days} ${days === 1 ? "day" : "days"}`}
                  <FaAngleRight
                    style={{
                      color: "var(--color-brand-500)",
                      fontSize: "16px",
                    }}
                  />
                </DebtItem>
              </StyledCustomerStats>
            </MarqueeContent>
          </MarqueeWrapper>
        </StatsContainer>
      ) : (
        ""
      )}
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
      <TotalCustomers>
        {`Total ${filteredValue === "debtors" ? "debtors" : filteredValue === "depositors" ? "depositors" : filteredValue === "settled" ? "settled customers" : "customers"} : `}{" "}
        {sortedCustomers?.length}
      </TotalCustomers>
    </>
  );
};

CustomerStats.propTypes = {
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
  handleRowClick: PropTypes.func,
  filteredValue: PropTypes.string,
  sortedCustomers: PropTypes.array,
  customers: PropTypes.object,
};

export default CustomerStats;
