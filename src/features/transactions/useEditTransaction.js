import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { editTransaction } from "../../services/apiTransactions";

export function useEditTransaction(customerId, transactionId) {
  const queryClient = useQueryClient();

  const { mutate, isLoading: isEditing } = useMutation({
    mutationFn: (editedTransaction) =>
      editTransaction(editedTransaction, customerId, transactionId),
    onSuccess: () => {
      toast.success("Transaction edited successfully");
      queryClient.invalidateQueries({
        queryKey: ["transactions", customerId],
      });
    },
    onError: (err) => toast.error(err),
  });

  return { mutate, isEditing };
}
