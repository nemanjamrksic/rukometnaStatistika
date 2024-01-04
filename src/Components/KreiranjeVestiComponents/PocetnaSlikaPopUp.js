import { useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import styles from "./KreiranjeVesti.module.css";
import React from "react";

const PocetnaSlikaPopUp = ({pocetnaSlika, setPocetnaSlika}) => {
  const cropperRef = useRef(null);
  const slikaInput = React.createRef();
  const [popUpVidljivost, setPopUpVidljivost] = useState(false);
  const [pocetnaZaCrop, setPocetnaZaCrop] = useState(null);
  const handleButtonClick = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const cropperInstance = cropperRef.current.cropper;
      const croppedCanvas = cropperInstance.getCroppedCanvas();

      if (croppedCanvas) {
        const dataURL = croppedCanvas.toDataURL();
        setPocetnaSlika(dataURL);
        setPopUpVidljivost(false);
      } else {
        console.error("Failed to get cropped canvas.");
      }
    }
    
  };
  function izaberiPocetnu(e) {
    if (e.target.files[0]) {
      setPocetnaZaCrop(e.target.files[0]);
    }
    slikaInput.current.value = null;
    setPopUpVidljivost(true);
  }
  return (
    <div style={{width:"60%"}}>
      <input accept="image/*" onChange={izaberiPocetnu} ref={slikaInput} style={{display:"none"}}  type="file"/>
      {pocetnaSlika ? (
        <img style={{width:"100%"}} onClick={()=>{slikaInput.current.click()}} src={pocetnaSlika} alt={pocetnaSlika.name}/>
      ) : (
        <button className={styles.izaberiSlikuButton} onClick={()=>{slikaInput.current.click()}}>Izaberite pocetnu sliku</button>
      )}
      {popUpVidljivost && (
        <div className={styles.pozadinaPopUp} onClick={(e)=>{e.target === e.currentTarget && setPopUpVidljivost(false)}}>
          <div className={styles.PopUp}>
            <Cropper
              ref={cropperRef}
              src={URL.createObjectURL(pocetnaZaCrop)}
              style={{ maxHeight: "60vh",  }}
              guides={false}
              aspectRatio={16 / 9}
              zoomable={false}
              viewMode={1}
            />
            <button onClick={handleButtonClick}>Isecite sliku</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PocetnaSlikaPopUp;
