import { useState, useEffect } from "react";
import styles from "./PregledZapisnika.module.css";
import { firebaseGet } from "../../Helpers/Firebase";
import { useParams } from "react-router-dom";
const OdabirPostava = ({ setEkipa, ekipaID }) => {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [jerseyNumbers, setJerseyNumbers] = useState({});
  const [postavaJeIzabrana, setPostavaJeIzabrana] = useState(false);
  const [ekipaBaza, setEkipaBaza] = useState({});
  const { idTakmicenja } = useParams();

  useEffect(() => {
    transformData();
    async function transformData() {
      const data = await firebaseGet(
        `/takmicenja/${idTakmicenja}/listaEkipa/${ekipaID}`
      );
      if (data && Object.keys(data).length > 0) {
        let listaIgracaTransformisano = [];
        for (const [index, igrac] of data.listaIgraca.entries()) {
          listaIgracaTransformisano.push({
            idIgraca: index,
            brojLicence: igrac.brojLicence,
            imeIgraca: igrac.imeIgraca,
          });
        }
        const transformedData = {
          ...data,
          postava: listaIgracaTransformisano,
        };
        setEkipaBaza(transformedData);
      }
    }
  }, [idTakmicenja, ekipaID]);

  const handlePlayerChange = (playerData) => {
    return (e) => {
      setSelectedPlayers((prevSelected) => {
        if (e.target.checked) {
          return [...prevSelected, playerData];
        } else {
          return prevSelected.filter(
            (player) => player.imeIgraca !== playerData.imeIgraca
          );
        }
      });
    };
  };

  const handleJerseyChange = (playerName) => {
    return (e) => {
      const newJerseyNumbers = {
        ...jerseyNumbers,
        [playerName]: e.target.value,
      };
      setJerseyNumbers(newJerseyNumbers);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedPlayersData = selectedPlayers
      .map((selectedPlayer) => ({
        idIgraca: selectedPlayer.idIgraca,
        brojLicence: selectedPlayer.brojLicence,
        imeIgraca: selectedPlayer.imeIgraca,
        brojDresa: jerseyNumbers[selectedPlayer.imeIgraca] || "",
        brojGolova: 0,
        opomena: "",
        iskljucenje: ["", "", ""],
        disk: "",
      }))
      .sort((a, b) => a.brojDresa - b.brojDresa);
    if (selectedPlayersData.length > 0) {
      const ekipa = {
        ...ekipaBaza,
        postava: selectedPlayersData,
      };
      setEkipa(ekipa);
      setPostavaJeIzabrana(true);
    }
  };
  const dynamicStyle = postavaJeIzabrana ? { borderColor: "green" } : {};

  return (
    <div className={styles.izborIgracaWrapper} style={dynamicStyle}>
      <h2>{ekipaBaza.nazivEkipe}</h2>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        {ekipaBaza.listaIgraca &&
          ekipaBaza.listaIgraca.map((igrac, index) => (
            <div key={index} className={styles.igracWrapper}>
              <div className={styles.igracCB}>
                <input
                  type="checkbox"
                  onChange={handlePlayerChange({
                    brojLicence: igrac.brojLicence,
                    idIgraca: igrac.idIgraca,
                    imeIgraca: igrac.imeIgraca,
                  })}
                  checked={selectedPlayers.some(
                    (player) => player.imeIgraca === igrac.imeIgraca
                  )}
                />
                <p>{igrac.imeIgraca}</p>
              </div>

              {selectedPlayers.some(
                (player) => player.imeIgraca === igrac.imeIgraca
              ) && (
                <input
                  required
                  className={styles.dresInput}
                  type="number"
                  placeholder="Broj dresa"
                  value={jerseyNumbers[igrac.imeIgraca] || ""}
                  onChange={handleJerseyChange(igrac.imeIgraca)}
                />
              )}
            </div>
          ))}

        <button className={styles.izborIgracaButton} type="submit">
          Sacuvaj postave
        </button>
      </form>
    </div>
  );
};
export default OdabirPostava;
