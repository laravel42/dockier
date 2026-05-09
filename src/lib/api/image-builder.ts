import { request } from "./request";

export const imageBuilderApi = {
  startBuild: (data: {
    sourceRepo: string;
    sourceRef?: string;
    commitSha?: string;
    imageRepo?: string;
    dockerfilePath?: string;
    buildContext?: string;
    tags?: string[];
    projectId?: string;
    gitConnectionId?: string;
    deployTarget?: "ecs" | "ec2" | "s3";
    providerId?: string;
    deployParams?: Record<string, unknown>;
  }) =>
    request<{
      id: string;
      codebuildId: string;
      sourceRepo: string;
      sourceRef: string;
      commitSha: string;
      imageUri: string;
      status: string;
      logsUrl: string;
      createdAt: string;
    }>("/image-builder/builds", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getBuild: (buildId: string) =>
    request<{
      id: string;
      sourceRepo: string;
      sourceRef: string;
      commitSha: string;
      imageUri: string;
      status: string;
      statusReason: string;
      logsUrl: string;
      tags: string[];
      buildMetadata: Record<string, string>;
      startedAt: string;
      finishedAt: string;
      createdAt: string;
    }>(`/image-builder/builds/${buildId}`),

  listBuilds: (params?: { sourceRepo?: string; status?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.sourceRepo) qs.set("sourceRepo", params.sourceRepo);
    if (params?.status) qs.set("status", params.status);
    if (params?.limit) qs.set("limit", String(params.limit));
    const q = qs.toString();
    return request<{
      builds: Array<{
        id: string;
        sourceRepo: string;
        sourceRef: string;
        commitSha: string;
        imageUri: string;
        status: string;
        statusReason: string;
        logsUrl: string;
        startedAt: string;
        finishedAt: string;
        createdAt: string;
      }>;
    }>(`/image-builder/builds${q ? `?${q}` : ""}`);
  },

  getImageForRevision: (revision: string) =>
    request<{
      imageUri: string;
      buildId: string;
      commitSha: string;
      status: string;
      createdAt: string;
    }>(`/image-builder/images/${encodeURIComponent(revision)}`),

  cancelBuild: (buildId: string) =>
    request<{ id: string; status: string; statusReason: string }>(
      `/image-builder/builds/${buildId}/cancel`,
      { method: "POST" },
    ),

  getBuildLogs: (buildId: string, nextToken?: string) => {
    const q = nextToken ? `?nextToken=${encodeURIComponent(nextToken)}` : "";
    return request<{ buildId: string; logs: string[]; nextToken?: string }>(
      `/image-builder/builds/${buildId}/logs${q}`,
    );
  },

  getDeployStatus: (buildId: string) =>
    request<{ status: string; appUrl: string; stackName: string }>(
      `/image-builder/builds/${buildId}/deploy-status`,
    ),
};
