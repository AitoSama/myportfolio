import type { Timestamp } from "firebase/firestore";

export type ProjectStatus = "published" | "draft" | "archived";

export type ArtworkStatus = "published" | "draft" | "archived";

export type ArtworkFormat =
  | "Headshot"
  | "Half Body"
  | "Full Body"
  | "Illustration"
  | "Sticker"
  | "Sketch";

export type ArtworkType =
  | "Original"
  | "Fan Art"
  | "Commission"
  | "Adoptable"
  | "Commercial";

export interface ProjectScreenshot {
  url: string;
  path?: string;
}

export interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  date: string;
  category: string;
  role: string;
  technologies: string[];
  status: ProjectStatus;
  thumbnail: string;
  imagePath?: string;
  thumbnailPath?: string;
  screenshots: ProjectScreenshot[];
  liveUrl?: string;
  sourceUrl?: string;
  relatedArtwork: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Artwork {
  slug: string;
  title: string;
  image: string;
  imagePath?: string;
  thumbnailPath?: string;
  publishedAt: string;
  description: string;
  format: ArtworkFormat;
  type: ArtworkType;
  tools: string[];
  tags: string[];
  series?: string;
  status: ArtworkStatus;
  externalUrl?: string;
  relatedProjects: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Profile {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  resumeUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
