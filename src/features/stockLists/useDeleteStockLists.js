import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteStockList } from "../../services/apiStockOrderLists";

export function useDeleteStockLists() {
  const queryClient = useQueryClient();
  const { mutate, isLoading: isDeleting } = useMutation({
    mutationFn: deleteStockList,
    onSuccess: () => {
      toast.success("Stock List deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["stockorderlists"] });
    },
    onError: (err) => toast.error("Stock list cannot be deleted", err.message),
  });

  return { mutate, isDeleting };
}
