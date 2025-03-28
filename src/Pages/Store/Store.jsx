import Header from "../../components/Header/Header";
import Banner from "../../components/Banner/Banner";
import Products from "../../components/Products/Products";
import Category from "../../components/Category/Category";
import style from "./store.module.css";

export default function Store() {
  return (
    <div className={style.store}>
      <Header />

      <Banner />

      <Category />

      <Products />
    </div>
  );
}
