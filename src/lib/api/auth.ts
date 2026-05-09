import { request } from "./request";

// Encore-side auth endpoints. With Supabase as the identity provider, the
// frontend uses these only when the workspace explicitly opts into the
// Encore-managed JWT/2FA flow. The default sign-in path goes through Supabase.
export const authApi = {
  register: (data: { email: string; password: string; name: string; appId?: string }) =>
    request<{ token: string; userId: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ token: string; userId: string; requires2FA?: boolean }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  verify2FA: (data: { userId: string; token: string }) =>
    request<{ token: string; userId: string }>("/auth/2fa/verify", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { Authorization: "" },
    }),

  setup2FA: () =>
    request<{ secret: string; qrCodeUrl: string }>("/auth/2fa/setup", {
      method: "POST",
    }),

  enable2FA: (token: string) =>
    request<{ success: boolean }>("/auth/2fa/enable", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  getMe: () =>
    request<{
      userId: string;
      email: string;
      name: string;
      roleId: string;
      appId: string;
    }>("/auth/me"),
};
