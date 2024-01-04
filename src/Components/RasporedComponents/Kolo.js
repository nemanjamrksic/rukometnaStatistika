import { firebasePatch } from "../../Helpers/Firebase";
import styles from "./Raspored.module.css";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";

const Kolo = ({ kolo, user }) => {
  const { idTakmicenja } = useParams();
  const [izabraniDatum, setIzabraniDatum] = useState(null);
  let navigate = useNavigate();

  function handleClick(e, utakmica, rezultat) {
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "BUTTON") {
      if(rezultat === ""){
        if(user!==null){
          navigate(`/kreiranjeZapisnika/${idTakmicenja}/${kolo.kolo - 1}/${utakmica}`);
        }
      }else{
        navigate(`/pregledZapisnika/${idTakmicenja}/${kolo.kolo - 1}/${utakmica}`);
      }
      
    }
  }
  function sacuvajDatum(utakmica){
    if(izabraniDatum){
      firebasePatch({datum:izabraniDatum}, `/takmicenja/${idTakmicenja}/raspored/${kolo.kolo-1}/utakmice/${utakmica}`);
      setIzabraniDatum(null);
      window.location.reload()
    }
    
  }
  return (
    <div className={styles.koloWrapper}>
      <p className={styles.brojKola}>Kolo {kolo.kolo}</p>
      <table className={styles.tabelaRaspored}>
        <thead>
          <tr>
            <td>Datum</td>
            <td>Domacin</td>
            <td>Rezultat</td>
            <td>Gost</td>
          </tr>
        </thead>
        <tbody>
          {kolo.utakmice &&
            kolo.utakmice.map((utakmica, index) => {
              const utakmicaDatum = new Date(utakmica.datum)
              return (
                <tr
                  key={index}
                  onClick={(e) => {
                    handleClick(e, index, utakmica.rezultat);
                  }}
                >
                  <td>
                    {utakmica.datum !== "" ? (
                      utakmicaDatum.toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                    ) : (
                      user !== null && (<div style={{display:"flex", flexWrap:"wrap", justifyContent:"space-evenly", alignItems:"center"}}>
                        <input onChange={(e)=>{setIzabraniDatum(e.target.value)}} type="datetime-local" />
                        <button className={styles.sacuvajDatumDugme} onClick={()=>{sacuvajDatum(index)}}>Sačuvaj</button>
                      </div>)
                    )}
                  </td>
                  <td>{utakmica.domaciTim}</td>
                  <td>
                    <p>{utakmica.rezultat}</p>
                    {utakmica.rezultatPoluvreme && <p>({utakmica.rezultatPoluvreme})</p>}
                  </td>
                  <td>{utakmica.gostujuciTim}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
export default Kolo;
