import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import style from "./banner.module.css";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(2); // Começa no índice 2 por conta dos slides clonados
  const [isAnimating, setIsAnimating] = useState(false);
  const slideListRef = useRef(null);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  // Carrega os banners da API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("/server/banners.json");
        const data = await response.json();
        setBanners([...data.slice(-2), ...data, ...data.slice(0, 2)]); // Clona os slides para efeito de looping
      } catch (error) {
        console.error("Erro ao carregar banners:", error);
      }
    };
    fetchBanners();
  }, []);

  // Função para avançar para o próximo slide
  const handleNext = useCallback(() => {
    if (isAnimating) return; // Impede múltiplas animações simultâneas
    setIsAnimating(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isAnimating]);

  // Função para voltar ao slide anterior
  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isAnimating]);

  // Inicia o carrossel automático
  const startAutoSlide = useCallback(() => {
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 5000);
  }, [handleNext]);

  // Gerencia o carrossel automático
  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, [startAutoSlide]);

  // Lida com a transição e o loop infinito
  useEffect(() => {
    if (!slideListRef.current || banners.length === 0) return;

    const slideList = slideListRef.current;

    const handleTransitionEnd = () => {
      if (currentIndex >= banners.length - 2) {
        setTimeout(() => {
          slideList.style.transition = "none";
          setCurrentIndex(2);
        }, 100);
      } else if (currentIndex <= 1) {
        setTimeout(() => {
          slideList.style.transition = "none";
          setCurrentIndex(banners.length - 3);
        }, 100);
      } else {
        slideList.style.transition = "transform 0.5s ease-in-out";
      }
      setIsAnimating(false);
    };

    slideList.addEventListener("transitionend", handleTransitionEnd);
    return () =>
      slideList.removeEventListener("transitionend", handleTransitionEnd);
  }, [currentIndex, banners.length]);

  if (banners.length === 0) return <div>Carregando...</div>;

  return (
    <div className={style.banner_wrapper}>
      <div className={style.banner_container}>
        <button
          className={`${style.banner_button} ${style.btn_prev}`}
          onClick={handlePrev}
          aria-label="Anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path
              fill="currentColor"
              d="m4 10l9 9l1.4-1.5L7 10l7.4-7.5L13 1z"
            />
          </svg>
        </button>

        <div
          ref={slideListRef}
          className={style.banner_list}
          style={{
            transform: `translateX(${getCenterPosition(currentIndex)}px)`,
            transition: isAnimating ? "transform 0.5s ease-in-out" : "none",
          }}
        >
          {banners.map((banner, index) => (
            <div
              key={index}
              className={style.banner_item}
              onClick={() => navigate(banner.link)}
            >
              <div className={style.banner_content}>
                <img
                  className={style.banner_image}
                  src={banner.image}
                  alt={banner.title}
                  loading="lazy"
                />
                <div className={style.banner_description}>
                  <h3>{banner.title}</h3>
                  <p>{banner.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className={`${style.banner_button} ${style.btn_next}`}
          onClick={handleNext}
          aria-label="Próximo"
        >
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

// Função para centralizar os slides corretamente
function getCenterPosition(index) {
  const slideWidth = window.innerWidth * 0.9; // 90vw do CSS
  const margin = (window.innerWidth - slideWidth) / 2;
  return margin - index * slideWidth;
}
