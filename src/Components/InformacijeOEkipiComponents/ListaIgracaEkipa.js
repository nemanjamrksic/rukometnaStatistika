import { useNavigate, useParams } from "react-router-dom";
import styles from "./InformacijeOEkipi.module.css"

const ListaIgracaEkipa = (props) => {
    const {idTakmicenja,idEkipe} = useParams();
    const navigate = useNavigate();
    return(<table className={styles.tabelaStatistika}>
        <thead>
            <tr>
                <td>Ime i prezime</td>
                <td>Broj golova</td>
                <td>Iskljucenja</td>
                <td>Broj crvenih</td>
                <td>Igrac utakmice</td>
            </tr>
        </thead>
        <tbody>
            {props.listaIgraca.map((igrac, index)=>{
                return(<tr key={index} onClick={()=>{navigate(`/informacijeOIgracu/${idTakmicenja}/${idEkipe}/${index}`)}}>
                    <td>{igrac.imeIgraca}</td>
                    <td>{igrac.brojGolova}</td>
                    <td>{igrac.brojIskljucenja}</td>
                    <td>{igrac.brojDisk}</td>
                    <td>{igrac.brojMVP}</td>
                </tr>)
            })}
        </tbody>
    </table>)
}
export default ListaIgracaEkipa;