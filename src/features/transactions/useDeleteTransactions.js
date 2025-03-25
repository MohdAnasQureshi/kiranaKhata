import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteTransaction } from "../../services/apiTransactions";

export function useDeleteTransaction(customerId) {
  const queryClient = useQueryClient();

  const { mutate, isLoading: isDeleting } = useMutation({
    mutationFn: (transactionId) => deleteTransaction(customerId, transactionId),
    onSuccess: () => {
      toast.success("Transaction deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["transactions", customerId],
      });
    },
    onError: (err) => toast.error(err),
  });

  return { mutate, isDeleting };
}
