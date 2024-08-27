import { createBrowserRouter, RouteObject } from "react-router-dom";
import Posts, { loader as PostsLoader } from "~/pages/index/view/posts";
import ErrorPage from "~/components/common/error";
import PostDetail, {
  loader as PostDetailLoader,
} from "~/pages/index/view/post-detail";

export type Route = RouteObject & {
  id?: string;
  title?: string;
  children?: Route[];
};

export const routes: Route[] = [
  {
    id: "home",
    title: "Home",
    path: "/",
    errorElement: <ErrorPage />,
    element: <Posts />,
    loader: PostsLoader,
    children: [],
  },
  {
    path: "/posts/:category/:slug",
    element: <PostDetail />,
    loader: PostDetailLoader,
  },
];
const router = createBrowserRouter(routes, {
  basename: "/",
});
export default router;
