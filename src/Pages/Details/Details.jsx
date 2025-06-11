import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import style from "./details.module.css";
import { Icon } from "@iconify-icon/react";
import Recomended from "../../components/Recomended/Recomended.jsx";

export default function Details() {
  const { id } = useParams(); // Captura o ID do produto da URL
  const [products, setProducts] = useState(null);
  const [erro, setErro] = useState(null);
  const [destaque, setDestaque] = useState(null); // Inicializa sem imagem
  const [corSelecionada, setCorSelecionada] = useState(null);
  const [sizeSelecionada, setSizeSelecionada] = useState(null);
  const podeComprar = corSelecionada && sizeSelecionada;
  const [quantidade, setQuantidade] = useState(1);
  const [valorTotal, setValorTotal] = useState(0);
  const [zoom, setZoom] = useState({ x: 0, y: 0, ativo: false });
  const imgRef = useRef(null);

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

  const calcularValorTotal = useCallback(() => {
    if (!products) return;
    const preco = products.oferta ? products.discountPrice : products.price;
    const total = preco * quantidade;
    setValorTotal(total);
  }, [products, quantidade]);

  useEffect(() => {
    calcularValorTotal();
  }, [quantidade, products, calcularValorTotal]);

  const handleMouseMove = (e) => {
    const bounds = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;

    setZoom({ x, y, ativo: true });
  };

  const handleMouseLeave = () => {
    setZoom((prev) => ({ ...prev, ativo: false }));
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
                ref={imgRef}
                className={style.img_destaque}
                src={destaque}
                alt={products.name}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              />
            )}
          </div>
          <div className={style.product_info}>
            {zoom.ativo && (
              <div className={style.zoomArea}>
                <div
                  className={style.zoomedImage}
                  style={{
                    backgroundImage: `url(${destaque})`,
                    backgroundPosition: `${zoom.x}% ${zoom.y}%`,
                    backgroundSize: "250%",
                  }}
                />
              </div>
            )}
            <h2 id="productsNome" className={style.name}>
              {products.name}
            </h2>
            {products.description && (
              <p className={style.description}>{products.description}</p>
            )}
            <div className={style.line}></div>
            <div className={style.box_info}>
              <div className={style.box}>
                <Icon icon="line-md:heart" className={style.icon_favorite} />
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
                  <div className={style.colors}>
                    <p>Tamanho:</p>
                    <div className={style.colorList}>
                      {products.size.map((size, index) => (
                        <div
                          key={index}
                          className={style.colorOption}
                          onClick={() => setSizeSelecionada(size)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setSizeSelecionada(size);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          <div
                            className={`${style.colorBox} ${
                              sizeSelecionada === size ? style.selected : ""
                            }`}
                            style={{ backgroundColor: size }}
                          />
                          <span className={style.colorName}>{size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {products.type?.length > 0 && (
                  <div className={style.type}>
                    Tipo: {products.type.join(", ")}
                  </div>
                )}
              </div>

              <div className={style.finalizarCompra}>
                <div className={style.valorTotal}>
                  <h4>Valor Total</h4>
                  <p id="valorTotal">R$ {valorTotal.toFixed(2)}</p>
                </div>

                <div className={style.quantidade}>
                  <h4>Quantidade</h4>
                  <input
                    type="number"
                    value={quantidade}
                    min={1}
                    max={products.amount}
                    onChange={(e) => {
                      const valor = Number(e.target.value);
                      if (valor > products.amount) {
                        setQuantidade(products.amount);
                      } else {
                        setQuantidade(valor);
                      }
                    }}
                  />
                  <p className={style.dica}>
                    Máximo disponível: {products.amount}
                  </p>
                </div>

                <div className={style.box_buttons}>
                  <button
                    className={style.comprarAgora}
                    onClick={handleComprarAgora}
                    disabled={!podeComprar}
                    title={!podeComprar ? "Selecione cor e tamanho" : ""}
                  >
                    Comprar Agora
                  </button>
                  <button
                    className={style.adicionarCarrinho}
                    onClick={handleAdicionarCarrinho}
                    disabled={!podeComprar}
                    title={!podeComprar ? "Selecione cor e tamanho" : ""}
                  >
                    Adicionar ao Carrinho
                  </button>
                  {!podeComprar && (
                    <p className={style.alerta}>
                      Selecione a <strong>cor</strong> e o{" "}
                      <strong>tamanho</strong> para continuar.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Recomended
        tipoFiltro={products?.category}
        produtoIdAtual={products?.id}
        filtroCampo="category"
        titulo="Produtos da mesma categoria"
      />

      <Recomended
        tipoFiltro={products?.type}
        produtoIdAtual={products?.id}
        filtroCampo="type"
        titulo="Produtos do mesmo catálogo"
      />
    </>
  );
}
