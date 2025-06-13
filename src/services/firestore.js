// src/services/firestore.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // o "../../../firebase" si no usas alias

export async function getMatriculaData() {
  const snapshot = await getDocs(collection(db, "pruebas2"));
  const docs = [];
  snapshot.forEach((doc) => docs.push(doc.data()));
  return docs;
}
