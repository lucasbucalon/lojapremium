import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./category.module.css"; // Arquivo de estilos separado

export default function Category() {
  const [category, setCategory] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [visibleCategories, setVisibleCategories] = useState([]);
  const categoryRefs = useRef([]);

  const navigate = useNavigate();

  useEffect(() => {
    const carregarCategoria = async () => {
      try {
        const response = await fetch("/server/category.json");
        if (!response.ok) throw new Error("Erro ao carregar Categoria");
        const data = await response.json();

        if (!Array.isArray(data)) throw new Error("Formato inválido de dados");

        // Clona os primeiros e últimos elementos para efeito de carrossel infinito
        setCategory([...data, ...data.slice(0, 2)]);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };
    carregarCategoria();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const updatedVisibleCategories = categoryRefs.current
        .map((category, index) => {
          if (category && isElementInViewport(category)) {
            return index; // Adiciona o índice da categoria visível
          }
          return null;
        })
        .filter((index) => index !== null); // Remove índices nulos

      setVisibleCategories(updatedVisibleCategories);
    };

    const isElementInViewport = (el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      );
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Inicializa a verificação no primeiro render

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [category]);

  const moveNext = () => {
    setCategory((prev) => [...prev.slice(1), prev[0]]);
  };

  const movePrev = () => {
    setCategory((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
  };

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (erro) {
    return <p>{erro}</p>;
  }

  return (
    <div className={style.category_wrapper}>
      <div className={style.category_title}>
        <span></span>
        <h2>Categorias</h2>
        <span></span>
      </div>

      <div className={style.category}>
        <button className={`${style.button} ${style.prev}`} onClick={movePrev}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path
              fill="currentColor"
              d="m4 10l9 9l1.4-1.5L7 10l7.4-7.5L13 1z"
            />
          </svg>
        </button>
        {category.map((categorys, index) => (
          <div
            key={index}
            className={`${style.category_container} ${
              visibleCategories.includes(index) ? style.center : ""
            }`}
            ref={(el) => (categoryRefs.current[index] = el)}
            onClick={() =>
              navigate(`/Todos?search=${encodeURIComponent(categorys.title)}`)
            }
          >
            <div className={style.category_item}>
              <img src={categorys.image} alt={categorys.title || "Produto"} />
              <span></span>
              <p>{categorys.title}</p>
            </div>
          </div>
        ))}
        <button className={`${style.button} ${style.next}`} onClick={moveNext}>
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
}
