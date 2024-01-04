import Kolo from "../Components/RasporedComponents/Kolo";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../Components/StatistikaComponents/Statistika.module.css";
import { useState, useEffect} from "react";
import { firebaseGet } from "../Helpers/Firebase";

const RasporedPage = ({user}) => {
  const [takmicenje,setTakmicenje] = useState({});
  const { idTakmicenja } = useParams();
  const navigate = useNavigate();
  
  useEffect(()=>{
    transformData();
    async function transformData(){
      const data = await firebaseGet(`/takmicenja/${idTakmicenja}`)
    
    if (!data || Object.keys(data).length === 0) {
      navigate("/notFound");
    } else {
      setTakmicenje(data);
    }}
  },[idTakmicenja, navigate])

  return (
    <div className={styles.pozadina}>
      {takmicenje.raspored && takmicenje.raspored.map((kolo, index) => {
        return <Kolo kolo={kolo} key={index} user={user}/>;
      })}
    </div>
  );
};
export default RasporedPage;
