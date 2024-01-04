import { useEffect, useState } from "react";
import styles from "../Components/SemaforComponents/Semafor.module.css";

const SemaforPage = () => {
  const [vreme, setVreme] = useState({ minuti: 0, sekunde: 0 });
  const [listaIskljucenjaDomacin, setListaIskljucenjaDomacin] = useState([]);
  const [listaIskljucenjaGost, setListaIskljucenjaGost] = useState([]);
  const [rezultat, setRezultat] = useState("0:0");
  const [rezultatPoluvreme, setRezultatPoluvreme] = useState(null);
  const [nazivDomacin, setNazivDomacin] = useState("loading");
  const [nazivGost, setNazivGost] = useState("loading");
  const [grbDomacin, setGrbDomacin] = useState();
  const [grbGost, setGrbGost] = useState();
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "vreme") {
        setVreme(JSON.parse(event.newValue));
      }
      if (event.key === "listaIskljucenjaDomacin") {
        if (event.newValue) {
          setListaIskljucenjaDomacin(JSON.parse(event.newValue));
        }
      }
      if (event.key === "listaIskljucenjaGost") {
        if (event.newValue) {
          setListaIskljucenjaGost(JSON.parse(event.newValue));
        }
      }
      if (event.key === "rezultat") {
        setRezultat(event.newValue);
      }
      if (event.key === "rezultatPoluvreme") {
        setRezultatPoluvreme(event.newValue);
      }
      if (event.key === "nazivDomacin") {
        setNazivDomacin(event.newValue);
      }
      if (event.key === "nazivGost") {
        setNazivGost(event.newValue);
      }
      if (event.key === "grbDomacin") {
        setGrbDomacin(event.newValue);
      }
      if (event.key === "grbGost") {
        setGrbGost(event.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  function izracunajIskljucenje(igrac, nazivListe, setListaIskljucenja) {
    let iskljucenje =
      igrac.minut * 60 +
      igrac.sekund * 1 -
      vreme.minuti * 60 -
      vreme.sekunde * 1;
    if (iskljucenje <= 0) {
      setListaIskljucenja((prevLista) => {
        const filtrirano = prevLista.filter(
          (item) => item.brojDresa !== igrac.brojDresa
        );
        localStorage.setItem(nazivListe, JSON.stringify(filtrirano));
        return filtrirano;
      });
    }
    
    
    return `${String(Math.floor(iskljucenje / 60)).padStart(2, "0")}:${String(iskljucenje % 60).padStart(2, "0")}`;
  }
  return (
    <div className={styles.semafor}>
      <div className={styles.vremeWrapper}>
        <p className={styles.vreme}>
          {String(vreme.minuti).padStart(2, "0")}:
          {String(vreme.sekunde).padStart(2, "0")}
        </p>
      </div>

      <div className={styles.rezultatWrapper}>
        <div className={styles.ekipaWrapper}>
          <img src={grbDomacin} alt="grb domacin" />
          <p>{nazivDomacin}</p>
        </div>
        <div className={styles.rezultat}>
          <p>{rezultat}</p>
          {rezultatPoluvreme && <p>({rezultatPoluvreme})</p>}
        </div>
        <div className={styles.ekipaWrapper}>
          <img src={grbGost} alt="grb gost" />
          <p>{nazivGost}</p>
        </div>
      </div>
      <div className={styles.iskljucenjaWrapper}>
        <div className={styles.listaIskljucenja}>
        <table className={styles.tabelaIskljucenja}>
            <thead>
              <tr>
                <td>Broj dresa</td>
                <td>Ime igraca</td>
                <td>Iskljucenje</td>
              </tr>
            </thead>
            <tbody>
            {listaIskljucenjaDomacin.length > 0 &&
              listaIskljucenjaDomacin.map((igrac, index) => {
                return (
                  <tr key={index}>
                    <td>{igrac.brojDresa}</td>
                    <td>{igrac.imeIgraca}</td>
                    <td>{izracunajIskljucenje(
                      igrac,
                      "listaIskljucenjaDomacin",
                      setListaIskljucenjaDomacin
                    )}</td>
                  </tr>
                );
              })}
              </tbody>
          </table>
        </div>
        <div className={styles.listaIskljucenja}>
          <table className={styles.tabelaIskljucenja}>
            <thead>
              <tr>
                <td>Broj dresa</td>
                <td>Ime igraca</td>
                <td>Iskljucenje</td>
              </tr>
            </thead>
            <tbody>
            {listaIskljucenjaGost.length > 0 &&
              listaIskljucenjaGost.map((igrac, index) => {
                return (
                  <tr key={index}>
                    <td>{igrac.brojDresa}</td>
                    <td>{igrac.imeIgraca}</td>
                    <td>{izracunajIskljucenje(
                      igrac,
                      "listaIskljucenjaGost",
                      setListaIskljucenjaGost
                    )}</td>
                  </tr>
                );
              })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default SemaforPage;
