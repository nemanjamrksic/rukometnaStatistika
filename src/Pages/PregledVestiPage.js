import { useState, useEffect } from "react";
import styles from "../Components/PregledVestiComponents/PregledVesti.module.css";
import { firebaseGet } from "../Helpers/Firebase";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const PregledVestiPage = () => {
  const navigate = useNavigate();
  const { idVesti } = useParams();
  const [vest, setVest] = useState({});
  let datum = new Date(vest.datum);
  useEffect(() => {
    vratiPodatke();
    async function vratiPodatke(){
      const podaci = await firebaseGet(`vesti/${idVesti}`);
      if(!podaci || Object.keys(podaci).length === 0){
        navigate("/notFound");
      }else{
        setVest(podaci);
      }
    }
  }, [idVesti, navigate]);
  
  return (
    <div className={styles.pozadina}>
      <img style={{ width: "60%", marginTop:"20px" }} src={vest.pocetnaSlika} alt="pocetna" />
      <h1 className={styles.naslov}>{vest.naslov}</h1>
      <p>
        {datum.getDate()}.{datum.getMonth() + 1}.{datum.getFullYear()}
      </p>
      <div className={styles.sadrzaj}>
        {vest.sadrzaj &&
          vest.sadrzaj.map((element, index) => {
            if (element.tip === "paragraf") {
              return (
                <p key={index} className={styles.paragraf}>
                  {element.vrednost}
                </p>
              );
            }
            return (
              <img
                className={styles.slika}
                key={index}
                src={element.vrednost}
                alt={`Uploaded ${index + 1}`}
              />
            );
          })}
      </div>
    </div>
  );
};
export default PregledVestiPage;
