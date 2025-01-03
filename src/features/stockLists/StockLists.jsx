import React from "react";
import { useStockOrderLists } from "./useStockOrderLists";
import ScrollBar from "../../ui/ScrollBar";
import styled from "styled-components";

const Para = styled.p`
  font-size: 2rem;
  white-space: pre-wrap;
`;

const StockLists = () => {
  const { isLoading, error, stockOrderLists } = useStockOrderLists();
  console.log(stockOrderLists, error, isLoading);
  return (
    <>
      <div>All Stocks Lists</div>
      <ScrollBar
        backgroundColor="transparent"
        showButtons={false}
        height="50vh"
      >
        {stockOrderLists?.data?.map((list) => (
          <Para key={list._id}>{list.stockList}</Para>
        ))}
      </ScrollBar>
    </>
  );
};

export default StockLists;
