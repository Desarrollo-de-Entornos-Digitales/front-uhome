import { clearSession, getToken } from "./session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<Response> {
  if (!API_URL) {
    throw new Error("Falta configurar NEXT_PUBLIC_API_URL.");
  }

  const headers = new Headers(options.headers);

  const authToken = token ?? getToken();

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  if (response.status === 401 && typeof window !== "undefined") {
    clearSession();

    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  return response;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();

    if (typeof data.message === "string") {
      return data.message;
    }

    if (Array.isArray(data.message)) {
      return data.message.join(", ");
    }

    return "Ocurrió un error al comunicarse con el servidor.";
  } catch {
    return "No se pudo procesar la respuesta del servidor.";
  }
}