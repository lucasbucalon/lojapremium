import Banner from "../../components/Banner/Banner";
import LineProducts from "../../components/LineProducts/LineProducts";
import Category from "../../components/Category/Category";
import style from "./store.module.css";
import Info from "../../components/Info/Info";

export default function Store() {
  const categoriasSelecionadas1 = ["Camisas"];
  const categoriasSelecionadas2 = ["Roupas"];

  return (
    <div className={style.store}>
      <Banner />
      <Category />
      <LineProducts categorias={categoriasSelecionadas1} />
      <LineProducts categorias={categoriasSelecionadas2} />
      <Info />
    </div>
  );
}
