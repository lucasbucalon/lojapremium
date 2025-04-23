import { useNavigate } from "react-router-dom";
import style from "./footer.module.css";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer id="contato" className={style.footer_wrapper}>
      <section className={style.footer_contact}>
        <div className={style.logo} onClick={() => navigate("/")}>
          <img src="/image/logo.jpg" alt="logo" />
        </div>
        <div className={style.social}>
          <h2>Siga-nos</h2>
          <ul>
            <a href="#">instagram</a>
            <a href="#">facebook</a>
            <a href="#">tiktok</a>
            <a href="#">whatsapp</a>
          </ul>
        </div>
        <div className={style.contact}>
          <h2>Contatos</h2>
          <ul>
            <a href="#">email</a>
            <a href="#">contato</a>
          </ul>
        </div>
      </section>

      <section className={style.footer_links}></section>

      <section className={style.footer_dev}>
        <a href="/" className={style.dev}>
          <h3>CKweb</h3>
          <p>- 2025 Todos os direitos rezervados</p>
        </a>
      </section>
    </footer>
  );
}
