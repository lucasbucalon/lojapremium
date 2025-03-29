import { Icon } from "@iconify-icon/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../../components/Profile/Profile";
import style from "./storeAll.module.css";

export default function StoreAll() {
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [busca, setBusca] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const produtosPorPagina = 30;

  const navigate = useNavigate();

  // Carregar produtos
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await fetch("/server/products.json");
        if (!response.ok) throw new Error("Erro ao carregar produtos");
        const data = await response.json();
        setProdutos(data);
        setProdutosFiltrados(data);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };

    carregarProdutos();
  }, []);

  // APLICAR FILTRO DE BUSCA
  const aplicarFiltro = (busca) => {
    const produtosFiltrados = busca.trim()
      ? produtos.filter((produto) =>
          [
            produto.name,
            ...(produto.cor || []),
            ...(produto.type || []),
            produto.description,
          ].some((campo) => campo.toLowerCase().includes(busca.toLowerCase()))
        )
      : [...produtos];

    setProdutosFiltrados(produtosFiltrados);
    setPaginaAtual(1);
  };

  // FILTRAR POR PREÇO
  const filtrarPorPreco = () => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;
    const produtosFiltrados = produtos.filter(
      (produto) => produto.price >= min && produto.price <= max
    );

    setProdutosFiltrados(produtosFiltrados);
    setPaginaAtual(1);
  };

  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setMaxPrice(value);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.target.classList.contains("minPrice") ||
        event.target.classList.contains("maxPrice");
      {
        filtrarPorPreco();
        aplicarFiltro(busca);
        setBusca("");
      }
    }
  };

  // FILTRAR POR TIPO
  const filtrarProdutosPorTipo = (tipo) => {
    let produtosFiltrados;
    if (tipo === "ofertas") {
      produtosFiltrados = produtos.filter((produto) => produto.oferta === true);
    } else if (tipo !== "todos") {
      produtosFiltrados = produtos.filter((produto) =>
        produto.type.includes(tipo)
      );
    } else {
      produtosFiltrados = [...produtos];
    }
    setProdutosFiltrados(produtosFiltrados);
    setPaginaAtual(1);
  };

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
      <header id="inicio" className={style.header}>
        <div className={style.header_content}>
          {/* LOGO DA LOJA */}
          <div className={style.logo}>
            <img src="/image/logo.jpg" alt="logo" />
          </div>

          {/* BARRA DE PESQUISA */}
          <div className={style.search}>
            <input
              type="text"
              placeholder="Buscar Produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Icon className={style.icon_search} icon="tabler:search" />
          </div>

          {/* FILTRO DE PREÇO */}
          <div className={style.filter}>
            <input
              className={style.minPrice}
              type="text"
              placeholder="Preço Min..."
              value={minPrice}
              onChange={handleMinPriceChange}
              onKeyDown={handleKeyDown}
            />
            <input
              className={style.maxPrice}
              type="text"
              placeholder="Preço Max..."
              value={maxPrice}
              onChange={handleMaxPriceChange}
              onKeyDown={handleKeyDown}
            />
            <button onClick={filtrarPorPreco}>Filtrar</button>
          </div>

          <Profile />

          {/* BARRA DE NAVEGAÇÃO */}
          <nav className={style.header_nav}>
            <ul>
              <li>
                <a href="/">Loja</a>
              </li>
              <li>
                <a href="/Todos">Todos</a>
              </li>
              <li>
                <a href="#" onClick={() => filtrarProdutosPorTipo("ofertas")}>
                  Ofertas
                </a>
              </li>
              <li>
                <a href="#" onClick={() => filtrarProdutosPorTipo("unisexx")}>
                  Unisexx
                </a>
              </li>
              <li>
                <a href="#" onClick={() => filtrarProdutosPorTipo("roupas")}>
                  Roupas
                </a>
              </li>
              <li>
                <a href="#" onClick={() => filtrarProdutosPorTipo("masculino")}>
                  Masculino
                </a>
              </li>
              <li>
                <a href="#" onClick={() => filtrarProdutosPorTipo("feminino")}>
                  Feminino
                </a>
              </li>

              <li>
                <a href="/Sobre">Sobre Nós</a>
              </li>
              <li>
                <a href="#contato">Contato</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section className={style.listProduct}>
        {exibirProdutos()}
        <div className={style.pagination}>{exibirPaginas()}</div>
      </section>
    </>
  );
}
