// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import style from "./profile.module.css";

export default function Profile() {
  // const { user } = useParams();
  // const [profiles, setProfiles] = useState([]);
  // const [erro, setErro] = useState(null);
  // const [carregando, setCarregando] = useState(true);
  // const [profilesFiltrados, setProfilesFiltrados] = useState([]);

  // useEffect(() => {
  //   const carregarProfiles = async () => {
  //     try {
  //       const response = await fetch("/server/client.json");
  //       if (!response.ok) throw new Error("Erro ao carregar profiles");
  //       const data = await response.json();
  //       const produtosFiltradosProfile = data.filter((produto) =>
  //         produto.user.includes(user)
  //       );
  //       setProfilesFiltrados(produtosFiltradosProfile);
  //       setProfiles(data);
  //     } catch (error) {
  //       setErro(error.message);
  //     } finally {
  //       setCarregando(false);
  //     }
  //   };
  //   carregarProfiles();
  // }, [user]);

  // if (carregando) {
  //   return <p>Carregando...</p>;
  // }

  // if (erro) {
  //   return <p>{erro}</p>;
  // }

  return (
    <div className={style.profile}>
      <div className={style.profile_item} onClick={() => alert("Menu aberto")}>
        <Icon className={style.icon} icon="line-md:heart" />
      </div>
      <div className={style.profile_item} onClick={() => alert("Menu aberto")}>
        <Icon className={style.icon} icon="solar:cart-large-2-linear" />
      </div>
      <div className={style.profile_item} onClick={() => alert("Menu aberto")}>
        <Icon className={style.icon} icon="iconamoon:profile-light" />
      </div>
    </div>
  );
}
