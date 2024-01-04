import  React  from "react";
import styles from "./KreiranjeTakmicenja.module.css"
const IzborGrba = ({ grb, setGrb }) => {
  const slikaInput = React.createRef();

  function izaberiGrb(e) {
    if (e.target.files[0]) {
      setGrb(e.target.files[0]);
    }
    slikaInput.current.value = null;
  }
  return (
    <div className={styles.grbWrapper}>
      <input
        ref={slikaInput}
        style={{ display: "none" }}
        type="file"
        onChange={izaberiGrb}
        accept=".png, .jpg, .jpeg, .gif"
      />
      {grb ? (
        <img
          src={URL.createObjectURL(grb)}
          onClick={() => {
            slikaInput.current.click();
          }}
        />
      ) : (
        <button
          onClick={() => {
            slikaInput.current.click();
          }}
        >
          Otpremite grb
        </button>
      )}
    </div>
  );
};
export default IzborGrba;
