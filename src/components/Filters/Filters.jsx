import style from "./filters.module.css";
import PropTypes from "prop-types";

export default function Filters({ mostrarOfertas, setMostrarOfertas }) {
  return (
    <div>
      <div className={style.filter_box}>
        <label className={style.checkbox_container}>
          <input
            type="checkbox"
            checked={mostrarOfertas}
            onChange={(e) => setMostrarOfertas(e.target.checked)}
          />
          Mostrar produtos em oferta
        </label>
      </div>
    </div>
  );
}

Filters.propTypes = {
  mostrarOfertas: PropTypes.bool.isRequired,
  setMostrarOfertas: PropTypes.func.isRequired,
  categorias: PropTypes.arrayOf(PropTypes.string),
};
