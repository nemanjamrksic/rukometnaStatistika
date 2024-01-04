import { useNavigate, useParams } from "react-router-dom";
import GrupaIgracaPoKriterijumu from "../Components/StatistikaComponents/GrupaIgracaPoKriterijumu";
import styles from "../Components/StatistikaComponents/Statistika.module.css";
import { useState, useEffect } from "react";
import { firebaseGet } from "../Helpers/Firebase";
const StatistikaPage = () => {
  const navigate = useNavigate();
  const { idTakmicenja } = useParams();
  const [listaIgraca, setListaIgraca] = useState([]);
  const [takmicenje, setTakmicenje] = useState([]);
  useEffect(() => {
    transformData();
   async function transformData() {
      const igraciData = await firebaseGet(`/takmicenja/${idTakmicenja}/listaEkipa`);
      const takmicenjeData = await firebaseGet(`/takmicenja/${idTakmicenja}`)
      if(!igraciData || Object.keys(igraciData).length === 0){
        navigate("/notFound")
      }else{
      let grupisaniIgraci = [];
      for (const [idEkipe,ekipa] of igraciData.entries()) {
        for (const [idIgraca,igrac] of ekipa.listaIgraca.entries()) {
          grupisaniIgraci.push({ ...igrac, nazivEkipe: ekipa.nazivEkipe, idIgraca: idIgraca, idEkipe: idEkipe });
        }
      }
      setListaIgraca(grupisaniIgraci);
      setTakmicenje(takmicenjeData);
    }
  }
  }, [idTakmicenja, navigate]);
  function vratiTop(kriterijum) {
    return listaIgraca
      .slice(0)
      .sort((a, b) => b[kriterijum] - a[kriterijum])
      .slice(0, 10)
      .map((igrac) => ({
        imeIgraca: igrac.imeIgraca,
        nazivEkipe: igrac.nazivEkipe,
        vrednost: igrac[kriterijum],
        idIgraca: igrac.idIgraca,
        idEkipe: igrac.idEkipe
      }));
  }

  return (
    <div className={styles.pozadina}>
      <h1 className={styles.naslov}>{takmicenje.nazivTakmicenja} {takmicenje.sezonaTakmicenja}</h1>
      {listaIgraca.length && (
        <div className={styles.tabeleWrap}>
          <GrupaIgracaPoKriterijumu listaIgraca={vratiTop("brojMVP")} kriterijum="Igrač utakmice" />
          <GrupaIgracaPoKriterijumu listaIgraca={vratiTop("brojGolova")} kriterijum="Golovi"/>
          <GrupaIgracaPoKriterijumu listaIgraca={vratiTop("brojIskljucenja")} kriterijum="Isključenja" />
          <GrupaIgracaPoKriterijumu listaIgraca={vratiTop("brojDisk")} kriterijum="Crveni kartoni" />
        </div>
      )}
    </div>
  );
};
export default StatistikaPage;
