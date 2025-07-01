import Banner from "../../components/Banner/Banner";
import LineProducts from "../../components/LineProducts/LineProducts";
import Category from "../../components/Category/Category";
import style from "./store.module.css";
import Info from "../../components/Info/Info";
import SobreIni from "../../components/SobreIni/SobreIni";

export default function Store() {
  const categoriasSelecionadas1 = ["Camisas"];
  const categoriasSelecionadas2 = ["Roupas"];
  const categoriasSelecionadas3 = ["Camisas"];
  const categoriasSelecionadas4 = ["Roupas"];

  return (
    <div className={style.store}>
      <Banner />
      <Info />
      <Category />
      <LineProducts categorias={categoriasSelecionadas1} />
      <LineProducts categorias={categoriasSelecionadas2} />
      <LineProducts categorias={categoriasSelecionadas3} />
      <LineProducts categorias={categoriasSelecionadas4} />
      <SobreIni />
    </div>
  );
}
