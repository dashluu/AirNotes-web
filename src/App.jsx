import {auth} from "./firebase.js";
import "./App.css"
import {useEffect, useState} from "react";
import {onAuthStateChanged, signOut} from "firebase/auth";

function App() {
    const [getStatus, setStatus] = useState("");

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setStatus(user ? `${user.email} is signed in` : "Signed out");
        });
    }, [getStatus]);

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
