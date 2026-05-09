import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gitApi } from "@/lib/api";
import { queryKeys } from "./keys";

export function useGitConnections() {
  return useQuery({
    queryKey: queryKeys.git.connections(),
    queryFn: () => gitApi.listConnections().then((r) => r.connections),
  });
}

export function useRepoStats(
  connectionId: string | undefined,
  owner: string | undefined,
  repo: string | undefined,
  branch?: string,
  projectId?: string,
) {
  return useQuery({
    queryKey: queryKeys.git.stats(connectionId ?? "", owner ?? "", repo ?? "", branch, projectId),
    queryFn: () => gitApi.getRepoStats(connectionId!, owner!, repo!, branch, projectId),
    enabled: !!(connectionId && owner && repo),
  });
}

export function useRecentCommits(
  connectionId: string | undefined,
  owner: string | undefined,
  repo: string | undefined,
  branch?: string,
  limit?: number,
) {
  return useQuery({
    queryKey: queryKeys.git.commits(connectionId ?? "", owner ?? "", repo ?? "", branch),
    queryFn: () =>
      gitApi.getRecentCommits(connectionId!, owner!, repo!, branch, limit).then((r) => r.commits),
    enabled: !!(connectionId && owner && repo),
  });
}

export function useRepoMembers(
  connectionId: string | undefined,
  owner: string | undefined,
  repo: string | undefined,
) {
  return useQuery({
    queryKey: queryKeys.git.members(connectionId ?? "", owner ?? "", repo ?? ""),
    queryFn: () => gitApi.listRepoMembers(connectionId!, owner!, repo!).then((r) => r.members),
    enabled: !!(connectionId && owner && repo),
  });
}

export function useAddGitConnection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: gitApi.addConnection,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.git.connections() });
    },
  });
}

export function useDeleteGitConnection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (connectionId: string) => gitApi.deleteConnection(connectionId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.git.connections() });
    },
  });
}
