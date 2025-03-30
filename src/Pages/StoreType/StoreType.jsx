import { Icon } from "@iconify-icon/react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import style from "./storeType.module.css";

export default function StoreType() {
  const { type } = useParams(); // Obtém o tipo da URL
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtosPorPagina = 30;

  const navigate = useNavigate();

  // Carregar produtos
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await fetch("/server/products.json");
        if (!response.ok) throw new Error("Erro ao carregar produtos");
        const data = await response.json();
        // Filtrar produtos pelo tipo da URL
        const produtosFiltradosTipo = data.filter((produto) =>
          produto.type.includes(type)
        );

        setProdutosFiltrados(produtosFiltradosTipo);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };

    carregarProdutos();
  }, [type]);

  // EXIBIR PRODUTOS
  const exibirProdutos = () => {
    const startIndex = (paginaAtual - 1) * produtosPorPagina;
    const endIndex = paginaAtual * produtosPorPagina;
    return produtosFiltrados.slice(startIndex, endIndex).map((produto) => (
      <div key={produto.id} className={`${style.product} ${style.active}`}>
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
            className={produto.oferta ? style.old_price : style.original_prices}
          >
            R$ {produto.price.toFixed(2)}
          </span>
          {produto.oferta && produto.discountPrice && (
            <span className={style.offer_price}>
              R$ {produto.discountPrice.toFixed(2)}
            </span>
          )}
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
          <Icon icon="solar:cart-plus-linear" width="24" height="24" />
        </button>
      </div>
    ));
  };

  // EXIBIR PÁGINAS
  const exibirPaginas = () => {
    const totalPaginas = Math.ceil(
      produtosFiltrados.length / produtosPorPagina
    );
    const paginas = [];
    for (let i = 1; i <= totalPaginas; i++) {
      paginas.push(
        <button
          key={i}
          className={` ${style.pagina_btn} ${
            i === paginaAtual ? style.active : ""
          }`}
          style={{ background: i === paginaAtual ? "#555" : "" }}
          onClick={() => setPaginaAtual(i)}
        >
          {i}
        </button>
      );
    }
    return paginas;
  };

  if (carregando) {
    return <p>Carregando produtos...</p>;
  }

  if (erro) {
    return <p>Erro: {erro}</p>;
  }
  return (
    <>
      <section className={style.listProduct}>
        {exibirProdutos()}
        <div className={style.pagination}>{exibirPaginas()}</div>
      </section>
    </>
  );
}
