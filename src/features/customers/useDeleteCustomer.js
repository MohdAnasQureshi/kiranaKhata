import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomer } from "../../services/apiCustomers";
import toast from "react-hot-toast";

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  const { mutate, isLoading: isDeleting } = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      toast.success("Customer deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (err) => toast.error("Customer cannot be deleted", err.message),
  });

  return { mutate, isDeleting };
}
