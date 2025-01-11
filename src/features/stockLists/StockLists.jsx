import React, { useEffect, useRef, useState } from "react";
import { useStockOrderLists } from "./useStockOrderLists";
import ScrollBar from "../../ui/ScrollBar";
import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import { formatAndGetDate, formatDate } from "../../utils/helpers";

const StockDetails = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1.6rem;
  width: max-content;
  background-color: var(--color-brand-100);
  border: 1px solid var(--color-grey-400);
  color: #000;
  border-radius: 10px;
  border-top-left-radius: 0;
  padding: 1rem 10rem 1rem 1rem;
  position: relative;
  white-space: pre-wrap;
`;

const DateLabel = styled.div`
  font-size: 1.5rem;
  border-radius: var(--border-radius-lg);
  color: var(--color-grey-700);
  position: fixed;
  top: 100px;
  background-color: var(--color-brand-50);
  padding: 0.5rem;
  left: 50%;
  top: 130px;
  transform: translate(-50%, -50%);

  @media (min-width: 1024px) {
    left: 65%;
  }
`;

const DateLabel2 = styled.div`
  font-size: 1.5rem;
  border-radius: var(--border-radius-lg);
  color: var(--color-grey-700);

  background-color: var(--color-brand-50);
  padding: 0.5rem;
  margin: auto;
`;

const StockLists = () => {
  const [currentDate, setCurrentDate] = useState("");

  const { isLoading, stockOrderLists } = useStockOrderLists();
  const scrollBarRef = useRef(null);

  useEffect(() => {
    // Automatically scroll to bottom when stockOrderLists updates
    if (stockOrderLists) {
      scrollBarRef.current?.scrollToBottom();
    }
  }, [stockOrderLists]);

  useEffect(() => {
    const container = scrollBarRef.current?.getContentRef();
    if (!container) return;

    const items = container.querySelectorAll(".content-item");
    if (!items) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.boundingClientRect.top > 0) {
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
  }, [stockOrderLists]);

  if (isLoading) return <Spinner />;
  return (
    <>
      <div>All Stocks Lists</div>
      <ScrollBar
        backgroundColor="transparent"
        showButtons={false}
        height="65vh"
        ref={scrollBarRef}
      >
        {stockOrderLists?.data?.map((list, index, arr) => {
          const currentFormattedDate = formatAndGetDate(list.createdAt);
          const previousFormattedDate =
            index > 0 ? formatAndGetDate(arr[index - 1].createdAt) : null;

          const isNewDate =
            index === 0 || currentFormattedDate !== previousFormattedDate;

          return (
            <React.Fragment key={list._id}>
              {currentDate && <DateLabel>{currentDate}</DateLabel>}

              {isNewDate && <DateLabel2>{currentFormattedDate}</DateLabel2>}
              <StockDetails
                className="content-item"
                data-list={formatAndGetDate(list.createdAt)}
              >
                {list.stockList}
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                    paddingTop: "0.5rem",
                  }}
                >
                  {formatDate(list.createdAt)}
                </span>
              </StockDetails>
            </React.Fragment>
          );
        })}
      </ScrollBar>
    </>
  );
};

export default StockLists;
