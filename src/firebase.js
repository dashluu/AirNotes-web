// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import DocumentDAO from "./editor/DocumentDAO.jsx";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBODpuLlV3GWKdyJ_1X_jej8XHrpOxc9yk",
    authDomain: "airnotes-8ae79.firebaseapp.com",
    projectId: "airnotes-8ae79",
    storageBucket: "airnotes-8ae79.appspot.com",
    messagingSenderId: "299917069191",
    appId: "1:299917069191:web:b351022b48a0e75e956122",
    measurementId: "G-5NJH6JTEN4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const documentDAO = new DocumentDAO();