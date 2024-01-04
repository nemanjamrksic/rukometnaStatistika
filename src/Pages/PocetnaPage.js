import { useState, useEffect } from "react";
import styles from "../Components/PocetnaComponents/Pocetna.module.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import { firebaseGet, firebasePatch } from "../Helpers/Firebase";

const PocetnaPage = ({ user }) => {
  const navigate = useNavigate();
  const [vesti, setVesti] = useState([]);
  const [filtriranaLista, setFiltriranaLista] = useState([]);

  useEffect(() => {
    vratiPodatke();
    async function vratiPodatke() {
      const podaci = await firebaseGet("/vesti");

      let listaVesti = [];
      for (const key in podaci) {
        listaVesti.push({
          ...podaci[key],
          idVesti: key,
        });

        const vestiZaSet = listaVesti
          .sort((b, a) => new Date(a.datum) - new Date(b.datum))
          .map((vest, index) => {
            const datum = new Date(vest.datum);
            return {
              ...vest,
              indexVesti: index,
              datum: `${datum.getDate()}.${
                datum.getMonth() + 1
              }.${datum.getFullYear()}.`,
            };
          });
        setVesti(vestiZaSet);
        setFiltriranaLista(vestiZaSet);
      }
    }
  }, [navigate]);

  function pretrazi(e) {
    e.preventDefault();
    const filter = e.target[0].value.toLowerCase();
    const novaLista = vesti.filter((vest) => {
      return (
        vest.naslov.toLowerCase().includes(filter) ||
        vest.kratakOpis.toLowerCase().includes(filter)
      );
    });
    setFiltriranaLista(novaLista);
  }
  function toggleFavourites(vest, index) {
    firebasePatch({ favourites: !vest.favourites }, `/vesti/${vest.idVesti}`);
    setVesti((prevLista) => {
      const izmenjeno = [...prevLista];
      izmenjeno[vest.indexVesti] = {
        ...izmenjeno[vest.indexVesti],
        favourites: !izmenjeno[vest.indexVesti].favourites,
      };
      return izmenjeno;
    });
    setFiltriranaLista((prevLista) => {
      const izmenjeno = [...prevLista];
      izmenjeno[index] = {
        ...izmenjeno[index],
        favourites: !izmenjeno[index].favourites,
      };
      return izmenjeno;
    });
  }
  return (
    <div className={styles.pozadina}>
      <div style={{ width: "80%" }}>
        <Carousel
          autoPlay
          infiniteLoop
          width="100%"
          className={styles.topVesti}
          showStatus={false}
          showThumbs={false}
          interval={5000}
        >
          {vesti
            .filter((element) => element.favourites)
            .map((vest, index) => {
              return (
                <div
                  style={{ backgroundImage: `url(${vest.pocetnaSlika})` }}
                  key={index}
                  className={styles.carouselContent}
                >
                  <div>
                    <h1
                      onClick={() => {
                        navigate(`/pregledVesti/${vest.idVesti}`);
                      }}
                      className={styles.title}
                    >
                      {vest.naslov}
                    </h1>
                  </div>
                </div>
              );
            })}
        </Carousel>
      </div>
      <form className={styles.pretraga} onSubmit={pretrazi}>
        <input className={styles.pretraga} type="text" placeholder="Search" />
      </form>
      <div>
        {filtriranaLista.map((vest, index) => {
          return (
            <div key={index} className={styles.vestContainer}>
              {user && user.email === "admin@gmail.com" && (
                <svg
                  className={vest.favourites ? styles.starFilled : styles.star}
                  viewBox="0 0 24 24"
                >
                  <polygon
                    onClick={() => toggleFavourites(vest, index)}
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  />
                </svg>
              )}
              <div className={styles.slikaDiv}>
                <img src={vest.pocetnaSlika} alt=""></img>
              </div>
              <div className={styles.sadrzajDiv}>
                <p
                  onClick={() => {
                    navigate(`/pregledVesti/${vest.idVesti}`);
                  }}
                  className={styles.naslov}
                >
                  {vest.naslov}
                </p>
                <p className={styles.datum}>{vest.datum}</p>
                <p className={styles.kratakOpis}>{vest.kratakOpis}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default PocetnaPage;
