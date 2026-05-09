export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type DeployStatus = "success" | "failed" | "building" | "deploying" | "queued";
export type ScanStatus = "completed" | "running" | "failed";

export interface Project {
  id: string;
  name: string;
  repo: string;
  branch: string;
  provider: "github" | "gitlab" | "bitbucket";
  language: string;
  updatedAt: string;
  findings: number;
}

export interface Deployment {
  id: string;
  projectId: string;
  repo: string;
  branch: string;
  commit: string;
  status: DeployStatus;
  provider: "vercel" | "fly" | "railway" | "aws" | "gcp";
  createdAt: string;
  duration: number;
}

export interface ScanSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  total: number;
}

export interface Scan {
  id: string;
  projectId: string;
  repo: string;
  branch: string;
  status: ScanStatus;
  createdAt: string;
  summary: ScanSummary;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  level: "info" | "warning" | "success" | "error";
  createdAt: string;
  read: boolean;
}

export const projects: Project[] = [
  { id: "p1", name: "edge-gateway", repo: "dockier/edge-gateway", branch: "main", provider: "github", language: "TypeScript", updatedAt: "2026-05-08T10:12:00Z", findings: 3 },
  { id: "p2", name: "billing-svc", repo: "dockier/billing-svc", branch: "main", provider: "github", language: "Go", updatedAt: "2026-05-07T16:40:00Z", findings: 0 },
  { id: "p3", name: "studio-web", repo: "dockier/studio-web", branch: "develop", provider: "gitlab", language: "TypeScript", updatedAt: "2026-05-06T09:22:00Z", findings: 11 },
  { id: "p4", name: "infra-terraform", repo: "dockier/infra", branch: "main", provider: "github", language: "HCL", updatedAt: "2026-05-05T14:01:00Z", findings: 2 },
  { id: "p5", name: "search-indexer", repo: "dockier/search-indexer", branch: "main", provider: "bitbucket", language: "Rust", updatedAt: "2026-05-04T08:30:00Z", findings: 1 },
];

export const deployments: Deployment[] = [
  { id: "d1", projectId: "p1", repo: "dockier/edge-gateway", branch: "main", commit: "9f3c1ab", status: "success", provider: "fly", createdAt: "2026-05-08T11:01:00Z", duration: 184 },
  { id: "d2", projectId: "p3", repo: "dockier/studio-web", branch: "develop", commit: "2b71e4d", status: "building", provider: "vercel", createdAt: "2026-05-08T10:48:00Z", duration: 0 },
  { id: "d3", projectId: "p2", repo: "dockier/billing-svc", branch: "main", commit: "ae0019c", status: "success", provider: "railway", createdAt: "2026-05-08T08:32:00Z", duration: 121 },
  { id: "d4", projectId: "p4", repo: "dockier/infra", branch: "main", commit: "1d77f02", status: "failed", provider: "aws", createdAt: "2026-05-07T22:15:00Z", duration: 56 },
  { id: "d5", projectId: "p5", repo: "dockier/search-indexer", branch: "main", commit: "c4e9b81", status: "success", provider: "gcp", createdAt: "2026-05-07T17:55:00Z", duration: 240 },
];

export const scans: Scan[] = [
  { id: "s1", projectId: "p3", repo: "dockier/studio-web", branch: "develop", status: "completed", createdAt: "2026-05-08T10:50:00Z", summary: { critical: 1, high: 3, medium: 4, low: 3, info: 0, total: 11 } },
  { id: "s2", projectId: "p1", repo: "dockier/edge-gateway", branch: "main", status: "completed", createdAt: "2026-05-08T09:12:00Z", summary: { critical: 0, high: 1, medium: 2, low: 0, info: 0, total: 3 } },
  { id: "s3", projectId: "p4", repo: "dockier/infra", branch: "main", status: "completed", createdAt: "2026-05-07T20:00:00Z", summary: { critical: 0, high: 0, medium: 1, low: 1, info: 0, total: 2 } },
  { id: "s4", projectId: "p2", repo: "dockier/billing-svc", branch: "main", status: "completed", createdAt: "2026-05-07T15:31:00Z", summary: { critical: 0, high: 0, medium: 0, low: 0, info: 0, total: 0 } },
  { id: "s5", projectId: "p5", repo: "dockier/search-indexer", branch: "main", status: "running", createdAt: "2026-05-08T11:10:00Z", summary: { critical: 0, high: 0, medium: 0, low: 0, info: 0, total: 0 } },
];

export const notifications: NotificationItem[] = [
  { id: "n1", title: "Critical finding in studio-web", body: "Hardcoded JWT secret detected in src/lib/auth.ts", level: "error", createdAt: "2026-05-08T10:55:00Z", read: false },
  { id: "n2", title: "Deployment failed", body: "infra-terraform deploy to AWS exited with code 1", level: "error", createdAt: "2026-05-07T22:16:00Z", read: false },
  { id: "n3", title: "Scan completed", body: "billing-svc: no findings", level: "success", createdAt: "2026-05-07T15:32:00Z", read: true },
  { id: "n4", title: "New team member", body: "marco@dockier.dev joined the workspace", level: "info", createdAt: "2026-05-06T09:00:00Z", read: true },
];