import { useNavigate, useParams } from "react-router-dom";
import styles from "../StatistikaComponents/Statistika.module.css";

const GrupaIgracaPoKriterijumu = ({kriterijum, listaIgraca}) => {
  const { idTakmicenja } = useParams();
  const navigate = useNavigate();
  return (
    <div className={styles.dete}>
      <p className={styles.kriterijumParagraf}>{kriterijum}</p>
        <table className={styles.tabelaStatistika}>
          <thead>
            <tr>
              <th>Redni broj</th>
              <th>Ime i prezime</th>
              <th>Klub</th>
              <th>Broj</th>
            </tr>
          </thead>
          <tbody>
            {listaIgraca.map((igrac, index) => {
              return (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td onClick={()=>{navigate(`/informacijeOIgracu/${idTakmicenja}/${igrac.idEkipe}/${igrac.idIgraca}`)}}>{igrac.imeIgraca}</td>
                  <td onClick={()=>{navigate(`/informacijeOEkipi/${idTakmicenja}/${igrac.idEkipe}`)}}>{igrac.nazivEkipe}</td>
                  <td>{igrac.vrednost}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
    </div>
  );
};
export default GrupaIgracaPoKriterijumu;
