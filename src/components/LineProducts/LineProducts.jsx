import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import PropTypes from "prop-types";
import style from "./lineProducts.module.css";

export default function LineProducts({ categorias }) {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [indices, setIndices] = useState({});
  const [visibilidade, setVisibilidade] = useState({});
  const navigate = useNavigate();
  const itemsToShow = 5;
  const refs = useRef({});

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await fetch("/server/products.json");
        if (!response.ok) throw new Error("Erro ao carregar produtos");
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };
    carregarProdutos();
  }, []);

  useEffect(() => {
    const checkVisibility = () => {
      const newVisibilidade = {};
      Object.keys(refs.current).forEach((tipo) => {
        newVisibilidade[tipo] = refs.current[tipo]
          ? isElementInViewport(refs.current[tipo])
          : false;
      });
      setVisibilidade(newVisibilidade);
    };

    window.addEventListener("scroll", checkVisibility);
    checkVisibility();
    return () => window.removeEventListener("scroll", checkVisibility);
  }, [produtos]);

  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    const threshold = 0.5; // Pelo menos 50% do elemento deve estar visível
    const elementWidth = rect.right - rect.left;
    const visibleWidth =
      Math.min(window.innerWidth, rect.right) - Math.max(0, rect.left);

    return visibleWidth / elementWidth >= threshold;
  };

  const produtosPorTipo = produtos.reduce((acc, produto) => {
    produto.category.forEach((tipo) => {
      if (!acc[tipo]) acc[tipo] = [];
      acc[tipo].push(produto);
    });
    return acc;
  }, {});

  const moveNext = (tipo) => {
    setIndices((prev) => {
      const total = Math.min(produtosPorTipo[tipo]?.length || 0, 15);
      const maxIndex = Math.max(0, total - itemsToShow);
      const newIndex = Math.min((prev[tipo] || 0) + 1, maxIndex);
      return { ...prev, [tipo]: newIndex };
    });
  };

  const movePrev = (tipo) => {
    setIndices((prev) => {
      const newIndex = Math.max((prev[tipo] || 0) - 1, 0);
      return { ...prev, [tipo]: newIndex };
    });
  };

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div className={style.products}>
      {categorias.map((tipo) => {
        if (!produtosPorTipo[tipo]) return null;
        const index = indices[tipo] || 0;
        const total = Math.min(produtosPorTipo[tipo].length, 15);

        return (
          <div
            key={tipo}
            className={style.products_container}
            ref={(el) => (refs.current[tipo] = el)}
          >
            <div
              className={style.products_title}
              onClick={() =>
                navigate(`/Todos?search=${encodeURIComponent(tipo)}`)
              }
            >
              <h2>{tipo}</h2>
              <span></span>
              <button>Ver mais...</button>
            </div>
            <div className={style.products_wrapper}>
              <div
                className={style.list}
                style={{
                  transform: `translateX(-${(93.25 / itemsToShow) * index}%)`,
                  transition: "transform 0.3s ease",
                }}
              >
                {produtosPorTipo[tipo].slice(0, 15).map((produto, i) => (
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
                      <img src={produto.image?.[1]} alt={produto.name} />
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
                          produto.oferta
                            ? style.old_price
                            : style.original_prices
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
              {index > 0 && visibilidade[tipo] && (
                <button
                  className={`${style.btn} ${style.left}`}
                  onClick={() => movePrev(tipo)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path
                      fill="currentColor"
                      d="m4 10l9 9l1.4-1.5L7 10l7.4-7.5L13 1z"
                    />
                  </svg>
                </button>
              )}
              {index + itemsToShow < total && visibilidade[tipo] && (
                <button
                  className={`${style.btn} ${style.right}`}
                  onClick={() => moveNext(tipo)}
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
        );
      })}
    </div>
  );
}

LineProducts.propTypes = {
  categorias: PropTypes.arrayOf(PropTypes.string).isRequired,
};
