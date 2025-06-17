import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./loginCard.module.css";
import users from "/server/users.json"; // ou o caminho correto do seu JSON

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find((u) => u.email === email && u.password === senha);

    if (user) {
      localStorage.setItem("usuarioLogado", JSON.stringify(user));
      navigate("/minha-conta"); // Redireciona para rota privada
    } else {
      setErro("Email ou senha inválidos");
    }
  };

  return (
    <div className={style.loginCard}>
      <h2>Entrar</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        {erro && <p className={style.error}>{erro}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
