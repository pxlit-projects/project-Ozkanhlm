export interface Post {
  id: number;
  title: string;
  picture: string;
  content: string;
  author: string;
  status: string;
  category: string;
  comments?: any[];
  reviews?: number[];
  createdDate: string;
}
