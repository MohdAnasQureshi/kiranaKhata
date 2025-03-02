import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { editCustomer } from "../../services/apiCustomers";

export function useEditCustomer(setServerErrorMessage, close) {
  const queryClient = useQueryClient();

  const { mutate, isLoading: isAdding } = useMutation({
    mutationFn: ({ editedCustomerData, customerId }) =>
      editCustomer(editedCustomerData, customerId),
    onSuccess: () => {
      toast.success("Customer edited successfully");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      close();
    },
    onError: (err) => setServerErrorMessage(err.response.data.message),
  });

  return { mutate, isAdding };
}
