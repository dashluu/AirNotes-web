import {auth, paths} from "../backend.js";
import {onAuthStateChanged} from "firebase/auth";
import {useEffect, useState} from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";

function AppRouter() {
    const location = useLocation();
    const [getRender, setRender] = useState(null);

    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            if (user) {
                if (location.pathname === paths.signIn || location.pathname === paths.signUp) {
                    setRender(<Navigate to="/"></Navigate>);
                } else {
                    setRender(<Outlet/>);
                }
            } else {
                if (location.pathname === paths.signIn || location.pathname === paths.signUp) {
                    setRender(<Outlet/>);
                } else {
                    setRender(<Navigate to={paths.signIn} state={{target: location.pathname}}></Navigate>);
                }
            }
        });

        return () => {
            unsubUser();
        };
    }, [location]);

    return getRender;
}

export default AppRouter;