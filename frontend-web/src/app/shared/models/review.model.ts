export interface Review {
  id: number;
  reviewStatus: 'REJECTED' | 'APPROVED';
  reviewMessage?: string;
  postId: number;
}
