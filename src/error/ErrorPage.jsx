import "./ErrorPage.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useNavigate} from "react-router-dom";

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div id="error-page">
            <NavBar/>
            <div className="error-container">
                <div className="error-title">Page not found</div>
                <p className="error-message">Sorry, an unexpected error has occurred</p>
                <div className="error-button-container">
                    <button className="error-button" onClick={() => navigate("/")}>
                        <span className="material-symbols-outlined">home</span>
                        <span>Go to Home</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ErrorPage;