import {
  collection,
  doc,
  Timestamp,
  type DocumentData,
  type DocumentReference,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  Artwork,
  ArtworkFormat,
  ArtworkType,
  Project,
  ProjectScreenshot,
  Profile,
  SocialLink,
} from "@/types/database";

export const projectsCollection = collection(db, "projects");
export const artworksCollection = collection(db, "artworks");
export const profileDocument = doc(db, "profile", "main");
export const socialLinksCollection = collection(db, "socialLinks");

export class DataAccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DataAccessError";
  }
}

function documentValue(
  reference: DocumentReference,
  data: DocumentData,
  field: string,
): unknown {
  const value = data[field];

  if (value === undefined || value === null) {
    throw new DataAccessError(
      `Invalid ${reference.path}: missing required field "${field}".`,
    );
  }

  return value;
}

function stringValue(
  reference: DocumentReference,
  data: DocumentData,
  field: string,
): string {
  const value = documentValue(reference, data, field);

  if (typeof value !== "string") {
    throw new DataAccessError(
      `Invalid ${reference.path}: field "${field}" must be a string.`,
    );
  }

  return value;
}

function optionalStringValue(
  reference: DocumentReference,
  data: DocumentData,
  field: string,
): string | undefined {
  const value = data[field];

  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new DataAccessError(
      `Invalid ${reference.path}: field "${field}" must be a string when provided.`,
    );
  }

  return value;
}

function stringArrayValue(
  reference: DocumentReference,
  data: DocumentData,
  field: string,
): string[] {
  const value = documentValue(reference, data, field);

  if (
    !Array.isArray(value) ||
    !value.every((item): item is string => typeof item === "string")
  ) {
    throw new DataAccessError(
      `Invalid ${reference.path}: field "${field}" must be an array of strings.`,
    );
  }

  return value;
}

function literalValue<T extends string>(
  reference: DocumentReference,
  data: DocumentData,
  field: string,
  allowedValues: readonly T[],
): T {
  const value = stringValue(reference, data, field);

  if (!allowedValues.includes(value as T)) {
    throw new DataAccessError(
      `Invalid ${reference.path}: field "${field}" has an unsupported value.`,
    );
  }

  return value as T;
}

function screenshotArrayValue(
  reference: DocumentReference,
  data: DocumentData,
): ProjectScreenshot[] {
  const value = documentValue(reference, data, "screenshots");

  if (!Array.isArray(value)) {
    throw new DataAccessError(
      `Invalid ${reference.path}: field "screenshots" must be an array.`,
    );
  }

  return value.map((screenshot, index) => {
    if (typeof screenshot === "string") {
      return { url: screenshot };
    }

    if (
      typeof screenshot !== "object" ||
      screenshot === null ||
      typeof screenshot.url !== "string"
    ) {
      throw new DataAccessError(
        `Invalid ${reference.path}: screenshots[${index}] must contain a string url.`,
      );
    }

    if (
      screenshot.path !== undefined &&
      screenshot.path !== null &&
      typeof screenshot.path !== "string"
    ) {
      throw new DataAccessError(
        `Invalid ${reference.path}: screenshots[${index}].path must be a string when provided.`,
      );
    }

    return {
      url: screenshot.url,
      ...(screenshot.path === undefined || screenshot.path === null
        ? {}
        : { path: screenshot.path }),
    };
  });
}

function timestampValue(
  reference: DocumentReference,
  data: DocumentData,
  field: "createdAt" | "updatedAt",
): Timestamp {
  const value = documentValue(reference, data, field);

  if (!(value instanceof Timestamp)) {
    throw new DataAccessError(
      `Invalid ${reference.path}: field "${field}" must be a Firestore timestamp.`,
    );
  }

  return value;
}

export function mapProject(
  reference: DocumentReference,
  data: DocumentData,
): Project {
  const slug = stringValue(reference, data, "slug");

  if (slug !== reference.id) {
    throw new DataAccessError(
      `Invalid ${reference.path}: slug must match the document ID.`,
    );
  }

  return {
    slug,
    title: stringValue(reference, data, "title"),
    shortDescription: stringValue(reference, data, "shortDescription"),
    description: stringValue(reference, data, "description"),
    date: stringValue(reference, data, "date"),
    category: stringValue(reference, data, "category"),
    role: stringValue(reference, data, "role"),
    technologies: stringArrayValue(reference, data, "technologies"),
    status: literalValue(reference, data, "status", [
      "published",
      "draft",
      "archived",
    ]),
    ...(optionalStringValue(reference, data, "thumbnail") === undefined
      ? {}
      : { thumbnail: optionalStringValue(reference, data, "thumbnail") }),
    ...(optionalStringValue(reference, data, "imagePath") === undefined
      ? {}
      : { imagePath: optionalStringValue(reference, data, "imagePath") }),
    ...(optionalStringValue(reference, data, "thumbnailPath") === undefined
      ? {}
      : { thumbnailPath: optionalStringValue(reference, data, "thumbnailPath") }),
    screenshots: screenshotArrayValue(reference, data),
    ...(optionalStringValue(reference, data, "liveUrl") === undefined
      ? {}
      : { liveUrl: optionalStringValue(reference, data, "liveUrl") }),
    ...(optionalStringValue(reference, data, "sourceUrl") === undefined
      ? {}
      : { sourceUrl: optionalStringValue(reference, data, "sourceUrl") }),
    relatedArtwork: stringArrayValue(reference, data, "relatedArtwork"),
    createdAt: timestampValue(reference, data, "createdAt"),
    updatedAt: timestampValue(reference, data, "updatedAt"),
  };
}

export function mapArtwork(
  reference: DocumentReference,
  data: DocumentData,
): Artwork {
  const slug = stringValue(reference, data, "slug");

  if (slug !== reference.id) {
    throw new DataAccessError(
      `Invalid ${reference.path}: slug must match the document ID.`,
    );
  }

  return {
    slug,
    title: stringValue(reference, data, "title"),
    ...(optionalStringValue(reference, data, "image") === undefined
      ? {}
      : { image: optionalStringValue(reference, data, "image") }),
    ...(optionalStringValue(reference, data, "imagePath") === undefined
      ? {}
      : { imagePath: optionalStringValue(reference, data, "imagePath") }),
    ...(optionalStringValue(reference, data, "thumbnailPath") === undefined
      ? {}
      : { thumbnailPath: optionalStringValue(reference, data, "thumbnailPath") }),
    publishedAt: stringValue(reference, data, "publishedAt"),
    description: stringValue(reference, data, "description"),
    format: literalValue<ArtworkFormat>(reference, data, "format", [
      "Headshot",
      "Half Body",
      "Full Body",
      "Illustration",
      "Sticker",
      "Sketch",
    ]),
    type: literalValue<ArtworkType>(reference, data, "type", [
      "Original",
      "Fan Art",
      "Commission",
      "Adoptable",
      "Commercial",
    ]),
    tools: stringArrayValue(reference, data, "tools"),
    tags: stringArrayValue(reference, data, "tags"),
    ...(optionalStringValue(reference, data, "series") === undefined
      ? {}
      : { series: optionalStringValue(reference, data, "series") }),
    status: literalValue(reference, data, "status", [
      "published",
      "draft",
      "archived",
    ]),
    ...(optionalStringValue(reference, data, "externalUrl") === undefined
      ? {}
      : { externalUrl: optionalStringValue(reference, data, "externalUrl") }),
    relatedProjects: stringArrayValue(reference, data, "relatedProjects"),
    createdAt: timestampValue(reference, data, "createdAt"),
    updatedAt: timestampValue(reference, data, "updatedAt"),
  };
}

export function mapProfile(
  reference: DocumentReference,
  data: DocumentData,
): Profile {
  return {
    id: stringValue(reference, data, "id"),
    name: stringValue(reference, data, "name"),
    role: stringValue(reference, data, "role"),
    bio: stringValue(reference, data, "bio"),
    avatarUrl: stringValue(reference, data, "avatarUrl"),
    ...(optionalStringValue(reference, data, "resumeUrl") === undefined
      ? {}
      : { resumeUrl: optionalStringValue(reference, data, "resumeUrl") }),
    createdAt: timestampValue(reference, data, "createdAt"),
    updatedAt: timestampValue(reference, data, "updatedAt"),
  };
}

export function mapSocialLink(
  reference: DocumentReference,
  data: DocumentData,
): SocialLink {
  const order = documentValue(reference, data, "order");

  if (typeof order !== "number" || !Number.isFinite(order)) {
    throw new DataAccessError(
      `Invalid ${reference.path}: field "order" must be a finite number.`,
    );
  }

  return {
    id: stringValue(reference, data, "id"),
    platform: stringValue(reference, data, "platform"),
    url: stringValue(reference, data, "url"),
    icon: stringValue(reference, data, "icon"),
    order,
    createdAt: timestampValue(reference, data, "createdAt"),
    updatedAt: timestampValue(reference, data, "updatedAt"),
  };
}
