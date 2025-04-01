import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import style from "./lineProducts.module.css";

export default function LineProducts() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [indices, setIndices] = useState({}); // Estado para armazenar índices separados por categoria
  const navigate = useNavigate();
  const itemsToShow = 5;

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

  // Função para atualizar o índice de uma categoria específica
  const moveNext = (tipo) => {
    setIndices((prev) => {
      const newIndex = (prev[tipo] || 0) + 1;
      if (newIndex <= produtosPorTipo[tipo].length - itemsToShow) {
        return { ...prev, [tipo]: newIndex };
      }
      return prev;
    });
  };

  // Função para voltar ao índice anterior de uma categoria específica
  const movePrev = (tipo) => {
    setIndices((prev) => {
      const newIndex = (prev[tipo] || 0) - 1;
      if (newIndex >= 0) {
        return { ...prev, [tipo]: newIndex };
      }
      return prev;
    });
  };

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (erro) {
    return <p>{erro}</p>;
  }

  const produtosPorTipo = produtos.reduce((acc, produto) => {
    produto.category.forEach((tipo) => {
      if (!acc[tipo]) acc[tipo] = [];
      acc[tipo].push(produto);
    });
    return acc;
  }, {});

  return (
    <div className={style.products}>
      {carregando && <p>Carregando produtos...</p>}
      {erro && <p className="error">Erro: {erro}</p>}
      {!carregando && !erro && produtos.length === 0 && (
        <p>Nenhum produto encontrado.</p>
      )}

      {!carregando &&
        !erro &&
        Object.keys(produtosPorTipo).map((tipo) => {
          const index = indices[tipo] || 0; // Usar o índice da categoria ou 0 se não existir
          return (
            <div key={tipo} className={style.products_container}>
              <div
                className={style.products_title}
                onClick={() => navigate(`/Categorias/${tipo}`)}
              >
                <h2>{tipo}</h2>
                <span></span>
                <button>Ver mais...</button>
              </div>
              <div className={style.products_wrapper}>
                <div
                  className={style.list}
                  style={{
                    transform: `translateX(-${(92.01 / itemsToShow) * index}%)`,
                  }}
                >
                  {produtosPorTipo[tipo].map((produto, i) => (
                    <div
                      key={produto.id}
                      className={`${style.product} ${
                        i >= index && i < index + itemsToShow
                          ? style.active
                          : ""
                      }`}
                    >
                      <div
                        className={style.item}
                        onClick={() => navigate(`/Detalhes/${produto.id}`)}
                      >
                        <img src={produto.image?.[0]} alt={produto.name} />

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

                        <button className={style.compra}>oi</button>
                      </div>

                      <div style={{ display: "none" }}>
                        <h2>{produto.name}</h2>
                        <div>{produto.cor}</div>
                        <div>{produto.type}</div>
                      </div>

                      <button
                        className={style.cart_button}
                        onClick={() => alert("Adicionado ao carrinho")}
                      >
                        <Icon
                          icon="line-md:heart"
                          className={style.icon_cart}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className={style.controls}>
                <button
                  className={`${style.btn} ${style.left}`}
                  onClick={() => movePrev(tipo)} // Passar o tipo para a função
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path
                      fill="currentColor"
                      d="m4 10l9 9l1.4-1.5L7 10l7.4-7.5L13 1z"
                    />
                  </svg>
                </button>
                <button
                  className={`${style.btn} ${style.right}`}
                  onClick={() => moveNext(tipo)} // Passar o tipo para a função
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path
                      fill="currentColor"
                      d="M7 1L5.6 2.5L13 10l-7.4 7.5L7 19l9-9z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}
