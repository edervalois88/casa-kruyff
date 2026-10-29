import type { COPY } from "./copy";
import type { Designer, Lang, Piece, ProjectItem } from "./site-data";

export type ImageAsset = { src: string; credit: string; href: string };
export type HeroKey = "home" | "interiorHome" | "interior" | "house" | "journal" | "contact";

export interface ManagedPiece extends Piece {
  nameEn: string;
  description: [string, string];
  images: string[];
  published: boolean;
  availability: "available" | "on-request" | "sold";
}

export interface SiteContent {
  catalogVersion?: number;
  revision: number;
  updatedAt: string;
  pieces: ManagedPiece[];
  cats: [string, string, string][];
  images: Record<string, ImageAsset>;
  heroes: Record<HeroKey, ImageAsset>;
  copy: typeof COPY;
  projects: ProjectItem[];
  designers: Designer[];
  settings: { phone: string; instagramUsername: string; defaultLanguage: Lang };
}
