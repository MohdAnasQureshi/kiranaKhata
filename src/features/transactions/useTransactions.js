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
    queryKey: ["transactions", customerId],
    queryFn: () => getAllTransactions(customerId),
    enabled: !!customerId, // Prevents fetching if customerId is undefined
    staleTime: 1000 * 60 * 5,
  });

  return {
    isLoading,
    error,
    allTransactions,
    refetch,
    isFetching,
  };
}
