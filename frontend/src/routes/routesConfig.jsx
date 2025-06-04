import Home from "../pages/Initial";
import ListProduct from "../pages/ListProduct";
import Product from "../pages/Product";
import Card from "../pages/Card";
import Checkout from "../pages/Checkout";
import CadastroProduto from "../pages/Cadastro_Produtos";

export const routes = [
  {
    path: "/",
    name: "Home",
    element: <Home />,
  },
  {
    path: "/ListProduct",
    name: "ListProduct",
    element: <ListProduct />,
  },
  {
    path: "/Product",
    name: "Product",
    element: <Product />,
  },
  {
    path: "/Card",
    name: "Card",
    element: <Card />,
  },
  {
    path: "/Checkout",
    name: "Checkout",
    element: <Checkout />,
  },
  {
    path: "/CadastroProduto",
    name: "CadastroProduto",
    element: <CadastroProduto />,
  }
];