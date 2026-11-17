/** A category used to group contacts. */
export interface Category {
  id: string;
  name: string;
  /** Hex color used for the category badge (e.g. "#2563eb"). */
  color: string;
  createdAt: string;
}
