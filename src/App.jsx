import {auth} from "./firebase.js";
import './App.css'

function App() {
    const user = auth.currentUser;
    const status = user ? "Logged in" : "Logged out";

    return (
        <>
            {status}
        </>
    )
}

export default App
