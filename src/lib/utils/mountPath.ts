const rawMountPath = import.meta.env.PUBLIC_SITE_MOUNT_PATH;

function normalizeMountPath(value?: string) {
  const trimmed = value?.trim();

  if (!trimmed || trimmed === "/") {
    return "";
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

function isExternalUrl(path: string) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path);
}

export const siteMountPath = normalizeMountPath(rawMountPath);

export function withSiteMountPath(path: string) {
  if (!siteMountPath || isExternalUrl(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (
    normalizedPath === siteMountPath ||
    normalizedPath.startsWith(`${siteMountPath}/`)
  ) {
    return normalizedPath;
  }

  if (normalizedPath === "/") {
    return siteMountPath;
  }

  return `${siteMountPath}${normalizedPath}`;
}
