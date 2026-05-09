// Centralised react-query keys so invalidation is consistent across hooks.
export const queryKeys = {
  projects: {
    all: ["projects"] as const,
    list: () => [...queryKeys.projects.all, "list"] as const,
    detail: (projectId: string) => [...queryKeys.projects.all, "detail", projectId] as const,
  },
  scans: {
    all: ["scans"] as const,
    list: (projectId?: string, branch?: string) =>
      [...queryKeys.scans.all, "list", projectId ?? null, branch ?? null] as const,
    detail: (scanId: string) => [...queryKeys.scans.all, "detail", scanId] as const,
    findings: (scanId: string, severity?: string) =>
      [...queryKeys.scans.all, "findings", scanId, severity ?? "all"] as const,
  },
  deployments: {
    all: ["deployments"] as const,
    list: (providerId?: string) =>
      [...queryKeys.deployments.all, "list", providerId ?? null] as const,
    detail: (deploymentId: string) =>
      [...queryKeys.deployments.all, "detail", deploymentId] as const,
  },
  providers: {
    all: ["providers"] as const,
    list: () => [...queryKeys.providers.all, "list"] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (unreadOnly?: boolean) => [...queryKeys.notifications.all, "list", !!unreadOnly] as const,
    channels: () => [...queryKeys.notifications.all, "channels"] as const,
  },
  git: {
    all: ["git"] as const,
    connections: () => [...queryKeys.git.all, "connections"] as const,
    repos: (connectionId: string) => [...queryKeys.git.all, "repos", connectionId] as const,
    branches: (connectionId: string, owner: string, repo: string) =>
      [...queryKeys.git.all, "branches", connectionId, owner, repo] as const,
    stats: (
      connectionId: string,
      owner: string,
      repo: string,
      branch?: string,
      projectId?: string,
    ) =>
      [
        ...queryKeys.git.all,
        "stats",
        connectionId,
        owner,
        repo,
        branch ?? null,
        projectId ?? null,
      ] as const,
    commits: (connectionId: string, owner: string, repo: string, branch?: string) =>
      [...queryKeys.git.all, "commits", connectionId, owner, repo, branch ?? null] as const,
    members: (connectionId: string, owner: string, repo: string) =>
      [...queryKeys.git.all, "members", connectionId, owner, repo] as const,
    analyze: (
      connectionId: string,
      owner: string,
      repo: string,
      branch?: string,
      projectId?: string,
    ) =>
      [
        ...queryKeys.git.all,
        "analyze",
        connectionId,
        owner,
        repo,
        branch ?? null,
        projectId ?? null,
      ] as const,
  },
  users: {
    all: ["users"] as const,
    list: (search?: string) => [...queryKeys.users.all, "list", search ?? null] as const,
    detail: (userId: string) => [...queryKeys.users.all, "detail", userId] as const,
  },
  roles: {
    all: ["roles"] as const,
    list: () => [...queryKeys.roles.all, "list"] as const,
  },
};
