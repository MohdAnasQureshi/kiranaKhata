import { useQuery } from "@tanstack/react-query";
import { getCurrentShopOwner } from "../../services/apiAuth";

export function useShopOwner() {
  const { data: shopOwner, isLoading } = useQuery(
    ["shopOwner"],
    getCurrentShopOwner,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );
  return { shopOwner, isLoading };
}
