const FALLBACK = "/forum";

export function safeCallbackUrl(value?: string | null): string {
  if (!value) {
    return FALLBACK;
  }

  let path = value;

  try {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      path = new URL(value).pathname + new URL(value).search;
    }
  } catch {
    return FALLBACK;
  }

  if (!path.startsWith("/") || path.startsWith("//")) {
    return FALLBACK;
  }

  if (
    path.startsWith("/login") ||
    path.startsWith("/register") ||
    path.startsWith("/join")
  ) {
    return FALLBACK;
  }

  return path;
}
