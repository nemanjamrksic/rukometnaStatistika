import EkipaPregledZapisnika from "../Components/PregledZapisnikaComponents/EkipaPregledZapisnika";
import PromenaRezultata from "../Components/PregledZapisnikaComponents/PromenaRezultata";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../Components/PregledZapisnikaComponents/PregledZapisnika.module.css";
import { useEffect, useState } from "react";
import { firebaseGet } from "../Helpers/Firebase";
const PregledZapisnikaPage = () => {
  const navigate = useNavigate();
  const { idTakmicenja, idKola, idUtakmice } = useParams();
  const [utakmica, setUtakmica] = useState({});
  const [grbDomacin, setGrbDomacin] = useState();
  const [grbGost, setGrbGost] = useState();
  useEffect(() => {
    transformData();

    async function transformData() {
      const data = await firebaseGet(
        `/takmicenja/${idTakmicenja}/raspored/${idKola}/utakmice/${idUtakmice}`
      );
      if (!data || Object.keys(data).length === 0 || !data.rezultatPoluvreme) {
        navigate("/notFound");
      } else {
        const transformedData = {
          idDomacin: data.idDomacin,
          idGost: data.idGost,
          domacin: { nazivEkipe: data.domaciTim, postava: data.postavaDomacin },
          gost: { nazivEkipe: data.gostujuciTim, postava: data.postavaGost },
          listaRezultataPrvoPoluvreme: data.listaRezultata,
          listaRezultataDrugoPoluvreme: data.listaRezultataPoluvreme,
          rezultat: data.rezultat,
          rezultatPoluvreme: data.rezultatPoluvreme,
        };
        setUtakmica(transformedData);
      }
    }
  }, [idTakmicenja, idKola, idUtakmice, navigate]);

  useEffect(() => {
    if (utakmica.idDomacin !== undefined && utakmica.idGost !== undefined) {
      transformData();
    }
    async function transformData() {
      const domacinGrb = await firebaseGet(
        `/takmicenja/${idTakmicenja}/listaEkipa/${utakmica.idDomacin}/grb`
      );
      const gostGrb = await firebaseGet(
        `/takmicenja/${idTakmicenja}/listaEkipa/${utakmica.idGost}/grb`
      );
      setGrbDomacin(domacinGrb);
      setGrbGost(gostGrb);
    }
  }, [idTakmicenja, utakmica]);

  return (
    <>
      {utakmica.domacin !== undefined && (
        <div>
          <div className={styles.rezultatWrapper}>
            <div className={styles.imeGrb}>
              <img alt="grb" src={grbDomacin} />
              <p>{utakmica.domacin.nazivEkipe}</p>
            </div>

            <div className={styles.rezultat}>
              <p>{utakmica.rezultat}</p>
              <p>({utakmica.rezultatPoluvreme})</p>
            </div>
            <div className={styles.imeGrb}>
              <p>{utakmica.gost.nazivEkipe}</p>
              <img alt="grb" src={grbGost} />
            </div>
          </div>
          <div className={styles.zapisnikWrapper}>
            <div>
              <EkipaPregledZapisnika
                kreiranje={false}
                ekipa={utakmica.domacin}
              />
              <EkipaPregledZapisnika kreiranje={false} ekipa={utakmica.gost} />
            </div>
            <div className={styles.promenaRezultataWrapper}>
              <PromenaRezultata
                poluvreme="prvo"
                listaRezultata={utakmica.listaRezultataPrvoPoluvreme}
              />
              <PromenaRezultata
                poluvreme="drugo"
                listaRezultata={utakmica.listaRezultataDrugoPoluvreme}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default PregledZapisnikaPage;
