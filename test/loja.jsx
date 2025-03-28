import { Icon } from "@iconify-icon/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../../components/Banner/Banner";
import "./Loja.css";

export default function Loja() {
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
        const response = await fetch("/produtos.json");
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
      <div className="item-box" key={produto.id}>
        <div
          className="item"
          onClick={() => navigate(`/detalhes/${produto.id}`)}
        >
          <img src={produto.image[0]} alt={produto.name} />
          <h2 className="name">{produto.name}</h2>
          <div className="des-box">
            <p>{produto.description}</p>
          </div>
          <div className="prices">
            <span
              className="price"
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
              <span className="offer-price">
                R$ {produto.discountPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="colors">Cores: {produto.cor?.join(", ") || ""}</div>
          <div className="type">Tipo: {produto.type?.join(", ") || ""}</div>
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
          className={`pagina-btn ${i === paginaAtual ? "active" : ""}`}
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
      <header id="inicio" className="loja">
        {/* BARRA LATERAL DE COMPRA  */}
        <div className="cart" style={{ right: isCartOpen ? "0" : "-400px" }}>
          <button className="config">
            <Icon className="icon-config" icon="ph:gear" />
            <p>Configurações</p>
          </button>
          <h2>Seu Carrinho</h2>
          <div className="listCart"></div>
          <div className="btn">
            <button className="close" onClick={() => setIsCartOpen(false)}>
              FECHAR
            </button>
            <button>COMPRAR</button>
          </div>
        </div>

        <div className="content-header">
          {/* LOGO DA LOJA */}
          <div className="logo">
            <img src="/public/image/logo.jpg" alt="logo" />
          </div>

          {/* BARRA DE PESQUISA */}
          <div className="search">
            <input
              type="text"
              placeholder="Buscar Produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Icon className="icon-search" icon="tabler:search" />
          </div>

          {/* FILTRO DE PREÇO */}
          <div className="filter">
            <input
              className="minPrice"
              type="text"
              placeholder="Preço Min..."
              value={minPrice}
              onChange={handleMinPriceChange}
              onKeyDown={handleKeyDown}
            />
            <input
              className="maxPrice"
              type="text"
              placeholder="Preço Max..."
              value={maxPrice}
              onChange={handleMaxPriceChange}
              onKeyDown={handleKeyDown}
            />
            <button onClick={filtrarPorPreco}>Filtrar</button>
          </div>

          {/* PERFIL E MENU */}
          <div className="menu">
            <div className="icon" onClick={() => setIsCartOpen(true)}>
              <Icon className="profile" icon="iconamoon:profile-light" />
            </div>
          </div>

          {/* BARRA DE NAVEGAÇÃO */}
          <nav>
            <ul>
              <li>
                <a href="#" onClick={() => filtrarProdutosPorTipo("ofertas")}>
                  Ofertas
                </a>
              </li>
              <li>
                <a href="#" onClick={() => filtrarProdutosPorTipo("todos")}>
                  Todos
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
                <a href="#" onClick={() => filtrarProdutosPorTipo("unisex")}>
                  Unisex
                </a>
              </li>
              <li>
                <a href="/sobre">Sobre Nós</a>
              </li>
              <li>
                <a href="#contato">Contato</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <Banner />

      <section className="listProduct">
        {exibirProdutos()}
        <div className="pagination">{exibirPaginas()}</div>
      </section>
    </>
  );
}


.carousel {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 20px;
  padding: 10px 0;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  transition: transform 0.5s ease-in-out;
  justify-content: center;
}

.carousel::-webkit-scrollbar {
  display: none;
}

.item-box_p {
  transition: all 0.3s ease;
  flex: 0 0 calc(25% + 10px); /* 4 itens no centro e parte dos lados visíveis */
  scroll-snap-align: center;
  transition: transform 0.3s ease;
  border-radius: 10px;
  padding: 10px;
  background: #d4deea;
  border: 1px solid #eca0a0;
  text-align: center;
  position: relative;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 90vw;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background-color: transparent;
  cursor: pointer;
  z-index: 2;
}
