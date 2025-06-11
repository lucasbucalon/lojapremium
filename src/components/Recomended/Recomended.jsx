import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import PropTypes from "prop-types";
import style from "./recomended.module.css";

export default function Recomended({
  tipoFiltro = [],
  produtoIdAtual,
  filtroCampo = "type",
  titulo = "Você também pode gostar...",
}) {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [index, setIndex] = useState(0);
  const [visivel, setVisivel] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const itemsToShow = 5;

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await fetch("/server/products.json");
        if (!response.ok) throw new Error("Erro ao carregar produtos");
        const data = await response.json();

        const filtroArray = Array.isArray(tipoFiltro)
          ? tipoFiltro
          : [tipoFiltro];

        const relacionados = data.filter((produto) => {
          if (produto.id === produtoIdAtual) return false;

          const valorFiltro = produto[filtroCampo];
          if (!valorFiltro) return false;

          if (Array.isArray(valorFiltro)) {
            return valorFiltro.some((v) => filtroArray.includes(v));
          } else {
            return filtroArray.includes(valorFiltro);
          }
        });

        setProdutos(relacionados);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };

    carregarProdutos();
  }, [tipoFiltro, produtoIdAtual, filtroCampo]);

  useEffect(() => {
    const verificarVisibilidade = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setVisivel(rect.top < window.innerHeight && rect.bottom >= 0);
      }
    };

    window.addEventListener("scroll", verificarVisibilidade);
    verificarVisibilidade();

    return () => window.removeEventListener("scroll", verificarVisibilidade);
  }, []);

  const produtosExibidos = produtos.slice(0, 15);
  const total = produtosExibidos.length;
  const maxIndex = Math.max(0, total - itemsToShow);

  const moverProximo = () => {
    setIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const moverAnterior = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>{erro}</p>;
  if (produtos.length === 0) return null;

  return (
    <div className={style.products} ref={wrapperRef}>
      <div className={style.products_container}>
        <div className={style.products_title}>
          <h2>{titulo}</h2>
        </div>

        <div className={style.products_wrapper}>
          <div
            className={style.list}
            style={{
              transform: `translateX(-${(93.25 / itemsToShow) * index}%)`,
              transition: "transform 0.3s ease",
            }}
          >
            {produtosExibidos.map((produto, i) => (
              <div
                key={produto.id}
                className={`${style.product} ${
                  i >= index && i < index + itemsToShow ? style.active : ""
                }`}
              >
                <div
                  className={style.item}
                  onClick={() => navigate(`/Detalhes/${produto.id}`)}
                >
                  <img
                    src={produto.image?.[0]}
                    alt={produto.name}
                    className={style.img_1}
                  />
                  {produto.image?.[1] && (
                    <img src={produto.image?.[1]} alt={produto.name} />
                  )}
                  <div className={style.des_box}>
                    <p>{produto.description}</p>
                  </div>
                </div>

                <div
                  className={style.products_prices}
                  onClick={() => navigate(`/Detalhes/${produto.id}`)}
                >
                  <span
                    className={
                      produto.oferta ? style.old_price : style.original_prices
                    }
                  >
                    R$ {produto.price.toFixed(2)}
                  </span>
                  {produto.oferta && produto.discountPrice && (
                    <span className={style.offer_price}>
                      R$ {produto.discountPrice.toFixed(2)}
                    </span>
                  )}
                  <button className={style.compra}>Comprar</button>
                </div>

                <button
                  className={style.cart_button}
                  onClick={() => alert("Adicionado ao carrinho")}
                >
                  <Icon icon="line-md:heart" className={style.icon_cart} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={style.controls}>
          {index > 0 && visivel && (
            <button
              className={`${style.btn} ${style.left}`}
              onClick={moverAnterior}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path
                  fill="currentColor"
                  d="m4 10l9 9l1.4-1.5L7 10l7.4-7.5L13 1z"
                />
              </svg>
            </button>
          )}
          {index + itemsToShow < total && visivel && (
            <button
              className={`${style.btn} ${style.right}`}
              onClick={moverProximo}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path
                  fill="currentColor"
                  d="M7 1L5.6 2.5L13 10l-7.4 7.5L7 19l9-9z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

Recomended.propTypes = {
  tipoFiltro: PropTypes.array,
  produtoIdAtual: PropTypes.any,
  filtroCampo: PropTypes.string,
  titulo: PropTypes.string,
};
