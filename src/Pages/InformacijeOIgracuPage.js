import { useParams, useNavigate } from "react-router-dom";
import styles from "../Components/InformacijeOIgracuComponents/InformacijeOIgracu.module.css";
import { useEffect, useState } from "react";
import { firebaseGet } from "../Helpers/Firebase";
const InformacijeOIgracuPage = () => {
  const navigate = useNavigate();
  const { idTakmicenja, idEkipe, idIgraca } = useParams();
  const [igrac, setIgrac] = useState({});
  const [utakmice, setUtakmice] = useState([]);
  const [ekipa, setEkipa] = useState([]);
  const [brojOdigranihUtakmica, setBrojOdigranihUtakmica] = useState();
  useEffect(() => {
    transformData();
      async function transformData(){
        const dataEkipa = await firebaseGet(`/takmicenja/${idTakmicenja}/listaEkipa/${idEkipe}`);
        const dataIgrac = await firebaseGet(`/takmicenja/${idTakmicenja}/listaEkipa/${idEkipe}/listaIgraca/${idIgraca}`);
        if (!dataIgrac || Object.keys(dataIgrac).length === 0) {
          navigate("/notFound");
        } else {
          setEkipa(dataEkipa);
          setIgrac(dataIgrac);
        }
      }
  }, [idTakmicenja, idEkipe, idIgraca, navigate]);
  useEffect(() => {
    transformUtakmice();

    async function transformUtakmice() {
      let brojUtakmica = 0;
      const data = await firebaseGet(`/takmicenja/${idTakmicenja}/raspored`);
      let listaUtakmica = [];
      for (const kolo of data) {
        const indexUtakmice = kolo.utakmice.findIndex(
          (ekipa) =>
            ekipa.idDomacin === parseInt(idEkipe) ||
            ekipa.idGost === parseInt(idEkipe)
        );
        let brojGolovaIgraca;
        if (
          kolo.utakmice[indexUtakmice].postavaGost &&
          igrac.imeIgraca !== undefined
        ) {
          const indexDomacin = kolo.utakmice[
            indexUtakmice
          ].postavaDomacin.findIndex(
            (igracPostava) => igracPostava.imeIgraca === igrac.imeIgraca
          );
          const indexGost = kolo.utakmice[indexUtakmice].postavaGost.findIndex(
            (igracPostava) => igracPostava.imeIgraca === igrac.imeIgraca
          );
          if (indexDomacin !== -1) {
            brojUtakmica++;
            brojGolovaIgraca =
              kolo.utakmice[indexUtakmice].postavaDomacin[indexDomacin]
                .brojGolova;
          } else if (indexGost !== -1) {
            brojUtakmica++;
            brojGolovaIgraca =
              kolo.utakmice[indexUtakmice].postavaGost[indexGost].brojGolova;
          } else {
            brojGolovaIgraca = "DNP";
          }
        }

        listaUtakmica.push({
          ...kolo.utakmice[indexUtakmice],
          idKola: kolo.kolo - 1,
          idUtakmice: indexUtakmice,
          brojGolova: brojGolovaIgraca,
        });
      }
      setUtakmice(listaUtakmica);
      setBrojOdigranihUtakmica(brojUtakmica);
    }
  }, [idTakmicenja, idEkipe, igrac]);

  return (
    <div className={styles.pozadina}>
      <h1 className={styles.Ime}>{igrac.imeIgraca}</h1>
      <p className={styles.Klub}>{ekipa.nazivEkipe}</p>
      <div className={styles.zbirnaStatistikaWrapper}>
        <p>
          Broj golova (po utakmici): <span>{igrac.brojGolova} ({igrac.brojGolova/brojOdigranihUtakmica})</span>
        </p>
        <p>
          Broj iskljucenja : <span>{igrac.brojIskljucenja}</span>
        </p>
        <p>
          Broj crvenih kartona: <span>{igrac.brojDisk}</span>
        </p>
        <p>
          Broj MVP: <span>{igrac.brojMVP}</span>
        </p>
      </div>
      <p style={{fontSize:"2em", marginBottom:"10px"}} className={styles.Klub}>Utakmice:</p>
      <div style={{overflowX:"auto"}}>
      <table className={styles.tabelaRaspored}>
        <thead>
          <tr>
            <td>Datum</td>
            <td>Domacin</td>
            <td>Rezultat</td>
            <td>Gost</td>
            <td>BrojGolova</td>
          </tr>
        </thead>
        <tbody>
          {utakmice &&
            utakmice.map((utakmica, index) => {
              const utakmicaDatum = new Date(utakmica.datum);
              return (
                <tr
                  key={index}
                  onClick={() => {
                    if (utakmica.rezultatPoluvreme) {
                      navigate(
                        `/pregledZapisnika/${idTakmicenja}/${utakmica.idKola}/${utakmica.idUtakmice}`
                      );
                    }
                  }}
                >
                  <td>
                    {utakmica.datum !== ""
                      ? `${utakmicaDatum.toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}`
                      : ""}
                  </td>
                  <td>{utakmica.domaciTim}</td>
                  <td>
                    {utakmica.rezultatPoluvreme
                      ? `${utakmica.rezultat}(${utakmica.rezultatPoluvreme})`
                      : ""}
                  </td>
                  <td>{utakmica.gostujuciTim}</td>
                  <td>{utakmica.brojGolova}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      </div>
    </div>
  );
};
export default InformacijeOIgracuPage;
