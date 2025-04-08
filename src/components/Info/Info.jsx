import { Icon } from "@iconify-icon/react";
import style from "./info.module.css";

export default function Info() {
  return (
    <div className={style.info}>
      <div className={style.box}>
        <Icon icon="ion:card-outline" className={style.icon} />
        <h3>Escolha como pagar</h3>
        <p>
          Com Mercado Pago, você paga com cartão, boleto ou Pix. Você também
          pode pagar em até 12x sem cartão com a Linha de Crédito.
        </p>
      </div>
      <div className={style.box}>
        <Icon
          icon="material-symbols-light:box-outline-sharp"
          className={style.icon}
        />
        <h3>Frete grátis a partir de R$ 79</h3>
        <p>
          Ao se cadastrar no Mercado Livre, você tem frete grátis em milhares de
          produtos.
        </p>
      </div>
      <div className={style.box}>
        <Icon icon="carbon:security" className={style.icon} />
        <h3>Segurança, do início ao fim</h3>
        <p>
          Você não gostou do que comprou? Devolva! No Mercado Livre não há nada
          que você não possa fazer, porque você está sempre protegido.
        </p>
      </div>
      <div className={style.box}>
        <Icon icon="mynaui:truck" className={style.icon} />
        <h3>Entrega para todo o Brasil</h3>
        <p>
          Com nosso serviço de entrega, você recebe seu pedido em qualquer lugar
          do Brasil, com a qualidade e rapidez que você merece.
        </p>
      </div>
    </div>
  );
}
