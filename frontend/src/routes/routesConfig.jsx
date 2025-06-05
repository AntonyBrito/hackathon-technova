import Home from "../pages/Initial";
import ProductRegistration from "../pages/ProductRegistration";
import ProductEditPage from "../pages/ProductEditPage";

export const routes = [
  {
    path: "/",
    name: "Home",
    element: <Home />,
  },
  {
    path: "/ProductEditPage",
    name: "ProductEditPage",
    element: <ProductEditPage />,
  },
  {
    path: "/ProductRegistration",
    name: "ProductRegistration",
    element: <ProductRegistration />,
  },
];
