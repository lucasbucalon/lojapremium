import { Icon } from "@iconify-icon/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./storeAll.module.css";

export default function StoreAll() {
  const [isCartOpen, setIsCartOpen] = useState(false);
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
      if (
        event.target.classList.contains("minPrice") ||
        event.target.classList.contains("maxPrice")
      ) {
        filtrarPorPreco();
      } else {
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
      <div className={style.item_box} key={produto.id}>
        <div
          className={style.item}
          onClick={() => navigate(`/detalhes/${produto.id}`)}
        >
          <img src={produto.image[0]} alt={produto.name} />
          <h2 className={style.name}>{produto.name}</h2>
          <div className={style.des_box}>
            <p>{produto.description}</p>
          </div>
          <div className={style.prices}>
            <span
              className={style.origin_price}
              style={{
                color: produto.oferta ? "#555" : "",
                textDecoration: produto.oferta ? "line-through" : "",
                fontSize: produto.oferta ? "1.6rem" : "",
                width: produto.oferta ? "100%" : "",
                marginTop: produto.oferta ? "0" : "",
              }}
            >
              R$ {produto.price.toFixed(2)}
            </span>
            {produto.oferta && (
              <span className={style.offer_price}>
                R$ {produto.discountPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className={style.colors}>
            Cores: {produto.cor?.join(", ") || ""}
          </div>
          <div className={style.type}>
            Tipo: {produto.type?.join(", ") || ""}
          </div>
        </div>
        <button onClick={() => alert("Adicionado ao carrinho")}>
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
      <header id="inicio" className={style.loja}>
        {/* BARRA LATERAL DE COMPRA  */}
        <div
          className={style.cart}
          style={{ right: isCartOpen ? "0" : "-400px" }}
        >
          <button className={style.config}>
            <Icon className={style.icon_config} icon="ph:gear" />
            <p>Configurações</p>
          </button>
          <h2>Seu Carrinho</h2>
          <div className={style.listCart}></div>
          <div className={style.btn}>
            <button
              className={style.close}
              onClick={() => setIsCartOpen(false)}
            >
              FECHAR
            </button>
            <button>COMPRAR</button>
          </div>
        </div>

        <div className={style.content_header}>
          {/* LOGO DA LOJA */}
          <div className={style.logo}>
            <img src="/public/image/logo.jpg" alt="logo" />
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

          {/* PERFIL E MENU */}
          <div className={style.menu}>
            <div className={style.icon} onClick={() => setIsCartOpen(true)}>
              <Icon className={style.profile} icon="iconamoon:profile-light" />
            </div>
          </div>

          {/* BARRA DE NAVEGAÇÃO */}
          <nav>
            <ul>
              <li>
                <a href="/">Loja</a>
              </li>
              <li>
                <a onClick={() => filtrarProdutosPorTipo("ofertas")}>Ofertas</a>
              </li>
              <li>
                <a onClick={() => filtrarProdutosPorTipo("todos")}>Todos</a>
              </li>
              <li>
                <a onClick={() => filtrarProdutosPorTipo("roupas")}>Roupas</a>
              </li>
              <li>
                <a onClick={() => filtrarProdutosPorTipo("masculino")}>
                  Masculino
                </a>
              </li>
              <li>
                <a onClick={() => filtrarProdutosPorTipo("feminino")}>
                  Feminino
                </a>
              </li>
              <li>
                <a onClick={() => filtrarProdutosPorTipo("unisex")}>Unisex</a>
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
