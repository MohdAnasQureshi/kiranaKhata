import React from "react";
import AddStockList from "../features/stockLists/AddStockList";
import StockLists from "../features/stockLists/StockLists";

const StockOrderList = () => {
  return (
    <>
      <StockLists />
      <AddStockList />
    </>
  );
};

export default StockOrderList;
