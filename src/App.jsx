import {auth} from "./firebase.js";
import "./App.css"
import {useState} from "react";
import {onAuthStateChanged} from "firebase/auth";

function App() {
    const [getStatus, setStatus] = useState("");
    onAuthStateChanged(auth, (user) => {
        setStatus(user ? `${user.email} is signed in` : "Signed out");
    });

    return (
        <>
            <div>{getStatus}</div>
            <button onClick={() => {
                signOut(auth);
            }}>
                Sign out
            </button>
        </>
    );
}

export default App;
