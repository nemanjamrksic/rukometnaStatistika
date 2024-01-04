import { uploadFile,firebasePut} from "./Firebase";


export const generisiRasporedTimova = async (timovi, nazivTakmicenja) => {
  const timoviOrig = [...timovi];
  const n = timovi.length;
  const ukupnoKola = n - 1;
  const brojUtakmicaPoKolu = n / 2;

  // Kreiraj niz za čuvanje rasporeda
  const raspored = [];

  // Generiši početna kola sa utakmicama kod kuce i u gostima
  for (let kolo = 0; kolo < ukupnoKola; kolo++) {
    const trenutnoKolo = { kolo: kolo + 1, utakmice: [] };

    for (let utakmica = 0; utakmica < brojUtakmicaPoKolu; utakmica++) {
      const domaciTim = timovi[utakmica].nazivEkipe;
      const gostujuciTim = timovi[n - 1 - utakmica].nazivEkipe;

      // Alterniraj domaci i gostujuci tim između kola i u svakom kolu
      if (kolo % 2 === 1) {
        trenutnoKolo.utakmice.push({
          idDomacin: timoviOrig.findIndex(tim => tim.nazivEkipe === gostujuciTim),
          domaciTim: gostujuciTim,
          idGost: timoviOrig.findIndex(tim => tim.nazivEkipe === domaciTim),
          gostujuciTim: domaciTim,
          rezultat: "",
          datum: "",
        });
      } else {
        trenutnoKolo.utakmice.push({
          
          idDomacin: timoviOrig.findIndex(tim => tim.nazivEkipe === domaciTim),
          domaciTim: domaciTim,
          idGost: timoviOrig.findIndex(tim => tim.nazivEkipe === gostujuciTim),
          gostujuciTim: gostujuciTim,
          rezultat: "",
          datum: "",
        });
      }
    }

    raspored.push(trenutnoKolo);

    // Rotiraj timove (osim prvog) za sledece kolo
    timovi.splice(1, 0, timovi.pop());
  }

  // Generiši drugu polovinu sezone sa obrnutim domacinom i gostom
  const drugaPolovinaRasporeda = raspored.map((kolo) => {
    const obrnuteUtakmice = kolo.utakmice.map((utakmica) => ({
      idDomacin: utakmica.idGost,
      idGost: utakmica.idDomacin,
      domaciTim: utakmica.gostujuciTim,
      gostujuciTim: utakmica.domaciTim,
      rezultat: "",
      datum: "",
    }));
    return { kolo: kolo.kolo + ukupnoKola, utakmice: obrnuteUtakmice };
  });

  // Kombinuj rasporede (prva i druga polovina sezone)
  const celosezonskiRaspored = raspored.concat(drugaPolovinaRasporeda);
  const brojSezone =
    new Date().getFullYear() + "/" + (new Date().getFullYear() + 1);
  const listaEkipa = await Promise.all(timovi.map(async (tim) => {
    return {
      grb: await uploadFile(tim.grb, "grbovi"),
      nazivEkipe: tim.nazivEkipe,
      ukupnoOdigranih: 0,
      pobeda: 0,
      neresenih: 0,
      poraza: 0,
      postignutiGolovi: 0,
      primljeniGolovi: 0,
      golRazlika: 0,
      bodovi: 0,
      listaIgraca: tim.listaIgraca.map((igrac) => {
        return {
          imeIgraca: igrac.imeIgraca,
          brojLicence: igrac.brojLicence,
          brojGolova: 0,
          brojOpomena: 0,
          brojIskljucenja: 0,
          brojDisk: 0,
          brojMVP: 0
        };
      }),
    };
  }));
  const takmicenje = {
    nazivTakmicenja: nazivTakmicenja,
    sezonaTakmicenja: brojSezone,
    idTakmicenja: (nazivTakmicenja + brojSezone.replace("/","_")).replace(/\s/g, ''),
    raspored: celosezonskiRaspored,
    listaEkipa: listaEkipa
  };
  
  firebasePut(takmicenje, "takmicenja", (nazivTakmicenja + brojSezone.replace("/","_")).replace(/\s/g, ''));
  return takmicenje.idTakmicenja
  
};
