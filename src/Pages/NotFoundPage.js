import lopta from "../Helpers/icons/lopta.png";
import styles from "../Components/NotFoundComponents/NotFound.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const NotFoundPage = () => {
  const navigate = useNavigate();
  const [redirectTimer, setRedirectTimer] = useState(5);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRedirectTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (redirectTimer === 0) {
      navigate("/pocetna");
    }
  }, [redirectTimer, navigate]);
  return (
    <div
      style={{
        color: "var(--tekst)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className={styles.notFoundWrapper}>
        <p className={styles.paragraf}>4</p>
        <img className={styles.lopta} src={lopta} alt="0" />
        <p className={styles.paragraf}>4</p>
      </div>
      <p style={{ textAlign: "center", fontSize: "clamp(2em, 3vw, 5em)" }}>
        Stranica nije pronađena,vraćanje na pocetnu za: {redirectTimer}
      </p>
    </div>
  );
};
export default NotFoundPage;
