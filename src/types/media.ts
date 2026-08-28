export type MediaType = "image" | "video";

export interface MediaContent {
  readonly type: MediaType;
  readonly src: string;
  readonly poster?: string;
  readonly alt?: string;
}
