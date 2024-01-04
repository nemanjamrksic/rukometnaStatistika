import ListaIgracaEkipa from "../Components/InformacijeOEkipiComponents/ListaIgracaEkipa";
import ListaUtakmicaEkipa from "../Components/InformacijeOEkipiComponents/ListaUtakmicaEkipa";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../Components/InformacijeOEkipiComponents/InformacijeOEkipi.module.css";
import { useEffect, useState } from "react";
import { firebaseGet } from "../Helpers/Firebase";
const InformacijeOEkipiPage = () => {
  const navigate = useNavigate();
  const { idTakmicenja, idEkipe } = useParams();
  const [ekipa, setEkipa] = useState({});
  const [raspored, setRaspored] = useState([]);
  const [nazivTakmicenja, setNazivTakmicenja] = useState();
  useEffect(() => {
    transformRaspored();
    
    async function transformRaspored() {
      const dataRaspored = await firebaseGet(
        `/takmicenja/${idTakmicenja}/raspored`
      );
      const dataEkipa = await firebaseGet(`/takmicenja/${idTakmicenja}/listaEkipa/${idEkipe}`)
      const dataTakmicenje = await firebaseGet(
        `/takmicenja/${idTakmicenja}/nazivTakmicenja`)
      if (!dataEkipa || Object.keys(dataEkipa).length === 0) {
        navigate("/notFound");
      } else {
      let listaUtakmica = [];
      for (const kolo of dataRaspored) {
        const indexUtakmice = kolo.utakmice.findIndex(
          (ekipa) =>
            ekipa.idDomacin === parseInt(idEkipe) ||
            ekipa.idGost === parseInt(idEkipe)
        );
        listaUtakmica.push({
          ...kolo.utakmice[indexUtakmice],
          kolo: kolo.kolo,
          idUtakmice: indexUtakmice,
        });
      }
      setNazivTakmicenja(dataTakmicenje);
      setEkipa(dataEkipa);
      setRaspored(listaUtakmica);
    }
    }
  }, [idTakmicenja, idEkipe, navigate]);

  return (
    <div className={styles.pozadina}>
      <div className={styles.grbNazivWrapper}>
        <img style={{filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))"}} src={ekipa.grb} alt="grb" />
        <div style={{ width: "100%" }}>
          <h1 className={styles.naslov}>{ekipa.nazivEkipe}</h1>
          <p className={styles.takmicenje}>{nazivTakmicenja}</p>
        </div>
      </div>
      <p className={styles.takmicenje}>Lista igraca:</p>
      {ekipa.listaIgraca && (
        <ListaIgracaEkipa listaIgraca={ekipa.listaIgraca} />
      )}
      <p className={styles.takmicenje}>Raspored:</p>
      {raspored.length > 0 && <ListaUtakmicaEkipa raspored={raspored} />}
    </div>
  );
};
export default InformacijeOEkipiPage;
