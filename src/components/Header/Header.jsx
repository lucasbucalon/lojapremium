import { Icon } from "@iconify-icon/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../Profile/Profile";

import style from "./header.module.css";

export default function Header() {
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (erro) {
    return <p>{erro}</p>;
  }

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
  };

  // FILTRAR POR PREÇO
  const filtrarPorPreco = () => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;
    const produtosFiltrados = produtos.filter(
      (produto) => produto.price >= min && produto.price <= max
    );

    setProdutosFiltrados(produtosFiltrados);
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
        // setBusca("");
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
  };

  return (
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
              <a href="/">Inicio</a>
            </li>
            <li>
              <a href="/Sobre">Sobre Nós</a>
            </li>
            <li>
              <a href="#contato">Contato</a>
            </li>
            <li>
              <a href="/Todos">Todos</a>
            </li>
            <li>
              <a href="#" onClick={() => navigate("/Ofertas")}>
                Ofertas
              </a>
            </li>

            {/* Categorias */}
            <li className={style.categorias}>
              <a href="#">
                Categorias{" "}
                <Icon icon="icon-park-solid:down-one" className={style.icon} />
              </a>
              <Icon icon="teenyicons:up-solid" className={style.up} />

              <ul className={style.categorias_list}>
                {[
                  ...new Set(
                    produtos.flatMap((produto) =>
                      produto.category?.map(
                        (categoria) =>
                          categoria
                            .trim()
                            .toLowerCase()
                            .replace(/^\w/, (c) => c.toUpperCase()) // Corrige a primeira letra
                      )
                    )
                  ),
                ].map((categoria, index) => (
                  <p
                    key={index}
                    onClick={() => navigate(`/Categorias/${categoria}`)}
                  >
                    # {categoria || "Categoria Indefinida"}
                  </p>
                ))}
              </ul>
            </li>

            {/* Catálogo */}
            <li className={style.catalogos}>
              <a href="#">
                Catálogo{" "}
                <Icon icon="icon-park-solid:down-one" className={style.icon} />
              </a>
              <Icon
                icon="teenyicons:up-solid"
                width="15"
                height="15"
                className={style.up}
              />

              <ul className={style.catalogos_list}>
                {[
                  ...new Set(
                    produtos.flatMap((produto) =>
                      produto.type?.map(
                        (tipo) =>
                          tipo
                            .trim()
                            .toLowerCase()
                            .replace(/^\w/, (c) => c.toUpperCase()) // Corrige a primeira letra
                      )
                    )
                  ),
                ].map((tipo, index) => (
                  <p key={index} onClick={() => navigate(`/Catalogos/${tipo}`)}>
                    # {tipo || "Tipo Indefinido"}
                  </p>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
