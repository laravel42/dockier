import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deployApi } from "@/lib/api";
import { queryKeys } from "./keys";

export function useDeployments(providerId?: string) {
  return useQuery({
    queryKey: queryKeys.deployments.list(providerId),
    queryFn: () => deployApi.listDeployments(providerId).then((r) => r.deployments),
  });
}

export function useDeployment(deploymentId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.deployments.detail(deploymentId ?? ""),
    queryFn: () => deployApi.getDeployment(deploymentId!),
    enabled: !!deploymentId,
    refetchInterval: (q) => {
      const data = q.state.data;
      if (!data) return false;
      return data.status === "pending" || data.status === "building" || data.status === "deploying"
        ? 3_000
        : false;
    },
  });
}

export function useDeployProviders() {
  return useQuery({
    queryKey: queryKeys.providers.list(),
    queryFn: () => deployApi.listProviders().then((r) => r.providers),
  });
}

export function useCreateDeployment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deployApi.createDeployment,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.deployments.all });
    },
  });
}

export function useDestroyDeployment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (deploymentId: string) => deployApi.destroyDeployment(deploymentId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.deployments.all });
    },
  });
}
