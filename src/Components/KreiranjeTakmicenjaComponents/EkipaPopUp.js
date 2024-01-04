import { useState, useEffect } from "react";
import styles from "./KreiranjeTakmicenja.module.css";
import PostojecePostavePopUp from "./PostojecePostavePopUp";
import IzborGrba from "./IzborGrba";

const EkipaPopUp = (props) => {
  const [listaIgraca, setListaIgraca] = useState(props.ekipaPodaci.listaIgraca);
  const [grb, setGrb] = useState(props.ekipaPodaci.grb);
  const [open, setOpen] = useState(false);
  const [nazivEkipe, setNazivEkipe] = useState(props.ekipaPodaci.nazivEkipe);
  const [postojecePostaveVidljivost, setPostojecePostaveVidljivost] =
    useState(false);

  //Kod brisanja opet se postavljaju vrednosti
  useEffect(() => {
    setListaIgraca(props.ekipaPodaci.listaIgraca);
    setNazivEkipe(props.ekipaPodaci.nazivEkipe);
    setGrb(props.ekipaPodaci.grb);
  }, [props]);

  function dodajIgraca(index, event) {
    setListaIgraca((prevLista) => {
      let novaLista = [...prevLista];
      novaLista[index][event.target.name] = event.target.value;
      return novaLista;
    });
    if (
      listaIgraca[listaIgraca.length - 1].brojLicence !== "" &&
      listaIgraca[listaIgraca.length - 1].imeIgraca !== ""
    ) {
      let noviIgrac = { brojLicence: "", imeIgraca: "" };
      setListaIgraca((prevLista) => {
        return [...prevLista, noviIgrac];
      });
    }
  }
  const obrisiInput = (index) => {
    let novaLista = [...listaIgraca];
    novaLista.splice(index, 1);
    setListaIgraca(novaLista);
  };

  function sacuvajEkipu() {
    if(listaIgraca.length > 1 && nazivEkipe!=="" && grb!==null){
      props.setEkipa({
        nazivEkipe: nazivEkipe,
        listaIgraca: listaIgraca,
        grb: grb,
      });
      setOpen(false);
    }
  }
  function ponistiEkipu(){
    setListaIgraca([{ brojLicence: "", imeIgraca: "" }]);
    setNazivEkipe("");
    setGrb(null);
    setOpen(false);
  }
  if (open) {
    return (
      <div className={styles.EkipaPopUp}>
        <div className={styles.NazivSlika}>
          <input
            className={styles.NazivEkipe}
            placeholder="Naziv ekipe"
            value={nazivEkipe}
            onChange={(event) => {
              setNazivEkipe(event.target.value);
            }}
          />
          <IzborGrba grb={grb} setGrb={setGrb} />
        </div>

        <button
          className={styles.izaberiPostojeceButton}
          onClick={() => {
            setPostojecePostaveVidljivost(true);
          }}
        >
          Izaberi postojece
        </button>
        {postojecePostaveVidljivost && (
          <PostojecePostavePopUp
            filter = {nazivEkipe}
            setPostojecePostaveVidljivost={setPostojecePostaveVidljivost}
            setListaIgraca={setListaIgraca}
          />
        )}
        <div className={styles.ListaIgraca}>
          {listaIgraca.map((igrac, index) => {
            return (
              <div key={index} className={styles.Igrac}>
                <input
                  value={igrac.brojLicence}
                  name="brojLicence"
                  placeholder="Broj licence"
                  onChange={(e) => {
                    dodajIgraca(index, e);
                  }}
                />
                <div style={{display:"flex", alignItems:"center"}}>
                <input
                  value={igrac.imeIgraca}
                  name="imeIgraca"
                  placeholder="Ime i prezime"
                  onChange={(e) => {
                    dodajIgraca(index, e);
                  }}
                />

                {listaIgraca.length !== index + 1 && (
                  <button
                    onClick={() => {
                      obrisiInput(index);
                    }}
                  >
                    X
                  </button>
                )}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{display:"flex", width:"100%"}}>
        {props.ponistiVisible && <button style={{ background: "rgb(99, 2, 2)" }} className={styles.SacuvajButton} onClick={ponistiEkipu}>Poništi</button>}
        <button style={{ background: "#06722f" }} className={styles.SacuvajButton} onClick={sacuvajEkipu}>Sacuvaj</button>
        </div>
        
      </div>
    );
  } else {
    return (
      <div className={styles.ekipaMini}
        onClick={(e) => {
          if(e.target===e.currentTarget){
            setOpen(true);
          }
        }}
      >
        {props.children}
        {nazivEkipe === "" ? "Dodaj novu ekipu" : nazivEkipe}
        
      </div>
    );
  }
};
export default EkipaPopUp;
