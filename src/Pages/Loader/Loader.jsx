import style from "./loader.module.css";

export default function Loading() {
  return (
    <>
      <div className={style.loading}>
        <h2>Carregando...</h2>
        <p>Por favor, aguarde enquanto os dados são carregados.</p>
      </div>
    </>
  );
}
