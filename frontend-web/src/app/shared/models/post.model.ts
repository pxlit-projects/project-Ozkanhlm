import { Review } from './review.model';

export interface Post {
  id: number;
  title: string;
  picture: string;
  content: string;
  author: string;
  status: 'PUBLISH' | 'CONCEPT' | 'PENDING';
  category: 'ANNOUNCEMENTS' | 'EVENTS' | 'UPDATES' | 'NEWS';
  comments?: any[];
  reviews?: Review[];
  createdDate: string;
}
