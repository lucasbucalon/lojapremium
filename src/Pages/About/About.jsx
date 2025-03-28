import Header from "../../components/Header/Header";
import style from "./about.module.css";

export default function About() {
  return (
    <>
      <Header />
      <div className={style.about_container}>
        <h1>Pagina Sobre !!!</h1>
      </div>
    </>
  );
}
