import { useQuery } from "@tanstack/react-query";
import { getStockOrderLists } from "../../services/apiStockOrderLists";

export function useStockOrderLists() {
  const {
    isLoading,
    data: stockOrderLists,
    error,
  } = useQuery({
    queryKey: ["stockorderlists"],
    queryFn: getStockOrderLists,
  });

  return {
    isLoading,
    error,
    stockOrderLists,
  };
}
