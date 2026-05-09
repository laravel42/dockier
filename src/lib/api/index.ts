// Domain API client barrel — re-exported individually so callers can either
// import from "@/lib/api" or from a specific domain module if they prefer.
export { request, apiBase } from "./request";

export { authApi } from "./auth";
export { usersApi } from "./users";
export { rolesApi } from "./roles";
export { projectsApi } from "./projects";
export { gitApi } from "./git";
export { codeAnalysisApi } from "./code-analysis";
export { deployApi } from "./deploy";
export { notificationsApi } from "./notifications";
export { integrationsApi } from "./integrations";
export { imageBuilderApi } from "./image-builder";

export type * from "./types";
