import {Navigate, useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {onAuthStateChanged, verifyPasswordResetCode, checkActionCode} from "firebase/auth";
import {auth, paths} from "../backend.js";

function AuthActionRouter() {
    const navigate = useNavigate();
    const [getSearchParams, setGetSearchParams] = useSearchParams();
    const [getRender, setRender] = useState(null);

    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            if (user) {
                const mode = getSearchParams.get("mode");
                const code = getSearchParams.get("oobCode");

                // Check for action and code
                if (!mode || !code) {
                    navigate(paths.error);
                }

                if (mode === "resetPassword") {
                    verifyPasswordResetCode(auth, code).then(() => {
                        setRender(<Navigate to={`${paths.passwordReset}?mode=${mode}&oobCode=${code}`}></Navigate>);
                    }).catch(() => {
                        navigate(paths.error);
                    });
                } else if (mode === "verifyEmail") {
                    checkActionCode(auth, code).then(() => {
                        setRender(<Navigate to={paths.emailReset}></Navigate>);
                    }).catch(() => {
                        navigate(paths.error);
                    });
                }
            } else {
                setRender(<Navigate to={paths.signIn} state={{target: location.pathname}}></Navigate>);
            }
        });

        return () => {
            unsubUser();
        };
    }, [location]);

    return getRender;
}

export default AuthActionRouter;