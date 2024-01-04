import styles from "./PregledZapisnika.module.css";

const PromenaRezultata = (props) => {
  return (
    <div style={{padding:"5px"}}>
      <p style={{marginTop: "21px", textAlign: "center", color: "white",textShadow: "-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black"}}>{props.poluvreme} poluvreme</p>
      <table className={styles.tabelaStatistika}>
        <thead>
          <tr>
            <td>D</td>
            <td>G</td>
            <td>min</td>
            <td>igr.</td>
          </tr>
        </thead>
        <tbody>
          {props.listaRezultata.length > 0 && props.listaRezultata.map((rezultat) => {
            return (
              <tr key={rezultat.domacin + ":" + rezultat.gost}>
                <td>{rezultat.domacin}</td>
                <td>{rezultat.gost}</td>
                <td>{rezultat.minut}'</td>
                <td>{rezultat.igrac}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default PromenaRezultata;
