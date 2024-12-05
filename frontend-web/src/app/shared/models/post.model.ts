export interface Post {
  id: number;
  title: string;
  picture: string;
  content: string;
  author: string;
  status: string;
  category: string;
  comments?: any[];
  review?: any;
  createdDate: string;
}

// export interface PostRequest {
//   title: string;
//   picture: string;
//   content: string;
//   author: string;
//   category: string;
//   status: string;
//   comments?: any[];
//   review?: any;
// }
