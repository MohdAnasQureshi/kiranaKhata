import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCustomer } from "../../services/apiCustomers";
import toast from "react-hot-toast";

export function useAddCustomer(setServerErrorMessage, reset) {
  const queryClient = useQueryClient();

  const { mutate, isLoading: isAdding } = useMutation({
    mutationFn: addCustomer,
    onSuccess: () => {
      toast.success("New Customer added successfully");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      reset();
    },
    onError: (err) => setServerErrorMessage(err.response.data.message),
  });

  return { mutate, isAdding };
}
