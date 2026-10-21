export interface Tenant {
  id: string;
  name: string;
  slug: string; // Útil para la URL: /api/{slug}/...
  createdAt: Date;
}
