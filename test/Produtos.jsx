import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import "./Produtos.css";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await fetch("/produtos.json");
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

  const produtosPorTipo = produtos.reduce((acc, produto) => {
    produto.category.forEach((tipo) => {
      if (!acc[tipo]) acc[tipo] = [];
      acc[tipo].push(produto);
    });
    return acc;
  }, {});

  return (
    <div className="listProduct_p">
      {carregando && <p>Carregando produtos...</p>}
      {erro && <p className="error">Erro: {erro}</p>}
      {!carregando && !erro && produtos.length === 0 && (
        <p>Nenhum produto encontrado.</p>
      )}

      {!carregando &&
        !erro &&
        Object.keys(produtosPorTipo).map((tipo) => (
          <div key={tipo} className="carousel-container">
            <div className="carousel-title">
              <h2>{tipo}</h2>
              <span></span>
            </div>
            <div className="carousel-wrapper">
              <button className="carousel-btn left">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path
                    fill="currentColor"
                    d="m4 10l9 9l1.4-1.5L7 10l7.4-7.5L13 1z"
                  />
                </svg>
              </button>
              <div className="carousel">
                {produtosPorTipo[tipo].map((produto) => (
                  <div className="item-box_p" key={produto.id}>
                    <div
                      className="item_p"
                      onClick={() => navigate(`/detalhes/${produto.id}`)}
                    >
                      <img src={produto.image?.[0]} alt={produto.name} />
                      <h2 className="name_p">{produto.name}</h2>
                      <div className="des-box_p">
                        <p>{produto.description}</p>
                      </div>
                      <div className="prices_p">
                        <span
                          className="price_p"
                          style={{
                            color: produto.oferta ? "#555" : "",
                            textDecoration: produto.oferta
                              ? "line-through"
                              : "",
                            fontSize: produto.oferta ? "1.6rem" : "",
                            width: produto.oferta ? "100%" : "",
                            marginTop: produto.oferta ? "0" : "",
                          }}
                        >
                          R$ {produto.price.toFixed(2)}
                        </span>
                        {produto.oferta && produto.discountPrice && (
                          <span className="offer-price_p">
                            R$ {produto.discountPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="colors_p">
                        Cores: {produto.cor?.join(", ")}
                      </div>
                    </div>
                    <button onClick={() => alert("Adicionado ao carrinho")}>
                      <Icon
                        icon="solar:cart-plus-linear"
                        width="24"
                        height="24"
                      />
                    </button>
                  </div>
                ))}
              </div>
              <button className="carousel-btn right">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path
                    fill="currentColor"
                    d="M7 1L5.6 2.5L13 10l-7.4 7.5L7 19l9-9z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
