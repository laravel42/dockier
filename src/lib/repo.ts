/**
 * Core repo URL parser. Extracts owner and repo name from a git URL.
 * Supports GitLab nested groups: group/subgroup/repo → owner=group/subgroup, repo=repo
 */
export function parseOwnerRepo(repoUrl: string): { owner: string; repo: string } | null {
  try {
    const u = new URL(repoUrl);
    const parts = u.pathname
      .replace(/^\//, "")
      .replace(/\.git$/, "")
      .split("/")
      .filter(Boolean);
    if (parts.length >= 2) {
      const repo = parts[parts.length - 1];
      const owner = parts.slice(0, parts.length - 1).join("/");
      return { owner, repo };
    }
  } catch {
    /* not a URL, fall through */
  }
  // Plain "owner/repo" form
  const parts = repoUrl
    ?.replace(/\.git$/, "")
    .split("/")
    .filter(Boolean);
  if (parts && parts.length >= 2) {
    const repo = parts[parts.length - 1];
    const owner = parts.slice(0, parts.length - 1).join("/");
    return { owner, repo };
  }
  return null;
}

export function getRepoSlug(repoUrl: string): string {
  const parsed = parseOwnerRepo(repoUrl);
  if (parsed) return parsed.repo;
  return (
    repoUrl
      ?.split("/")
      .pop()
      ?.replace(/\.git$/, "") || "—"
  );
}

export function getRepoKey(repoUrl: string): string | null {
  const parsed = parseOwnerRepo(repoUrl);
  if (parsed) return `${parsed.owner}/${parsed.repo}`;
  return null;
}

export function timeAgo(iso: string): string {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}
