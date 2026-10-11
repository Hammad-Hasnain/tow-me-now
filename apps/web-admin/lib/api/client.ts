const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    sessionStorage.getItem("adminAccessToken") ||
    localStorage.getItem("adminAccessToken")
  );
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("adminAccessToken", token);
    localStorage.setItem("adminAccessToken", token);
  }
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminAccessToken");
    sessionStorage.removeItem("adminUser");
    localStorage.removeItem("adminUser");
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err: any) {
    throw new ApiError(
      "Cannot connect to the server. Make sure the backend server is running on " +
        API_BASE_URL,
      0
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (Array.isArray(data?.message)
        ? data.message.join(", ")
        : data?.message) ||
      data?.error ||
      `Request failed with status ${response.status}`;

    if (response.status === 401 && typeof window !== "undefined") {
      clearAuthToken();
      if (!window.location.pathname.includes("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}
