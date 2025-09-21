import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { sendOtp } from "../../services/apiAuth";

export function useSendOtp() {
  const { mutate, isLoading } = useMutation({
    mutationFn: sendOtp,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (err) => {
      console.log("ERROR", err);
      toast.error("Otp cannot be sent try again!");
    },
  });

  return { mutate, isLoading };
}
