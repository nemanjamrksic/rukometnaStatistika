import RasporedPage from "./Pages/RasporedPage";
import StatistikaPage from "./Pages/StatistikaPage";
import KreiranjeTakmicenjaPage from "./Pages/KreiranjeTakmicenjaPage";
import PregledZapisnikaPage from "./Pages/PregledZapisnikaPage";
import KreiranjeZapisnikaPage from "./Pages/KreiranjeZapisnikaPage";
import TabelaPage from "./Pages/TabelaPage";
import InformacijeOEkipiPage from "./Pages/InformacijeOEkipiPage";
import KreiranjeVestiPage from "./Pages/KreiranjeVestiPage";
import { Route, Routes } from "react-router-dom";
import PocetnaPage from "./Pages/PocetnaPage";
import InformacijeOIgracuPage from "./Pages/InformacijeOIgracuPage";
import LoginPage from "./Pages/LoginPage";
import PregledVestiPage from "./Pages/PregledVestiPage";
import Navigacija from "./Components/NavigacijaComponents/Navigacija";
import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Helpers/Firebase";
import SemaforPage from "./Pages/SemaforPage";
import NotFoundPage from "./Pages/NotFoundPage";

function App() {
  const [user, setUser] = useState(null);
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return (
    <div>
      <Navigacija user={user} />
      <Routes>
        <Route
          path="/informacijeOEkipi/:idTakmicenja/:idEkipe"
          element={<InformacijeOEkipiPage />}
        />
        <Route
          path="/informacijeOIgracu/:idTakmicenja/:idEkipe/:idIgraca"
          element={<InformacijeOIgracuPage />}
        />
        <Route path="/raspored/:idTakmicenja" element={<RasporedPage user = {user}/>} />
        <Route path="/statistika/:idTakmicenja" element={<StatistikaPage />} />
        <Route path="/tabela/:idTakmicenja" element={<TabelaPage />} />
        <Route
          path="/pregledZapisnika/:idTakmicenja/:idKola/:idUtakmice"
          element={<PregledZapisnikaPage />}
        />
        <Route
          path="/kreiranjeZapisnika/:idTakmicenja/:idKola/:idUtakmice"
          element={<KreiranjeZapisnikaPage user={user}/>}
        />
        <Route path="/kreiranjeVesti" element={<KreiranjeVestiPage />} />
        <Route path="/pregledVesti/:idVesti" element={<PregledVestiPage />} />
        <Route
          path="/kreiranjeTakmicenja"
          element={<KreiranjeTakmicenjaPage />}
        />
        <Route path="/pocetna" element={<PocetnaPage user={user} />} />
        <Route path="/" element={<PocetnaPage user={user} />} />
        <Route
          path="/login"
          element={<LoginPage user={user}/>}
        />
        <Route path="/semafor" element= {<SemaforPage />} />

        
        <Route path="*" element = {<NotFoundPage/>} />
      </Routes>
    </div>
  );
}

export default App;
