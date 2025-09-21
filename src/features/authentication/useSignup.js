import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export function useSignup() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: signupApi,
    onSuccess: (shopOwnerData) => {
      queryClient.setQueryData(["shopOwner"], shopOwnerData?.data?.shopOwner);
      navigate("/customers", { replace: true });
      toast.success("Account successfully created!");
    },
    onError: () => {
      toast.error("Cannot register shop owner try again");
    },
  });

  return { signup, isLoading };
}
