export async function api(path, options = {}) {
  let response;
  try {
    response = await fetch(path, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    throw new Error(
      "We couldn’t reach the kitchen. Check your connection and try again.",
    );
  }
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      (data.errors || ["Something went wrong. Please try again."]).join(" "),
    );
    error.status = response.status;
    throw error;
  }
  return data;
}
