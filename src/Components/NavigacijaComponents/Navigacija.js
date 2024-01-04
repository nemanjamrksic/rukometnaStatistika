import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "./Navigacija.module.css";
import React from "react";
import { useState, useEffect } from "react";
import { auth, firebaseGet } from "../../Helpers/Firebase";
import IzborTakmicenja from "./IzborTakmicenja";
import { signOut } from "firebase/auth";
import ThemeSwitch from "../../Helpers/ThemeSwitch";
const Navigacija = ({user}) => {
  const navigate = useNavigate();
  const hamburgerButton = React.createRef();
  const glavnaNavigacija = React.createRef();
  const [pretragaVidljivost, setPretragaVidljivost] = useState("none");
  const [listaEkipa, setListaEkipa] = useState([]);
  const [listaIgraca, setListaIgraca] = useState([]);
  const [filtriraneEkipe, setFiltriraneEkipe] = useState([]);
  const [filtriraniIgraci, setFiltriraniIgraci] = useState([]);
  const [izborTakmicenjaOpen, setIzborTakmicenjaOpen] = useState(false);
  const [nazivTakmicenja, setNazivTakmicenja] = useState("Handball Championship 2023/2024");
  const [idTakmicenja, setIdTakmicenja] = useState(
    "HandballChampionship2023_2024"
  );
  const pretraga = React.createRef();
  const path = useLocation().pathname;
  useEffect(() => {
    transformEkipe();
    async function transformEkipe() {
      const data = await firebaseGet(`/takmicenja/${idTakmicenja}/listaEkipa`);

        let transformisaneEkipe = [];
        let transformisaniIgraci = [];
        for (const [indexEkipe, ekipa] of data.entries()) {
          transformisaneEkipe.push({
            nazivEkipe: ekipa.nazivEkipe,
            idEkipe: indexEkipe,
          });
          for (const [indexIgraca, igrac] of ekipa.listaIgraca.entries()) {
            transformisaniIgraci.push({
              imeIgraca: igrac.imeIgraca,
              nazivEkipe: ekipa.nazivEkipe,
              idEkipe: indexEkipe,
              idIgraca: indexIgraca,
            });
          }
        
        setListaEkipa(transformisaneEkipe);
        setListaIgraca(transformisaniIgraci);
      }
    }
  }, [idTakmicenja, navigate, user]);

  function searchChange(e) {
    
    if (e.target.value.length >= 2) {
      const filter = e.target.value.toLowerCase();
      const novaListaEkipa = listaEkipa.filter((ekipa) => {
        return ekipa.nazivEkipe.toLowerCase().includes(filter);
      });
      const novaListaIgraca = listaIgraca.filter((igrac) => {
        return igrac.imeIgraca.toLowerCase().includes(filter);
      });
      setFiltriraneEkipe(novaListaEkipa);
      setFiltriraniIgraci(novaListaIgraca);
      setPretragaVidljivost("block");
    } else {
      setPretragaVidljivost("none");
    }
  }
  if(path === "/semafor"){
    return <div style={{display:"none"}}></div>
  }
  return (
    <div className={styles.NavigacijaISearch}>
      {izborTakmicenjaOpen && <IzborTakmicenja setIdTakmicenja={setIdTakmicenja} setOpen = {setIzborTakmicenjaOpen} setNazivTakmicenja = {setNazivTakmicenja}/>}
      <ThemeSwitch/>
      <div className={styles.searchWrapper}>
        
        
        <input
          type="search"
          ref={pretraga}
          placeholder="Pretraga"
          onChange={searchChange}
          onFocus={searchChange}
          onBlur={() => {
            setTimeout(() => {
              setPretragaVidljivost("none");
            }, 200);
          }}
        />
        <div
          style={{ display: pretragaVidljivost }}
          className={styles.IgraciEkipe}
        >
          <p  className={styles.EkipeIgraci}>Ekipe:</p>
          {filtriraneEkipe.length > 0 ? (
            filtriraneEkipe.map((ekipa, index) => {
              return (
                <Link
                  onClick={()=>{pretraga.current.value = ekipa.nazivEkipe}}
                  className={styles.Link}
                  key={index}
                  to={`/informacijeOEkipi/${idTakmicenja}/${ekipa.idEkipe}`}
                >
                  {ekipa.nazivEkipe}
                </Link>
              );
            })
          ) : (
            <p style={{color:"var(--tekst)"}}>Ne postoje ekipe koje zadovoljavaju pretragu!</p>
          )}
          <p  className={styles.EkipeIgraci}>Igraci:</p>
          {filtriraniIgraci.length > 0 ? (
            filtriraniIgraci.map((igrac, index) => {
              return (
                <Link
                onClick={()=>{pretraga.current.value = igrac.imeIgraca}}
                  className={styles.Link}
                  key={index}
                  to={`/informacijeOIgracu/${idTakmicenja}/${igrac.idEkipe}/${igrac.idIgraca}`}
                >
                  {igrac.imeIgraca} ({igrac.nazivEkipe})
                </Link>
              );
            })
          ) : (
            <p style={{color:"var(--tekst)"}}>Ne postoje igraci koji zadovoljavaju pretragu!</p>
          )}
        </div>
        <button
          aria-expanded="false"
          onClick={() => {
            const isOpen =
              hamburgerButton.current.getAttribute("aria-expanded");
            if (isOpen === "false") {
              hamburgerButton.current.setAttribute("aria-expanded", "true");
              glavnaNavigacija.current.setAttribute("datavisible", "true");
            } else {
              hamburgerButton.current.setAttribute("aria-expanded", "false");
              glavnaNavigacija.current.setAttribute("datavisible", "false");
            }
          }}
          ref={hamburgerButton}
          className={styles.DugmeSkriveno}
        >
          <svg className={styles.hamburger} viewBox="0 0 100 100">
            <rect
              className={`${styles.Rect} ${styles.TopRect}`}
              width="80"
              height="10"
              x="10"
              y="25"
              rx="5"
            ></rect>
            <rect
              className={`${styles.Rect} ${styles.MidRect}`}
              width="80"
              height="10"
              x="10"
              y="45"
              rx="5"
            ></rect>
            <rect
              className={`${styles.Rect} ${styles.BotRect}`}
              width="80"
              height="10"
              x="10"
              y="65"
              rx="5"
            ></rect>
          </svg>
        </button>
      </div>
      <nav
        ref={glavnaNavigacija}
        className={styles.navigacijaWrapper}
        datavisible="false"
      >
        <ul className={styles.navigacija}>
          <li>
            <p onClick={()=>{setIzborTakmicenjaOpen(true)}} className={styles.Link}>{nazivTakmicenja}</p>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive ? `${styles.Aktivno} ${styles.Link}` : styles.Link
              }
              to="/pocetna"
            >
              Pocetna
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive ? `${styles.Aktivno} ${styles.Link}` : styles.Link
              }
              to={`/raspored/${idTakmicenja}`}
            >
              Raspored
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive ? `${styles.Aktivno} ${styles.Link}` : styles.Link
              }
              to={`/statistika/${idTakmicenja}`}
            >
              Statistika
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive ? `${styles.Aktivno} ${styles.Link}` : styles.Link
              }
              to={`tabela/${idTakmicenja}`}
            >
              Tabela
            </NavLink>
          </li>
          {user && user.email === "admin@gmail.com" &&
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive ? `${styles.Aktivno} ${styles.Link}` : styles.Link
              }
              to={`/kreiranjeTakmicenja`}
            >
              Novo takmicenje
            </NavLink>
          </li>}
          {user && user.email === "admin@gmail.com" &&
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive ? `${styles.Aktivno} ${styles.Link}` : styles.Link
              }
              to={`/kreiranjeVesti`}
            >
              Nova vest
            </NavLink>
          </li>}
          
          <li>
            {user === null ? (
              <NavLink
                className={({ isActive }) =>
                  isActive ? `${styles.Aktivno} ${styles.Link}` : styles.Link
                }
                to="/login"
              >
                Login
              </NavLink>
            ):(
              <button
              className={styles.LogoutButton}
                onClick={() => {
                  signOut(auth);
                }}
              >
                Log out
              </button>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default Navigacija;
