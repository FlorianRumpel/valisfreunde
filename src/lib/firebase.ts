// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfr2xJ-ACA_oWaElXQdLQlSIhlfJ3FHZA",
  authDomain: "valisfreunde.firebaseapp.com",
  projectId: "valisfreunde",
  storageBucket: "valisfreunde.firebasestorage.app",
  messagingSenderId: "1038908450526",
  appId: "1:1038908450526:web:4a0a8abfc409a4904a844f",
  measurementId: "G-TW1DHW7HWM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);
