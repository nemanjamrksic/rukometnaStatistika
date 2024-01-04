import styles from "./KreiranjeVesti.module.css";
import React from "react";
import { useState } from "react";

const KreiranjeVestiSadrzaj = ({ sadrzaj, setSadrzaj, slikaInput }) => {
  let indexPromena;
  const slikaPromena = React.createRef();
  const [typingTimeout, setTypingTimeout] = useState(null);
  function dodajSliku(e) {
    if (e.target.files[0]) {
      setSadrzaj([...sadrzaj, { tip: "slika", vrednost: e.target.files[0] }]);
    }
    slikaInput.current.value = null;
  }
  function izmeniSliku(e) {
    if (e.target.files[0]) {
      let noviSadrzaj = [...sadrzaj];
      noviSadrzaj[indexPromena] = { tip: "slika", vrednost: e.target.files[0] };
      setSadrzaj(noviSadrzaj);
    }
    slikaPromena.current.value = null;
  }
  function postaviTekst(index, e) {
    clearTimeout(typingTimeout);

    const timeoutId = setTimeout(() => {
      if (e.target.innerHTML) {
        let noviSadrzaj = [...sadrzaj];
        noviSadrzaj[index].vrednost = e.target.innerHTML;
        setSadrzaj(noviSadrzaj);
      }
    }, 1000);
    setTypingTimeout(timeoutId);
  }

  function obrisiElement(index) {
    const updatedSadrzaj = [...sadrzaj];
    updatedSadrzaj.splice(index, 1);
    setSadrzaj(updatedSadrzaj);
  }
  function premestiElement(fromIndex, toIndex) {
    setSadrzaj((prevSadrzaj) => {
      const noviSadrzaj = [...prevSadrzaj];
      var element = noviSadrzaj.splice(fromIndex, 1)[0];
      noviSadrzaj.splice(toIndex, 0, element);
      return noviSadrzaj;
    });
  }
  return (
    <div className={styles.sadrzaj}>
      <input
        ref={slikaInput}
        style={{ display: "none" }}
        type="file"
        onChange={dodajSliku}
        accept=".png, .jpg, .jpeg, .gif"
      />
      <input
        ref={slikaPromena}
        style={{ display: "none" }}
        type="file"
        accept=".png, .jpg, .jpeg, .gif"
        onChange={izmeniSliku}
      />
      {sadrzaj.map((element, index) => {
        return (
          <div key={index} className={styles.stavkaWrapper}>
            {element.tip === "paragraf" ? (
              <p
                contentEditable="true"
                onInput={(e) => {
                  postaviTekst(index, e);
                }}
                className={styles.paragraf}
                dangerouslySetInnerHTML={{ __html: element.vrednost }}
              ></p>
            ) : (
              <img
                className={styles.slika}
                src={URL.createObjectURL(element.vrednost)}
                onClick={() => {
                  slikaPromena.current.click();
                  indexPromena = index;
                }}
                alt={`Uploaded ${index + 1}`}
              />
            )}

            <div className={styles.dugmiciOrganizacija}>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--tekst)",
                }}
                onClick={() => {
                  obrisiElement(index);
                }}
              >
                X
              </button>
              {index > 0 && (
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--tekst)",
                  }}
                  onClick={() => {
                    premestiElement(index, index - 1);
                  }}
                >
                  ▲
                </button>
              )}
              {index < sadrzaj.length - 1 && (
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--tekst)",
                  }}
                  onClick={() => {
                    premestiElement(index, index + 1);
                  }}
                >
                  ▼
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default KreiranjeVestiSadrzaj;
