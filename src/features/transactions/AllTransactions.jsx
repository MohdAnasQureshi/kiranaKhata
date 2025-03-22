import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import TransactionDetail from "./TransactionDetail";
import ScrollBar from "../../ui/ScrollBar";
import Spinner from "../../ui/Spinner";
import { useParams } from "react-router-dom";
import { useTransactions } from "./useTransactions";
import { formatAndGetDate } from "../../utils/helpers";

const DateLabel = styled.div`
  font-size: 1.5rem;
  border-radius: var(--border-radius-lg);
  color: var(--color-grey-700);
  position: fixed;
  background-color: var(--color-brand-50);
  padding: 0.5rem;
  left: 50%;
  top: 120px;
  z-index: 13;
  transform: translate(-50%, -50%);
  @media (min-width: 1024px) {
    left: 65%;
  }
  @media (max-width: 376px) {
    /* iPhone SE (375px wide) */
    font-size: 12px;
  }
`;
const AllTransactions = () => {
  const { customerId } = useParams();
  const [currentDate, setCurrentDate] = useState("");
  const currentDateRef = useRef("");
  const { isLoading, error, allTransactions } = useTransactions(customerId);
  const scrollBarRef = useRef(null);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);

  useEffect(() => {
    if (allTransactions) {
      scrollBarRef.current?.scrollToBottom();
    }
  }, [allTransactions?.data.length]);

  useEffect(() => {
    const container = scrollBarRef.current?.getContentRef();
    if (!container) return;

    const items = container.querySelectorAll(".transaction-item");
    if (!items) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let newDate = currentDateRef.current;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const observedDate = entry.target.dataset.list;
            if (observedDate !== currentDateRef.current) {
              newDate = observedDate;
            }
          }
        });
        if (newDate !== currentDateRef.current) {
          currentDateRef.current = newDate;
          setCurrentDate(newDate);
        }
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
  }, [allTransactions?.data.length]);

  const transactionsList = useMemo(() => {
    if (!allTransactions?.data.length) return null;
    return allTransactions?.data.map((transaction, index, arr) => {
      const currentFormattedDate = formatAndGetDate(transaction.createdAt);
      const previousFormattedDate =
        index > 0 ? formatAndGetDate(arr[index - 1].createdAt) : null;

      const isNewDate =
        index === 0 || currentFormattedDate !== previousFormattedDate;

      return (
        <TransactionDetail
          key={transaction._id}
          isNewDate={isNewDate}
          transaction={transaction}
          currentFormattedDate={currentFormattedDate}
        />
      );
    });
  }, [allTransactions?.data.length]);

  if (isLoading) return <Spinner />;
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
      {currentDate && (
        <DateLabel>
          {currentDate === formatAndGetDate(today)
            ? `Today, ${currentDate}`
            : currentDate === formatAndGetDate(yesterday)
              ? `Yesterday, ${currentDate}`
              : currentDate}
        </DateLabel>
      )}
      {transactionsList}
    </ScrollBar>
  );
};

export default React.memo(AllTransactions);
