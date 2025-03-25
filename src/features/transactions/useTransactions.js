import { useQuery } from "@tanstack/react-query";
import { getAllTransactions } from "../../services/apiTransactions";

export function useTransactions(customerId) {
  const {
    isLoading,
    data: allTransactions,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["transactions", customerId],
    queryFn: () => getAllTransactions(customerId),
  });

  return {
    isLoading,
    refetch,
    allTransactions,
    isFetching,
  };
}
