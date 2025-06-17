import { Icon } from "@iconify-icon/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "../LoginCard/Logincard";
import style from "./header.module.css";

export default function Header() {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [categoriaAberta, setCategoriaAberta] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  // Carregar produtos
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

  // Filtrar produtos com base nos filtros de busca
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (busca.trim()) {
        // Se houver algo na busca, buscar com o termo
        navigate(`/Todos?search=${encodeURIComponent(busca.trim())}`);
      } else {
        // Se a busca estiver vazia, navegar para a página de todos os produtos
        navigate(`/Todos`);
      }
    }
  };

  const toggleCategoria = (categoria) => {
    setCategoriaAberta((prev) => (prev === categoria ? null : categoria));
  };

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <header id="inicio" className={style.header}>
      <div className={style.header_content}>
        {/* LOGO DA LOJA */}
        <div className={style.logo} onClick={() => navigate("/")}>
          <img src="/image/logo.jpg" alt="logo" />
        </div>

        {/* BARRA DE PESQUISA */}
        <div className={style.search}>
          <input
            type="text"
            placeholder="Pesquisar Produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Icon className={style.icon_search} icon="tabler:search" />
        </div>

        {/* PERFIL DO USUÁRIO */}
        <div className={style.profile}>
          <div
            className={style.profile_user}
            onClick={() => setMostrarLogin(true)}
          >
            <Icon className={style.icon_user} icon="iconamoon:profile-light" />
          </div>

          {mostrarLogin && <LoginCard fechar={() => setMostrarLogin(false)} />}

          <div className={style.profile_text}>
            <p>Olá, faça o seu login</p>
            <p>ou cadastre-se</p>
          </div>

          <div className={style.profile_box}>
            <div
              className={style.profile_item}
              onClick={() => alert("Menu aberto 02")}
            >
              <Icon className={style.icon} icon="line-md:heart" />
            </div>
            <div
              className={style.profile_item}
              onClick={() => alert("Menu aberto 02")}
            >
              <Icon className={style.icon} icon="solar:cart-large-2-linear" />
            </div>
          </div>
        </div>

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
            <li
              className={style.categorias}
              onClick={() => toggleCategoria("cat1")}
            >
              <a href="#">
                Categorias{" "}
                <Icon icon="icon-park-solid:down-one" className={style.icon} />
              </a>
              <Icon
                icon="teenyicons:up-solid"
                className={style.up1}
                style={{
                  display: categoriaAberta === "cat1" ? "inline" : "none",
                }}
              />
              <ul
                className={style.categorias_list}
                style={{
                  display: categoriaAberta === "cat1" ? "grid" : "none",
                }}
              >
                {[
                  ...new Set(produtos.flatMap((produto) => produto.category)),
                ].map((categoria, index) => (
                  <p
                    key={index}
                    onClick={() =>
                      navigate(`/Todos?search=${encodeURIComponent(categoria)}`)
                    }
                  >
                    # {categoria || "Categoria Indefinida"}
                  </p>
                ))}
              </ul>
            </li>

            {/* Catálogo */}
            <li
              className={style.catalogos}
              onClick={() => toggleCategoria("cat2")}
            >
              <a href="#">
                Catálogo{" "}
                <Icon icon="icon-park-solid:down-one" className={style.icon} />
              </a>
              <Icon
                icon="teenyicons:up-solid"
                width="15"
                height="15"
                className={style.up2}
                style={{
                  display: categoriaAberta === "cat2" ? "inline" : "none",
                }}
              />
              <ul
                className={style.catalogos_list}
                style={{
                  display: categoriaAberta === "cat2" ? "grid" : "none",
                }}
              >
                {[...new Set(produtos.flatMap((produto) => produto.type))].map(
                  (tipo, index) => (
                    <p
                      key={index}
                      onClick={() =>
                        navigate(`/Todos?search=${encodeURIComponent(tipo)}`)
                      }
                    >
                      # {tipo || "Tipo Indefinido"}
                    </p>
                  )
                )}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
