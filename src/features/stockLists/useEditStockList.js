import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { editStockList } from "../../services/apiStockOrderLists";

export function useEditStockList(stockListId) {
  const queryClient = useQueryClient();
  const { mutate, isLoading: isEditing } = useMutation({
    mutationFn: (editedStockList) =>
      editStockList(editedStockList, stockListId),
    onSuccess: () => {
      toast.success("Stock List edited successfully");
      queryClient.invalidateQueries({ queryKey: ["stockorderlists"] });
      console.log(
        "Cached data:",
        queryClient.getQueryData(["stockorderlists"])
      );
    },
    onError: (err) => toast.error("Stock list cannot be edited", err.message),
  });

  return { mutate, isEditing };
}
