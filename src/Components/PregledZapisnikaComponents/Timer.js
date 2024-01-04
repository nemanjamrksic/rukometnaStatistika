import React, { useState, useEffect } from "react";
import styles from "./PregledZapisnika.module.css";

const Timer = ({
  postaviPoluvreme,
  onTimeUpdate,
  setKrajUtakmice,
  krajUtakmice,
}) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [vremePopUpOpen, setVremePopUpOpen] = useState(false);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds >= 59) {
          setMinutes((prevMinutes) => prevMinutes + 1);
          setSeconds(0);
          localStorage.setItem(
            "vreme",
            JSON.stringify({ minuti: minutes + 1, sekunde: 0 })
          );
          onTimeUpdate(minutes + 1, 0);
        } else {
          setSeconds((prevSeconds) => prevSeconds + 1);
          localStorage.setItem(
            "vreme",
            JSON.stringify({ minuti: minutes, sekunde: seconds + 1 })
          );
          onTimeUpdate(minutes, seconds + 1);
        }
        if (minutes === 29 && seconds === 59) {
          postaviPoluvreme();
          pauseTimer();
        }
        if (minutes === 59 && seconds === 59) {
          pauseTimer();
          setKrajUtakmice(true);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [
    isRunning,
    seconds,
    minutes,
    onTimeUpdate,
    setKrajUtakmice,
    postaviPoluvreme,
  ]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  return (
    <div className={styles.timerWrapper}>
      <div>
        <p style={{ color: "var(--tekst)" }}>{`${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`}</p>
      </div>
      {vremePopUpOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setVremePopUpOpen(false);
            }
          }}
          className={styles.pozadinaPopUp}
        >
          <div className={styles.timerPopUp}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  e.target[0].value >= 0 &&
                  e.target[0].value <= 59 &&
                  e.target[1].value >= 0 &&
                  e.target[1].value <= 59
                ) {
                  setMinutes(parseInt(e.target[0].value, 10));
                  setSeconds(parseInt(e.target[1].value, 10));
                  localStorage.setItem(
                    "vreme",
                    JSON.stringify({
                      minuti: parseInt(e.target[0].value, 10),
                      sekunde: parseInt(e.target[1].value, 10),
                    })
                  );
                  setVremePopUpOpen(false);
                }
              }}
            >
              <input placeholder="Minuti" type="number" required />
              :
              <input placeholder="Sekunde" type="number" required />
              <button type="submit">Izmenite vreme</button>
            </form>
          </div>
        </div>
      )}
      {!krajUtakmice && (
        <div>
          <button className={styles.playButton} onClick={startTimer}></button>
          <button className={styles.pauseButton} onClick={pauseTimer}></button>
          <button
            className={styles.editTimeButton}
            onClick={() => {
              setVremePopUpOpen(true);
            }}
          ></button>
        </div>
      )}
    </div>
  );
};

export default Timer;
