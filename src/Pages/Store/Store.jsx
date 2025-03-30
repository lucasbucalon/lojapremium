import Banner from "../../components/Banner/Banner";
import LineProducts from "../../components/LineProducts/LineProducts";
import Category from "../../components/Category/Category";
import style from "./store.module.css";

export default function Store() {
  return (
    <div className={style.store}>
      <Banner />

      <Category />

      <LineProducts />
    </div>
  );
}
