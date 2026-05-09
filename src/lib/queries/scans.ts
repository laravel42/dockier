import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { codeAnalysisApi } from "@/lib/api";
import { queryKeys } from "./keys";

export function useScans(projectId?: string, branch?: string) {
  return useQuery({
    queryKey: queryKeys.scans.list(projectId, branch),
    queryFn: () => codeAnalysisApi.listScans(projectId, branch).then((r) => r.scans),
  });
}

export function useScan(scanId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.scans.detail(scanId ?? ""),
    queryFn: () => codeAnalysisApi.getScan(scanId!),
    enabled: !!scanId,
    refetchInterval: (q) => {
      const data = q.state.data;
      if (!data) return false;
      return data.status === "running" || data.status === "pending" ? 2_000 : false;
    },
  });
}

export function useFindings(scanId: string | undefined, severity?: string) {
  return useQuery({
    queryKey: queryKeys.scans.findings(scanId ?? "", severity),
    queryFn: () => codeAnalysisApi.listFindings(scanId!, severity).then((r) => r.findings),
    enabled: !!scanId,
  });
}

export function useCreateScan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: codeAnalysisApi.createScan,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.scans.all });
    },
  });
}

export function useRunScan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { scanId: string; tools?: Parameters<typeof codeAnalysisApi.runScan>[1] }) =>
      codeAnalysisApi.runScan(vars.scanId, vars.tools),
    onSuccess: (_d, vars) => {
      void qc.invalidateQueries({ queryKey: queryKeys.scans.all });
      void qc.invalidateQueries({
        queryKey: queryKeys.scans.detail(vars.scanId),
      });
    },
  });
}

export function useDeleteScan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (scanId: string) => codeAnalysisApi.deleteScan(scanId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.scans.all });
    },
  });
}
