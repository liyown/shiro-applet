import {RouterProvider} from "react-router-dom";
import router from "~/pages/index/router";


export default () => {
  console.log(location.href)
  return (
    <RouterProvider
      router={router}
    ></RouterProvider>
  );
};
