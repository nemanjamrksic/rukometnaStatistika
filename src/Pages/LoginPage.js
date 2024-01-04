import styles from "../Components/LoginComponents/Login.module.css";
import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../Helpers/Firebase";
import { useNavigate } from "react-router-dom";
const LoginPage = ({ user }) => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfrim, setRegisterPasswordConfrim] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorRegister, setErrorRegister] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  useEffect(() => {
    if (user !== null) {
      navigate("/pocetna");
    }
  }, [user, navigate]);

  async function register(e) {
    e.preventDefault();
    if (registerPassword === registerPasswordConfrim) {
      try {
       await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      } catch (error) {
        if(error.message.includes("(auth/weak-password)")){
          setErrorRegister("Šifra mora imati bar 6 karaktera");
        }else if(error.message.includes("(auth/email-already-in-use)")){
          setErrorRegister("Već postoji nalog za taj mail")
        }else if(error.message.includes("(auth/invalid-email)")){
          setErrorRegister("Mail nije validan.")
        }else{
          setErrorRegister(error.message);
        }
      }
    }else{
      setErrorRegister("Šifre nisu iste")
    }
  }
  async function login(e) {
    e.preventDefault();
    try {
     await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (error) {
      if(error.message.includes("(auth/invalid-login-credentials)")){
        setErrorLogin("Pogrešna šifra/email")
      }else{
        setErrorLogin(error.message);
      }
    }
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={styles.pozadina}>
      <div
        className={`${styles.loginWrapper} ${isFlipped ? styles.flipped : ""}`}
      >
        <div className={styles.card}>
          <div className={styles.side + " " + styles.front}>
            <h1>Login</h1>
            <form
              onSubmit={login}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className={styles.inputWrapper}>
                <label>E-mail:</label>
                <input
                  required
                  type="email"
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                  }}
                />
                <label>Šifra:</label>
                <input
                  required
                  type="password"
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                  }}
                />
                <p style={{color:"red", textAlign:"center"}}>{errorLogin}</p>
              </div>
              <button type="submit">Prijavi se</button>
            </form>
            <p className={styles.flipTekst} onClick={flipCard}>
              Nemate nalog? Registrujte se!
            </p>
          </div>
          <div className={styles.side + " " + styles.back}>
            <h1>Register</h1>
            <form
              onSubmit={register}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className={styles.inputWrapper}>
                <label>E-mail:</label>
                <input
                  required
                  type="email"
                  onChange={(e) => {
                    setRegisterEmail(e.target.value);
                  }}
                />
                <label>Šifra:</label>
                <input
                  required
                  type="password"
                  onChange={(e) => {
                    setRegisterPassword(e.target.value);
                  }}
                />
                <label>Potvrdi šifru:</label>
                <input
                  required
                  type="password"
                  onChange={(e) => {
                    setRegisterPasswordConfrim(e.target.value);
                  }}
                />
                <p style={{color:"red", textAlign:"center"}}>{errorRegister}</p>
              </div>
              <button type="submit">Registruj se</button>
            </form>

            <p className={styles.flipTekst} onClick={flipCard}>
              Već imate nalog? Prijavite se!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
