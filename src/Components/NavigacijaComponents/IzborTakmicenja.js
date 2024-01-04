import { useEffect, useState } from "react";
import styles from "./Navigacija.module.css";
import { firebaseGet } from "../../Helpers/Firebase";
import { useNavigate } from "react-router-dom";

const IzborTakmicenja = ({ setIdTakmicenja, setOpen, setNazivTakmicenja }) => {
  const navigate = useNavigate();
  const [takmicenja, setTakmicenja] = useState([]);

  
  useEffect(() => {
    transformTakmicenja();
    async function transformTakmicenja() {
      const data = await firebaseGet("/takmicenja");
      let listaTakmicenja = [];
      for (const key in data) {
        listaTakmicenja.push({
          idTakmicenja: key,
          nazivTakmicenja: data[key].nazivTakmicenja,
          sezonaTakmicenja: data[key].sezonaTakmicenja,
        });
      }
      setTakmicenja(listaTakmicenja);
    }
  }, []);
  return (
    <div
      className={styles.pozadinaPopUp}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setOpen(false);
        }
      }}
    >
      <div className={styles.izborTakmicenjaPopUp}>
        {takmicenja.length > 0 &&
          takmicenja.map((takmicenje, index) => {
            return (
              <button
                key={index}
                onClick={() => {
                  setIdTakmicenja(takmicenje.idTakmicenja);
                  setNazivTakmicenja(takmicenje.nazivTakmicenja + " " + takmicenje.sezonaTakmicenja)
                  setOpen(false);
                  navigate(`/raspored/${takmicenje.idTakmicenja}`);
                }}
              >
                {takmicenje.nazivTakmicenja} {takmicenje.sezonaTakmicenja}
              </button>
            );
          })}
      </div>
    </div>
  );
};
export default IzborTakmicenja;
