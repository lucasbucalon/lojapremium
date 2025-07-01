import style from "./sobreini.module.css";
import { useNavigate } from "react-router-dom";

export default function SobreIni() {
  const navigate = useNavigate();
  return (
    <section className={style.sobreini}>
      <img src="/image/sobreini.jpg" alt="imagem da loja" />
      <div className={style.sobreiniText}>
        <h2>Olá, Seja bem vindo !</h2>
        <p>
          Aqui, cada peça tem uma história — e pode fazer parte da sua.
          Selecionamos roupas com carinho, qualidade e personalidade, para quem
          valoriza estilo, economia e consciência. Fique à vontade!
        </p>
        <button onClick={() => navigate("/Sobre")}>Por trás das peças</button>
      </div>
    </section>
  );
}
