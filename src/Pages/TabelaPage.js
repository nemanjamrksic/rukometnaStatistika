import { useNavigate, useParams } from "react-router-dom";
import Tabela from "../Components/TabelaComponents/Tabela";
import styles from "../Components/TabelaComponents/Tabela.module.css";
import { useState, useEffect } from "react";
import { firebaseGet } from "../Helpers/Firebase";

const TabelaPage = () => {
  const navigate = useNavigate();
  const [takmicenje, setTakmicenje] = useState({});

  const { idTakmicenja } = useParams();

  useEffect(() => {
    transformData();
    async function transformData() {
      const data = await firebaseGet(`/takmicenja/${idTakmicenja}`);
      if (!data || Object.keys(data).length === 0) {
        navigate("/notFound");
      } else {
        const transformedData = {
          ...data,
          listaEkipa: data.listaEkipa
            .map((ekipa, index) => {
              return { ...ekipa, idEkipe: index };
            })
            .sort((a, b) => {
              if (b.bodovi - a.bodovi === 0) {
                return b.golRazlika - a.golRazlika;
              }
              return b.bodovi - a.bodovi;
            }),
        };
        setTakmicenje(transformedData);
      }
    }
  }, [idTakmicenja, navigate]);
  

  return (
    <div className={styles.pozadina}>
      <h1 className={styles.naslov}>
        {takmicenje.nazivTakmicenja} {takmicenje.sezonaTakmicenja}
      </h1>
      {takmicenje.listaEkipa && <Tabela listaEkipa={takmicenje.listaEkipa} />}
    </div>
  );
};
export default TabelaPage;
