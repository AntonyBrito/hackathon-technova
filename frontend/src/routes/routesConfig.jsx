import Home from "../pages/Initial";
import ProductRegistration from "../pages/ProductRegistration";
import ProductEdit from "../pages/ProductEditPage";

export const routes = [
  {
    path: "/",
    name: "Home",
    element: <Home />,
  },
  {
    path: "/ProductEdit",
    name: "ProductEdit",
    element: <ProductEdit />,
  },
  {
    path: "/ProductRegistration",
    name: "ProductRegistration",
    element: <ProductRegistration />,
  },
];
