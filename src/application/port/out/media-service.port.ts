export interface MediaInfo {
  mediaId: string;
  cdnUrl: string;
  fileName: string;
  mimeType: string;
  s3Key: string;
  createdAt: string;
}

export interface MediaServicePort {
  getMediaByIds(mediaIds: bigint[]): Promise<MediaInfo[]>;
}
