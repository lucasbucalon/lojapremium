import style from "./filters.module.css";

export default function Filters() {
  return (
    <div>
      <input type="checkbox" id="filter" className={style.filter_input} />
      <label htmlFor="filter" className={style.filter_label}>
        <span className={style.filter_icon}></span>
        <span className={style.filter_text}>Filtros</span>
      </label>
    </div>
  );
}
