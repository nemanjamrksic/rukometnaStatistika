import { useNavigate, useParams } from "react-router-dom";
import styles from "./InformacijeOEkipi.module.css";

const ListaUtakmicaEkipa = ({ raspored }) => {
  const { idTakmicenja } = useParams();
  const navigate = useNavigate();
  return (
    <div style={{overflowX:"auto"}}>


    <table className={styles.tabelaRaspored}>
      <thead>
        <tr>
          <td>Kolo</td>
          <td>Datum</td>
          <td>Domacin</td>
          <td>Rezultat</td>
          <td>Gost</td>
        </tr>
      </thead>
      <tbody>
        {raspored.map((utakmica, index) => {
          const utakmicaDatum = new Date(utakmica.datum);
          return (
            <tr
              key={index}
              onClick={() => {
                utakmica.rezultat !== "" &&
                  navigate(
                    `/pregledZapisnika/${idTakmicenja}/${utakmica.kolo - 1}/${
                      utakmica.idUtakmice
                    }`
                  );
              }}
            >
              <td>{utakmica.kolo}</td>
              <td>{utakmica.datum !== "" ? `${utakmicaDatum.toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}` : ""}</td>
              <td>{utakmica.domaciTim}</td>
              <td>
                {utakmica.rezultat !== ""
                  ? `${utakmica.rezultat} (${utakmica.rezultatPoluvreme})`
                  : ""}
              </td>
              <td>{utakmica.gostujuciTim}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </div>
  );
};
export default ListaUtakmicaEkipa;
