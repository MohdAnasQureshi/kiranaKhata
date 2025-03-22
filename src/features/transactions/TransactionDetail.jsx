import React, { useCallback, useRef } from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import {
  capitalizeFirstLetter,
  formatAndGetDate,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";
import { FaCheck } from "react-icons/fa";
import {
  useSelectedTransactions,
  useTransactionDispatch,
} from "../../contexts/TransactionContext";

const StyledTransactionDetail = styled.div`
  background-color: ${({ type }) =>
    type === "debt" ? "#ffececc1" : " #e7fff0c9"};
  padding: 1rem 1rem 0.7rem 1rem;
  box-shadow: 0 2px 4px
    ${({ type }) => (type === "debt" ? "#d861611d" : " #4fc37b1e")};
  border-radius: var(--border-radius-lg);
  width: max-content;
  max-width: 70vw;
  margin-left: ${({ type }) => (type === "debt" ? "auto" : 0)};
  position: relative;
  transition: none !important;
  animation-delay: 0s !important;
  border: 1px solid var(--color-grey-100);

  ${({ selected }) =>
    selected &&
    css`
      background-color: ${({ type }) =>
        type === "debt" ? "#ffb1b1c1" : " #a7ffc9c6"};
      border: 1px solid var(--color-grey-600);
    `}
`;
const Amount = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 2.4rem;
  font-weight: 650;
  color: ${({ type }) => (type === "debt" ? "#ff4c4cdd" : "#3db469d7")};
`;
const TransactionDate = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  padding-top: 0.2rem;
  color: var(--color-grey-600);
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
`;
const Type = styled.span`
  font-size: 1rem;
`;
const Details = styled.div`
  font-size: 1.5rem;
  word-wrap: break-word;
`;

const DateLabel2 = styled.div`
  font-size: 1.5rem;
  border-radius: var(--border-radius-lg);
  color: var(--color-grey-700);
  background-color: var(--color-brand-50);
  padding: 0.5rem;
  margin: auto;
  @media (max-width: 376px) {
    /* iPhone SE (375px wide) */
    font-size: 12px;
  }
`;

const TransactionDetail = ({
  transaction,
  isNewDate,
  currentFormattedDate,
}) => {
  const selectedTransactions = useSelectedTransactions();
  const dispatch = useTransactionDispatch();
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  const holdTimer = useRef(null);
  const touchStartY = useRef(0);
  const isScrolling = useRef(false);
  const longPressTriggered = useRef(false);

  const handleTouchStart = useCallback(
    (e) => {
      touchStartY.current = e.touches[0].clientY;
      isScrolling.current = false;
      longPressTriggered.current = false;

      holdTimer.current = setTimeout(() => {
        if (!isScrolling.current) {
          if (selectedTransactions.length === 0) {
            dispatch({ type: "SELECT_TRANSACTION", payload: transaction._id });
            longPressTriggered.current = true;
          }
        }
      }, 400);
    },
    [dispatch, selectedTransactions]
  );

  const handleTouchMove = useCallback((e) => {
    const touchCurrentY = e.touches[0].clientY;
    if (Math.abs(touchCurrentY - touchStartY.current) > 10) {
      isScrolling.current = true;
      clearTimeout(holdTimer.current);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    clearTimeout(holdTimer.current);
    if (longPressTriggered.current) return;
  }, []);

  const handleClick = useCallback(() => {
    dispatch({ type: "SELECT_TRANSACTION", payload: transaction._id });
  }, [dispatch]);

  return (
    <React.Fragment key={transaction._id}>
      {isNewDate && (
        <DateLabel2>
          {currentFormattedDate === formatAndGetDate(today)
            ? `Today`
            : currentFormattedDate === formatAndGetDate(yesterday)
              ? "Yesterday"
              : currentFormattedDate}
        </DateLabel2>
      )}
      <StyledTransactionDetail
        type={transaction?.transactionType}
        data-list={formatAndGetDate(transaction.createdAt)}
        className="transaction-item"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        selected={selectedTransactions.includes(transaction._id)}
        onClick={selectedTransactions.length > 0 ? handleClick : null}
      >
        <Amount type={transaction.transactionType}>
          {formatCurrency(transaction.amount)}
          <Type>({capitalizeFirstLetter(transaction.transactionType)})</Type>
        </Amount>
        <Details>{transaction.transactionDetails}</Details>
        <TransactionDate>
          {formatDate(transaction.transactionDate)}
        </TransactionDate>
        {selectedTransactions.includes(transaction._id) && (
          <FaCheck
            style={{
              position: "absolute",
              top: "5px",
              left: "5px",
              color: "green",
              fontSize: "18px",
              borderRadius: "50%",
              backgroundColor: "white",
              border: "1px solid black",
              padding: "0.2rem",
              transition: "0s",
              animationDelay: "0s",
              pointerEvents: "none",
            }}
          />
        )}
      </StyledTransactionDetail>
    </React.Fragment>
  );
};
TransactionDetail.propTypes = {
  transactionId: PropTypes.string,
  currentDate: PropTypes.string,
  transaction: PropTypes.object,
  isNewDate: PropTypes.bool,
  currentFormattedDate: PropTypes.string,
};

export default React.memo(TransactionDetail);
