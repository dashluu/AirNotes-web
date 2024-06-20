import {auth} from "../firebase.js";
import {onAuthStateChanged} from "firebase/auth";
import {useEffect, useState} from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";

function AppRouter() {
    const location = useLocation();
    const [getRender, setRender] = useState(null);

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            if (user) {
                if (location.pathname === "/sign-in" || location.pathname === "/sign-up") {
                    setRender(<Navigate to="/"></Navigate>);
                } else {
                    setRender(<Outlet/>);
                }
            } else {
                if (location.pathname === "/sign-in" || location.pathname === "/sign-up") {
                    setRender(<Outlet/>);
                } else {
                    setRender(<Navigate to="/sign-in" state={{target: location.pathname}}></Navigate>);
                }
            }
        });
    }, [location]);

    return getRender;
}

export default AppRouter;