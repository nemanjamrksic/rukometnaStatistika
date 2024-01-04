import { firebaseGet } from "../../Helpers/Firebase";
import styles from "./KreiranjeTakmicenja.module.css";
import { useState, useEffect } from "react";

const PostojecePostavePopUp = (props) => {
  const [takmicenja, setTakmicenja] = useState([]);
  const [izabraniIndex, setIzabraniIndex] = useState(0);
  useEffect(() => {
    transformData();
    async function transformData() {
      const data = await firebaseGet(`/takmicenja`);
      let ekipe = [];
      for (const idTakmicenja in data) {
        const listaEkipa = data[idTakmicenja].listaEkipa.filter((ekipa) =>
          ekipa.nazivEkipe.toLowerCase().includes(props.filter.toLowerCase())
        );
        if (listaEkipa.length > 0) {
          for (const ekipa of listaEkipa) {
            ekipe.push({
              sezonaTakmicenja: data[idTakmicenja].sezonaTakmicenja,
              nazivTakmicenja: data[idTakmicenja].nazivTakmicenja,
              nazivEkipe: ekipa.nazivEkipe,
              listaIgraca: ekipa.listaIgraca.map((igrac) => {
                return {
                  imeIgraca: igrac.imeIgraca,
                  brojLicence: igrac.brojLicence,
                };
              }),
            });
          }
        }
      }
      setTakmicenja(ekipe);
    }
  }, [props.filter]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          props.setPostojecePostaveVidljivost(false);
        }
      }}
      className={styles.pozadinaPopUp}
    >
      <div className={styles.postojecePostavePopUp}>
        {takmicenja.length > 0 ? (
          <>
            <select
              className={styles.timDDL}
              onChange={(e) => {
                setIzabraniIndex(e.target.selectedIndex);
              }}
              style={{ width: "auto" }}
            >
              {takmicenja.map((takmicenje, index) => {
                return (
                  <option key={index}>
                    {takmicenje.nazivEkipe} {takmicenje.nazivTakmicenja}{" "}
                    {takmicenje.sezonaTakmicenja}
                  </option>
                );
              })}
            </select>
            <div className={styles.postojeciIgraci}>
              {takmicenja[izabraniIndex].listaIgraca.map((igrac, index) => {
                return <p key={index}>{igrac.imeIgraca}</p>;
              })}
            </div>
            <div style={{display:"flex"}}>
              <button
                className={styles.dugmePostojecePopUp}
                style={{ background: "rgb(99, 2, 2)" }}
                onClick={() => {
                  props.setPostojecePostaveVidljivost(false);
                }}
              >
                Ponisti
              </button>
              <button
                className={styles.dugmePostojecePopUp}
                style={{ background: "#06722f" }}
                onClick={() => {
                  props.setListaIgraca([
                    ...takmicenja[izabraniIndex].listaIgraca,
                    { brojLicence: "", imeIgraca: "" },
                  ]);
                  props.setPostojecePostaveVidljivost(false);
                }}
              >
                Sacuvaj
              </button>
            </div>
          </>
        ) : (
          <strong>Ne postoje ekipe koje zadovoljavaju kriterijum</strong>
        )}
      </div>
    </div>
  );
};
export default PostojecePostavePopUp;
