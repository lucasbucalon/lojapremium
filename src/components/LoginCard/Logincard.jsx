import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./logincard.module.css";
import PropTypes from "prop-types";

const users = [
  {
    id: 1,
    name: "João",
    surname: "Bucalon",
    cpf: "396.865.658-09",
    birthDate: "2000-05-25",
    password: "123456",
    image: "public/imageUser/perfil.png",
    email: "jlucasbucalon@gmail.com",
    phone: "(11) 99999-9999",
    whatsappNotifications: true,
    emailNotifications: true,
    address: {
      street: "Rua dos Bobos",
      number: "0",
      complement: "Apto 101",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zip: "00000-000",
    },
  },
];
export default function LoginCard({ fechar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const user = users.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === senha
    );

    if (user) {
      localStorage.setItem("usuarioLogado", JSON.stringify(user));
      fechar(); // fecha o modal
      navigate("/minha-conta"); // redireciona para a rota privada
    } else {
      setErro("Email ou senha inválidos");
    }
  };

  return (
    <div className={style.overlay} onClick={fechar}>
      <div className={style.loginCard} onClick={(e) => e.stopPropagation()}>
        <button onClick={fechar} className={style.closeButton}>
          ×
        </button>
        <h2>Entrar</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button type="submit">Entrar</button>
        </form>
        {erro && <p className={style.error}>{erro}</p>}
      </div>
    </div>
  );
}

LoginCard.propTypes = {
  fechar: PropTypes.bool.isRequired,
};
