// Shared API types — copied 1:1 from the legacy frontend so that the
// services lifted from there work without modification. These mirror the
// Encore endpoint response shapes.

export type ProjectSourceType = "repository" | "template";

export interface Project {
  id: string;
  name: string;
  repository: string;
  branch: string;
  connectionId: string;
  platform?: string;
  sourceType?: ProjectSourceType;
  template?: string;
  createdAt: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultRepo: string;
  defaultBranch: string;
}

export interface Deployment {
  id: string;
  providerId: string;
  projectId: string;
  repo: string;
  branch: string;
  status: string;
  logs: string;
  appUrl: string;
  commitHash: string;
  dockerImage: string;
  deployStrategy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Provider {
  id: string;
  provider: string;
  label: string;
}

export interface ScanSummary {
  totalFindings: number;
  errors: number;
  warnings: number;
  infos: number;
  filesScanned: number;
  filesInRepo: number;
}

export interface Scan {
  id: string;
  projectId: string;
  repo: string;
  branch: string;
  status: string;
  summary: ScanSummary;
  commitSha: string;
  commitMessage: string;
  commitAuthor: string;
  commitDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Finding {
  id: string;
  ruleId: string;
  severity: string;
  message: string;
  filePath: string;
  startLine: number;
  endLine: number;
  snippet: string;
}

export interface ScanProgress {
  phase: string;
  filesScanned: number;
  filesInRepo: number;
  findingsCount: number;
  currentFile?: string;
}

export interface Connection {
  id: string;
  provider: string;
  label: string;
  repoUrl: string;
  endpoint: string;
  createdAt: string;
}

export interface Repo {
  name: string;
  fullName: string;
  url: string;
  defaultBranch: string;
  private: boolean;
}

export interface TechBadgeInfo {
  name: string;
  category: string;
  confidence: number;
}

export interface RepoStats {
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  language: string;
  languages: Record<string, number>;
  lastCommitDate: string;
  lastCommitMessage: string;
  lastCommitAuthor: string;
  lastCommitHash: string;
  totalCommits: number;
  contributors: number;
  topContributors: Array<{ name: string; avatarUrl: string; commits: number; profileUrl: string }>;
}

export interface RepoMember {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
}

export interface FixResult {
  mrUrl: string;
  mrId: string;
  mrTitle: string;
}

export interface CommitInfo {
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  authorAvatar?: string;
  date: string;
  url?: string;
}

export interface PMIntegration {
  id: string;
  type: string;
  name: string;
  config: Record<string, string>;
  enabled: boolean;
}

export interface PMTeam {
  id: string;
  name: string;
  key?: string;
}

export interface PMMember {
  id: string;
  name: string;
  email?: string;
}
