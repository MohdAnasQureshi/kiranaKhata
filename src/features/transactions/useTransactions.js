import { useQuery } from "@tanstack/react-query";
import { getAllTransactions } from "../../services/apiTransactions";

export function useTransactions(customerId) {
  const {
    isLoading,
    data: allTransactions,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getAllTransactions(customerId),
  });

  return {
    isLoading,
    error,
    allTransactions,
    refetch,
    isFetching,
  };
}
