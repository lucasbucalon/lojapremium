import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import style from "./details.module.css";

export default function Details() {
  const { id } = useParams(); // Captura o ID do produto da URL
  const [products, setProducts] = useState(null);
  const [erro, setErro] = useState(null);
  const [destaque, setDestaque] = useState(null); // Inicializa sem imagem
  const [corSelecionada, setCorSelecionada] = useState("");

  // Carregar os dados do produto
  useEffect(() => {
    window.scrollTo(0, 0);
    const carregarproducts = async () => {
      try {
        const response = await fetch("/server/products.json");
        if (!response.ok) throw new Error("Erro ao carregar produtos");

        const data = await response.json();

        // Garantindo IDs únicos
        data.forEach((product, index) => {
          product.id = index + 1;
        });

        const productsSelecionado = data.find((p) => p.id === parseInt(id));
        if (!productsSelecionado) {
          setErro("Produto não encontrado!");
          return;
        }

        setProducts(productsSelecionado);
        setDestaque(productsSelecionado.image[0]); // Define a imagem de destaque corretamente
      } catch (error) {
        setErro("Erro ao carregar produto.");
        console.error(error);
      }
    };

    carregarproducts();
  }, [id]);

  // Função para comprar agora
  const handleComprarAgora = () => {
    alert("Compra realizada com sucesso!");
  };

  // Função para adicionar ao carrinho
  const handleAdicionarCarrinho = () => {
    if (!products) return;

    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.push(products);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert("Produto adicionado ao carrinho!");
  };

  if (erro) {
    return <h2>{erro}</h2>;
  }

  if (!products) {
    return <h2>Carregando detalhes do produto...</h2>;
  }

  return (
    <>
      <div className={style.product_wrapper}>
        <div className={style.product_detail}>
          <div className={style.img_carousel}>
            <div className={style.thumbnail}>
              {products.image.map((imgSrc, index) => (
                <img
                  key={index}
                  className={`${style.img_res} ${
                    destaque === imgSrc ? style.active : style.off
                  }`}
                  src={imgSrc}
                  alt={products.name}
                  onClick={() => setDestaque(imgSrc)} // Muda a imagem de destaque ao clicar
                />
              ))}
            </div>
            {destaque && (
              <img
                className={style.img_destaque}
                src={destaque}
                alt={products.name}
              />
            )}
          </div>
          <div className={style.product_info}>
            <h2 id="productsNome" className={style.name}>
              {products.name}
            </h2>
            {products.description && (
              <p className={style.description}>{products.description}</p>
            )}
            <div className={style.line}></div>
            <div className={style.box_info}>
              <div className={style.box}>
                <div className={style.price}>
                  {products.oferta ? (
                    <>
                      <span className={style.original_price}>
                        R$ {products.price}
                      </span>
                      <span className={style.offer_price}>
                        R$ {products.discountPrice}
                      </span>
                    </>
                  ) : (
                    <span>R$ {products.price}</span>
                  )}
                </div>
                {products.cor?.length > 0 && (
                  <div className={style.colors}>
                    <p>Cor:</p>
                    <div className={style.colorList}>
                      {products.cor.map((cor, index) => (
                        <div
                          key={index}
                          className={style.colorOption}
                          onClick={() => setCorSelecionada(cor)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setCorSelecionada(cor);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          <div
                            className={`${style.colorBox} ${
                              corSelecionada === cor ? style.selected : ""
                            }`}
                            style={{ backgroundColor: cor }}
                          />
                          <span className={style.colorName}>{cor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {products.size?.length > 0 && (
                  <div className={style.size}>
                    Tamanho: {products.size.join(", ")}
                  </div>
                )}
                {products.type?.length > 0 && (
                  <div className={style.type}>
                    Tipo: {products.type.join(", ")}
                  </div>
                )}
              </div>
              <div className={style.buttons}>
                <h2>valor total</h2>
                <h2>quantidade</h2>
                <button id="comprarAgora" onClick={handleComprarAgora}>
                  Comprar Agora
                </button>
                <button
                  id="adicionarCarrinho"
                  onClick={handleAdicionarCarrinho}
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
