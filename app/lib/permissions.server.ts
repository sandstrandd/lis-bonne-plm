export const REQUIRED_SHOPIFY_SCOPES = [
  "read_products",
  "read_files",
] as const;

export type RequiredShopifyScope = (typeof REQUIRED_SHOPIFY_SCOPES)[number];

export type AppRole = "owner" | "editor" | "viewer";

export type AppPermission =
  | "products:read"
  | "products:write"
  | "costing:read"
  | "costing:write"
  | "samples:read"
  | "samples:write"
  | "approvals:read"
  | "approvals:write"
  | "readiness:read"
  | "readiness:run"
  | "settings:read"
  | "settings:update";

export const ROLE_PERMISSIONS: Record<AppRole, readonly AppPermission[]> = {
  owner: [
    "products:read",
    "products:write",
    "costing:read",
    "costing:write",
    "samples:read",
    "samples:write",
    "approvals:read",
    "approvals:write",
    "readiness:read",
    "readiness:run",
    "settings:read",
    "settings:update",
  ],
  editor: [
    "products:read",
    "products:write",
    "costing:read",
    "costing:write",
    "samples:read",
    "samples:write",
    "approvals:read",
    "approvals:write",
    "readiness:read",
    "readiness:run",
    "settings:read",
  ],
  viewer: [
    "products:read",
    "costing:read",
    "samples:read",
    "approvals:read",
    "readiness:read",
    "settings:read",
  ],
};

export function hasPermission(
  role: AppRole,
  permission: AppPermission,
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function assertPermission(
  role: AppRole,
  permission: AppPermission,
): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Missing app permission: ${permission}`);
  }
}

export function parseShopifyScopes(scopes: string | null | undefined): Set<string> {
  return new Set(
    (scopes ?? "")
      .split(",")
      .map((scope) => scope.trim())
      .filter(Boolean),
  );
}

export function missingRequiredShopifyScopes(
  grantedScopes: string | Iterable<string> | null | undefined,
): RequiredShopifyScope[] {
  const granted =
    typeof grantedScopes === "string"
      ? parseShopifyScopes(grantedScopes)
      : new Set(grantedScopes ?? []);

  return REQUIRED_SHOPIFY_SCOPES.filter((scope) => !granted.has(scope));
}
