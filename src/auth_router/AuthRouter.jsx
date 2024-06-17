import {auth} from "../firebase.js";
import {onAuthStateChanged} from "firebase/auth";
import {useState} from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";

function AuthRouter() {
    const location = useLocation();
    const [getRoute, setRoute] = useState(null);

    let unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setRoute(
                <Outlet/>
            );
        } else {
            setRoute(
                <Navigate to="/sign-in" state={{target: location.pathname}}></Navigate>
            );
        }
    });

    unsubscribe();
    return getRoute;
}

export default AuthRouter;