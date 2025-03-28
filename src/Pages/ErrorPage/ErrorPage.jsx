import style from "./errorPage.module.css";
export default function ErrorPage() {
  return (
    <div className={style.error_page}>
      <h2>Erro 404</h2>
      <p>Pagina não encontrada... </p>
    </div>
  );
}
