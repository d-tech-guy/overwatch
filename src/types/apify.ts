export interface ApifyVideoMetadata {
  authorUsername: string | null;
  authorDisplayName: string | null;
  caption: string | null;
  uploadDate: string | null;
  hashtags: string[];
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  bookmarks: number | null;
  duration: number | null;
  thumbnailUrl: string | null;
  downloadUrl: string | null;
  videoUrl: string | null;
}

export interface ApifyProfileMetadata {
  username: string | null;
  displayName: string | null;
  bio: string | null;
  followers: number | null;
  following: number | null;
  totalLikes: number | null;
  verified: boolean;
  avatar: string | null;
  region: string | null;
  language: string | null;
}

export interface ApifyCommentMetadata {
  author: string | null;
  text: string | null;
  likes: number | null;
  replies: number | null;
  pinned: boolean;
}
