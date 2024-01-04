import EkipaPregledZapisnika from "../Components/PregledZapisnikaComponents/EkipaPregledZapisnika";
import PromenaRezultata from "../Components/PregledZapisnikaComponents/PromenaRezultata";
import OdabirPostava from "../Components/PregledZapisnikaComponents/OdabirPostava";
import styles from "../Components/PregledZapisnikaComponents/PregledZapisnika.module.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Timer from "../Components/PregledZapisnikaComponents/Timer";
import { firebaseGet, firebasePatch } from "../Helpers/Firebase";
const KreiranjeZapisnikaPage = ({ user }) => {
  const navigate = useNavigate();
  const { idTakmicenja, idKola, idUtakmice } = useParams();
  const [krajUtakmice, setKrajUtakmice] = useState(false);
  const [listaRezultata, setListaRezultata] = useState([]);
  const [listaRezultataPoluvreme, setListaRezultataPoluvreme] = useState([]);
  const [poluvreme, setPoluvreme] = useState(false);
  const [rezultatPoluvreme, setRezultatPoluvreme] = useState("0:0");
  const [daLiSuIzabranePostave, setDaLiSuIzabranePostave] = useState(false);
  const [domacin, setDomacin] = useState({});
  const [gost, setGost] = useState({});
  const [vreme, setVreme] = useState();
  const [domacinID, setDomacinID] = useState(null);
  const [gostID, setGostID] = useState(null);
  const [mvpIzabran, setMvpIzabran] = useState(false);
  useEffect(() => {
    if (user === null) {
      navigate("/notFound");
    }
    pronadjiIdEkipa();
    async function pronadjiIdEkipa() {
      const data = await firebaseGet(
        `/takmicenja/${idTakmicenja}/raspored/${idKola}/utakmice/${idUtakmice}`
      );
      if (!data || Object.keys(data).length === 0) {
        navigate("/notFound");
      } else {
        setDomacinID(data.idDomacin);
        setGostID(data.idGost);
      }
    }
  }, [idTakmicenja, idKola, idUtakmice, navigate, user]);
  useEffect(() => {
    return () => {
      localStorage.clear();
    };
  }, []);

  const rezultat =
    listaRezultata.length === 0 && listaRezultataPoluvreme.length === 0
      ? { domacin: 0, gost: 0 }
      : poluvreme && listaRezultataPoluvreme.length >= 1
      ? {
          domacin:
            listaRezultataPoluvreme[listaRezultataPoluvreme.length - 1].domacin,
          gost: listaRezultataPoluvreme[listaRezultataPoluvreme.length - 1]
            .gost,
        }
      : {
          domacin: listaRezultata[listaRezultata.length - 1].domacin,
          gost: listaRezultata[listaRezultata.length - 1].gost,
        };

  function dodajGol(incrementDomacin, incrementGost, igrac) {
    localStorage.setItem(
      "rezultat",`${rezultat.domacin + incrementDomacin}:${
        rezultat.gost + incrementGost
      }`
    );
    if (!poluvreme) {
      setListaRezultata((prevLista) => {
        if (prevLista.length > 0) {
          let gol = {
            domacin: prevLista[prevLista.length - 1].domacin + incrementDomacin,
            gost: prevLista[prevLista.length - 1].gost + incrementGost,
            minut: vreme.minut + 1,
            igrac: igrac,
          };
          return [...prevLista, gol];
        } else {
          let gol = {
            domacin: incrementDomacin,
            gost: incrementGost,
            minut: vreme.minut + 1,
            igrac: igrac,
          };
          return [...prevLista, gol];
        }
      });
    } else {
      setListaRezultataPoluvreme((prevLista) => {
        if (prevLista.length > 0) {
          let gol = {
            domacin: prevLista[prevLista.length - 1].domacin + incrementDomacin,
            gost: prevLista[prevLista.length - 1].gost + incrementGost,
            minut: vreme.minut + 1,
            igrac: igrac,
          };
          return [...prevLista, gol];
        } else {
          if (listaRezultata.length > 0) {
            let gol = {
              domacin:
                listaRezultata[listaRezultata.length - 1].domacin +
                incrementDomacin,
              gost:
                listaRezultata[listaRezultata.length - 1].gost + incrementGost,
              minut: vreme.minut + 1,
              igrac: igrac,
            };
            return [...prevLista, gol];
          } else {
            let gol = {
              domacin: incrementDomacin,
              gost: incrementGost,
              minut: vreme.minut + 1,
              igrac: igrac,
            };
            return [...prevLista, gol];
          }
        }
      });
    }
  }
  const handleTimeUpdate = (minutes, seconds) => {
    setVreme({ minut: minutes, sekund: seconds });
  };
  function postaviPoluvreme() {
    setPoluvreme(true);
    if (listaRezultata.length === 0) {
      setRezultatPoluvreme("0:0");
      localStorage.setItem("rezultatPoluvreme", "0:0");
    } else {
      setRezultatPoluvreme(
        listaRezultata[listaRezultata.length - 1].domacin +
          ":" +
          listaRezultata[listaRezultata.length - 1].gost
      );
      localStorage.setItem(
        "rezultatPoluvreme",
        listaRezultata[listaRezultata.length - 1].domacin +
          ":" +
          listaRezultata[listaRezultata.length - 1].gost
      );
    }
  }
  function postaviZapisnik() {
    const domacinPostignutiGolovi =
      listaRezultataPoluvreme[listaRezultataPoluvreme.length - 1].domacin;
    const gostPostignutiGolovi =
      listaRezultataPoluvreme[listaRezultataPoluvreme.length - 1].gost;
    let domacinBodovi, gostBodovi, domacinIshod, gostIshod;
    if (domacinPostignutiGolovi > gostPostignutiGolovi) {
      domacinIshod = { pobeda: domacin.pobeda + 1 };
      gostIshod = { poraza: gost.poraza + 1 };
      domacinBodovi = 2;
      gostBodovi = 0;
    } else if (domacinPostignutiGolovi < gostPostignutiGolovi) {
      domacinIshod = { poraza: domacin.poraza + 1 };
      gostIshod = { pobeda: gost.pobeda + 1 };
      gostBodovi = 2;
      domacinBodovi = 0;
    } else {
      domacinIshod = { neresenih: domacin.neresenih + 1 };
      gostIshod = { neresenih: gost.neresenih + 1 };
      domacinBodovi = 1;
      gostBodovi = 1;
    }
    firebasePatch(
      {
        rezultat: `${domacinPostignutiGolovi}:${gostPostignutiGolovi}`,
        rezultatPoluvreme: rezultatPoluvreme,
        postavaDomacin: domacin.postava,
        postavaGost: gost.postava,
        listaRezultata: listaRezultata,
        listaRezultataPoluvreme: listaRezultataPoluvreme,
      },
      `/takmicenja/${idTakmicenja}/raspored/${idKola}/utakmice/${idUtakmice}`
    );
    const domacinPatch = {
      bodovi: domacin.bodovi + domacinBodovi,
      golRazlika:
        domacin.golRazlika + (domacinPostignutiGolovi - gostPostignutiGolovi),
      ...domacinIshod,
      postignutiGolovi: domacin.postignutiGolovi + domacinPostignutiGolovi,
      primljeniGolovi: domacin.primljeniGolovi + gostPostignutiGolovi,
      ukupnoOdigranih: domacin.ukupnoOdigranih + 1,
      listaIgraca: domacin.listaIgraca.map((igrac) => {
        const indexUPostavi = domacin.postava.findIndex(
          (igracPostava) => igracPostava.imeIgraca === igrac.imeIgraca
        );

        if (indexUPostavi === -1) {
          return igrac;
        } else {
          return {
            ...igrac,
            brojDisk:
              igrac.brojDisk +
              (domacin.postava[indexUPostavi].disk !== "" ? 1 : 0),
            brojGolova:
              igrac.brojGolova + domacin.postava[indexUPostavi].brojGolova,
            brojMVP:
              igrac.brojMVP + (domacin.postava[indexUPostavi].MVP ? 1 : 0),
            brojOpomena:
              igrac.brojOpomena +
              (domacin.postava[indexUPostavi].opomena !== "" ? 1 : 0),
            brojIskljucenja: domacin.postava[indexUPostavi].iskljucenje.filter(
              (value) => value !== ""
            ).length,
          };
        }
      }),
    };
    const gostPatch = {
      bodovi: gost.bodovi + gostBodovi,
      golRazlika:
        gost.golRazlika + (gostPostignutiGolovi - domacinPostignutiGolovi),
      ...gostIshod,
      postignutiGolovi: gost.postignutiGolovi + gostPostignutiGolovi,
      primljeniGolovi: gost.primljeniGolovi + domacinPostignutiGolovi,
      ukupnoOdigranih: gost.ukupnoOdigranih + 1,
      listaIgraca: gost.listaIgraca.map((igrac) => {
        const indexUPostavi = gost.postava.findIndex(
          (igracPostava) => igracPostava.imeIgraca === igrac.imeIgraca
        );

        if (indexUPostavi === -1) {
          return igrac;
        } else {
          return {
            ...igrac,
            brojDisk:
              igrac.brojDisk +
              (gost.postava[indexUPostavi].disk !== "" ? 1 : 0),
            brojGolova:
              igrac.brojGolova + gost.postava[indexUPostavi].brojGolova,
            brojMVP: igrac.brojMVP + (gost.postava[indexUPostavi].MVP ? 1 : 0),
            brojOpomena:
              igrac.brojOpomena +
              (gost.postava[indexUPostavi].opomena !== "" ? 1 : 0),
            brojIskljucenja: gost.postava[indexUPostavi].iskljucenje.filter(
              (value) => value !== ""
            ).length,
          };
        }
      }),
    };
    firebasePatch(
      domacinPatch,
      `/takmicenja/${idTakmicenja}/listaEkipa/${domacinID}`
    );
    firebasePatch(
      gostPatch,
      `/takmicenja/${idTakmicenja}/listaEkipa/${gostID}`
    );
    navigate(`/raspored/${idTakmicenja}`);
  }
  return (
    <div>
      {!daLiSuIzabranePostave ? (
        <div>
          <div className={styles.odabirPostavaWrapper}>
            <OdabirPostava setEkipa={setDomacin} ekipaID={domacinID} />
            <OdabirPostava setEkipa={setGost} ekipaID={gostID} />
          </div>
          <button
            className={styles.pokreniZapisnikButton}
            onClick={() => {
              window.open("/semafor", "", "_blank");
              setDaLiSuIzabranePostave(true);
              setTimeout(() => {
                localStorage.setItem("nazivDomacin", domacin.nazivEkipe);
                localStorage.setItem("nazivGost", gost.nazivEkipe);
                localStorage.setItem("grbDomacin", domacin.grb);
                localStorage.setItem("grbGost", gost.grb);
              }, 4000);
            }}
          >
            Pokreni zapisnik
          </button>
        </div>
      ) : (
        <div>
          <Timer
            krajUtakmice={krajUtakmice}
            setKrajUtakmice={setKrajUtakmice}
            postaviPoluvreme={postaviPoluvreme}
            onTimeUpdate={handleTimeUpdate}
          />
          <div className={styles.rezultatWrapper}>
            <div className={styles.imeGrb}>
              <img alt="grb" src={domacin.grb} />
              <p>{domacin.nazivEkipe}</p>
            </div>

            <div className={styles.rezultat}>
              <p>
                {rezultat.domacin}:{rezultat.gost}
              </p>
              <p>{poluvreme && `(${rezultatPoluvreme})`}</p>
            </div>
            <div className={styles.imeGrb}>
              <p>{gost.nazivEkipe}</p>
              <img alt="grb" src={gost.grb} />
            </div>
          </div>
          <div className={styles.zapisnikWrapper}>
            <div>
              <EkipaPregledZapisnika
                domacin={true}
                krajUtakmice={krajUtakmice}
                vreme={vreme}
                setEkipa={setDomacin}
                kreiranje={true}
                ekipa={domacin}
                mvpIzabran={mvpIzabran}
                setMvpIzabran={setMvpIzabran}
                dodajGolRoditelj={(igrac) => {
                  dodajGol(1, 0, igrac);
                }}
              />
              <EkipaPregledZapisnika
                domacin={false}
                krajUtakmice={krajUtakmice}
                vreme={vreme}
                setEkipa={setGost}
                kreiranje={true}
                ekipa={gost}
                mvpIzabran={mvpIzabran}
                setMvpIzabran={setMvpIzabran}
                dodajGolRoditelj={(igrac) => {
                  dodajGol(0, 1, igrac);
                }}
              />
            </div>
            <div className={styles.promenaRezultataWrapper}>
              <PromenaRezultata
                poluvreme="prvo"
                listaRezultata={listaRezultata}
              />
              <PromenaRezultata
                poluvreme="drugo"
                listaRezultata={listaRezultataPoluvreme}
              />
            </div>
          </div>
          {krajUtakmice && (
            <button
              className={styles.postaviZapisnikButton}
              onClick={postaviZapisnik}
            >
              Postavi zapisnik
            </button>
          )}
        </div>
      )}
    </div>
  );
};
export default KreiranjeZapisnikaPage;
