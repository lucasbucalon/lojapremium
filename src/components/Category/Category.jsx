import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./category.module.css"; // Arquivo de estilos separado

export default function Category() {
  const [category, setCategory] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();
  const categoryRef = useRef(null);

  useEffect(() => {
    const carregarCategoria = async () => {
      try {
        const response = await fetch("/server/category.json");
        if (!response.ok) throw new Error("Erro ao carregar Categoria");
        const data = await response.json();

        if (!Array.isArray(data)) throw new Error("Formato inválido de dados");

        setCategory(data);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };
    carregarCategoria();
  }, []);

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (erro) {
    return <p>{erro}</p>;
  }

  function moveNext() {
    if (category.length > 1) {
      setCategory((prev) => [...prev.slice(1), prev[0]]);
    }
  }

  function movePrev() {
    if (category.length > 1) {
      setCategory((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
    }
  }

  return (
    <div className={style.category_wrapper}>
      <button className={`${style.button} ${style.prev}`} onClick={movePrev}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path fill="currentColor" d="m4 10l9 9l1.4-1.5L7 10l7.4-7.5L13 1z" />
        </svg>
      </button>
      <div className={style.category} ref={categoryRef}>
        {category.map((categorys, index) => {
          return (
            // Aqui você precisa adicionar o return
            <div
              key={categorys.id}
              className={`${style.category_container} ${
                index === 1 ||
                index === 2 ||
                index === 3 ||
                index === 4 ||
                index === 5
                  ? style.center
                  : ""
              }`}
              onClick={() => navigate(categorys.link)}
            >
              <img src={categorys.image} alt={categorys.title || "Produto"} />
            </div>
          );
        })}
      </div>
      <button className={`${style.button} ${style.next}`} onClick={moveNext}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path fill="currentColor" d="M7 1L5.6 2.5L13 10l-7.4 7.5L7 19l9-9z" />
        </svg>
      </button>
    </div>
  );
}
