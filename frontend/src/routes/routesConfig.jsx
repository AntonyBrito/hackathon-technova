import Home from "../pages/Initial";
import ProductRegistration from "../pages/ProductRegistration";
import ProductEdit from "../pages/ProductEditPage";
import StockManagement from "../pages/StockManagement";

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
  {
    path: "/StockManagement",
    name: "StockManagement",
    element: <StockManagement />,
  },
];
