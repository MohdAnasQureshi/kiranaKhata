import axios from "axios";
import ACCESS_TOKEN from "../../constants";

export async function getStockOrderLists() {
  const { data, error } = await axios.get(
    "http://192.168.1.20:8000/api/v1/shopOwners/stockOrderLists/all-stockLists",
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );
  if (error) {
    console.error(error);
    throw new Error("Stock Lists cannot be loaded");
  }

  return data;
}

export async function addStockList(stockList) {
  const { data, error } = await axios.post(
    `http://192.168.1.20:8000/api/v1/shopOwners/stockOrderLists/add-stockList`,
    stockList,
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );

  if (error) {
    console.error(error.request.response);
    throw new Error("Stock List cannot be added");
  }
  return data;
}
