import { useRef, useState } from "react";
import React from "react";
import styles from "../Components/KreiranjeVestiComponents/KreiranjeVesti.module.css";
import KreiranjeVestiSadrzaj from "../Components/KreiranjeVestiComponents/KreiranjeVestiSadrzaj";
import { firebaseUpload, uploadFile } from "../Helpers/Firebase";

import PocetnaSlikaPopUp from "../Components/KreiranjeVestiComponents/PocetnaSlikaPopUp";
import { useNavigate } from "react-router-dom";

const KreiranjeVestiPage = () => {
  let navigate = useNavigate();
  const [pocetnaSlika, setPocetnaSlika] = useState(null);
  const [sadrzaj, setSadrzaj] = useState([]);
  const naslov = useRef();
  const kratakOpis = useRef();
  const slikaInput = useRef();
  const errorMessage = useRef();
  async function Sacuvaj() {
    if (
      sadrzaj.some(
        (element) => element.tip === "paragraf" && element.vrednost === ""
      ) ||
      naslov.current.value === "" ||
      kratakOpis.currentValue === "" ||
      pocetnaSlika === null
    ) {
      errorMessage.current.style.display = "block";
    } else {
      const sadrzajPromises = sadrzaj.map(async (element) => {
        if (element.tip === "paragraf") {
          return element;
        }
        const data = await uploadFile(element.vrednost, "slikeVesti");
        return { tip: "slika", vrednost: data };
      });

      const sadrzajIzmenjeno = await Promise.all(sadrzajPromises);

      //convert u image file
      const blob = await (await fetch(pocetnaSlika)).blob();
      const file = new File([blob], "pocetnaSlika.png", { type: "image/png" });
      //

      const pocetnaSlikaIzmenjeno = await uploadFile(file, "slikeVesti");
      const vest = {
        pocetnaSlika: pocetnaSlikaIzmenjeno,
        naslov: naslov.current.value,
        kratakOpis: kratakOpis.current.value,
        datum: new Date(),
        sadrzaj: sadrzajIzmenjeno,
        favourites: false,
      };

      firebaseUpload(vest, "vesti");
      navigate("/notFound");
    }
  }
  function dodajParagraf() {
    setSadrzaj([...sadrzaj, { tip: "paragraf", vrednost: "" }]);
  }

  return (
    <div className={styles.pozadina}>
      <PocetnaSlikaPopUp
        pocetnaSlika={pocetnaSlika}
        setPocetnaSlika={setPocetnaSlika}
      />
      <input className={styles.naslov} placeholder="Naslov" ref={naslov} />

      <textarea
        placeholder="Kratak opis"
        ref={kratakOpis}
        className={styles.kratakOpis}
      />

      <KreiranjeVestiSadrzaj
        sadrzaj={sadrzaj}
        setSadrzaj={setSadrzaj}
        slikaInput={slikaInput}
      />
      <p ref={errorMessage} style={{ color: "red", display: "none" }}>
        Niste popunili sva polja
      </p>
      <div className={styles.komande}>
        <button
          onClick={() => {
            slikaInput.current.click();
          }}
        >
          Dodaj sliku
        </button>
        <button onClick={dodajParagraf}>Dodaj paragraf</button>
        <button onClick={Sacuvaj}>Sacuvaj</button>
      </div>
    </div>
  );
};
export default KreiranjeVestiPage;
