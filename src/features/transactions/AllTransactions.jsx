import React, { useEffect, useRef, useState } from "react";
import ScrollBar from "../../ui/ScrollBar";
import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import { useParams } from "react-router-dom";
import { useTransactions } from "./useTransactions";
import {
  capitalizeFirstLetter,
  formatAndGetDate,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";

const TransactionDetail = styled.div`
  background-color: ${({ type }) =>
    type === "debt" ? "#ffececc1" : " #e7fff0c9"};
  padding: 1rem 1rem 0.7rem 1rem;
  box-shadow: 0 2px 4px
    ${({ type }) => (type === "debt" ? "#d861611d" : " #4fc37b1e")};
  border-radius: var(--border-radius-lg);
  width: max-content;
  max-width: 70vw;
  margin-left: ${({ type }) => (type === "debt" ? "auto" : 0)};
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

const DateLabel = styled.div`
  font-size: 1.5rem;
  border-radius: var(--border-radius-lg);
  color: var(--color-grey-700);
  position: fixed;
  background-color: var(--color-brand-50);
  padding: 0.5rem;
  left: 50%;
  top: 120px;
  transform: translate(-50%, -50%);
  @media (min-width: 1024px) {
    left: 65%;
  }
  @media (max-width: 376px) {
    /* iPhone SE (375px wide) */
    font-size: 12px;
  }
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

const AllTransactions = () => {
  const [currentDate, setCurrentDate] = useState("");
  const { customerId } = useParams();
  const { isLoading, error, allTransactions, refetch, isFetching } =
    useTransactions(customerId);
  const scrollBarRef = useRef(null);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  useEffect(() => {
    refetch();
  }, [customerId]);

  useEffect(() => {
    if (allTransactions) {
      scrollBarRef.current?.scrollToBottom();
    }
  }, [allTransactions, isFetching, customerId]);

  useEffect(() => {
    const container = scrollBarRef.current?.getContentRef();
    if (!container) return;

    const items = container.querySelectorAll(".transaction-item");
    if (!items) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentDate(entry.target.dataset.list);
          }
        });
      },
      {
        root: container,
        rootMargin: "0px 0px -90% 0px", // Adjust to observe elements as if from the top
        threshold: 0.001,
      }
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
    };
  }, [allTransactions, isFetching, customerId]);

  if (isLoading || isFetching) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;
  if (allTransactions?.data?.length === 0) {
    return <div>No transactions found for this customer.</div>;
  }
  return (
    <ScrollBar
      backgroundColor="transparent"
      showButtons={false}
      height="calc(100dvh - 300px)"
      ref={scrollBarRef}
    >
      {allTransactions?.data.map((transaction, index, arr) => {
        const currentFormattedDate = formatAndGetDate(transaction.createdAt);
        const previousFormattedDate =
          index > 0 ? formatAndGetDate(arr[index - 1].createdAt) : null;

        const isNewDate =
          index === 0 || currentFormattedDate !== previousFormattedDate;

        return (
          <React.Fragment key={transaction._id}>
            {currentDate && (
              <DateLabel>
                {currentDate === formatAndGetDate(today)
                  ? `Today, ${currentDate}`
                  : currentDate === formatAndGetDate(yesterday)
                    ? `Yesterday, ${currentDate}`
                    : currentDate}
              </DateLabel>
            )}

            {isNewDate && (
              <DateLabel2>
                {currentFormattedDate === formatAndGetDate(today)
                  ? `Today`
                  : currentFormattedDate === formatAndGetDate(yesterday)
                    ? "Yesterday"
                    : currentFormattedDate}
              </DateLabel2>
            )}
            <TransactionDetail
              key={transaction._id}
              type={transaction.transactionType}
              data-list={formatAndGetDate(transaction.createdAt)}
              className="transaction-item"
            >
              <Amount type={transaction.transactionType}>
                {formatCurrency(transaction.amount)}
                <Type>
                  ({capitalizeFirstLetter(transaction.transactionType)})
                </Type>
              </Amount>
              <Details>{transaction.transactionDetails}</Details>
              <TransactionDate>
                {formatDate(transaction.transactionDate)}
              </TransactionDate>
            </TransactionDetail>
          </React.Fragment>
        );
      })}
    </ScrollBar>
  );
};

export default AllTransactions;
