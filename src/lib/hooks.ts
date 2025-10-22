import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Fetching hooks
export function useGalaxies() {
  return useQuery({
    queryKey: ["galaxies"],
    queryFn: async () => (await axios.get("/api/galaxies")).data,
  });
}

export function useSectors(galaxyId: number) {
  return useQuery({
    queryKey: ["sectors", galaxyId],
    queryFn: async () => (await axios.get(`/api/sectors?galaxyId=${galaxyId}`)).data,
    enabled: !!galaxyId,
  });
}

// Mutation hook
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; content: string; sectorId: number }) => {
      return (await axios.post("/api/posts", data)).data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["sectors", vars.sectorId] });
    },
  });
}
