import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração do Firebase
// SUBSTITUA COM SUAS CHAVES REAIS
const firebaseConfig = {
  apiKey: "AIzaSyDy1yLkZxrSdwQVyIJ5bB4nw6uNP-qaWMU",
  authDomain: "holy-fit-f7242.firebaseapp.com",
  projectId: "holy-fit-f7242",
  storageBucket: "holy-fit-f7242.firebasestorage.app",
  messagingSenderId: "369449787566",
  appId: "1:369449787566:web:141724d41ee17f08ab0d3f",
  measurementId: "G-XN7Z0R22TK"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
