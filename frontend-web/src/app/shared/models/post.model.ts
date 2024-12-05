export interface Post {
  id: number;
  title: string;
  picture: string;
  content: string;
  author: string;
  status: 'PUBLISH' | 'CONCEPT' | 'PENDING';
  category: string;
  comments?: any[];
  review?: any;
  createdDate: string;
}
