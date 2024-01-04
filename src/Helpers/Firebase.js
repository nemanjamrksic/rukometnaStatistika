import { initializeApp } from "firebase/app";
import { getStorage,  ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBsAlza_cjCw_c2A_5Ti41w2t3ttUpSsiU",
  authDomain: "diplomskibaza-a7bcb.firebaseapp.com",
  databaseURL:
    "https://diplomskibaza-a7bcb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "diplomskibaza-a7bcb",
  storageBucket: "diplomskibaza-a7bcb.appspot.com",
  messagingSenderId: "997805160602",
  appId: "1:997805160602:web:c9b92a6f16dd56fc5a8723",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export const auth = getAuth(app);
export const uploadFile = async (imageUpload, folder) => {
  if (imageUpload == null) return Promise.resolve(null);

  const imageRef = ref(storage, `${folder}/${imageUpload.name + v4()}`);

  return uploadBytes(imageRef, imageUpload).then((snapshot) => {
    return getDownloadURL(snapshot.ref);
  });
};
export async function firebaseUpload(content, directory) {
  const response = await fetch(
    `https://diplomskibaza-a7bcb-default-rtdb.europe-west1.firebasedatabase.app/${directory}.json`,
    {
      method: "POST",
      body: JSON.stringify(content),
    }
  );
  const data = await response.json();
  console.log(data);
}
export async function firebasePut(content, directory, id) {
  const response = await fetch(
    `https://diplomskibaza-a7bcb-default-rtdb.europe-west1.firebasedatabase.app/${directory}/${id}.json`,
    {
      method: "PUT",
      body: JSON.stringify(content),
    }
  );
  const data = await response.json();
  console.log(data);
}
export async function firebaseGet(
  directory,
) {
  try {
    const response = await fetch(
      `https://diplomskibaza-a7bcb-default-rtdb.europe-west1.firebasedatabase.app/${directory}.json`
    );
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function firebasePatch (content, directory){
  const response = await fetch(
    `https://diplomskibaza-a7bcb-default-rtdb.europe-west1.firebasedatabase.app/${directory}.json`,
    {
      method: "PATCH",
      body: JSON.stringify(content),
    }
  );
  const data = await response.json();
  console.log(data);
}