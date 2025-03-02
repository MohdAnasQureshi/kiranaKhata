import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addTransaction } from "../../services/apiTransactions";

export function useAddTransaction(reset, customerId) {
  const queryClient = useQueryClient();

  const { mutate, isLoading: isAdding } = useMutation({
    mutationFn: (data) => addTransaction(data, customerId),
    onSuccess: () => {
      toast.success("New transaction added successfully");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      reset();
    },
    onError: (err) => toast.error(err),
  });

  return { mutate, isAdding };
}
