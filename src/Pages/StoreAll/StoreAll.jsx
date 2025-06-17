import { Icon } from "@iconify-icon/react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Filters from "../../components/Filters/Filters";
import style from "./storeAll.module.css";

export default function StoreAll() {
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [mostrarOfertas, setMostrarOfertas] = useState(false);

  const produtosPorPagina = 30;
  const navigate = useNavigate();
  const location = useLocation();

  // Função para obter termo da URL
  const getSearchQuery = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return params.get("search") || "";
  }, [location.search]);

  // Carregar produtos do JSON
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await fetch("/server/products.json");
        if (!response.ok) throw new Error("Erro ao carregar produtos");
        const data = await response.json();
        setProdutos(data);
        setProdutosFiltrados(data); // Inicializa com todos os produtos
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };

    carregarProdutos();
  }, []);

  // Filtragem dos produtos quando a busca muda
  useEffect(() => {
    const termoBusca = getSearchQuery().toLowerCase();
    console.log("Termo de busca:", termoBusca);

    let filtrados = produtos;

    // Aplica busca textual se houver termo
    if (termoBusca) {
      filtrados = filtrados.filter(
        (produto) =>
          produto.name?.toLowerCase().includes(termoBusca) ||
          produto.description?.toLowerCase().includes(termoBusca) ||
          (produto.category &&
            produto.category.some((cat) =>
              cat.toLowerCase().includes(termoBusca)
            )) ||
          (produto.type &&
            produto.type.some((t) => t.toLowerCase().includes(termoBusca))) ||
          (produto.cor &&
            produto.cor.some((cor) => cor.toLowerCase().includes(termoBusca)))
      );
    }

    // Aplica filtro de oferta se estiver ativado
    if (mostrarOfertas) {
      filtrados = filtrados.filter((produto) => produto.oferta === true);
    }

    setProdutosFiltrados(filtrados);
    setPaginaAtual(1); // Resetar para página 1 após filtro
  }, [getSearchQuery, produtos, mostrarOfertas]);

  // Exibir produtos paginados
  const exibirProdutos = () => {
    const startIndex = (paginaAtual - 1) * produtosPorPagina;
    const endIndex = paginaAtual * produtosPorPagina;
    return produtosFiltrados.slice(startIndex, endIndex).map((produto) => (
      <div key={produto.id} className={`${style.product} ${style.active}`}>
        <div
          className={style.item}
          onClick={() => navigate(`/Detalhes/${produto.id}`)}
        >
          <img
            src={produto.image?.[0] || "/assets/no-image.jpg"}
            alt={produto.name}
            className={style.img_1}
          />
          <img
            src={produto.image?.[1] || "/assets/no-image.jpg"}
            alt={produto.name}
          />

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

          <button className={style.compra}>Comprar</button>
        </div>

        <div style={{ display: "none" }}>
          <h2>{produto.name}</h2>
          <div>{produto.cor}</div>
          <div>{produto.type}</div>
        </div>

        <button
          className={style.cart_button}
          onClick={() => alert("Adicionado ao Favoritos")}
        >
          <Icon icon="line-md:heart" className={style.icon_cart} />
        </button>
      </div>
    ));
  };

  // Exibir botões de paginação
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
      <Filters
        mostrarOfertas={mostrarOfertas}
        setMostrarOfertas={setMostrarOfertas}
      />
      <section className={style.listProduct}>
        {produtosFiltrados.length > 0 ? (
          <>
            {exibirProdutos()}
            <div className={style.pagination}>{exibirPaginas()}</div>
          </>
        ) : (
          <p className={style.noProductMessage}>Produto não encontrado ...</p>
        )}
      </section>
    </>
  );
}
