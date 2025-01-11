import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addStockList } from "../../services/apiStockOrderLists";
import toast from "react-hot-toast";

export function useAddStockList() {
  const queryClient = useQueryClient();
  const { mutate, isLoading: isAdding } = useMutation({
    mutationFn: addStockList,
    onSuccess: () => {
      toast.success("Stock List added successfully");
      queryClient.invalidateQueries({ queryKey: ["stockorderlists"] });
    },
    onError: (err) => toast.error("Stock list cannot be added", err.message),
  });

  return { mutate, isAdding };
}
