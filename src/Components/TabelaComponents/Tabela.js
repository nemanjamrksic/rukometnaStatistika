import styles from "./Tabela.module.css";
import { useNavigate, useParams } from "react-router-dom";

const Tabela = ({ listaEkipa }) => {
    const navigate = useNavigate()
    const {idTakmicenja} = useParams();
        
   
  return (
    <table className={styles.tabela}>
      <thead>
        <tr>
          <td>#</td>
          <td>Ekipa</td>
          <td>Uk</td>
          <td>Pob</td>
          <td>Ner</td>
          <td>Por</td>
          <td>Gol +</td>
          <td>Gol -</td>
          <td>+/-</td>
          <td>Bod</td>
        </tr>
      </thead>
      <tbody>
        {listaEkipa.map((ekipa, index) => {
          return (
            <tr key={index} onClick={()=>{navigate(`/informacijeOEkipi/${idTakmicenja}/${ekipa.idEkipe}`)}}>
              <td>{index + 1}</td>
              <td>{ekipa.nazivEkipe}</td>
              <td>{ekipa.ukupnoOdigranih}</td>
              <td>{ekipa.pobeda}</td>
              <td>{ekipa.neresenih}</td>
              <td>{ekipa.poraza}</td>
              <td>{ekipa.postignutiGolovi}</td>
              <td>{ekipa.primljeniGolovi}</td>
              <td>{ekipa.golRazlika}</td>
              <td>{ekipa.bodovi}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default Tabela;
