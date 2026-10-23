export async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/admin/${path}`, { ...options, credentials: "same-origin", cache: "no-store", headers: { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...options.headers } });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 409) throw new Error("CONFLICT");
    throw new Error(result.error || result.message || "No fue posible completar la operación. Inténtelo de nuevo.");
  }
  return result as T;
}
