import { useState } from "react";
import styles from "./PregledZapisnika.module.css";

const EkipaPregledZapisnika = ({
  setEkipa,
  ekipa,
  dodajGolRoditelj,
  kreiranje,
  vreme,
  krajUtakmice,
  domacin,
  mvpIzabran,
  setMvpIzabran
}) => {
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  
  const handleMouseOver = (imeIgraca) => {
    setHoveredPlayer(imeIgraca);
  };

  const handleMouseOut = () => {
    setHoveredPlayer(null);
  };

  function dodajGol(index) {
    setEkipa((prevEkipa) => {
      return {
        ...prevEkipa,
        postava: prevEkipa.postava.map((igrac, i) => {
          if (i === index) {
            return { ...igrac, brojGolova: igrac.brojGolova + 1 };
          } else {
            return igrac;
          }
        }),
      };
    });
    dodajGolRoditelj(ekipa.postava[index].brojDresa);
  }

  function dodajOpomenu(index) {
    setEkipa((prevEkipa) => {
      return {
        ...prevEkipa,
        postava: prevEkipa.postava.map((igrac, i) => {
          if (i === index) {
            return { ...igrac, opomena: vreme.minut + 1 };
          } else {
            return igrac;
          }
        }),
      };
    });
  }
  function dodajDisk(index) {
    dodajIskljucenjeSemafor(ekipa.postava[index], vreme.minut, vreme.sekund);
    setEkipa((prevEkipa) => {
      return {
        ...prevEkipa,
        postava: prevEkipa.postava.map((igrac, i) => {
          if (i === index) {
            return { ...igrac, disk: vreme.minut + 1 };
          } else {
            return igrac;
          }
        }),
      };
    });
  }
  function dodajIskljucenje(index) {
    dodajIskljucenjeSemafor(ekipa.postava[index], vreme.minut, vreme.sekund);
    setEkipa((prevEkipa) => {
      return {
        ...prevEkipa,
        postava: prevEkipa.postava.map((igrac, i) => {
          if (i === index) {
            const iskljucenje = [...igrac.iskljucenje];
            if (iskljucenje[0] === "") {
              iskljucenje[0] = `${vreme.minut}:${vreme.sekund}`;
            } else if (iskljucenje[1] === "") {
              iskljucenje[1] = `${vreme.minut}:${vreme.sekund}`;
            } else {
              iskljucenje[2] = `${vreme.minut}:${vreme.sekund}`;
            }

            return { ...igrac, iskljucenje };
          } else {
            return igrac;
          }
        }),
      };
    });
  }
  function dodajIskljucenjeSemafor(igrac, minut, sekund) {
    let listaIskljucenja = [];
    const nazivListe = domacin
      ? "listaIskljucenjaDomacin"
      : "listaIskljucenjaGost";
    if (localStorage.getItem(nazivListe)) {
      listaIskljucenja = [...JSON.parse(localStorage.getItem(nazivListe))];
    }
    const indexPostojecegIgraca = listaIskljucenja.findIndex(
      (obj) => obj.brojDresa === igrac.brojDresa
    );
    if (indexPostojecegIgraca !== -1) {
      listaIskljucenja[indexPostojecegIgraca].minut += 2;
    } else {
      listaIskljucenja.push({
        brojDresa: igrac.brojDresa,
        imeIgraca: igrac.imeIgraca,
        minut: minut + 2,
        sekund: sekund,
      });
    }
    localStorage.setItem(nazivListe, JSON.stringify(listaIskljucenja));
  }
  function setMVP(index) {
    if (krajUtakmice && !mvpIzabran && kreiranje) {
      setEkipa((prevEkipa) => {
        return {
          ...prevEkipa,
          postava: prevEkipa.postava.map((igrac, i) => {
            if (i === index) {
              return { ...igrac, MVP: true };
            } else {
              return igrac;
            }
          }),
        };
      });
      setMvpIzabran(true);
    }
  }
  return (
    <div style={{ padding: "5px" }}>
      <h2
        style={{
          margin: "10px",
          color: "white",
          textShadow:
            "-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black",
        }}
      >
        {ekipa.nazivEkipe}
      </h2>
      <table className={styles.tabelaStatistika}>
        <thead>
          <tr>
            <td>Broj licence</td>
            <td>Igrac</td>
            <td>Broj dresa</td>
            <td>Broj golova</td>
            <td>Opomena</td>
            <td>2'</td>
            <td>2'</td>
            <td>2'</td>
            <td>disk</td>
          </tr>
        </thead>
        <tbody>
          {ekipa.postava &&
            ekipa.postava.map((igrac, index) => {
              return (
                <tr
                  className={`${igrac.MVP ? styles.MVP : ""} ${
                    krajUtakmice && !mvpIzabran ? styles.izborMVP : ""
                  }`}
                  key={index}
                  onClick={() => {
                    setMVP(index);
                  }}
                >
                  <td>{igrac.brojLicence}</td>
                  <td
                    onMouseOver={() => handleMouseOver(igrac.imeIgraca)}
                    onMouseOut={handleMouseOut}
                  >
                    {hoveredPlayer === igrac.imeIgraca &&
                    kreiranje &&
                    !krajUtakmice &&
                    igrac.disk === "" &&
                    igrac.iskljucenje[2] === "" ? (
                      <div style={{ display: "flex", alignContent: "center" }}>
                        <button
                          className={styles.buttonGol}
                          onClick={() => {
                            dodajGol(index);
                          }}
                        ></button>
                        {igrac.opomena === "" && (
                          <button
                            className={styles.buttonOpomena}
                            onClick={() => {
                              dodajOpomenu(index);
                            }}
                          ></button>
                        )}
                        <button
                          className={styles.buttonIskljucenje}
                          onClick={() => {
                            dodajIskljucenje(index);
                          }}
                        >
                          2'
                        </button>
                        <button
                          className={styles.buttonDisk}
                          onClick={() => {
                            dodajDisk(index);
                          }}
                        ></button>
                      </div>
                    ) : (
                      igrac.imeIgraca
                    )}
                  </td>
                  <td>{igrac.brojDresa}</td>
                  <td>{igrac.brojGolova}</td>
                  <td>{igrac.opomena}</td>
                  <td>{igrac.iskljucenje[0]}</td>
                  <td>{igrac.iskljucenje[1]}</td>
                  <td>{igrac.iskljucenje[2]}</td>
                  <td>{igrac.disk}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
export default EkipaPregledZapisnika;
