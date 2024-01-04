import EkipaPopUp from "../Components/KreiranjeTakmicenjaComponents/EkipaPopUp";
import { useState, useRef } from "react";
import { generisiRasporedTimova } from "../Helpers/KreiranjeRasporeda";
import styles from "../Components/KreiranjeTakmicenjaComponents/KreiranjeTakmicenja.module.css";
import { useNavigate } from "react-router-dom";

const KreiranjeTakmicenjaPage = () => {
  const navigate = useNavigate();
  const [listaEkipa, setListaEkipa] = useState([
    {
      nazivEkipe: "",
      grb: null,
      listaIgraca: [{ brojLicence: "", imeIgraca: "" }],
    },
  ]);
  const nazivTakmicenjaRef = useRef();
  function izmeniEkipu(ekipaPodaci, index) {
    setListaEkipa((prevLista) => {
      let novaLista = [...prevLista];
      novaLista[index].nazivEkipe = ekipaPodaci.nazivEkipe;
      novaLista[index].grb = ekipaPodaci.grb;
      novaLista[index].listaIgraca = ekipaPodaci.listaIgraca;
      return novaLista;
    });
    if (listaEkipa[listaEkipa.length - 1].nazivEkipe !== "") {
      const novaEkipa = {
        nazivEkipe: "",
        listaIgraca: [{ brojLicence: "", imeIgraca: "" }],
      };
      setListaEkipa((prevLista) => {
        return [...prevLista, novaEkipa];
      });
    }
  }
  const obrisiEkipu = (index) => {
    let novaLista = [...listaEkipa];
    novaLista.splice(index, 1);
    setListaEkipa(novaLista);
  };
  function kreirajTakmicenje() {
    let novaLista = [];
    for (let i = 0; i < listaEkipa.length - 1; i++) {
      let novaEkipa = {};
      novaEkipa.nazivEkipe = listaEkipa[i].nazivEkipe;
      novaEkipa.grb = listaEkipa[i].grb;
      novaEkipa.listaIgraca = [];
      for (let j = 0; j < listaEkipa[i].listaIgraca.length - 1; j++) {
        novaEkipa.listaIgraca.push(listaEkipa[i].listaIgraca[j]);
      }
      novaLista.push(novaEkipa);
    }
    generisiRasporedTimova(novaLista, nazivTakmicenjaRef.current.value);
    navigate("/notFound")
  }

  return (
    <div className={styles.pozadina}>
      <input className={styles.nazivTakmicenja} ref={nazivTakmicenjaRef} placeholder="Naziv takmicenja" />
      <div style={{width:"100%"}}>
        {listaEkipa.map((ekipa, index) => {
          return (
            <div key={index} style={{display:"flex", justifyContent:"center"}}>
              <EkipaPopUp
                ekipaPodaci={ekipa}
                setEkipa={(ekipaPodaci) => {
                  izmeniEkipu(ekipaPodaci, index);
                }}
                ponistiVisible={listaEkipa.length === index + 1}
              >
              {listaEkipa.length !== index + 1 && (
                <button style={{color:"var(--tekst)", position:"absolute", top:"-30px", right:"-50px", fontWeight:"600"}} className={styles.invisibleButton}
                  onClick={() => {
                    obrisiEkipu(index);
                  }}
                >
                  X
                </button>
              )}
              </EkipaPopUp>
            </div>
          );
        })}
      </div>

      <button className={styles.KreirajTakmicenjeButton} onClick={kreirajTakmicenje}>Kreiraj takmicenje</button>
    </div>
  );
};
export default KreiranjeTakmicenjaPage;
