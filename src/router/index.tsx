import { createBrowserRouter } from "react-router-dom";

import SignupPage1 from "../pages/signupPage/signupPage1/signupPage1";
import SignupPage2 from "../pages/signupPage/signupPage2/signupPage2";
import SignupPage3 from "../pages/signupPage/signupPage3/signupPage3";
import LoginPage from "../pages/loginPage/loginPage";
import SearchPage from "../pages/searchPage/searchPage";
import PostMainRoute from "../pages/PostMainPage/PostMainRoute";
import PostEditor from "../pages/postWritePage/PostEditor";
import Profile from "../pages/profileChange/profileChange";
import Landing from "../pages/landingPage/landingPage";
import Info from "../pages/infopage/myInfoPage";
import CategoryPageRoute from "../pages/CategoryPage/CategoryPageRoute";
import MainLayout from "../components/layout/mainLayout";
import PostWritePage from "../pages/postWritePage/PostWritePage";
import myPostsPage from "../pages/MyPostsPage/MyPostsPage.tsx";
import {Navigate} from "react-router-dom";


export const router = createBrowserRouter([
  // 네비바가 없는 페이지
  {
    path: "/signup/1",
    Component: SignupPage1,
  },
  {
    path: "/signup/2",
    Component: SignupPage2,
  },
  {
    path: "/signup/3",
    Component: SignupPage3,
  },
  {
    path: "/login",
    Component: LoginPage,
  },


  // 네비바가 필요한 페이지
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        Component: Landing,
      },
      {
        path: "/main",
        Component: PostMainRoute,
      },
      {
        path: "/searchPage",
        Component: SearchPage,
      },
      {
        path: "/PostEditor",
        element: <PostEditor userId={0} onClose={() => {}} />,
      },
      {
        path: "/Profile",
        Component: Profile,
      },
      {
        path: "/Info",
        Component: Info,
      },
      {
        path: "/Categorypage",
        Component: CategoryPageRoute,
      },
      {
        path: "/post",
        element: <Navigate to="/posts" replace/>,
      },
      {
        path: "/posts",
        Component: PostMainRoute,
      },
      {
        path: "/posts/new",
        element: <PostWritePage />
      },
      {
        path: "*",
        element: <Navigate to="/posts" replace/>
      },
      {
        path: "/myPostsPage",
        Component: myPostsPage,
      },
    ],
  },
]);
