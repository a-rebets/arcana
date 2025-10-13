import type { api } from "@convex/api";
import type { FunctionReturnType } from "convex/server";

export type ArtifactData = FunctionReturnType<
  typeof api.artifacts.public.listArtifactChainsForThread
>[number];

export type ArtifactGalleryData = FunctionReturnType<
  typeof api.artifacts.public.listLatestArtifactsForUser
>[number];

export type ArtifactVersion = ArtifactData["versions"][number];
